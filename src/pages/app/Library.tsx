import clsx from 'clsx'
import { Check, Download, Search, Send, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HoverClip } from '../../components/ClipVideo'
import { Score, Segmented, SocialTag } from '../../components/ui'
import { Clip, clips as seed, fmtTime, streams } from '../../lib/data'

type Status = 'all' | 'ready' | 'scheduled' | 'posted'
type Sort = 'score' | 'recent'

export default function Library() {
  const [list, setList] = useState<Clip[]>(seed)
  const [status, setStatus] = useState<Status>('all')
  const [sort, setSort] = useState<Sort>('score')
  const [minScore, setMinScore] = useState(0)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<string[]>([])

  const shown = useMemo(() => {
    const f = list.filter((c) => (status === 'all' || c.status === status) && c.score >= minScore && c.title.toLowerCase().includes(q.toLowerCase()))
    return [...f].sort((a, b) => (sort === 'score' ? b.score - a.score : b.streamId.localeCompare(a.streamId)))
  }, [list, status, sort, minScore, q])

  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[28px] font-semibold">Clip library</h1>
          <p className="mt-1 text-sm text-fg-muted">Every clip Cutline has made across your channels.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: 'All' },
              { value: 'ready', label: 'Ready' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'posted', label: 'Posted' },
            ]}
          />
          <Segmented
            size="sm"
            value={String(minScore)}
            onChange={(v) => setMinScore(+v)}
            options={[
              { value: '0', label: 'Any score' },
              { value: '80', label: '80+' },
              { value: '90', label: '90+' },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-64">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-dim" />
            <input id="lib-search" className="input pl-8" placeholder="Search clips" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search clips" />
          </div>
          <label htmlFor="lib-sort" className="sr-only">
            Sort
          </label>
          <select id="lib-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input w-auto pr-8">
            <option value="score">Highest score</option>
            <option value="recent">Most recent</option>
          </select>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="glass rounded-2xl px-6 py-16 text-center">
          <p className="font-medium">No clips match these filters</p>
          <p className="mt-1 text-sm text-fg-dim">Try a lower score or clear the search.</p>
          <button
            className="btn-ghost btn-sm mt-5"
            onClick={() => {
              setQ('')
              setMinScore(0)
              setStatus('all')
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {shown.map((c) => {
            const on = sel.includes(c.id)
            const s = streams.find((x) => x.id === c.streamId)
            return (
              <div key={c.id} className="group min-w-0">
                <div className="relative">
                  <Link to={`/app/editor/${c.id}`} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember">
                    <HoverClip clip={c} caption={c.title.toUpperCase().split(' ').slice(0, 4).join(' ')} highlight={c.title.split(' ')[0]} captionClass="text-[11px]" className={clsx('ring-1 transition', on ? 'ring-2 ring-ember' : 'ring-white/10 group-hover:ring-white/25')} />
                  </Link>
                  <button
                    onClick={() => toggle(c.id)}
                    aria-label={on ? 'Deselect clip' : 'Select clip'}
                    aria-pressed={on}
                    className={clsx(
                      'absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border transition',
                      on ? 'border-ember bg-ember text-[#1a0a02]' : 'border-white/40 bg-black/40 opacity-0 backdrop-blur group-hover:opacity-100 focus-visible:opacity-100',
                      sel.length > 0 && 'opacity-100',
                    )}
                  >
                    {on && <Check size={12} strokeWidth={3} />}
                  </button>
                  <span className="absolute right-2 top-2">
                    <Score value={c.score} size="sm" />
                  </span>
                  <span className="num absolute bottom-2 right-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white/85">{fmtTime(c.length)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-[13px] leading-snug">{c.title}</p>
                <p className="mt-1 truncate text-[11px] text-fg-dim">{s?.game}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.status === 'posted' && c.posted?.map((p) => <SocialTag key={p} s={p} />)}
                  {c.status === 'scheduled' && <span className="chip text-ember-300">{c.scheduled}</span>}
                  {c.status === 'ready' && <span className="chip">Ready</span>}
                  {c.status === 'rendering' && <span className="chip">Rendering…</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {sel.length > 0 && (
        <div className="glass-strong fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-2xl bg-ink-800/85 p-1.5 pl-4" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <span className="num mr-2 text-sm">{sel.length} selected</span>
          <button className="btn-quiet btn-sm">
            <Download size={14} /> <span className="hidden sm:inline">Export</span>
          </button>
          <button
            className="btn-quiet btn-sm"
            onClick={() => {
              setList((l) => l.map((c) => (sel.includes(c.id) ? { ...c, status: 'scheduled', scheduled: 'Next open slot' } : c)))
              setSel([])
            }}
          >
            <Send size={14} /> <span className="hidden sm:inline">Schedule</span>
          </button>
          <button
            className="btn-quiet btn-sm hover:text-[#ff8a8a]"
            onClick={() => {
              setList((l) => l.filter((c) => !sel.includes(c.id)))
              setSel([])
            }}
          >
            <Trash2 size={14} /> <span className="hidden sm:inline">Delete</span>
          </button>
          <button className="btn-quiet p-2" onClick={() => setSel([])} aria-label="Clear selection">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
