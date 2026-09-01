export type CVLink = {
  label: string;
  url: string;
};

export type CVExperience = {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  summary?: string;
  highlights: string[];
};

export type CVEducation = {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  completedAt: string;
  thesisOrProject?: CVLink;
  thesisOrProjectLabel?: string;
  advisors?: CVLink[];
  advisorLabel?: string;
  award?: string;
};

export type CVCredential = {
  id: string;
  issuer: string;
  title: string;
  completedAt?: string;
  description?: string;
  url?: string;
  featured: boolean;
};

export type CVSkillGroup = {
  id: string;
  title: string;
  skills: string[];
};

export type CVLanguage = {
  name: string;
  proficiency: string;
};

export type CVResearchProject = {
  id: string;
  title: string;
  organization: string;
  location: string;
  startDate?: string;
  endDate?: string;
  description: string;
  url?: string;
};

export type CVPublication = {
  id: string;
  citation: string;
  year: string;
  type:
    | 'thesis'
    | 'software'
    | 'article'
    | 'report'
    | 'other';
  url?: string;
};

export type CVPresentation = {
  id: string;
  title: string;
  organization: string;
  event: string;
  location?: string;
  date: string;
  type:
    | 'conference-presentation'
    | 'poster'
    | 'lightning-talk'
    | 'keynote'
    | 'workshop'
    | 'other';
  description?: string;
  url?: string;
};

export type CVTeaching = {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
};

export type CVLeadership = {
  id: string;
  role: string;
  organization: string;
  period: string;
  description?: string;
};

export type CVProfile = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  researchInterests: string[];

  links: {
    website?: CVLink;
    linkedin?: CVLink;
    github?: CVLink;
    youtube?: CVLink;
    instagram?: CVLink;
    orcid?: CVLink;
    email?: CVLink;
  };
};

export type CVData = {
  lastUpdated: string;

  profile: CVProfile;

  experience: CVExperience[];

  education: CVEducation[];

  researchProjects: CVResearchProject[];

  publications: CVPublication[];

  presentations: CVPresentation[];

  teaching: CVTeaching[];

  leadership: CVLeadership[];

  credentials: CVCredential[];

  skillGroups: CVSkillGroup[];

  languages: CVLanguage[];
};