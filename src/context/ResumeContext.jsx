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
    summary: '',
  },

  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],

  settings: {
    selectedTemplate: 'modern',
    accentColor: '#2563eb',
    fontSize: 'medium',
    sectionOrder: ['experience', 'education', 'skills', 'projects', 'certifications'],
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

  // ── Import from upload ───────────────────────────────────────────────────────
  // Merges parsed upload data, generating fresh IDs for every array item.
  const importResumeData = useCallback((parsedData) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...initialResumeData.personalInfo,
        ...(parsedData.personalInfo || {}),
      },
      experience: (parsedData.experience || []).map(e => ({
        id: generateId(),
        company: e.company || '',
        position: e.position || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        current: e.current || false,
        location: e.location || '',
        bullets: Array.isArray(e.bullets) && e.bullets.length ? e.bullets : [''],
      })),
      education: (parsedData.education || []).map(e => ({
        id: generateId(),
        school: e.school || '',
        degree: e.degree || '',
        field: e.field || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        gpa: e.gpa || '',
        achievements: e.achievements || '',
      })),
      skills: (parsedData.skills || []).map(s => ({
        id: generateId(),
        category: s.category || '',
        items: Array.isArray(s.items) ? s.items : [],
      })),
      projects: (parsedData.projects || []).map(p => ({
        id: generateId(),
        name: p.name || '',
        description: p.description || '',
        technologies: p.technologies || '',
        liveLink: p.liveLink || '',
        githubLink: p.githubLink || '',
      })),
      certifications: (parsedData.certifications || []).map(c => ({
        id: generateId(),
        name: c.name || '',
        issuer: c.issuer || '',
        date: c.date || '',
        link: c.link || '',
      })),
    }));
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

    // Settings
    updateSettings,
    reorderSections,

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
