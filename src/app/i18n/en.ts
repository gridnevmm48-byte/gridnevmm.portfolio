/**
 * Every user-visible string on the site, in English.
 *
 * `ru.ts` mirrors this shape exactly (it is typed as `Dict`), so adding a key
 * here is a type error until the Russian copy is added too.
 *
 * House style for the copy itself: no trailing period on the last sentence of a
 * block, and no em dashes — split the sentence or use a colon instead.
 */
export const en = {
  nav: {
    /** Jump links to the sections of the one page. */
    work: "WORK",
    about: "ABOUT",
    /** Opens the résumé image in a modal rather than navigating away. */
    cv: "CV",
    li: "LIN",
    liHref: "https://www.linkedin.com/in/gridnevmm/",
    tg: "TG",
    tgHref: "https://t.me/grid1max",
    mailHref: "https://mail.google.com/mail/?view=cm&fs=1&to=gridnevmm48@gmail.com",
  },

  hero: {
    tagline: "Designing product interfaces and digital experiences with AI",
  },

  footer: {
    rights: "Designed by me Built with AI Maksim Gridnev",
  },

  /** Browser tab title. Has to match the static <title> in index.html. */
  titles: {
    site: "Maksim Gridnev, AI-Native Product Designer",
  },

  common: {
    contactMe: "contact me",
    viewProject: "view project",
    goToWeb: "go to web",
    backToTop: "Back to top",
    close: "Close",
    email: "gridnevmm48@gmail.com",
  },

  sections: {
    aboutMe: "About me",
    work: "Work",
    skills: "Core skills",
    education: "Education",
    languages: "Languages",
  },

  /** Fixed labels inside a case modal, above the copy that varies per project. */
  caseUi: {
    dateWork: "Date work",
    role: "My Role",
    projectType: "Project Type",
    platform: "Platform",
    problem: "The problem",
    whatIDid: "What I did",
    results: "The results",
    cvTitle: "Resume",
    cvDownload: "download",
    cvAlt: "Resume of Maksim Gridnev",
  },

  about: {
    name: "Maksim Gridnev",
    subtitle: "AI-Native Product Designer",
    photoAlt: "Maksim Gridnev",
    text: `I'm a Product Designer focused on AI-Native & AI-First design, working across web and digital products

My experience covers UI/UX, product design, visual design and building interfaces with AI tools

I enjoy taking an idea, figuring out how it should work and turning it into a clear and engaging experience

I've worked on different types of products, from esports and gaming platforms to websites for local businesses, which gives me a versatile approach to design and helps me adapt to different challenges and teams

Before moving into design, I worked in sales and team management, so I also understand the people and business side behind the products I design`,
  },

  skills: [
    {
      title: "Product & UX",
      items: [
        "Product Design",
        "UI/UX Design",
        "UX Research",
        "User Flows",
        "Information Architecture",
        "Web Design",
        "Design Systems",
      ],
    },
    {
      title: "AI & Creative",
      items: [
        "AI-Native Design",
        "AI Prototyping",
        "Visual Exploration",
        "Claude Code",
        "Figma Make",
        "Phygital+",
        "Kling",
        "Google Omni",
      ],
    },
    {
      title: "Tools",
      items: ["Figma", "Miro", "Notion", "Jira", "GitHub", "21st.dev"],
    },
  ],

  education: ["UpRock Design School", "Google UI/UX Design"],

  languages: [
    { name: "English", level: "Pre-Intermediate" },
    { name: "Russian", level: "Native" },
  ],

  /**
   * The three project cards. `desc` doubles as the subtitle at the top of the
   * matching case modal, so the card and the modal never drift apart.
   */
  work: {
    respawn: {
      name: "Respawn Esports",
      role: "AI Native Product Design",
      period: "February 2026 – August 2026",
      desc: "Esports organization and digital platform focused on gaming, community and events",
    },

    queen: {
      name: "Queen Interactive Games",
      role: "Product designer",
      period: "June 2025 – January 2026",
      desc: "B2B platform for the iGaming industry, focused on payments, bonuses, retention and user acquisition",
    },

    prowrap: {
      name: "Pro Wrap",
      role: "AI Native Product Design",
      period: "Independent Project 2026",
      desc: "Designed and built a website for a Limassol automotive service to attract new customers and showcase its services and work",
    },

    sales: {
      name: "Additional Work Experience",
      role: "Head of Sales",
      period: "Oct 2023 – Apr 2025",
      desc: "Head of Sales in Educational platform focused on professional development and online learning",
    },
  },

  /**
   * Case-study copy, shown only inside a modal.
   *
   * `notes` are the captions between screenshot groups; their keys line up with
   * the `note` blocks in `data/cases.ts`. `results` is optional: ProWrap has no
   * figures to show, so the block is left out for that project entirely.
   */
  cases: {
    respawn: {
      title: "RESPAWN ESPORTS",
      meta: {
        dateWork: "Feb 2026 – Aug 2026",
        role: "AI Native Product Designer",
        projectType: "Website & Admin Console",
        platform: "Web",
      },
      problem:
        "The website needed a more modern and premium experience that better represented the organization and made it easier for users to interact with its services",
      whatIDid:
        "I redesigned the website and key user flows, created an admin console for bookings and users, and unified the experience with a new component system",
      results: [
        { value: "5", label: "User Rating" },
        { value: "+12%", label: "Total Bookings" },
        { value: "+10%", label: "Revenue Growth" },
        { value: "+18%", label: "Repeat Visits" },
      ],
      notes: {
        previous: {
          title: "Previous Website",
          text: "The previous website did not fully reflect Respawn's premium positioning or the experience offered by the club It focused mainly on zones, hardware and pricing, while leaving important questions customers had before visiting unanswered",
        },
      },
    },

    queen: {
      title: "QUEEN GAMES",
      meta: {
        dateWork: "Jun 2025 – Jan 2026",
        role: "Product Designer",
        projectType: "B2B Platform & Admin Panel",
        platform: "Web-App",
      },
      problem:
        "The platform needed to improve both customer-facing experiences and internal workflows Acquisition and loyalty features had to be easier to understand and use, while internal processes required a more structured and efficient experience",
      whatIDid:
        "I designed user journeys across acquisition, bonus and VIP programs, cashback and email campaigns, improved internal workflows for KYC and user management, and contributed to the launch of a crypto mobile app",
      results: [
        { value: "+10%", label: "User Retention" },
        { value: "+8%", label: "Average Order Value" },
        { value: "+5%", label: "New User Acquisition" },
        { value: "−43%", label: "Verification Time" },
      ],
      notes: {
        designSystem: {
          title: "Design System & Workflow",
          text: "Built and maintained a scalable design system with reusable components and consistent interaction patterns across the product Structured Figma files and workflows to improve collaboration and make new product experiences faster to design",
        },
        crypto: {
          title: "Crypto Mobile App",
          text: "Designed the onboarding, portfolio and swap flows for a crypto mobile app, so a first-time user could go from sign-up to a first trade without leaving the main screen",
        },
      },
    },

    prowrap: {
      title: "PROWRAP",
      meta: {
        dateWork: "2026",
        role: "AI Native Product Designer",
        projectType: "Website Redesign",
        platform: "Web",
      },
      problem:
        "The existing website did not reflect the premium positioning of the studio and made it difficult for customers to quickly understand the services, pricing and booking process",
      whatIDid:
        "I redesigned the website around the customer journey, improving the presentation of services, introducing transparent pricing and simplifying the path to booking",
      /** Empty on purpose: this project has no figures to report. */
      results: [] as { value: string; label: string }[],
      notes: {
        previous: {
          title: "Previous Website",
          text: "The previous website provided the basic information but lacked a clear visual hierarchy and a strong path from exploring the services to taking action",
        },
        build: {
          title: "From Design to Product",
          text: "Took the redesigned experience from concept to a working website, iterating between design and implementation throughout the process",
        },
      },
    },

    sales: {
      title: "ADDITIONAL WORK EXPERIENCE",
      meta: {
        dateWork: "Oct 2023 – Apr 2025",
        role: "Head of Sales",
        projectType: "Sales Operations",
        platform: "EdTech",
      },
      /** Empty on purpose: this entry is a role, not a problem brief. */
      problem: "",
      whatIDid: `Led a sales team of 5 – 7 managers and managed performance across the full sales cycle, including KPI tracking, task distribution, onboarding and team development

Built internal sales processes and training materials, including sales scripts, product knowledge and onboarding documentation Conducted regular training focused on SPIN Selling, needs discovery and objection handling, while personally handling complex negotiations and closing challenging deals`,
      results: [] as { value: string; label: string }[],
      notes: {},
    },
  },
};

export type Dict = typeof en;
