import clsx from 'clsx'
import { ArrowLeft, Download, Pause, Pencil, Play, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, EngagementChart, PlatformTag, Score, StatusPill, Thumb } from '../../components/ui'
import { clips as allClips, engagementSeries, fmtTime, streams } from '../../lib/data'

export default function StreamDetail() {
  const { id } = useParams()
  const stream = streams.find((s) => s.id === id) ?? streams[2]
  const dur = stream.durationSec || 20000

  // Clips for this stream; pad with generated ones so every stream looks populated.
  const list = useMemo(() => {
    const own = allClips.filter((c) => c.streamId === stream.id)
    const extra = allClips.filter((c) => c.streamId !== stream.id).slice(0, Math.max(0, 6 - own.length))
    return [...own, ...extra]
      .map((c, i) => ({ ...c, start: own.includes(c) ? Math.min(c.start, dur - 60) : Math.round(dur * (0.1 + i * 0.13)) }))
      .sort((a, b) => b.score - a.score)
  }, [stream.id, dur])

  const [active, setActive] = useState(list[0].id)
  const [minScore, setMinScore] = useState(60)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const clip = list.find((c) => c.id === active) ?? list[0]
  const visible = list.filter((c) => c.score >= minScore)

  useEffect(() => setT(0), [active])

  const series = useMemo(() => engagementSeries(stream.id.charCodeAt(1), 200, list.map((c) => c.start / dur)), [stream.id, list, dur])

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-6">
      <div>
        <Link to="/app/streams" className="inline-flex items-center gap-1.5 text-xs text-fg-dim hover:text-fg">
          <ArrowLeft size={13} /> Streams
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="display text-[24px] font-semibold leading-tight sm:text-[28px]">{stream.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-dim">
              <PlatformTag p={stream.platform} />
              <span>{stream.channel}</span>
              <span>{stream.game}</span>
              <span className="num">{stream.duration}</span>
              <span className="num">{stream.peakViewers} peak</span>
              <StatusPill status={stream.status} progress={stream.progress} />
            </div>
          </div>
          <button className="btn-ghost btn-sm">
            <Download size={14} /> Export all ({visible.length})
          </button>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">Chat velocity across the stream</p>
          <label htmlFor="min-score" className="flex items-center gap-3 text-xs text-fg-muted">
            <SlidersHorizontal size={13} /> Min score
            <input id="min-score" type="range" min={50} max={95} value={minScore} onChange={(e) => setMinScore(+e.target.value)} className="w-28 accent-[#FF6A1F]" />
            <span className="num w-6 text-fg">{minScore}</span>
          </label>
        </div>
        <div className="mt-6 overflow-x-auto scroll-thin">
          <div className="min-w-[640px]">
            <EngagementChart series={series} markers={visible.map((c) => ({ at: c.start / dur, score: c.score, id: c.id }))} height={140} activeMarker={active} onMarker={setActive} />
            <div className="num mt-2 flex justify-between text-[10px] text-fg-dim">
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <span key={p}>{fmtTime(Math.round(dur * p))}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Preview */}
        <Card className="p-5 lg:sticky lg:top-20 lg:self-start">
          <div className="mx-auto max-w-[240px]">
            <Thumb key={clip.id} hue={clip.hue} clip={clip} playing={playing} onTime={setT} caption={clip.title.toUpperCase().split(' ').slice(0, 5).join(' ')} highlight={clip.title.split(' ')[1]} captionClass="text-[16px]">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/15">
                <div className="h-full bg-ember transition-[width] duration-100" style={{ width: `${(t / clip.length) * 100}%` }} />
              </div>
            </Thumb>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button onClick={() => setPlaying(!playing)} className="btn-ghost btn-sm" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <span className="num text-xs text-fg-muted">
              {fmtTime(t)} / {fmtTime(clip.length)}
            </span>
          </div>
          <p className="mt-4 text-sm font-medium">{clip.title}</p>
          <p className="mt-1 text-xs text-fg-dim">{clip.reason}</p>
          <Link to={`/app/editor/${clip.id}`} className="btn-primary mt-4 w-full">
            <Pencil size={14} /> Edit and post
          </Link>
        </Card>

        {/* Clip list */}
        <Card className="min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b hairline px-5 py-3">
            <p className="text-sm font-medium">Moments found</p>
            <p className="num text-xs text-fg-dim">
              {visible.length} of {list.length}
            </p>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {visible.map((c) => (
              <li key={c.id}>
                <button onClick={() => setActive(c.id)} className={clsx('flex w-full items-center gap-4 px-5 py-3 text-left transition', active === c.id ? 'bg-ember/[0.07]' : 'hover:bg-white/[0.03]')}>
                  <div className="w-11 shrink-0">
                    <Thumb hue={c.hue} clip={c} className="rounded-md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={clsx('truncate text-sm', active === c.id ? 'text-fg' : 'text-fg-muted')}>{c.title}</p>
                    <p className="mt-0.5 truncate text-xs text-fg-dim">{c.reason}</p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="num text-xs text-fg-muted">{fmtTime(c.start)}</p>
                    <p className="num text-[11px] text-fg-dim">{c.length}s</p>
                  </div>
                  <Score value={c.score} />
                </button>
              </li>
            ))}
            {visible.length === 0 && <li className="px-5 py-10 text-center text-sm text-fg-dim">No moments score above {minScore}. Lower the minimum to see more.</li>}
          </ul>
        </Card>
      </div>
    </div>
  )
}
