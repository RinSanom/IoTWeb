"use client";
import React from "react";

interface ImpactCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export default function ImpactCard({
  title,
  description,
  icon,
  delay = 0,
}: ImpactCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 group w-full min-w-0"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
        <div className="w-16 sm:w-20 h-16 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
