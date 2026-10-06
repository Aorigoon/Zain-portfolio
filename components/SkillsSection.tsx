"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Services & Toolkit — user ka corner-stream concept (v2):
//    Koi orange stems/lines NAHI (user). Koi grid/partition rows nahi —
//    words ek diagonal flow-path par organic scatter me hain (jitter ke
//    saath, seedhi line jaise "keediyan" look se bachne ke liye) aur
//    scroll ke saath BOTTOM-RIGHT corner se TOP-LEFT corner stream karte
//    hain. Exit/entry corners par blur strips — words hard cut ke bajaye
//    strip me dissolve hote hain (user: "aage se thodi si blur ho taaki
//    texture jaaye"). Headline RIGHT-upar, tagline LEFT-niche (black
//    windows). Stage change: purani skills corner me dissolve, gap,
//    nayi bottom-right se enter. BLACK #000, WHITE #fff, orange #ff3a00
//    sirf headline square me. Stage-0 pin-start visible (user rule).

type Sk = { name: string; big?: boolean };
type Stage = { title: string; desc: string; skills: Sk[] };


const STAGES: Stage[] = [
  {
    title: "FRAMEWORK",
    desc: "Interfaces built in React, Next.js and Flutter — typed end to end, accessible by default, animated with restraint. Component libraries and scroll-tied motion that ships at a steady 60 fps.",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Vue" },
      { name: "Nuxt" },
      { name: "Angular" },
      { name: "Svelte" },
      { name: "Remix" },
      { name: "Astro" },
      { name: "Flutter" },
      { name: "React Native" },
    ],
  },
  {
    title: "INFRASTRUCTURE",
    desc: "The engine room of every product — REST and GraphQL APIs, authentication, background jobs and the contracts that hold it all together. Node and Python services backed by Postgres, Redis and a clean data model.",
    skills: [
      { name: "Node.js", big: true },
      { name: "Express" },
      { name: "PostgreSQL", big: true },
      { name: "MongoDB" },
      { name: "Python", big: true },
      { name: "GraphQL", big: true },
      { name: "Redis" },
      { name: "Prisma" },
      { name: "FastAPI" },
      { name: "REST APIs", big: true },
      { name: "Nginx" },
      { name: "Docker", big: true },
      { name: "WebSockets" },
    ],
  },
  {
    title: "PLATFORMS",
    desc: "Deployment, hosting and scale — Vercel, AWS, Firebase and Cloudflare, where things get served, monitored and paid for. The last mile that turns finished code into a live product.",
    skills: [
      { name: "Vercel" },
      { name: "AWS" },
      { name: "Firebase" },
      { name: "Supabase" },
      { name: "Cloudflare" },
      { name: "Netlify" },
      { name: "DigitalOcean" },
      { name: "Cloud Run" },
      { name: "Railway" },
      { name: "Render" },
    ],
  },
];


const WORD_SPACING = 0.09; // path ka fraction — har do words ke beech barabar fasla
const REST_F = 0.25; // end par aakhri word line ke is hisse par (lower-right) tik jaata hai taaki oopar na jaye
const SCROLL_PER_UNIT = 0.65; // scroll (viewport heights) per timeline unit — speed

export default function SkillsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const stageEls = Array.from(rootRef.current?.querySelectorAll("[data-stage]") ?? []) as HTMLDivElement[];
      if (stageEls.length < STAGES.length) return;

      // Stages hamesha visible rehte hain (words ki stream beech me kabhi nahi
      // tootti). Sirf headline + tagline ka TEXT badalta hai (simple crossfade).
      gsap.set(stageEls, { autoAlpha: 1 });
      const heads = stageEls.map((el) => el.querySelector("[data-head]") as HTMLElement);
      const tags = stageEls.map((el) => el.querySelector("[data-tag]") as HTMLElement);
      gsap.set([...heads, ...tags], { autoAlpha: 0 });
      gsap.set([heads[0], tags[0]], { autoAlpha: 1 });

      // ek hi seedhi diagonal line (bottom-right corner -> top-left corner),
      // dono sire screen ke bahar. Saare stages ke words ek continuous stream.
      const P = (f: number) => ({
        x: () => window.innerWidth * (1.0 - 1.3 * f),
        y: () => window.innerHeight * (0.92 - 1.13 * f),
      });
      const T = 1; // ek word ka safar
      const gap = T * WORD_SPACING; // do words ke beech barabar fasla
      const pre = T * 0.6; // pin-start par line pehle se bhari hui
      const swapAt: number[] = [];
      const total = STAGES.reduce((a, s) => a + s.skills.length, 0);
      // aakhri word jab line ke REST_F par pahunche tab animation khatam. Us waqt
      // Platforms ke saare words line par bhare rehte hain (koi gap/khaali jagah
      // nahi), aakhri word corner me, aur wapas scroll par palat chalti hai.
      const lastAt = Math.max(0, (total - 1) * gap - pre);
      const stopT = lastAt + T * REST_F;
      let g = 0;
      const tl = gsap.timeline();

      STAGES.forEach((_, i) => {
        const words = Array.from(stageEls[i].querySelectorAll("[data-word]")) as HTMLElement[];
        words.forEach((w, k) => {
          const s = g * gap - pre;
          const f0 = s < 0 ? -s / T : 0;
          const at = Math.max(0, s);
          const full = s < 0 ? T + s : T;
          const dur = Math.min(full, stopT - at); // stopT ke baad koi tween nahi
          if (k === 0) swapAt.push(i === 0 ? 0 : at + full * 0.35); // naya stage jab uska pehla word beech me pahunche
          tl.fromTo(w, P(f0), { ...P(f0 + dur / T), duration: dur, ease: "none" }, at);
          g++;
        });
      });

      swapAt.forEach((b, j) => {
        if (j === 0) return;
        tl.to([heads[j - 1], tags[j - 1]], { autoAlpha: 0, duration: 0.08, ease: "none" }, b - 0.08);
        tl.fromTo([heads[j], tags[j]], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08, ease: "none" }, b);
      });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * stopT * SCROLL_PER_UNIT),
        pin: true,
        animation: tl,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const t = self.progress * stopT;
          let idx = 0;
          swapAt.forEach((b, j) => {
            if (t >= b) idx = j;
          });
          setActiveIdx((prev) => (prev === idx ? prev : idx));
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="skills"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", zIndex: 2, backgroundColor: "#000000" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&display=swap');
        .sk-word { font-family: 'Space Grotesk', sans-serif; font-weight: 600; letter-spacing: -0.02em; color: #ffffff; font-size: clamp(1.6rem, 3vw, 3rem); }
        .sk-hsize { font-size: clamp(2.6rem, 10.5vw, 10.5rem); }
        @media (min-width: 1600px) { .sk-hsize { font-size: 9.5vw; } }
      `}</style>

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {STAGES.map((s, i) => {
        const isActive = activeIdx === i;
        return (
          <div key={s.title} data-stage className="absolute inset-0">
            {/* diagonal field — 200vw x 180vh, scroll par corner-to-corner */}
            <div data-field className="absolute inset-0">
              {s.skills.map((sk) => (
                <div
                  key={sk.name}
                  data-word
                  className="absolute left-0 top-0 will-change-transform"
                >
                  <span className="sk-word whitespace-nowrap">
                    {sk.name}
                  </span>
                </div>
              ))}
            </div>

            {/* exit strip — TOP-LEFT corner: words isme dissolve hote hain
                (blur + black gradient, hard cut/partition na lage) */}
            <div
              aria-hidden
              className="pointer-events-none absolute z-[5]"
              style={{
                left: "-10%",
                top: "-10%",
                width: "34%",
                height: "58%",
                backdropFilter: "blur(9px)",
                WebkitBackdropFilter: "blur(9px)",
                maskImage: "radial-gradient(105% 105% at 0% 0%, #000 38%, transparent 76%)",
                WebkitMaskImage: "radial-gradient(105% 105% at 0% 0%, #000 38%, transparent 76%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute z-[5]"
              style={{
                inset: 0,
                background:
                  "radial-gradient(52% 52% at 0% 0%, #000 24%, rgba(0,0,0,0.72) 48%, transparent 74%)",
              }}
            />

            {/* entry strip — BOTTOM-RIGHT corner: words yahan se nikalte hue
                blur se saamne aate hain */}
            <div
              aria-hidden
              className="pointer-events-none absolute z-[5]"
              style={{
                right: "-10%",
                bottom: "-10%",
                width: "34%",
                height: "58%",
                backdropFilter: "blur(9px)",
                WebkitBackdropFilter: "blur(9px)",
                maskImage: "radial-gradient(105% 105% at 100% 100%, #000 38%, transparent 76%)",
                WebkitMaskImage: "radial-gradient(105% 105% at 100% 100%, #000 38%, transparent 76%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute z-[5]"
              style={{
                inset: 0,
                background:
                  "radial-gradient(52% 52% at 100% 100%, #000 24%, rgba(0,0,0,0.72) 48%, transparent 74%)",
              }}
            />

            {/* headline — RIGHT side, thoda upar; black window */}
            <div
              data-head
              className="absolute z-10"
              style={{
                top: "clamp(16px, 3.5vh, 56px)",
                right: "clamp(20px, 3.4vw, 64px)",
                backgroundColor: "#000000",
                padding: "0.05em 0 0.1em 0.35em",
              }}
            >
              <h2
                data-headline
                className="sk-hsize w-max font-black leading-[0.92] tracking-tight will-change-transform"
                style={{ color: "#ffffff" }}
              >
                {s.title}
                <span
                  aria-hidden
                  className="ml-[0.16em] inline-block align-baseline"
                  style={{
                    width: "0.14em",
                    height: "0.14em",
                    backgroundColor: "#ff3a00",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.4s 0.2s",
                  }}
                />
              </h2>
            </div>

            {/* tagline — LEFT side, bottom */}
            <div
              data-tag
              className="absolute z-10"
              style={{
                left: "clamp(20px, 3.4vw, 64px)",
                bottom: "clamp(24px, 6vh, 72px)",
                backgroundColor: "#000000",
                padding: "14px 18px 14px 0",
              }}
            >
              <p
                data-desc
                className="max-w-lg text-sm leading-snug lg:w-[24vw] lg:min-w-[280px] lg:text-base lg:leading-relaxed"
                style={{
                  color: "rgba(255,255,255,0.78)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 0.35s",
                }}
              >
                <strong style={{ color: "#ffffff" }}>{s.title.charAt(0) + s.title.slice(1).toLowerCase()}.</strong>{" "}
                {s.desc}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
