import clsx from 'clsx'
import { ArrowRight, Check, ChevronDown, Menu, Minus, Play, Scissors, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EngagementChart, Logo, Score, Segmented, SocialTag, Thumb, Toggle } from '../components/ui'
import { engagementSeries, fmtTime } from '../lib/data'

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <Nav />
      <main>
        <Hero />
        <Proof />
        <HowItWorks />
        <Detection />
        <Captions />
        <Reframe />
        <Autopost />
        <Stats />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  const links = [
    ['Product', '#product'],
    ['How it works', '#how'],
    ['Pricing', '#pricing'],
    ['FAQ', '#faq'],
  ]
  return (
    <header className="sticky z-40" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className={clsx('transition-[background,border-color,backdrop-filter] duration-200', scrolled || open ? 'border-b hairline bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent')}>
        <div className="container-x flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" aria-label="Cutline home">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {links.map(([l, h]) => (
                <a key={h} href={h} className="nav-link">
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/app" className="btn-quiet">
              Log in
            </Link>
            <Link to="/app" className="btn-primary btn-sm">
              Start clipping
            </Link>
          </div>
          <button className="btn-quiet md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <div className="container-x flex flex-col gap-1 pb-4 md:hidden">
            {links.map(([l, h]) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-fg-muted hover:bg-white/5 hover:text-fg">
                {l}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Link to="/app" className="btn-ghost flex-1">
                Log in
              </Link>
              <Link to="/app" className="btn-primary flex-1">
                Start clipping
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

/* ---------------- HERO ---------------- */

const heroPeaks = [0.14, 0.31, 0.47, 0.62, 0.79, 0.9]
const heroScores = [72, 88, 97, 81, 94, 77]

function Hero() {
  const series = engagementSeries(7, 180, heroPeaks)
  const [found, setFound] = useState(heroPeaks.length)
  const [scan, setScan] = useState(1)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let t0 = performance.now()
    const loop = (t: number) => {
      const p = ((t - t0) / 9000) % 1
      setScan(p)
      setFound(heroPeaks.filter((x) => x < p).length)
      raf = requestAnimationFrame(loop)
    }
    const start = setTimeout(() => {
      t0 = performance.now()
      raf = requestAnimationFrame(loop)
    }, 1200)
    return () => {
      clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [])
  const markers = heroPeaks.map((at, i) => ({ at, score: heroScores[i], id: String(i) })).filter((_, i) => i < found)

  return (
    <section className="relative pt-14 sm:pt-20">
      <div className="container-x">
        <div className="max-w-3xl">
          <a href="#product" className="rise inline-flex items-center gap-2 rounded-full border hairline bg-white/[0.04] py-1 pl-1 pr-3 text-xs text-fg-muted backdrop-blur hover:text-fg">
            <span className="rounded-full bg-ember/15 px-2 py-0.5 font-medium text-ember-300">New</span>
            Live clipping now works on Kick
            <ArrowRight size={12} />
          </a>
          <h1 className="display rise mt-6 text-[44px] font-semibold leading-[0.98] sm:text-[64px] lg:text-[76px]" style={{ animationDelay: '60ms' }}>
            Your stream,
            <br />
            <span className="text-fg-muted">clipped while you sleep.</span>
          </h1>
          <p className="rise mt-6 max-w-xl text-[17px] leading-relaxed text-fg-muted" style={{ animationDelay: '120ms' }}>
            Cutline watches every hour of your Twitch, YouTube and Kick streams, finds the moments chat lost it, and turns them into captioned vertical clips for TikTok, Shorts and Reels.
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '180ms' }}>
            <Link to="/app" className="btn-primary px-5 py-3 text-[15px]">
              Start clipping free <ArrowRight size={16} />
            </Link>
            <Link to="/app" className="btn-ghost px-5 py-3 text-[15px]">
              <Play size={15} className="fill-current" /> Open the demo
            </Link>
          </div>
          <p className="mt-4 text-xs text-fg-dim">Free for 10 clips a month. No card needed.</p>
        </div>

        {/* Product mock */}
        <div id="product" className="relative mt-14 scroll-mt-24 sm:mt-20">
          <div className="glass-strong overflow-hidden rounded-[22px]">
            <div className="flex items-center justify-between gap-3 border-b hairline px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-live/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#ff7a7a]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" /> Live
                </span>
                <p className="truncate text-sm text-fg">Elden Ring DLC blind, final boss attempts</p>
                <span className="hidden text-xs text-fg-dim sm:inline">nova_plays · Twitch</span>
              </div>
              <span className="num shrink-0 text-xs text-fg-muted">{fmtTime(Math.round(scan * 24082))} / 6:41:22</span>
            </div>
            <div className="grid gap-0 lg:grid-cols-[1fr_380px]">
              <div className="min-w-0 border-b hairline p-4 sm:p-6 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Chat velocity · msgs/min</p>
                  <p className="num text-xs text-fg-muted">
                    <span className="text-ember-300">{found}</span> moments found
                  </p>
                </div>
                <div className="relative mt-6">
                  <EngagementChart series={series} markers={markers} height={170} playhead={scan} />
                </div>
                <div className="num mt-2 flex justify-between text-[10px] text-fg-dim">
                  {['0:00', '1:40', '3:20', '5:00', '6:41'].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                  {[
                    ['Audio peaks', '41'],
                    ['Emote bursts', '128'],
                    ['Viewer spikes', '9'],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg border hairline bg-black/20 px-3 py-2">
                      <p className="text-fg-dim">{k}</p>
                      <p className="num mt-0.5 text-base text-fg">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="eyebrow">Rendering · 9:16</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { h: 18, c: '1v4 CLUTCH WITH 3 HP', hl: 'clutch', s: 97, st: 'Ready' },
                    { h: 350, c: 'HE ONE-SHOTS ME AT 1%', hl: '1%', s: 94, st: 'Ready' },
                    { h: 32, c: 'MOM WALKS IN', hl: 'mom', s: 88, st: '62%' },
                  ].map((x, i) => (
                    <div key={i} className="min-w-0">
                      <Thumb hue={x.h} caption={x.c} highlight={x.hl} captionClass="text-[10px] sm:text-[12px]" className="ring-1 ring-white/10" />
                      <div className="mt-2 flex items-center justify-between gap-1">
                        <Score value={x.s} size="sm" />
                        <span className={clsx('num text-[10px]', x.st === 'Ready' ? 'text-ok' : 'text-fg-dim')}>{x.st}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t hairline pt-4">
                  <span className="text-xs text-fg-dim">Auto-post to</span>
                  <SocialTag s="tiktok" />
                  <SocialTag s="shorts" />
                  <SocialTag s="reels" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Proof() {
  const names = ['nova_plays', 'kaiyo', 'ZETTA', 'loafcat', 'mxrcy', 'thedrewshow', 'SOLSTICE']
  return (
    <section className="py-16">
      <div className="container-x">
        <p className="text-center text-xs text-fg-dim">Clipping for 2,400+ streamers, from 50 viewers to 50,000</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {names.map((n) => (
            <span key={n} className="font-display text-lg font-semibold tracking-[-0.02em] text-fg/35">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="max-w-xl">
      <p className="eyebrow text-ember-300">{eyebrow}</p>
      <h2 className="display mt-3 text-[32px] font-semibold leading-[1.05] sm:text-[42px]">{title}</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">{body}</p>
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { t: 'Connect your channel', d: 'Sign in with Twitch, YouTube or Kick. Cutline picks up new VODs and live streams on its own.', ui: <StepConnect /> },
    { t: 'It finds the moments', d: 'Chat velocity, audio peaks, emote bursts and transcript cues get scored minute by minute.', ui: <StepDetect /> },
    { t: 'Clips go out on schedule', d: 'Captioned, reframed to 9:16 and queued for the hours your audience is actually awake.', ui: <StepPost /> },
  ]
  return (
    <section id="how" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x">
        <SectionIntro eyebrow="How it works" title="Set it up once. Wake up to clips." body="No uploading, no scrubbing through six-hour VODs. Connect a channel and Cutline does the rest after every stream." />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} className="glass flex flex-col rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <span className="num flex h-6 w-6 items-center justify-center rounded-md border hairline text-[11px] text-fg-muted">{i + 1}</span>
                <h3 className="font-medium">{s.t}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{s.d}</p>
              <div className="mt-5 flex-1 rounded-xl border hairline bg-black/25 p-3">{s.ui}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function StepConnect() {
  const rows = [
    { n: 'Twitch', c: '#A970FF', on: true },
    { n: 'YouTube', c: '#FF4E45', on: true },
    { n: 'Kick', c: '#53FC18', on: false },
  ]
  const [state, setState] = useState(rows.map((r) => r.on))
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r, i) => (
        <div key={r.n} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: r.c }} />
            {r.n}
          </span>
          <Toggle label={`Connect ${r.n}`} checked={state[i]} onChange={(v) => setState(state.map((x, j) => (j === i ? v : x)))} />
        </div>
      ))}
    </div>
  )
}

function StepDetect() {
  return (
    <div>
      <EngagementChart series={engagementSeries(3, 80, [0.3, 0.72])} markers={[{ at: 0.3, score: 91, id: 'a' }, { at: 0.72, score: 84, id: 'b' }]} height={92} />
      <div className="num mt-3 flex justify-between text-[10px] text-fg-dim">
        <span>2:14:00</span>
        <span>2:44:00</span>
      </div>
    </div>
  )
}

function StepPost() {
  const q = [
    ['6:00 PM', 'tiktok', '1v4 clutch with 3 HP'],
    ['8:15 PM', 'shorts', 'Boss one-shots him at 1%'],
    ['9:30 PM', 'reels', 'Mom walks in mid-read'],
  ] as const
  return (
    <div className="flex flex-col gap-2">
      {q.map(([t, s, c]) => (
        <div key={t} className="flex items-center gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
          <span className="num w-16 shrink-0 text-xs text-fg-dim">{t}</span>
          <span className="min-w-0 flex-1 truncate">{c}</span>
          <SocialTag s={s} />
        </div>
      ))}
    </div>
  )
}

function FeatureRow({ flip, intro, children, bullets }: { flip?: boolean; intro: { eyebrow: string; title: string; body: string }; bullets: string[]; children: React.ReactNode }) {
  return (
    <section className="py-14 sm:py-20">
      <div className={clsx('container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16')}>
        <div className={clsx(flip && 'lg:order-2')}>
          <SectionIntro {...intro} />
          <ul className="mt-6 flex flex-col gap-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-fg-muted">
                <Check size={16} className="mt-0.5 shrink-0 text-ember" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className={clsx('min-w-0', flip && 'lg:order-1')}>{children}</div>
      </div>
    </section>
  )
}

function Detection() {
  const signals = [
    { k: 'Chat velocity', v: '14.2×', w: 92 },
    { k: 'Audio loudness', v: '+18 dB', w: 78 },
    { k: 'Emote burst', v: '4,180 LUL', w: 70 },
    { k: 'Transcript cue', v: '"NO WAY"', w: 55 },
  ]
  return (
    <FeatureRow
      intro={{ eyebrow: 'Highlight detection', title: 'It reads the room, not just the audio.', body: 'Every minute of your stream gets a score from four signals. A spike in one is noise. A spike in three at once is a clip.' }}
      bullets={['Tuned per channel. A 200-viewer stream and a 30K stream spike differently.', 'Finds 30+ moments in a 6-hour VOD in under 10 minutes.', 'Every clip shows why it was picked, so you can trust or skip it fast.']}
    >
      <div className="glass-strong rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Moment at 2:14:17</p>
            <p className="mt-1.5 truncate font-medium">1v4 clutch with 3 HP to win the match</p>
          </div>
          <Score value={97} size="lg" />
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {signals.map((s) => (
            <div key={s.k}>
              <div className="flex justify-between text-xs">
                <span className="text-fg-muted">{s.k}</span>
                <span className="num text-fg">{s.v}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full rounded-full bg-gradient-to-r from-ember-600 to-ember-300" style={{ width: `${s.w}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-lg border hairline bg-black/25 p-3 font-mono text-[11px] leading-relaxed text-fg-dim">
          <span className="text-fg-muted">chat</span> 2:14:15 <span className="text-[#c9a7ff]">xqzn</span>: NO SHOT
          <br />
          <span className="text-fg-muted">chat</span> 2:14:16 <span className="text-[#7fd3ff]">milo_</span>: CLIP IT CLIP IT
          <br />
          <span className="text-fg-muted">chat</span> 2:14:16 <span className="text-[#ffb37f]">dree</span>: LUL LUL LUL LUL
        </div>
      </div>
    </FeatureRow>
  )
}

const captionStyles = [
  { id: 'punch', name: 'Punch', cls: 'font-display font-extrabold uppercase', hl: 'text-ember' },
  { id: 'clean', name: 'Clean', cls: 'font-sans font-semibold normal-case', hl: 'text-white bg-ember/90 px-1 rounded' },
  { id: 'mono', name: 'Mono', cls: 'font-mono font-medium uppercase tracking-tight', hl: 'text-[#FFD36B]' },
]

function Captions() {
  const words = ['bro', 'HOW', 'did', 'that', 'not', 'kill', 'me']
  const [style, setStyle] = useState('punch')
  const [w, setW] = useState(1)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setW((x) => (x + 1) % words.length), 420)
    return () => clearInterval(t)
  }, [])
  const s = captionStyles.find((c) => c.id === style)!
  return (
    <FeatureRow
      flip
      intro={{ eyebrow: 'Auto-captions', title: 'Word-by-word captions that keep up with you.', body: 'Transcribed with timing to the syllable, then styled the way short-form viewers expect. Slang, gamer tags and emote names included.' }}
      bullets={['97% word accuracy on fast, overlapping speech.', 'Profanity filter per platform, so TikTok stays happy.', 'Save your own style once and every clip uses it.']}
    >
      <div className="glass-strong grid gap-5 rounded-2xl p-5 sm:grid-cols-[200px_1fr]">
        <div className="mx-auto w-[180px] sm:w-full">
          <Thumb hue={200} layout="facecam">
            <div className="absolute inset-x-[8%] top-[58%] text-center">
              <p className={clsx('text-[19px] leading-[1.1] text-white [text-shadow:0_2px_0_rgba(0,0,0,.7)]', s.cls)}>
                {words.map((x, i) => (
                  <span key={i} className={clsx('transition-colors', i === w && s.hl)}>
                    {x}{' '}
                  </span>
                ))}
              </p>
            </div>
          </Thumb>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <p className="eyebrow">Style</p>
            <div className="mt-2">
              <Segmented value={style} onChange={setStyle} options={captionStyles.map((c) => ({ value: c.id, label: c.name }))} />
            </div>
          </div>
          <div className="rounded-lg border hairline bg-black/25 p-3">
            <p className="eyebrow">Transcript</p>
            <div className="num mt-2 flex flex-col gap-1.5 text-xs">
              {[
                ['00:03.12', 'bro'],
                ['00:03.31', 'HOW'],
                ['00:03.58', 'did that not'],
                ['00:04.02', 'kill me'],
              ].map(([t, x]) => (
                <div key={t} className="flex gap-3">
                  <span className="text-fg-dim">{t}</span>
                  <span className="font-sans text-fg-muted">{x}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-fg-dim">
            <span className="chip">English</span>
            <span className="chip">Español</span>
            <span className="chip">Português</span>
            <span className="chip">+ 27</span>
          </div>
        </div>
      </div>
    </FeatureRow>
  )
}

function Reframe() {
  const [layout, setLayout] = useState<'facecam' | 'split' | 'gameplay'>('split')
  return (
    <FeatureRow
      intro={{ eyebrow: 'Smart reframe', title: 'From 16:9 to 9:16 without losing your face or the fight.', body: 'Cutline tracks your face cam and the action on screen, then picks the layout that keeps both readable on a phone.' }}
      bullets={['Split, face-cam overlay or full gameplay, chosen per clip.', 'Follows the crosshair, the cursor or the speaker.', 'Override any clip in two clicks.']}
    >
      <div className="glass-strong rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">Layout</p>
          <Segmented
            size="sm"
            value={layout}
            onChange={setLayout}
            options={[
              { value: 'split', label: 'Split' },
              { value: 'facecam', label: 'Face cam' },
              { value: 'gameplay', label: 'Gameplay' },
            ]}
          />
        </div>
        <div className="mt-5 grid grid-cols-[1.9fr_1fr] items-center gap-4">
          <div className="relative aspect-video overflow-hidden rounded-lg" style={{ background: 'radial-gradient(80% 80% at 30% 30%, hsl(18 70% 46%), transparent 60%), hsl(218 50% 14%)' }}>
            <div className="absolute right-[4%] top-[6%] aspect-[4/3] w-[22%] rounded border border-white/25 bg-gradient-to-b from-[#3a2a22] to-[#120c0a]" />
            <div className="absolute inset-y-0 left-[36%] w-[28%] border-x-2 border-dashed border-ember/80 bg-ember/10" />
            <span className="num absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-fg-muted">1920×1080</span>
          </div>
          <div className="mx-auto w-full max-w-[150px]">
            <Thumb hue={18} layout={layout} />
            <p className="num mt-2 text-center text-[10px] text-fg-dim">1080×1920</p>
          </div>
        </div>
      </div>
    </FeatureRow>
  )
}

function Autopost() {
  return (
    <FeatureRow
      flip
      intro={{ eyebrow: 'Auto-posting', title: 'Posts while you’re offline, at the hours that work.', body: 'Connect TikTok, YouTube and Instagram once. Cutline spaces your best clips across the week and writes titles and hashtags for each platform.' }}
      bullets={['Learns your best posting windows from past views.', 'Approve each clip, or let anything above your score threshold go out.', 'One clip, three platforms, three captions.']}
    >
      <div className="glass-strong rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <p className="eyebrow">This week</p>
          <span className="text-xs text-fg-muted">
            <span className="num text-fg">9</span> scheduled
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-center text-[10px] text-fg-dim">{d}</span>
              {Array.from({ length: [2, 2, 1, 2, 0, 1, 1][i] }).map((_, j) => (
                <div key={j} className={clsx('h-9 rounded-md border', (i + j) % 3 === 0 ? 'border-ember/40 bg-ember/20' : 'hairline bg-white/[0.05]')} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border hairline bg-black/25 p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 shrink-0">
              <Thumb hue={350} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">He one-shots me at 1% HP</p>
              <p className="mt-0.5 truncate text-xs text-fg-dim">#eldenring #gaming #fyp · Thu 7:00 PM</p>
            </div>
            <SocialTag s="tiktok" />
          </div>
        </div>
      </div>
    </FeatureRow>
  )
}

function Stats() {
  const s = [
    ['3.1M', 'clips cut'],
    ['412K', 'stream hours watched'],
    ['8 min', 'median time from VOD to clip'],
    ['2.4B', 'views on posted clips'],
  ]
  return (
    <section className="py-16">
      <div className="container-x">
        <div className="glass grid grid-cols-2 divide-white/[0.07] rounded-2xl md:grid-cols-4 md:divide-x">
          {s.map(([v, l], i) => (
            <div key={l} className={clsx('px-5 py-6 sm:px-7', i < 2 && 'border-b hairline md:border-b-0')}>
              <p className="num text-[28px] font-medium tracking-tight sm:text-[34px]">{v}</p>
              <p className="mt-1 text-xs text-fg-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- PRICING ---------------- */

const plans = [
  { name: 'Free', m: 0, desc: 'Try it on your next stream.', cta: 'Start free', feats: ['10 clips / month', '1 connected channel', 'Auto-captions', 'Cutline watermark'] },
  { name: 'Creator', m: 29, desc: 'For streamers posting every day.', cta: 'Start 7-day trial', popular: true, feats: ['300 clips / month', '3 connected channels', 'Auto-posting to all platforms', 'Custom caption styles', 'No watermark', 'Live clipping'] },
  { name: 'Agency', m: 99, desc: 'For clippers and teams running many channels.', cta: 'Talk to us', feats: ['Unlimited clips', '25 connected channels', 'Team seats and roles', 'Approval workflows', 'API access', 'Priority rendering'] },
]

const compare: [string, (string | boolean)[]][] = [
  ['Clips per month', ['10', '300', 'Unlimited']],
  ['Connected channels', ['1', '3', '25']],
  ['Max export quality', ['720p', '1080p 60fps', '4K']],
  ['Live clipping', [false, true, true]],
  ['Auto-posting', [false, true, true]],
  ['Brand kit and caption presets', [false, true, true]],
  ['Team seats', ['1', '1', '10 included']],
  ['API and webhooks', [false, false, true]],
]

function Pricing() {
  const [annual, setAnnual] = useState(true)
  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionIntro eyebrow="Pricing" title="Pay for clips, not seats." body="Start free. Upgrade when you're posting every day." />
          <Segmented
            value={annual ? 'y' : 'm'}
            onChange={(v) => setAnnual(v === 'y')}
            options={[
              { value: 'm', label: 'Monthly' },
              { value: 'y', label: <span>Annual <span className="text-ember-300">−20%</span></span> },
            ]}
          />
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => {
            const price = annual ? Math.round(p.m * 0.8) : p.m
            return (
              <div key={p.name} className={clsx('relative flex flex-col rounded-2xl p-6', p.popular ? 'glass-strong ring-1 ring-ember/40' : 'glass')}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{p.name}</h3>
                  {p.popular && <span className="rounded-md bg-ember/15 px-2 py-0.5 text-[11px] font-medium text-ember-300">Most picked</span>}
                </div>
                <p className="mt-1 text-sm text-fg-muted">{p.desc}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="num text-[40px] font-medium tracking-tight">${price}</span>
                  <span className="text-sm text-fg-dim">/ month</span>
                </p>
                <p className="h-4 text-xs text-fg-dim">{annual && p.m > 0 ? `$${price * 12} billed yearly` : ''}</p>
                <Link to="/app" className={clsx('mt-6', p.popular ? 'btn-primary' : 'btn-ghost')}>
                  {p.cta}
                </Link>
                <ul className="mt-6 flex flex-col gap-2.5 border-t hairline pt-6">
                  {p.feats.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-fg-muted">
                      <Check size={15} className="mt-0.5 shrink-0 text-ember" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="glass mt-10 overflow-x-auto rounded-2xl scroll-thin">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b hairline text-left">
                <th className="px-5 py-4 font-medium text-fg-muted">Compare plans</th>
                {plans.map((p) => (
                  <th key={p.name} className={clsx('px-5 py-4 font-medium', p.popular && 'text-ember-300')}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map(([k, vals]) => (
                <tr key={k} className="border-b hairline last:border-0">
                  <td className="px-5 py-3 text-fg-muted">{k}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="num px-5 py-3 text-[13px]">
                      {v === true ? <Check size={15} className="text-ember" /> : v === false ? <Minus size={15} className="text-fg-dim" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const faqs = [
  ['Do I need to download my VODs?', 'No. Cutline pulls VODs straight from Twitch, YouTube and Kick once you connect your channel. For live streams it clips in near real time, usually within 3 minutes of the moment.'],
  ['Can I clip other streamers’ content?', 'Only with permission. Agency plans can add channels you manage or have written permission to clip. Each channel owner approves access from their own account.'],
  ['How does it decide what’s a good clip?', 'Each minute gets scored on chat velocity, audio loudness, emote bursts and transcript cues, compared with that channel’s normal baseline. Clips above your threshold are kept and ranked by score.'],
  ['Will captions handle gamer slang and emotes?', 'Yes. The transcription model is tuned on streaming audio and knows common emotes, game terms and your own custom words, which you can add in settings.'],
  ['What happens if I go over my clip limit?', 'Clipping pauses until your next cycle, or you can buy a 100-clip top-up for $8. Nothing is deleted.'],
  ['Can I cancel anytime?', 'Yes, from Settings → Billing. You keep access until the end of the period and can export every clip you made.'],
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className="container-x grid gap-10 lg:grid-cols-[360px_1fr]">
        <SectionIntro eyebrow="FAQ" title="Questions streamers ask us." body="Something else? Message us from the app and a real person answers, usually within an hour." />
        <div className="glass divide-y divide-white/[0.07] rounded-2xl">
          {faqs.map(([q, a], i) => (
            <div key={q}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember/50">
                {q}
                <ChevronDown size={16} className={clsx('shrink-0 text-fg-dim transition-transform', open === i && 'rotate-180')} />
              </button>
              <div className={clsx('grid transition-[grid-template-rows] duration-200', open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <p className="max-w-[62ch] px-5 pb-5 text-sm leading-relaxed text-fg-muted">{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="glass-strong relative overflow-hidden rounded-[24px] px-6 py-14 sm:px-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-ember/25 blur-3xl" />
          <div className="relative max-w-2xl">
            <Scissors className="text-ember" size={22} />
            <h2 className="display mt-5 text-[34px] font-semibold leading-[1.02] sm:text-[48px]">Your next stream is already full of clips.</h2>
            <p className="mt-4 text-fg-muted">Connect your channel in under a minute. Your first clips are ready before you finish your outro.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app" className="btn-primary px-5 py-3 text-[15px]">
                Start clipping free <ArrowRight size={16} />
              </Link>
              <Link to="/app" className="btn-ghost px-5 py-3 text-[15px]">
                <Sparkles size={15} /> Explore the demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const cols = [
    ['Product', ['Highlight detection', 'Auto-captions', 'Smart reframe', 'Auto-posting', 'Changelog']],
    ['Use cases', ['Streamers', 'Clip channels', 'Agencies', 'Esports teams']],
    ['Company', ['About', 'Careers', 'Contact', 'Press kit']],
    ['Legal', ['Terms', 'Privacy', 'Creator permissions', 'DMCA']],
  ] as const
  return (
    <footer className="border-t hairline pb-10 pt-14">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-3 max-w-[260px] text-sm text-fg-dim">Automatic clipping for Twitch, YouTube and Kick streamers.</p>
        </div>
        {cols.map(([h, items]) => (
          <div key={h}>
            <p className="text-xs font-medium text-fg">{h}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-fg-dim transition hover:text-fg">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x mt-12 flex flex-wrap items-center justify-between gap-3 text-xs text-fg-dim">
        <span>© 2026 Cutline, Inc.</span>
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" /> All systems normal
        </span>
      </div>
    </footer>
  )
}
