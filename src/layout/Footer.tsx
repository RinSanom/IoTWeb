"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Heart,
  Cpu,
  Activity,
  Shield,
  Users,
  Target,
  Zap,
  Cloud,
  Wind,
  Gauge
} from "lucide-react";

export default function Footer() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });
  }, []);

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Air Quality Dashboard", href: "/air-quality" },
    { name: "Real-time Data", href: "/air-quality" },
    { name: "About Our Team", href: "/about" },
    { name: "Technology", href: "/about" },
  ];

  const sensors = [
    { name: "PM2.5 Sensor", icon: <Cloud className="h-4 w-4" /> },
    { name: "CO2 Monitor", icon: <Wind className="h-4 w-4" /> },
    { name: "VOC Detector", icon: <Activity className="h-4 w-4" /> },
    { name: "Multi-Gas Sensor", icon: <Gauge className="h-4 w-4" /> },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, href: "#" },
  ];

  const teamHighlights = [
    { count: "10", label: "Team Members" },
    { count: "6+", label: "Sensor Types" },
    { count: "24/7", label: "Monitoring" },
    { count: "100%", label: "Dedicated" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
     
      
      <div className="relative container mx-auto px-4 py-12 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-primary/80">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Air Quality Monitor
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Protecting Cambodia's Air
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We are a passionate team of Cambodian innovators dedicated to creating advanced 
              air quality monitoring systems that protect our communities through cutting-edge IoT technology.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Phnom Penh, Cambodia</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">airquality@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+855 (0) 987654321</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-300 text-sm flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="pt-4">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Our Mission</h5>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                Every breath matters. Through precise monitoring and community engagement, 
                we create lasting change for public health and environmental protection.
              </p>
            </div>
          </div>

          {/* Technology & Sensors */}
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="300">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              Our Technology
            </h4>
            
            <div className="space-y-3">
              {sensors.map((sensor, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <div className="text-primary">
                      {sensor.icon}
                    </div>
                  </div>
                  <span className="text-sm">{sensor.name}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 space-y-2">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Powered By</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                  Raspberry Pi 4
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                  Next.js
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                  MQTT
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                  IoT
                </span>
              </div>
            </div>
          </div>

          {/* Team & Social */}
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="400">
            <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Our Team
            </h4>
            
            {/* Team Stats */}
            <div className="grid grid-cols-2 gap-3">
              {teamHighlights.map((stat, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-bold text-primary">{stat.count}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-white">Connect With Us</h5>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 dark:text-gray-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 mb-8" data-aos="fade-up" data-aos-delay="500"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4" data-aos="fade-up" data-aos-delay="600">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <span className="text-sm">
              © {currentYear} Air Quality Monitor Cambodia. 
            </span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm">
              Built with love for cleaner air.
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
            <Link href="#" className="hover:text-primary transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors duration-300">
              About Us
            </Link>
          </div>
        </div>

        {/* Environmental Message */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700" data-aos="fade-up" data-aos-delay="700">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-gray-800 dark:text-white font-medium">
                Monitoring today for a cleaner tomorrow
              </span>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
              Real-time air quality data • Environmental protection • Community health • Data-driven solutions
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
