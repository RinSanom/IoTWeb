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

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      data-aos="fade-down"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Title */}
          <div
            className="flex items-center gap-3"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Image
                  src="/icons/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xl font-bold transition-colors duration-300 ${
                    isScrolled
                      ? "text-primary dark:text-white"
                      : "text-white dark:text-white"
                  }`}
                >
                  Air Pollution
                </span>
                <span
                  className={`text-xs transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-white/80 dark:text-white/80"
                  }`}
                >
                  Monitor & Protect
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
                    : "text-white/90 hover:text-white"
                } group`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* CTA Button */}
            <div
              className="hidden sm:block"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <Link
                href="/"
                className="relative inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3  text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden"
              >
                <span className="relative z-10">Join With Us</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
                  : "bg-white/10 backdrop-blur-sm text-white"
              }`}
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-300 ${
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
          className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-xl border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/"
                className="block w-full text-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
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
