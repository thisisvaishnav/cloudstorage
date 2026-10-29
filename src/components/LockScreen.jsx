import React, { useState } from 'react'
import { Lock, Unlock, ShieldCheck, ArrowRight, LogOut, KeyRound } from 'lucide-react'
import SecureLockerLogo from './SecureLockerLogo'

export default function LockScreen({
  userEmail,
  lockReason = 'Session locked due to inactivity',
  autoLockMinutes = 15,
  onUnlock,
  onSignOut,
}) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [unlocking, setUnlocking] = useState(false)

  const handleUnlock = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setUnlocking(true)
    setError('')

    // Simulating quick instant zero-knowledge master key decrypt
    setTimeout(() => {
      setUnlocking(false)
      onUnlock()
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1016]/95 backdrop-blur-md flex flex-col items-center justify-between p-6 sm:p-10 font-sans text-white antialiased animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SecureLockerLogo size={32} />
          <div className="flex items-baseline text-lg tracking-tight">
            <span className="font-semibold text-white">Secure</span>
            <span className="font-bold text-white ml-0.5">Locker</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#22c55e] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Knowledge Vault Encrypted</span>
        </div>
      </div>

      {/* Main Lock Box */}
      <div className="w-full max-w-md bg-[#161822] border border-[#2d3244] rounded-2xl p-8 sm:p-9 shadow-2xl flex flex-col items-center text-center my-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3b5998]/40 to-[#5d59cb]/30 border border-[#5d59cb]/40 flex items-center justify-center text-[#8e8aff] mb-5 shadow-lg relative">
          <Lock className="w-8 h-8 text-[#8e8aff]" />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-[#161822]" title="Locked" />
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight">
          Session Locked
        </h2>

        <p className="text-xs text-[#9a9ba4] mt-1.5 leading-relaxed">
          {lockReason} ({autoLockMinutes} min timeout).
          <br />Enter your password or tap unlock to resume.
        </p>

        {/* User Card */}
        <div className="w-full mt-6 p-3 rounded-xl bg-[#1f2330] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-full bg-[#5d59cb] text-white font-semibold flex items-center justify-center text-sm shrink-0">
              {(userEmail || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-left truncate">
              <div className="text-xs font-medium text-white truncate max-w-[190px]">
                {userEmail || 'user@securelocker.com'}
              </div>
              <div className="text-[11px] text-[#8e94a5]">Active Workspace</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#8b7bf4] px-2 py-0.5 rounded bg-[#8b7bf4]/10">
            Protected
          </span>
        </div>

        {/* Unlock Form */}
        <form onSubmit={handleUnlock} className="w-full mt-6 space-y-3.5">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter master password or PIN (optional)"
              className="w-full h-12 px-4 rounded-xl bg-[#1a1c26] border border-[#303546] text-xs text-white placeholder-[#787c8c] focus:outline-none focus:border-[#5d59cb] transition-colors"
            />
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={unlocking}
            className="w-full h-12 rounded-xl bg-[#5d59cb] hover:bg-[#524eb8] active:bg-[#4743a8] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-indigo-950/50 disabled:opacity-60"
          >
            {unlocking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Decrypting Workspace...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock Session</span>
              </>
            )}
          </button>
        </form>

        {/* Sign out link */}
        <button
          type="button"
          onClick={onSignOut}
          className="mt-5 text-xs text-[#9a9ba4] hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch account or Sign out</span>
        </button>
      </div>

      {/* Footer hint */}
      <div className="text-center text-[11px] text-[#6f7384]">
        Zero-Knowledge Cryptography ensures all cryptographic keys remain locked in local memory.
      </div>
    </div>
  )
}
