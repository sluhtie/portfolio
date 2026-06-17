import type { ReactNode } from "react";

export function Marquee({
  items,
  duration = 28,
  reverse = false,
  className = "",
  separator,
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  className?: string;
  separator?: ReactNode;
}) {
  const Sep = separator ?? <span className="text-accent">✦</span>;
  // duplicate the list so the -50% translate loops seamlessly
  const sequence = [...items, ...items];

  return (
    <div className={`marquee w-full overflow-hidden ${className}`}>
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {sequence.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6">{item}</span>
            <span className="px-6 opacity-70">{Sep}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
