import clsx from 'clsx'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Thumb } from './ui'

type Src = { poster: string; focus: number; yt: { id: string; start: number; end: number } }

// How much of a 16:9 frame's width is visible inside a 9:16 frame.
const VISIBLE = 9 / 16 / (16 / 9)

/** Turn "where the subject is" (0-1 across the 16:9 frame) into a crop offset (0-1) for object-position / iframe shift. */
export const cropX = (focus: number) => Math.min(1, Math.max(0, (focus - VISIBLE / 2) / (1 - VISIBLE)))

/**
 * Plays a slice of a YouTube video, cropped to fill a 9:16 frame and looped between start and end.
 * Talks to the embed over postMessage (the same protocol the official IFrame API uses) so no script tag is needed.
 * The iframe stays invisible until the video is actually playing, so the poster shows while it buffers.
 */
export function YouTubeLayer({ src, playing, muted = false, restart, onTime }: { src: Src; playing: boolean; muted?: boolean; restart?: number; onTime?: (t: number) => void }) {
  const ref = useRef<HTMLIFrameElement>(null)
  const [mounted, setMounted] = useState(playing)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const captionsOff = useRef(false)
  const onTimeRef = useRef(onTime)
  onTimeRef.current = onTime
  const { start, end } = src.yt

  useEffect(() => {
    if (playing) setMounted(true)
  }, [playing])

  const cmd = (func: string, args: unknown[] = []) => ref.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')

  useEffect(() => {
    if (!mounted) return
    let handshake: number | undefined
    const onMsg = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return
      let d: { event?: string; info?: any }
      try {
        d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      if (handshake) (clearInterval(handshake), (handshake = undefined))
      if (d.event === 'onReady' || d.event === 'initialDelivery') {
        setReady(true)
        // Our own burned-in caption sits on top, so hide YouTube's subtitles.
        cmd('unloadModule', ['captions'])
        cmd('unloadModule', ['cc'])
      }
      const state = d.event === 'onStateChange' ? d.info : d.info?.playerState
      if (state === 1 && !captionsOff.current) {
        captionsOff.current = true
        cmd('unloadModule', ['captions'])
        cmd('setOption', ['captions', 'track', {}])
      }
      if (state === 1) setVisible(true)
      if (state === 0) (cmd('seekTo', [start, true]), cmd('playVideo'))
      const t = d.info?.currentTime
      if (typeof t === 'number') {
        if (t >= end - 0.25) cmd('seekTo', [start, true])
        onTimeRef.current?.(Math.min(end - start, Math.max(0, t - start)))
      }
    }
    window.addEventListener('message', onMsg)
    const el = ref.current
    const listen = () => {
      let tries = 0
      handshake = window.setInterval(() => {
        el?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), '*')
        if (++tries > 40) clearInterval(handshake)
      }, 250)
    }
    el?.addEventListener('load', listen)
    return () => {
      window.removeEventListener('message', onMsg)
      el?.removeEventListener('load', listen)
      clearInterval(handshake)
    }
  }, [mounted, start, end])

  useEffect(() => {
    if (ready) cmd(playing ? 'playVideo' : 'pauseVideo')
  }, [playing, ready])
  useEffect(() => {
    if (ready) cmd(muted ? 'mute' : 'unMute')
  }, [muted, ready])
  useEffect(() => {
    if (ready && restart) (cmd('seekTo', [start, true]), cmd('playVideo'))
  }, [restart])

  if (!mounted) return null
  const params = new URLSearchParams({
    start: String(start),
    end: String(end),
    autoplay: '1',
    cc_load_policy: '0',
    mute: muted ? '1' : '0',
    controls: '0',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    enablejsapi: '1',
    origin: window.location.origin,
  })
  const width = 100 / VISIBLE
  return (
    <iframe
      ref={ref}
      title="Clip preview"
      src={`https://www.youtube-nocookie.com/embed/${src.yt.id}?${params}`}
      allow="autoplay; encrypted-media; picture-in-picture"
      tabIndex={-1}
      className={clsx('pointer-events-none absolute top-0 h-full max-w-none border-0 transition-opacity duration-300', visible ? 'opacity-100' : 'opacity-0')}
      style={{ width: `${width}%`, left: `${-(width - 100) * cropX(src.focus)}%` }}
    />
  )
}

/** A clip you can click to play, with a mute toggle and progress bar. Safe to put inside a link. */
export function ClipPlayer({ clip, caption, highlight, captionClass, className }: { clip: Src; caption?: string; highlight?: string; captionClass?: string; className?: string }) {
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [t, setT] = useState(0)
  const len = clip.yt.end - clip.yt.start
  const stop = (e: React.MouseEvent) => (e.preventDefault(), e.stopPropagation())

  return (
    <Thumb hue={0} clip={clip} caption={caption} highlight={highlight} captionClass={captionClass} className={className} playing={started ? playing : undefined} muted={muted} onTime={setT}>
      <button
        type="button"
        onClick={(e) => {
          stop(e)
          setStarted(true)
          setPlaying((p) => !p)
        }}
        aria-label={playing ? 'Pause clip' : 'Play clip'}
        className="group/play absolute inset-0 flex items-center justify-center focus-visible:outline-none"
      >
        <span
          className={clsx(
            'flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white ring-1 ring-white/20 backdrop-blur transition group-focus-visible/play:ring-2 group-focus-visible/play:ring-ember',
            playing ? 'scale-90 opacity-0 group-hover/play:opacity-100' : 'opacity-100',
          )}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-px fill-current" />}
        </span>
      </button>
      {started && (
        <button type="button" onClick={(e) => (stop(e), setMuted((m) => !m))} aria-label={muted ? 'Unmute' : 'Mute'} className="absolute bottom-3 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75">
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/15">
        <div className="h-full bg-ember transition-[width] duration-200 ease-linear" style={{ width: `${(t / len) * 100}%` }} />
      </div>
    </Thumb>
  )
}

/** Plays a muted preview while hovered, like a creator studio grid. */
export function HoverClip({ clip, ...rest }: { clip: Src; caption?: string; highlight?: string; captionClass?: string; className?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Thumb hue={0} clip={clip} playing={hover || undefined} muted {...rest} />
    </div>
  )
}
