# Resumely Browser Extension 🚀

**AI Job Matcher, 1-Click Job Tracker Clipper & Intelligent Form Autofill Assistant**

The Resumely Browser Extension bridges your web browsing experience with your Resumely account. When viewing job openings on LinkedIn, Indeed, Greenhouse, Lever, or any company career page, the extension automatically extracts job requirements, calculates a real-time ATS match score against your active resume, highlights keyword gaps, saves the role to your Resumely Job Tracker, and autofills application forms in one click.

---

## ✨ Key Features

1. **🎯 1-Click Job Clipper & Saver:**
   - Automatically detects job title, company name, location, salary, and description from:
     - **LinkedIn** (`linkedin.com/jobs/...`)
     - **Indeed** (`indeed.com/...`)
     - **Greenhouse** (`boards.greenhouse.io/...`)
     - **Lever** (`jobs.lever.co/...`)
     - **Wellfound / AngelList** (`wellfound.com/...`)
     - **Generic Career Sites** via Schema.org JSON-LD `JobPosting` and smart DOM inspection.
   - Choose application stage: `Saved / Wishlist`, `Applied`, or `Interviewing`.
   - Links directly to your Resumely Job Tracker (`/tracker`).

2. **⚡ Real-Time ATS Match Score & Skill Gap Analysis:**
   - Evaluates the job description against your master or tailored resume.
   - Computes an overall match score (0–100%).
   - Displays **Matched Skills** (green badges) and **Missing Keywords** (amber badges).
   - Provides instant tailoring recommendations to boost your match rate.

3. **📝 Smart Application Form Autofill:**
   - Detects input fields across application forms (Greenhouse, Lever, Workday, custom portals).
   - Autofills:
     - First Name, Last Name, Full Name
     - Email Address, Phone Number
     - Location (City, State, Country)
     - LinkedIn, GitHub, Portfolio URLs
     - Current Employer & Job Title
     - Cover Letter / Note to hiring manager
   - Dispatches synthetic framework events so React/Angular/Vue forms recognize the data.
   - Highlights filled inputs with an emerald glow.

4. **📋 Quick-Copy Resume Cheat Sheet:**
   - 1-click copy buttons for your contact details, profile links, summary, and work experience bullet points.
   - Instant toast notification upon copying.

5. **✍️ AI Elevator Pitch Generator:**
   - Generates a custom 3-paragraph pitch / cover letter snippet tailored specifically to the active job posting.

6. **🌐 Real-Time Authentication Bridge & Client-Side Data Storage:**
   - Automatically detects your active NextAuth session whenever you open Resumely (`localhost:3000` or `resumely.tech`).
   - Supports 1-click email connection (e.g. entering your account email) to pull your real master resume, all tailored resume versions, and AI credits from Convex.
   - Saves all data on the user side in `chrome.storage.local` with an in-extension **Tracked Applications** viewer!
   - Sleek UI aligned to the Resumely website (minimalist dark zinc theme, `re.` branding, credits pill, and Kanban stage colors).

---

## 🛠️ Installation & Setup (Manual Testing)

### 1. Load Unpacked in Chrome, Edge, or Brave

1. Open your browser and navigate to the extensions page:
   - **Chrome:** `chrome://extensions`
   - **Edge:** `edge://extensions`
   - **Brave:** `brave://extensions`
2. Turn on **Developer mode** (toggle in the top-right corner).
3. Click the **Load unpacked** button (top-left).
4. In the file picker, select this directory:
   ```text
   E:\Projects\resumely\extension
   ```
5. The **Resumely - AI Job Matcher & Application Assistant** extension will appear in your extension list!
6. Click the Extensions puzzle piece icon in your browser toolbar and **pin** Resumely for easy access.

---

## 🧪 How to Test Manually (Step-by-Step)

We have included dedicated test pages right inside the `extension/test/` folder so you can test every single feature immediately without having to browse external job boards!

### Option A: Interactive Test Dashboard
Double click or open in your browser:
```text
file:///E:/Projects/resumely/extension/test/test-guide.html
```
- Click **"Run Unit Verification"** to test storage, the ATS matching algorithm, pitch generation, and API connectivity.
- Use the quick launch buttons to open the sample job pages.

### Option B: Test Greenhouse Job & Form Autofill
Open in your browser:
```text
file:///E:/Projects/resumely/extension/test/sample-job-greenhouse.html
```
1. **Notice the In-Page Floating Widget:** A floating pill appears in the bottom-right corner.
2. **Open the Resumely Popup:** Click the pinned extension icon in your browser toolbar.
3. **Verify Job Detection:** You will see "Staff Frontend Engineer" at "Linear".
4. **Inspect ATS Match Score:** View the calculated match score (e.g. ~85–92%), matched skills (React, Next.js, TypeScript, GraphQL, WebSockets), and missing keywords.
5. **Test Save to Tracker:** Select stage "Saved" or "Applied", add an optional note, and click **"Save to Resumely Tracker"**.
6. **Test Form Autofill:**
   - Switch to the **Autofill & Copy** tab in the popup (or click "Autofill" on the floating widget).
   - Click **"Autofill Page"**.
   - Watch the Greenhouse form fields automatically populate with candidate Alex Morgan's First Name, Last Name, Email, Phone, LinkedIn, GitHub, Portfolio, and Current Employer with green highlights!
7. **Test Quick Copy:** Click on any field in the Quick Copy cheat sheet to test instant clipboard copying.
8. **Test AI Pitch:** Switch to the **AI Pitch** tab and review the generated elevator pitch tailored to Linear.

### Option C: Test LinkedIn Job Scraper
Open in your browser:
```text
file:///E:/Projects/resumely/extension/test/sample-job-linkedin.html
```
1. Open the Resumely popup.
2. Verify that it extracts "Senior Full Stack Engineer (Next.js & Cloud)" at "Vercel" and computes the match score.

---

## 🔌 Connecting to Your Live Resumely Web App

1. Start your Resumely Next.js development server:
   ```bash
   npm run dev
   ```
2. Start your Convex backend (if not already running):
   ```bash
   npx convex dev
   ```
3. Open the extension popup, click the **Settings** icon (top right), enter your Resumely account email or Convex User ID, and click **"Test & Sync with Resumely"**.
4. The status pill will turn **Green ("Live App")**, and your real Master Resume and tailored versions from Convex will be loaded into the extension!
5. When you save a job, it is immediately written to your `jobApplications` and `jobDescriptions` tables in Convex!

---

## 📁 Extension File Architecture

```text
extension/
├── manifest.json              # Chrome Manifest V3 configuration
├── popup/
│   ├── popup.html             # Multi-tab modern UI
│   ├── popup.css              # Custom Tailwind/shadcn dark theme
│   └── popup.js               # Reactive controller & tab logic
├── content-scripts/
│   ├── detector.js            # In-page job scraper (LinkedIn, Indeed, Greenhouse, Lever, JSON-LD)
│   ├── autofill.js            # Intelligent form filling engine
│   ├── widget.js              # Floating in-page pill (Shadow DOM isolated)
│   └── widget.css             # Widget styling
├── background/
│   └── service-worker.js      # Background service worker (Context menus & sync)
├── lib/
│   ├── matcher.js             # ATS skill extraction & 0-100% scoring engine
│   ├── storage.js             # Chrome storage manager & demo profile fallback
│   └── api.js                 # Bridge to Resumely Next.js & Convex backend
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
└── test/
    ├── sample-job-greenhouse.html # Mock Greenhouse job & application form
    ├── sample-job-linkedin.html   # Mock LinkedIn job posting
    └── test-guide.html            # Verification dashboard & manual testing guide
```

