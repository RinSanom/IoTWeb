"use client";

import { Button } from "@/components/ui/button";
import ImpactCard from "@/components/ui/impact-card";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { impactData } from "@/data/impact-data";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary/10 rounded-full blur-xl"></div>
          <div className="relative container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <div className="space-y-8" data-aos="fade-right">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
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
                  <p className="text-gray-600 dark:text-gray-300 text-lg lg:text-xl leading-relaxed max-w-lg">
                    Pollution is nothing but the resources we are not
                    harvesting. We allow them to disperse because we&apos;ve been
                    ignorant of their value.
                  </p>
                </div>

                <div
                  className="flex flex-col sm:flex-row gap-4"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                  >
                    Join With Us
                  </Button>
                </div>

                <div
                  className="grid grid-cols-2 gap-6 pt-8"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">7M+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Deaths Yearly
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                    <div className="text-2xl font-bold text-primary">91%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Population Affected
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="relative"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="relative aspect-square max-w-md mx-auto lg:max-w-full">
                  <div className="relative rounded-3xl overflow-hidden  transform">
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
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/20 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Air Pollution Impact Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-primary">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/90"></div>
          <div className="relative container mx-auto max-w-7xl">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Air Pollution Affects Multiple Aspects Of Life
              </h2>
              <p className="text-white/90 text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed">
                Air pollution harms health, damages the environment, affects the
                economy, and disrupts wildlife.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              className="text-center mt-16"
              data-aos="fade-up"
              data-aos-delay="500"
            ></div>
          </div>
        </section>
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Why We Make Air Pollution?
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Phnom Penh Fire and Smoke Map
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  This map relies on data provided from a number of sources,
                  including AirNow, the Western Regional Climate Center, AirSis,
                  and PurpleAir for monitoring and sensor data, and the NOAA
                  Hazard Mapping System and National Interagency Fire Center for
                  fire and smoke plume information.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 font-semibold rounded-xl">
                  Read More
                </Button>
              </div>
              <div className="relative" data-aos="fade-left">
                <div className="relative bg-white dark:bg-gray-700 rounded-2xl p-6">
                  <div className="aspect-video rounded-xl overflow-hidden">
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
            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {/* Story Section */}
              <div
                className=" dark:bg-gray-700 rounded-2xl p-8 "
                data-aos="fade-up">
                <div className="space-y-6">
                
                  <div className="relative">
                    <div className="aspect-video rounded-xl overflow-hidden">
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
                className=" dark:bg-gray-700 rounded-2xl p-8 "
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    AIR QUALITY IN <span className="text-primary">RUPP</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    This map relies on data provided from a number of sources,
                    including AirNow, the Western Regional Climate Center,
                    AirSis, and PurpleAir for monitoring and sensor data, and
                    the NOAA Hazard Mapping System and National Interagency Fire
                    Center for fire and smoke plume information.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 font-semibold rounded-xl">
                    Read More
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  WHO WE ARE
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  This map relies on data provided from a number of sources,
                  including AirNow, the Western Regional Climate Center, AirSis,
                  and PurpleAir for monitoring and sensor data, and the NOAA
                  Hazard Mapping System and National Interagency Fire Center for
                  fire and smoke plume information.
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 font-semibold rounded-xl">
                  Read More
                </Button>
              </div>
              <div
                className="relative"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                <div className="relative bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-xl">
                  <div className="aspect-video rounded-xl overflow-hidden">
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
