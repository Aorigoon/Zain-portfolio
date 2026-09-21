"use client";

import React, { useEffect, useRef } from "react";

export default function HeroSection() {
  const typingRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Typing animation for the tagline
    if (typingRef.current) {
      const text = "Design, branding and web development made better.";
      let i = 0;
      
      typingRef.current.textContent = "";
      
      const typeWriter = () => {
        if (i < text.length) {
          typingRef.current!.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        } else {
          // Hide cursor after typing is complete
          if (cursorRef.current) {
            cursorRef.current.style.display = "none";
          }
        }
      };
      
      // Start typing after a delay
      setTimeout(typeWriter, 800);
    }
  }, []);

  return (
    <section className="banner-three-area">
      <div className="container tw-container-1800-px">
        <div className="row">
          <div className="col-xl-12">
            <div className="banner-three-wrapper position-relative z-1">
              <div className="banner-three-man position-absolute start-50 translate-middle-x" style={{ width: "750px", maxWidth: "100%" }}>
                <img
                  src="/assets/images/shapes/Adobe Express - file.png"
                  alt="developer"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              {/* Huge Background Outline Title */}
              <h1 className="banner-three-title text-black tw-mb-30">
                developer
              </h1>

              {/* Three-Column Flex Wrapper */}
              <div className="banner-three-wrap d-flex justify-content-between align-items-end position-relative z-1">
                {/* Left Column - Greetings & Skill List */}
                <div className="banner-three-left tw-rounded-lg">
                  <h2 className="banner-three-left-title tw-text-3xl tw-mb-6">
                    Hello! I&apos;m Zain, <br />a creative developer &amp;
                    digital designer.
                  </h2>
                  <div className="banner-three-list">
                    <ul>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img
                            src="/assets/images/icons/banner-three-pluse.svg"
                            alt="pluse"
                          />
                        </span>
                        Web &amp; App Development
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img
                            src="/assets/images/icons/banner-three-pluse.svg"
                            alt="pluse"
                          />
                        </span>
                        App Development
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img
                            src="/assets/images/icons/banner-three-pluse.svg"
                            alt="pluse"
                          />
                        </span>
                        UI/UX &amp; Graphic Design
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img
                            src="/assets/images/icons/banner-three-pluse.svg"
                            alt="pluse"
                          />
                        </span>
                        Branding &amp; Poster Ads
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img
                            src="/assets/images/icons/banner-three-pluse.svg"
                            alt="pluse"
                          />
                        </span>
                        Digital Marketing
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Center Column - Headline & Call to Action Button */}
                <div className="banner-three-center text-center">
                  <h3 className="banner-three-center-title tw-text-120" style={{ position: "relative", display: "inline-block" }}>
                    <span ref={typingRef}></span>
                    <span 
                      ref={cursorRef}
                      style={{ 
                        display: "inline-block",
                        width: "3px",
                        height: "1em",
                        backgroundColor: "currentColor",
                        marginLeft: "4px",
                        animation: "blink 1s infinite",
                        verticalAlign: "middle"
                      }}
                    ></span>
                  </h3>
                  <div className="banner-three-button">
                    <a
                      className="tw-hover-btn bg-black text-white fw-bold tw-py-4 tw-px-10 d-inline-block hover-text-white text-uppercase tw-rounded-lg"
                      href="#about"
                    >
                      view projects
                      <span className="tw-hover-btn-circle-dot bg-main-two-600"></span>
                    </a>
                  </div>
                </div>
                
                <style>{`
                  @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                  }
                `}</style>

                {/* Right Column - Stats & Counters */}
                <div className="banner-three-right tw-rounded-lg">
                  {/* Stat 1: Satisfaction */}
                  <div className="banner-three-counter-item tw-rounded-md tw-mb-4 position-relative">
                    <h4 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-heading tw-mb-2 lh-1">
                      <span
                        className="purecounter font-heading"
                        data-purecounter-duration="2"
                        data-purecounter-end="98"
                      >
                        0
                      </span>
                      %
                    </h4>
                    <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-heading">
                      Client Satisfaction Rate
                    </p>
                  </div>

                  {/* Stat 2: Projects */}
                  <div className="banner-three-counter-item tw-rounded-md tw-mb-4 ms-auto bg-black">
                    <h4 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-white tw-mb-2 lh-1">
                      <span
                        className="purecounter font-heading"
                        data-purecounter-duration="4"
                        data-purecounter-end="70"
                      >
                        0
                      </span>
                      +
                    </h4>
                    <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-white">
                      Projects Launched
                    </p>
                  </div>

                  {/* Stat 3: Global Clients */}
                  <div className="banner-three-counter-item tw-rounded-md tw-mb-4">
                    <div className="d-flex align-items-center tw-mb-2">
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-1 border border-2 border-white">
                        <img
                          src="/assets/images/thumbs/team-img1.png"
                          alt="Client Image"
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-2 tw--ms-16-px border border-2 border-white">
                        <img
                          src="/assets/images/thumbs/team-img2.png"
                          alt="Client Image"
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-3 tw--ms-16-px border border-2 border-white">
                        <img
                          src="/assets/images/thumbs/team-img3.png"
                          alt="Client Image"
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-3 tw--ms-16-px border border-2 border-white">
                        <img
                          src="/assets/images/thumbs/team-img4.png"
                          alt="Client Image"
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                    </div>
                    <h4 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-heading tw-mb-2 lh-1">
                      <span
                        className="purecounter font-heading"
                        data-purecounter-duration="3"
                        data-purecounter-end="96"
                      >
                        0
                      </span>
                      +
                    </h4>
                    <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-heading">
                      Global Clients and Growing
                    </p>
                  </div>
                </div>

                {/* Line Shape Background decoration */}
                <div className="banner-three-line-shape position-absolute start-50 translate-middle-x z-n1">
                  <img
                    src="/assets/images/shapes/banner-three-shape.png"
                    alt="shape"
                  />
                  <div className="banner-three-carcel-shape">
                    <div>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- EXACT DESKTOP DESIGN FOR MOBILE --- */}
              <div className="d-block d-xl-none tw-w-full tw-mt-10 tw-mb-12">

                {/* Hello I'm Zain Box - Using exact original CSS classes */}
                <div
                  className="banner-three-left tw-rounded-lg"
                  style={{
                    display: 'block',
                    maxWidth: '410px',
                    marginBottom: '40px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  <h2 className="banner-three-left-title tw-text-3xl tw-mb-6">
                    Hello! I&apos;m Zain, <br />a creative developer &amp;
                    digital designer.
                  </h2>
                  <div className="banner-three-list">
                    <ul>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img src="/assets/images/icons/banner-three-pluse.svg" alt="pluse" />
                        </span>
                        Web &amp; App Development
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img src="/assets/images/icons/banner-three-pluse.svg" alt="pluse" />
                        </span>
                        App Development
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img src="/assets/images/icons/banner-three-pluse.svg" alt="pluse" />
                        </span>
                        UI/UX &amp; Graphic Design
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img src="/assets/images/icons/banner-three-pluse.svg" alt="pluse" />
                        </span>
                        Branding &amp; Poster Ads
                      </li>
                      <li className="tw-text-lg fw-medium d-inline-flex align-items-center tw-gap-2 tw-mb-4">
                        <span>
                          <img src="/assets/images/icons/banner-three-pluse.svg" alt="pluse" />
                        </span>
                        Digital Marketing
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Zig-Zag Stats Grid using EXACT original desktop classes (WITH ORIGINAL WRAPPER) */}
                <div
                  className="banner-three-right tw-rounded-lg"
                  style={{
                    display: 'block',
                    marginBlockEnd: '0px',
                    maxWidth: '410px',
                    width: '100%',
                    padding: '25px 20px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  {/* Stat 1: Satisfaction */}
                  <div
                    className="banner-three-counter-item tw-rounded-md tw-mb-4 position-relative"
                    style={{ maxWidth: '284px', width: '100%' }}
                  >
                    <h4 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-heading tw-mb-2 lh-1">
                      <span className="purecounter font-heading" data-purecounter-duration="2" data-purecounter-end="98">
                        0
                      </span>
                      %
                    </h4>
                    <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-heading">
                      Client Satisfaction Rate
                    </p>
                  </div>

                  {/* Stat 2: Projects */}
                  <div
                    className="banner-three-counter-item tw-rounded-md tw-mb-4 ms-auto bg-black"
                    style={{ maxWidth: '284px', width: '100%', display: 'block' }}
                  >
                    <h4 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-white tw-mb-2 lh-1">
                      <span className="purecounter font-heading" data-purecounter-duration="4" data-purecounter-end="70">
                        0
                      </span>
                      +
                    </h4>
                    <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-white">
                      Projects Launched
                    </p>
                  </div>

                  {/* Stat 3: Global Clients */}
                  <div
                    className="banner-three-counter-item tw-rounded-md tw-mb-4"
                    style={{ maxWidth: '284px', width: '100%' }}
                  >
                    <div className="d-flex align-items-center tw-mb-2">
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-1 border border-2 border-white">
                        <img src="/assets/images/thumbs/team-img1.png" alt="Client Image" className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-2 tw--ms-16-px border border-2 border-white">
                        <img src="/assets/images/thumbs/team-img2.png" alt="Client Image" className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-3 tw--ms-16-px border border-2 border-white">
                        <img src="/assets/images/thumbs/team-img3.png" alt="Client Image" className="w-100 h-100 object-fit-cover" />
                      </div>
                      <div className="tw-w-9 tw-h-9 rounded-circle overflow-hidden tw-duration-300 hover-scale-2 tw-hover-z-9 position-relative z-3 tw--ms-16-px border border-2 border-white">
                        <img src="/assets/images/thumbs/team-img4.png" alt="Client Image" className="w-100 h-100 object-fit-cover" />
                      </div>
                    </div>
                    <h4 className="banner-three-counter-title tw-text-101 fw-semibold font-heading text-heading tw-mb-2 lh-1">
                      <span className="purecounter font-heading" data-purecounter-duration="3" data-purecounter-end="96">
                        0
                      </span>
                      +
                    </h4>
                    <p className="banner-three-counter-paragraph tw-text-lg fw-medium text-heading tw-whitespace-nowrap">
                      Global Clients and Growing
                    </p>
                  </div>

                  {/* Horizontally placed smaller stats row */}
                  <div className="d-flex justify-content-between tw-w-full tw-gap-3 tw-mt-4" style={{ maxWidth: '370px' }}>
                    {/* Stat 4: Client Satisfaction */}
                    <div
                      className="banner-three-counter-item tw-rounded-md"
                      style={{ padding: '12px 14px', flex: '1', minWidth: '0', marginBlockStart: '0px' }}
                    >
                      <h4 className="banner-three-counter-title tw-text-2xl fw-bold font-heading text-heading tw-mb-1 lh-1">
                        <span className="purecounter font-heading" data-purecounter-duration="4" data-purecounter-end="478">0</span>/5
                      </h4>
                      <p className="banner-three-counter-paragraph tw-text-[11px] fw-semibold text-heading tw-whitespace-nowrap">
                        Client Satisfaction
                      </p>
                    </div>

                    {/* Stat 5: Revenue Growth */}
                    <div
                      className="banner-three-counter-item tw-rounded-md"
                      style={{ padding: '12px 14px', flex: '1', minWidth: '0', marginBlockStart: '0px' }}
                    >
                      <h4 className="banner-three-counter-title tw-text-2xl fw-bold font-heading text-heading tw-mb-1 lh-1">
                        $<span className="purecounter font-heading" data-purecounter-duration="2" data-purecounter-end="115">0</span>k+
                      </h4>
                      <p className="banner-three-counter-paragraph tw-text-[11px] fw-semibold text-heading tw-whitespace-nowrap">
                        Revenue Growth
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              {/* --- END EXACT DESKTOP DESIGN FOR MOBILE --- */}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
