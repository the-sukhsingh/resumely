"use client";

import React from 'react';
import { Text as TextR, View as ViewR, Link as LinkR } from "@react-pdf/renderer";
import katex from 'katex';

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', 'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ', 'a': 'ᵃ',
  'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'k': 'ᵏ', 'm': 'ᵐ', 'p': 'ᵖ', 't': 'ᵗ'
};

const SUBSCRIPTS: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎', 'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ'
};

function toSuperscript(str: string): string {
  return str.split('').map(c => SUPERSCRIPTS[c] || `^${c}`).join('');
}

function toSubscript(str: string): string {
  return str.split('').map(c => SUBSCRIPTS[c] || `_${c}`).join('');
}

/**
 * Converts a KaTeX math string to a clean, formatted Unicode representation
 * that renders natively in PDF without requiring DOM elements.
 */
export function formatLatexMath(mathStr: string): string {
  try {
    const mathml = katex.renderToString(mathStr, { output: 'mathml', throwOnError: false });
    // Remove annotation block
    const clean = mathml.replace(/<annotation[\s\S]*?<\/annotation>/g, '');

    let processed = clean
      // Handle msubsup
      .replace(
        /<msubsup>\s*<([^>]+)>([^<]+)<\/\1>\s*<([^>]+)>([^<]+)<\/\3>\s*<([^>]+)>([^<]+)<\/\5>\s*<\/msubsup>/g,
        (_, _bT, base, _subT, subVal, _supT, supVal) => `${base}${toSubscript(subVal)}${toSuperscript(supVal)}`
      )
      // Handle msup
      .replace(
        /<msup>\s*<([^>]+)>([^<]+)<\/\1>\s*<([^>]+)>([^<]+)<\/\3>\s*<\/msup>/g,
        (_, _bT, base, _supT, supVal) => `${base}${toSuperscript(supVal)}`
      )
      // Handle msub
      .replace(
        /<msub>\s*<([^>]+)>([^<]+)<\/\1>\s*<([^>]+)>([^<]+)<\/\3>\s*<\/msub>/g,
        (_, _bT, base, _subT, subVal) => `${base}${toSubscript(subVal)}`
      )
      // Handle mfrac
      .replace(/<mfrac>\s*<([^>]+)>([^<]+)<\/\1>\s*<([^>]+)>([^<]+)<\/\3>\s*<\/mfrac>/g, '($2 / $4)')
      // Handle msqrt
      .replace(/<msqrt>\s*<([^>]+)>([^<]+)<\/\1>\s*<\/msqrt>/g, '√($2)')
      // Strip remaining HTML/MathML tags
      .replace(/<[^>]+>/g, '');

    // Unescape HTML entities
    processed = processed
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
      .replace(/&#([0-9]+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
      .replace(/\s+/g, ' ')
      .trim();

    return processed;
  } catch (_err) {
    return mathStr;
  }
}

export type LatexToken =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'underline'; content: string }
  | { type: 'code'; content: string }
  | { type: 'math'; content: string; display?: boolean }
  | { type: 'link'; url: string; content: string }
  | { type: 'logo'; content: 'LaTeX' | 'TeX' };

/**
 * Tokenizes text containing LaTeX commands, inline/display math, and escaped characters.
 */
export function parseLatex(input: string): LatexToken[] {
  if (!input) return [];

  const tokens: LatexToken[] = [];
  let remaining = input;

  while (remaining.length > 0) {
    // Check for display math: $$...$$ or \[...\]
    const dispMathMatch = remaining.match(/^(\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\])/);
    if (dispMathMatch) {
      const math = dispMathMatch[2] || dispMathMatch[3] || '';
      tokens.push({ type: 'math', content: formatLatexMath(math), display: true });
      remaining = remaining.slice(dispMathMatch[0].length);
      continue;
    }

    // Check for inline math: $...$ or \(...\)
    const inlineMathMatch = remaining.match(/^(\$([^$\n]+)\$|\\\(([\s\S]*?)\\\))/);
    if (inlineMathMatch) {
      const math = inlineMathMatch[2] || inlineMathMatch[3] || '';
      tokens.push({ type: 'math', content: formatLatexMath(math), display: false });
      remaining = remaining.slice(inlineMathMatch[0].length);
      continue;
    }

    // Check for \href{url}{text}
    const hrefMatch = remaining.match(/^\\href\{([^{}]+)\}\{([^{}]+)\}/);
    if (hrefMatch) {
      tokens.push({ type: 'link', url: hrefMatch[1], content: hrefMatch[2] });
      remaining = remaining.slice(hrefMatch[0].length);
      continue;
    }

    // Check for \textbf{...}
    const boldMatch = remaining.match(/^\\textbf\{([^{}]+)\}/);
    if (boldMatch) {
      tokens.push({ type: 'bold', content: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for \textit{...} or \emph{...}
    const italicMatch = remaining.match(/^\\(?:textit|emph)\{([^{}]+)\}/);
    if (italicMatch) {
      tokens.push({ type: 'italic', content: italicMatch[1] });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Check for \underline{...}
    const underlineMatch = remaining.match(/^\\underline\{([^{}]+)\}/);
    if (underlineMatch) {
      tokens.push({ type: 'underline', content: underlineMatch[1] });
      remaining = remaining.slice(underlineMatch[0].length);
      continue;
    }

    // Check for \texttt{...}
    const codeMatch = remaining.match(/^\\texttt\{([^{}]+)\}/);
    if (codeMatch) {
      tokens.push({ type: 'code', content: codeMatch[1] });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for LaTeX logo \LaTeX or \TeX
    const logoMatch = remaining.match(/^\\(LaTeX|TeX)\b/);
    if (logoMatch) {
      tokens.push({ type: 'logo', content: logoMatch[1] as 'LaTeX' | 'TeX' });
      remaining = remaining.slice(logoMatch[0].length);
      continue;
    }

    // Check for escaped characters: \%, \&, \$, \#, \_, \{, \}
    const escapedMatch = remaining.match(/^\\([%&$#_{}])/);
    if (escapedMatch) {
      tokens.push({ type: 'text', content: escapedMatch[1] });
      remaining = remaining.slice(escapedMatch[0].length);
      continue;
    }

    // Regular text up to the next special character: $, \, $$
    const nextSpecial = remaining.search(/[\$\\]/);
    if (nextSpecial === -1) {
      tokens.push({ type: 'text', content: remaining });
      break;
    } else if (nextSpecial === 0) {
      // Unrecognized slash or lone $, consume 1 char
      tokens.push({ type: 'text', content: remaining[0] });
      remaining = remaining.slice(1);
    } else {
      tokens.push({ type: 'text', content: remaining.slice(0, nextSpecial) });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens;
}

interface LatexTextProps {
  children?: React.ReactNode;
  style?: any;
  font?: string;
  className?: string;
}

/**
 * LaTeX Text Component for React-PDF.
 * Parses and renders LaTeX formatting, math equations, and macros into native PDF text.
 */
export const LatexText: React.FC<LatexTextProps> = ({ children, style, font }) => {
  if (children === null || children === undefined || children === '') {
    return null;
  }

  // If children is not a plain string, render directly
  if (typeof children !== 'string') {
    return <TextR style={style}>{children}</TextR>;
  }

  // Fast path: if no LaTeX syntax ($ or \), return plain text
  if (!children.includes('$') && !children.includes('\\')) {
    return <TextR style={style}>{children}</TextR>;
  }

  const tokens = parseLatex(children);

  return (
    <TextR style={style}>
      {tokens.map((token, index) => {
        switch (token.type) {
          case 'bold':
            return (
              <TextR key={index} style={{ fontWeight: 'bold' }}>
                {token.content}
              </TextR>
            );
          case 'italic':
            return (
              <TextR key={index} style={{ fontStyle: 'italic' }}>
                {token.content}
              </TextR>
            );
          case 'underline':
            return (
              <TextR key={index} style={{ textDecoration: 'underline' }}>
                {token.content}
              </TextR>
            );
          case 'code':
            return (
              <TextR key={index} style={{ fontFamily: 'Courier', fontSize: 8 }}>
                {token.content}
              </TextR>
            );
          case 'math':
            return (
              <TextR key={index} style={{ fontStyle: 'italic' }}>
                {token.content}
              </TextR>
            );
          case 'link':
            return (
              <LinkR key={index} src={token.url} style={{ textDecoration: 'underline' }}>
                {token.content}
              </LinkR>
            );
          case 'logo':
            if (token.content === 'LaTeX') {
              return (
                <TextR key={index}>
                  L
                  <TextR style={{ fontSize: 7 }}>A</TextR>
                  T
                  <TextR style={{ fontSize: 7.5 }}>E</TextR>
                  X
                </TextR>
              );
            }
            return (
              <TextR key={index}>
                T
                <TextR style={{ fontSize: 7.5 }}>E</TextR>
                X
              </TextR>
            );

          case 'text':
          default:
            return <React.Fragment key={index}>{token.content}</React.Fragment>;
        }
      })}
    </TextR>
  );
};

export default LatexText;
