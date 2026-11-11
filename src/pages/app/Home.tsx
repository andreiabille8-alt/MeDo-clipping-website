import clsx from 'clsx'
import { ArrowRight, Check, CheckCircle2, Circle, Clock, Undo2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipPlayer } from '../../components/ClipVideo'
import { Card, PlatformTag, Score, SectionHead, SocialTag, StatusPill, Thumb } from '../../components/ui'
import { clips, fmtTime, scheduled, Social, streams } from '../../lib/data'

// Home is the first screen after signup: what Cutline did since the last stream, and the one thing to do next.
const SLOTS = ['9:30 PM', '10:45 PM', 'Tomorrow, 9:00 AM', 'Tomorrow, 1:15 PM']
const ROTATE: Social[] = ['tiktok', 'shorts', 'reels']

type Decision = { id: string; approved: boolean }

export default function Home() {
  const last = streams.find((s) => s.id === 's2')!
  const live = streams.find((s) => s.status === 'live')!
  const queue = clips.filter((c) => c.status === 'ready')
  const [decided, setDecided] = useState<Decision[]>([])
  const current = queue[decided.length]
  const approved = decided.filter((d) => d.approved)

  const decide = (ok: boolean) => current && setDecided((d) => [...d, { id: current.id, approved: ok }])
  const undo = () => setDecided((d) => d.slice(0, -1))

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'a') decide(true)
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 's') decide(false)
      if (e.key.toLowerCase() === 'z') undo()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  })

  const today = scheduled.find((d) => d.date === 'Nov 10')!.items.map((it) => ({ clip: clips.find((c) => c.id === it.clip)!, time: it.time, to: it.to, fresh: false }))
  const added = approved.map((d, i) => ({ clip: clips.find((c) => c.id === d.id)!, time: SLOTS[i % SLOTS.length], to: ROTATE[i % ROTATE.length], fresh: true }))
  const posting = [...today, ...added]

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <div>
        <p className="text-sm text-fg-dim">Tuesday, November 10</p>
        <h1 className="display mt-1 text-[28px] font-semibold">Welcome back, Nova</h1>
        <p className="mt-2 max-w-[620px] text-[15px] leading-relaxed text-fg-muted">
          Since your last stream, Cutline went through your <span className="num text-fg">{last.duration}</span> cooking stream and found <span className="num text-fg">{last.clips}</span> moments.{' '}
          {current ? (
            <>
              <span className="num text-fg">{queue.length - decided.length}</span> are waiting on you.
            </>
          ) : (
            'You’ve reviewed all of them.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Review deck: the main job of this page */}
        <Card className="min-w-0 p-5 sm:p-6">
          <SectionHead
            title="Review your best moments"
            sub="Approve to schedule it, skip to keep it in the library"
            action={
              <span className="num whitespace-nowrap text-xs text-fg-dim">
                {Math.min(decided.length + 1, queue.length)} / {queue.length}
              </span>
            }
          />
          <div className="mt-4 flex gap-1">
            {queue.map((c, i) => (
              <span key={c.id} className={clsx('h-1 flex-1 rounded-full transition-colors', i < decided.length ? (decided[i].approved ? 'bg-ember' : 'bg-white/25') : i === decided.length ? 'bg-white/50' : 'bg-white/[0.08]')} />
            ))}
          </div>

          {current ? (
            <div key={current.id} className="rise mt-6 flex flex-col gap-6 sm:flex-row">
              <div className="mx-auto w-[210px] shrink-0 sm:mx-0">
                <ClipPlayer clip={current} caption={current.title.toUpperCase().split(' ').slice(0, 5).join(' ')} highlight={current.title.split(' ')[0]} className="ring-1 ring-white/10" />
                <Link to={`/app/editor/${current.id}`} className="mt-2.5 flex items-center justify-center gap-1 text-xs text-fg-muted hover:text-fg">
                  Open in editor <ArrowRight size={12} />
                </Link>
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <Score value={current.score} size="lg" />
                  <span className="text-xs text-fg-dim">virality score</span>
                </div>
                <h2 className="display mt-4 text-[22px] font-semibold leading-tight">{current.title}</h2>
                <p className="num mt-2 text-xs text-fg-dim">
                  {fmtTime(current.length)} clip · at {fmtTime(current.start)} in “{streams.find((s) => s.id === current.streamId)?.title}”
                </p>
                <div className="mt-5 rounded-xl border hairline bg-white/[0.03] p-3.5">
                  <p className="eyebrow">Why Cutline picked it</p>
                  <p className="mt-1.5 text-sm text-fg-muted">{current.reason}</p>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                  <button onClick={() => decide(true)} className="btn-primary px-4 py-2.5">
                    <Check size={15} /> Approve and schedule
                  </button>
                  <button onClick={() => decide(false)} className="btn-ghost px-4 py-2.5">
                    <X size={15} /> Skip
                  </button>
                  {decided.length > 0 && (
                    <button onClick={undo} className="btn-quiet btn-sm ml-auto">
                      <Undo2 size={13} /> Undo
                    </button>
                  )}
                </div>
                <p className="mt-3 hidden text-[11px] text-fg-dim sm:block">
                  Shortcuts: <kbd className="font-mono">A</kbd> approve · <kbd className="font-mono">S</kbd> skip · <kbd className="font-mono">Z</kbd> undo
                </p>
              </div>
            </div>
          ) : (
            <div className="rise flex flex-col items-center px-4 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ember/15 text-ember">
                <CheckCircle2 size={22} />
              </span>
              <h2 className="display mt-4 text-[20px] font-semibold">All caught up</h2>
              <p className="mt-1.5 max-w-[340px] text-sm text-fg-muted">
                {approved.length ? `${approved.length} clip${approved.length > 1 ? 's' : ''} added to your posting schedule.` : 'Nothing approved this round.'} The next batch shows up here after your next stream.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link to="/app/publishing" className="btn-primary btn-sm">
                  See the schedule <ArrowRight size={14} />
                </Link>
                <button onClick={() => setDecided([])} className="btn-ghost btn-sm">
                  <Undo2 size={13} /> Review again
                </button>
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          {/* Posting today, grows as clips get approved */}
          <Card className="p-5">
            <SectionHead
              title="Posting next"
              action={
                <Link to="/app/publishing" className="btn-quiet btn-sm">
                  Schedule
                </Link>
              }
            />
            <ul className="mt-4 flex flex-col gap-3.5">
              {posting.map(({ clip, time, to, fresh }) => (
                <li key={clip.id + time} className={clsx('flex items-center gap-3', fresh && 'rise')}>
                  <div className="w-9 shrink-0">
                    <Thumb hue={clip.hue} clip={clip} className="rounded-md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px]">{clip.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="num inline-flex items-center gap-1 text-[11px] text-fg-dim">
                        <Clock size={11} /> {time.includes('Tomorrow') ? time : `Today, ${time}`}
                      </span>
                    </div>
                  </div>
                  <SocialTag s={to} />
                </li>
              ))}
            </ul>
          </Card>

          {/* Live now */}
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <StatusPill status="live" />
              <PlatformTag p={live.platform} />
            </div>
            <p className="mt-2.5 text-sm font-medium leading-snug">{live.title}</p>
            <p className="mt-1 text-xs text-fg-dim">
              <span className="num">{live.clips}</span> moments flagged so far · <span className="num">{live.duration}</span> in
            </p>
            <Link to={`/app/streams/${live.id}`} className="mt-4 inline-flex items-center gap-1 text-xs text-ember-300 hover:text-ember">
              Watch it get clipped <ArrowRight size={12} />
            </Link>
          </Card>
        </div>
      </div>

      <Setup />
    </div>
  )
}

function Setup() {
  const [steps, setSteps] = useState([
    { label: 'Connect a streaming channel', sub: 'Twitch, YouTube or Kick', done: true },
    { label: 'Pick your caption style', sub: 'Font, colors and the word highlight', done: true },
    { label: 'Connect TikTok, Shorts and Reels', sub: 'So approved clips post themselves', done: true },
    { label: 'Turn on auto-post for 90+ scores', sub: 'Skip review for your strongest clips', done: false },
    { label: 'Invite an editor', sub: 'Let someone else approve while you sleep', done: false },
  ])
  const done = steps.filter((s) => s.done).length
  if (done === steps.length)
    return (
      <Card className="flex items-center gap-3 p-5">
        <CheckCircle2 size={18} className="text-ember" />
        <p className="text-sm text-fg-muted">Setup complete. Cutline will clip and post on its own from here.</p>
      </Card>
    )

  return (
    <Card className="p-5">
      <SectionHead title="Finish setting up" sub={`${done} of ${steps.length} done`} />
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full bg-ember transition-[width] duration-500" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.label}>
            <button
              onClick={() => setSteps((all) => all.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))}
              className={clsx('flex h-full w-full items-start gap-2.5 rounded-xl border p-3 text-left transition', s.done ? 'hairline bg-transparent' : 'border-white/[0.1] bg-white/[0.03] hover:border-ember/40')}
            >
              {s.done ? <CheckCircle2 size={16} className="mt-px shrink-0 text-ember" /> : <Circle size={16} className="mt-px shrink-0 text-fg-dim" />}
              <span className="min-w-0">
                <span className={clsx('block text-[13px] leading-snug', s.done ? 'text-fg-dim line-through decoration-white/20' : 'text-fg')}>{s.label}</span>
                <span className="mt-0.5 block text-[11px] text-fg-dim">{s.sub}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
