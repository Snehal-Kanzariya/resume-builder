# Resume Builder — Project Specification

## Overview
A modern, market-ready Resume Builder web app. Users fill forms → see live preview → switch templates → download PDF. Built with React + Vite + Tailwind CSS.

---

## Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (via @tailwindcss/vite plugin)
- **Routing**: react-router-dom v6
- **PDF Export**: react-to-print + html2canvas + jspdf
- **Icons**: lucide-react
- **State**: React Context API
- **Storage**: localStorage for auto-save
- **Fonts**: Google Fonts (load via index.html)

---

## Project Structure
```
src/
├── components/
│   ├── Layout/
│   │   ├── Navbar.jsx              → App header with logo, nav links
│   │   ├── Footer.jsx              → Simple footer
│   │   └── Sidebar.jsx             → Builder page section navigator
│   ├── Forms/
│   │   ├── PersonalInfoForm.jsx    → Name, email, phone, location, linkedin, portfolio, summary
│   │   ├── ExperienceForm.jsx      → Company, role, dates, bullets (add/remove multiple)
│   │   ├── EducationForm.jsx       → School, degree, field, dates, GPA (add/remove multiple)
│   │   ├── SkillsForm.jsx          → Skill tags with proficiency level (add/remove)
│   │   ├── ProjectsForm.jsx        → Project name, description, tech, link (add/remove)
│   │   ├── CertificationsForm.jsx  → Cert name, issuer, date, link (add/remove)
│   │   └── CustomSectionForm.jsx   → User-defined section title + content
│   ├── Preview/
│   │   ├── ResumePreview.jsx       → Live preview container (renders selected template)
│   │   └── A4Container.jsx         → A4-sized wrapper with proper scaling
│   └── Templates/
│       ├── ModernTemplate.jsx      → Clean, 2-column, accent color sidebar
│       ├── ClassicTemplate.jsx     → Traditional single-column, serif fonts
│       ├── MinimalTemplate.jsx     → Ultra-clean, lots of whitespace
│       ├── CreativeTemplate.jsx    → Bold colors, unique layout
│       └── ProfessionalTemplate.jsx → ATS-friendly, structured
├── pages/
│   ├── Home.jsx                    → Landing page with hero, features, CTA
│   ├── Builder.jsx                 → Main builder: sidebar + forms + live preview
│   ├── TemplatesPage.jsx           → Template gallery with preview thumbnails
│   └── PreviewPage.jsx             → Full-screen preview + download/print buttons
├── context/
│   └── ResumeContext.jsx           → Global state: resume data + selected template + theme color
├── data/
│   └── sampleData.js              → Pre-filled sample resume for demo
├── utils/
│   ├── pdfExport.js               → PDF generation helper functions
│   └── storage.js                 → localStorage save/load helpers
├── hooks/
│   └── useAutoSave.js             → Auto-save to localStorage every 5 seconds
├── App.jsx                         → Router setup + Context provider
├── main.jsx                        → Entry point
└── index.css                       → Tailwind import + custom print styles + Google Fonts
```

---

## Data Schema (ResumeContext State)

```javascript
const initialResumeData = {
  // Personal Info
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: ""
  },

  // Work Experience (array)
  experience: [
    {
      id: "uuid",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      bullets: [""]  // array of bullet points
    }
  ],

  // Education (array)
  education: [
    {
      id: "uuid",
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      achievements: ""
    }
  ],

  // Skills (array)
  skills: [
    {
      id: "uuid",
      category: "",        // e.g., "Programming Languages", "Tools"
      items: [""]          // array of skill names
    }
  ],

  // Projects (array)
  projects: [
    {
      id: "uuid",
      name: "",
      description: "",
      technologies: "",
      liveLink: "",
      githubLink: ""
    }
  ],

  // Certifications (array)
  certifications: [
    {
      id: "uuid",
      name: "",
      issuer: "",
      date: "",
      link: ""
    }
  ],

  // Settings
  settings: {
    selectedTemplate: "modern",    // modern | classic | minimal | creative | professional
    accentColor: "#2563eb",        // user-picked accent color
    fontSize: "medium",            // small | medium | large
    sectionOrder: ["experience", "education", "skills", "projects", "certifications"]
  }
};
```

---

## Page Specifications

### 1. Home Page (Landing)
- **Hero Section**: Bold headline "Build Your Professional Resume in Minutes", subtext, CTA button → /builder
- **Features Section**: 3-4 cards (Live Preview, Multiple Templates, PDF Download, ATS-Friendly)
- **Template Showcase**: Preview thumbnails of all 5 templates
- **Footer**: Simple links + credits
- **Design**: Modern, gradient hero background, smooth scroll animations

### 2. Builder Page (Core Feature)
- **Layout**: 3-column on desktop
  - Left: Sidebar with section navigation (clickable steps)
  - Center: Active form section (scrollable)
  - Right: Live resume preview (A4 scaled, sticky)
- **Mobile**: Tab-based — toggle between Form and Preview
- **Form Features**:
  - Add/remove multiple entries (experience, education, etc.)
  - Drag reorder sections (optional, nice-to-have)
  - Real-time preview updates on every keystroke
  - Collapsible sections
  - Progress indicator showing completion %
- **Preview Panel**:
  - A4 ratio container (210mm × 297mm scaled)
  - Template selector dropdown at top
  - Color picker for accent color
  - Zoom in/out controls
  - "Download PDF" and "Print" buttons

### 3. Templates Page
- Grid of template cards with hover preview
- Click to select → navigates to builder with that template active
- Each card shows: template name, brief description, "Use This Template" button

### 4. Preview Page
- Full-screen A4 resume preview
- Top toolbar: Back to editor, Download PDF, Print, Share link (future)
- Clean, distraction-free view

---

## Template Designs

### Modern Template
- 2-column layout: Left sidebar (30%) with dark/colored background for name, contact, skills
- Right content area (70%) for experience, education, projects
- Clean sans-serif typography
- Accent color for headings and dividers

### Classic Template
- Single column, traditional layout
- Name centered at top, contact info below
- Clear section dividers with horizontal rules
- Serif font for headings, sans-serif for body
- Black and white, minimal color

### Minimal Template
- Maximum whitespace
- Very thin typography
- Subtle section separators
- Name top-left, contact top-right
- Single column, airy spacing

### Creative Template
- Bold accent color blocks
- Asymmetric layout
- Skill bars/charts for visual flair
- Unique section headers with icons
- Modern, design-focused

### Professional Template (ATS-Friendly)
- Simple, clean single-column
- Standard section ordering
- No graphics/charts (pure text)
- Machine-readable formatting
- Times New Roman or similar traditional font

---

## Key Features for Market-Ready

1. **Live Preview**: Instant updates as user types
2. **5 Templates**: Switchable in real-time
3. **PDF Download**: High-quality, print-ready PDF
4. **Auto-Save**: localStorage persistence
5. **Responsive**: Works on mobile + tablet + desktop
6. **ATS-Friendly**: At least 1 template optimized for ATS
7. **Custom Accent Color**: User-selectable theme color
8. **Section Reordering**: Users choose which sections appear and in what order
9. **Sample Data**: One-click fill with sample data for demo
10. **Print Styling**: Proper @media print CSS

---

## Design System

### Colors (CSS Variables)
```css
--primary: #1e293b;       /* Dark slate for text */
--secondary: #64748b;     /* Muted text */
--accent: #2563eb;        /* Blue accent (user-changeable) */
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--bg-dark: #0f172a;
--border: #e2e8f0;
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

### Typography
- **Headings**: "Plus Jakarta Sans" or "Outfit" (Google Fonts)
- **Body**: "Inter" or "DM Sans"
- **Resume Classic**: "Merriweather" (serif)

### Spacing
- Section gaps: 2rem
- Form field gaps: 1rem
- A4 padding: 1.5rem

---

## Build Phases (3-Day Plan)

### Day 1: Foundation + Forms + Context
1. Setup ResumeContext with full data schema
2. Build ALL form components with add/remove functionality
3. Builder page layout (3-column)
4. Sidebar navigation between sections
5. Wire forms to context (real-time state updates)
- **Git commit after each major component**

### Day 2: Templates + Preview + PDF + AI
6. A4Container component with proper scaling
7. Build all 5 resume templates
8. Live preview rendering with template switching
9. Color picker for accent color
10. PDF download + print functionality
11. Build AI enhancement feature with Gemini API, compare view, and rule-based suggestions
- **Git commit after each template**

### Day 3: Landing Page + Polish + Deploy
11. Home page with hero, features, template showcase
12. Templates gallery page
13. Full-screen preview page
14. Responsive design fixes
15. Auto-save with localStorage
16. Final testing + bug fixes
17. Deploy to Vercel
- **Git commit + push + deploy**

---

## Claude CLI Commands Reference

### Token-Saving Tips
- Always reference this spec: `@SPEC.md`
- Build one component at a time
- Use specific, scoped prompts
- Don't repeat context — point to the spec

### Suggested Prompts (in order)

**Day 1:**
```
Read @SPEC.md — Build the ResumeContext.jsx with full initialResumeData schema, provider, and all update functions (updatePersonalInfo, addExperience, removeExperience, updateExperience, etc. for every section). Include settings management.
```

```
Read @SPEC.md — Build ALL form components in src/components/Forms/. Each form should use ResumeContext, support add/remove multiple entries, and have clean Tailwind styling. Build: PersonalInfoForm, ExperienceForm, EducationForm, SkillsForm, ProjectsForm, CertificationsForm.
```

```
Read @SPEC.md — Build the Builder.jsx page with 3-column layout: Sidebar (section nav), center (active form), right (preview placeholder). Include Sidebar.jsx component. Wire section navigation. Make it responsive (tabs on mobile).
```

**Day 2:**
```
Read @SPEC.md — Build A4Container.jsx and all 5 resume templates (ModernTemplate, ClassicTemplate, MinimalTemplate, CreativeTemplate, ProfessionalTemplate). Each reads from ResumeContext and renders a full resume. Use proper print-friendly CSS.
```

```
Read @SPEC.md — Build ResumePreview.jsx that renders the selected template inside A4Container. Add template selector dropdown, accent color picker, and zoom controls. Wire to Builder.jsx right panel.
```

```
Read @SPEC.md — Implement PDF download using react-to-print and html2canvas+jspdf as fallback. Add download and print buttons to the preview panel and PreviewPage.
```

**Day 3:**
```
Read @SPEC.md — Build Home.jsx landing page with hero section, features grid, template showcase, and CTA. Build TemplatesPage.jsx with template gallery cards. Build PreviewPage.jsx with full-screen view. Setup all routes in App.jsx.
```

```
Read @SPEC.md — Add auto-save to localStorage (useAutoSave hook + storage utils). Add "Load Sample Data" button. Polish responsive design. Fix any visual bugs. Ensure Navbar and Footer are on all pages.
```

---

## AI Enhancement Feature (Google Gemini API - Free)

### Overview
Users can enhance their resume content using AI. The app uses Google Gemini 2.0 Flash (free, no credit card needed) via REST API directly from the browser.

### API Configuration
- Key stored in .env as VITE_GEMINI_API_KEY (accessed via import.meta.env.VITE_GEMINI_API_KEY)
- Endpoint: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}
- Headers: Content-Type: application/json
- Body: { contents: [{ parts: [{ text: prompt }] }] }
- Response: data.candidates[0].content.parts[0].text

### AI Files Structure
```
src/
├── utils/
│   └── aiEnhance.js           → Gemini API call, prompt builder, JSON parser
├── components/
│   └── AI/
│       ├── AIEnhanceButton.jsx → "Enhance with AI" button with loading state
│       ├── AICompareView.jsx   → Side-by-side original vs AI comparison modal
│       └── AISuggestions.jsx   → Rule-based instant tips (no API calls)
```

### AI Data Flow
1. User clicks "Enhance with AI" → sends current resume data to Gemini
2. Gemini returns improved version as JSON → stored as aiResumeData in context
3. User clicks "Compare Versions" → sees side-by-side in AICompareView
4. User can: Keep Original, Use AI Version, or Merge section-by-section
5. Both versions can be downloaded as separate PDFs

### Context Additions
- aiResumeData: null | object (same shape as resumeData)
- setAiResumeData(data)
- acceptAllAi() → replaces resumeData with aiResumeData
- mergeAiSections(selectedSections) → replaces only chosen sections
- clearAiData() → resets aiResumeData to null

### AISuggestions Rules (No API, instant feedback)
- Check bullets start with action verbs (managed, developed, led, etc.)
- Check bullets contain numbers/metrics/percentages
- Check summary is 2-4 sentences
- Check skills count > 5
- Check each experience has 3+ bullet points
- Green checkmark = good, Yellow warning = needs improvement

### Graceful Fallback
- If VITE_GEMINI_API_KEY is missing, AI buttons show tooltip: "Add your free Gemini API key to enable AI features. Get one at aistudio.google.com"
- AI features are optional - app works fully without them

---

## Resume Upload & AI Interview Feature

### Overview
Users can upload an existing resume (PDF or DOCX). The app extracts text, uses AI to parse it into structured data, fills all forms automatically, then asks smart follow-up questions to improve and update the resume based on the user's current situation.

### Files Structure
```
src/
├── components/
│   └── Upload/
│       ├── ResumeUpload.jsx        → Drag-and-drop upload area with file type validation
│       ├── ResumeParsingStatus.jsx  → Progress steps: Upload → Extract → Parse → Fill
│       └── AIInterviewModal.jsx     → Follow-up questions modal with chat-like UI
├── utils/
│   ├── pdfParser.js                → Extract text from PDF using pdfjs-dist
│   ├── docxParser.js               → Extract text from DOCX using mammoth
│   └── resumeParser.js             → Send extracted text to Groq AI to structure into resume JSON
```

### Upload Flow
1. User drags/drops or clicks to upload PDF or DOCX file (max 5MB)
2. File type detected → appropriate parser called
3. pdfParser.js uses pdfjs-dist to extract all text from PDF pages
4. docxParser.js uses mammoth to extract raw text from DOCX
5. Extracted text sent to Groq API with prompt to structure it into resumeData JSON schema
6. Parsed data populates ResumeContext → all forms auto-fill
7. Show success with summary of what was extracted

### AI Interview Flow (Post-Upload)
After upload and parsing, AIInterviewModal opens with smart questions:

Round 1 - Verify & Update:
- "I see you were at [company] as [role]. Are you still there, or have you moved on?"
- "Your latest skills include [skills]. Any new technologies you have picked up?"
- "I found [X] years of experience. Is that still accurate?"

Round 2 - Enhance:
- "What is your target job title or role right now?"
- "Any recent achievements or metrics you would like to highlight?"
- "Are there any projects or certifications to add?"

The AI generates questions dynamically based on the parsed resume data.
User answers in a chat-like interface. After all questions, AI updates the resume data.

### Groq API Prompts

For parsing:
"You are a resume parser. Extract structured data from this resume text. Return ONLY valid JSON matching this exact schema: {personalInfo: {fullName, jobTitle, email, phone, location, linkedin, portfolio, summary}, experience: [{company, position, startDate, endDate, current, location, bullets}], education: [{school, degree, field, startDate, endDate, gpa}], skills: [{category, items}], projects: [{name, description, technologies, liveLink, githubLink}], certifications: [{name, issuer, date}]}. Fill every field you can find. Use empty string for missing fields. For dates use format like Jan 2023."

For interview questions:
"Based on this resume data, generate 5 smart follow-up questions to update and improve the resume. Focus on: current role status, new skills, recent achievements with metrics, target role, and gaps. Return JSON array of {id, question, field} where field is the resume section the answer relates to."

For applying answers:
"Given this resume data and these user answers to interview questions, update the resume data with the new information. Merge answers into appropriate sections. Return the complete updated resume JSON."

### UI Placement
- Upload button on Home page hero: "Upload Existing Resume" next to "Start Building"
- Upload option in Builder page: Upload icon button in top toolbar
- Also accessible via Sidebar: "Import Resume" option at top

---

## Deployment Checklist
- [ ] All 5 templates render correctly
- [ ] PDF download works (text selectable, not blurry)
- [ ] Mobile responsive
- [ ] Auto-save working
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] `npm run build` succeeds
- [ ] Deploy to Vercel: `npx vercel --prod`
- [ ] VITE_GEMINI_API_KEY set in Vercel environment variables
- [ ] AI enhance and compare working
- [ ] App works without API key (graceful fallback)

---

## File: vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## File: index.css
```css
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=Merriweather:wght@400;700&display=swap');

@media print {
  body * { visibility: hidden; }
  .print-area, .print-area * { visibility: visible; }
  .print-area { position: absolute; left: 0; top: 0; width: 210mm; }
  @page { size: A4; margin: 0; }
}
```
