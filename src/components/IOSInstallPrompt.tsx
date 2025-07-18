"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const isIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    // Check if running in standalone mode
    const isInStandaloneMode = () => ('standalone' in window.navigator) && 
      ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches);

    // Only show prompt on iOS devices not in standalone mode
    if (isIOS() && !isInStandaloneMode()) {
      const hasShownPrompt = localStorage.getItem('iosInstallPromptShown');
      if (!hasShownPrompt) {
        setShowPrompt(true);
        localStorage.setItem('iosInstallPromptShown', 'true');
      }
    }
  }, []);

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Install Air Monitor on your iOS device</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/icons/icon-72x72.png" 
              width={40} 
              height={40} 
              alt="App Icon"
              className="rounded-xl"
            />
            <span className="font-medium">Air Monitor</span>
          </div>
          
          <div className="space-y-4 text-sm">
            <p>To install Air Monitor on your iOS device:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Tap the share button <span className="inline-block w-5 h-5 align-text-bottom">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.367A2.52 2.52 0 0113 4.5z" />
                </svg>
              </span> in Safari's menu bar</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
              <li>Tap <strong>Add</strong> in the upper right corner</li>
            </ol>
          </div>

          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowPrompt(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
