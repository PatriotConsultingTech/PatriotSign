import { smtpenable, updateMailCount } from '../../Utils.js';
import { escapeHtml, renderEmailHeading, resolveBrandContext } from '../../utils/brandContext.js';
import { issueOtp } from './otp.js';
async function getDocument(docId) {
  try {
    const query = new Parse.Query('contracts_Document');
    query.equalTo('objectId', docId);
    query.include('ExtUserPtr');
    query.include('CreatedBy');
    query.include('Signers');
    query.include('AuditTrail.UserPtr');
    query.include('ExtUserPtr.TenantId');
    query.include('Placeholders');
    query.notEqualTo('IsArchive', true);
    const res = await query.first({ useMasterKey: true });
    const _res = res?.toJSON();
    return _res?.ExtUserPtr;
  } catch (err) {
    console.log('err ', err);
  }
}
async function sendMailOTPv1(request) {
  try {
    const email = request.params.email;
    const TenantId = request.params.TenantId ? request.params.TenantId : undefined;
    const documentOwner = request.params?.docId
      ? await getDocument(request.params.docId)
      : undefined;
    const brand = resolveBrandContext({});
    const AppName = brand.productName;

    if (typeof email === 'string' && email) {
      const code = await issueOtp(email, TenantId);
      if (code === null) {
        // No new code: one was emailed moments ago, or the email is paused after wrong guesses.
        return 'Otp send';
      }
      const recipient = request.params.email;
      const mailsender = smtpenable ? process.env.SMTP_USER_EMAIL : process.env.MAILGUN_SENDER;
      try {
        await Parse.Cloud.sendEmail({
          sender: brand.senderName + ' <' + mailsender + '>',
          recipient: recipient,
          subject: `Your ${AppName} OTP`,
          text: 'otp email',
          html:
            `<html><head><meta http-equiv='Content-Type' content='text/html;charset=UTF-8' /></head><body><div style='background-color:#f5f5f5;padding:20px'><div style='background-color:white;'>${renderEmailHeading(brand, 'OTP Verification')}<div style='padding:20px;'><p style='font-family:system-ui;font-size:14px;'>Your OTP for ${escapeHtml(AppName)} verification is:</p><p style='text-decoration:none;font-weight:bolder;color:blue;font-size:45px;margin:20px;'>` +
            code +
            '</p></div></div></div></body></html>',
        });
        if (documentOwner?.objectId) {
          updateMailCount(documentOwner.objectId);
        }
      } catch (err) {
        console.log('error in send OTP mail', err);
      }
      return 'Otp send';
    } else {
      return 'Please Enter valid email';
    }
  } catch (err) {
    console.log('err in sendMailOTPv1');
    console.log(err);
    return err;
  }
}
export default sendMailOTPv1;
