"use client";

// Renders superscript notation like x² x³ x⁻² etc.
// Converts unicode superscripts and caret notation to <sup> tags

const UNICODE_SUP: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁻": "-",
};

function convertMath(text: string): string {
  // 1. Replace unicode superscripts (including superscript minus ⁻) with <sup>...</sup>
  let result = text.replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (match) => {
    const digits = match.split("").map((c) => UNICODE_SUP[c] ?? c).join("");
    return `<sup>${digits}</sup>`;
  });

  // 2. Replace caret notation ^(expr) or ^n with <sup>
  result = result.replace(/\^\(([^)]+)\)/g, "<sup>($1)</sup>");
  result = result.replace(/\^([a-zA-Z0-9]+)/g, "<sup>$1</sup>");

  return result;
}

interface MathTextProps {
  text: string;
  className?: string;
  as?: "span" | "p" | "div";
}

export default function MathText({ text, className = "", as: Tag = "span" }: MathTextProps) {
  const html = convertMath(text);
  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
