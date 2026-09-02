'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import { ArrowDown, AtSign, Globe, Mail, Rss, Send, Sparkles } from 'lucide-react';

const heroStickers = [
  { id: 'burst-one', className: 'burst burst-yellow', label: '!' },
  { id: 'burst-two', className: 'burst burst-cyan', label: '*' },
  { id: 'curious', className: 'pill pill-one', label: 'curious' },
  { id: 'making', className: 'pill pill-two', label: 'always making' },
];

const projects = [
  {
    title: 'Animated Identity',
    tag: 'Character System',
    text: 'A sticker-led avatar system with cursor following, expression swaps, and future layer replacement.',
  },
  {
    title: 'Living Portfolio',
    tag: 'Web Experience',
    text: 'A personal homepage that behaves like a moving collage instead of a static profile.',
  },
  {
    title: 'Tiny Tools',
    tag: 'Product Experiments',
    text: 'Small web experiments with direct interactions, bold motion, and a useful core.',
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type StickerForgeElement = HTMLElement & {
  setSource: (source: unknown) => Promise<void>;
  setOptions: (options: unknown) => void;
  setPeelProgress?: (progress: number, options?: unknown) => void;
  reset: () => void;
  reappear?: () => void;
};

const forgeOptions = {
  outline: {
    width: 18,
    color: '#ffffff',
  },
  edge: {
    width: 2.4,
    strength: 0.7,
  },
  shadow: {
    opacity: 0.22,
    blur: 22,
    distance: 16,
    angle: 42,
    color: '#191823',
  },
  lighting: {
    direction: {
      x: -0.38,
      y: 0.52,
      z: 0.76,
    },
    intensity: 0.8,
    ambient: 0.35,
    softness: 0.6,
  },
  peel: {
    radius: 0.12,
    stiffness: 0.72,
    grabWidth: 22,
    maxAngle: 3.55,
    release: 'snap',
  },
  sound: {
    enabled: true,
    volume: 0.68,
  },
  back: {
    color: '#f7f5f2',
    gloss: 0.7,
    roughness: 0.3,
  },
  material: {
    type: 'original',
    intensity: 0.86,
    scale: 1,
    holographicGrain: 0.72,
    seed: 0.37,
    holographicColors: ['#f2a7c5', '#8edfd5', '#9db4ea'],
  },
  tilt: -3,
  wind: 0.25,
  quality: 'high',
};

const loadStickerForge = () =>
  new Promise<void>((resolve, reject) => {
    if (customElements.get('sticker-forge')) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>('script[data-sticker-forge]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://sticker.oooo.so/embed/sticker-forge.es.js';
    script.dataset.stickerForge = 'true';
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });

export default function Home() {
  const stageRef = useRef<HTMLElement | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0, fastX: 0, fastY: 0, slowX: 0, slowY: 0 });
  const [stickerState, setStickerState] = useState<'idle' | 'near' | 'clicked'>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [isRipping, setIsRipping] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const tagTimer = useRef<number | null>(null);
  // True while a rip-switch is settling: the NEW sticker should restore from the
  // fully-peeled state (a smooth close-up) instead of a bouncy entrance.
  const restoreAfterRip = useRef(false);

  // Entrance: loading overlay -> reveal -> done
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const p = clamp((now - start) / duration, 0, 1);
      const easedProgress = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(easedProgress * 100));
      if (p < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setPhase('reveal');
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      const timer = window.setTimeout(() => setPhase('done'), 620);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  // Preload both character sticker frames so closing<->open bust switching has no loading gap.
  useEffect(() => {
    const sources = ['/characters/hero-sticker.png', '/characters/hero-open-bust.png'];
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const x = clamp(((clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      const y = clamp(((clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      target.current = { x, y };
      setStickerState(Math.abs(x) + Math.abs(y) > 0.35 ? 'near' : 'idle');
    };

    const onPointerMove = (event: PointerEvent) => updateTarget(event.clientX, event.clientY);
    const onPointerLeave = () => {
      target.current = { x: 0, y: 0 };
      setStickerState('idle');
    };
    const onPointerDown = () => {
      setStickerState('clicked');
    };

    const animate = () => {
      const current = eased.current;
      current.x += (target.current.x - current.x) * 0.075;
      current.y += (target.current.y - current.y) * 0.075;
      current.fastX += (target.current.x - current.fastX) * 0.19;
      current.fastY += (target.current.y - current.fastY) * 0.19;
      current.slowX += (target.current.x - current.slowX) * 0.035;
      current.slowY += (target.current.y - current.slowY) * 0.035;

      stage.style.setProperty('--mx', current.x.toFixed(4));
      stage.style.setProperty('--my', current.y.toFixed(4));
      stage.style.setProperty('--fx', current.fastX.toFixed(4));
      stage.style.setProperty('--fy', current.fastY.toFixed(4));
      stage.style.setProperty('--sx', current.slowX.toFixed(4));
      stage.style.setProperty('--sy', current.slowY.toFixed(4));
      raf = window.requestAnimationFrame(animate);
    };

    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerleave', onPointerLeave);
    stage.addEventListener('pointerdown', onPointerDown);
    raf = window.requestAnimationFrame(animate);

    return () => {
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('pointerdown', onPointerDown);
      window.cancelAnimationFrame(raf);
      if (tagTimer.current) window.clearTimeout(tagTimer.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const setupForge = async () => {
      await loadStickerForge();
      await customElements.whenDefined('sticker-forge');
      if (cancelled) return;

      const hero = document.getElementById('hero-forge') as StickerForgeElement | null;
      if (hero) {
        await hero.setSource({
          type: 'image',
          src: isOpen ? '/characters/hero-open-bust.png' : '/characters/hero-sticker.png',
          padding: isOpen ? 80 : 96,
          textureMaxEdge: 2048,
        });
        hero.setOptions({
          ...forgeOptions,
          outline: { ...forgeOptions.outline, width: isOpen ? 16 : 18 },
          tilt: isOpen ? -1.5 : -3,
          peel: {
            ...forgeOptions.peel,
            grabWidth: 34,
            release: 'snap',
          },
        });

        // When this re-source is the tail of a rip-switch, settle the NEW sticker
        // by restoring it from the fully-peeled state (smooth close-up), rather
        // than playing the bouncy entrance again.
        if (restoreAfterRip.current) {
          restoreAfterRip.current = false;
          const peelOrigin = { x: 0.5, y: 0.08 };
          const peelTarget = { x: 0.5, y: -0.72 };
          hero.setPeelProgress?.(1, { origin: peelOrigin, target: peelTarget });
          const restoreStartedAt = performance.now();
          const restoreDuration = 560;
          const restorePeel = (now: number) => {
            const progress = clamp(1 - (now - restoreStartedAt) / restoreDuration, 0, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            hero.setPeelProgress?.(eased, { origin: peelOrigin, target: peelTarget });
            if (progress > 0) requestAnimationFrame(restorePeel);
          };
          requestAnimationFrame(restorePeel);
        }
      }

      await Promise.all(
        heroStickers.map(async (item, index) => {
          const element = document.getElementById(`forge-${item.id}`) as StickerForgeElement | null;
          if (!element) return;
          await element.setSource({
            type: 'text',
            text: item.label,
            fontFamily: 'Arial Rounded MT Bold, Arial Black, sans-serif',
            fontWeight: 900,
            color: '#071735',
            richText: {
              blocks: [
                {
                  align: 'center',
                  lineHeight: 1.05,
                  runs: [
                    {
                      text: item.label,
                      color: index % 2 === 0 ? '#071735' : '#19191d',
                      fontSize: 34,
                      fontWeight: 900,
                      underline: false,
                    },
                  ],
                },
              ],
            },
          });
          element.setOptions({
            ...forgeOptions,
            outline: { width: 14, color: '#ffffff' },
            shadow: { ...forgeOptions.shadow, blur: 18, distance: 12 },
            peel: { ...forgeOptions.peel, grabWidth: 22, maxAngle: 3.2 },
            sound: { ...forgeOptions.sound, volume: 0.38 },
            tilt: index % 2 === 0 ? -6 : 5,
          });
        }),
      );
    };

    setupForge().catch(() => {
      // The plain layout remains usable if the remote sticker runtime is unavailable.
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Rip the sticker open and swap to the other frame, then let the NEW sticker
  // re-appear/settle directly — the peeled-off sticker is never restored.
  const runRipSwitch = () => {
    if (isRipping) return;
    setIsRipping(true);
    setStickerState('clicked');

    const hero = document.getElementById('hero-forge') as StickerForgeElement | null;
    if (hero) {
      const startedAt = performance.now();
      const duration = 640;
      const animatePeel = (now: number) => {
        const progress = clamp((now - startedAt) / duration, 0, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        hero.setPeelProgress?.(easedProgress, {
          origin: { x: 0.5, y: 0.08 },
          target: { x: 0.5, y: -0.72 },
        });
        if (progress < 1) requestAnimationFrame(animatePeel);
      };
      requestAnimationFrame(animatePeel);
    }

    // Swap the source right as the peel finishes; the NEW sticker settles by
    // restoring from the fully-peeled state (smooth close-up, no bouncy re-entrance).
    window.setTimeout(() => {
      restoreAfterRip.current = true;
      setIsOpen((current) => !current);
      setIsRipping(false);
      setStickerState('near');
    }, 700);
  };

  const handleStickerClick = () => {
    runRipSwitch();
  };

  const autoSwitched = useRef(false);

  // Once the entrance pop has fully settled, automatically rip the sticker open
  // into the other frame — no restoring the old sticker, straight into the new
  // sticker's re-appear/settle.
  useEffect(() => {
    if (phase !== 'done' || autoSwitched.current) return;
    autoSwitched.current = true;
    const t = window.setTimeout(() => {
      runRipSwitch();
    }, 900);
    return () => window.clearTimeout(t);
  }, [phase]);

  const handleTagClick = (item: (typeof heroStickers)[number]) => {
    if (tagTimer.current) window.clearTimeout(tagTimer.current);
    const tag = document.getElementById(`forge-${item.id}`) as StickerForgeElement | null;
    tag?.setPeelProgress?.(0.82, {
      origin: { x: 0.9, y: 0.1 },
      target: { x: 1.24, y: -0.12 },
    });

    tagTimer.current = window.setTimeout(() => tag?.reappear?.(), 700);
  };

  const loaded = phase !== 'loading';

  return (
    <main ref={stageRef} className={`site-shell ${loaded ? 'is-loaded' : 'is-loading'}`}>
      {phase !== 'done' && (
        <div className={`preloader ${phase === 'reveal' ? 'is-leaving' : ''}`} aria-hidden="true">
          <div className="preloader-ring" />
          <div className="preloader-count">{progress}</div>
          <div className="preloader-note">loading</div>
        </div>
      )}

      <nav className="top-nav" aria-label="Primary navigation">
        <div className="top-nav-right">
          <a className="primary-cta" href="#contact">
            Get in Touch
          </a>
          <button
            className={`menu-toggle ${navOpen ? 'is-open' : ''}`}
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          />
        </div>
      </nav>

      <nav className={`side-nav ${navOpen ? 'is-open' : 'is-closed'}`} aria-label="Section navigation">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </nav>

      <section id="home" className="hero-stage" aria-label="Animated sticker hero">
        <div className="hero-name" aria-hidden="true">
          Li Qiuyue
        </div>

        <div className="sticker-orbit" aria-label="Floating sticker links">
          {heroStickers.map((item) => (
            <button
              key={item.id}
              className={`${item.className} peel-sticker`}
              type="button"
              aria-label={`${item.label} sticker`}
              onClick={() => handleTagClick(item)}
            >
              {createElement('sticker-forge', {
                id: `forge-${item.id}`,
              })}
            </button>
          ))}
        </div>

        <button
          className={`hero-sticker sticker-${stickerState} ${isOpen ? 'sticker-open' : ''} ${
            isRipping ? 'sticker-ripping' : ''
          }`}
          type="button"
          aria-label="Animated Q-style character sticker"
          onClick={handleStickerClick}
        >
          {createElement('sticker-forge', {
            id: 'hero-forge',
          })}
        </button>

        <div className="stage-actions" aria-label="Hero actions">
          <a className="primary-action" href="#projects">
            <Sparkles size={18} aria-hidden="true" />
            View Work
          </a>
        </div>

        <div className="social-links" aria-label="Social links">
          <a href="https://github.com/" aria-label="GitHub" target="_blank" rel="noreferrer">
            <Globe size={18} aria-hidden="true" />
          </a>
          <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer">
            <AtSign size={18} aria-hidden="true" />
          </a>
          <a href="https://twitter.com/" aria-label="X" target="_blank" rel="noreferrer">
            <Send size={18} aria-hidden="true" />
          </a>
          <a href="https://www.linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noreferrer">
            <Rss size={18} aria-hidden="true" />
          </a>
          <a href="mailto:hello@example.com" aria-label="Email">
            <Mail size={18} aria-hidden="true" />
          </a>
        </div>

        <a className="scroll-cue" href="#about" aria-label="Scroll to about">
          <ArrowDown size={20} aria-hidden="true" />
        </a>
      </section>

      <section id="about" className="content-band about-band">
        <div className="section-label">About</div>
        <div className="section-content">
          <h2>Character first, then content.</h2>
          <p>
            This version makes the Q-style sticker the first-screen signal. The artwork is an original
            web-ready asset derived from your provided sticker direction, with cursor inertia layered
            around it so the page feels like a living collage.
          </p>
        </div>
      </section>

      <section id="projects" className="content-band projects-band">
        <div className="section-label">Projects</div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-tile" key={project.title}>
              <span>{project.tag}</span>
              <h3>{project.title}</h3>
              <p>{project.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="content-band contact-band">
        <div className="section-label">Contact</div>
        <div className="section-content">
          <h2>Ready for the next layer.</h2>
          <p>
            The next practical step is replacing the single PNG with true separated layers for eyes,
            face, hands, and braids, so the character can blink, look around, and react by section.
          </p>
          <a className="contact-link" href="mailto:hello@example.com">
            <Mail size={18} aria-hidden="true" />
            hello@example.com
          </a>
        </div>
      </section>
    </main>
  );
}
