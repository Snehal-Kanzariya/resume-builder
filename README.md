<div align="center">

# ResumeAI — Free AI-Powered Resume Builder

**Build a professional resume in minutes. Live preview · 10 templates · AI enhancement · One-click PDF export.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-2563eb?style=for-the-badge&logo=githubpages&logoColor=white)](https://snehal-kanzariya.github.io/resume-builder/)
[![Documentation](https://img.shields.io/badge/Documentation-View_PDF-7c3aed?style=for-the-badge&logo=readthedocs&logoColor=white)](https://snehal-kanzariya.github.io/resume-builder/docs.html)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-059669?style=flat-square)](LICENSE)

</div>

---

## Overview

**ResumeAI** is a fully client-side React application that lets anyone build a polished, ATS-friendly resume — without an account, without a backend, and entirely for free.

Fill in the form → watch the preview update live → let AI rewrite your content with stronger language → export a print-ready PDF.

---

## Features

| Feature | Detail |
|---|---|
| **Live Preview** | Every keystroke reflects instantly in the A4 preview panel |
| **10 Resume Templates** | Modern, Classic, Minimal, Creative, Professional, Executive, Tech, Compact, Elegant, Bold |
| **AI Enhancement** | Groq-powered (`llama-3.3-70b-versatile`) rewrites content with stronger verbs, metrics, and ATS keywords |
| **Side-by-side Compare** | Compare original vs AI-enhanced version section by section before accepting |
| **PDF Export** | `react-to-print` (text-selectable) + `html2canvas + jsPDF` fallback |
| **Dark / Light Mode** | System-preference-aware toggle, persisted in `localStorage` |
| **Accent Colour** | 8 presets + full custom colour picker per template |
| **Font Size** | Small / Medium / Large scale applied across the whole resume |
| **Zoom** | Fit / 75% / 100% zoom for the in-app preview |
| **Reset Resume** | One-click clear with confirmation dialog |
| **Load Sample Data** | Instantly populate with a realistic sample resume |
| **Keyboard Shortcuts** | `Ctrl+P` → Print · `Ctrl+S` → Save confirmation |
| **Auto-save** | Debounced save to `localStorage` every 5 seconds |
| **Toast Notifications** | Inline feedback for AI, PDF, save, and error events |
| **Scroll Animations** | IntersectionObserver reveal on the landing page |
| **Responsive** | Works on mobile (375 px) with hamburger nav and tab-based section switcher |

---

## Tech Stack

```
Frontend
├── React 19          — UI framework (hooks, context, lazy, Suspense)
├── Vite 8            — build tool & dev server
├── Tailwind CSS v4   — utility-first styling (class-based dark mode)
├── react-router-dom  — client-side routing (Home / Builder / Templates / Preview)
└── lucide-react      — icon library

AI Enhancement
├── Groq API          — llama-3.3-70b-versatile (OpenAI-compatible endpoint)
├── Rate limiting     — 4 s minimum gap between calls, automatic retry
└── Optional          — app works without an API key (AI buttons disabled gracefully)

PDF Export
├── react-to-print    — primary: opens browser print dialog (text-selectable output)
└── html2canvas + jsPDF — fallback download (rasterises the hidden 794×1123 px div)

State Management
├── ResumeContext     — all resume data + CRUD helpers + AI state
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
│   └── docs.html                  # Standalone printable documentation page
├── src/
│   ├── components/
│   │   ├── AI/
│   │   │   ├── AICompareView.jsx  # Full-screen side-by-side compare modal
│   │   │   ├── AIEnhanceButton.jsx
│   │   │   ├── AISuggestions.jsx  # Per-section tip panel
│   │   │   └── SectionAIPanel.jsx # Enhance + diff + accept UI
│   │   ├── Forms/
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── ExperienceForm.jsx
│   │   │   ├── EducationForm.jsx
│   │   │   ├── SkillsForm.jsx
│   │   │   ├── ProjectsForm.jsx
│   │   │   └── CertificationsForm.jsx
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx         # Responsive nav + theme toggle + hamburger
│   │   │   └── Sidebar.jsx        # Section nav + Reset/Sample buttons
│   │   ├── Preview/
│   │   │   ├── A4Container.jsx    # 794×1123 px scaled wrapper
│   │   │   └── ResumePreview.jsx  # Toolbar + live preview
│   │   └── Templates/             # 10 resume templates (lazy-loaded)
│   ├── context/
│   │   ├── ResumeContext.jsx      # Central resume state + all mutations
│   │   ├── ThemeContext.jsx       # Dark/light mode
│   │   └── ToastContext.jsx       # Global toast notifications
│   ├── data/
│   │   └── sampleData.js          # Realistic sample resume for demo
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── Builder.jsx            # 3-column builder layout
│   │   ├── TemplatesPage.jsx      # Template gallery
│   │   └── PreviewPage.jsx        # Full-screen preview + export
│   └── utils/
│       ├── aiEnhance.js           # Groq API calls with rate limiting
│       ├── pdfExport.js           # html2canvas + jsPDF export
│       └── storage.js             # localStorage helpers
├── .github/workflows/
│   └── deploy.yml                 # Auto-deploy to GitHub Pages on push
├── index.html                     # Entry point + meta/OG tags
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A free [Groq API key](https://console.groq.com/) *(optional — app fully works without one)*

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
|---|---|---|
| `VITE_GROQ_API_KEY` | No | Groq API key for AI enhancement. Get one free at [console.groq.com](https://console.groq.com) |

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
      │              │
      │              ├──▶  react-to-print  ──▶  Browser Print Dialog
      │              └──▶  html2canvas + jsPDF  ──▶  .pdf download
      │
      └──▶  SectionAIPanel  ──▶  Groq API (llama-3.3-70b-versatile)
                    │
                    └──▶  aiResumeData (context)
                                │
                                └──▶  AICompareView (side-by-side modal)
```

### AI Enhancement Flow

1. User clicks **"Enhance with AI"** in any form section
2. `SectionAIPanel` calls `enhanceSection()` in `aiEnhance.js`
3. A rate limiter enforces a 4-second minimum gap between API calls
4. Groq returns improved content (stronger verbs, metrics, ATS keywords)
5. Results are diffed inline (strikethrough original → green AI version)
6. The `aiResumeData` snapshot in context is updated
7. **Compare Versions** button appears in the preview toolbar
8. Accept section-by-section or view the full side-by-side comparison

### PDF Export Flow

1. A hidden `794×1123 px` `<div>` renders the template at native A4 resolution (no CSS transforms)
2. **Print** → `react-to-print` injects `@page { size: A4; margin: 0 }` and opens the system dialog — fully text-selectable
3. **Download PDF** → `html2canvas` rasterises at `2×` DPR, embeds into `jsPDF`, triggers `.save()`

---

## Templates

| Template | Style | Best For |
|---|---|---|
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
|---|---|
| `Ctrl + P` | Open print dialog |
| `Ctrl + S` | Confirm auto-save |

---

## Deployment

The app is automatically deployed to **GitHub Pages** via GitHub Actions on every push to `main`.

**Live URL:** [https://snehal-kanzariya.github.io/resume-builder/](https://snehal-kanzariya.github.io/resume-builder/)

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

**[Live Demo](https://snehal-kanzariya.github.io/resume-builder/) · [Documentation](https://snehal-kanzariya.github.io/resume-builder/docs.html) · [Report Bug](https://github.com/Snehal-Kanzariya/resume-builder/issues)**

*Built with React + AI · Open Source · Free Forever*

</div>
