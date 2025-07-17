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
      <OneClickInstall variant="floating" />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-28 sm:pt-36">
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="absolute top-10 right-10 w-20 sm:w-32 h-20 sm:h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-16 sm:w-24 h-16 sm:h-24 bg-secondary/10 rounded-full blur-xl"></div>
          <div className="relative container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <div className="space-y-6 sm:space-y-8" data-aos="fade-right" data-aos-duration="800" data-aos-delay="100">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" data-aos="fade-up" data-aos-delay="200">
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
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg" data-aos="fade-up" data-aos-delay="300">
                    Pollution is nothing but the resources we are not
                    harvesting. We allow them to disperse because we&apos;ve been
                    ignorant of their value.
                  </p>
                </div>

                {/* <div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <OneClickInstall 
                    text="Get the App Now" 
                    className="text-base sm:text-lg px-8 py-4"
                  />
                  <Button 
                    variant="outline" 
                    className="text-base sm:text-lg px-8 py-4 border-2 hover:bg-primary hover:text-white"
                    onClick={async () => {
                      // Mobile-safe notification demo
                      try {
                        if ('serviceWorker' in navigator) {
                          // Check if notifications are available
                          if ('Notification' in window) {
                            // Check current permission without calling constructor
                            const currentPermission = Notification.permission;
                            
                            if (currentPermission === 'granted') {
                              // Show notification using service worker (mobile-safe)
                              const registration = await navigator.serviceWorker.ready;
                              
                              await registration.showNotification('🚨 Air Quality Alert!', {
                                body: 'AQI is 150 (Unhealthy) at RUPP University - Consider staying indoors',
                                icon: '/icons/icon-192x192.png',
                                badge: '/icons/icon-96x96.png',
                                tag: 'air-quality-demo'
                              });
                              
                              alert('✅ Demo notification sent! Check your notifications.');
                              console.log('Demo notification sent successfully!');
                              
                            } else if (currentPermission === 'default') {
                              // Show instructions for manual permission
                              const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                              
                              if (isMobile) {
                                alert('📱 To see notifications:\n\n1. Look for notification icon in your browser\n2. Or go to browser Settings > Site Settings > Notifications\n3. Allow notifications for this site\n4. Then try the demo again');
                              } else {
                                alert('🔔 To see notifications:\n\n1. Look for the notification icon in your address bar\n2. Or check browser Settings > Privacy & Security > Notifications\n3. Allow notifications for this site\n4. Then try the demo again');
                              }
                              
                            } else {
                              // Permission denied
                              alert('❌ Notifications are currently blocked.\n\nTo enable:\n1. Go to browser Settings\n2. Find Notifications or Site Settings\n3. Allow notifications for this site');
                            }
                          } else {
                            alert('❌ Notifications are not supported in this browser');
                          }
                        } else {
                          alert('❌ Service workers are not supported in this browser');
                        }
                      } catch (error) {
                        console.error('Notification demo error:', error);
                        // Always show success message to avoid confusing users
                        alert('✅ Demo completed! If you don\'t see a notification, please check your browser notification settings.');
                      }
                    }}
                  >
                    Try Alert Demo
                  </Button>
                </div> */}

                <div
                  className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm" data-aos="zoom-in" data-aos-delay="600">
                    <div className="text-xl sm:text-2xl font-bold text-primary">7M+</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Deaths Yearly
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm" data-aos="zoom-in" data-aos-delay="700">
                    <div className="text-xl sm:text-2xl font-bold text-primary">91%</div>
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
                  <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden transform" data-aos="zoom-in" data-aos-delay="400">
                    <Image
                      src="/image/image.png"
                      alt="Air Pollution Impact"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-12 sm:w-16 h-12 sm:h-16 bg-primary/20 rounded-full animate-bounce" data-aos="fade-in" data-aos-delay="800"></div>
                <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-8 sm:w-12 h-8 sm:h-12 bg-secondary/20 rounded-full animate-pulse" data-aos="fade-in" data-aos-delay="900"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Air Pollution Impact Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-primary dark:bg-gray-900">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90 dark:from-gray-900 dark:to-gray-800/95"></div>
          <div className="relative container mx-auto max-w-7xl">
            <div className="text-center mb-12 sm:mb-16" data-aos="fade-up" data-aos-duration="800">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-gray-100 mb-4 sm:mb-6" data-aos="fade-up" data-aos-delay="100">
                Air Pollution Affects Multiple Aspects Of Life
              </h2>
              <p className="text-white/90 dark:text-gray-300 text-base sm:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4" data-aos="fade-up" data-aos-delay="200">
                Air pollution harms health, damages the environment, affects the
                economy, and disrupts wildlife.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" data-aos="fade-up" data-aos-delay="300">
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
                  Phnom Penh Fire and Smoke Map
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  This map relies on data provided from a number of sources,
                  including AirNow, the Western Regional Climate Center, AirSis,
                  and PurpleAir for monitoring and sensor data, and the NOAA
                  Hazard Mapping System and National Interagency Fire Center for
                  fire and smoke plume information.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto">
                  Read More
                </Button>
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
              <div
                className=""
                data-aos="fade-up">
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                      <Image
                        src="/image/image_3.png"
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
                    AIR QUALITY IN <span className="text-primary">RUPP</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                    This map relies on data provided from a number of sources,
                    including AirNow, the Western Regional Climate Center,
                    AirSis, and PurpleAir for monitoring and sensor data, and
                    the NOAA Hazard Mapping System and National Interagency Fire
                    Center for fire and smoke plume information.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto">
                    Read More
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-4 sm:space-y-6" data-aos="fade-right">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  WHO WE ARE
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                  This map relies on data provided from a number of sources,
                  including AirNow, the Western Regional Climate Center, AirSis,
                  and PurpleAir for monitoring and sensor data, and the NOAA
                  Hazard Mapping System and National Interagency Fire Center for
                  fire and smoke plume information.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto">
                  Read More
                </Button>
              </div>
              <div
                className="relative mt-8 lg:mt-0"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="">
                  <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                    <Image
                      src="/image/image_2.png"
                      alt="Who We Are - Data Visualization"
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
