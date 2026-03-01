"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  text: string;
  maxLength?: number;
  className?: string;
};

export function ReadMore({ text, maxLength = 150, className = "" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);

  const needsTruncation = text.length > maxLength;
  const displayText = !needsTruncation || expanded ? text : text.slice(0, maxLength).trimEnd() + "...";

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, text]);

  if (!needsTruncation) {
    return <p className={`text-gray-700 leading-relaxed ${className}`}>{text}</p>;
  }

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: expanded ? height : undefined }}
      >
        <p className="text-gray-700 leading-relaxed">{displayText}</p>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 transition"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
