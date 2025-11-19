import { cn } from "@/lib/utils";

export const BOOK_TITLES: Record<number, string> = {
  1: "La Harpe des Quatre Saisons",
  2: "La Confrérie de NUADA",
  3: "Les Entrailles du temps",
};

interface BookTagProps {
  book: number;
  className?: string;
}

const bookStyles: Record<number, string> = {
  1: "bg-blue-600 text-white border-blue-400",
  2: "bg-green-600 text-white border-green-400",
  3: "bg-red-600 text-white border-red-400",
};

export function BookTag({ book, className }: BookTagProps) {
  const title = BOOK_TITLES[book] || `Livre ${book}`;
  const style = bookStyles[book] || "bg-gray-600 text-white border-gray-400";
  const shortName = `Tome ${book}`;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        style,
        className
      )}
      title={title}
    >
      {shortName}
    </span>
  );
}
