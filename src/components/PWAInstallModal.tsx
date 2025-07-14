"use client";

import { useState } from 'react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceType: 'ios' | 'android' | 'desktop';
}

export function PWAInstallModal({ isOpen, onClose, deviceType }: PWAInstallModalProps) {
  if (!isOpen) return null;

  const getInstructions = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: 'Install Air Monitor PWA',
          subtitle: 'To install this PWA on your iPhone:',
          steps: [
            { icon: '⬆️', text: 'Tap the Share button' },
            { icon: '📱', text: 'Select "Add to Home Screen"' },
            { icon: '✅', text: 'The app will work like a native app' }
          ]
        };
      case 'android':
        return {
          title: 'Install Air Monitor PWA',
          subtitle: 'To install this PWA on Android:',
          steps: [
            { icon: '⋮', text: 'Tap the menu (three dots)' },
            { icon: '📱', text: 'Select "Add to Home screen"' },
            { icon: '🚀', text: 'Open as standalone app' }
          ]
        };
      default:
        return {
          title: 'Install Air Monitor PWA',
          subtitle: 'To install this PWA on Desktop:',
          steps: [
            { icon: '⬇️', text: 'Click install icon in address bar' },
            { icon: '📱', text: 'Or use browser menu "Install"' },
            { icon: '🖥️', text: 'Access as desktop app' }
          ]
        };
    }
  };

  const instructions = getInstructions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 text-center">
          <div className="text-4xl mb-2">📱</div>
          <h2 className="text-xl font-bold text-white">{instructions.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {instructions.subtitle}
          </p>

          <div className="space-y-4 mb-6">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl">{step.icon}</div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}. {step.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Benefits:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Works offline</li>
              <li>• No browser address bar</li>
              <li>• Native app experience</li>
              <li>• Direct access from home screen</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
