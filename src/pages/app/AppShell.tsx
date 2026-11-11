import clsx from 'clsx'
import { Bell, CalendarClock, ChevronsLeft, Clapperboard, Command, LayoutGrid, Library, Menu, Plus, Radio, Search, Settings, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Logo, Score } from '../../components/ui'
import { channels, clips, platformMeta, streams } from '../../lib/data'

const nav = [
  { to: '/app', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/app/streams', label: 'Streams', icon: Radio },
  { to: '/app/library', label: 'Clip library', icon: Library },
  { to: '/app/publishing', label: 'Publishing', icon: CalendarClock },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [palette, setPalette] = useState(false)
  const loc = useLocation()

  useEffect(() => setMobile(false), [loc.pathname])
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
      if (e.key === 'Escape') setPalette(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className={clsx('flex h-14 items-center', collapsed ? 'justify-center' : 'justify-between px-4')}>
        {collapsed ? (
          <button onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
            <Logo iconOnly />
          </button>
        ) : (
          <>
            <NavLink to="/" aria-label="Cutline home">
              <Logo />
            </NavLink>
            <button onClick={() => setCollapsed(true)} className="btn-quiet hidden p-1.5 lg:inline-flex" aria-label="Collapse sidebar">
              <ChevronsLeft size={16} />
            </button>
          </>
        )}
      </div>
      <nav className="flex flex-col gap-0.5 px-2 pt-2">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50',
                collapsed && 'justify-center px-0',
                isActive ? 'bg-white/[0.08] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,.06)]' : 'text-fg-muted hover:bg-white/[0.04] hover:text-fg',
              )
            }
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="mt-6 px-4">
          <p className="eyebrow">Channels</p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {channels.map((c) => (
              <li key={c.id} className="flex items-center justify-between text-[13px]">
                <span className="flex min-w-0 items-center gap-2 text-fg-muted">
                  <span className="h-2 w-2 shrink-0 rounded-[3px]" style={{ background: platformMeta[c.platform].color }} />
                  <span className="truncate">{c.name}</span>
                </span>
                {c.live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" aria-label="Live" />}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-auto p-3">
        {!collapsed ? (
          <div className="rounded-xl border hairline bg-white/[0.03] p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-fg-muted">Clips this month</span>
              <span className="num text-fg">184 / 300</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full w-[61%] rounded-full bg-ember" />
            </div>
            <p className="mt-2 text-[11px] text-fg-dim">Creator plan · resets Dec 1</p>
          </div>
        ) : (
          <div className="mx-auto h-8 w-8 rounded-full bg-gradient-to-br from-ember-300 to-ember-600" />
        )}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <aside className={clsx('glass sticky top-0 hidden h-screen shrink-0 rounded-none border-y-0 border-l-0 transition-[width] duration-200 lg:block', collapsed ? 'w-[68px]' : 'w-[240px]')}>{sidebar}</aside>

      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobile(false)} />
          <aside className="glass-strong absolute inset-y-0 left-0 w-[260px] rounded-none bg-ink-800/90" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <button className="btn-quiet absolute right-2 top-3 p-1.5" onClick={() => setMobile(false)} aria-label="Close menu">
              <X size={16} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky z-30 flex h-14 items-center gap-3 border-b hairline bg-ink/60 px-4 backdrop-blur-xl sm:px-6" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
          <button className="btn-quiet -ml-2 p-1.5 lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <button onClick={() => setPalette(true)} className="flex h-9 w-full max-w-[360px] items-center gap-2 rounded-[10px] border hairline bg-white/[0.03] px-3 text-left text-sm text-fg-dim transition hover:border-white/15 hover:text-fg-muted">
            <Search size={15} />
            <span className="flex-1 truncate">Search clips, streams…</span>
            <kbd className="hidden items-center gap-0.5 rounded border hairline px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
              <Command size={10} />K
            </kbd>
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <button className="btn-quiet relative p-2" aria-label="Notifications">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-ember" />
            </button>
            <NavLink to="/app/streams" className="btn-primary btn-sm hidden sm:inline-flex">
              <Plus size={14} /> Add VOD
            </NavLink>
            <div className="ml-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-ember-300 to-ember-600 ring-2 ring-white/10" aria-label="Account" />
          </div>
        </header>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      {palette && <Palette onClose={() => setPalette(false)} />}
    </div>
  )
}

function Palette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const ref = useRef<HTMLInputElement>(null)
  const nav = useNavigate()
  useEffect(() => ref.current?.focus(), [])

  const items = useMemo(() => {
    const pages = [
      { label: 'Go to Overview', to: '/app', kind: 'Page' },
      { label: 'Go to Streams', to: '/app/streams', kind: 'Page' },
      { label: 'Go to Clip library', to: '/app/library', kind: 'Page' },
      { label: 'Go to Publishing', to: '/app/publishing', kind: 'Page' },
      { label: 'Go to Settings', to: '/app/settings', kind: 'Page' },
    ]
    const s = streams.map((x) => ({ label: x.title, to: `/app/streams/${x.id}`, kind: 'Stream' }))
    const c = clips.map((x) => ({ label: x.title, to: `/app/editor/${x.id}`, kind: 'Clip', score: x.score }))
    const all = [...pages, ...c, ...s] as { label: string; to: string; kind: string; score?: number }[]
    const f = q ? all.filter((x) => x.label.toLowerCase().includes(q.toLowerCase())) : all.slice(0, 9)
    return f.slice(0, 9)
  }, [q])

  const go = (to: string) => {
    nav(to)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command menu">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-strong relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-ink-800/80">
        <div className="flex items-center gap-3 border-b hairline px-4">
          <Search size={16} className="text-fg-dim" />
          <input
            id="palette-search"
            ref={ref}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setI(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') (e.preventDefault(), setI((x) => Math.min(items.length - 1, x + 1)))
              if (e.key === 'ArrowUp') (e.preventDefault(), setI((x) => Math.max(0, x - 1)))
              if (e.key === 'Enter' && items[i]) go(items[i].to)
            }}
            placeholder="Search clips, streams, pages"
            className="h-12 flex-1 bg-transparent text-[15px] outline-none placeholder:text-fg-dim"
          />
          <kbd className="rounded border hairline px-1.5 py-0.5 font-mono text-[10px] text-fg-dim">ESC</kbd>
        </div>
        <ul className="max-h-[360px] overflow-y-auto p-2 scroll-thin">
          {items.length === 0 && <li className="px-3 py-8 text-center text-sm text-fg-dim">No matches for “{q}”. Try a game, a channel or a word from the clip.</li>}
          {items.map((x, idx) => (
            <li key={x.to + x.label}>
              <button onMouseEnter={() => setI(idx)} onClick={() => go(x.to)} className={clsx('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm', idx === i ? 'bg-white/[0.08] text-fg' : 'text-fg-muted')}>
                {x.kind === 'Clip' ? <Clapperboard size={15} /> : x.kind === 'Stream' ? <Radio size={15} /> : <LayoutGrid size={15} />}
                <span className="min-w-0 flex-1 truncate">{x.label}</span>
                {x.score !== undefined ? <Score value={x.score} size="sm" /> : <span className="text-[11px] text-fg-dim">{x.kind}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
