import clsx from 'clsx'
import { ArrowLeft, Calendar, Check, Download, Loader2, Pause, Play, RotateCcw, Sparkles } from 'lucide-react'
import { PointerEvent as RPE, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Score, Segmented, Thumb, Toggle } from '../../components/ui'
import { clips, fmtTime, Social, socialMeta, streams } from '../../lib/data'

const styles = [
  { id: 'punch', name: 'Punch', cls: 'font-display font-extrabold uppercase', hl: 'text-ember' },
  { id: 'clean', name: 'Clean', cls: 'font-sans font-semibold', hl: 'bg-ember/90 rounded px-1' },
  { id: 'mono', name: 'Mono', cls: 'font-mono font-medium uppercase', hl: 'text-[#FFD36B]' },
  { id: 'outline', name: 'Outline', cls: 'font-display font-bold uppercase [-webkit-text-stroke:1px_#000]', hl: 'text-[#7CF3FF]' },
]

export default function Editor() {
  const { clipId } = useParams()
  const clip = clips.find((c) => c.id === clipId) ?? clips[1]
  const stream = streams.find((s) => s.id === clip.streamId)!

  const window_ = 90 // seconds of source shown on the trim strip
  const srcStart = clip.start - 25
  const [range, setRange] = useState<[number, number]>([25, 25 + clip.length])
  const [style, setStyle] = useState('punch')
  const [layout, setLayout] = useState<'split' | 'facecam' | 'gameplay'>('split')
  const [platform, setPlatform] = useState<Social>('tiktok')
  const [titles, setTitles] = useState<Record<Social, string>>({
    tiktok: `${clip.title} #gaming #fyp`,
    shorts: `${clip.title} | ${stream.game}`,
    reels: `${clip.title}. Watch till the end`,
  })
  const [emojis, setEmojis] = useState(true)
  const [filter, setFilter] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const [exporting, setExporting] = useState<number | null>(null)
  const [schedOpen, setSchedOpen] = useState(false)
  const [toast, setToast] = useState('')

  const len = range[1] - range[0]
  const words = useMemo(() => clip.title.toUpperCase().replace(/[“”"]/g, '').split(' ').slice(0, 6), [clip.title])
  const activeWord = Math.floor((t / Math.max(1, len)) * words.length * 3) % words.length
  const s = styles.find((x) => x.id === style)!

  useEffect(() => {
    if (!playing) return
    const iv = setInterval(() => setT((x) => (x + 0.1 >= len ? 0 : x + 0.1)), 100)
    return () => clearInterval(iv)
  }, [playing, len])

  useEffect(() => {
    if (!toast) return
    const to = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(to)
  }, [toast])

  const doExport = () => {
    setExporting(0)
    const iv = setInterval(() => {
      setExporting((p) => {
        if (p === null) return null
        if (p >= 100) {
          clearInterval(iv)
          setTimeout(() => {
            setExporting(null)
            setToast('Exported 1080×1920 MP4')
          }, 300)
          return 100
        }
        return p + 7
      })
    }, 80)
  }

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link to={`/app/streams/${stream.id}`} className="inline-flex items-center gap-1.5 text-xs text-fg-dim hover:text-fg">
            <ArrowLeft size={13} /> {stream.title}
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="display truncate text-[22px] font-semibold sm:text-[26px]">{clip.title}</h1>
            <Score value={clip.score} size="lg" />
          </div>
          <p className="mt-1 text-xs text-fg-dim">
            Picked because: {clip.reason} · from <span className="num">{fmtTime(clip.start)}</span>
          </p>
        </div>
        <div className="relative flex gap-2">
          <button onClick={doExport} disabled={exporting !== null} className="btn-ghost">
            {exporting !== null ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting !== null ? `Rendering ${Math.min(100, exporting)}%` : 'Export'}
          </button>
          <button onClick={() => setSchedOpen((o) => !o)} className="btn-primary" aria-expanded={schedOpen}>
            <Calendar size={15} /> Schedule
          </button>
          {schedOpen && (
            <Schedule
              onClose={() => setSchedOpen(false)}
              onConfirm={(when, to) => {
                setSchedOpen(false)
                setToast(`Scheduled for ${when} on ${to.map((x) => socialMeta[x].label).join(', ')}`)
              }}
            />
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        {/* Preview */}
        <Card className="p-5">
          <div className="mx-auto max-w-[280px]">
            <Thumb hue={clip.hue} layout={layout} className="ring-1 ring-white/10">
              <div className={clsx('absolute inset-x-[7%] text-center', layout === 'split' ? 'top-[41%]' : 'top-[62%]')}>
                <p className={clsx('text-[20px] leading-[1.08] text-white [text-shadow:0_2px_0_rgba(0,0,0,.7)]', s.cls)}>
                  {words.map((w, i) => (
                    <span key={i} className={clsx('transition-colors duration-100', i === activeWord && s.hl)}>
                      {w}{' '}
                    </span>
                  ))}
                  {emojis && <span className="ml-0.5 inline-block rounded bg-white/90 px-1 text-[14px] text-black">!!</span>}
                </p>
              </div>
              <span className="num absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white/80">{fmtTime(t)}</span>
            </Thumb>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button onClick={() => setT(0)} className="btn-quiet p-2" aria-label="Restart">
              <RotateCcw size={15} />
            </button>
            <button onClick={() => setPlaying(!playing)} className="btn-ghost h-10 w-10 rounded-full p-0" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-px" />}
            </button>
            <span className="num w-[84px] text-center text-xs text-fg-muted">
              {fmtTime(t)} / {fmtTime(len)}
            </span>
          </div>
        </Card>

        <div className="flex min-w-0 flex-col gap-6">
          {/* Trim */}
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Trim</p>
              <p className="num text-xs text-fg-muted">
                {fmtTime(srcStart + range[0])} → {fmtTime(srcStart + range[1])} · <span className={clsx(len > 60 ? 'text-warn' : 'text-fg')}>{len}s</span>
              </p>
            </div>
            <Trim total={window_} range={range} onChange={setRange} playhead={range[0] + t} />
            <div className="num mt-2 flex justify-between text-[10px] text-fg-dim">
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <span key={p}>{fmtTime(srcStart + window_ * p)}</span>
              ))}
            </div>
            {len > 60 && <p className="mt-3 text-xs text-warn">Shorts must be 60 seconds or less. Trim {len - 60}s to post there.</p>}
          </Card>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="p-5">
              <p className="text-sm font-medium">Captions</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {styles.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => setStyle(x.id)}
                    className={clsx('rounded-xl border px-3 py-3 text-left transition', style === x.id ? 'border-ember/60 bg-ember/[0.08]' : 'hairline bg-white/[0.02] hover:bg-white/[0.05]')}
                    aria-pressed={style === x.id}
                  >
                    <span className={clsx('block text-[15px] leading-none text-white', x.cls)}>
                      Clip <span className={x.hl}>it</span>
                    </span>
                    <span className="mt-2 block text-[11px] text-fg-dim">{x.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 border-t hairline pt-4 text-sm">
                <label className="flex items-center justify-between gap-3 text-fg-muted">
                  Hype stickers
                  <Toggle label="Hype stickers" checked={emojis} onChange={setEmojis} />
                </label>
                <label className="flex items-center justify-between gap-3 text-fg-muted">
                  Bleep profanity
                  <Toggle label="Bleep profanity" checked={filter} onChange={setFilter} />
                </label>
              </div>
            </Card>

            <Card className="p-5">
              <p className="text-sm font-medium">Reframe</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(['split', 'facecam', 'gameplay'] as const).map((l) => (
                  <button key={l} onClick={() => setLayout(l)} aria-pressed={layout === l} className={clsx('rounded-xl border p-2 transition', layout === l ? 'border-ember/60 bg-ember/[0.08]' : 'hairline bg-white/[0.02] hover:bg-white/[0.05]')}>
                    <div className="mx-auto w-10">
                      <Thumb hue={clip.hue} layout={l} className="rounded-md" />
                    </div>
                    <span className="mt-2 block text-[11px] capitalize text-fg-muted">{l === 'facecam' ? 'Face cam' : l}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-fg-dim">
                <Sparkles size={13} className="mt-0.5 shrink-0 text-ember" /> Split works best here: your face cam is visible for 92% of the clip.
              </p>
            </Card>
          </div>

          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">Title and hashtags</p>
              <Segmented size="sm" value={platform} onChange={setPlatform} options={(Object.keys(socialMeta) as Social[]).map((k) => ({ value: k, label: socialMeta[k].label }))} />
            </div>
            <label htmlFor="clip-title" className="sr-only">
              Title for {socialMeta[platform].label}
            </label>
            <textarea id="clip-title" rows={2} value={titles[platform]} onChange={(e) => setTitles({ ...titles, [platform]: e.target.value })} className="input mt-4 resize-none" />
            <div className="mt-2 flex justify-between text-[11px] text-fg-dim">
              <span>Suggested: #{stream.game.replace(/\s/g, '').toLowerCase()} #streamer #clips</span>
              <span className="num">{titles[platform].length} / {platform === 'shorts' ? 100 : 2200}</span>
            </div>
          </Card>
        </div>
      </div>

      {toast && (
        <div className="glass-strong fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-ink-800/80 px-4 py-3 text-sm" role="status" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <Check size={15} className="text-ok" /> {toast}
        </div>
      )}
    </div>
  )
}

function Trim({ total, range, onChange, playhead }: { total: number; range: [number, number]; onChange: (r: [number, number]) => void; playhead: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef<0 | 1 | null>(null)
  const bars = useMemo(() => Array.from({ length: 120 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31)) * 0.75 * (i > 30 && i < 70 ? 1 : 0.6)), [])

  const toSec = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect()
    return Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * total)
  }
  const move = (e: RPE) => {
    if (drag.current === null) return
    const v = toSec(e.clientX)
    if (drag.current === 0) onChange([Math.min(v, range[1] - 5), range[1]])
    else onChange([range[0], Math.max(v, range[0] + 5)])
  }
  const key = (h: 0 | 1) => (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
    if (!d) return
    e.preventDefault()
    if (h === 0) onChange([Math.max(0, Math.min(range[0] + d, range[1] - 5)), range[1]])
    else onChange([range[0], Math.min(total, Math.max(range[1] + d, range[0] + 5))])
  }
  const pct = (v: number) => `${(v / total) * 100}%`

  return (
    <div ref={ref} className="relative mt-5 h-16 touch-none select-none rounded-lg bg-black/30" onPointerMove={move} onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)}>
      <div className="absolute inset-0 flex items-center gap-[2px] px-1">
        {bars.map((b, i) => {
          const sec = (i / bars.length) * total
          const inside = sec >= range[0] && sec <= range[1]
          return <span key={i} className={clsx('flex-1 rounded-full', inside ? 'bg-ember/70' : 'bg-white/15')} style={{ height: `${b * 80}%` }} />
        })}
      </div>
      <div className="absolute inset-y-0 rounded-md border-2 border-ember" style={{ left: pct(range[0]), width: pct(range[1] - range[0]) }} />
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: pct(Math.min(playhead, range[1])) }} />
      {([0, 1] as const).map((h) => (
        <button
          key={h}
          type="button"
          role="slider"
          aria-label={h === 0 ? 'Clip start' : 'Clip end'}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={range[h]}
          onKeyDown={key(h)}
          onPointerDown={(e) => {
            ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
            drag.current = h
          }}
          className="absolute inset-y-[-4px] z-10 flex w-4 -translate-x-1/2 cursor-ew-resize items-center justify-center rounded-md bg-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ left: pct(range[h]) }}
        >
          <span className="h-5 w-0.5 rounded-full bg-[#1a0a02]/60" />
        </button>
      ))}
    </div>
  )
}

function Schedule({ onClose, onConfirm }: { onClose: () => void; onConfirm: (when: string, to: Social[]) => void }) {
  const slots = ['Today, 6:00 PM', 'Today, 9:30 PM', 'Tomorrow, 12:30 PM', 'Tomorrow, 7:00 PM']
  const [slot, setSlot] = useState(slots[0])
  const [to, setTo] = useState<Social[]>(['tiktok', 'shorts'])
  return (
    <div className="glass-strong absolute right-0 top-full z-40 mt-2 w-[300px] max-w-[calc(100vw-32px)] rounded-2xl bg-ink-800/90 p-4">
      <p className="eyebrow">Best times for your audience</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {slots.map((x, i) => (
          <button key={x} onClick={() => setSlot(x)} className={clsx('flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition', slot === x ? 'border-ember/60 bg-ember/[0.08]' : 'hairline hover:bg-white/[0.04]')}>
            {x}
            {i === 0 && <span className="text-[10px] text-ember-300">Peak</span>}
          </button>
        ))}
      </div>
      <p className="eyebrow mt-4">Post to</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(Object.keys(socialMeta) as Social[]).map((k) => (
          <button key={k} aria-pressed={to.includes(k)} onClick={() => setTo(to.includes(k) ? to.filter((x) => x !== k) : [...to, k])} className={clsx('chip cursor-pointer', to.includes(k) && 'border-ember/50 text-fg')}>
            {to.includes(k) && <Check size={11} />} {socialMeta[k].label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="btn-quiet btn-sm">
          Cancel
        </button>
        <button onClick={() => onConfirm(slot, to)} disabled={!to.length} className="btn-primary btn-sm">
          Schedule
        </button>
      </div>
    </div>
  )
}
