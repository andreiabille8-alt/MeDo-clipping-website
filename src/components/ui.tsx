import clsx from 'clsx'
import { ReactNode, useId } from 'react'
import { cropX, YouTubeLayer } from './ClipVideo'
import { Platform, platformMeta, Social, socialMeta, StreamStatus } from '../lib/data'

export function Logo({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
  return (
    <span className={clsx('inline-flex items-center gap-2 font-display text-[17px] font-semibold tracking-[-0.03em]', className)}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#FF6A1F" />
        <path d="M8 6v12M16 6v12" stroke="#1a0a02" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M5 12h14" stroke="#1a0a02" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2.2 3.2" />
      </svg>
      {!iconOnly && 'Cutline'}
    </span>
  )
}

type ClipSource = { poster: string; focus: number; yt: { id: string; start: number; end: number } }

/**
 * A vertical 9:16 clip frame. With `clip` it shows the real poster frame (and plays the footage while `playing`);
 * without it, it's drawn with gradients, which the marketing page uses.
 */
export function Thumb({
  hue,
  caption,
  highlight,
  className,
  layout = 'facecam',
  captionClass = 'text-[13px]',
  children,
  clip,
  playing,
  muted,
  restart,
  onTime,
}: {
  captionClass?: string
  hue: number
  caption?: string
  highlight?: string
  className?: string
  layout?: 'facecam' | 'gameplay' | 'split'
  children?: ReactNode
  clip?: ClipSource
  playing?: boolean
  muted?: boolean
  restart?: number
  onTime?: (t: number) => void
}) {
  if (clip) {
    const words = caption?.split(' ') ?? []
    return (
      <div className={clsx('relative aspect-[9/16] w-full max-w-full overflow-hidden rounded-xl bg-black', className)}>
        <img src={clip.poster} alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: `${cropX(clip.focus) * 100}% 50%` }} />
        {playing !== undefined && <YouTubeLayer src={clip} playing={playing} muted={muted} restart={restart} onTime={onTime} />}
        {caption && (
          <div className={clsx('pointer-events-none absolute inset-x-[8%] text-center', layout === 'split' ? 'top-[40%]' : 'top-[62%]')}>
            <p className={clsx('font-display font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white [text-shadow:0_2px_0_rgba(0,0,0,.75),0_0_12px_rgba(0,0,0,.5)]', captionClass)}>
              {words.map((w, i) => (
                <span key={i} className={clsx(w.replace(/[^\w']/g, '').toLowerCase() === highlight?.toLowerCase() && 'text-ember')}>
                  {w}{' '}
                </span>
              ))}
            </p>
          </div>
        )}
        {children}
      </div>
    )
  }
  const a = `hsl(${hue} 58% 42%)`
  const b = `hsl(${(hue + 40) % 360} 45% 20%)`
  const c = `hsl(${(hue + 200) % 360} 50% 14%)`
  const words = caption?.split(' ') ?? []
  return (
    <div
      className={clsx('relative aspect-[9/16] w-full max-w-full overflow-hidden rounded-xl', className)}
      style={{ background: `radial-gradient(120% 70% at 30% 20%, ${a}, transparent 60%), radial-gradient(90% 60% at 80% 80%, ${b}, transparent 70%), ${c}` }}
    >
      {/* fake HUD lines to read as gameplay */}
      <div className="absolute inset-x-[12%] top-[38%] h-px bg-white/15" />
      <div className="absolute left-[18%] top-[30%] h-[22%] w-[38%] rotate-[-8deg] rounded-[40%] border border-white/10" />
      <div className="absolute bottom-[8%] left-[6%] h-1 w-[30%] rounded-full bg-white/25" />
      <div className="absolute bottom-[8%] left-[6%] h-1 w-[18%] rounded-full bg-white/70" />
      {layout === 'split' && <div className="absolute inset-x-0 top-1/2 h-1/2 border-t border-white/20 bg-black/35" />}
      {layout !== 'gameplay' && (
        <div
          className={clsx(
            'absolute overflow-hidden border border-white/25 bg-gradient-to-b from-[#3a2a22] to-[#120c0a]',
            layout === 'split' ? 'inset-x-0 bottom-0 top-1/2 rounded-none border-0' : 'right-[7%] top-[7%] aspect-[4/3] w-[34%] rounded-md',
          )}
        >
          <div className="absolute left-1/2 top-[30%] aspect-square w-[34%] -translate-x-1/2 rounded-full bg-[#c8977c]/80" />
          <div className="absolute bottom-0 left-1/2 h-[34%] w-[66%] -translate-x-1/2 rounded-t-full bg-[#2b2b33]" />
        </div>
      )}
      {caption && (
        <div className={clsx('absolute inset-x-[8%] text-center', layout === 'split' ? 'top-[40%]' : 'top-[60%]')}>
          <p className={clsx('font-display font-bold uppercase leading-[1.05] tracking-[-0.01em] text-white [text-shadow:0_2px_0_rgba(0,0,0,.6)]', captionClass)}>
            {words.map((w, i) => (
              <span key={i} className={clsx(w.replace(/[^\w']/g, '').toLowerCase() === highlight?.toLowerCase() && 'text-ember')}>
                {w}{' '}
              </span>
            ))}
          </p>
        </div>
      )}
      {children}
    </div>
  )
}

export function Score({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const tone = value >= 90 ? 'text-[#1a0a02] bg-ember' : value >= 80 ? 'text-ember-300 bg-ember/15 border border-ember/30' : 'text-fg-muted bg-white/[0.05] border hairline'
  return (
    <span
      title="Virality score"
      className={clsx(
        'num inline-flex items-center justify-center rounded-md font-medium',
        tone,
        size === 'sm' && 'h-5 min-w-[28px] px-1 text-[11px]',
        size === 'md' && 'h-6 min-w-[34px] px-1.5 text-xs',
        size === 'lg' && 'h-8 min-w-[44px] px-2 text-sm',
      )}
    >
      {value}
    </span>
  )
}

export function PlatformTag({ p, withLabel = true }: { p: Platform; withLabel?: boolean }) {
  const m = platformMeta[p]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
      <span className="h-2 w-2 rounded-[3px]" style={{ background: m.color }} />
      {withLabel && m.label}
    </span>
  )
}

export function SocialTag({ s }: { s: Social }) {
  const m = socialMeta[s]
  return (
    <span className="chip">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

export function StatusPill({ status, progress }: { status: StreamStatus; progress?: number }) {
  if (status === 'live')
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-live/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#ff7a7a]">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" /> Live
      </span>
    )
  if (status === 'processing')
    return (
      <span className="inline-flex items-center gap-2 text-xs text-ember-300">
        <span className="relative h-1 w-14 overflow-hidden rounded-full bg-white/10">
          <span className="absolute inset-y-0 left-0 rounded-full bg-ember" style={{ width: `${progress ?? 0}%` }} />
        </span>
        <span className="num">{progress}%</span>
      </span>
    )
  if (status === 'queued') return <span className="chip">Queued</span>
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Done
    </span>
  )
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative h-5 w-9 shrink-0 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60',
        checked ? 'border-ember/60 bg-ember' : 'hairline bg-white/10',
      )}
    >
      <span className={clsx('absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
    </button>
  )
}

export function Segmented<T extends string>({ value, onChange, options, size = 'md' }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; size?: 'sm' | 'md' }) {
  return (
    <div className="inline-flex rounded-[10px] border hairline bg-black/20 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={clsx(
            'rounded-[8px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-[13px]',
            value === o.value ? 'bg-white/[0.1] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,.08)]' : 'text-fg-muted hover:text-fg',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Chat-velocity area chart with highlight markers. */
export function EngagementChart({
  series,
  markers = [],
  height = 120,
  playhead,
  onMarker,
  activeMarker,
  className,
}: {
  series: number[]
  markers?: { at: number; score: number; id: string }[]
  height?: number
  playhead?: number
  onMarker?: (id: string) => void
  activeMarker?: string
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const w = 1000
  const h = 100
  const pts = series.map((v, i) => [(i / (series.length - 1)) * w, h - v * (h - 8)] as const)
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${w},${h} L0,${h} Z`
  return (
    <div className={clsx('relative w-full', className)} style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FF6A1F" stopOpacity="0.38" />
            <stop offset="1" stopColor="#FF6A1F" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(255,240,230,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={`url(#g${id})`} />
        <path d={line} fill="none" stroke="#FF8A4C" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      {markers.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onMarker?.(m.id)}
          aria-label={`Highlight, score ${m.score}`}
          className="group absolute top-0 flex h-full -translate-x-1/2 flex-col items-center focus-visible:outline-none"
          style={{ left: `${m.at * 100}%` }}
        >
          <span
            className={clsx(
              'num -mt-2.5 rounded px-1 text-[10px] font-medium transition',
              activeMarker === m.id ? 'bg-ember text-[#1a0a02]' : 'bg-ink-700/90 text-ember-300 ring-1 ring-ember/30 group-hover:bg-ember group-hover:text-[#1a0a02]',
            )}
          >
            {m.score}
          </span>
          <span className={clsx('w-px flex-1 transition', activeMarker === m.id ? 'bg-ember' : 'bg-ember/35 group-hover:bg-ember')} />
        </button>
      ))}
      {playhead !== undefined && <div className="pointer-events-none absolute inset-y-0 w-px bg-white/70" style={{ left: `${playhead * 100}%` }} />}
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('glass rounded-2xl', className)}>{children}</div>
}

export function SectionHead({ title, action, sub }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-sm font-medium text-fg">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-fg-dim">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
