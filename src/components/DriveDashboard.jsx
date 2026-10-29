import React, { useState, useRef, useEffect } from 'react'
import {
  Search,
  Plus,
  Cloud,
  FileText,
  Download,
  Trash2,
  Eye,
  X,
  Upload,
  FolderPlus,
  KeyRound,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  Settings,
  User,
  Shield,
  Laptop
} from 'lucide-react'
import { jsPDF } from 'jspdf'
import SecureLockerLogo from './SecureLockerLogo'
import SettingsPage from './SettingsPage'
import LockScreen from './LockScreen'

export default function DriveDashboard({ userEmail, onSignOut }) {
  // Navigation states: 'my-files' | 'shared' | 'profile'
  const [activeNav, setActiveNav] = useState('my-files')
  const [profileTab, setProfileTab] = useState('settings') // 'account' | 'settings' | 'passwords-help'

  // Files in local storage
  const storageKey = `secure_locker_files_${(userEmail || 'default').toLowerCase().trim()}`
  const [files, setFiles] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [uploadToast, setUploadToast] = useState(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  // Recovery Key Modal states
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [downloadedPdf, setDownloadedPdf] = useState(false)

  // Auto-lock feature states (Options: 5, 10, 15, and 45 minutes)
  const [autoLockMinutes, setAutoLockMinutes] = useState(() => {
    try {
      const saved = localStorage.getItem('secure_locker_autolock_minutes')
      return saved ? Number(saved) : 5
    } catch {
      return 5
    }
  })
  const [isLocked, setIsLocked] = useState(false)
  const [lockReason, setLockReason] = useState('Session locked due to inactivity')

  // Activity Logs state (Uploads, Downloads, Logins, and Suspicious Blocked attempts)
  const logStorageKey = `secure_locker_activity_${(userEmail || 'default').toLowerCase().trim()}`
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(logStorageKey)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed loading activity logs', e)
    }
    return [
      {
        id: 'log-init-1',
        action: 'download',
        title: 'File Downloaded',
        fileName: 'Secure_Locker_Whitepaper_v4.2.pdf',
        details: 'Decrypted and downloaded by user',
        ip: '198.51.100.24',
        location: 'New York, US',
        device: 'MacBook Pro 16" (Chrome)',
        time: '15 minutes ago',
        status: 'Verified Zero-Knowledge',
        blocked: false,
      },
      {
        id: 'log-init-2',
        action: 'blocked',
        title: 'Unauthorized Login Attempt Blocked',
        fileName: null,
        details: 'Untrusted device blocked from reading encrypted cloud storage.',
        ip: '185.220.101.5',
        location: 'Moscow, Russia',
        device: 'Windows 11 Workstation (Firefox 129)',
        time: '1 hour ago',
        status: 'Blocked by Firewall',
        blocked: true,
      },
      {
        id: 'log-init-3',
        action: 'upload',
        title: 'File Uploaded & Encrypted',
        fileName: 'Q3_Financial_Audit_Report_2026.pdf',
        details: 'Encrypted client-side with Master Key',
        ip: '198.51.100.24',
        location: 'New York, US',
        device: 'MacBook Pro 16" (Chrome)',
        time: '2 hours ago',
        status: 'Verified Upload',
        blocked: false,
      },
      {
        id: 'log-init-4',
        action: 'login',
        title: 'Account Authentication',
        fileName: null,
        details: 'Successful zero-knowledge authentication session.',
        ip: '198.51.100.24',
        location: 'New York, US',
        device: 'MacBook Pro 16" (Chrome)',
        time: 'Today at 09:30 AM',
        status: 'Authorized Session',
        blocked: false,
      },
      {
        id: 'log-init-5',
        action: 'blocked',
        title: 'Anomalous Data Access Request Blocked',
        fileName: null,
        details: 'Automated script attempted unauthorized handshake.',
        ip: '194.26.29.112',
        location: 'Frankfurt, Germany',
        device: 'Linux Automated Node (curl/7.88)',
        time: 'Yesterday at 18:42',
        status: 'Threat Neutralized',
        blocked: true,
      },
    ]
  })

  // Devices state (Showing current device and blocked devices)
  const deviceStorageKey = `secure_locker_devices_${(userEmail || 'default').toLowerCase().trim()}`
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem(deviceStorageKey)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Failed loading devices', e)
    }
    return [
      {
        id: 'dev-1',
        name: 'Apple MacBook Pro 16"',
        type: 'laptop',
        os: 'macOS Sonoma',
        browser: 'Google Chrome 130',
        ip: '198.51.100.24',
        location: 'New York, USA',
        lastSeen: 'Active now',
        status: 'active',
        isCurrent: true,
      },
      {
        id: 'dev-2',
        name: 'Windows 11 Workstation',
        type: 'laptop',
        os: 'Windows 11 Pro',
        browser: 'Firefox 129',
        ip: '185.220.101.5',
        location: 'Moscow, Russia',
        lastSeen: '1 hour ago',
        status: 'blocked',
        blockReason: 'Blocked due to unverified geographic zone & anomalous access request.',
        isCurrent: false,
      },
      {
        id: 'dev-3',
        name: 'Linux Automated Node',
        type: 'laptop',
        os: 'Ubuntu 24.04 LTS',
        browser: 'curl/7.88',
        ip: '194.26.29.112',
        location: 'Frankfurt, Germany',
        lastSeen: 'Yesterday at 18:42',
        status: 'blocked',
        blockReason: 'Blocked by Zero-Knowledge Firewall: automated scraping attempt.',
        isCurrent: false,
      },
      {
        id: 'dev-4',
        name: 'iPhone 15 Pro',
        type: 'mobile',
        os: 'iOS 18.1',
        browser: 'Mobile Safari',
        ip: '172.56.21.89',
        location: 'New York, USA',
        lastSeen: '2 days ago',
        status: 'active',
        isCurrent: false,
      },
    ]
  })

  const fileInputRef = useRef(null)
  const folderInputRef = useRef(null)
  const dragCounter = useRef(0)

  // Sync files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(files))
    } catch (e) {
      console.warn('Could not save files to localStorage', e)
    }
  }, [files, storageKey])

  // Sync activity logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(logStorageKey, JSON.stringify(activityLogs))
    } catch (e) {
      console.warn('Could not save activity logs', e)
    }
  }, [activityLogs, logStorageKey])

  // Sync devices to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(deviceStorageKey, JSON.stringify(devices))
    } catch (e) {
      console.warn('Could not save devices', e)
    }
  }, [devices, deviceStorageKey])

  // Inactivity auto-lock timer (5, 10, 15, or 45 minutes)
  useEffect(() => {
    let timeoutId
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (!isLocked && autoLockMinutes > 0) {
        timeoutId = setTimeout(() => {
          setLockReason(`Workspace auto-locked after ${autoLockMinutes} minutes of inactivity`)
          setIsLocked(true)
        }, autoLockMinutes * 60 * 1000)
      }
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach((evt) => window.addEventListener(evt, resetTimer, { passive: true }))
    resetTimer()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      events.forEach((evt) => window.removeEventListener(evt, resetTimer))
    }
  }, [autoLockMinutes, isLocked])

  // Helper to log user activities
  const logActivity = (entry) => {
    setActivityLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        time: 'Just now',
        ip: '198.51.100.24',
        location: 'New York, US',
        device: navigator.userAgent.includes('Mac') ? 'MacBook Pro' : 'Workstation',
        status: 'Verified Zero-Knowledge',
        ...entry,
      },
      ...prev,
    ])
  }

  // Toggle blocking a device
  const handleToggleBlockDevice = (deviceId) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const nextStatus = d.status === 'blocked' ? 'active' : 'blocked'
          logActivity({
            action: nextStatus === 'blocked' ? 'blocked' : 'login',
            title: nextStatus === 'blocked' ? `Device Blocked: ${d.name}` : `Device Unblocked: ${d.name}`,
            fileName: null,
            details:
              nextStatus === 'blocked'
                ? `Device was blocked from accessing your files.`
                : `Device access authorization restored.`,
            ip: d.ip,
            location: d.location,
            device: d.name,
            blocked: nextStatus === 'blocked',
          })

          return {
            ...d,
            status: nextStatus,
            blockReason:
              nextStatus === 'blocked'
                ? 'Manually blocked by user via Device Security Settings.'
                : null,
          }
        }
        return d
      })
    )
  }

  // Calculate total stored size
  const totalSizeBytes = files.reduce((acc, f) => acc + (f.sizeBytes || 0), 0)
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1)
  const storageDisplay =
    files.length === 0 || totalSizeBytes === 0 ? '0 MB / 3.0 GB' : `${totalSizeMB} MB / 3.0 GB`

  // Recovery Key Helper
  const getRecoveryKey = () => {
    if (!userEmail) return '8492 1048 5920 3819'
    return (
      localStorage.getItem(`nord_recovery_key_${userEmail.toLowerCase().trim()}`) ||
      '8492 1048 5920 3819'
    )
  }

  // Copy Recovery Key to clipboard
  const handleCopyRecoveryKey = async () => {
    try {
      await navigator.clipboard.writeText(getRecoveryKey())
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } catch {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  // Download PDF Recovery Key from Dashboard
  const handleDownloadRecoveryPdf = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const recoveryKey = getRecoveryKey()
      const primaryBlue = [59, 102, 255]
      const textDark = [17, 24, 39]
      const textMuted = [107, 114, 128]
      const calloutBg = [242, 244, 252]

      // Header Bar
      doc.setFillColor(...primaryBlue)
      doc.rect(0, 0, 210, 10, 'F')

      // Branding
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(...textDark)
      doc.text('Secure Locker', 20, 26)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...textMuted)
      doc.text('Zero-Knowledge Encrypted File Storage', 20, 32)

      doc.setDrawColor(229, 231, 235)
      doc.line(20, 38, 190, 38)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(...textDark)
      doc.text('Cloud Recovery Key', 20, 50)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(...textMuted)
      doc.text(`Account Email: ${userEmail || 'user@securelocker.com'}`, 20, 58)
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 20, 64)

      // Key Box
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

      // Safe Place callout
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
        'If you lose your Cloud Password, you can restore access to your files using the Cloud Recovery Key. Due to zero-knowledge policy, we do not store it. Please save and store your Recovery Key securely.',
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

      // Why Necessary
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(...textDark)
      doc.text('Why is a Recovery Key necessary?', 20, 176)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(55, 65, 81)

      const whyP1 = doc.splitTextToSize(
        'Secure Locker provides encrypted file storage based on zero-knowledge architecture. This means that no one but you can access your encrypted data.',
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

      doc.setDrawColor(229, 231, 235)
      doc.line(20, 260, 190, 260)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...textMuted)
      doc.text(
        'Confidential • Secure Locker Zero-Knowledge Architecture • Keep this document private and offline',
        20,
        268
      )

      const safeFilename = `Cloud-Recovery-Key-${(userEmail || 'user').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      doc.save(safeFilename)
      setDownloadedPdf(true)
      setTimeout(() => setDownloadedPdf(false), 3000)
    } catch (err) {
      console.error('Error generating PDF:', err)
    }
  }

  // Handle Drag & Drop events
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      setIsDragging(false)
      dragCounter.current = 0
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  // Handle uploaded files
  const handleFiles = (uploadedList) => {
    const newItems = uploadedList.map((f, idx) => {
      const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      const sizeStr =
        f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(f.size / 1024)} KB`
      return {
        id: `f-${Date.now()}-${idx}`,
        name: f.name,
        type: isPdf ? 'PDF document' : f.type || 'Encrypted file',
        size: sizeStr,
        sizeBytes: f.size,
        modified: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        owner: 'me',
        url: URL.createObjectURL(f),
        previewContent: `File Name: ${f.name}\nSize: ${sizeStr}\nEncrypted: Zero-Knowledge AES-256-GCM\nDate: ${new Date().toLocaleString()}\n\nClient-side encrypted with your Master Cloud Key.`,
      }
    })

    // Log upload in activity history
    newItems.forEach((item) => {
      logActivity({
        action: 'upload',
        title: 'File Uploaded & Encrypted',
        fileName: item.name,
        details: `Uploaded and encrypted with AES-256 GCM (${item.size})`,
        blocked: false,
      })
    })

    setFiles((prev) => [...newItems, ...prev])
    if (newItems.length > 0) {
      setSelectedFile(newItems[0])
      setUploadToast({
        fileName: newItems[0].name,
        count: newItems.length,
      })
      setTimeout(() => setUploadToast(null), 3500)
    }
  }

  // Filter files by search
  const filteredFiles = files.filter((f) => {
    if (!searchQuery.trim()) return true
    return f.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Delete file
  const deleteFile = (id, e) => {
    if (e) e.stopPropagation()
    const target = files.find((f) => f.id === id)
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (selectedFile?.id === id) setSelectedFile(null)
    if (target) {
      logActivity({
        action: 'download',
        title: 'File Removed',
        fileName: target.name,
        details: `File deleted from encrypted cloud storage by user.`,
        blocked: false,
      })
    }
  }

  // Download file helper + activity logging
  const downloadFile = (file, e) => {
    if (e) e.stopPropagation()
    logActivity({
      action: 'download',
      title: 'File Downloaded',
      fileName: file.name,
      details: `File decrypted in browser and downloaded to local filesystem.`,
      blocked: false,
    })

    if (file.url) {
      const a = document.createElement('a')
      a.href = file.url
      a.download = file.name
      a.click()
    } else {
      const blob = new Blob([file.previewContent || 'Encrypted Locker Document'], {
        type: 'text/plain',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
    }
  }

  const userInitial = (userEmail || 'V').charAt(0).toUpperCase()

  return (
    <div
      className="min-h-screen w-full bg-[#14161f] text-[#c9cbd5] font-sans flex select-none antialiased overflow-hidden relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(Array.from(e.target.files))
          }
        }}
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        webkitdirectory="true"
        directory="true"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(Array.from(e.target.files))
          }
        }}
        className="hidden"
      />

      {/* 1. LEFTMOST NARROW ICON RAIL (Matching screenshot) */}
      <nav className="w-[66px] bg-[#161822] border-r border-[#202330] flex flex-col justify-between items-center py-4 shrink-0 z-30">
        <div className="flex flex-col items-center gap-5 w-full">
          {/* User Profile Avatar with Label */}
          <button
            type="button"
            onClick={() => {
              setActiveNav('profile')
              setProfileTab('settings')
            }}
            className="flex flex-col items-center group cursor-pointer w-full px-1"
            title="Profile & Settings"
          >
            <div
              className={`w-11 h-7 rounded-full flex items-center justify-center transition-all ${
                activeNav === 'profile'
                  ? 'bg-[#31354d] text-white shadow-inner'
                  : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#38bdf8] text-[#0f172a] font-bold flex items-center justify-center text-[11px]">
                {userInitial}
              </div>
            </div>
            <span
              className={`text-[10px] mt-1 transition-colors ${
                activeNav === 'profile' ? 'text-white font-medium' : 'text-[#8e94a5]'
              }`}
            >
              Profile
            </span>
          </button>

          {/* My Files Icon */}
          <button
            type="button"
            onClick={() => {
              setActiveNav('my-files')
            }}
            className="flex flex-col items-center group cursor-pointer w-full px-1"
            title="My files"
          >
            <div
              className={`w-11 h-7 rounded-full flex items-center justify-center transition-all ${
                activeNav === 'my-files'
                  ? 'bg-[#31354d] text-white shadow-inner'
                  : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Cloud className="w-4 h-4 fill-current" />
            </div>
            <span
              className={`text-[10px] mt-1 transition-colors ${
                activeNav === 'my-files' ? 'text-white font-medium' : 'text-[#8e94a5]'
              }`}
            >
              My files
            </span>
          </button>

          {/* Shared Icon */}
          <button
            type="button"
            onClick={() => {
              setActiveNav('shared')
            }}
            className="flex flex-col items-center group cursor-pointer w-full px-1"
            title="Shared files"
          >
            <div
              className={`w-11 h-7 rounded-full flex items-center justify-center transition-all ${
                activeNav === 'shared'
                  ? 'bg-[#31354d] text-white shadow-inner'
                  : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span
              className={`text-[10px] mt-1 transition-colors ${
                activeNav === 'shared' ? 'text-white font-medium' : 'text-[#8e94a5]'
              }`}
            >
              Shared
            </span>
          </button>
        </div>

        {/* Bottom Lock App Item (Matching screenshot) */}
        <button
          type="button"
          onClick={() => {
            setLockReason('Locked manually by user')
            setIsLocked(true)
          }}
          title="Lock app immediately"
          className="flex flex-col items-center group cursor-pointer text-[#8e94a5] hover:text-amber-400 transition-colors"
        >
          <div className="w-4 h-4 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
          <span className="text-[10px]">Lock app</span>
        </button>
      </nav>

      {/* 2. SECONDARY SIDEBAR */}
      <aside className="w-52 sm:w-56 bg-[#161822] border-r border-[#202330] flex flex-col justify-between py-6 px-4 shrink-0 z-20">
        <div>
          {/* Header Title: "Profile" or "My files" or "Shared" */}
          <h2 className="text-xl font-bold text-white tracking-tight mb-5">
            {activeNav === 'profile' ? 'Profile' : activeNav === 'my-files' ? 'My files' : 'Shared'}
          </h2>

          {activeNav === 'profile' ? (
            /* PROFILE SIDEBAR NAVIGATION (Matching screenshot) */
            <div className="space-y-1">
              {/* 1. Account */}
              <button
                type="button"
                onClick={() => setProfileTab('account')}
                className={`w-full h-10 px-3 rounded-lg flex items-center gap-3 text-xs font-medium cursor-pointer transition-colors text-left ${
                  profileTab === 'account'
                    ? 'bg-[#31354d] text-white shadow-sm'
                    : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">Account</span>
              </button>

              {/* 2. Settings (Selected / Highlighted in screenshot) */}
              <button
                type="button"
                onClick={() => setProfileTab('settings')}
                className={`w-full h-10 px-3 rounded-lg flex items-center gap-3 text-xs font-medium cursor-pointer transition-colors text-left ${
                  profileTab === 'settings'
                    ? 'bg-[#31354d] text-white shadow-sm'
                    : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="truncate">Settings</span>
              </button>

              {/* 3. Passwords & Help */}
              <button
                type="button"
                onClick={() => setProfileTab('passwords-help')}
                className={`w-full h-10 px-3 rounded-lg flex items-center gap-3 text-xs font-medium cursor-pointer transition-colors text-left ${
                  profileTab === 'passwords-help'
                    ? 'bg-[#31354d] text-white shadow-sm'
                    : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="10" r="1.5" />
                  <path d="M12 11.5V15" />
                </svg>
                <span className="truncate">Passwords & Help</span>
              </button>
            </div>
          ) : (
            /* FILES SIDEBAR NAVIGATION */
            <>
              {/* + Add Button */}
              <div className="relative mb-6">
                <button
                  type="button"
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="h-9 px-5 rounded-full bg-[#5c50eb] hover:bg-[#4f42e4] active:bg-[#4537dc] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer transition-all duration-150"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add</span>
                </button>

                {/* Add menu popover */}
                {showAddMenu && (
                  <div className="absolute top-11 left-0 w-48 bg-[#212430] border border-[#2d3244] rounded-xl shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(false)
                        fileInputRef.current?.click()
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-gray-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#8b7bf4]" />
                      <span>Upload file</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(false)
                        folderInputRef.current?.click()
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-gray-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2.5 cursor-pointer"
                    >
                      <FolderPlus className="w-3.5 h-3.5 text-[#8b7bf4]" />
                      <span>Upload folder</span>
                    </button>
                    <div className="h-[1px] bg-white/[0.06] my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddMenu(false)
                        setShowSecurityModal(true)
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-gray-200 hover:text-white hover:bg-white/[0.06] flex items-center gap-2.5 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#8b7bf4]" />
                      <span>Cloud Recovery Key</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Folder Hierarchy */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('my-files')
                    setSelectedFile(null)
                  }}
                  className={`w-full h-10 px-3 rounded-lg flex items-center gap-2.5 text-xs font-medium cursor-pointer transition-colors text-left shadow-sm ${
                    activeNav === 'my-files'
                      ? 'bg-[#31354d] text-white'
                      : 'text-[#8e94a5] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Cloud className="w-4 h-4 fill-current shrink-0" />
                  <span className="truncate">My files</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Zero-knowledge lock status badge */}
        <div className="pt-4 border-t border-[#202330] flex items-center gap-2 text-[11px] text-[#7d8396]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
          <span className="truncate">End-to-End Encrypted</span>
        </div>
      </aside>

      {/* 3. MAIN WORKSPACE / CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#14161f] overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 px-5 bg-[#14161f] flex items-center justify-between gap-4 shrink-0">
          {activeNav === 'profile' ? (
            <div className="flex-1" />
          ) : (
            <div className="flex-1 max-w-3xl relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7488]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items"
                className="w-full h-9 pl-9 pr-8 rounded-md bg-[#1d1f2a] border border-[#272b3a] text-xs text-white placeholder-[#6e7488] focus:bg-[#202331] focus:border-[#5c50eb] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6e7488] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Right Brand Mark / Header Action (Matching screenshot) */}
          <div className="flex items-center gap-3">
            {activeNav !== 'profile' && (
              <button
                type="button"
                onClick={() => {
                  setActiveNav('profile')
                  setProfileTab('settings')
                }}
                title="Profile & Settings"
                className="p-1.5 rounded-lg text-[#8e94a5] hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Mountain / Vault Logo Mark matching top-right of screenshot */}
            <div className="w-8 h-8 rounded-full bg-[#1e222e] flex items-center justify-center text-white/90 border border-white/[0.06]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 21h20L12 3zm0 4.5l6.5 11.5h-13L12 7.5z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Dynamic Center Main Area */}
        <div className="flex-1 flex overflow-hidden p-3 pt-0 gap-3">
          {activeNav === 'profile' ? (
            /* PROFILE VIEWS */
            profileTab === 'settings' ? (
              /* EXACT SETTINGS PAGE FROM SCREENSHOT */
              <SettingsPage
                userEmail={userEmail}
                autoLockMinutes={autoLockMinutes}
                onChangeAutoLockMinutes={(mins) => {
                  setAutoLockMinutes(mins)
                  try {
                    localStorage.setItem('secure_locker_autolock_minutes', String(mins))
                  } catch (e) {
                    console.warn(e)
                  }
                }}
                activityLogs={activityLogs}
                devices={devices}
                onToggleBlockDevice={handleToggleBlockDevice}
              />
            ) : profileTab === 'account' ? (
              /* ACCOUNT TAB */
              <div className="flex-1 bg-[#181a23] rounded-2xl border border-[#202330] p-6 sm:p-8 flex flex-col overflow-y-auto max-w-5xl text-[#c9cbd5]">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6">Account</h2>
                
                <div className="bg-[#202330] rounded-xl p-5 border border-white/[0.02] flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#38bdf8] text-[#0f172a] font-bold flex items-center justify-center text-lg">
                      {userInitial}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{userEmail || 'user@securelocker.com'}</h3>
                      <p className="text-xs text-[#22c55e] flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Zero-Knowledge Master Vault Active
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="px-4 py-1.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium cursor-pointer transition-colors"
                  >
                    Log out
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#202330] rounded-xl p-5 border border-white/[0.02]">
                    <div className="text-xs text-[#8e94a5] mb-1">Encrypted Storage Usage</div>
                    <div className="text-lg font-bold text-white">{storageDisplay}</div>
                    <div className="w-full bg-[#161822] h-2 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#5c50eb] h-full rounded-full" style={{ width: `${Math.min(100, Math.max(3, (totalSizeBytes / (3 * 1024 * 1024 * 1024)) * 100))}%` }} />
                    </div>
                  </div>

                  <div className="bg-[#202330] rounded-xl p-5 border border-white/[0.02]">
                    <div className="text-xs text-[#8e94a5] mb-1">Authorized Devices</div>
                    <div className="text-lg font-bold text-white">{devices.filter(d => d.status === 'active').length} Connected</div>
                    <div className="text-xs text-rose-400 mt-2 font-medium">
                      {devices.filter(d => d.status === 'blocked').length} Untrusted Devices Blocked
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* PASSWORDS & HELP TAB */
              <div className="flex-1 bg-[#181a23] rounded-2xl border border-[#202330] p-6 sm:p-8 flex flex-col overflow-y-auto max-w-5xl text-[#c9cbd5]">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6">Passwords & Help</h2>

                <div className="bg-[#202330] rounded-xl p-6 border border-white/[0.02] mb-6">
                  <h3 className="text-base font-bold text-white mb-2">Cloud Recovery Key</h3>
                  <p className="text-xs text-[#8e94a5] mb-4 leading-relaxed">
                    Your 16-digit Cloud Recovery Key is the only way to restore your encrypted locker if you ever forget your master password.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSecurityModal(true)}
                      className="px-4 py-2 rounded-xl bg-[#5c50eb] hover:bg-[#4f42e4] text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      View & Download Recovery Key
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadRecoveryPdf}
                      className="px-4 py-2 rounded-xl bg-[#272b3c] hover:bg-[#2e3347] text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Export PDF Document
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* FILES DRIVE WORKSPACE (MY FILES / SHARED) */
            <>
              {/* CENTER FILES CARD */}
              <main
                className="flex-1 bg-[#181a23] rounded-2xl border border-[#202330] flex flex-col overflow-hidden relative"
                onClick={() => setSelectedFile(null)}
              >
                {/* Main Card Top Bar */}
                <div className="h-13 px-6 flex items-center justify-between border-b border-[#212432]">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {activeNav === 'my-files' ? 'My files' : 'Shared'}
                  </h3>

                  <div className="flex items-center gap-1 text-[#83889b]">
                    <button
                      type="button"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      title="Toggle layout"
                      className="p-1.5 rounded hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="1" y="1" width="5.5" height="5.5" rx="1" />
                        <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" />
                        <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" />
                        <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Drag and Drop Overlay */}
                {isDragging && (
                  <div className="absolute inset-0 bg-[#5c50eb]/20 border-2 border-dashed border-[#5c50eb] z-40 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm pointer-events-none">
                    <Upload className="w-14 h-14 text-[#a89cf5] animate-bounce mb-3" />
                    <p className="text-lg font-semibold text-white">Drop files to encrypt & store</p>
                    <p className="text-xs text-white/70">Client-side zero-knowledge encryption</p>
                  </div>
                )}

                {/* Files Grid / Empty State */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col">
                  {filteredFiles.length === 0 ? (
                    <div className="my-auto flex flex-col items-center justify-center text-center py-10 px-4">
                      <div className="relative w-44 h-44 flex items-center justify-center mb-6">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 176 176">
                          <circle
                            cx="88"
                            cy="88"
                            r="76"
                            fill="none"
                            stroke="#796fe0"
                            strokeWidth="3.5"
                            strokeDasharray="18 16"
                            strokeLinecap="round"
                          />
                        </svg>

                        <div className="relative">
                          <svg width="86" height="66" viewBox="0 0 86 66" fill="none">
                            <path
                              d="M4 14C4 9.58172 7.58172 6 12 6H32L40 14H74C78.4183 14 82 17.5817 82 22V54C82 58.4183 78.4183 62 74 62H12C7.58172 62 4 58.4183 4 54V14Z"
                              fill="#a395f8"
                            />
                            <rect x="4" y="16" width="78" height="46" rx="8" fill="#beb4fd" />
                          </svg>

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-2.5 w-9 h-9 rounded-full bg-[#6256ea] text-white flex items-center justify-center shadow-lg border-2 border-[#181a23] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            title="Add file"
                          >
                            <Plus className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xl font-bold text-white tracking-tight">Empty folder</h4>
                      <p className="text-xs sm:text-[13.5px] text-[#7d8396] mt-2 max-w-md leading-relaxed">
                        Drag and drop your files in this area, or press “+ Add” button
                      </p>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredFiles.map((file) => {
                        const isSelected = selectedFile?.id === file.id
                        return (
                          <div
                            key={file.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(file)
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              setPreviewFile(file)
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group shadow-sm ${
                              isSelected
                                ? 'bg-[#292d3e] border-[#6256ea]'
                                : 'bg-[#1f222e] hover:bg-[#242837] border-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2.5 truncate">
                                <div className="w-8 h-8 rounded-lg bg-[#a395f8]/20 text-[#a395f8] flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold text-white truncate" title={file.name}>
                                  {file.name}
                                </span>
                              </div>
                            </div>

                            <div className="h-20 w-full rounded-lg bg-[#151720] p-2.5 text-[10.5px] font-mono text-[#8a8ea2] overflow-hidden border border-white/[0.04] mb-3 relative group/preview">
                              <div className="truncate text-white/70 font-sans font-medium mb-1">
                                {file.type || 'Encrypted File'}
                              </div>
                              <div className="line-clamp-2 text-[10px] leading-relaxed">
                                {file.previewContent || 'End-to-end encrypted zero-knowledge file.'}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-[#7d8396]">
                              <span>{file.size}</span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={(e) => downloadFile(file, e)}
                                  className="p-1 hover:text-white"
                                  title="Download"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => deleteFile(file.id, e)}
                                  className="p-1 hover:text-red-400"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-medium text-[#7d8396] border-b border-white/[0.04]">
                        <span className="col-span-6">Name</span>
                        <span className="col-span-3">Type</span>
                        <span className="col-span-2">Size</span>
                        <span className="col-span-1 text-right">Actions</span>
                      </div>
                      {filteredFiles.map((file) => {
                        const isSelected = selectedFile?.id === file.id
                        return (
                          <div
                            key={file.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(file)
                            }}
                            className={`grid grid-cols-12 items-center px-4 py-2.5 text-xs border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors cursor-pointer ${
                              isSelected ? 'bg-[#282c3c]' : ''
                            }`}
                          >
                            <div className="col-span-6 flex items-center gap-2.5 truncate pr-3">
                              <FileText className="w-4 h-4 text-[#a395f8] shrink-0" />
                              <span className="font-medium text-white truncate">{file.name}</span>
                            </div>
                            <div className="col-span-3 text-[11px] text-[#7d8396] truncate">
                              {file.type || 'Document'}
                            </div>
                            <div className="col-span-2 text-[11px] text-[#7d8396]">{file.size}</div>
                            <div className="col-span-1 flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => downloadFile(file, e)}
                                className="p-1 rounded text-[#7d8396] hover:text-white"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => deleteFile(file.id, e)}
                                className="p-1 rounded text-[#7d8396] hover:text-red-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </main>

              {/* RIGHT INFO DRAWER */}
              <aside className="w-64 sm:w-72 bg-[#181a23] rounded-2xl border border-[#202330] p-6 flex flex-col shrink-0 overflow-y-auto relative">
                {selectedFile ? (
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#a395f8]/10 text-[#a395f8] flex items-center justify-center mx-auto border border-[#a395f8]/20">
                      <FileText className="w-8 h-8" />
                    </div>

                    <div className="text-center">
                      <h4 className="text-sm font-bold text-white truncate px-2" title={selectedFile.name}>
                        {selectedFile.name}
                      </h4>
                      <p className="text-[11px] text-[#7d8396] mt-0.5">{selectedFile.type || 'Encrypted File'}</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#232635] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#7d8396]">Size</span>
                        <span className="text-white font-medium">{selectedFile.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#7d8396]">Modified</span>
                        <span className="text-white font-medium">{selectedFile.modified}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#7d8396]">Security</span>
                        <span className="text-[#22c55e] font-medium flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> AES-256 GCM
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-[#232635]">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(selectedFile)}
                        className="w-full h-9 rounded-full bg-[#242735] hover:bg-[#2d3144] text-xs text-white font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadFile(selectedFile)}
                        className="w-full h-9 rounded-full bg-[#6256ea] hover:bg-[#5347e0] text-xs text-white font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download file</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFile(selectedFile.id)}
                        className="w-full h-9 rounded-full bg-transparent hover:bg-red-500/10 text-xs text-red-400 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start w-full">
                    <div className="w-full flex items-center justify-center py-6">
                      <svg width="94" height="64" viewBox="0 0 94 64" fill="none" className="drop-shadow-sm">
                        <path
                          d="M70 58H22C11.5 58 3 49.5 3 39C3 29.5 9.8 21.6 19 20C21.5 9.2 31 1 42.5 1C55.2 1 65.8 10.6 67 23.2C68 23 69 23 70 23C79.9 23 88 31.1 88 41C88 50.4 80 58 70 58Z"
                          fill="#b6a9fc"
                        />
                      </svg>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-4 mb-4">My files</h4>

                    <div className="w-full space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#7d8396]">Type</span>
                        <span className="text-white font-medium">Cloud storage</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#7d8396]">Size</span>
                        <span className="text-white font-medium">{storageDisplay}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[#7d8396]">Auto-Lock</span>
                        <button
                          onClick={() => {
                            setActiveNav('profile')
                            setProfileTab('settings')
                          }}
                          className="text-[#8e8aff] hover:underline cursor-pointer"
                        >
                          {autoLockMinutes} min
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-[#232635] w-full text-center">
                      <p className="text-[11px] text-[#7d8396] leading-relaxed">
                        Zero-Knowledge Cloud Encryption active on all files.
                      </p>
                    </div>
                  </div>
                )}
              </aside>
            </>
          )}
        </div>
      </div>

      {/* CLOUD RECOVERY KEY MODAL */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 p-7 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Cloud Recovery Key
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{userEmail || 'user@securelocker.com'}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative border border-gray-400 rounded-lg p-3.5 pt-4 bg-white transition-all focus-within:border-[#3861fb]">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-normal text-gray-500">
                Cloud Recovery Key
              </label>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-lg font-medium tracking-wider text-gray-900 select-all">
                  {getRecoveryKey()}
                </span>
                <button
                  onClick={handleCopyRecoveryKey}
                  type="button"
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  title="Copy Recovery Key"
                >
                  {copiedKey ? (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-[#f2f4fc] rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-left border border-blue-100/60 mt-5">
              <div className="w-6 h-6 rounded-full bg-[#3b66ff] text-white flex items-center justify-center shrink-0 font-serif font-bold text-xs mt-0.5">
                i
              </div>
              <div className="space-y-2 text-[13.5px] leading-relaxed text-gray-800">
                <h4 className="font-bold text-gray-900 text-sm">Store this Recovery Key in a safe place</h4>
                <p>
                  If you lose your Cloud Password, you can restore access to your files using this Cloud Recovery Key.
                  Due to zero-knowledge policy, we don’t store it.
                </p>
                <p className="font-medium text-gray-900">Stay safe!</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadRecoveryPdf}
                className={`w-full sm:flex-1 h-11 rounded-full font-medium text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  downloadedPdf
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {downloadedPdf ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Key Downloaded (.PDF)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Download Key (.PDF)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSecurityModal(false)}
                className="w-full sm:flex-1 h-11 rounded-full font-medium text-xs bg-[#3861fb] hover:bg-[#2b52eb] text-white transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl h-[78vh] bg-[#1a1c26] rounded-2xl border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden">
            <div className="h-12 px-5 flex items-center justify-between border-b border-white/[0.06] bg-[#1f2230]">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-[#a395f8] shrink-0" />
                <span className="font-semibold text-white text-xs truncate">{previewFile.name}</span>
                <span className="text-[11px] text-[#7d8396]">({previewFile.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadFile(previewFile)}
                  className="px-3 py-1 rounded-full bg-[#6256ea] hover:bg-[#5347e0] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="p-1 rounded text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-[#12141c] flex items-center justify-center">
              {previewFile.url && (previewFile.name.endsWith('.pdf') || previewFile.type?.includes('pdf')) ? (
                <iframe
                  src={previewFile.url}
                  title={previewFile.name}
                  className="w-full h-full rounded border border-white/[0.04]"
                />
              ) : (
                <div className="w-full max-w-lg bg-[#1a1c26] p-6 rounded-xl border border-white/[0.05] text-xs font-mono text-[#a5a9bd] whitespace-pre-wrap leading-relaxed shadow-inner">
                  {previewFile.previewContent || 'Encrypted zero-knowledge content.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD TOAST */}
      {uploadToast && (
        <div className="fixed bottom-6 right-6 z-40 bg-[#212430] text-white rounded-xl shadow-2xl border border-white/[0.08] p-3.5 flex items-center gap-3 w-76 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
          <div className="flex-1 truncate">
            <div className="text-xs font-semibold text-white">Encrypted & Stored</div>
            <div className="text-[11px] text-[#8e94a5] truncate">{uploadToast.fileName}</div>
          </div>
          <button
            type="button"
            onClick={() => setUploadToast(null)}
            className="text-white/40 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* LOCK SCREEN OVERLAY */}
      {isLocked && (
        <LockScreen
          userEmail={userEmail}
          lockReason={lockReason}
          autoLockMinutes={autoLockMinutes}
          onUnlock={() => setIsLocked(false)}
          onSignOut={onSignOut}
        />
      )}
    </div>
  )
}
