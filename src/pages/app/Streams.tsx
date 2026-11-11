import { ArrowRight, Link2, Loader2 } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, PlatformTag, Segmented, StatusPill } from '../../components/ui'
import { Stream, streams as seed } from '../../lib/data'

type Filter = 'all' | 'live' | 'processing' | 'done'

export default function Streams() {
  const [filter, setFilter] = useState<Filter>('all')
  const [url, setUrl] = useState('')
  const [err, setErr] = useState('')
  const [adding, setAdding] = useState(false)
  const [list, setList] = useState<Stream[]>(seed)

  const shown = list.filter((s) => filter === 'all' || (filter === 'processing' ? s.status === 'processing' || s.status === 'queued' : s.status === filter))

  const add = (e: FormEvent) => {
    e.preventDefault()
    if (!/(twitch\.tv|youtube\.com|youtu\.be|kick\.com)\//i.test(url)) {
      setErr('Paste a Twitch, YouTube or Kick VOD link, like twitch.tv/videos/2291834410.')
      return
    }
    setAdding(true)
    setTimeout(() => {
      const platform = /youtu/i.test(url) ? 'youtube' : /kick/i.test(url) ? 'kick' : 'twitch'
      setList((l) => [{ id: `n${l.length}`, title: 'Imported VOD', channel: 'nova_plays', platform, date: 'Just now', duration: '—', durationSec: 0, status: 'queued', clips: 0, peakViewers: '—', game: '—' }, ...l])
      setUrl('')
      setAdding(false)
    }, 700)
  }

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <div>
        <h1 className="display text-[28px] font-semibold">Streams</h1>
        <p className="mt-1 text-sm text-fg-muted">New VODs from connected channels are picked up automatically. You can also paste a link.</p>
      </div>

      <Card className="p-4">
        <form onSubmit={add} className="flex flex-col gap-3 sm:flex-row" noValidate>
          <div className="relative flex-1">
            <Link2 size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-dim" />
            <input
              id="vod-url"
              className="input pl-9"
              placeholder="https://www.twitch.tv/videos/2291834410"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setErr('')
              }}
              aria-label="VOD link"
            />
          </div>
          <button className="btn-primary" disabled={adding}>
            {adding ? <Loader2 size={15} className="animate-spin" /> : null}
            {adding ? 'Adding' : 'Find clips'}
          </button>
        </form>
        {err && <p className="mt-2 text-xs text-[#ff8a8a]">{err}</p>}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'live', label: 'Live' },
            { value: 'processing', label: 'Processing' },
            { value: 'done', label: 'Done' },
          ]}
        />
        <p className="num text-xs text-fg-dim">{shown.length} streams</p>
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_110px_100px_90px_120px_24px] gap-4 border-b hairline px-5 py-3 text-xs text-fg-dim md:grid">
          <span>Stream</span>
          <span>Platform</span>
          <span>Duration</span>
          <span>Clips</span>
          <span>Status</span>
          <span />
        </div>
        {shown.length === 0 && <p className="px-5 py-12 text-center text-sm text-fg-dim">No streams here yet. Go live or paste a VOD link above.</p>}
        <ul className="divide-y divide-white/[0.06]">
          {shown.map((s) => (
            <li key={s.id}>
              <Link to={`/app/streams/${s.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 px-5 py-4 transition hover:bg-white/[0.03] md:grid-cols-[1fr_110px_100px_90px_120px_24px]">
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{s.title}</p>
                  <p className="mt-0.5 text-xs text-fg-dim">
                    {s.channel} · {s.game} · {s.date}
                  </p>
                </div>
                <span className="hidden md:inline">
                  <PlatformTag p={s.platform} />
                </span>
                <span className="num hidden text-[13px] text-fg-muted md:inline">{s.duration}</span>
                <span className="num hidden text-[13px] md:inline">{s.clips || '—'}</span>
                <span className="justify-self-end md:justify-self-start">
                  <StatusPill status={s.status} progress={s.progress} />
                </span>
                <ArrowRight size={15} className="hidden text-fg-dim transition group-hover:translate-x-0.5 group-hover:text-fg md:block" />
                <div className="col-span-2 flex items-center gap-3 text-xs text-fg-dim md:hidden">
                  <PlatformTag p={s.platform} />
                  <span className="num">{s.duration}</span>
                  <span className="num">{s.clips} clips</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
