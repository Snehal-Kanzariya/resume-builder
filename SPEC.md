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
│   │   ├── ReferencesForm.jsx      → Reference name, title, company, phone, email, relationship (add/remove)
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
- GitHub icon + link in sidebar contact section (only if github field is not empty)
- References page (separate A4 page) mirrors this template's sidebar/accent style when showReferences is ON

### Classic Template
- Single column, traditional layout
- Name centered at top, contact info below in a row
- Clear section dividers with horizontal rules
- Serif font for headings, sans-serif for body
- Black and white, minimal color
- GitHub icon + link in header contact row (only if github field is not empty)
- References page mirrors classic single-column style when showReferences is ON

### Minimal Template
- Maximum whitespace
- Very thin typography
- Subtle section separators
- Name top-left, contact top-right
- Single column, airy spacing
- GitHub icon + link in header contact area (only if github field is not empty)
- References page mirrors minimal clean style when showReferences is ON

### Creative Template
- Bold accent color blocks
- Asymmetric layout
- Skill bars/charts for visual flair
- Unique section headers with icons
- Modern, design-focused
- GitHub icon + link in sidebar contact section (only if github field is not empty)
- References page mirrors creative accent colors and typography when showReferences is ON

### Professional Template (ATS-Friendly)
- Simple, clean single-column
- Standard section ordering
- No graphics/charts (pure text)
- Machine-readable formatting
- Times New Roman or similar traditional font
- GitHub shown as plain text URL in header contact row (only if github field is not empty)
- References page is plain text, ATS-safe when showReferences is ON

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

### Post-Launch Enhancement Sprint
18. Custom sections: `customSections[]` in context, `CustomSectionForm`, `CustomSections.jsx`, all templates ✓
19. Upload data integrity: `importResumeData` fills empty fields only, never overwrites ✓
20. Template empty-section hiding: all sections wrapped in `{data.length > 0 && ...}` ✓
21. AI enhancement: no fake metrics — system prompt updated ✓
22. Add `github` field to personalInfo + PersonalInfoForm + all templates
19. Build ReferencesForm + references data schema + showReferences toggle
20. Build References Page renderer (design-matched, separate A4 page)
21. Update PDF export: append references page when showReferences is ON
22. Multi-page support: remove fixed height, add page-break indicator, page count badge
23. Add watermark to exported PDFs (pdfExport.js), skip if isPremium
24. Add `await document.fonts.ready` before html2canvas capture (PDF/preview mismatch fix)
25. Add `settings.isPremium` + "Upgrade to Pro" CTA near download button
- **Git commit after each feature**

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

## Resume Upload & AI Interview Feature (Redesigned)

### Core Principle
Upload → Instantly see resume in Builder with Preview → User edits manually → AI enhancement is OPTIONAL.

### User Flows

#### Flow 1: Upload from Home Page
1. User clicks "Upload Your Resume" on Home hero
2. Upload modal opens with drag-and-drop zone
3. User drops PDF or DOCX file (max 5MB)
4. Progress bar: Upload ✓ → Extracting Text ✓ → AI Parsing ✓ → Done ✓
5. Success screen shows: "Resume imported! Found: X jobs, X degrees, X skills"
6. Two buttons: "Edit in Builder" (primary) | "Enhance with AI" (secondary)
7. "Edit in Builder" → navigates to /builder with all forms filled + live preview showing resume
8. User edits any field manually → preview updates live in real-time

#### Flow 2: Upload from Builder Page
1. User clicks upload icon in Builder toolbar or "Import Resume" in sidebar
2. Same upload modal opens
3. After parsing, success screen shows with same two buttons
4. "Edit in Builder" → closes modal, forms and preview update immediately
5. No automatic AI interview — user controls everything

#### Flow 3: Optional AI Enhancement (After Upload or Manual Entry)
1. User clicks "Enhance with AI" from the upload success screen
2. AI Interview modal opens with chat-like UI
3. AI generates 5 smart questions based on current resumeData:
   - Current role status (still at company or moved?)
   - New skills or technologies learned
   - Recent achievements with quantified metrics
   - Target job title or role
   - New projects or certifications to add
4. User answers each question (can skip any)
5. After all questions, AI merges answers into existing resumeData (does NOT replace, only updates/adds)
6. Modal closes → Builder shows updated data + preview refreshes instantly
7. Success toast: "Resume updated with your answers!"
8. Done screen also offers "View Full Preview" button → navigates to /preview

### Files Structure
```
src/
├── components/
│   └── Upload/
│       ├── ResumeUpload.jsx          → Drag-and-drop upload with file validation
│       ├── ResumeParsingStatus.jsx    → Step progress: Upload → Extract → Parse → Fill
│       └── AIInterviewModal.jsx       → Optional chat-like follow-up questions
│   └── Templates/
│       └── UploadedTemplate.jsx      → Clean default template for uploaded resumes
├── utils/
│   ├── pdfParser.js                  → Extract text from PDF using pdfjs-dist
│   ├── docxParser.js                 → Extract text from DOCX using mammoth
│   └── resumeParser.js              → AI parse text into resume JSON + interview helpers
```

### Dependencies
- pdfjs-dist (PDF text extraction)
- mammoth (DOCX text extraction)
- Groq API llama-3.3-70b-versatile (same as AI enhance)

### Upload Component Spec (ResumeUpload.jsx)
- Drag-and-drop zone with dashed border
- Accept: .pdf, .docx only
- Max size: 5MB
- States: idle → uploading → extracting → parsing → success → error
- Idle: Upload icon + "Drag your resume here or click to browse" + file type badges
- Extracting: "Reading your resume..." with spinner
- Parsing: "AI is analyzing your content..." with spinner
- Success: Summary card showing extracted counts + two action buttons
- Error: Error message + "Try Again" button
- Props: `onGoToBuilder(parsed)`, `onEnhanceWithAI(parsed)`, `onClose`

### PDF Parser Spec (pdfParser.js)
- Use pdfjs-dist with CDN worker: https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs
- Function: `extractTextFromPDF(file)` → Promise<string>
- Load file as ArrayBuffer → pdf.getPage for each page → page.getTextContent → concatenate all items
- Handle multi-page resumes (typically 1-3 pages)

### DOCX Parser Spec (docxParser.js)
- Use mammoth.extractRawText()
- Function: `extractTextFromDOCX(file)` → Promise<string>
- Load file as ArrayBuffer → pass to mammoth → return raw text

### Resume Parser Spec (resumeParser.js)
- Function: `parseResumeText(text)` → Promise<resumeData>
  - Sends text to Groq API (llama-3.3-70b-versatile)
  - System prompt: "You are a resume parser. Extract ALL information from this resume text into structured JSON. Return ONLY valid JSON matching this exact schema: {personalInfo: {fullName, jobTitle, email, phone, location, linkedin, portfolio, summary}, experience: [{company, position, startDate, endDate, current, location, bullets}], education: [{school, degree, field, startDate, endDate, gpa}], skills: [{category, items}], projects: [{name, description, technologies, liveLink, githubLink}], certifications: [{name, issuer, date}]}. Extract every detail. Use empty string for fields you cannot find. For experience bullets, extract each bullet point as a separate string in the array."
  - Strip markdown backticks from response before JSON.parse
  - Run result through `validateParsedData()` before returning
  - Deep merge with initialResumeData to ensure complete structure
  - Generate unique IDs for all array items

- Function: `generateInterviewQuestions(resumeData)` → Promise<questions[]>
  - Sends current resumeData to Groq
  - Returns array of `{id, question, field, type}` where type is "text" or "textarea"
  - 4 second delay before API call

- Function: `applyInterviewAnswers(resumeData, answers)` → Promise<updatedResumeData>
  - Sends resume + answers to Groq
  - AI merges answers into existing data (adds/updates, never removes)
  - Returns complete updated resumeData
  - 4 second delay before API call

- Function: `validateParsedData(data)` → sanitizedData
  - Ensures every field exists with correct type
  - Adds missing fields with empty string defaults
  - Generates IDs for array items missing them
  - Ensures bullets and items are always arrays (not strings)
  - Returns fully valid resumeData safe to put into context

- Function: `hasApiKey()` → boolean — checks VITE_GROQ_API_KEY exists

### ResumeContext Additions
- `importResumeData(parsedData)`: Deep merges parsed data with initialResumeData, generates IDs
- `setFullResumeData(data)`: Replaces entire resumeData, preserves settings, deep merges personalInfo
- Both functions use safe defaults so no field is ever undefined

### AIInterviewModal Spec (AIInterviewModal.jsx)
- Only opens when user explicitly clicks "Enhance with AI" — never auto-opens
- Chat-like interface: AI message bubble (question) → User textarea → Skip / Next buttons
- Progress bar + "Question X of 5" label
- After last question: "Applying your updates…" loading spinner
- Final done screen: "Resume Updated!" + "Go to Builder" button + "View Full Preview" button
- Props: `resumeData`, `onUpdate(updated)`, `onClose`, `onViewPreview`
- `onClose` → caller resets section to 'personal', shows success toast, stays in Builder
- `onViewPreview` → caller navigates to /preview

### Uploaded Template Spec (UploadedTemplate.jsx)
- Clean, modern single-column professional layout
- Auto-selected when resume is uploaded (settings.selectedTemplate = 'uploaded')
- Similar to ProfessionalTemplate but with slightly more modern typography
- Renders ALL sections from resumeData using accentColor from settings
- Handles missing sections gracefully (hides entire section if array is empty)
- Print-friendly, ATS-safe (no graphics)

### Template Selector Update
- Add "Uploaded" as 11th template option in dropdown and TemplatesPage gallery
- Key: `"uploaded"` in settings.selectedTemplate
- TEMPLATES array in ResumePreview.jsx must include `{ id: 'uploaded', label: 'Uploaded', Component: UploadedTemplate }`

### Home Page Update
- Hero buttons: "Start from Scratch" (primary) | "Upload Your Resume" (secondary)
- "Upload Your Resume" opens ResumeUpload modal
- After successful upload → navigate to /builder with data filled + preview live

### Builder Page Update
- Upload icon button in toolbar opens ResumeUpload modal
- "Import Resume" button at top of Sidebar opens ResumeUpload modal
- "Enhance with AI" button in sidebar triggers AIInterviewModal (does not auto-run)
- Preview panel always renders resume when resumeData has any content

### Error Handling
- PDF parse fail: "Could not read this PDF. Please try a text-based PDF (not scanned image)."
- DOCX parse fail: "Could not read this file. Please try a .docx format."
- AI parse fail: "AI could not parse the resume. Please try again or enter details manually."
- File too large: "File is too large. Please upload a file under 5MB."
- Wrong file type: "Please upload a PDF or DOCX file."
- Network error: "No internet connection. Please check your network and try again."
- All errors show retry option

### Rate Limiting
- 4 second delay between all Groq API calls
- parseResumeText: 1 call
- generateInterviewQuestions: 1 call (4s after parse)
- applyInterviewAnswers: 1 call (4s after last question)
- Total: max 3 API calls for full upload + interview flow

### Groq API Prompts

For parsing:
"You are a resume parser. Extract ALL information from this resume text into structured JSON. Return ONLY valid JSON matching this exact schema: {personalInfo: {fullName, jobTitle, email, phone, location, linkedin, portfolio, summary}, experience: [{company, position, startDate, endDate, current, location, bullets}], education: [{school, degree, field, startDate, endDate, gpa}], skills: [{category, items}], projects: [{name, description, technologies, liveLink, githubLink}], certifications: [{name, issuer, date}]}. Extract every detail. Use empty string for fields you cannot find. For experience bullets, extract each bullet point as a separate string in the array."

For interview questions:
"Based on this resume data, generate 5 smart follow-up questions to update and improve the resume. Focus on: current role status, new skills, recent achievements with metrics, target role, and gaps. Return JSON array of {id, question, field} where field is the resume section the answer relates to."

For applying answers:
"Given this resume data and these user answers to interview questions, update the resume data with the new information. Merge answers into appropriate sections. Return the complete updated resume JSON."

### UI Placement
- Upload button on Home page hero: "Upload Your Resume" next to "Start from Scratch"
- Upload option in Builder page: "Import Resume" button in top toolbar + sidebar button
- AI Enhance option: only appears in upload success screen and Builder sidebar "Enhance with AI" button

---

## Drag-and-Drop Section Reordering

### Overview
Users can reorder entries within Experience, Education, Projects, Certifications, and Skills sections by dragging them up or down. This uses native HTML5 drag-and-drop API with no external libraries.

### UI Design
- Each entry card has a GripVertical icon (lucide-react) as a drag handle on the left side of the entry header
- Drag handle: gray color, darkens on hover, cursor changes to grab/grabbing
- Only the drag handle initiates dragging (not the entire card)
- Subtle tooltip on handle: "Drag to reorder"

### Drag Behavior
- onDragStart: store dragged item index in a ref, set dragged item opacity to 0.5
- onDragOver: preventDefault, show 2px blue indicator line at drop position
- onDrop: reorder the array in context, clear visual indicators
- onDragEnd: reset all styles
- After drop: brief blue highlight flash on the dropped item

### Mobile Support
- Touch devices cannot reliably drag-and-drop
- Show ArrowUp and ArrowDown icon buttons (lucide-react) next to drag handle on small screens
- ArrowUp moves item one position up, ArrowDown moves one position down
- Hide ArrowUp on first item, ArrowDown on last item
- Use Tailwind responsive classes: drag handle visible on md+, arrow buttons visible on sm only

### Context Functions (ResumeContext.jsx)
```javascript
reorderExperience(fromIndex, toIndex)
reorderEducation(fromIndex, toIndex)
reorderProjects(fromIndex, toIndex)
reorderCertifications(fromIndex, toIndex)
reorderSkillCategory(fromIndex, toIndex)
```
Each function:
- Copies the array
- Splices the item from fromIndex
- Inserts at toIndex
- Updates state

### Affected Components
| Component | Context Function | Array |
|-----------|-----------------|-------|
| ExperienceForm.jsx | reorderExperience | experience[] |
| EducationForm.jsx | reorderEducation | education[] |
| ProjectsForm.jsx | reorderProjects | projects[] |
| CertificationsForm.jsx | reorderCertifications | certifications[] |
| SkillsForm.jsx | reorderSkillCategory | skills[] |

### Implementation Pattern (reusable across all forms)
Entry Card Layout:
```
┌──────────────────────────────────────┐
│ ⠿ [Drag Handle]  Entry Title    [Delete] │
│ ↑↓ [Mobile arrows]                       │
│    Form fields...                         │
└──────────────────────────────────────┘
```

### Animations
- Dragged item: opacity 0.5 with slight scale(1.02)
- Drop zone: 2px solid blue line indicator
- After drop: background briefly flashes blue then fades (300ms transition)
- Array reorder triggers smooth layout shift

### Edge Cases
- Single entry: drag handle visible but non-functional (nothing to reorder)
- Two entries: drag works normally
- Dragging cancelled (drop outside): item returns to original position
- Preview updates in real-time as items reorder

---

## Upload Data Integrity — No Silent Overwrite

### Rule
When a user uploads a resume (PDF or DOCX), **existing non-empty data in the builder is never overwritten**. The uploaded resume only fills in fields and sections that are currently empty. This protects users who have already started editing their resume from losing their work.

### Behavior (implemented in `importResumeData`)
- **personalInfo fields**: If a field (e.g. email, fullName) is already filled in the builder, keep it. Only replace it if it is currently empty.
- **Array sections** (experience, education, skills, projects, certifications): If the builder already has entries for a section, keep them. Use the uploaded resume's entries only if that section is currently empty.
- **customSections**: Never overwritten by upload — always kept as-is.
- **settings**: Always kept from the existing builder state (theme, template, color).

### Why
Users may have partially filled the builder before uploading, or they may upload to fill in missing sections. Silent replacement would destroy their existing edits.

### If User Wants Full Replacement
Tell them: "To fully replace your current resume with an uploaded one, click Reset Resume first, then upload."

---

## Template Empty Section Hiding

### Rule
Templates **never render a section title if that section has no data**. This applies to both built-in sections and custom sections.

### Implementation (already enforced in all templates)
- `{experience.length > 0 && <Section title="Experience">…</Section>}`
- `{skills.length > 0 && <Section title="Skills">…</Section>}`
- `{projects.length > 0 && <Section title="Projects">…</Section>}`
- `{certifications.length > 0 && <Section title="Certifications">…</Section>}`
- `{education.length > 0 && <Section title="Education">…</Section>}`
- Contact fields (email, phone, LinkedIn, GitHub, portfolio): filtered individually — only rendered if non-empty
- Custom sections: hidden if content/items are all empty

### Why
When a user uploads a resume that doesn't have certain sections (e.g. no projects), the template must not show an empty "PROJECTS" heading. The rendered resume should look clean with only the sections that actually have content.

---

## AI Enhancement — No Fake Metrics

### Rule
The AI enhancement feature **must never invent, fabricate, or add numbers, percentages, metrics, dates, company names, tools, or any other facts** that are not already present in the user's existing resume content.

### Implementation (enforced in `aiEnhance.js` system prompt)
The Groq API system prompt explicitly states:
> "CRITICAL: Do NOT invent, fabricate, or add any numbers, percentages, metrics, dates, company names, tools, or facts that are not already present in the existing content. Only rewrite and strengthen the language using information that is already there. If no metrics exist in the original, do not add any."

### Why
Fabricated metrics (e.g. "increased revenue by 30%", "managed team of 15") are dishonest and could cause serious problems for users in interviews. The AI should improve phrasing and clarity, not invent credentials.

### What AI CAN do
- Rewrite bullets with stronger action verbs
- Improve sentence structure and clarity
- Make language more concise and ATS-friendly
- Reorganize existing content for better impact

### What AI CANNOT do
- Add any number or percentage not in the original
- Add skill names or tools not mentioned
- Add job titles, company names, or dates not in the original
- Invent quantified achievements

---

## Custom Sections

### Overview
Users can add unlimited custom sections to their resume — for anything not covered by built-in sections: Volunteer Work, Publications, Awards, Languages, Interests, Open Source Contributions, etc. Each custom section appears in the sidebar, can be edited independently, and renders in the resume template.

### Data Schema (in `ResumeContext.initialResumeData`)
```javascript
customSections: [
  {
    id: "uuid",
    title: "Custom Section",   // user-defined section name
    type: "text",              // "text" (paragraph) | "bullets" (bullet list)
    content: "",               // used when type === "text"
    items: [""],               // used when type === "bullets"
  }
]
```

### Settings Integration
When a custom section is created, its `id` is appended to `settings.sectionOrder`. This allows future drag-to-reorder support for both built-in and custom sections. When a custom section is deleted, its `id` is removed from `sectionOrder`.

### Context Functions
```javascript
addCustomSection()               → creates section, appends id to sectionOrder, returns new id
removeCustomSection(id)          → removes section + removes id from sectionOrder
updateCustomSection(id, field, value)
addCustomSectionItem(id)         → appends '' to items[]
updateCustomSectionItem(id, index, value)
removeCustomSectionItem(id, index) → keeps at least 1 item
```

### Sidebar (Sidebar.jsx)
- Custom sections appear below built-in sections under a "Custom Sections" subheading
- Each entry shows the LayoutTemplate icon + section title + completion dot (green if has content)
- "Add Custom Section" button at the bottom (dashed border, blue text)
- Active custom section is highlighted same as built-in sections
- `onAddCustomSection` prop: callback to Builder which calls `addCustomSection()` and navigates to the new section

### Builder Routing
- `activeSection` can be `"custom-{id}"` for custom section forms
- Builder renders `<CustomSectionForm sectionId={id} onDeleted={() => setActiveSection('personal')} />` for custom sections
- Breadcrumb shows the custom section's title (not a generic label)
- Built-in prev/next navigation only moves through built-in SECTIONS array

### CustomSectionForm.jsx
Form fields:
1. **Section Title** — text input, placeholder: "e.g. Volunteer Work, Publications, Languages…"
2. **Content Format toggle** — "Paragraph" | "Bullet List" (Paragraph = textarea, Bullets = dynamic list)
3. **Content / Bullet Items** — edit area based on selected format
4. **Remove Section** button with confirmation (navigates back to Personal Info on delete)
5. Helper text: "This section will appear at the bottom of your resume."

### Template Rendering (CustomSections.jsx)
- Shared component imported by all 11 templates
- Reads `customSections` and `accentColor` from `useResume()` context — no props needed
- Renders only sections that have content (hides empty custom sections)
- Uses the same section header style as built-in sections (uppercase, accent color, decorative line)
- Renders bullets as `<ul>` and paragraphs as `<p>` with matching template typography
- Placement: appended at the bottom of the main content area in each template

### User Flow
1. User clicks "Add Custom Section" in sidebar → new section created → navigated to its form
2. User sets a title (e.g. "Volunteer Work") and chooses Paragraph or Bullet List
3. User types content → live preview updates immediately
4. Section appears in the sidebar with a completion dot when it has content
5. User can add multiple custom sections
6. To delete: click "Remove Section" in the form → confirm → section removed from resume + sidebar

---

## References Page (Separate Document — Industry Standard)

### Overview
Based on career expert recommendations (Zety, Enhancv, Resume.co, KickResume), references should NOT appear on the main resume. The app generates a separate, design-matched References Page that users can download alongside their resume.

### Why Separate Page?
- Career experts agree: references waste valuable resume space
- Employers only check references at the final hiring stage
- A matching separate page looks more professional
- Keeps the resume focused on skills, experience, and achievements

### Data Schema (add to ResumeContext initialResumeData)
```javascript
references: [
  {
    id: "uuid",
    name: "",
    title: "",
    company: "",
    phone: "",
    email: "",
    relationship: "",   // "Direct Manager" | "Colleague" | "Senior Leader" | "Client" | "Professor" | "Other"
    note: ""            // Optional: brief note on what they can speak to
  }
],
settings: {
  ...existing,
  showReferences: false,    // Toggle: include references page in PDF export
  referencesStyle: "match"  // "match" = mirrors resume template | "simple" = clean standalone
}
```

### UI Design
- New section "References" in Sidebar after Certifications (Users icon)
- ReferencesForm.jsx in src/components/Forms/
- Add/remove entries with drag-and-drop reorder
- Fields: Full Name, Job Title, Company, Phone, Email, Relationship (dropdown), Note (optional textarea)
- Toggle switch at top of form: "Include References Page" (off by default)
- Helper text: "Career experts recommend providing references as a separate page, not on your resume. Enable this to generate a matching references page."
- When toggle is ON: preview shows references as a second page below the resume with a page-break indicator

### References Page Template
- Header matches selected resume template (same name, contact info, styling, accent color)
- Page title: "PROFESSIONAL REFERENCES"
- Each entry shows:
  - **Name** — Title at Company
  - Phone | Email
  - *Relationship: Direct Manager* (italic)
  - Optional note in smaller text below
- Layout mirrors the resume template's fonts, colors, and accent style
- A4 sized page, same dimensions as the resume

### PDF Export Behavior
- `showReferences` OFF: PDF contains only the resume (1–2 pages)
- `showReferences` ON: PDF appends the references page as the final page
- Download button label changes to "Download Resume + References" when ON
- Secondary button: "Download References Only"

---

## GitHub Profile Link

### Data Schema Update
```javascript
personalInfo: {
  ...existing fields,
  github: ""    // e.g., "github.com/Snehal-Kanzariya"
}
```

### UI
- Add "GitHub URL" input in PersonalInfoForm.jsx between LinkedIn and Portfolio fields
- Github icon (lucide-react) as input prefix icon
- Placeholder: "github.com/username"
- All 11 templates: show GitHub icon + link in contact/header area alongside LinkedIn and Portfolio
- Only render if the field is not empty
- 2-column templates (Modern, Creative, Tech, Bold): show in sidebar contact section
- Single-column templates: show in header contact row

---

## PDF Download Fix (UI Mismatch)

### Problem
Downloaded PDF can render differently from the in-app preview due to CSS transform scaling and font loading timing.

### Solution
1. Use the existing hidden off-screen div (`position: fixed, left: -9999px`) at exact A4 dimensions (794px wide, height auto)
2. Render the selected template into it with NO CSS transforms or scaling
3. Await `document.fonts.ready` before capturing to ensure custom fonts are loaded
4. Capture with `html2canvas` at `scale: 2` — this hidden div is the capture target
5. Result: PDF matches preview exactly since both render the same template component at the same size

### Implementation Notes (pdfExport.js)
- `downloadResumePDF(elementId, fileName)` already targets the hidden div by ID
- Add `await document.fonts.ready` before the `html2canvas` call
- Pass `windowHeight: element.scrollHeight` and `height: element.scrollHeight` to capture full content
- Multi-page split: already implemented (canvas sliced into A4 chunks)

---

## Multi-Page Resume Support

### Rules
- Default: optimize for 1 page
- If content exceeds 1 A4 page (1123px at 96 dpi), flow naturally to page 2
- Show page-break indicator: dashed line with "Page 2" label in preview between pages
- Page count badge in preview toolbar: "1 page" or "2 pages"
- If content is between 1.0–1.5 pages, show suggestion toast: "Your resume is between pages. Consider trimming to 1 page or filling to 2 pages."
- PDF export captures full content across all pages (already implemented in pdfExport.js)

### A4Container Updates
- Remove fixed `height: 1123px` — use `minHeight: 1123px` so short resumes still look right
- Remove `overflow: hidden` — let content flow past 1 page
- Render a dashed page-break indicator line at every 1123px interval
- Each page section has proper padding so content doesn't sit on the divider

---

## Watermark (Free Version Branding)

### Implementation
- Free version only: small watermark on each exported PDF page (NOT visible in preview)
- Text: "Built with ResumeAI" — bottom-right corner of every page
- Style: 8px font, color #B0B0B0
- Added in `pdfExport.js` after all pages are rendered, before `pdf.save()`
- Does NOT affect the Print output — only the downloaded PDF file

### Code (pdfExport.js)
```javascript
// Add after all pages are added to PDF, before pdf.save()
if (!isPremium) {
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(176, 176, 176);
    pdf.text('Built with ResumeAI', pdfWidth - 42, pdfHeight - 5);
  }
}
```

### Premium Toggle
- `settings.isPremium`: false (default)
- If true: skip watermark entirely
- Show "Remove watermark — Upgrade to Pro" link near download button
- Future: Razorpay/Stripe payment integration

---

## Future Features (Roadmap — Do Not Build Now)

### Job URL Resume Optimizer (v2)
- User pastes a job posting URL
- App fetches and parses the job description
- AI compares job requirements vs current resume content
- Shows "Match Score" percentage
- AI suggests specific changes: missing keywords, skills to highlight, experience to emphasize
- Requires: serverless function for URL fetching + advanced AI prompting

### LinkedIn Profile Import (v2)
- User uploads their LinkedIn PDF export (available from LinkedIn settings → "Save to PDF")
- Parse using the existing PDF parser
- Map LinkedIn sections to resume fields automatically
- Workaround to guide users: "Export your LinkedIn profile as PDF and upload it using the Resume Upload feature"

### Additional Roadmap
- Resume versioning (save multiple named versions per job application)
- Cover letter generator (AI generates matching cover letter)
- ATS score checker (analyze resume against ATS criteria)
- Resume sharing via unique public link
- Multi-language resume support

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
