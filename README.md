# Secure Locker 🛡️

A zero-knowledge, client-side encrypted cloud storage application featuring a modern minimalist dark-mode workspace, automated inactivity locking, active device firewall protection, dual-server redundancy, and secure cloud storage powered by **Amazon Web Services (AWS)**.

![Secure Locker](assets/illustration.png)

---

## 🌐 Cloud Infrastructure & Delivery Architecture (AWS Services)

Secure Locker leverages AWS cloud infrastructure to provide enterprise-grade durability, high availability, and authenticated encrypted file delivery.

```
                  ┌────────────────────────────────────────┐
                  │           Client Browser / App         │
                  │  (Client-Side Standard AES-256 GCM)    │
                  └──────────────────┬─────────────────────┘
                                     │
                             DNS Routing Layer
                      (Geo-Latency & Health Failover)
                                     │
                  ┌──────────────────┴─────────────────────┐
                  │                                        │
           ▼                                               ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│     Cloud Server Node 1      │ ◄──────────► │     Cloud Server Node 2      │
│      (Primary Replica)       │  Replication │     (Secondary Replica)      │
│  AWS Encrypted Object Store  │   & Sync     │  AWS Encrypted Object Store  │
└──────────────────────────────┘              └──────────────────────────────┘
```

### 1. Encrypted Storage via AWS Services
- **Encrypted Storage Pipeline**: All stored files and artifacts are persisted in the cloud using AWS services (Amazon S3 object storage paired with secure cloud infrastructure).
- **Standard Encryption & Decryption**:
  - **Data at Rest (AES-256)**: All stored files are encrypted using industry-standard **AES-256** (Advanced Encryption Standard, 256-bit key length in Galois/Counter Mode - GCM). Data is encrypted prior to persistence and decrypted only upon authorized request by the authenticated user.
  - **Data in Transit (TLS 1.3)**: Strict end-to-end transport layer security using TLS 1.3 / HTTPS protects every request between client applications, DNS routing layers, and AWS endpoints against eavesdropping and tampering.
  - **Zero-Knowledge Decryption**: Decryption keys reside exclusively with the authenticated user. The underlying AWS storage nodes hold only encrypted ciphertext with zero visibility into plaintext content.

### 2. Dual-Server Redundancy (Two Server Copies)
- **Two Independent Server Copies**: Every uploaded file is replicated and stored across **two distinct cloud servers / storage nodes**.
- **High Availability & Fault Tolerance**: In the event of scheduled node maintenance, hardware failure, or network disruption on one server, the secondary server provides seamless access with zero downtime or data loss.
- **Data Integrity & Checksum Sync**: Real-time cryptographic checksums (SHA-256) verify that both copies maintain byte-level parity without silent data corruption.

### 3. DNS-Based Intelligent Delivery
- **DNS-Directed User Delivery**: Delivery traffic is directed to users using latency-optimized, health-checked **DNS routing** (such as Amazon Route 53).
- **Low-Latency Edge Routing**: DNS dynamically resolves user connection requests to the geographically nearest and most responsive server instance, minimizing upload and download latency.
- **Automatic Health-Check Failover**: Continuous background health checks monitor server status. If a server becomes unresponsive, DNS instantly shifts incoming delivery traffic to the healthy secondary server copy.

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
| **AWS Encrypted Storage Pipeline** | 🔄 **Production Architecture Ready** | Client-side standard AES-256 GCM encryption pipeline with AWS object store |
| **Dual-Server Redundant Copies** | 🔄 **Production Architecture Ready** | Two-node server replication architecture for high availability |
| **DNS-Based Delivery & Failover** | 🔄 **Production Architecture Ready** | Geo-latency routing and automatic failover via DNS |
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

## 🛠️ Tech Stack & Architecture

- **Frontend Application**: React 19, Vite 8, Tailwind CSS 4
- **Security & Cryptography**: Standard AES-256 (GCM), Argon2id key derivation, TLS 1.3
- **Icons & Visuals**: Lucide React
- **Document & PDF Generation**: jsPDF
- **Authentication**: Clerk Authentication
- **Cloud Infrastructure**: AWS Services (Encrypted storage nodes, dual-server replication, DNS routing)

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
