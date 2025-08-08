const crypto = require('node:crypto');

class AuthService {
  static generateMfaCode(randomFn = crypto.randomInt) {
    return randomFn(100000, 1000000).toString();
  }
}

module.exports = { AuthService };
