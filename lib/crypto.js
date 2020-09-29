const crypto = require('crypto');

const password = 'FnJL7EDzjqWjcaY9';

const iv = 'FnJL7EDzjqWjcaY9';

const handleCipher = (content) => {

  const cipher = crypto.createCipheriv('aes-128-cbc', password, iv);

  let encrypted = '';

  encrypted += cipher.update(content, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  return encrypted;
}

const handleDecipher = (content) => {
  let decrypted = '';

  const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);

  decrypted += decipher.update(content, 'hex', 'utf8');

  decrypted += decipher.final('utf8');

  return decrypted;
}

exports.handleCipher = handleCipher;

exports.handleDecipher = handleDecipher;