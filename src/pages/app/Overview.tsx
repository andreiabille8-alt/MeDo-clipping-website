import { ArrowRight, ArrowUpRight, Eye, Scissors, Timer, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, EngagementChart, PlatformTag, Score, SectionHead, SocialTag, StatusPill, Thumb } from '../../components/ui'
import { clips, engagementSeries, fmtTime, streams } from '../../lib/data'

export default function Overview() {
  const live = streams.find((s) => s.status === 'live')!
  const top = clips[0]
  const ready = clips.filter((c) => c.status === 'ready').slice(0, 4)
  const queue = streams.filter((s) => s.status === 'processing' || s.status === 'queued')
  const weekly = [12, 18, 9, 24, 31, 22, 38]

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-fg-dim">Tuesday, November 10</p>
          <h1 className="display mt-1 text-[28px] font-semibold">Good afternoon, Nova</h1>
        </div>
        <p className="text-sm text-fg-muted">
          <span className="num text-fg">4</span> clips are ready for review
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { k: 'Clips this week', v: '154', d: '+38%', icon: Scissors },
          { k: 'Views from clips', v: '2.8M', d: '+61%', icon: Eye },
          { k: 'Avg. virality score', v: '81', d: '+4', icon: TrendingUp },
          { k: 'Time to first clip', v: '7m 40s', d: '−1m 12s', icon: Timer },
        ].map(({ k, v, d, icon: Icon }) => (
          <Card key={k} className="p-4">
            <div className="flex items-center justify-between text-xs text-fg-muted">
              {k}
              <Icon size={14} className="text-fg-dim" />
            </div>
            <p className="num mt-3 text-[26px] font-medium tracking-tight">{v}</p>
            <p className="mt-1 text-xs text-ok">{d} vs last week</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Live now */}
        <Card className="min-w-0 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <StatusPill status="live" />
                <PlatformTag p={live.platform} />
              </div>
              <h2 className="mt-2 truncate font-medium">{live.title}</h2>
              <p className="mt-0.5 text-xs text-fg-dim">
                {live.game} · <span className="num">{live.duration}</span> in · <span className="num">{live.peakViewers}</span> peak viewers
              </p>
            </div>
            <Link to={`/app/streams/${live.id}`} className="btn-ghost btn-sm">
              Open stream <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-6">
            <EngagementChart
              series={engagementSeries(11, 150, [0.18, 0.29, 0.52, 0.68, 0.81, 0.93])}
              markers={[0.18, 0.29, 0.52, 0.68, 0.81, 0.93].map((at, i) => ({ at, id: String(i), score: [66, 79, 88, 72, 91, 84][i] }))}
              height={150}
              playhead={0.97}
            />
            <div className="num mt-2 flex justify-between text-[10px] text-fg-dim">
              <span>0:00</span>
              <span>1:00</span>
              <span>2:00</span>
              <span>3:00</span>
              <span>4:12</span>
            </div>
          </div>
        </Card>

        {/* Top clip */}
        <Card className="p-5">
          <SectionHead title="Top clip this week" action={<Score value={top.score} />} />
          <div className="mt-4 flex gap-4">
            <div className="w-[110px] shrink-0">
              <Thumb hue={top.hue} caption="1V4 CLUTCH WITH 3 HP" highlight="clutch" captionClass="text-[10px]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="text-sm font-medium leading-snug">{top.title}</p>
              <p className="num mt-3 text-[26px] font-medium tracking-tight">{top.views}</p>
              <p className="text-xs text-fg-dim">views across platforms</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{top.posted?.map((s) => <SocialTag key={s} s={s} />)}</div>
              <Link to={`/app/editor/${top.id}`} className="mt-auto inline-flex items-center gap-1 pt-3 text-xs text-ember-300 hover:text-ember">
                View clip <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Ready for review */}
        <Card className="min-w-0 p-5">
          <SectionHead
            title="Ready for review"
            sub="Clips above your score threshold that are waiting for approval"
            action={
              <Link to="/app/library" className="btn-quiet btn-sm">
                See all
              </Link>
            }
          />
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {ready.map((c) => (
              <Link key={c.id} to={`/app/editor/${c.id}`} className="group min-w-0 focus-visible:outline-none">
                <Thumb hue={c.hue} caption={c.title.toUpperCase().split(' ').slice(0, 4).join(' ')} highlight={c.title.split(' ')[0]} captionClass="text-[11px]" className="ring-1 ring-white/10 transition group-hover:ring-ember/50 group-focus-visible:ring-2 group-focus-visible:ring-ember" />
                <div className="mt-2 flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-[13px] leading-snug text-fg-muted group-hover:text-fg">{c.title}</p>
                  <Score value={c.score} size="sm" />
                </div>
                <p className="num mt-1 text-[11px] text-fg-dim">{fmtTime(c.length)}</p>
              </Link>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          {/* Processing queue */}
          <Card className="p-5">
            <SectionHead title="Processing" />
            <ul className="mt-4 flex flex-col gap-4">
              {queue.map((s) => (
                <li key={s.id}>
                  <Link to={`/app/streams/${s.id}`} className="block">
                    <p className="truncate text-sm hover:text-fg">{s.title}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="num text-[11px] text-fg-dim">{s.duration}</span>
                      <StatusPill status={s.status} progress={s.progress} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Weekly bars */}
          <Card className="p-5">
            <SectionHead title="Clips per day" sub="Last 7 days" />
            <div className="mt-5 flex h-[90px] items-end gap-2">
              {weekly.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className={i === weekly.length - 1 ? 'w-full rounded-[4px] bg-ember' : 'w-full rounded-[4px] bg-white/[0.12]'} style={{ height: `${(v / 38) * 72}px` }} title={`${v} clips`} />
                  <span className="text-[10px] text-fg-dim">{'WTFSSMT'[i]}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
