export const BRAND = 'Cutline'

export type Platform = 'twitch' | 'youtube' | 'kick'
export type Social = 'tiktok' | 'shorts' | 'reels'

export const platformMeta: Record<Platform, { label: string; color: string }> = {
  twitch: { label: 'Twitch', color: '#A970FF' },
  youtube: { label: 'YouTube', color: '#FF4E45' },
  kick: { label: 'Kick', color: '#53FC18' },
}
export const socialMeta: Record<Social, { label: string; color: string }> = {
  tiktok: { label: 'TikTok', color: '#F5EFEA' },
  shorts: { label: 'Shorts', color: '#FF4E45' },
  reels: { label: 'Reels', color: '#E1306C' },
}

export type Channel = { id: string; name: string; platform: Platform; followers: string; live: boolean }
export const channels: Channel[] = [
  { id: 'c1', name: 'nova_plays', platform: 'twitch', followers: '412K', live: true },
  { id: 'c2', name: 'Nova Clips', platform: 'youtube', followers: '186K', live: false },
  { id: 'c3', name: 'novaplays', platform: 'kick', followers: '58K', live: false },
]

export type StreamStatus = 'live' | 'processing' | 'done' | 'queued'
export type Stream = {
  id: string
  title: string
  channel: string
  platform: Platform
  date: string
  duration: string
  durationSec: number
  status: StreamStatus
  progress?: number
  clips: number
  peakViewers: string
  game: string
}

export const streams: Stream[] = [
  { id: 's1', title: 'Ranked grind to Immortal — no sleep until', channel: 'nova_plays', platform: 'twitch', date: 'Live now', duration: '4:12:08', durationSec: 15128, status: 'live', clips: 9, peakViewers: '21.4K', game: 'Valorant' },
  { id: 's2', title: 'Elden Ring DLC blind, final boss attempts', channel: 'nova_plays', platform: 'twitch', date: 'Nov 9', duration: '6:41:22', durationSec: 24082, status: 'processing', progress: 68, clips: 22, peakViewers: '34.9K', game: 'Elden Ring' },
  { id: 's3', title: '24h subathon day 2 — chat picks the game', channel: 'nova_plays', platform: 'twitch', date: 'Nov 7', duration: '11:03:51', durationSec: 39831, status: 'done', clips: 47, peakViewers: '52.1K', game: 'Just Chatting' },
  { id: 's4', title: 'Reacting to your worst ranked clips', channel: 'Nova Clips', platform: 'youtube', date: 'Nov 6', duration: '2:18:40', durationSec: 8320, status: 'done', clips: 14, peakViewers: '9.8K', game: 'Just Chatting' },
  { id: 's5', title: 'Kick exclusive: speedrun practice', channel: 'novaplays', platform: 'kick', date: 'Nov 4', duration: '3:27:15', durationSec: 12435, status: 'done', clips: 11, peakViewers: '6.2K', game: 'Celeste' },
  { id: 's6', title: 'Valorant customs with viewers', channel: 'nova_plays', platform: 'twitch', date: 'Nov 3', duration: '5:02:33', durationSec: 18153, status: 'queued', clips: 0, peakViewers: '18.7K', game: 'Valorant' },
]

export type Clip = {
  id: string
  title: string
  streamId: string
  start: number // seconds into stream
  length: number // seconds
  score: number
  reason: string
  hue: number
  posted?: Social[]
  views?: string
  scheduled?: string
  status: 'ready' | 'rendering' | 'posted' | 'scheduled'
}

export const clips: Clip[] = [
  { id: 'k1', title: '1v4 clutch with 3 HP to win the match', streamId: 's2', start: 8057, length: 38, score: 97, reason: 'Chat 14× baseline · audio peak · "NO WAY"', hue: 18, status: 'posted', posted: ['tiktok', 'shorts'], views: '1.2M' },
  { id: 'k2', title: 'Boss one-shots him at 1% HP', streamId: 's2', start: 14420, length: 27, score: 94, reason: 'Chat 11× · scream detected · 4.1K "LMAO"', hue: 350, status: 'ready' },
  { id: 'k3', title: 'Mom walks in during the donation reading', streamId: 's3', start: 21530, length: 44, score: 91, reason: 'Laughter · chat 9× · new viewer spike', hue: 32, status: 'scheduled', scheduled: 'Today, 6:00 PM' },
  { id: 'k4', title: 'Accidentally ranks up the wrong account', streamId: 's4', start: 3302, length: 52, score: 88, reason: 'Chat 7× · "W" spam · emote burst', hue: 200, status: 'posted', posted: ['tiktok', 'reels', 'shorts'], views: '486K' },
  { id: 'k5', title: '“That was not a jump, that was a prayer”', streamId: 's5', start: 6631, length: 19, score: 86, reason: 'Quote detected · chat 6×', hue: 280, status: 'ready' },
  { id: 'k6', title: 'Gifted 500 subs mid-sentence', streamId: 's3', start: 30122, length: 33, score: 84, reason: 'Sub alert · chat 12× · audio peak', hue: 45, status: 'scheduled', scheduled: 'Tomorrow, 12:30 PM' },
  { id: 'k7', title: 'Rage quits, comes back 10 seconds later', streamId: 's2', start: 19940, length: 41, score: 82, reason: 'Silence → spike pattern · chat 8×', hue: 8, status: 'rendering' },
  { id: 'k8', title: 'Calls the ace before it happens', streamId: 's1', start: 9021, length: 29, score: 79, reason: 'Prediction phrase · chat 6×', hue: 160, status: 'ready' },
  { id: 'k9', title: 'Chat votes him into a horror game', streamId: 's3', start: 12210, length: 36, score: 77, reason: 'Poll ended · chat 5× · scream', hue: 260, status: 'posted', posted: ['shorts'], views: '92K' },
  { id: 'k10', title: 'Explains the lore wrong for 30 seconds', streamId: 's4', start: 6120, length: 31, score: 72, reason: 'Laughter · chat 4×', hue: 120, status: 'ready' },
  { id: 'k11', title: 'Speedrun skip finally works', streamId: 's5', start: 10011, length: 24, score: 70, reason: 'Audio peak · chat 5×', hue: 190, status: 'ready' },
  { id: 'k12', title: 'Teammate throws, he stays calm (briefly)', streamId: 's1', start: 4410, length: 35, score: 66, reason: 'Chat 4× · tone shift', hue: 340, status: 'ready' },
]

export const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  const pad = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`
}

// Deterministic engagement curve for a stream (chat messages / minute).
export function engagementSeries(seed: number, points = 160, peaks: number[] = []) {
  let x = seed * 9301 + 49297
  const rand = () => ((x = (x * 9301 + 49297) % 233280) / 233280)
  const out: number[] = []
  let v = 0.25
  for (let i = 0; i < points; i++) {
    v += (rand() - 0.5) * 0.08
    v = Math.max(0.12, Math.min(0.45, v))
    let spike = 0
    for (const p of peaks) {
      const d = Math.abs(i - p * points)
      spike += Math.max(0, 1 - d / 3.2) * (0.5 + rand() * 0.15)
    }
    out.push(Math.min(1, v + spike))
  }
  return out
}

export const scheduled = [
  { day: 'Mon', date: 'Nov 9', items: [{ clip: 'k1', time: '9:00 AM', to: 'tiktok' as Social }, { clip: 'k4', time: '5:30 PM', to: 'reels' as Social }] },
  { day: 'Tue', date: 'Nov 10', items: [{ clip: 'k3', time: '6:00 PM', to: 'tiktok' as Social }, { clip: 'k9', time: '8:15 PM', to: 'shorts' as Social }] },
  { day: 'Wed', date: 'Nov 11', items: [{ clip: 'k6', time: '12:30 PM', to: 'shorts' as Social }] },
  { day: 'Thu', date: 'Nov 12', items: [{ clip: 'k2', time: '7:00 PM', to: 'tiktok' as Social }, { clip: 'k5', time: '9:00 PM', to: 'reels' as Social }] },
  { day: 'Fri', date: 'Nov 13', items: [] },
  { day: 'Sat', date: 'Nov 14', items: [{ clip: 'k8', time: '11:00 AM', to: 'shorts' as Social }] },
  { day: 'Sun', date: 'Nov 15', items: [] },
]
