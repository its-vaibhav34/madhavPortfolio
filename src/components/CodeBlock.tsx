import React, { useState, useMemo } from 'react';
import { Check, Copy, Github } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  githubUrl?: string;
  filename?: string;
}

// Basic syntax highlighting for C/C++/Arduino code
function highlightSyntax(code: string, language: string): React.ReactNode[] {
  const lines = code.split('\n');

  return lines.map((line, i) => {
    let highlighted = line;

    // Order matters — process from most specific to least
    // Comments (// ...)
    const commentIdx = highlighted.indexOf('//');
    let beforeComment = highlighted;
    let commentPart = '';
    if (commentIdx >= 0) {
      // Check it's not inside a string
      const beforeStr = highlighted.substring(0, commentIdx);
      const quotes = (beforeStr.match(/"/g) || []).length;
      if (quotes % 2 === 0) {
        beforeComment = highlighted.substring(0, commentIdx);
        commentPart = highlighted.substring(commentIdx);
      }
    }

    const parts: React.ReactNode[] = [];

    // Process the non-comment part
    if (beforeComment) {
      // Split by strings first
      const stringRegex = /(\"[^\"]*\")/g;
      const segments = beforeComment.split(stringRegex);

      segments.forEach((seg, j) => {
        if (seg.match(/^\".*\"$/)) {
          parts.push(<span key={`s-${i}-${j}`} className="syntax-string">{seg}</span>);
        } else {
          // Highlight keywords in non-string segments
          const keywordRegex = /\b(void|int|float|double|char|bool|long|const|if|else|while|for|return|switch|case|break|default|true|false|class|struct|include|define|unsigned|uint8_t|uint16_t|uint32_t|int16_t|String|HIGH|LOW|OUTPUT|INPUT|delay|pinMode|digitalWrite|analogWrite|analogRead|digitalRead|Serial|println|print|begin|available|read|write)\b/g;
          const preprocessorRegex = /(#\w+)/g;
          const numberRegex = /\b(\d+\.?\d*[fFL]?)\b/g;

          let remaining = seg;
          const subParts: React.ReactNode[] = [];
          let lastIndex = 0;

          // Simple token-based approach
          const tokens = remaining.split(/(\s+|[{}();\[\],<>=!&|+\-*/%.])/);
          tokens.forEach((token, k) => {
            if (token.match(/^(void|int|float|double|char|bool|long|unsigned|uint8_t|uint16_t|uint32_t|int16_t|String)$/)) {
              subParts.push(<span key={`t-${i}-${j}-${k}`} className="syntax-type">{token}</span>);
            } else if (token.match(/^(const|if|else|while|for|return|switch|case|break|default|true|false|class|struct|HIGH|LOW|OUTPUT|INPUT)$/)) {
              subParts.push(<span key={`k-${i}-${j}-${k}`} className="syntax-keyword">{token}</span>);
            } else if (token.match(/^#\w+/)) {
              subParts.push(<span key={`p-${i}-${j}-${k}`} className="syntax-preprocessor">{token}</span>);
            } else if (token.match(/^\d+\.?\d*[fFL]?$/) && token.trim()) {
              subParts.push(<span key={`n-${i}-${j}-${k}`} className="syntax-number">{token}</span>);
            } else if (token.match(/^(delay|pinMode|digitalWrite|analogWrite|analogRead|digitalRead|Serial|println|print|begin|available|read|write|setup|loop|sprintf|printf|isnan)$/)) {
              subParts.push(<span key={`f-${i}-${j}-${k}`} className="syntax-function">{token}</span>);
            } else {
              subParts.push(<span key={`x-${i}-${j}-${k}`}>{token}</span>);
            }
          });

          parts.push(...subParts);
        }
      });
    }

    // Add comment part
    if (commentPart) {
      parts.push(<span key={`c-${i}`} className="syntax-comment">{commentPart}</span>);
    }

    return (
      <div key={i} className="flex hover:bg-white/[0.02] transition-colors">
        <span className="code-line-number select-none shrink-0 inline-block">{i + 1}</span>
        <span className="flex-1">{parts.length > 0 ? parts : line || '\u00A0'}</span>
      </div>
    );
  });
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'cpp',
  githubUrl,
  filename
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const highlightedCode = useMemo(() => highlightSyntax(code, language), [code, language]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1117] text-neutral-200 overflow-hidden shadow-2xl font-mono text-xs">
      {/* Code Header Bar — VS Code style */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center space-x-3">
          {/* Traffic light dots */}
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
          </div>
          {/* File tab */}
          <div className="flex items-center space-x-2 bg-[#0d1117] px-3 py-1 rounded-t-md border border-white/5 border-b-0 -mb-3 ml-2">
            <svg className="w-3.5 h-3.5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <span className="text-[11px] text-neutral-300 font-medium">
              {filename || (language ? `main.${language}` : 'firmware.cpp')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition-all text-[11px]"
              title="View on GitHub"
            >
              <Github className="w-3 h-3" />
              <span>Source</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition-all text-[11px] focus:outline-none cursor-pointer"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content with line numbers */}
      <div className="p-4 overflow-x-auto max-h-[520px] leading-relaxed">
        <pre className="text-[13px]">
          <code>{highlightedCode}</code>
        </pre>
      </div>
    </div>
  );
};
