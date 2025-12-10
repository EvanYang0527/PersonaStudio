import { getRandomColor } from '../utils';

export const INITIAL_PERSONA_STATE = {
  id: null as number | null,
  projectId: null as number | null,
  name: "",
  age: "",
  sex: "",
  nationality: "",
  role: "",
  occupation: "",
  goals: ["", "", ""],
  frustrations: ["", "", ""],
  motivation: "",
  bio: "",
  narrative: "",
  quote: "",
  avatarStyle: "Photorealistic",
  avatarUrl: null as string | null,
  videoUrl: null as string | null,
};

export const AVATAR_STYLES = [
  { id: 'photorealistic', label: 'Photorealistic' },
  { id: 'disney', label: 'Disney/Pixar 3D' },
  { id: 'flat', label: 'Flat Illustration' },
  { id: 'airbnb', label: 'Airbnb 3D' },
];

export const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "FinTech Mobile App 2.0",
    personas: 2,
    updated: "2h ago",
    color: getRandomColor(),
    startDate: "2024-07-15",
    background: "Redesigning the core banking experience for gen-z users.",
    resources: [
      { name: "Figma Designs", url: "https://figma.com/file/..." },
      { name: "PRD Document", url: "https://notion.so/..." }
    ]
  },
  {
    id: 2,
    name: "Healthcare Portal",
    personas: 1,
    updated: "1d ago",
    color: getRandomColor(),
    startDate: "2024-01-10",
    background: "Patient intake optimization project.",
    resources: [
      { name: "Jira Board", url: "https://atlassian.net/..." }
    ]
  },
  {
    id: 3,
    name: "E-Commerce Rebrand",
    personas: 0,
    updated: "3d ago",
    color: getRandomColor(),
    startDate: "2024-04-01",
    background: "Summer collection launch campaign.",
    resources: []
  },
];

export const MOCK_INITIAL_PERSONAS = [
  {
    ...INITIAL_PERSONA_STATE,
    id: 101,
    projectId: 1,
    name: "Sarah Chen",
    role: "Lead Engineer",
    age: "28",
    nationality: "San Francisco, CA",
    occupation: "Software Architect",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    goals: ["Scale backend systems", "Reduce tech debt", "Mentoring juniors"]
  },
  {
    ...INITIAL_PERSONA_STATE,
    id: 102,
    projectId: 1,
    name: "Marcus Johnson",
    role: "End User",
    age: "35",
    nationality: "London, UK",
    occupation: "Marketing Manager",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    goals: ["Easy reporting", "Mobile access", "Data visualization"]
  },
  {
    ...INITIAL_PERSONA_STATE,
    id: 103,
    projectId: 2,
    name: "Dr. Emily Wong",
    role: "Admin",
    age: "42",
    nationality: "New York, NY",
    occupation: "Clinic Administrator",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
    goals: ["Reduce wait times", "Streamline billing", "Patient satisfaction"]
  }
];
