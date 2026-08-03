export type User = {
  id: number;
  email: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  color_key: "random" | "school" | "personal" | "drama";
  note_count: number;
};

export type Note = {
  id: string;
  category: Category["slug"];
  title: string;
  content: string;
  manual_order: number;
  created_at: string;
  updated_at: string;
};

export type NotePage = {
  count: number;
  next_page: number | null;
  previous_page: number | null;
  results: Note[];
};

export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string[] | string>;
  };
};
