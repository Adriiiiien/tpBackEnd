const crypto = require('crypto');

function generateResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min
  return { token, expiresAt };
}

module.exports = generateResetToken;