# Secure Locker 🛡️

A zero-knowledge, client-side encrypted cloud storage web application featuring a Google Drive-inspired workspace, inactivity auto-locking, activity audit logging, and unauthorized device firewall protection.

![Secure Locker](assets/illustration.png)

## ✨ Key Features

- **Zero-Knowledge Architecture**: All files and master keys are encrypted client-side with AES-256-GCM before storage.
- **Drive-Style Dashboard**: Clean drag-and-drop workspace for uploading, previewing, and managing encrypted PDFs and documents.
- **Configurable Auto-Lock**: Automatically locks the active session after **5, 10, 15, or 45 minutes** of inactivity, with immediate lock-screen recovery.
- **Activity Log & Security Audit**: Real-time audit trail of all file uploads, downloads, account logins, and unauthorized access attempts.
- **Device Security & Firewall**: Live detection of connected sessions and one-click blocking of anomalous or suspicious geographic devices.
- **Cloud Recovery Key**: 16-digit master recovery key generation and one-click PDF export to safely restore accounts without server-side key storage.
- **Dark Mode UI**: Sleek, pixel-perfect desktop interface matching modern cloud security standards.

## 🚀 Tech Stack

- **React 19**
- **Vite 8**
- **Tailwind CSS 4**
- **Lucide Icons**
- **jsPDF** (Recovery Key generation)
- **Clerk Authentication**

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/thisisvaishnav/cloudstorage.git
cd cloudstorage
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## 📄 License

MIT
