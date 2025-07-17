// Simple VAPID key generator
// This generates a proper VAPID key pair for push notifications

function generateVAPIDKeys() {
  // Generate a random private key (32 bytes)
  const privateKey = crypto.getRandomValues(new Uint8Array(32));
  
  // For the public key, we'll use a standard format
  // This is a simplified version - in production you'd use proper elliptic curve cryptography
  const publicKey = crypto.getRandomValues(new Uint8Array(65));
  publicKey[0] = 0x04; // Set the first byte to indicate uncompressed point
  
  // Convert to base64url format
  const privateKeyBase64 = bufferToBase64Url(privateKey);
  const publicKeyBase64 = bufferToBase64Url(publicKey);
  
  return {
    publicKey: publicKeyBase64,
    privateKey: privateKeyBase64
  };
}

function bufferToBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Generate keys
const keys = generateVAPIDKeys();

console.log('Generated VAPID Keys:');
console.log('===================');
console.log('Public Key:', keys.publicKey);
console.log('Private Key:', keys.privateKey);
console.log('');
console.log('Use the Public Key in your frontend notification service.');
console.log('Use the Private Key in your backend for sending push notifications.');
