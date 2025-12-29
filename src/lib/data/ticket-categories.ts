import { nanoid } from "nanoid";

export const ticketCategoriesData = [
  {
    id: nanoid(),
    name: "Technical Support",
    description: "Hardware, software, or system issues",
    color: "#3b82f6",
    icon: "Wrench",
    sortOrder: 1,
  },
  {
    id: nanoid(),
    name: "Account Issues",
    description: "Login, password, or account access problems",
    color: "#8b5cf6",
    icon: "User",
    sortOrder: 2,
  },
  {
    id: nanoid(),
    name: "Feature Request",
    description: "Suggestions for new features",
    color: "#10b981",
    icon: "Lightbulb",
    sortOrder: 3,
  },
  {
    id: nanoid(),
    name: "Bug Report",
    description: "Report software bugs or errors",
    color: "#ef4444",
    icon: "Bug",
    sortOrder: 4,
  },
  {
    id: nanoid(),
    name: "General Inquiry",
    description: "Questions or general information",
    color: "#6b7280",
    icon: "HelpCircle",
    sortOrder: 5,
  },
];
