'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, AtSign, Download, Globe, Mail, MousePointer2, Rss, Send, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Locale = 'zh' | 'en';

type ProjectCopy = {
  title: string;
  tag: string;
  text: string;
  overview: string;
  route: string[];
  outcome: string[];
};

type Project = Record<Locale, ProjectCopy>;

const projects: Project[] = [
  {
    zh: {
      title: '游戏行业日报系统',
      tag: '内容自动化',
      text: '聚合多源游戏资讯，用 AI 评分、分类、去重和翻译，每日自动生成并推送日报。',
      overview: '把散落在微信公众号、海外媒体、播客与 Google News 的行业信息汇到一个可快速浏览的日报中。',
      route: [
        '在本地 Mac 上抓取 75 个微信公众号、海外媒体 RSS、播客和 Google News。',
        '使用 DeepSeek 为候选文章评分、分类、翻译标题和摘要，仅保留高价值内容。',
        '以 URL 与标题去重，合并同一事件的多篇报道，并保留全部来源链接。',
        '通过 LaunchAgent 每天 6:30 运行，推送飞书，同时把 feed.json 同步到 GitHub。',
      ],
      outcome: [
        '每日将大量信息压缩为约 20–40 条可读日报。',
        '支持深度拆解、行业资讯与泛游戏内容三类阅读入口。',
        '用健康检查发现抓取异常，减少无内容日报的风险。',
      ],
    },
    en: {
      title: 'Game Industry Daily',
      tag: 'Content Automation',
      text: 'A daily game-industry brief that collects, ranks, translates, deduplicates, and delivers relevant coverage.',
      overview: 'A focused daily read built from scattered game-industry reporting across Chinese and international sources.',
      route: [
        'Collects 75 WeChat channels, international RSS feeds, podcasts, and Google News on a local Mac.',
        'Uses DeepSeek to score, categorize, and translate titles and summaries, keeping only valuable stories.',
        'Deduplicates by URL and title, then combines coverage of the same event with source links intact.',
        'Runs through LaunchAgent at 6:30 each morning, sends a Feishu update, and syncs feed.json to GitHub.',
      ],
      outcome: [
        'Turns a high-volume news stream into a readable 20–40 item daily brief.',
        'Organizes reading into analysis, industry intelligence, and broader game culture.',
        'Includes health checks to surface collection failures before an empty report is sent.',
      ],
    },
  },
  {
    zh: {
      title: '动态个人形象',
      tag: '角色系统',
      text: '以贴纸为核心的头像系统，支持鼠标跟随、状态切换与可撕互动。',
      overview: '将个人头像从静态图片变成能回应用户动作的网页角色。',
      route: ['使用 React 管理角色开合、提示与交互状态。', '用 CSS 变量和 requestAnimationFrame 制作平滑的鼠标惯性。', '接入 Sticker Forge，为人物和文字提供可撕开的材质效果。'],
      outcome: ['角色可跟随光标微动，并在点击后切换表情。', '贴纸可以被撕开后自动回弹，首屏拥有更强的探索感。'],
    },
    en: {
      title: 'Animated Identity',
      tag: 'Character System',
      text: 'A sticker-led avatar system with cursor following, state changes, and peel interactions.',
      overview: 'Turns a static portrait into a web character that responds to a visitor’s movement.',
      route: ['Uses React to coordinate the character, hint, and interaction states.', 'Combines CSS variables with requestAnimationFrame for eased cursor inertia.', 'Uses Sticker Forge to give the character and type a peelable material treatment.'],
      outcome: ['The character subtly follows the cursor and changes expression on click.', 'Stickers peel and return, giving the first screen a sense of discovery.'],
    },
  },
  {
    zh: {
      title: '会呼吸的作品集',
      tag: '网页体验',
      text: '让个人网站像移动拼贴一样展开，而不是静态的个人资料页。',
      overview: '把作品浏览设计成连续的章节体验，让视觉和内容在滚动中慢慢显现。',
      route: ['使用 Vinext 与 React 搭建可持续迭代的个人网站。', '使用 IntersectionObserver 识别当前章节并同步导航状态。', '用 CSS scroll snap、分层进入和柔和背景光组织页面节奏。'],
      outcome: ['每个章节都能平滑进入视野，信息层次更容易阅读。', '中英内容可在同一套项目详情中切换，无需双列排版。'],
    },
    en: {
      title: 'Living Portfolio',
      tag: 'Web Experience',
      text: 'A personal site that opens like a moving collage instead of a static profile.',
      overview: 'A chapter-based browsing experience where imagery and writing reveal themselves over a scroll.',
      route: ['Built with Vinext and React for an iteratable personal-site foundation.', 'Uses IntersectionObserver to track the current chapter and synchronize navigation.', 'Combines CSS scroll snap, layered reveals, and soft ambient light to set the page rhythm.'],
      outcome: ['Each section settles into view with a clearer information hierarchy.', 'Project details use one language switch instead of parallel bilingual columns.'],
    },
  },
  {
    zh: {
      title: '小型产品实验',
      tag: '交互原型',
      text: '围绕直接交互、鲜明动效和明确用途制作的小型网页实验。',
      overview: '用小而完整的原型快速检验一个想法是否值得继续做下去。',
      route: ['从单一用户动作出发，先定义最小可用的交互闭环。', '在浏览器内迭代动画节奏、反馈状态和响应式布局。', '保留轻量结构，让新的实验可以快速替换和扩展。'],
      outcome: ['每个实验都有可以立即体验的核心动作。', '通过短周期制作积累可复用的界面与动效语言。'],
    },
    en: {
      title: 'Tiny Tools',
      tag: 'Product Experiments',
      text: 'Small web experiments built around direct interaction, expressive motion, and a useful core.',
      overview: 'Compact, complete prototypes that test whether an idea deserves a deeper investment.',
      route: ['Starts with one user action and defines the smallest useful interaction loop.', 'Iterates on motion timing, feedback states, and responsive layouts in the browser.', 'Keeps the structure light so experiments can be replaced and extended quickly.'],
      outcome: ['Each experiment has a core action that can be tried immediately.', 'Short build cycles create reusable interaction and visual patterns.'],
    },
  },
];

const textStickers = [
  { id: 'curious', className: 'text-sticker text-one', label: 'curious' },
  { id: 'making', className: 'text-sticker text-two', label: 'always making' },
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
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [phone, setPhone] = useState('');
  const [resumeUnlocked, setResumeUnlocked] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [showPeelHint, setShowPeelHint] = useState(true);
  const tagTimer = useRef<number | null>(null);
  const [language, setLanguage] = useState<Locale>('zh');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
    const panels = Array.from(document.querySelectorAll<HTMLElement>('.scroll-panel'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.52 },
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
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
        textStickers.map(async (item) => {
          const element = document.getElementById(`forge-${item.id}`) as StickerForgeElement | null;
          if (!element) return;
          await element.setSource({
            type: 'text',
            text: item.label,
            fontFamily: 'Arial Rounded MT Bold, Arial Black, sans-serif',
            fontWeight: 900,
            color: '#3f7186',
          });
          element.setOptions({
            ...forgeOptions,
            outline: { width: 14, color: '#fffdf8' },
            shadow: { ...forgeOptions.shadow, blur: 16, distance: 10 },
            peel: { ...forgeOptions.peel, grabWidth: 22, maxAngle: 3.2 },
            sound: { ...forgeOptions.sound, volume: 0.38 },
            tilt: item.id === 'curious' ? -6 : 5,
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
    setShowPeelHint(false);
    runRipSwitch();
  };

  const handleTextStickerClick = (item: (typeof textStickers)[number]) => {
    setShowPeelHint(false);
    if (tagTimer.current) window.clearTimeout(tagTimer.current);
    const tag = document.getElementById(`forge-${item.id}`) as StickerForgeElement | null;
    tag?.setPeelProgress?.(0.82, {
      origin: { x: 0.9, y: 0.1 },
      target: { x: 1.24, y: -0.12 },
    });
    tagTimer.current = window.setTimeout(() => tag?.reappear?.(), 700);
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

  const unlockResume = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = phone.replace(/[\s()-]/g, '').replace(/^\+86/, '');
    if (!/^1[3-9]\d{9}$/.test(normalized)) {
      setResumeUnlocked(false);
      setResumeError('请输入有效的中国大陆手机号');
      return;
    }
    setResumeError('');
    setResumeUnlocked(true);
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
          <span className="site-name">Li Qiuyue&apos;s website</span>
          <div className="language-switch" aria-label="Project language">
            <button className={language === 'zh' ? 'is-active' : ''} type="button" onClick={() => setLanguage('zh')}>中</button>
            <button className={language === 'en' ? 'is-active' : ''} type="button" onClick={() => setLanguage('en')}>EN</button>
          </div>
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
        <a className={activeSection === 'about' ? 'is-active' : ''} href="#about" aria-current={activeSection === 'about' ? 'page' : undefined}>About</a>
        <a className={activeSection === 'projects' ? 'is-active' : ''} href="#projects" aria-current={activeSection === 'projects' ? 'page' : undefined}>Projects</a>
        <a className={activeSection === 'contact' ? 'is-active' : ''} href="#contact" aria-current={activeSection === 'contact' ? 'page' : undefined}>Contact</a>
      </nav>

      <section id="home" className={`hero-stage scroll-panel ${activeSection === 'home' ? 'is-in-view' : ''}`} aria-label="Animated sticker hero">
        <div className="hero-kicker">01 / PERSONAL FIELD NOTES</div>
        <div className="hero-name" aria-hidden="true">
          <span>Lili</span>
        </div>

        <div className="sticker-orbit" aria-label="Interactive text stickers">
          {textStickers.map((item) => (
            <button
              key={item.id}
              className={`${item.className} peel-sticker`}
              type="button"
              aria-label={`Peel ${item.label} sticker`}
              onClick={() => handleTextStickerClick(item)}
            >
              {createElement('sticker-forge', { id: `forge-${item.id}` })}
            </button>
          ))}
        </div>

        <div className="hero-copy">
          <p>Ideas with a pulse.</p>
          <p>Made to be held, heard, and remembered.</p>
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

        {showPeelHint && (
          <div className="peel-hint" aria-hidden="true">
            <span className="peel-hint-icon"><MousePointer2 size={16} /></span>
            <span>撕开试试</span>
            <i />
          </div>
        )}

        <div className="stage-actions" aria-label="Hero actions">
          <a className="primary-action" href="#projects">
            <Sparkles size={18} aria-hidden="true" />
            Explore work
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

      <section id="about" className={`content-band about-band scroll-panel ${activeSection === 'about' ? 'is-in-view' : ''}`}>
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

      <section id="projects" className={`content-band projects-band scroll-panel ${activeSection === 'projects' ? 'is-in-view' : ''}`}>
        <div className="section-label">Projects</div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-tile" key={project.zh.title}>
              <span>{project[language].tag}</span>
              <h3>{project[language].title}</h3>
              <p>{project[language].text}</p>
              <button className="project-detail-link" type="button" onClick={() => setSelectedProject(project)}>
                {language === 'zh' ? '查看详情' : 'View details'}
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className={`content-band contact-band scroll-panel ${activeSection === 'contact' ? 'is-in-view' : ''}`}>
        <div className="section-label">Contact</div>
        <div className="section-content">
          <h2>Ready for the next layer.</h2>
          <p>
            The next practical step is replacing the single PNG with true separated layers for eyes,
            face, hands, and braids, so the character can blink, look around, and react by section.
          </p>
          <div className="resume-panel">
            <div>
              <span className="resume-eyebrow">RESUME / PDF</span>
              <h3>下载简历</h3>
              <p>填写手机号后获取我的最新简历。</p>
            </div>
            <form className="resume-form" onSubmit={unlockResume}>
              <label htmlFor="resume-phone">手机号</label>
              <div className="resume-input-row">
                <input
                  id="resume-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    if (resumeError) setResumeError('');
                  }}
                />
                <button type="submit">验证</button>
              </div>
              {resumeError && <p className="resume-error" role="alert">{resumeError}</p>}
              {resumeUnlocked && (
                <a className="resume-download" href="/resume.pdf" download>
                  下载 PDF 简历
                  <Download size={17} aria-hidden="true" />
                </a>
              )}
              <p className="resume-note">手机号仅在当前浏览器中用于验证，不会被保存或上传。</p>
            </form>
          </div>
          <a className="contact-link" href="mailto:hello@example.com">
            <Mail size={18} aria-hidden="true" />
            hello@example.com
          </a>
        </div>
      </section>

      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        {selectedProject && (
          <DialogContent className="project-dialog" showCloseButton>
            <DialogHeader>
              <span className="dialog-tag">{selectedProject[language].tag}</span>
              <DialogTitle>{selectedProject[language].title}</DialogTitle>
              <DialogDescription>{selectedProject[language].overview}</DialogDescription>
            </DialogHeader>
            <div className="dialog-language-switch" aria-label="Project detail language">
              <button className={language === 'zh' ? 'is-active' : ''} type="button" onClick={() => setLanguage('zh')}>中文</button>
              <button className={language === 'en' ? 'is-active' : ''} type="button" onClick={() => setLanguage('en')}>English</button>
            </div>
            <div className="project-detail-block">
              <h3>{language === 'zh' ? '技术路线' : 'Technical approach'}</h3>
              <ol>{selectedProject[language].route.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
            <div className="project-detail-block">
              <h3>{language === 'zh' ? '最终成果' : 'Outcome'}</h3>
              <ul>{selectedProject[language].outcome.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </main>
  );
}
