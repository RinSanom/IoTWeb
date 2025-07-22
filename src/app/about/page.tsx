"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Image from "next/image";
import {
  Users,
  Cpu,
  Activity,
  Zap,
  Shield,
  Target,
  Globe,
  Award,
  Github,
  Send,
} from "lucide-react";

export default function AboutUsPage() {
  useEffect(() => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });
  }, []);

  const sensors = [
    {
      name: "GeeekPi Raspberry Pi 4 PoE HAT",
      description: "Power over Ethernet HAT providing stable power and network connectivity",
      image: "/image/device/rasbery.png",
      specs: ["IEEE 802.3af compliant", "25.5W power output", "Cooling fan included"],
      category: "Computing Platform"
    },
    {
      name: "ZH07 ZH06 PM2.5 Sensor",
      description: "High-precision particulate matter sensor for PM2.5 and PM10 detection",
      image: "/image/device/hz07.png",
      specs: ["0.3-10μm particle detection", "UART/PWM output", "3-second response time"],
      category: "Particulate Matter"
    },
    {
      name: "NDIR CO2 Sensor Module",
      description: "Non-dispersive infrared CO2 sensor for accurate carbon dioxide monitoring",
      image: "/image/device/mhz19.png",
      specs: ["400-5000ppm range", "±50ppm accuracy", "NDIR technology"],
      category: "Gas Detection"
    },
    {
      name: "ZE08-CH2O Formaldehyde Sensor",
      description: "Electrochemical sensor for formaldehyde detection and monitoring",
      image: "/image/device/ze08.png",
      specs: ["0-5ppm detection range", "High sensitivity", "Long lifespan"],
      category: "Chemical Detection"
    },
    {
      name: "Winsen ZCE04B 4-in-1 Sensor",
      description: "Multi-gas sensor detecting CO, NO2, SO2, and O3 simultaneously",
      image: "/image/device/ze04b.png",
      specs: ["4 gas detection", "Electrochemical principle", "High accuracy"],
      category: "Multi-Gas Detection"
    },
    {
      name: "ZP07-MP503-4VOC Sensor",
      description: "Volatile organic compounds sensor for indoor air quality monitoring",
      image: "/image/device/zpo7.png",
      specs: ["VOC detection", "Digital output", "Real-time monitoring"],
      category: "VOC Detection"
    }
  ];
  const teamMembers = [
    { role: "Project Leader", name: "Yann Vanneth", specialty: "IoT Systems", photo: "/image/team/neth.jpg", bio: "Leading innovative IoT solutions for environmental monitoring", github: "https://github.com/YannVanneth", telegram: "#" },
    { role: "Hardware Engineer", name: "Heng Sivkim", specialty: "Sensor Integration", photo: "/image/team/kim.png", bio: "Expert in precision sensor calibration and hardware optimization", github: "https://github.com/SivkimHENG", telegram: "#" },
    { role: "Software Developer", name: "Rin Sanom", specialty: "Web Applications",  photo: "/image/team/nom.jpg", bio: "Full-stack developer passionate about clean, efficient code", github: "https://github.com/rinsanom", telegram: "#" },
    { role: "Data Scientist", name: "Mach Mol", specialty: "Environmental Data", photo: "/image/team/mol.JPG", bio: "Transforming complex environmental data into actionable insights", github: "https://github.com/MachMol27", telegram: "#" },
    { role: "Environmental Scientist", name: "Mon Sreynet", specialty: "Air Quality", photo: "/image/team/net.png", bio: "Environmental advocate with deep expertise in air quality research", github: "https://github.com/sreynetmon", telegram: "#" },
    { role: "Network Engineer", name: "Yeang Hongmeng", specialty: "IoT Networks", photo: "/image/team/hongmeng.png", bio: "Ensuring reliable connectivity for our monitoring infrastructure", github: "#", telegram: "#" },
    { role: "UI/UX Designer", name: "Vit Socheata", specialty: "User Experience", photo: "/image/team/cheata.png", bio: "Creating intuitive interfaces that make data accessible to everyone", github: "https://github.com/socheatavit", telegram: "#" },
    { role: "DevOps Engineer", name: "Lonh Raksmey", specialty: "Cloud Deployment", photo: "/image/team/raksmey.png", bio: "Building robust, scalable infrastructure for real-time monitoring", github: "https://github.com/stupiqqsmey", telegram: "#" },
    { role: "Quality Assurance", name: "Chan Vanarith", specialty: "Testing & Validation", photo: "/image/team/vanrith.png", bio: "Ensuring our systems deliver accurate, reliable environmental data", github: "#", telegram: "#" },
    { role: "Research Assistant", name: "Moung Meyneang ", specialty: "Academic Research", photo: "/image/team/meyneang.png", bio: "Bridging academic research with practical environmental solutions", github: "https://github.com/meyneangmoung", telegram: "#" }
  ];

  const features = [
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-Time Monitoring",
      description: "Continuous air quality monitoring with instant data updates and alerts"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "IoT Connectivity",
      description: "Advanced IoT infrastructure with MQTT protocol for reliable data transmission"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Multi-Parameter Detection",
      description: "Comprehensive monitoring of PM2.5, CO2, formaldehyde, VOCs, and multiple gases"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Precision Accuracy",
      description: "High-precision sensors with calibrated measurements for reliable data"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-28 sm:pt-36">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
      <div className="absolute top-10 right-10 w-20 sm:w-32 h-20 sm:h-32 bg-primary/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-16 sm:w-24 h-16 sm:h-24 bg-secondary/10 rounded-full blur-xl"></div>

      <div className="relative container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-16" data-aos="fade-up">
          <div className="flex justify-center mb-6">
            {/* <div className="p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80">
              <Heart className="h-12 w-12 text-white" />
            </div> */}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              About Our
            </span>{" "}
            <span className="text-gray-800 dark:text-white">Team</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are a passionate team of Cambodian innovators dedicated to creating an advanced air quality 
            monitoring system that protects our communities and environment through cutting-edge IoT technology.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6" data-aos="zoom-in" data-aos-delay="200">
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6" data-aos="fade-up" data-aos-delay="300">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed" data-aos="fade-up" data-aos-delay="400">
                Born from a shared concern for Cambodia&apos;s environmental challenges, our team combines local knowledge 
                with global technology. We believe that every breath matters, and through precise monitoring and 
                community engagement, we can create lasting change for public health and environmental protection.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" data-aos="fade-up" data-aos-delay="300">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="400">
              Our approach combines human insight with technological precision
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={200 + index * 100}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center">
                  <div className="flex justify-center mb-4" data-aos="zoom-in" data-aos-delay={600 + index * 100}>
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5">
                      <div className="text-primary">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3" data-aos="fade-up" data-aos-delay={700 + index * 100}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay={800 + index * 100}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hardware & Sensors Section */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="300">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" data-aos="fade-up" data-aos-delay="400">
              Our Technology Arsenal
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="500">
              Carefully selected sensors and components that work together to create a comprehensive monitoring solution
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sensors.map((sensor, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={600 + index * 100}>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0" data-aos="zoom-in" data-aos-delay={700 + index * 100}>
                      <Image
                        src={sensor.image}
                        alt={sensor.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white" data-aos="fade-right" data-aos-delay={800 + index * 100}>{sensor.name}</h3>
                        <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20" data-aos="fade-left" data-aos-delay={800 + index * 100}>
                          {sensor.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm" data-aos="fade-up" data-aos-delay={900 + index * 100}>
                        {sensor.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2" data-aos="fade-up" data-aos-delay={1000 + index * 100}>
                    <h4 className="font-semibold text-sm text-gray-800 dark:text-white">Technical Specifications:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {sensor.specs.map((spec, specIndex) => (
                        <li key={specIndex} className="flex items-center gap-2" data-aos="fade-right" data-aos-delay={1100 + index * 100 + specIndex * 50}>
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section - The Heart of Our Project */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="400">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" data-aos="fade-up" data-aos-delay="500">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="600">
              Ten passionate professionals united by a common goal: protecting Cambodia&apos;s air quality for future generations.
            </p>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-8" data-aos="fade-up" data-aos-delay="700">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4" data-aos="zoom-in" data-aos-delay="800">
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5">
                  <Users className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2" data-aos="fade-up" data-aos-delay="900">
                10 Dedicated Professionals
              </h3>
              <p className="text-gray-600 dark:text-gray-300" data-aos="fade-up" data-aos-delay="1000">
                From diverse backgrounds, working as one team with one vision
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} data-aos="fade-up" data-aos-delay={1100 + index * 100}>
                  <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mx-auto mb-4" data-aos="zoom-in" data-aos-delay={1200 + index * 100}>
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1" data-aos="fade-up" data-aos-delay={1300 + index * 100}>
                        {member.name}
                      </h4>
                      <p className="text-xs text-primary font-medium mb-2" data-aos="fade-up" data-aos-delay={1400 + index * 100}>
                        {member.role}
                      </p>
                      <div className="mb-3" data-aos="fade-up" data-aos-delay={1500 + index * 100}>
                        <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                          {member.specialty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed" data-aos="fade-up" data-aos-delay={1600 + index * 100}>
                        {member.bio}
                      </p>
                      <div className="mt-4 flex justify-center space-x-3">
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <Github className="h-5 w-5" />
                        </a>
                        <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <Send className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="500">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4" data-aos="fade-up" data-aos-delay="600">
              Built With Modern Technology
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="700">
              Every component carefully chosen for reliability, performance, and scalability
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6" data-aos="fade-right" data-aos-delay="800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5" data-aos="zoom-in" data-aos-delay="900">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white" data-aos="fade-up" data-aos-delay="1000">Hardware</h3>
              </div>
              <div className="space-y-2" data-aos="fade-up" data-aos-delay="1100">
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">Raspberry Pi 4</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">PoE HAT</span>
                <br />
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">Multi Sensors</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">IoT Module</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6" data-aos="fade-up" data-aos-delay="900">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-green-500/5" data-aos="zoom-in" data-aos-delay="1000">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white" data-aos="fade-up" data-aos-delay="1100">Software</h3>
              </div>
              <div className="space-y-2" data-aos="fade-up" data-aos-delay="1200">
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">Next.js</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">React</span>
                <br />
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">TypeScript</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">Tailwind</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">Python</span>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-6" data-aos="fade-left" data-aos-delay="1000">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-500/5" data-aos="zoom-in" data-aos-delay="1100">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white" data-aos="fade-up" data-aos-delay="1200">Protocols</h3>
              </div>
              <div className="space-y-2" data-aos="fade-up" data-aos-delay="1300">
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">MQTT</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">HTTPS</span>
                <br />
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">WebSocket</span>
                <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full ml-2">REST API</span>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
     
      </div>
    </main>
  );
}
