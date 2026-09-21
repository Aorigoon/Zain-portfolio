"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const [isHovered, setIsHovered] = React.useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Fade in card
    gsap.fromTo(
      cardContainerRef.current,
      { opacity: 0, x: -50, rotate: -5 },
      {
        opacity: 1,
        x: 0,
        rotate: -2.5,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: cardContainerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    // Fade in right content elements sequentially
    const children = rightContentRef.current?.children;
    if (children) {
      gsap.fromTo(
        Array.from(children),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rightContentRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Animate "Pushing Boundaries" heading
    if (headingRef.current) {
      const headingChildren = headingRef.current.children;
      gsap.fromTo(
        Array.from(headingChildren),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Word-by-word typing reveal animation for main title on scroll
    if (titleRef.current) {
      const words = titleRef.current.innerText.split(' ');
      titleRef.current.innerHTML = words.map(word => `<span class="word" style="opacity: 0;">${word}</span>`).join(' ');
      
      const wordElements = titleRef.current.querySelectorAll('.word');
      
      gsap.to(wordElements, {
        opacity: 1,
        duration: 0.3,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }
  }, []);

  return (
    <section
      className="about-three-area py-120 position-relative z-1"
      id="about"
    >
      <div className="container tw-container-1800-px">
        {/* Original Top Section (Tagline & Floating Counters) */}
        <div className="about-three-top position-relative z-1">
          {/* Centered Headline Tagline (Original) */}
          <div className="row justify-content-center tw-mb-21">
            <div className="col-xl-10">
              <div className="text-center">
                <h2 
                  ref={titleRef}
                  className="about-three-title text-heading"
                  style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.5rem)', lineHeight: '1.15', fontWeight: 700 }}
                >
                  I design and build premium web applications, advanced mobile apps, and high-impact digital experiences that bring your vision to life.
                </h2>
              </div>
            </div>
          </div>

          {/* Bottom Counters Row (Original, shifted slightly higher to align with the border line) */}
          <div className="about-three-wrap-shape d-none d-xl-flex justify-content-between" style={{ top: "-200px", gap: "20px" }}>
            <div className="banner-three-counter-item tw-rounded-md position-relative" style={{ flex: "0 0 284px", maxWidth: "284px", minHeight: "auto", marginBlockStart: "0" }}>
              <h2 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-heading tw-mb-2 lh-1">
                <span className="font-heading">4.78</span>
                /5
              </h2>
              <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-heading">
                Client Satisfaction Rating
              </p>
            </div>
            <div className="banner-three-counter-item tw-rounded-md position-relative" style={{ flex: "0 0 284px", maxWidth: "284px", minHeight: "auto", marginBlockStart: "0" }}>
              <h2 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-heading tw-mb-2 lh-1">
                <span className="font-heading">24/7</span>
              </h2>
              <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-heading">
                Availability & Support
              </p>
            </div>
          </div>
        </div>

        {/* Redesigned Middle Section (Tilted Card + Experience Table) - Positioned below the tagline */}
        <div className="about-three-details-section" style={{ marginTop: "7rem", position: "relative", zIndex: 2 }}>
          {/* Header Row for the details section */}
          <div ref={headingRef} className="text-center" style={{ marginBottom: "4rem" }}>
            <span 
              style={{ 
                fontFamily: "Georgia, serif", 
                fontStyle: "italic", 
                fontSize: "1.35rem", 
                color: "#8e8e93",
                display: "block",
                marginBottom: "0.75rem"
              }}
            >
              / Who Am I
            </span>
            <h2 
              className="font-heading"
              style={{ 
                fontFamily: "var(--body-font), sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.25rem)", 
                fontWeight: 400, 
                lineHeight: "1.15",
                color: "#1c1c1e",
                letterSpacing: "-0.04em"
              }}
            >
              Pushing Boundaries <span style={{ fontWeight: 300, color: "#8e8e93" }}>since 2020</span>
            </h2>
          </div>

          <div className="row align-items-start">
            {/* Left Column: Tilted Landscape Card with Black Background & Hero Image */}
            <div className="col-xl-5 col-lg-5 mb-5 mb-lg-0">
              <div ref={cardContainerRef} className="about-card-container animate-card" style={{ padding: "10px" }}>
                <div 
                  className="about-card"
                  style={{
                    backgroundColor: "#0d0d0f",
                    borderRadius: "24px",
                    padding: "16px 16px 20px 16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    transform: isHovered ? "rotate(0deg) scale(1.02)" : "rotate(-2.5deg)",
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Aspect Ratio 1.55 to crop portrait into landscape */}
                  <div style={{ borderRadius: "16px", overflow: "hidden", backgroundColor: "#000000", aspectRatio: "1.55", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img
                      src="/assets/images/shapes/Adobe Express - file.png"
                      alt="Zainulabidin"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
                
                {/* Card Details Row */}
                <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                  {/* Social Icons */}
                  <div className="d-flex gap-3">
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                      <i className="ph-bold ph-x-logo" style={{ fontSize: "1.25rem", color: "#1c1c1e", transition: "color 0.2s" }}></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                      <i className="ph-bold ph-linkedin-logo" style={{ fontSize: "1.25rem", color: "#1c1c1e", transition: "color 0.2s" }}></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                      <i className="ph-bold ph-instagram-logo" style={{ fontSize: "1.25rem", color: "#1c1c1e", transition: "color 0.2s" }}></i>
                    </a>
                  </div>
                  
                  {/* Name and Role */}
                  <div className="text-end">
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem", color: "#1c1c1e" }}>Zainulabidin</h4>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#8e8e93", fontWeight: 500 }}>Full-Stack Developer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bio Paragraph & Experience List */}
            <div className="col-xl-7 col-lg-7">
              <div ref={rightContentRef} className="about-three-right ps-xl-4">
                {/* Bio Paragraphs - Compact & Consolidated */}
                <div className="mb-3">
                  <p 
                    style={{ 
                      fontSize: "0.95rem", 
                      lineHeight: "1.65", 
                      color: "#6c6c70", 
                      fontWeight: 400,
                      marginBottom: "0" 
                    }}
                  >
                    I’m a passionate digital designer, full-stack web & app developer, and digital marketer focused on creating modern, user-centered digital experiences. I blend creativity with clean, efficient code to build websites and mobile apps that are functional, fast, and scalable. Alongside development, I craft results-driven digital marketing campaigns and manage paid advertising to boost brand visibility, drive targeted traffic, and help businesses scale online. With a strong eye for design & a solid technical foundation, I transform complex ideas into simple intuitive digital solutions.
                  </p>
                </div>

                {/* Experience Timeline/List - Simple List of Roles (No Years) */}
                <div 
                  style={{ 
                    borderLeft: "2px solid #e5e5ea", 
                    paddingLeft: "24px",
                    marginTop: "7.5rem"
                  }}
                >
                  {/* Experience Rows without years */}
                  <div className="py-2" style={{ borderBottom: "1px solid #f0f0f2" }}>
                    <span className="fw-semibold text-heading" style={{ fontSize: "0.95rem", color: "#1c1c1e" }}>
                      Full-Stack Web Developer
                    </span>
                  </div>

                  <div className="py-2" style={{ borderBottom: "1px solid #f0f0f2" }}>
                    <span className="fw-semibold text-heading" style={{ fontSize: "0.95rem", color: "#1c1c1e" }}>
                      Full-Stack App Developer
                    </span>
                  </div>

                  <div className="py-2" style={{ borderBottom: "1px solid #f0f0f2" }}>
                    <span className="fw-semibold text-heading" style={{ fontSize: "0.95rem", color: "#1c1c1e" }}>
                      Digital Designer
                    </span>
                  </div>

                  <div className="py-2" style={{ borderBottom: "1px solid #f0f0f2" }}>
                    <span className="fw-semibold text-heading" style={{ fontSize: "0.95rem", color: "#1c1c1e" }}>
                      Digital Marketer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Wave Background Shape (Original) */}
      <div>
        <img
          className="about-three-shape position-absolute start-0 w-100"
          src="/assets/images/shapes/about-three-shape.png"
          alt="shape"
        />
      </div>

      <style>{`
        .social-icon-link:hover i {
          color: #8e8e93 !important;
        }
      `}</style>
    </section>
  );
}
