import React, { useState } from 'react'
import {
  Lock,
  Smartphone,
  Shield,
  Sliders,
  Moon,
  ExternalLink,
  ChevronDown,
  Check,
  Download,
  ShieldAlert,
  Ban,
  X,
  Activity,
  Laptop
} from 'lucide-react'

export default function SettingsPage({
  userEmail,
  autoLockMinutes = 5,
  onChangeAutoLockMinutes,
  activityLogs = [],
  devices = [],
  onToggleBlockDevice,
}) {
  const [showAutoLockMenu, setShowAutoLockMenu] = useState(false)
  const [showAppearanceMenu, setShowAppearanceMenu] = useState(false)
  const [appearance, setAppearance] = useState('System')
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [showMfaModal, setShowMfaModal] = useState(false)
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false)

  // Options specified by user: 5, 10, 15, and 45 minutes
  const autoLockOptions = [
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 45, label: '45 min' },
  ]

  // Export / Download Activity Logs as JSON
  const handleDownloadLogs = () => {
    const logData = {
      app: 'Secure Locker Zero-Knowledge Vault',
      exportedAt: new Date().toISOString(),
      account: userEmail || 'user@securelocker.com',
      autoLockMinutes,
      devices,
      activityLogs,
    }
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SecureLocker_Activity_Log_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const blockedCount = devices.filter((d) => d.status === 'blocked').length

  return (
    <div className="flex-1 bg-[#181a23] rounded-2xl border border-[#202330] p-6 sm:p-8 flex flex-col overflow-y-auto max-w-5xl text-[#c9cbd5] font-sans antialiased shadow-sm relative">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6">Settings</h2>

      {/* 1. SECURITY SECTION */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-[#8e94a5] mb-3">Security</h3>

        <div className="flex flex-col gap-2.5">
          {/* Autolock Card */}
          <div className="bg-[#202330] border border-white/[0.02] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-[#8e94a5] shrink-0">
                {/* Clean filled padlock matching screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Autolock</h4>
                <p className="text-xs text-[#8e94a5] mt-0.5">
                  Automatically locks the app after a chosen period of inactivity
                </p>
              </div>
            </div>

            {/* Dropdown with 5 min, 10 min, 15 min, 45 min */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowAutoLockMenu(!showAutoLockMenu)}
                className="h-9 px-4 rounded-lg bg-[#272b3c] hover:bg-[#2e3347] border border-white/[0.06] text-xs font-medium text-white flex items-center gap-2.5 min-w-[105px] justify-between cursor-pointer transition-colors"
              >
                <span>{autoLockMinutes} min</span>
                <ChevronDown className="w-4 h-4 text-[#8e94a5]" />
              </button>

              {showAutoLockMenu && (
                <div className="absolute right-0 top-11 w-36 bg-[#262a3a] border border-[#34394e] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {autoLockOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChangeAutoLockMinutes(opt.value)
                        setShowAutoLockMenu(false)
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        autoLockMinutes === opt.value
                          ? 'bg-[#5c50eb] text-white font-medium'
                          : 'text-[#c9cbd5] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {autoLockMinutes === opt.value && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Phone authentication Card */}
          <div className="bg-[#202330] border border-white/[0.02] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-[#8e94a5] shrink-0">
                {/* Fingerprint / phone biometric icon matching screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 11c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
                  <path d="M17 11c0 3.87-3.13 7-7 7s-7-3.13-7-7a7 7 0 0 1 14 0z" />
                  <path d="M21 11c0 6.08-4.92 11-11 11S-1 17.08-1 11 3.92 0 10 0s11 4.92 11 11z" />
                  <path d="M12 2a10 10 0 0 0-10 10c0 3.32 1.63 6.27 4.13 8.08" />
                  <path d="M18.87 18.08A9.97 9.97 0 0 0 22 12c0-5.52-4.48-10-10-10" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Phone authentication</h4>
                <p className="text-xs text-[#8e94a5] mt-0.5">
                  Enable login authentication with a mobile device
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPhoneModal(true)}
                className="h-8 px-4 rounded-full border border-white/[0.2] hover:border-white/40 hover:bg-white/[0.06] text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Set up device
              </button>
              <span className="h-8 px-3 rounded-full bg-[#181a24] border border-white/[0.04] text-xs text-[#8e94a5] flex items-center justify-center font-medium">
                Disabled
              </span>
            </div>
          </div>

          {/* Multi-factor authentication (MFA) Card */}
          <div className="bg-[#202330] border border-white/[0.02] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-[#8e94a5] shrink-0">
                {/* Shield icon matching screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Multi-factor authentication (MFA)</h4>
                <p className="text-xs text-[#8e94a5] mt-0.5">
                  Use authentication apps or backup codes for added security
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowMfaModal(true)}
                className="text-xs font-medium text-[#7a81f3] hover:text-[#959bf7] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Manage</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <span className="h-8 px-3 rounded-full bg-[#181a24] border border-white/[0.04] text-xs text-[#8e94a5] flex items-center justify-center font-medium">
                Disabled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. OTHER SECTION */}
      <div>
        <h3 className="text-xs font-semibold text-[#8e94a5] mb-3">Other</h3>

        <div className="flex flex-col gap-2.5">
          {/* Activity Log Card */}
          <div className="bg-[#202330] border border-white/[0.02] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-4 cursor-pointer flex-1"
              onClick={() => setShowActivityModal(true)}
            >
              <div className="text-[#8e94a5] shrink-0">
                {/* Sliders icon matching screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white">Activity Log</h4>
                  {blockedCount > 0 && (
                    <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      {blockedCount} Threats Blocked
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadLogs}
              className="h-8 px-4 rounded-full border border-white/[0.2] hover:border-white/40 hover:bg-white/[0.06] text-xs font-medium text-white transition-colors cursor-pointer shrink-0"
            >
              Download logs
            </button>
          </div>

          {/* What's new Card */}
          <div
            onClick={() => setShowWhatsNewModal(true)}
            className="bg-[#202330] border border-white/[0.02] rounded-xl px-5 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#232635] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-[#8e94a5] shrink-0">
                {/* Laptop with star icon matching screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <line x1="2" y1="20" x2="22" y2="20" />
                  <path d="M12 7l.8 1.6 1.8.3-1.3 1.3.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.3 1.8-.3z" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-white">What's new</h4>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="bg-[#202330] border border-white/[0.02] rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-[#8e94a5] shrink-0">
                {/* Half moon icon matching screenshot */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Appearance</h4>
                <p className="text-xs text-[#8e94a5] mt-0.5">
                  Choose the theme you want to use for the app
                </p>
              </div>
            </div>

            {/* Dropdown with System / Dark / Light */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
                className="h-9 px-4 rounded-lg bg-[#272b3c] hover:bg-[#2e3347] border border-white/[0.06] text-xs font-medium text-white flex items-center gap-2.5 min-w-[105px] justify-between cursor-pointer transition-colors"
              >
                <span>{appearance}</span>
                <ChevronDown className="w-4 h-4 text-[#8e94a5]" />
              </button>

              {showAppearanceMenu && (
                <div className="absolute right-0 top-11 w-32 bg-[#262a3a] border border-[#34394e] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {['System', 'Dark', 'Light'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        setAppearance(mode)
                        setShowAppearanceMenu(false)
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        appearance === mode
                          ? 'bg-[#5c50eb] text-white font-medium'
                          : 'text-[#c9cbd5] hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span>{mode}</span>
                      {appearance === mode && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED ACTIVITY LOG & BLOCKED DEVICES MODAL */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] bg-[#1a1c27] border border-[#2d3244] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#262a3d] flex items-center justify-between bg-[#1f2230]">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-[#8b7bf4]" />
                <div>
                  <h3 className="text-sm font-bold text-white">Activity Log & Security Audit</h3>
                  <p className="text-[11px] text-[#8e94a5]">
                    Downloaded files, uploaded files, login history, and blocked unauthorized devices
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadLogs}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download logs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Blocked Devices Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Device Security & Blocked Access</span>
                  </h4>
                  <span className="text-[11px] text-rose-400 font-medium">
                    {blockedCount} Device(s) Blocked
                  </span>
                </div>

                <div className="space-y-2.5">
                  {devices.map((d) => (
                    <div
                      key={d.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        d.status === 'blocked'
                          ? 'bg-rose-500/[0.04] border-rose-500/30'
                          : 'bg-[#212433] border-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            d.status === 'blocked'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{d.name}</span>
                            {d.isCurrent && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                                THIS DEVICE
                              </span>
                            )}
                            {d.status === 'blocked' && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                                <Ban className="w-2.5 h-2.5" /> BLOCKED
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8e94a5] mt-0.5">
                            {d.os} • {d.browser} • Location:{' '}
                            <strong className="text-white">{d.location}</strong> (IP: {d.ip})
                          </div>
                          {d.blockReason && (
                            <div className="text-[10.5px] text-rose-300 mt-0.5">{d.blockReason}</div>
                          )}
                        </div>
                      </div>

                      {!d.isCurrent && (
                        <button
                          type="button"
                          onClick={() => onToggleBlockDevice(d.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            d.status === 'blocked'
                              ? 'bg-white/[0.08] hover:bg-white/[0.15] text-white'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {d.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Uploads, Downloads & Logins Feed */}
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#8b7bf4]" />
                  <span>Recent Uploads, Downloads & Logins ({activityLogs.length})</span>
                </h4>

                <div className="divide-y divide-[#262a3d] border border-[#262a3d] rounded-xl overflow-hidden bg-[#212433]">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{log.title}</span>
                          {log.fileName && (
                            <span className="font-mono text-[11px] text-[#8b7bf4] bg-[#8b7bf4]/10 px-1.5 py-0.5 rounded">
                              {log.fileName}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#8e94a5] mt-0.5">{log.details}</div>
                      </div>

                      <div className="text-right text-[11px] text-[#8e94a5] shrink-0">
                        <div>{log.time}</div>
                        <div className="text-[#65697d]">{log.location || 'New York, US'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WHAT'S NEW MODAL */}
      {showWhatsNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1a1c27] border border-[#2d3244] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">What's New in Secure Locker</h3>
              <button
                type="button"
                onClick={() => setShowWhatsNewModal(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-[#a4a8bc]">
              <div className="p-3 rounded-lg bg-[#212433] border border-white/[0.04]">
                <div className="font-semibold text-white">Auto-Lock Inactivity Options</div>
                <div>Configurable auto-lock timeouts: 5, 10, 15, and 45 minutes.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#212433] border border-white/[0.04]">
                <div className="font-semibold text-white">Activity Log Audit Trail</div>
                <div>Review and download file uploads, downloads, and blocked devices.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowWhatsNewModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#5c50eb] hover:bg-[#4f42e4] text-xs font-semibold text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PHONE AUTH MODAL */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1a1c27] border border-[#2d3244] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Phone Authentication</h3>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#8e94a5] leading-relaxed">
              Pair your mobile device with your Secure Locker vault to approve incoming login requests with biometric FaceID or fingerprint.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-[#212433] border border-white/[0.04] text-center text-xs text-white font-mono">
              Scan QR code in Secure Locker Mobile App
            </div>
            <button
              type="button"
              onClick={() => setShowPhoneModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#5c50eb] hover:bg-[#4f42e4] text-xs font-semibold text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MFA MODAL */}
      {showMfaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1a1c27] border border-[#2d3244] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Multi-factor Authentication</h3>
              <button
                type="button"
                onClick={() => setShowMfaModal(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#8e94a5] leading-relaxed">
              Add a second verification layer with an authenticator app (Google Authenticator, Authy) or hardware security key (YubiKey).
            </p>
            <button
              type="button"
              onClick={() => setShowMfaModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-[#5c50eb] hover:bg-[#4f42e4] text-xs font-semibold text-white cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
