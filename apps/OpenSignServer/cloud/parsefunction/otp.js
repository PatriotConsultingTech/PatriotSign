import crypto from 'node:crypto';

// Email one-time codes: issue and check, shared by SendOTPMailV1, AuthLoginAsMail and VerifyEmail.
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_WAIT_MS = 30 * 1000;
// Wrong guesses are counted across codes. Too many pause the email for a while.
export const OTP_MAX_FAILURES = 10;
export const OTP_LOCK_MS = 60 * 60 * 1000;

// Parse treats an object in equalTo as a query operator, so only plain strings are accepted.
const isEmail = email => typeof email === 'string' && email.length > 0;
const isLocked = record => record.get('LockedUntil')?.getTime() > Date.now();

async function findOtp(email) {
  const query = new Parse.Query('defaultdata_Otp');
  query.equalTo('Email', email);
  return query.first({ useMasterKey: true });
}

/**
 * Stores a new six-digit code for the email and returns it.
 * Returns null when no new code is issued: one was issued moments ago (it stays valid),
 * or the email is paused after too many wrong guesses.
 */
export async function issueOtp(email, tenantId) {
  if (!isEmail(email)) {
    throw new TypeError('email must be a non-empty string');
  }
  let record = await findOtp(email);
  if (record) {
    const issuedAt = record.get('IssuedAt');
    const issuedMomentsAgo = issuedAt && Date.now() - issuedAt.getTime() < OTP_RESEND_WAIT_MS;
    if (issuedMomentsAgo || isLocked(record)) {
      return null;
    }
  } else {
    record = new Parse.Object('defaultdata_Otp');
    record.set('Email', email);
    if (tenantId) {
      record.set('TenantId', tenantId);
    }
  }
  const code = crypto.randomInt(100000, 1000000);
  const now = Date.now();
  record.set('OTP', code);
  record.set('IssuedAt', new Date(now));
  record.set('ExpiresAt', new Date(now + OTP_TTL_MS));
  record.set('Attempts', 0);
  await record.save(null, { useMasterKey: true });
  return code;
}

/**
 * True only for the current, unexpired code within the attempt limit.
 * A code works once: it is deleted on success.
 */
export async function verifyOtp(email, otp) {
  const code = Number.parseInt(otp, 10);
  if (!isEmail(email) || !Number.isInteger(code)) {
    return false;
  }
  const record = await findOtp(email);
  const expiresAt = record?.get('ExpiresAt');
  // A code stored without an expiry was issued before expiry existed; reject it.
  if (!expiresAt || expiresAt.getTime() < Date.now() || isLocked(record)) {
    return false;
  }
  // Count the attempt before comparing, so parallel guesses cannot skip the limit.
  record.increment('Attempts');
  await record.save(null, { useMasterKey: true });
  if (record.get('Attempts') > OTP_MAX_ATTEMPTS) {
    return false;
  }
  const expected = Buffer.from(String(record.get('OTP')));
  const given = Buffer.from(String(code));
  const matches = expected.length === given.length && crypto.timingSafeEqual(expected, given);
  if (!matches) {
    record.increment('Failures');
    await record.save(null, { useMasterKey: true });
    if (record.get('Failures') >= OTP_MAX_FAILURES) {
      record.set('Failures', 0);
      record.set('LockedUntil', new Date(Date.now() + OTP_LOCK_MS));
      await record.save(null, { useMasterKey: true });
    }
    return false;
  }
  try {
    // Deleting fails if a parallel request already used this code, so only one succeeds.
    await record.destroy({ useMasterKey: true });
  } catch {
    return false;
  }
  return true;
}
