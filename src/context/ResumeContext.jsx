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
      return saved ? JSON.parse(saved) : initialResumeData;
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
