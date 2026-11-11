import { ArrowRight } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo, Thumb } from '../components/ui'

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const signup = mode === 'signup'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter an email like you@example.com.')
    nav('/app')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
      <div className="flex flex-col gutter py-6">
        <Link to="/" aria-label="Cutline home">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-[380px] flex-1 flex-col justify-center py-12">
          <h1 className="display text-[30px] font-semibold leading-tight">{signup ? 'Start clipping' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-fg-muted">{signup ? 'Connect a channel and get your first clips after your next stream.' : 'Log in to see what Cutline found in your last stream.'}</p>

          <div className="mt-8 flex flex-col gap-2.5">
            <button type="button" onClick={() => nav('/app')} className="btn-ghost w-full py-2.5">
              <span className="h-3 w-3 rounded-[3px] bg-[#A970FF]" /> Continue with Twitch
            </button>
            <button type="button" onClick={() => nav('/app')} className="btn-ghost w-full py-2.5">
              <span className="h-3 w-3 rounded-full bg-gradient-to-br from-[#4285F4] via-[#34A853] to-[#FBBC05]" /> Continue with Google
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-fg-dim">
            <span className="h-px flex-1 bg-white/[0.08]" /> or with email <span className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
            <label htmlFor="email" className="text-xs text-fg-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              aria-invalid={!!error}
              aria-describedby={error ? 'email-err' : undefined}
            />
            {error && (
              <p id="email-err" className="text-xs text-[#ff8a8a]">
                {error}
              </p>
            )}
            <button className="btn-primary mt-2 w-full py-2.5">
              {signup ? 'Create account' : 'Send login link'} <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-dim">
            {signup ? 'Already have an account? ' : 'New to Cutline? '}
            <Link to={signup ? '/login' : '/signup'} className="text-fg underline-offset-4 hover:underline">
              {signup ? 'Log in' : 'Create an account'}
            </Link>
          </p>
        </div>
        <p className="text-xs text-fg-dim">By continuing you agree to the Terms and Privacy Policy.</p>
      </div>

      <div className="relative hidden overflow-hidden border-l hairline lg:block">
        <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6 opacity-90 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
          {[18, 350, 200, 45, 280, 160, 32, 8, 120].map((h, i) => (
            <div key={i} className={i % 3 === 1 ? 'translate-y-16' : ''}>
              <Thumb hue={h} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-6 bottom-6">
          <div className="glass-strong rounded-2xl p-5">
            <p className="text-[15px] leading-relaxed">“I stream eight hours, go to bed, and wake up to six clips already posted. My Shorts channel passed the main channel in two months.”</p>
            <p className="mt-3 text-xs text-fg-dim">Example testimonial · replace with a real one before launch</p>
          </div>
        </div>
      </div>
    </div>
  )
}
