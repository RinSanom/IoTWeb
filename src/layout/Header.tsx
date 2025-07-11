"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const NAV_LINKS = [
  { name: "Air Quality", href: "/air-quality" },
  { name: "About Us", href: "#" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });

    // Check for saved dark mode preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg`}
      data-aos="fade-down"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo and Title */}
          <div
            className="flex items-center gap-2 sm:gap-3"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full blur-lg transition-all duration-300"></div>
                <Image
                  src="/icons/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110 sm:w-10 sm:h-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-bold transition-colors duration-300 text-gray-600 dark:text-gray-200">
                  Air Pollution
                </span>
                <span className="text-[10px] sm:text-xs transition-colors duration-300 text-gray-600 dark:text-gray-400 hidden xs:block">
                  Monitor & Protect
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium transition-all duration-300 hover:scale-105 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 bg-white/10 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              data-aos="fade-left"
              data-aos-delay="250"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* CTA Button */}
            <div
              className="hidden md:block"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <Link
                href="/"
                className="relative inline-flex items-center gap-2 bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 text-white dark:text-white px-4 lg:px-6 py-2 lg:py-3 text-xs lg:text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden rounded-lg"
              >
                <span className="relative z-10">Join With Us</span>
                <svg
                  className="w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary dark:from-primary/40 dark:to-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 bg-white/10 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-white"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${
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
          <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
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
            <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 sm:space-y-4">
              {/* Dark Mode Toggle for Mobile */}
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base"
              >
                <span>Dark Mode</span>
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </div>
              </button>
              
              <Link
                href="/"
                className="block w-full text-center bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Join With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
            
