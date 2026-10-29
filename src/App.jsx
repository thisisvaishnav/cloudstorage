import React, { useState, useEffect } from 'react'
import {
  useSignIn,
  useSignUp,
  useUser,
  useClerk,
} from '@clerk/react'
import SecureLockerLogo from './components/SecureLockerLogo'
import cloudIllustration from './assets/cloud_illustration.png'
import DriveDashboard from './components/DriveDashboard'
import CloudSecuritySetup from './components/CloudSecuritySetup'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.43 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.13z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.57 1.24 6.58l4.04 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// Dedicated SSO Callback processor component
function SSOCallbackHandler() {
  const clerk = useClerk()
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let active = true
    async function processSSO() {
      if (!clerk.loaded) return
      try {
        await clerk.handleRedirectCallback(
          {
            signInForceRedirectUrl: '/',
            signUpForceRedirectUrl: '/',
            signInFallbackRedirectUrl: '/',
            signUpFallbackRedirectUrl: '/',
          },
          (to) => {
            if (active) {
              window.location.href = to || '/'
            }
          }
        )
      } catch (err) {
        console.error('SSO callback processing error:', err)
        if (active) {
          setErrorMsg(
            err?.errors?.[0]?.longMessage ||
            err?.errors?.[0]?.message ||
            err?.message ||
            'Google authentication could not be completed.'
          )
        }
      }
    }
    processSSO()
    return () => {
      active = false
    }
  }, [clerk, clerk.loaded])

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0e1016] text-white p-6 font-sans">
      {errorMsg ? (
        <div className="max-w-md w-full bg-[#151822] border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 text-xl">
            ⚠️
          </div>
          <h2 className="text-xl font-semibold mb-2 text-white">Authentication Failed</h2>
          <p className="text-sm text-[#9a9ba4] mb-6">{errorMsg}</p>
          <button
            onClick={() => {
              window.location.href = '/'
            }}
            className="w-full py-3.5 rounded-full bg-[#3f5fff] hover:bg-[#3250e6] text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Return to Sign in
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-[#3f5fff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-200">Completing Google Authentication...</p>
          <p className="text-xs text-[#9a9ba4]">Setting up your Secure Locker Google Drive workspace</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  // Check if we are on the sso callback route
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/sso-callback')) {
    return <SSOCallbackHandler />
  }

  const { isSignedIn, user, isLoaded: isUserLoaded } = useUser()
  const clerk = useClerk()
  const { signOut } = clerk
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn()
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp()

  // 'home' | 'login' | 'signup'
  const [currentView, setCurrentView] = useState('home')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [appleLoading, setAppleLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoUser, setDemoUser] = useState(null)
  const [setupCompleted, setSetupCompleted] = useState(false)

  // Helper to determine if zero-knowledge security setup has been completed
  const isSetupCompleted = (accountEmail) => {
    if (!accountEmail) return false
    try {
      return localStorage.getItem(`cloud_setup_completed_${accountEmail.toLowerCase().trim()}`) === 'true'
    } catch {
      return false
    }
  }

  useEffect(() => {
    setError('')
    setCode('')
    setStep('email')
    setGoogleLoading(false)
    setAppleLoading(false)
  }, [currentView])

  // Google OAuth handler (handles both Sign-in and Sign-up unified)
  const handleGoogleAuth = async () => {
    setError('')
    setGoogleLoading(true)
    const redirectUrl = `${window.location.origin}/sso-callback`
    const redirectUrlComplete = `${window.location.origin}/`

    try {
      const client = clerk?.client || (typeof window !== 'undefined' ? window.Clerk?.client : null)
      if (!client) {
        throw new Error('Authentication client not initialized yet. Please try again.')
      }

      if (typeof client.signIn?.authenticateWithRedirect === 'function') {
        await client.signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl,
          redirectUrlComplete,
        })
        return
      }

      if (typeof client.signUp?.authenticateWithRedirect === 'function') {
        await client.signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl,
          redirectUrlComplete,
        })
        return
      }

      throw new Error('Google OAuth redirect is not available.')
    } catch (err) {
      console.error('Google OAuth error:', err)
      setError(
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Google authentication failed.'
      )
      setGoogleLoading(false)
    }
  }

  // Apple OAuth handler
  const handleAppleAuth = async () => {
    setError('')
    setAppleLoading(true)
    const redirectUrl = `${window.location.origin}/sso-callback`
    const redirectUrlComplete = `${window.location.origin}/`

    try {
      const client = clerk?.client || (typeof window !== 'undefined' ? window.Clerk?.client : null)
      if (!client) {
        throw new Error('Authentication client not initialized yet. Please try again.')
      }

      if (typeof client.signIn?.authenticateWithRedirect === 'function') {
        await client.signIn.authenticateWithRedirect({
          strategy: 'oauth_apple',
          redirectUrl,
          redirectUrlComplete,
        })
        return
      }
      if (typeof client.signUp?.authenticateWithRedirect === 'function') {
        await client.signUp.authenticateWithRedirect({
          strategy: 'oauth_apple',
          redirectUrl,
          redirectUrlComplete,
        })
        return
      }
      throw new Error('Apple OAuth redirect is not available.')
    } catch (err) {
      console.error('Apple OAuth error:', err)
      setError(
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        'Apple authentication failed.'
      )
      setAppleLoading(false)
    }
  }

  // Email Submit for Login
  const handleLoginSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!isSignInLoaded) {
      setDemoUser(email)
      return
    }

    setLoading(true)
    setError('')
    try {
      const result = await signIn.create({ identifier: email })
      const emailCodeFactor = result.supportedFirstFactors?.find(
        (f) => f.strategy === 'email_code'
      )

      if (emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: emailCodeFactor.emailAddressId,
        })
        setStep('code')
      } else {
        setStep('code')
      }
    } catch (err) {
      console.error('Clerk Sign In Error:', err)
      if (err?.errors?.[0]?.code === 'form_identifier_not_found') {
        setError('No account found for this email. Click "Sign up" above to create one.')
      } else {
        setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Failed to initiate login.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Verification Code Submit for Login
  const handleLoginCodeSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!code) {
      setError('Please enter the verification code.')
      return
    }
    if (!isSignInLoaded) return

    setLoading(true)
    setError('')
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      })

      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId })
      } else {
        setError('Verification incomplete. Please check your code.')
      }
    } catch (err) {
      console.error(err)
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Invalid verification code.')
    } finally {
      setLoading(false)
    }
  }

  // Email Submit for Sign Up
  const handleSignUpSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!isSignUpLoaded) {
      setDemoUser(email)
      return
    }

    setLoading(true)
    setError('')
    try {
      await signUp.create({ emailAddress: email })
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setStep('code')
    } catch (err) {
      console.error('Clerk Sign Up Error:', err)
      if (err?.errors?.[0]?.code === 'form_identifier_exists') {
        setError('That account already exists. Please click "Log in" to sign in.')
      } else {
        setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Sign up initiation failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Verification Code Submit for Sign Up
  const handleSignUpCodeSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!code) {
      setError('Please enter the verification code.')
      return
    }
    if (!isSignUpLoaded) return

    setLoading(true)
    setError('')
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setSignUpActive({ session: completeSignUp.createdSessionId })
      } else {
        setError('Verification pending. Please verify your details.')
      }
    } catch (err) {
      console.error(err)
      setError(err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || 'Invalid verification code.')
    } finally {
      setLoading(false)
    }
  }

  // Common footer component for Login & Create Account pages
  const AuthFooter = () => (
    <footer className="w-full max-w-[1780px] mx-auto px-6 sm:px-12 py-8 flex flex-col md:flex-row items-center justify-between text-[13px] text-[#9a9ba4] gap-4">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8">
        <span>© 2026 Secure Locker. All rights reserved.</span>
        <a href="#support" className="hover:text-white transition-colors duration-150">
          Support center
        </a>
        <a href="#terms" className="hover:text-white transition-colors duration-150">
          Terms of service
        </a>
      </div>

      <div className="flex items-center gap-6 sm:gap-7">
        <button
          type="button"
          className="flex items-center gap-2 hover:text-white transition-colors duration-150 cursor-pointer"
        >
          <SunIcon />
          <span>Switch to light mode</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 hover:text-white transition-colors duration-150 cursor-pointer"
        >
          <GlobeIcon />
          <span>English</span>
          <span className="text-[10px] ml-0.5">▼</span>
        </button>
      </div>
    </footer>
  )

  // 1. Authenticated: Check for Zero-Knowledge Cloud Password & Recovery Key Setup
  if ((isUserLoaded && isSignedIn) || demoUser) {
    const userEmail = user?.primaryEmailAddress?.emailAddress || demoUser || 'user@securelocker.com'
    const completed = isSetupCompleted(userEmail) || setupCompleted

    // Even if user signed up via Google or Apple ID or email, ask them to make a password & recovery key
    if (!completed) {
      return (
        <CloudSecuritySetup
          userEmail={userEmail}
          onFinish={() => {
            setSetupCompleted(true)
          }}
          onSignOut={() => {
            if (isSignedIn && signOut) {
              signOut()
            }
            setDemoUser(null)
            setSetupCompleted(false)
            setCurrentView('home')
          }}
        />
      )
    }

    return (
      <DriveDashboard
        userEmail={userEmail}
        onSignOut={() => {
          if (isSignedIn && signOut) {
            signOut()
          }
          setDemoUser(null)
          setSetupCompleted(false)
          setCurrentView('home')
        }}
      />
    )
  }

  // 2. Landing / Main Welcome Page (Signed Out)
  if (currentView === 'home') {
    return (
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#1b1b1b] text-white selection:bg-[#5d59cb] selection:text-white font-sans antialiased overflow-x-hidden">
        {/* Left Column: Sign-in / Authentication */}
        <div className="w-full lg:w-[70.6%] flex flex-col justify-between min-h-screen bg-[#1b1b1b] px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-7 relative">
          {/* Top-left Brand Logo */}
          <header className="flex items-center gap-2.5 z-10">
            <SecureLockerLogo size={36} />
            <div className="flex items-baseline text-[21px] tracking-[-0.015em] select-none">
              <span className="font-semibold text-white">Secure</span>
              <span className="font-bold text-white ml-0.5">Locker</span>
              <sup className="text-[10px] text-white/70 ml-0.5 font-normal tracking-normal">®</sup>
            </div>
          </header>

          {/* Center Main Sign-in Card */}
          <main className="w-full max-w-[408px] mx-auto my-auto py-12 flex flex-col items-start justify-center">
            <h1 className="text-[34px] sm:text-[36px] font-semibold text-white tracking-[-0.02em] leading-tight">
              Welcome to the Cloud
            </h1>

            <p className="mt-3.5 text-[15.5px] sm:text-[16px] text-[#b4b4b4] leading-normal font-normal">
              Use your Secure Locker Account to sign in.
            </p>

            <div className="mt-11 flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={() => setCurrentView('login')}
                className="w-full h-[62px] rounded-full bg-[#5d59cb] hover:bg-[#524eb8] active:bg-[#4945b0] text-white text-[16px] font-medium tracking-[-0.01em] transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5d59cb] focus:ring-offset-2 focus:ring-offset-[#1b1b1b]"
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('signup')}
                className="w-full h-[62px] rounded-full bg-transparent hover:bg-white/[0.04] active:bg-white/[0.08] text-white text-[16px] font-medium tracking-[-0.01em] border border-white/30 hover:border-white/50 transition-all duration-150 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-[#1b1b1b]"
              >
                Create new account
              </button>
            </div>
          </main>

          {/* Subtle footer spacer */}
          <div className="h-6 hidden lg:block" aria-hidden="true" />
        </div>

        {/* Right Column: Illustration Panel */}
        <div className="w-full lg:w-[29.4%] bg-[#22222f] flex items-center justify-center p-8 sm:p-10 lg:p-8 xl:p-10 overflow-hidden relative border-t lg:border-t-0 border-[#2b2b3b]/60">
          <div className="w-full max-w-[420px] lg:max-w-none flex items-center justify-center">
            <img
              src={cloudIllustration}
              alt="Cloud security illustration"
              className="w-full max-h-[85vh] object-contain select-none pointer-events-none drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    )
  }

  // 3. Login Page
  if (currentView === 'login') {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between bg-[#0e1016] text-white selection:bg-[#3f5fff] selection:text-white font-sans antialiased">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          {/* Card */}
          <div className="w-full max-w-[568px] bg-[#151822] rounded-[16px] px-8 sm:px-14 py-11 flex flex-col items-center shadow-2xl border border-white/[0.04]">
            {/* Title */}
            <h1 className="mt-2 text-[30px] sm:text-[32px] font-semibold text-white tracking-[-0.02em] text-center">
              Log in
            </h1>

            {/* Subtitle link */}
            <p className="mt-3 text-[14.5px] text-[#9a9ba4] text-center">
              Don’t have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentView('signup')}
                className="text-[#3f5fff] hover:underline cursor-pointer font-medium"
              >
                Sign up
              </button>
            </p>

            {error && (
              <div className="mt-5 w-full px-4 py-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-300 text-[13.5px] text-center">
                {error}
              </div>
            )}

            {step === 'email' ? (
              <>
                {/* Email form */}
                <form onSubmit={handleLoginSubmit} className="mt-8 w-full flex flex-col">
                  <div className="w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      className="w-full h-[58px] px-4 rounded-[6px] bg-transparent border border-[#303544] text-[15px] text-white placeholder-[#787c8c] focus:outline-none focus:border-[#3f5fff] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 w-full h-[54px] rounded-full bg-[#3f5fff] hover:bg-[#3250e6] active:bg-[#2843cb] text-white text-[15px] font-medium transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#3f5fff] focus:ring-offset-2 focus:ring-offset-[#151822] disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Continue'}\n                  </button>
                </form>

                {/* Forgot password link */}
                <button
                  type="button"
                  onClick={() => handleLoginSubmit({ preventDefault: () => {} })}
                  className="mt-5 text-[14.5px] text-[#3f5fff] hover:underline cursor-pointer font-medium"
                >
                  Forgot your password?
                </button>

                {/* Secondary login options */}
                <div className="mt-7 w-full flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={googleLoading}
                    onClick={handleGoogleAuth}
                    className="w-full h-[56px] rounded-full bg-transparent border border-[#303544] hover:bg-white/[0.03] active:bg-white/[0.06] text-white text-[14.5px] font-medium transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    <GoogleIcon />
                    <span>{googleLoading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={appleLoading}
                    onClick={handleAppleAuth}
                    className="w-full h-[56px] rounded-full bg-transparent border border-[#303544] hover:bg-white/[0.03] active:bg-white/[0.06] text-white text-[14.5px] font-medium transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    <AppleIcon />
                    <span>{appleLoading ? 'Connecting to Apple...' : 'Sign in with Apple'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (email) {
                        setDemoUser(email)
                      } else {
                        setDemoUser('demo.user@securelocker.com')
                      }
                    }}
                    className="w-full h-[56px] rounded-full bg-transparent border border-[#303544] hover:bg-white/[0.03] active:bg-white/[0.06] text-white text-[14.5px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer"
                  >
                    Enter Google Drive Workspace Demo
                  </button>
                </div>
              </>
            ) : (
              /* Verification Code Form */
              <form onSubmit={handleLoginCodeSubmit} className="mt-8 w-full flex flex-col">
                <p className="text-[14px] text-[#b4b4b4] text-center mb-4">
                  Enter the verification code sent to <span className="text-white font-medium">{email}</span>
                </p>

                <div className="w-full">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code"
                    autoFocus
                    required
                    className="w-full h-[58px] px-4 rounded-[6px] bg-transparent border border-[#303544] text-[16px] text-white text-center tracking-widest placeholder-[#787c8c] focus:outline-none focus:border-[#3f5fff] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full h-[54px] rounded-full bg-[#3f5fff] hover:bg-[#3250e6] active:bg-[#2843cb] text-white text-[15px] font-medium transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#3f5fff] focus:ring-offset-2 focus:ring-offset-[#151822] disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="mt-4 text-[13.5px] text-[#9a9ba4] hover:text-white transition-colors"
                >
                  Use a different email
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <AuthFooter />
      </div>
    )
  }

  // 4. Create Account Page
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#0e1016] text-white selection:bg-[#3f5fff] selection:text-white font-sans antialiased">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Card */}
        <div className="w-full max-w-[568px] bg-[#151822] rounded-[16px] px-8 sm:px-14 py-11 flex flex-col items-center shadow-2xl border border-white/[0.04]">
          {/* Title */}
          <h1 className="mt-2 text-[30px] sm:text-[32px] font-semibold text-white tracking-[-0.02em] text-center">
            Create an account
          </h1>

          {/* Subtitle link */}
          <p className="mt-3 text-[14.5px] text-[#9a9ba4] text-center">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="text-[#3f5fff] hover:underline cursor-pointer font-medium"
            >
              Log in
            </button>
          </p>

          {error && (
            <div className="mt-5 w-full px-4 py-3 rounded-[8px] bg-red-500/10 border border-red-500/30 text-red-300 text-[13.5px] text-center">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <>
              {/* Social login buttons */}
              <div className="mt-8 w-full flex flex-col gap-3">
                <button
                  type="button"
                  disabled={googleLoading}
                  onClick={handleGoogleAuth}
                  className="w-full h-[56px] rounded-full bg-transparent border border-[#303544] hover:bg-white/[0.03] active:bg-white/[0.06] text-white text-[14.5px] font-medium transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <GoogleIcon />
                  <span>{googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
                </button>

                <button
                  type="button"
                  disabled={appleLoading}
                  onClick={handleAppleAuth}
                  className="w-full h-[56px] rounded-full bg-transparent border border-[#303544] hover:bg-white/[0.03] active:bg-white/[0.06] text-white text-[14.5px] font-medium transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <AppleIcon />
                  <span>{appleLoading ? 'Connecting to Apple...' : 'Sign up with Apple'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-7 w-full flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-[#292e3c]" />
                <span className="text-[13px] text-[#868a97] font-normal">Or continue with</span>
                <div className="flex-1 h-[1px] bg-[#292e3c]" />
              </div>

              {/* Email form */}
              <form onSubmit={handleSignUpSubmit} className="w-full flex flex-col">
                <div className="w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full h-[58px] px-4 rounded-[6px] bg-transparent border border-[#303544] text-[15px] text-white placeholder-[#787c8c] focus:outline-none focus:border-[#3f5fff] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full h-[54px] rounded-full bg-[#3f5fff] hover:bg-[#3250e6] active:bg-[#2843cb] text-white text-[15px] font-medium transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#3f5fff] focus:ring-offset-2 focus:ring-offset-[#151822] disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Continue'}
                </button>
              </form>

              {/* Direct Workspace Preview / Instant Signup Test */}
              <div className="mt-4 w-full">
                <button
                  type="button"
                  onClick={() => {
                    const demoEmail = email || 'vaishnavxmass@gmail.com'
                    setDemoUser(demoEmail)
                  }}
                  className="w-full h-[56px] rounded-full bg-transparent border border-[#303544] hover:bg-white/[0.03] active:bg-white/[0.06] text-white text-[14.5px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer"
                >
                  Test Account Signup & Cloud Security Setup
                </button>
              </div>

              {/* Disclaimer text */}
              <p className="mt-6 text-[12px] text-[#868a97] leading-relaxed text-center max-w-[440px]">
                By signing up, you agree with our{' '}
                <a href="#terms" className="text-[#a4a8b5] underline hover:text-white transition-colors">
                  terms of service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-[#a4a8b5] underline hover:text-white transition-colors">
                  privacy policy
                </a>
                . You’ll be able to change notification settings for marketing emails in your Secure Locker Account.
              </p>
            </>
          ) : (
            /* Verification Code Form */
            <form onSubmit={handleSignUpCodeSubmit} className="mt-8 w-full flex flex-col">
              <p className="text-[14px] text-[#b4b4b4] text-center mb-4">
                Enter the verification code sent to <span className="text-white font-medium">{email}</span>
              </p>

              <div className="w-full">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code"
                  autoFocus
                  required
                  className="w-full h-[58px] px-4 rounded-[6px] bg-transparent border border-[#303544] text-[16px] text-white text-center tracking-widest placeholder-[#787c8c] focus:outline-none focus:border-[#3f5fff] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full h-[54px] rounded-full bg-[#3f5fff] hover:bg-[#3250e6] active:bg-[#2843cb] text-white text-[15px] font-medium transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-[#3f5fff] focus:ring-offset-2 focus:ring-offset-[#151822] disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="mt-4 text-[13.5px] text-[#9a9ba4] hover:text-white transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <AuthFooter />
    </div>
  )
}
