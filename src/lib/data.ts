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
  { id: 's1', title: 'Chat picks the game: VR and mobile games', channel: 'nova_plays', platform: 'twitch', date: 'Live now', duration: '4:12:08', durationSec: 15128, status: 'live', clips: 9, peakViewers: '21.4K', game: 'Variety' },
  { id: 's2', title: 'Cooking stream on the road to 16M', channel: 'nova_plays', platform: 'twitch', date: 'Nov 9', duration: '6:41:22', durationSec: 24082, status: 'processing', progress: 68, clips: 22, peakViewers: '34.9K', game: 'Just Chatting' },
  { id: 's3', title: 'IRL in Portugal: Lisbon to the beach', channel: 'nova_plays', platform: 'twitch', date: 'Nov 7', duration: '11:03:51', durationSec: 39831, status: 'done', clips: 47, peakViewers: '52.1K', game: 'IRL' },
  { id: 's4', title: 'Pack opening until Ronaldo shows up', channel: 'Nova Clips', platform: 'youtube', date: 'Nov 6', duration: '2:18:40', durationSec: 8320, status: 'done', clips: 14, peakViewers: '9.8K', game: 'EA FC' },
  { id: 's5', title: 'Fortnite, then flight sim', channel: 'novaplays', platform: 'kick', date: 'Nov 4', duration: '3:27:15', durationSec: 12435, status: 'done', clips: 11, peakViewers: '6.2K', game: 'Fortnite' },
  { id: 's6', title: 'Fortnite customs with viewers', channel: 'nova_plays', platform: 'twitch', date: 'Nov 3', duration: '5:02:33', durationSec: 18153, status: 'queued', clips: 0, peakViewers: '18.7K', game: 'Fortnite' },
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
  /** Real footage for the demo: a slice of a YouTube video, a poster frame, and where the 9:16 crop centers (0 = left, 1 = right). */
  yt: { id: string; start: number; end: number }
  poster: string
  focus: number
  posted?: Social[]
  views?: string
  scheduled?: string
  status: 'ready' | 'rendering' | 'posted' | 'scheduled'
}

// Example footage: moments from a public YouTube compilation. Playback is a YouTube embed; poster stills live in public/clips. Swap for the creator's own clips before launch.
export const DEMO_VIDEO = '9Ke9DOdvNEI'

export const clips: Clip[] = [
  { id: 'k1', title: 'Turkish ice cream man trolls him for 1:37', streamId: 's3', start: 21530, length: 68, score: 97, reason: 'Crowd noise peak · chat 15× · "LMAOOO" wall', hue: 18, yt: { id: DEMO_VIDEO, start: 229, end: 297 }, poster: '/clips/k1.jpg', focus: 0.22, status: 'posted', posted: ['tiktok', 'shorts'], views: '1.2M' },
  { id: 'k2', title: 'Pours milk into a deep fryer to cook faster', streamId: 's2', start: 14420, length: 46, score: 94, reason: 'Explosion audio spike · chat 12× · scream detected', hue: 350, yt: { id: DEMO_VIDEO, start: 145, end: 191 }, poster: '/clips/k2.jpg', focus: 0.45, status: 'ready' },
  { id: 'k3', title: 'Washes his face to come back to 16M subs', streamId: 's2', start: 8057, length: 14, score: 91, reason: 'Sub counter milestone · chat 9× · new viewer spike', hue: 32, yt: { id: DEMO_VIDEO, start: 330, end: 344 }, poster: '/clips/k3.jpg', focus: 0.82, status: 'scheduled', scheduled: 'Today, 6:00 PM' },
  { id: 'k4', title: 'Asks for a $145,000 Ronaldo watch', streamId: 's4', start: 3302, length: 15, score: 88, reason: 'Price quote detected · chat 7× · "W" spam', hue: 200, yt: { id: DEMO_VIDEO, start: 60, end: 75 }, poster: '/clips/k4.jpg', focus: 0.5, status: 'posted', posted: ['tiktok', 'reels', 'shorts'], views: '486K' },
  { id: 'k5', title: 'Buried in sand until the beach chants Messi', streamId: 's3', start: 30122, length: 10, score: 86, reason: 'Crowd chant · chat 8× · laughter', hue: 280, yt: { id: DEMO_VIDEO, start: 518, end: 528 }, poster: '/clips/k5.jpg', focus: 0.55, status: 'ready' },
  { id: 'k6', title: 'Crashes a fighter jet in flight sim', streamId: 's5', start: 6631, length: 57, score: 84, reason: 'Scream · chat 11× · audio peak', hue: 45, yt: { id: DEMO_VIDEO, start: 410, end: 467 }, poster: '/clips/k6.jpg', focus: 0.33, status: 'scheduled', scheduled: 'Tomorrow, 12:30 PM' },
  { id: 'k7', title: '“Why does the ocean taste like salt water?”', streamId: 's3', start: 33410, length: 18, score: 82, reason: 'Quote detected · chat 8×', hue: 8, yt: { id: DEMO_VIDEO, start: 530, end: 548 }, poster: '/clips/k7.jpg', focus: 0.45, status: 'rendering' },
  { id: 'k8', title: 'Shows Soulja Boy a magic trick on FaceTime', streamId: 's2', start: 19940, length: 15, score: 79, reason: 'Guest on call · chat 6× · laughter', hue: 160, yt: { id: DEMO_VIDEO, start: 76, end: 91 }, poster: '/clips/k8.jpg', focus: 0.4, status: 'ready' },
  { id: 'k9', title: 'Packs a 105 Ronaldo and loses it', streamId: 's4', start: 5120, length: 13, score: 77, reason: 'Pack animation · scream · chat 10×', hue: 260, yt: { id: DEMO_VIDEO, start: 10, end: 23 }, poster: '/clips/k9.jpg', focus: 0.4, status: 'posted', posted: ['shorts'], views: '92K' },
  { id: 'k10', title: 'Wins a Fortnite Victory Royale', streamId: 's5', start: 10011, length: 14, score: 72, reason: 'Win screen · chat 5× · audio peak', hue: 120, yt: { id: DEMO_VIDEO, start: 121, end: 135 }, poster: '/clips/k10.jpg', focus: 0.25, status: 'ready' },
  { id: 'k11', title: 'Sets a new Tower Stack record: 95', streamId: 's1', start: 9021, length: 16, score: 70, reason: 'Score popup · chat 5×', hue: 190, yt: { id: DEMO_VIDEO, start: 308, end: 324 }, poster: '/clips/k11.jpg', focus: 0.3, status: 'ready' },
  { id: 'k12', title: 'Runs into Peter Griffin in VR', streamId: 's1', start: 4410, length: 20, score: 66, reason: 'Laughter · chat 4× · tone shift', hue: 340, yt: { id: DEMO_VIDEO, start: 344, end: 364 }, poster: '/clips/k12.jpg', focus: 0.22, status: 'ready' },
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
