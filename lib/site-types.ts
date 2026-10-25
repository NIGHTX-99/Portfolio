export type TimelineEntry = {
  role: string;
  organization: string;
  period: string;
};

export type SiteConfig = {
  hero: {
    greeting: string;
    nameLine1: string;
    nameLine2: string;
    backgroundImage: string;
    revealSeed: number;
  };
  contact: {
    email: string;
    cvUrl: string;
  };
  social: {
    github: string;
    instagram: string;
    linkedin: string;
  };
  about: {
    greeting: string;
    highlightName: string;
    bio: string;
    badgeImage: string;
    experienceLeft: TimelineEntry[];
    experienceRight: TimelineEntry[];
  };
};
