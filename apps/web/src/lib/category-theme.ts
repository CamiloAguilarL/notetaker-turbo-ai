import type { Category } from "@/lib/api/types";

type CategoryTheme = {
  surface: string;
  border: string;
  dot: string;
};

export const categoryThemes: Record<Category["color_key"], CategoryTheme> = {
  random: {
    surface: "bg-note-random",
    border: "border-note-random-border",
    dot: "bg-note-random-border",
  },
  school: {
    surface: "bg-note-school",
    border: "border-note-school-border",
    dot: "bg-note-school-border",
  },
  personal: {
    surface: "bg-note-personal",
    border: "border-note-personal-border",
    dot: "bg-note-personal-border",
  },
  drama: {
    surface: "bg-note-drama",
    border: "border-note-drama-border",
    dot: "bg-note-drama-border",
  },
};
