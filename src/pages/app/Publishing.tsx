import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Score, Segmented, SocialTag, Thumb, Toggle } from '../../components/ui'
import { clips, scheduled, Social, socialMeta } from '../../lib/data'

const accounts: { s: Social; handle: string; followers: string; on: boolean }[] = [
  { s: 'tiktok', handle: '@novaplays', followers: '892K', on: true },
  { s: 'shorts', handle: 'Nova Clips', followers: '186K', on: true },
  { s: 'reels', handle: '@nova.plays', followers: '74K', on: false },
]

export default function Publishing() {
  const [view, setView] = useState<'week' | 'list'>('week')
  const [auto, setAuto] = useState(true)
  const [acc, setAcc] = useState(accounts)
  const today = 1

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[28px] font-semibold">Publishing</h1>
          <p className="mt-1 text-sm text-fg-muted">Your posting queue for Nov 9 – 15.</p>
        </div>
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: 'week', label: 'Week' },
            { value: 'list', label: 'List' },
          ]}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {acc.map((a, i) => (
          <Card key={a.s} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <SocialTag s={a.s} />
              <p className="mt-2 truncate text-sm">{a.handle}</p>
              <p className="num text-xs text-fg-dim">{a.followers} followers</p>
            </div>
            <Toggle label={`Post to ${socialMeta[a.s].label}`} checked={a.on} onChange={(v) => setAcc(acc.map((x, j) => (j === i ? { ...x, on: v } : x)))} />
          </Card>
        ))}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <p className="text-sm font-medium">Auto-post clips scoring 90 or higher</p>
          <p className="mt-0.5 text-xs text-fg-dim">They skip review and go into the next open slot. Everything else waits for you.</p>
        </div>
        <Toggle label="Auto-post high scorers" checked={auto} onChange={setAuto} />
      </Card>

      {view === 'week' ? (
        <div className="overflow-x-auto scroll-thin">
          <div className="grid min-w-[840px] grid-cols-7 gap-3">
            {scheduled.map((d, i) => (
              <div key={d.date} className={clsx('glass flex min-h-[280px] flex-col rounded-2xl p-3', i === today && 'ring-1 ring-ember/40')}>
                <div className="flex items-baseline justify-between">
                  <span className={clsx('text-sm font-medium', i === today ? 'text-ember-300' : 'text-fg')}>{d.day}</span>
                  <span className="text-[11px] text-fg-dim">{d.date}</span>
                </div>
                <div className="mt-3 flex flex-1 flex-col gap-2">
                  {d.items.map((it) => {
                    const c = clips.find((x) => x.id === it.clip)!
                    const past = i < today
                    return (
                      <Link key={it.clip + it.time} to={`/app/editor/${c.id}`} className={clsx('rounded-xl border hairline bg-black/25 p-2 transition hover:border-white/20', past && 'opacity-55')}>
                        <div className="flex gap-2">
                          <div className="w-8 shrink-0">
                            <Thumb hue={c.hue} className="rounded-[5px]" />
                          </div>
                          <div className="min-w-0">
                            <p className="num text-[11px] text-fg-muted">{it.time}</p>
                            <p className="line-clamp-2 text-[12px] leading-snug">{c.title}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <SocialTag s={it.to} />
                          {past ? <span className="text-[10px] text-ok">Posted</span> : <Score value={c.score} size="sm" />}
                        </div>
                      </Link>
                    )
                  })}
                  <button className="mt-auto flex items-center justify-center gap-1 rounded-xl border border-dashed border-white/10 py-2 text-[11px] text-fg-dim transition hover:border-white/25 hover:text-fg">
                    <Plus size={12} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-white/[0.06]">
            {scheduled.flatMap((d, i) =>
              d.items.map((it) => {
                const c = clips.find((x) => x.id === it.clip)!
                return (
                  <li key={d.date + it.time} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-24 shrink-0">
                      <p className="text-sm">{d.day}</p>
                      <p className="num text-xs text-fg-dim">{it.time}</p>
                    </div>
                    <div className="w-9 shrink-0">
                      <Thumb hue={c.hue} className="rounded-md" />
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm">{c.title}</p>
                    <SocialTag s={it.to} />
                    <span className={clsx('hidden w-16 text-right text-xs sm:block', i < today ? 'text-ok' : 'text-fg-dim')}>{i < today ? 'Posted' : 'Queued'}</span>
                  </li>
                )
              }),
            )}
          </ul>
        </Card>
      )}
    </div>
  )
}
