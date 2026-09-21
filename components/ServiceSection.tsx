"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

const servicesData = [
  {
    number: "01",
    title: "web development",
    description: "we build high-performance, search-optimized, and responsive web applications tailored to scale your brand.",
    tags: ["Next.js", "React", "SEO Optimization", "Tailwind CSS"],
    images: [
      "/assets/images/thumbs/portfolio-three-thumb1.jpg",
      "/assets/images/thumbs/portfolio-three-thumb2.jpg",
      "/assets/images/thumbs/portfolio-three-thumb3.jpg",
      "/assets/images/thumbs/portfolio-three-thumb4.jpg",
      "/assets/images/thumbs/service-three-thumb3.png"
    ]
  },
  {
    number: "02",
    title: "app development",
    description: "crafting intuitive, native-quality iOS and Android applications designed for seamless user interaction.",
    tags: ["React Native", "Flutter", "iOS & Android", "UI/UX Design"],
    images: [
      "/assets/images/thumbs/portfolio-two-thumb1.jpg",
      "/assets/images/thumbs/portfolio-two-thumb2.jpg",
      "/assets/images/thumbs/portfolio-two-thumb3.jpg",
      "/assets/images/thumbs/portfolio-two-thumb4.jpg",
      "/assets/images/thumbs/service-three-thumb4.png"
    ]
  },
  {
    number: "03",
    title: "ai automation & saas",
    description: "integrating state-of-the-art AI workflows and building scalable software-as-a-service platforms to automate operations.",
    tags: ["OpenAI API", "Workflow Automation", "SaaS Backend", "LLM Integration"],
    images: [
      "/assets/images/thumbs/service-three-thumb1.png",
      "/assets/images/thumbs/service-three-thumb2.png",
      "/assets/images/thumbs/feature-three-thumb1.jpg",
      "/assets/images/thumbs/portfolio-three-thumb3.jpg",
      "/assets/images/thumbs/portfolio-thumb1.jpg"
    ]
  },
  {
    number: "04",
    title: "bug fixing & maintenance",
    description: "providing round-the-clock troubleshooting, performance tuning, and updates to keep your systems running flawlessly.",
    tags: ["Code Auditing", "Bug Tracking", "Performance Tuning", "Updates"],
    images: [
      "/assets/images/thumbs/coming-soon-img.png",
      "/assets/images/thumbs/portfolio-three-thumb4.jpg",
      "/assets/images/thumbs/portfolio-two-thumb1.jpg",
      "/assets/images/thumbs/service-three-thumb2.png",
      "/assets/images/thumbs/portfolio-three-thumb2.jpg"
    ]
  }
];

export default function ServiceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section 
      ref={containerRef} 
      className="service-three-area bg-black relative w-full" 
      id="services"
    >
      <div className="w-full flex flex-col items-center relative">
        {servicesData.map((service, index) => {
          const targetScale = 1 - (servicesData.length - index) * 0.05;
          const cardCount = servicesData.length;
          const G = 0.6; // 60vh spacer between cards
          const S = 1.2; // 120vh spacer at bottom
          const totalScrollFactor = cardCount * 1.0 + (cardCount - 1) * G + S - 1.0; // 6.0
          
          const progressStart = (index * (1.0 + G)) / totalScrollFactor;
          const progressEnd = index === cardCount - 1 ? 1.0 : ((index + 1) * (1.0 + G)) / totalScrollFactor;

          return (
            <React.Fragment key={index}>
              <Card
                index={index}
                service={service}
                progress={scrollYProgress}
                range={[progressStart, progressEnd]}
                targetScale={targetScale}
              />
              {/* Spacer after card, except for the last card */}
              {index < cardCount - 1 && (
                <div className="h-[60vh] w-full bg-black pointer-events-none" />
              )}
            </React.Fragment>
          );
        })}
        {/* Extra spacer to allow Card 4 to stay stuck and avoid overlap with WorkSection */}
        <div className="h-[120vh] w-full bg-black pointer-events-none" />
      </div>
    </section>
  );
}

interface CardProps {
  index: number;
  service: typeof servicesData[0];
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const Card: React.FC<CardProps> = ({
  index,
  service,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef<HTMLDivElement>(null);
  
  // Scale calculations using Framer Motion for stacking effect
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0 w-full"
    >
      <motion.div
        style={{
          scale,
          top: 0,
        }}
        className="service-three-single klime-card-layout w-full origin-top"
      >
        {/* Top Section - Column Layout for title on top, tagline/description below */}
        <div className="klime-card-top flex flex-col items-start gap-4">
          <h2 className="klime-card-title">{service.title}</h2>
          <div className="klime-card-meta">
            <p className="klime-card-desc">{service.description}</p>
            <div className="klime-card-tags">
              {service.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section - Auto-Scrolling Marquee Gallery Layout */}
        <div className="klime-card-bottom w-full mt-auto">
          <div className="klime-gallery-wrapper overflow-hidden w-full relative py-4">
            <div className="klime-card-gallery-row">
              {/* Duplicate list to create seamless infinite marquee */}
              {[...service.images, ...service.images].map((imgUrl, imgIdx) => {
                const idx = imgIdx % service.images.length;
                
                // Determine heights and aspect ratios dynamically
                let cardH = "38vh";
                let aspectClass = "aspect-[3/4]";
                
                if (idx === 0) {
                  cardH = "43vh";
                  aspectClass = "aspect-[2/3]";
                } else if (idx === 1) {
                  cardH = "34vh";
                  aspectClass = "aspect-[16/10]";
                } else if (idx === 2) {
                  cardH = "38vh";
                  aspectClass = "aspect-[3/4]";
                } else if (idx === 3) {
                  cardH = "35vh";
                  aspectClass = "aspect-[1/1]";
                } else if (idx === 4) {
                  cardH = "40vh";
                  aspectClass = "aspect-[2/3]";
                }

                return (
                  <motion.div
                    key={imgIdx}
                    style={{ "--card-h": cardH } as React.CSSProperties}
                    className={`klime-gallery-card flex-shrink-0 relative overflow-hidden rounded-2xl cursor-pointer ${aspectClass}`}
                    whileHover={{ 
                      scale: 1.04, 
                      y: -8,
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${service.title} screenshot ${idx + 1}`} 
                      className="w-full h-full object-cover origin-center"
                      loading="lazy"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

