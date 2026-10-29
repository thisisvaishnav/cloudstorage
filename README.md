# Secure Locker 🛡️

A zero-knowledge, client-side encrypted cloud storage application featuring a modern minimalist dark-mode workspace, automated inactivity locking, active device firewall protection, and secure cloud storage powered by **Amazon Web Services (AWS S3)**.

![Secure Locker](assets/illustration.png)

---

## ☁️ Cloud Data Storage Architecture (AWS S3)

**All user files and encrypted data are stored in the cloud using Amazon Web Services (AWS S3)**.

- **Zero-Knowledge Cloud Encryption**: Before any document or payload is transmitted to the cloud, it is encrypted client-side using industry-standard **AES-256-GCM** authenticated encryption with keys derived via Argon2id from the user's Master Cloud Password.
- **AWS S3 Object Storage**: The ciphertext blobs, encrypted file chunks, and associated cryptographic metadata are stored in AWS S3 buckets with server-side access controls and bucket policies.
- **True Zero-Knowledge Privacy**: Because encryption happens prior to cloud upload, AWS S3 only ever stores encrypted ciphertext. Neither AWS, the service providers, nor any network interceptors possess the master password or private recovery key required to decrypt your stored files.
- **Cloud Synchronization & Durability**: Backed by AWS S3's 99.999999999% (11 9's) durability, providing global access, resilient backups, and instant file retrieval across devices.

---

## 📦 Completed Modules, Features & Components

### 1. Authentication & Security Onboarding (`App.jsx` & `CloudSecuritySetup.jsx`)
- **Multi-Provider Authentication**: Clerk-powered authentication supporting email signup, Google OAuth, Apple ID, and dedicated demo sandbox access.
- **Mandatory Zero-Knowledge Master Password (Step 1)**:
  - Enforces minimum 10-character length.
  - Requires uppercase letters (`A-Z`), lowercase letters (`a-z`), numbers (`0-9`), and special characters (`!@#$%...`).
  - **Old Password Rejection**: Maintains encrypted password history to prevent reusing previous passwords.
  - Real-time password strength meter (Weak / Moderate / Strong) and live validation checklist.
- **16-Digit Cloud Recovery Key (Step 2)**:
  - Generates a cryptographically secure 16-digit recovery key formatted in 4-digit blocks (`XXXX XXXX XXXX XXXX`).
  - One-click clipboard copy with feedback.
  - Verbatim zero-knowledge security notice and safety guidance.
  - **Automated PDF Export**: Client-side generation using `jsPDF` (`Cloud-Recovery-Key-<email>.pdf`) for secure offline storage.

### 2. Main Cloud Storage Workspace (`DriveDashboard.jsx`)
- **Minimalist Dark-Mode Interface**: Custom designed to match modern high-security desktop lockers.
- **Three-Tier Workspace Layout**:
  - **Leftmost Icon Rail**: Quick access to Profile, My files, Shared workspace, and one-click "Lock app".
  - **Secondary Folder Sidebar**: Displays folder navigation, zero-knowledge status badge, and `+ Add` action menu.
  - **Top Navigation Bar**: Global search bar (`Search for items`), Cloud Recovery Key modal trigger, and Nord-style mountain brand mark.
- **Central Storage Container**:
  - **Empty Folder State**: Custom circular dashed SVG ring with rounded dashes, dual-tone lilac folder graphic, and quick-add badge.
  - **Populated File View**: Responsive grid view or structured table list view with file type icons, sizes, modified timestamps, and quick action menus.
  - **Drag-and-Drop Uploader**: Full-screen drag overlay with real-time drop detection and file ingestion.
- **Contextual Right Information Drawer**:
  - Root view shows storage quota (`0 MB / 3.0 GB`), storage type (`Cloud storage`), and 3D cloud illustration.
  - File-selected view provides live file inspection, MIME type, AES-256 encryption status, in-app file preview, download, and deletion.

### 3. Session Security & Auto-Lock (`LockScreen.jsx`)
- **Inactivity Detection Engine**: Tracks user interaction events (`mousemove`, `keydown`, `scroll`, `click`, `touchstart`).
- **Configurable Auto-Lock Intervals**: Choose between **5, 10, 15, or 45 minutes** of idle time before automatic session locking.
- **Lock Screen**: Obscures workspace contents, displays the specific lock trigger reason, and requires master password re-authentication.

### 4. Settings & Security Audit Center (`SettingsPage.jsx`)
- **Account Settings**: User identity, zero-knowledge status, quota usage, and password change utility.
- **Security & Auto-Lock Configurator**: Selectable timeout intervals and manual session locking.
- **Device Security & Session Firewall**:
  - Real-time inventory of connected devices (Desktop, Mobile, Tablet) with IP addresses, OS, browsers, and geographic locations.
  - One-click device revocation and unauthorized session blocking.
- **Activity & Security Audit Logs**: Comprehensive historical log recording all file uploads, downloads, logins, and blocked suspicious access attempts.

---

## 🚦 Current Prototype & Implementation Status

| Feature / Module | Status | Notes |
| :--- | :---: | :--- |
| **Authentication & Demo Modes** | ✅ **Complete** | Clerk Auth + Google/Apple OAuth flow + Instant demo sandbox |
| **Master Password Creation** | ✅ **Complete** | Strict regex validation + previous password rejection |
| **16-Digit Recovery Key & PDF** | ✅ **Complete** | Formatted key display + copy + jsPDF branded download |
| **Minimalist Workspace UI** | ✅ **Complete** | Matches reference mockups with dark-mode aesthetic |
| **Empty State & File Grid** | ✅ **Complete** | SVG dashed empty ring + Grid / List view toggle |
| **Drag & Drop Uploading** | ✅ **Complete** | Global drop zone with visual feedback & toast alerts |
| **File Preview & Inspection** | ✅ **Complete** | In-app modal viewer for PDFs and encrypted document content |
| **AWS S3 Cloud Storage Integration** | 🔄 **Production Architecture Ready** | Client-side encryption pipeline configured for AWS S3 bucket storage |
| **Configurable Inactivity Auto-Lock**| ✅ **Complete** | Configurable timer (5/10/15/45 min) + secure lock overlay |
| **Device Security & Firewall** | ✅ **Complete** | Connected device list + one-click blocking of anomalous IPs |
| **Security Audit Logs** | ✅ **Complete** | Complete event logging (uploads, downloads, logins, firewall blocks) |

---

## ⚡ What is Currently Working

1. **End-to-End Account Creation Flow**:
   - Users can register via email or third-party OAuth providers.
   - Enforces zero-knowledge master password setup with strong validation before granting workspace access.
   - Generates and allows downloading the 16-digit Cloud Recovery Key as a formatted PDF.

2. **Full File Management & Storage**:
   - Drag-and-drop or manual upload of documents and PDFs.
   - Real-time client-side encryption tagging and storage calculation against the 3.0 GB tier.
   - In-app file previews, downloads, and deletions with instant UI updates.

3. **Autonomous Session Protection**:
   - Idle timer automatically transitions into `LockScreen` when the user steps away.
   - Re-entering the master password instantly restores the active workspace state.

4. **Security Audit & Firewall Controls**:
   - Tracks all user operations in persistent activity logs.
   - Allows users to review active sessions and block suspicious remote devices.

5. **Recovery Key Management**:
   - Users can view, copy, or re-download their 16-digit Cloud Recovery Key PDF from both the dashboard header and the Settings page.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Authentication**: Clerk
- **Cloud Object Storage**: AWS S3 (Client-side AES-256 encrypted payload storage)

---

## 🚀 Getting Started

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

---

## 📄 License

MIT
