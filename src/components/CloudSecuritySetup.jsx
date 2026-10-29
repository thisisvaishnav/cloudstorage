import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  KeyRound,
  Check,
  X,
  Copy,
  Download,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
  FileText
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import SecureLockerLogo from './SecureLockerLogo'

export default function CloudSecuritySetup({ userEmail, onFinish, onSignOut }) {
  // Step: 'password' | 'recovery-key'
  const [step, setStep] = useState('password')

  // Password fields
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // 16-Digit Recovery Key state
  const [recoveryKey, setRecoveryKey] = useState('')
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)

  // Initialize or fetch existing 16-digit recovery key for this user
  useEffect(() => {
    if (!userEmail) return
    const keyStorageKey = `nord_recovery_key_${userEmail.toLowerCase().trim()}`
    let existingKey = localStorage.getItem(keyStorageKey)
    if (!existingKey) {
      // Generate 16 digits formatted in 4 blocks: "XXXX XXXX XXXX XXXX"
      const digits = []
      for (let i = 0; i < 16; i++) {
        digits.push(Math.floor(Math.random() * 10))
      }
      const formatted = `${digits.slice(0, 4).join('')} ${digits.slice(4, 8).join('')} ${digits.slice(8, 12).join('')} ${digits.slice(12, 16).join('')}`
      existingKey = formatted
      localStorage.setItem(keyStorageKey, existingKey)
    }
    setRecoveryKey(existingKey)
  }, [userEmail])

  // Get previous passwords history for user
  const getPasswordHistory = () => {
    if (!userEmail) return []
    try {
      const historyStr = localStorage.getItem(`nord_pwd_history_${userEmail.toLowerCase().trim()}`)
      return historyStr ? JSON.parse(historyStr) : []
    } catch {
      return []
    }
  }

  // Password criteria evaluations
  const hasMinLength = password.length >= 10
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)
  const isOldPassword = getPasswordHistory().includes(password)

  const isPasswordStrong =
    hasMinLength && hasUppercase && hasLowercase && hasSpecial && !isOldPassword

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const canContinueToKey = isPasswordStrong && passwordsMatch

  // Calculate strength score
  const getStrengthScore = () => {
    let score = 0
    if (password.length >= 10) score += 1
    if (password.length >= 14) score += 1
    if (hasUppercase) score += 1
    if (hasLowercase) score += 1
    if (hasSpecial) score += 1
    if (/[0-9]/.test(password)) score += 1
    return score
  }

  const score = getStrengthScore()
  const strengthLabel =
    password.length === 0
      ? ''
      : isOldPassword
      ? 'Old Password'
      : score <= 2
      ? 'Weak'
      : score <= 4
      ? 'Moderate'
      : 'Strong (Ready)'

  // Handle proceed to step 2
  const handleProceedToRecovery = (e) => {
    e.preventDefault()
    if (!isPasswordStrong) {
      if (isOldPassword) {
        setPasswordError('Never use an old password again. Please choose a new password.')
      } else {
        setPasswordError('Please meet all the strong password requirements.')
      }
      return
    }
    if (!passwordsMatch) {
      setPasswordError('Passwords do not match. Please verify your confirmation.')
      return
    }

    setStep('recovery-key')
  }

  // Copy recovery key to clipboard
  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(recoveryKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Generate & Download the Cloud Recovery Key PDF
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const primaryBlue = [59, 102, 255]
      const textDark = [17, 24, 39]
      const textMuted = [107, 114, 128]
      const calloutBg = [242, 244, 252]

      // Header Bar
      doc.setFillColor(...primaryBlue)
      doc.rect(0, 0, 210, 10, 'F')

      // Branding Title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(...textDark)
      doc.text('Secure Locker / NordLocker', 20, 26)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...textMuted)
      doc.text('Zero-Knowledge Encrypted File Storage', 20, 32)

      // Divider
      doc.setDrawColor(229, 231, 235)
      doc.line(20, 38, 190, 38)

      // Section Title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(...textDark)
      doc.text('Cloud Recovery Key', 20, 50)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(...textMuted)
      doc.text(`Account Email: ${userEmail}`, 20, 58)
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 20, 64)

      // Recovery Key Box
      doc.setFillColor(...calloutBg)
      doc.roundedRect(20, 72, 170, 34, 3, 3, 'F')
      doc.setDrawColor(190, 205, 245)
      doc.roundedRect(20, 72, 170, 34, 3, 3, 'S')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(...primaryBlue)
      doc.text('CLOUD RECOVERY KEY (16 DIGITS)', 26, 81)

      doc.setFont('courier', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(...textDark)
      doc.text(recoveryKey, 26, 95)

      // Warning / Callout box matching screenshot
      doc.setFillColor(248, 250, 252)
      doc.roundedRect(20, 115, 170, 48, 3, 3, 'F')
      doc.setDrawColor(226, 232, 240)
      doc.roundedRect(20, 115, 170, 48, 3, 3, 'S')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...textDark)
      doc.text('Store this Recovery Key in a safe place', 26, 123)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9.5)
      doc.setTextColor(55, 65, 81)

      const safeP1 = doc.splitTextToSize(
        'If you lose your Cloud Password, you can restore the access to your files using the Cloud Recovery Key. Due to zero-knowledge policy, we do not store it. Please save and store your Recovery Key securely.',
        158
      )
      doc.text(safeP1, 26, 130)

      const safeP2 = doc.splitTextToSize(
        'If you lose both your Cloud Password and Cloud Recovery Key, you will permanently lose access to your encrypted data.',
        158
      )
      doc.text(safeP2, 26, 145)

      doc.setFont('helvetica', 'bold')
      doc.text('Stay safe!', 26, 157)

      // Why is a Recovery Key necessary section (verbatim copy)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(...textDark)
      doc.text('Why is a Recovery Key necessary?', 20, 176)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(55, 65, 81)

      const whyP1 = doc.splitTextToSize(
        'NordLocker provides an encrypted file storage based on zero-knowledge architecture. This means that no one but you can access your encrypted data.',
        170
      )
      doc.text(whyP1, 20, 185)

      const whyP2 = doc.splitTextToSize(
        'If you lose or forget your Cloud Password, you may restore it using the Cloud Recovery Key. Without the Cloud Recovery Key, we will not be able to restore access to your encrypted file storage and you may permanently lose access to it.',
        170
      )
      doc.text(whyP2, 20, 198)

      const whyP3 = doc.splitTextToSize(
        'Please make sure to memorize or save your Cloud Recovery Key somewhere safe.',
        170
      )
      doc.setFont('helvetica', 'bold')
      doc.text(whyP3, 20, 215)

      // Footer
      doc.setDrawColor(229, 231, 235)
      doc.line(20, 260, 190, 260)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...textMuted)
      doc.text('Confidential • Secure Locker Zero-Knowledge Architecture • Keep this document private and offline', 20, 268)

      // Save document
      const safeFilename = `Cloud-Recovery-Key-${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      doc.save(safeFilename)
      setDownloaded(true)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Could not generate PDF. Please copy and save your Recovery Key manually.')
    }
  }

  // Complete onboarding and save credentials
  const handleFinishSetup = () => {
    setIsFinishing(true)
    try {
      const emailKey = userEmail.toLowerCase().trim()

      // 1. Record password into history so it cannot be reused in future
      const history = getPasswordHistory()
      if (password && !history.includes(password)) {
        history.push(password)
        localStorage.setItem(`nord_pwd_history_${emailKey}`, JSON.stringify(history))
      }

      // 2. Mark zero-knowledge setup completed for this account
      localStorage.setItem(`cloud_setup_completed_${emailKey}`, 'true')

      // 3. Trigger callback to App.jsx to proceed into DriveDashboard
      setTimeout(() => {
        onFinish()
      }, 400)
    } catch (err) {
      console.error(err)
      onFinish()
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb] text-gray-900 font-sans flex flex-col justify-between antialiased selection:bg-[#3861fb] selection:text-white">
      {/* Top Navigation */}
      <header className="w-full max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SecureLockerLogo size={32} />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg tracking-tight leading-tight">
              Secure Locker
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Zero-Knowledge Cloud Encryption</span>
          </div>
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium cursor-pointer"
          >
            Cancel & Sign out
          </button>
        )}
      </header>

      {/* Main Center Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[580px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12">
          {/* STEP 1: CREATE CLOUD PASSWORD */}
          {step === 'password' && (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Step 1 of 2: Master Password
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-gray-400" /> Zero-Knowledge Protection
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Create your Cloud Password
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Protecting account: <span className="font-semibold text-gray-900">{userEmail}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Even if you sign up using Google or Apple ID, Secure Locker uses a zero-knowledge master password so only you have the key to decrypt your cloud files.
              </p>

              {passwordError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleProceedToRecovery} className="mt-6 space-y-5">
                {/* Main Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Master Cloud Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordError('')
                      }}
                      placeholder="Enter at least 10 characters..."
                      required
                      className="w-full h-12 px-4 pr-11 rounded-lg border border-gray-300 focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 text-gray-900 text-sm placeholder-gray-400 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Password strength:</span>
                      <span
                        className={`font-semibold ${
                          score <= 2
                            ? 'text-red-600'
                            : score <= 4
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {strengthLabel}
                      </span>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden ml-2">
                        <div
                          className={`h-full transition-all duration-300 ${
                            score >= 5
                              ? 'w-full bg-emerald-500'
                              : score >= 3
                              ? 'w-1/2 bg-amber-400'
                              : 'w-1/4 bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Confirm Cloud Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setPasswordError('')
                      }}
                      placeholder="Re-enter your Cloud Password..."
                      required
                      className="w-full h-12 px-4 pr-11 rounded-lg border border-gray-300 focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 text-gray-900 text-sm placeholder-gray-400 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
                        passwordsMatch ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                {/* Requirements Checklist */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2 text-xs">
                  <div className="font-semibold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                    Password Requirements:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                    <div
                      className={`flex items-center gap-2 ${
                        hasMinLength ? 'text-emerald-700 font-medium' : ''
                      }`}
                    >
                      {hasMinLength ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400" />
                      )}
                      <span>At least 10 characters</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        hasUppercase ? 'text-emerald-700 font-medium' : ''
                      }`}
                    >
                      {hasUppercase ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400" />
                      )}
                      <span>Uppercase letter (A-Z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        hasLowercase ? 'text-emerald-700 font-medium' : ''
                      }`}
                    >
                      {hasLowercase ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400" />
                      )}
                      <span>Lowercase letter (a-z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 ${
                        hasSpecial ? 'text-emerald-700 font-medium' : ''
                      }`}
                    >
                      {hasSpecial ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400" />
                      )}
                      <span>Special symbol (!@#$%)</span>
                    </div>

                    <div
                      className={`col-span-1 sm:col-span-2 flex items-center gap-2 ${
                        isOldPassword ? 'text-red-600 font-medium' : 'text-emerald-700'
                      }`}
                    >
                      {isOldPassword ? (
                        <>
                          <X className="w-4 h-4 text-red-600" />
                          <span>Old password detected (Never reuse an old password)</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Never use an old password again</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  type="submit"
                  disabled={!canContinueToKey}
                  className="w-full h-12 rounded-full bg-[#3861fb] hover:bg-[#2b52eb] text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Continue to Recovery Key</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: CLOUD RECOVERY KEY (Matches user screenshot) */}
          {step === 'recovery-key' && (
            <div>
              {/* Title & Email (Direct match to screenshot) */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Cloud Recovery Key
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-normal mt-1.5 mb-7">
                {userEmail}
              </p>

              {/* Recovery Key Outlined Field with Label (Direct match to screenshot) */}
              <div className="relative border border-gray-400 rounded-lg p-3.5 pt-4 bg-white transition-all focus-within:border-[#3861fb] focus-within:ring-1 focus-within:ring-[#3861fb]">
                <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-normal text-gray-500">
                  Cloud Recovery Key
                </label>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-medium tracking-wider text-gray-900 select-all">
                    {recoveryKey}
                  </span>
                  <button
                    onClick={handleCopyKey}
                    type="button"
                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                    title="Copy Recovery Key"
                  >
                    {copied ? (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Soft Blue Information Callout Card (Direct match to user screenshot) */}
              <div className="bg-[#f2f4fc] rounded-xl p-5 sm:p-6 flex items-start gap-4 text-left border border-blue-100/60 mt-6">
                <div className="w-7 h-7 rounded-full bg-[#3b66ff] text-white flex items-center justify-center shrink-0 font-serif font-bold text-sm mt-0.5 shadow-sm">
                  i
                </div>
                <div className="space-y-3 text-[14px] leading-relaxed text-gray-800">
                  <h4 className="font-bold text-gray-900 text-[15px]">
                    Store this Recovery Key in a safe place
                  </h4>
                  <p>
                    If you lose your Cloud Password, you can restore the access to your files using the Cloud Recovery Key. Due to zero-knowledge policy, we don’t store it. Please save and store your Recovery Key securely.
                  </p>
                  <p>
                    If you lose both your Cloud Password and Cloud Recovery Key, you will permanently lose access to your encrypted data.
                  </p>
                  <p className="font-medium text-gray-900">
                    Stay safe!
                  </p>
                </div>
              </div>

              {/* Explanatory Section: Why is a Recovery Key necessary? */}
              <div className="mt-6 p-5 sm:p-6 bg-gray-50 rounded-xl border border-gray-200/80 text-left">
                <h4 className="font-bold text-gray-900 text-[15px] mb-2.5">
                  Why is a Recovery Key necessary?
                </h4>
                <div className="text-[13.5px] leading-relaxed text-gray-600 space-y-2.5">
                  <p>
                    NordLocker provides an encrypted file storage based on zero-knowledge architecture. This means that no one but you can access your encrypted data.
                  </p>
                  <p>
                    If you lose or forget your Cloud Password, you may restore it using the Cloud Recovery Key. Without the Cloud Recovery Key, we won’t be able to restore access to your encrypted file storage and you may permanently lose access to it.
                  </p>
                  <p className="font-medium text-gray-800">
                    Please make sure to memorize or save your Cloud Recovery Key somewhere safe.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download Key and Finish */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className={`w-full sm:flex-1 h-12 rounded-full font-medium text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    downloaded
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {downloaded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Key Downloaded (.PDF)</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-blue-600" />
                      <span>Download Key</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleFinishSetup}
                  disabled={isFinishing}
                  className="w-full sm:flex-1 h-12 rounded-full font-medium text-sm bg-[#3861fb] hover:bg-[#2b52eb] text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{isFinishing ? 'Finalizing Setup...' : 'Finish'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1200px] mx-auto px-6 py-6 text-center text-xs text-gray-500">
        © 2026 Secure Locker • Zero-Knowledge Security & File Encryption
      </footer>
    </div>
  )
}
