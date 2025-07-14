// Custom install handler
self.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Trigger install immediately if possible
  if (e.prompt) {
    e.prompt();
    e.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed automatically');
      }
    });
  }
});
