import clsx from 'clsx'
import { Check, Plus } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Card, PlatformTag, Segmented, Toggle } from '../../components/ui'
import { channels } from '../../lib/data'

const tabs = ['Clipping', 'Channels', 'Billing', 'Team'] as const
type Tab = (typeof tabs)[number]

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm">{label}</p>
        {hint && <p className="mt-0.5 max-w-[52ch] text-xs text-fg-dim">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>('Clipping')
  const [length, setLength] = useState('30')
  const [score, setScore] = useState(75)
  const [live, setLive] = useState(true)
  const [words, setWords] = useState('Immortal, LUL, KEKW, Pog, nova_plays')
  const [saved, setSaved] = useState(false)

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-6">
      <h1 className="display text-[28px] font-semibold">Settings</h1>
      <div className="flex gap-1 overflow-x-auto border-b hairline scroll-thin">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={clsx('-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition', tab === t ? 'border-ember text-fg' : 'border-transparent text-fg-muted hover:text-fg')}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Clipping' && (
        <Card className="px-5">
          <div className="divide-y divide-white/[0.06]">
            <Row label="Target clip length" hint="Cutline trims to the strongest part of the moment within this length.">
              <Segmented
                size="sm"
                value={length}
                onChange={setLength}
                options={[
                  { value: '15', label: '15s' },
                  { value: '30', label: '30s' },
                  { value: '45', label: '45s' },
                  { value: '60', label: '60s' },
                ]}
              />
            </Row>
            <Row label="Minimum virality score" hint="Moments below this are skipped. Lower it to get more clips, raise it for only the best.">
              <div className="flex items-center gap-3">
                <input id="set-score" type="range" min={50} max={95} value={score} onChange={(e) => setScore(+e.target.value)} className="w-40 accent-[#FF6A1F]" aria-label="Minimum virality score" />
                <span className="num w-7 text-sm">{score}</span>
              </div>
            </Row>
            <Row label="Clip while live" hint="Moments are clipped within about 3 minutes, so you can post while the stream is still going.">
              <Toggle label="Clip while live" checked={live} onChange={setLive} />
            </Row>
            <Row label="Custom words" hint="Names, emotes and game terms the captions should spell exactly.">
              <input id="set-words" className="input w-full sm:w-72" value={words} onChange={(e) => setWords(e.target.value)} aria-label="Custom words" />
            </Row>
          </div>
          <div className="flex justify-end gap-2 border-t hairline py-4">
            <button
              className="btn-primary btn-sm"
              onClick={() => {
                setSaved(true)
                setTimeout(() => setSaved(false), 1800)
              }}
            >
              {saved ? (
                <>
                  <Check size={14} /> Saved
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </Card>
      )}

      {tab === 'Channels' && (
        <Card className="px-5">
          <div className="divide-y divide-white/[0.06]">
            {channels.map((c) => (
              <Row key={c.id} label={c.name} hint={`${c.followers} followers`}>
                <div className="flex items-center gap-4">
                  <PlatformTag p={c.platform} />
                  <button className="btn-quiet btn-sm">Disconnect</button>
                </div>
              </Row>
            ))}
          </div>
          <div className="border-t hairline py-4">
            <button className="btn-ghost btn-sm">
              <Plus size={14} /> Connect a channel
            </button>
          </div>
        </Card>
      )}

      {tab === 'Billing' && (
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Current plan</p>
                <p className="mt-2 text-lg font-medium">Creator · $23/month, billed yearly</p>
                <p className="mt-1 text-sm text-fg-dim">Renews Aug 14, 2027</p>
              </div>
              <button className="btn-ghost btn-sm">Change plan</button>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-xs">
                <span className="text-fg-muted">Clips used this month</span>
                <span className="num">184 / 300</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div className="h-full w-[61%] rounded-full bg-ember" />
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  ['Aug 14, 2026', 'Creator, annual', '$276.00'],
                  ['Jul 14, 2026', 'Clip top-up (100)', '$8.00'],
                  ['Jun 14, 2026', 'Creator, monthly', '$29.00'],
                ].map(([d, i, a]) => (
                  <tr key={d}>
                    <td className="px-5 py-3 text-fg-muted">{d}</td>
                    <td className="px-5 py-3">{i}</td>
                    <td className="num px-5 py-3 text-right">{a}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'Team' && (
        <Card className="px-5">
          <div className="divide-y divide-white/[0.06]">
            {[
              ['Nova (you)', 'Owner'],
              ['Sam R.', 'Editor · can approve and schedule'],
            ].map(([n, r]) => (
              <Row key={n} label={n} hint={r}>
                <span className="chip">{r.split(' ')[0]}</span>
              </Row>
            ))}
          </div>
          <div className="border-t hairline py-4">
            <p className="text-sm text-fg-muted">Team seats are on the Agency plan.</p>
            <button className="btn-ghost btn-sm mt-3">See Agency plan</button>
          </div>
        </Card>
      )}
    </div>
  )
}
