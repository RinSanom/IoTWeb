"use client";

import { Button } from "@/components/ui/button";
import ImpactCard from "@/components/ui/impact-card";
import OneClickInstall from "@/components/ui/one-click-install";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { impactData } from "@/data/impact-data";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out-cubic",
      once: true,
      offset: 50,
      delay: 100,
      disable: false,
    });

    // Refresh AOS on route change
    AOS.refresh();
  }, []);

  return (
    <>
      {/* Floating Install Button */}
      {/* <OneClickInstall variant="floating" /> */}

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="absolute top-10 right-4 sm:right-10 w-16 sm:w-20 md:w-32 h-16 sm:h-20 md:h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-4 sm:left-10 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-secondary/10 rounded-full blur-xl"></div>
          <div className="relative container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <div
                className="space-y-6 sm:space-y-8"
                data-aos="fade-right"
                data-aos-duration="800"
                data-aos-delay="100"
              >
                <div className="space-y-4 sm:space-y-6">
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <span className="text-gray-800 dark:text-white">
                      How Air Pollution
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Can Shortens
                    </span>{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Your Life
                    </span>
                  </h1>
                  <p
                    className="text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    Pollution is nothing but the resources we are not
                    harvesting. We allow them to disperse because we&apos;ve
                    been ignorant of their value.
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div
                    className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                    data-aos="zoom-in"
                    data-aos-delay="600"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      7M+
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Deaths Yearly
                    </div>
                  </div>
                  <div
                    className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                    data-aos="zoom-in"
                    data-aos-delay="700"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      91%
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Population Affected
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="relative mt-8 lg:mt-0"
                data-aos="fade-left"
                data-aos-delay="300"
                data-aos-duration="1000"
              >
                <div className="relative aspect-square max-w-sm sm:max-w-md mx-auto lg:max-w-full">
                  <div
                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden transform"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                  >
                    <Image
                      src="/image/hHqA5Pa5KG.gif"
                      alt="Air Pollution Impact"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div
                  className="absolute -top-4 sm:-top-6 -right-2 sm:-right-4 md:-right-6 w-12 sm:w-16 h-12 sm:h-16 bg-primary/20 rounded-full animate-bounce"
                  data-aos="fade-in"
                  data-aos-delay="800"
                ></div>
                <div
                  className="absolute -bottom-4 sm:-bottom-6 -left-2 sm:-left-4 md:-left-6 w-8 sm:w-12 h-8 sm:h-12 bg-secondary/20 rounded-full animate-pulse"
                  data-aos="fade-in"
                  data-aos-delay="900"
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Air Pollution Impact Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-primary dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90 dark:from-gray-900 dark:to-gray-800/95"></div>
          <div className="relative container mx-auto max-w-7xl">
            <div
              className="text-center mb-12 sm:mb-16"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-4 sm:mb-6"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Air Pollution Affects Multiple Aspects Of Life
              </h2>
              <p
                className="text-white/90 dark:text-gray-300 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Air pollution harms health, damages the environment, affects the
                economy, and disrupts wildlife.
              </p>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              {impactData.map((impact) => (
                <ImpactCard
                  key={impact.title}
                  title={impact.title}
                  description={impact.description}
                  icon={impact.icon}
                  delay={impact.delay}
                />
              ))}
            </div>

            {/* Call to Action */}
            <div
              className="text-center mt-12 sm:mt-16"
              data-aos="fade-up"
              data-aos-delay="500"
            ></div>
          </div>
        </section>
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Why We Make Air Pollution?
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20 items-center">
              <div className="space-y-4 sm:space-y-6" data-aos="fade-right">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Phnom Penh Air Quality Monitoring
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  Our comprehensive monitoring system tracks air quality in
                  real-time across Phnom Penh, Cambodia's capital city. We
                  integrate data from multiple IoT sensors, satellite imagery,
                  and environmental monitoring stations to provide accurate air
                  pollution measurements.
                </p>
              </div>
              <div className="relative mt-8 lg:mt-0" data-aos="fade-left">
                <div className="">
                  <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                    <Image
                      src="/image/image_1.png"
                      alt="Phnom Penh Fire and Smoke Map"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Story and Air Quality Grid */}
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 mb-16 sm:mb-20">
              {/* Story Section */}
              <div className="" data-aos="fade-up">
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                      <Image
                        src="/image/image_2.png"
                        alt="Story - Bakersfield"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-4 sm:p-6 lg:p-8"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    AIR QUALITY AT{" "}
                    <span className="text-primary">RUPP UNIVERSITY</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                    Our IoT-based monitoring system at RUPP University campus
                    provides real-time air quality data for the academic
                    community. With sensors strategically placed across the
                    campus, we track PM2.5, PM10, CO2, and other pollutants to
                    ensure a healthy learning environment for students and
                    faculty.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-green-700 dark:text-green-400">
                          Good AQI
                        </span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                        Current: 45 AQI
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                          Live Sensors
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                        8 Active Stations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6" data-aos="fade-right">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  OUR <span className="text-primary">MISSION</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  We are a dedicated team of environmental engineers, IoT
                  specialists, and data scientists committed to combating air
                  pollution through innovative technology. Our mission is to
                  provide accurate, real-time air quality data to protect public
                  health and raise awareness about environmental issues in
                  Cambodia.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        24/7
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Monitoring
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">
                        6+
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      IoT Sensors
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        1M+
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Data Points
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/10">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Our Vision:</strong> Creating a cleaner, healthier
                    Cambodia through technology-driven environmental monitoring
                    and community education initiatives.
                  </p>
                </div>
                {/* <Button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto">
                  Learn More About Us
                </Button> */}
              </div>
              <div
                className="relative mt-8 lg:mt-0"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="">
                  <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                    <Image
                      src="/image/image_3.png"
                      alt="Our Team - Environmental Data Analysis"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
