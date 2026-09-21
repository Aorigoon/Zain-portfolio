"use client";

import React, { useRef } from "react";

const works = [
  {
    title: "Go Plus Clone",
    tags: ["FLUTTER", "MOBILE APP"],
    thumb: "/assets/images/thumbs/portfolio-three-thumb1.jpg",
  },
  {
    title: "Zain Portfolio",
    tags: ["WEB DESIGN", "NEXT.JS"],
    thumb: "/assets/images/thumbs/portfolio-three-thumb2.jpg",
  },
  {
    title: "UI/UX Mobile Design",
    tags: ["UI/UX", "FIGMA"],
    thumb: "/assets/images/thumbs/portfolio-three-thumb3.jpg",
  },
  {
    title: "Brand Identity Pack",
    tags: ["BRANDING", "GRAPHIC DESIGN"],
    thumb: "/assets/images/thumbs/portfolio-three-thumb4.jpg",
  },
];

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={sectionRef} 
      className="portfolio-three-area pt-10 pb-120 position-relative z-1" 
      id="work"
      style={{ overflow: "clip", backgroundColor: "var(--bg-color)" }}
    >
      {/* Background outline text - Pure CSS sticky handles pinning natively without GSAP */}
      <div className="absolute inset-0 z-n1 pointer-events-none">
        <div className="sticky top-[25vh]">
          <h3 className="portfolio-three-shape-title">works</h3>
        </div>
      </div>

      <div className="container tw-container-1800-px">
        <div className="row">
          <div className="col-xl-12">
            <div className="portfolio-three-wrapper d-flex justify-content-between flex-wrap align-items-start position-relative z-1">

              {works.map((work, i) => (
                <div
                  key={i}
                  className="portfolio-three-item tw-rounded-lg tw-mb-705 portfolio-wrapper"
                >
                  {/* Title + tags row */}
                  <div className="portfolio-three-wrap d-flex justify-content-between flex-wrap row-gap-2">
                    <div className="tw-mb-6">
                      <div>
                        <h2 className="tw-text-605 fw-medium tw-mb-4">
                          <a className="hover-text-main-two-600" href="#">
                            {work.title}
                          </a>
                        </h2>
                      </div>
                      <div className="portfolio-three-list portfolio-list">
                        <ul className="d-flex tw-gap-205 flex-wrap">
                          {work.tags.map((tag) => (
                            <li key={tag}>
                              <a
                                className="text-uppercase text-heading fw-medium position-relative z-1 hover-bg-main-two-600 hover-border-main-two-600 hover-text-white tw-transition-3"
                                href="#"
                              >
                                {tag}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <div className="portfolio-three-button">
                        <a
                          className="portfolio-three-btn tw-w-8 tw-h-8 lh-1 d-inline-flex justify-content-center align-items-center text-heading rounded-circle hover-bg-main-two-600 hover-text-white"
                          href="#"
                        >
                          <i className="ph ph-arrow-up-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div
                    className="portfolio-thumb not-hide-cursor fw-bold mb-0 tw-rounded-lg"
                    data-cursor="View"
                  >
                    <a className="d-block cursor-hide tw-rounded-lg" href="#">
                      <img
                        className="w-100 tw-rounded-lg"
                        src={work.thumb}
                        alt={work.title}
                      />
                    </a>
                  </div>
                </div>
              ))}

              {/* Floating CTA circle button */}


            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
