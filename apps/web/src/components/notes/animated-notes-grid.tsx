"use client";

import { motion } from "motion/react";

import { NoteCard } from "@/components/notes/note-card";
import type { Category, Note } from "@/lib/api/types";

type NotesGridItem = {
  note: Note;
  category: Category;
};

type AnimatedNotesGridProps = {
  label: string;
  notes: NotesGridItem[];
  returnQuery?: string;
};

const cardTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function AnimatedNotesGrid({
  label,
  notes,
  returnQuery,
}: AnimatedNotesGridProps) {
  return (
    <section
      aria-label={label}
      className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {notes.map(({ note, category }, index) => (
        <motion.div
          layout="position"
          key={note.id}
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{
            ...cardTransition,
            delay: Math.min(index * 0.035, 0.14),
          }}
          className="h-full"
        >
          <NoteCard note={note} category={category} returnQuery={returnQuery} />
        </motion.div>
      ))}
    </section>
  );
}
