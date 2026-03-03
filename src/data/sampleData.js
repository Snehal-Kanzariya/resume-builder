export const sampleData = {
  personalInfo: {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Frontend Engineer',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    portfolio: 'alexjohnson.dev',
    summary:
      'Passionate frontend engineer with 6+ years building performant, accessible web applications. Experienced in React, TypeScript, and design systems. Led teams of 4–8 engineers and shipped products used by millions.',
  },

  experience: [
    {
      id: 'exp1',
      company: 'TechCorp Inc.',
      position: 'Senior Frontend Engineer',
      startDate: '2022-03',
      endDate: '',
      current: true,
      location: 'San Francisco, CA',
      bullets: [
        'Led redesign of core dashboard, reducing load time by 40% and improving NPS by 18 points.',
        'Architected a shared component library adopted across 5 product teams.',
        'Mentored 3 junior engineers, conducting weekly code reviews and 1-on-1s.',
        'Collaborated with product and design to ship 12 major features in 2023.',
      ],
    },
    {
      id: 'exp2',
      company: 'StartupXYZ',
      position: 'Frontend Engineer',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      location: 'Remote',
      bullets: [
        "Built the company's main React SPA from scratch, scaling to 50k DAU.",
        'Integrated Stripe payments and reduced checkout drop-off by 25%.',
        'Improved Lighthouse performance score from 54 to 91.',
      ],
    },
  ],

  education: [
    {
      id: 'edu1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015-08',
      endDate: '2019-05',
      gpa: '3.8',
      achievements: 'Dean\'s List 2017–2019. Senior capstone: real-time collaborative code editor.',
    },
  ],

  skills: [
    {
      id: 'sk1',
      category: 'Languages',
      items: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Python'],
    },
    {
      id: 'sk2',
      category: 'Frameworks & Libraries',
      items: ['React', 'Next.js', 'Tailwind CSS', 'Redux', 'React Query'],
    },
    {
      id: 'sk3',
      category: 'Tools & Platforms',
      items: ['Git', 'Vite', 'Webpack', 'Figma', 'AWS', 'Vercel'],
    },
  ],

  projects: [
    {
      id: 'proj1',
      name: 'OpenResume',
      description:
        'An open-source resume builder supporting multiple templates and PDF export. Built with React and Tailwind CSS.',
      technologies: 'React, Tailwind CSS, jsPDF, Vite',
      liveLink: 'openresume.dev',
      githubLink: 'github.com/alexjohnson/openresume',
    },
    {
      id: 'proj2',
      name: 'DevMetrics Dashboard',
      description:
        'Real-time engineering metrics dashboard aggregating GitHub, Jira, and PagerDuty data for engineering managers.',
      technologies: 'Next.js, TypeScript, Recharts, PostgreSQL',
      liveLink: '',
      githubLink: 'github.com/alexjohnson/devmetrics',
    },
  ],

  certifications: [
    {
      id: 'cert1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023-04',
      link: 'credly.com/badges/sample',
    },
    {
      id: 'cert2',
      name: 'Meta Frontend Developer Certificate',
      issuer: 'Meta / Coursera',
      date: '2022-01',
      link: '',
    },
  ],

  settings: {
    selectedTemplate: 'modern',
    accentColor: '#2563eb',
    fontSize: 'medium',
    sectionOrder: ['experience', 'education', 'skills', 'projects', 'certifications'],
  },
};
