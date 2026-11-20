# Server lint known issues

Remaining ESLint errors from `npm run lint` in apps/OpenSignServer, listed as ESLint reports them. These are not fixed yet.

## Real defects found by lint, not yet fixed

Each line gives file:line, rule, ESLint message, and what happens at runtime if that line executes.

- cloud/parsefunction/AuthLoginAsMail.js:37, no-undef, 'reject' is not defined. Runtime: ReferenceError: reject is not defined, on the `else` branch when `user.save` returns a falsy value (ASSERTED: that branch is rarely or never reached).
- cloud/parsefunction/createBatchDocs.js:280, no-undef, 'generateId' is not defined. Runtime: ReferenceError: generateId is not defined when `type === 'bulksend'` (ASSERTED: call path not traced end to end). `generateId` is exported from Utils.js but not imported here.
- cloud/parsefunction/saveFile.js:39, no-undef, 'fileUrl' is not defined. Runtime: ReferenceError: fileUrl is not defined inside the try block, which is rethrown as Parse.Error 400 with that message, so the save path fails for PDF and image uploads that reach this point.
- cloud/parsefunction/saveFile.js:40, no-undef, 'fileUrl' is not defined. Runtime: unreachable in practice, because line 39 throws first.
- cloud/parsefunction/usersignup.js:8, no-undef, 'normalizeEmail' is not defined. Runtime: ReferenceError: normalizeEmail is not defined whenever saveUser runs.
- cloud/parsefunction/createBatchDocs.js:269, no-dupe-keys, Duplicate key 'SentToOthers'. Runtime: none. Both values are `true`, so the result is the same.

## Dead code (no runtime effect)

- cloud/parsefunction/AuthLoginAsMail.js:43, no-unused-vars, 'request' is defined but never used. Runtime: none.
- cloud/parsefunction/AuthLoginAsMail.js:73, no-unused-vars, 'err' is defined but never used. Runtime: none.
- cloud/parsefunction/createBatchDocs.js:8, no-unused-vars, 'chunkArray' is defined but never used. Runtime: none.
- cloud/parsefunction/createBatchDocs.js:14, no-unused-vars, 'mapWithConcurrency' is defined but never used. Runtime: none.
- cloud/parsefunction/createBatchDocs.js:38, no-unused-vars, 'uuid' is defined but never used. Runtime: none.
- cloud/parsefunction/createBatchDocs.js:45, no-unused-vars, 'sendOwnerSummaryEmail' is defined but never used. Runtime: none (the owner summary email is never sent).
- cloud/parsefunction/createBatchDocs.js:199, no-unused-vars, 'BATCH_LIMIT' is assigned a value but never used. Runtime: none.
- cloud/parsefunction/createBatchDocs.js:200, no-unused-vars, 'DOC_MAIL_CONCURRENCY' is assigned a value but never used. Runtime: none.
- cloud/parsefunction/createBatchDocs.js:208, no-unused-vars, '_resExt' is assigned a value but never used. Runtime: none.
