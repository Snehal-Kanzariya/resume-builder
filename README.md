<div align="center">

# ResumeAI — Free AI-Powered Resume Builder

**Build a professional resume in minutes. Live preview · 10 templates · AI enhancement · One-click PDF export.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://resume-builder-lovat-mu.vercel.app/)
[![Documentation](https://img.shields.io/badge/Documentation-View_PDF-7c3aed?style=for-the-badge&logo=readthedocs&logoColor=white)](https://resume-builder-lovat-mu.vercel.app/docs.html)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-059669?style=flat-square)](LICENSE)

</div>

---

## Overview

**ResumeAI** is a fully client-side React application that lets anyone build a polished, ATS-friendly resume — without an account, without a backend, and entirely for free.

Fill in the form → watch the preview update live → upload your existing resume to pre-fill data → let AI rewrite your content with stronger language → export a print-ready PDF.

---

## Features

| Feature | Detail |
| --- | --- |
| **Live Preview** | Every keystroke reflects instantly in the A4 preview panel |
| **10 Resume Templates** | Modern, Classic, Minimal, Creative, Professional, Executive, Tech, Compact, Elegant, Bold |
| **Multi-Page Support** | Long resumes automatically overflow to multiple A4 pages in both preview and PDF export |
| **Resume Upload & Parse** | Upload an existing PDF or DOCX — Groq AI extracts all data and pre-fills the form |
| **Safe Import** | Uploaded data only fills empty fields; existing content is never overwritten without manual edits |
| **AI Enhancement** | Groq-powered (`llama-3.3-70b-versatile`) rewrites content with stronger verbs and ATS keywords — no invented metrics |
| **AI Interview Mode** | Optional post-upload chat — answer a few questions and the AI strengthens your resume answers |
| **Side-by-side Compare** | Compare original vs AI-enhanced version section by section before accepting |
| **Custom Sections** | Add unlimited custom sections (Volunteer Work, Publications, Languages, Awards, etc.) with paragraph or bullet format |
| **Custom Section Placement** | Choose where each custom section appears — after Personal Info, Experience, Education, Skills, Projects, or Certifications |
| **Drag-and-Drop Reordering** | Reorder resume sections, custom sections in the sidebar, and bullet points within any list |
| **PDF Export** | `react-to-print` (text-selectable) + `html2canvas + jsPDF` for multi-page PDF download |
| **Dark / Light Mode** | System-preference-aware toggle, persisted in `localStorage` |
| **Accent Colour** | 8 presets + full custom colour picker per template |
| **Font Size** | Small / Medium / Large scale applied across the whole resume |
| **Zoom** | Fit / 75% / 100% zoom for the in-app preview |
| **Split View** | Toggle a live preview panel side-by-side with the form in the builder |
| **Hide Empty Sections** | Sections with no data are automatically hidden in the preview and PDF |
| **Paragraph Formatting** | Line breaks and spacing entered in text areas are preserved exactly in the resume output |
| **Reset Resume** | One-click clear with confirmation dialog |
| **Load Sample Data** | Instantly populate with a realistic sample resume |
| **Keyboard Shortcuts** | `Ctrl+P` → Print · `Ctrl+S` → Save confirmation |
| **Auto-save** | Debounced save to `localStorage` every 5 seconds |
| **Toast Notifications** | Inline feedback for AI, PDF, save, and error events |
| **Responsive** | Works on mobile (375 px) with tab-based section switcher and floating preview toggle |

---

## Tech Stack

```
Frontend
├── React 19          — UI framework (hooks, context, lazy, Suspense)
├── Vite 8            — build tool & dev server
├── Tailwind CSS v4   — utility-first styling (class-based dark mode)
├── react-router-dom  — client-side routing (Home / Builder / Templates / Preview)
└── lucide-react      — icon library

AI
├── Groq API          — llama-3.3-70b-versatile (resume parsing, enhancement, interview)
├── Rate limiting     — 4 s minimum gap between calls, automatic retry
└── Optional          — app works without an API key (AI buttons disabled gracefully)

PDF Export
├── react-to-print    — primary: opens browser print dialog (text-selectable, correct colours)
└── html2canvas + jsPDF — download: captures full scrollHeight, slices into A4 pages

State Management
├── ResumeContext     — all resume data + CRUD helpers + reorder functions + AI state
├── ThemeContext      — dark/light theme with localStorage persistence
└── ToastContext      — global toast notification system

Code Splitting
└── React.lazy()      — all 10 templates lazy-loaded as separate chunks (~5–7 KB each)
```

---

## Project Structure

```
resume-builder/
├── public/
│   └── docs.html                    # Standalone printable documentation page
├── src/
│   ├── components/
│   │   ├── AI/
│   │   │   ├── AICompareView.jsx    # Full-screen side-by-side compare modal
│   │   │   ├── AIEnhanceButton.jsx
│   │   │   ├── AISuggestions.jsx    # Per-section tip panel
│   │   │   └── SectionAIPanel.jsx  # Enhance + diff + accept UI
│   │   ├── Forms/
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── ExperienceForm.jsx
│   │   │   ├── EducationForm.jsx
│   │   │   ├── SkillsForm.jsx
│   │   │   ├── ProjectsForm.jsx
│   │   │   ├── CertificationsForm.jsx
│   │   │   └── CustomSectionForm.jsx  # Title, format, position, drag-drop bullets
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx           # Responsive nav + theme toggle
│   │   │   └── Sidebar.jsx          # Section nav + drag-drop custom sections
│   │   ├── Preview/
│   │   │   ├── A4Container.jsx      # Multi-page 794 px scaled wrapper
│   │   │   └── ResumePreview.jsx    # Toolbar + live preview + print/download
│   │   ├── Templates/
│   │   │   ├── CustomSections.jsx   # Shared custom section renderer (used by all templates)
│   │   │   └── ...                  # 10 resume templates (lazy-loaded)
│   │   └── Upload/
│   │       ├── ResumeUpload.jsx     # Drag-drop upload + parse + action chooser
│   │       └── AIInterviewModal.jsx # Post-upload AI interview chat
│   ├── context/
│   │   ├── ResumeContext.jsx        # Central state, all mutations, reorder helpers
│   │   ├── ThemeContext.jsx         # Dark/light mode
│   │   └── ToastContext.jsx         # Global toast notifications
│   ├── data/
│   │   └── sampleData.js            # Realistic sample resume for demo
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page + upload entry point
│   │   ├── Builder.jsx              # 3-column builder (sidebar + form + preview)
│   │   ├── TemplatesPage.jsx        # Template gallery
│   │   └── PreviewPage.jsx          # Full-screen preview + print + download
│   └── utils/
│       ├── aiEnhance.js             # Groq AI enhancement with rate limiting
│       ├── resumeParser.js          # Groq resume parsing + interview question generation
│       ├── pdfExport.js             # Multi-page html2canvas + jsPDF export
│       └── storage.js               # localStorage helpers
├── index.html                       # Entry point + meta/OG tags
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A free [Groq API key](https://console.groq.com/) _(optional — all AI features are gracefully disabled without one)_

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Snehal-Kanzariya/resume-builder.git
cd resume-builder

# 2. Install dependencies
npm install

# 3. (Optional) Add your Groq API key
echo "VITE_GROQ_API_KEY=gsk_your_key_here" > .env

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_GROQ_API_KEY` | No | Groq API key for resume parsing, AI enhancement, and interview mode. Get one free at [console.groq.com](https://console.groq.com) |

---

## How It Works

### Data Flow

```
User Input (Forms)
      │
      ▼
ResumeContext  ──(auto-save every 5 s)──▶  localStorage
      │
      ├──▶  ResumePreview  ──▶  A4Container  ──▶  Template Component
      │              │                                    │
      │              │                             CustomSections
      │              │                          (placed per afterSection)
      │              ├──▶  react-to-print  ──▶  Browser Print Dialog
      │              └──▶  html2canvas + jsPDF  ──▶  multi-page .pdf
      │
      └──▶  SectionAIPanel  ──▶  Groq API (llama-3.3-70b-versatile)
                    │
                    └──▶  aiResumeData (context)
                                │
                                └──▶  AICompareView (side-by-side modal)
```

### Resume Upload Flow

1. Click **Import Resume** → drag-drop or select a PDF/DOCX
2. Groq AI parses the raw text into structured JSON
3. A success screen offers two choices:
   - **Edit in Builder** — data fills empty fields only; existing entries are never overwritten
   - **Enhance with AI** — imports data then opens the AI Interview modal
4. AI Interview (optional) — answer a few questions; Groq strengthens the resume content using your answers

### Custom Sections

1. Click **Add Custom Section** in the sidebar
2. Give the section a title (e.g. "Publications", "Languages", "Volunteer Work")
3. Choose **Paragraph** or **Bullet List** format
4. Select **Position in Resume** — pick which built-in section it appears after
5. Drag bullet points to reorder them; drag sections in the sidebar to reorder their display order
6. The section renders in the template exactly where positioned, hidden automatically if empty

### PDF Export Flow

1. A hidden `794×1123 px` `<div>` renders the template at native A4 resolution (no CSS transforms)
2. **Print** → `react-to-print` injects `@page { size: A4; margin: 0 }` and opens the system dialog — fully text-selectable, correct colours
3. **Download PDF** → all `overflow: hidden` inline styles are temporarily removed, `html2canvas` captures the full `scrollHeight`, content is sliced into A4 pages via `jsPDF` position offsets, then styles are restored

---

## Templates

| Template | Style | Best For |
| --- | --- | --- |
| **Modern** | 2-column with accent sidebar | Tech & design roles |
| **Classic** | Serif headings, single column | Traditional industries |
| **Minimal** | Ultra-clean, maximum whitespace | Any role, premium feel |
| **Creative** | Bold colours, skill bars, gradient | Creative fields |
| **Professional** | ATS-optimised, machine-readable | Applicant tracking systems |
| **Executive** | Authoritative layout, heavy typography | Senior leadership |
| **Tech** | Monospace accents, technical layout | Engineering / DevOps |
| **Compact** | Dense layout, fits more content | Experienced professionals |
| **Elegant** | Refined serif + light accents | Finance, law, consulting |
| **Bold** | High-contrast, impactful headings | Sales, marketing |

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl + P` | Open print dialog |
| `Ctrl + S` | Confirm auto-save |

---

## Deployment

The app is deployed on **Vercel** and served from the root `/`.

**Live URL:** [https://resume-builder-lovat-mu.vercel.app/](https://resume-builder-lovat-mu.vercel.app/)

```bash
# Manual build
npm run build   # Output: dist/
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

MIT © 2026 [Snehal Kanzariya](https://github.com/Snehal-Kanzariya)

---

<div align="center">

**[Live Demo](https://resume-builder-lovat-mu.vercel.app/) · [Documentation](https://resume-builder-lovat-mu.vercel.app/docs.html) · [Report Bug](https://github.com/Snehal-Kanzariya/resume-builder/issues)**

_Built with React + AI · Open Source · Free Forever_

</div>
