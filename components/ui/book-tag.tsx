import { cn } from "@/lib/utils";

export type BookTitle = 
  | "La Harpe des Quatre Saisons"
  | "La Confrérie de NUADA"
  | "Les Entrailles du temps";

interface BookTagProps {
  book: string;
  className?: string;
}

const bookStyles: Record<BookTitle, string> = {
  "La Harpe des Quatre Saisons": "bg-blue-600 text-white border-blue-400",
  "La Confrérie de NUADA": "bg-green-600 text-white border-green-400",
  "Les Entrailles du temps": "bg-red-600 text-white border-red-400",
};

const bookShortNames: Record<BookTitle, string> = {
  "La Harpe des Quatre Saisons": "Tome 1",
  "La Confrérie de NUADA": "Tome 2",
  "Les Entrailles du temps": "Tome 3",
};

export function BookTag({ book, className }: BookTagProps) {
  const bookTitle = book as BookTitle;
  const style = bookStyles[bookTitle] || "bg-gray-600 text-white border-gray-400";
  const shortName = bookShortNames[bookTitle] || book;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        style,
        className
      )}
      title={book}
    >
      {shortName}
    </span>
  );
}
