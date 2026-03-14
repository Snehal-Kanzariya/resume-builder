import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { saveToStorage } from '../utils/storage';

const generateId = () => Math.random().toString(36).slice(2, 10);

const initialResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    summary: '',
  },

  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
  references: [],

  settings: {
    selectedTemplate: 'modern',
    accentColor: '#03153a',
    fontSize: 'medium',
    sectionOrder: ['experience', 'education', 'skills', 'projects', 'certifications'],
    showReferences: false,
  },
};

export const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('resumeData');
      if (!saved) return initialResumeData;
      const parsed = JSON.parse(saved);
      return {
        ...initialResumeData,
        ...parsed,
        personalInfo: { ...initialResumeData.personalInfo, ...(parsed.personalInfo || {}) },
        settings: { ...initialResumeData.settings, ...(parsed.settings || {}) },
        customSections: parsed.customSections || [],
      references: parsed.references || [],
      };
    } catch {
      return initialResumeData;
    }
  });

  // ── AI state ─────────────────────────────────────────────────────────────
  const [aiResumeData, setAiResumeData] = useState(null);

  const acceptAllAi = useCallback(() => {
    if (!aiResumeData) return;
    setResumeData(prev => ({ ...aiResumeData, settings: prev.settings }));
    setAiResumeData(null);
  }, [aiResumeData]);

  const mergeAiSections = useCallback((selectedSections) => {
    if (!aiResumeData) return;
    setResumeData(prev => {
      const updated = { ...prev };
      for (const section of selectedSections) {
        if (aiResumeData[section] !== undefined) {
          updated[section] = aiResumeData[section];
        }
      }
      return updated;
    });
    setAiResumeData(null);
  }, [aiResumeData]);

  const clearAiData = useCallback(() => setAiResumeData(null), []);

  // ── Section-level update (used by per-section AI accept) ─────────────────
  const updateSection = useCallback((sectionName, data) => {
    setResumeData(prev => ({ ...prev, [sectionName]: data }));
  }, []);

  // ── Personal Info ────────────────────────────────────────────────────────────
  const updatePersonalInfo = useCallback((field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  // ── Experience ───────────────────────────────────────────────────────────────
  const addExperience = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: generateId(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          location: '',
          bullets: [''],
        },
      ],
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id),
    }));
  }, []);

  const updateExperience = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  }, []);

  const addExperienceBullet = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e =>
        e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e
      ),
    }));
  }, []);

  const updateExperienceBullet = useCallback((id, index, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => {
        if (e.id !== id) return e;
        const bullets = [...e.bullets];
        bullets[index] = value;
        return { ...e, bullets };
      }),
    }));
  }, []);

  const removeExperienceBullet = useCallback((id, index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(e => {
        if (e.id !== id) return e;
        const bullets = e.bullets.filter((_, i) => i !== index);
        return { ...e, bullets: bullets.length ? bullets : [''] };
      }),
    }));
  }, []);

  // ── Education ────────────────────────────────────────────────────────────────
  const addEducation = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: generateId(),
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          achievements: '',
        },
      ],
    }));
  }, []);

  const removeEducation = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id),
    }));
  }, []);

  const updateEducation = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(e =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    }));
  }, []);

  // ── Skills ───────────────────────────────────────────────────────────────────
  const addSkillCategory = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: generateId(), category: '', items: [] },
      ],
    }));
  }, []);

  const removeSkillCategory = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  }, []);

  const updateSkillCategory = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  }, []);

  // ── Projects ─────────────────────────────────────────────────────────────────
  const addProject = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: generateId(),
          name: '',
          description: '',
          technologies: '',
          liveLink: '',
          githubLink: '',
        },
      ],
    }));
  }, []);

  const removeProject = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const updateProject = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  }, []);

  // ── Certifications ───────────────────────────────────────────────────────────
  const addCertification = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: generateId(),
          name: '',
          issuer: '',
          date: '',
          link: '',
        },
      ],
    }));
  }, []);

  const removeCertification = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  }, []);

  const updateCertification = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  }, []);

  // ── References ───────────────────────────────────────────────────────────────
  const addReference = useCallback(() => {
    setResumeData(prev => ({
      ...prev,
      references: [
        ...(prev.references || []),
        {
          id: generateId(),
          name: '',
          title: '',
          company: '',
          phone: '',
          email: '',
          relationship: '',
          note: '',
        },
      ],
    }));
  }, []);

  const removeReference = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      references: (prev.references || []).filter(r => r.id !== id),
    }));
  }, []);

  const updateReference = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      references: (prev.references || []).map(r =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }));
  }, []);

  const reorderReferences = useCallback((from, to) => {
    setResumeData(prev => ({ ...prev, references: reorderArray(prev.references || [], from, to) }));
  }, []);

  // ── Reorder helpers ──────────────────────────────────────────────────────────
  function reorderArray(arr, from, to) {
    const next = [...arr];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  }

  const reorderExperience = useCallback((from, to) => {
    setResumeData(prev => ({ ...prev, experience: reorderArray(prev.experience, from, to) }));
  }, []);

  const reorderEducation = useCallback((from, to) => {
    setResumeData(prev => ({ ...prev, education: reorderArray(prev.education, from, to) }));
  }, []);

  const reorderProjects = useCallback((from, to) => {
    setResumeData(prev => ({ ...prev, projects: reorderArray(prev.projects, from, to) }));
  }, []);

  const reorderCertifications = useCallback((from, to) => {
    setResumeData(prev => ({ ...prev, certifications: reorderArray(prev.certifications, from, to) }));
  }, []);

  const reorderSkillCategory = useCallback((from, to) => {
    setResumeData(prev => ({ ...prev, skills: reorderArray(prev.skills, from, to) }));
  }, []);

  // ── Settings ─────────────────────────────────────────────────────────────────
  const updateSettings = useCallback((field, value) => {
    setResumeData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }));
  }, []);

  const reorderSections = useCallback((newOrder) => {
    setResumeData(prev => ({
      ...prev,
      settings: { ...prev.settings, sectionOrder: newOrder },
    }));
  }, []);

  // ── Auto-save ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => saveToStorage(resumeData), 5000);
    return () => clearTimeout(timer);
  }, [resumeData]);

  // ── Utilities ────────────────────────────────────────────────────────────────
  const loadSampleData = useCallback((sampleData) => {
    setResumeData(prev => ({ ...sampleData, settings: prev.settings }));
  }, []);

  const resetResume = useCallback(() => {
    setResumeData(initialResumeData);
    localStorage.removeItem('resumeData');
  }, []);

  // ── Custom Sections ──────────────────────────────────────────────────────────
  // Returns the new section's ID so the caller can navigate to it immediately.
  const reorderCustomSections = useCallback((from, to) => {
    setResumeData(prev => ({
      ...prev,
      customSections: reorderArray(prev.customSections || [], from, to),
    }));
  }, []);

  const reorderCustomSectionItems = useCallback((id, from, to) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => {
        if (s.id !== id) return s;
        const items = [...(s.items || [])];
        const [item] = items.splice(from, 1);
        items.splice(to, 0, item);
        return { ...s, items };
      }),
    }));
  }, []);

  const addCustomSection = useCallback(() => {
    const id = generateId();
    setResumeData(prev => ({
      ...prev,
      customSections: [
        ...(prev.customSections || []),
        { id, title: 'Custom Section', type: 'text', content: '', items: [''], afterSection: 'certifications' },
      ],
      settings: {
        ...prev.settings,
        sectionOrder: [...(prev.settings?.sectionOrder || []), id],
      },
    }));
    return id;
  }, []);

  const removeCustomSection = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter(s => s.id !== id),
      settings: {
        ...prev.settings,
        sectionOrder: (prev.settings?.sectionOrder || []).filter(k => k !== id),
      },
    }));
  }, []);

  const updateCustomSection = useCallback((id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  }, []);

  const addCustomSectionItem = useCallback((id) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s =>
        s.id === id ? { ...s, items: [...(s.items || []), ''] } : s
      ),
    }));
  }, []);

  const updateCustomSectionItem = useCallback((id, index, value) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => {
        if (s.id !== id) return s;
        const items = [...(s.items || [])];
        items[index] = value;
        return { ...s, items };
      }),
    }));
  }, []);

  const removeCustomSectionItem = useCallback((id, index) => {
    setResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => {
        if (s.id !== id) return s;
        const items = s.items.filter((_, i) => i !== index);
        return { ...s, items: items.length ? items : [''] };
      }),
    }));
  }, []);

  // ── Import from upload ───────────────────────────────────────────────────────
  // SAFE import: existing non-empty data is NEVER overwritten. The parsed
  // upload data only fills fields/sections that are currently empty. This
  // ensures users never lose data they have already entered manually.
  const importResumeData = useCallback((parsedData) => {
    setResumeData(prev => {
      // For each personalInfo field: keep existing non-empty value; fill from
      // upload only when the builder field is empty.
      const personalInfo = Object.fromEntries(
        Object.keys(initialResumeData.personalInfo).map(key => {
          const existing = prev?.personalInfo?.[key];
          const fromFile = parsedData?.personalInfo?.[key];
          return [key, existing?.trim?.() ? existing : (fromFile || '')];
        })
      );

      // For array sections: keep existing entries if any; use parsed only when
      // the section is currently empty.
      const pickArray = (existing, parsed, shape) =>
        (existing?.length > 0 ? existing : (parsed || [])).map(item => ({ ...shape(item) }));

      return {
        ...prev,
        personalInfo,
        experience: pickArray(prev?.experience, parsedData?.experience, exp => ({
          id:        exp.id        || generateId(),
          company:   exp.company   || '',
          position:  exp.position  || '',
          startDate: exp.startDate || '',
          endDate:   exp.endDate   || '',
          current:   exp.current   || false,
          location:  exp.location  || '',
          bullets:   Array.isArray(exp.bullets) && exp.bullets.length ? exp.bullets.map(String) : [''],
        })),
        education: pickArray(prev?.education, parsedData?.education, edu => ({
          id:           edu.id           || generateId(),
          school:       edu.school       || '',
          degree:       edu.degree       || '',
          field:        edu.field        || '',
          startDate:    edu.startDate    || '',
          endDate:      edu.endDate      || '',
          gpa:          edu.gpa          || '',
          achievements: edu.achievements || '',
        })),
        skills: pickArray(prev?.skills, parsedData?.skills, sk => ({
          id:       sk.id       || generateId(),
          category: sk.category || '',
          items:    Array.isArray(sk.items) ? sk.items.map(String) : [],
        })),
        projects: pickArray(prev?.projects, parsedData?.projects, pr => ({
          id:           pr.id           || generateId(),
          name:         pr.name         || '',
          description:  pr.description  || '',
          technologies: pr.technologies || '',
          liveLink:     pr.liveLink     || '',
          githubLink:   pr.githubLink   || '',
        })),
        certifications: pickArray(prev?.certifications, parsedData?.certifications, c => ({
          id:     c.id     || generateId(),
          name:   c.name   || '',
          issuer: c.issuer || '',
          date:   c.date   || '',
          link:   c.link   || '',
        })),
        customSections: prev?.customSections || [],
        settings: prev?.settings || initialResumeData.settings,
      };
    });
  }, []);

  // Replace full resume data (used after AI interview answers are applied).
  // Preserves existing settings and generates fresh IDs for array items.
  const setFullResumeData = useCallback((data) => {
    setResumeData(prev => ({
      ...initialResumeData,
      ...data,
      personalInfo: { ...initialResumeData.personalInfo, ...(data.personalInfo || {}) },
      settings: { ...prev.settings, ...(data.settings || {}) },
      experience:     (data.experience     || []).map(e => ({ ...e, id: e.id || generateId() })),
      education:      (data.education      || []).map(e => ({ ...e, id: e.id || generateId() })),
      skills:         (data.skills         || []).map(s => ({ ...s, id: s.id || generateId() })),
      projects:       (data.projects       || []).map(p => ({ ...p, id: p.id || generateId() })),
      certifications: (data.certifications || []).map(c => ({ ...c, id: c.id || generateId() })),
    }));
  }, []);

  const value = {
    resumeData,
    setResumeData,

    // Personal Info
    updatePersonalInfo,

    // Experience
    addExperience,
    removeExperience,
    updateExperience,
    addExperienceBullet,
    updateExperienceBullet,
    removeExperienceBullet,

    // Education
    addEducation,
    removeEducation,
    updateEducation,

    // Skills
    addSkillCategory,
    removeSkillCategory,
    updateSkillCategory,

    // Projects
    addProject,
    removeProject,
    updateProject,

    // Certifications
    addCertification,
    removeCertification,
    updateCertification,

    // References
    addReference,
    removeReference,
    updateReference,
    reorderReferences,

    // Settings
    updateSettings,
    reorderSections,

    // Reorder
    reorderExperience,
    reorderEducation,
    reorderProjects,
    reorderCertifications,
    reorderSkillCategory,

    // Custom Sections
    addCustomSection,
    removeCustomSection,
    updateCustomSection,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
    reorderCustomSections,
    reorderCustomSectionItems,

    // Utilities
    loadSampleData,
    resetResume,
    importResumeData,
    setFullResumeData,

    // AI
    updateSection,
    aiResumeData,
    setAiResumeData,
    acceptAllAi,
    mergeAiSections,
    clearAiData,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
}
