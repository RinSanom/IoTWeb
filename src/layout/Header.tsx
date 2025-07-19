"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import PWAInstallButton from "@/components/ui/pwa-install-button";
import AuthModal from "@/components/auth/AuthModal";
import UserProfile from "@/components/auth/UserProfile";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";
import { useAuthInit } from "@/hooks/useAuthInit";
import { usePWABanner } from "@/contexts/PWABannerContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const NAV_LINKS = [
  { name: "Air Quality", href: "/air-quality" },
  { name: "About Us", href: "/about" },
  { name: "Settings", href: "/settings" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { isBannerVisible, bannerHeight } = usePWABanner();
  
  // Initialize auth state
  useAuthInit();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });

  }, []);


  return (
    <>
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-300
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg`}
        style={{ 
          top: isBannerVisible ? `${bannerHeight}px` : '0px' 
        }}
        data-aos="fade-down"
      >
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 overflow-hidden">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between w-full">
          {/* Logo and Title */}
          <div
            className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-0 flex-shrink-0"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <Link href="/" className="flex items-center gap-1 sm:gap-2 lg:gap-3 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-lg transition-all duration-300"></div>
                <Image
                  src="/icons/logo.png"
                  alt="Logo"
                  width={30}
                  height={30}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110 sm:w-10 sm:h-10 lg:w-12 lg:h-12 dark:hidden"
                />
                <Image
                  src="/icons/logo-dark.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110 sm:w-10 sm:h-10 lg:w-12 lg:h-12 hidden dark:block"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base lg:text-xl font-bold transition-colors duration-300 text-gray-600 dark:text-gray-200 truncate">
                  Air Pollution
                </span>
                <span className="text-[9px] sm:text-[10px] lg:text-xs transition-colors duration-300 text-gray-600 dark:text-gray-400 hidden sm:block truncate">
                  Monitor & Protect
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-6"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary group whitespace-nowrap"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            {/* PWA Install Button */}
            <div
              className="hidden sm:block"
              data-aos="fade-left"
              data-aos-delay="250"
            >
              <PWAInstallButton variant="minimal" />
            </div>

            {/* Authentication - Desktop */}
            <div
              className="hidden lg:block"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <AuthModal>
                  <Button variant="outline" className="bg-white/10 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    Join with us
                  </Button>
                </AuthModal>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <ThemeSwitcher />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-105 bg-white/10 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-white flex-shrink-0"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-45" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Navigation Links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Menu Actions */}
            <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-4">
              {/* PWA Install Button for Mobile */}
              <div className="w-full">
                <PWAInstallButton className="w-full justify-center" />
              </div>
              
              {/* Authentication for Mobile */}
              <div className="w-full">
                {isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <AuthModal>
                    <Button variant="outline" className="w-full">
                      Join with us
                    </Button>
                  </AuthModal>
                )}
              </div>
              {/* Dark Mode Toggle for Mobile */}
              <div className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base">
                <span>Dark Mode</span>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}

