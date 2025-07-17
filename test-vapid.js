// Test VAPID Key Validation
// Run this in browser console to test the VAPID key

(function testVAPIDKey() {
  const VAPID_PUBLIC_KEY = 'BB4iCbS53b7COBOQniz27IWOWj3juVPWFmbSz48LOAvKscI7lpy2dPFMJcdBTEzPegsQLP8L2ueFC_yBuHQPy94';
  
  function urlBase64ToUint8Array(base64String) {
    try {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (error) {
      console.error('Error converting VAPID key:', error);
      return null;
    }
  }

  console.log('=== VAPID Key Test ===');
  console.log('Key length:', VAPID_PUBLIC_KEY.length);
  console.log('Key format valid:', /^[A-Za-z0-9_-]+$/.test(VAPID_PUBLIC_KEY));
  
  const vapidArray = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  if (vapidArray) {
    console.log('Conversion successful!');
    console.log('Array length:', vapidArray.length);
    console.log('First few bytes:', Array.from(vapidArray.slice(0, 5)));
  } else {
    console.error('Conversion failed!');
  }
  
  console.log('=== Test Complete ===');
})();
