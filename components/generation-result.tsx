import { useState, useMemo } from "react"

interface GenerationResultProps {
  url: string
  content: string
  isGenerating?: boolean
  colorPayload?: {
    actualColors?: ExtractedColor[]
  } | null
  onClose: () => void
}

type ExtractedColor = {
  hex: string
  source: "css-variable" | "theme-color" | "inline-style" | "stylesheet" | "screenshot" | "logo" | "generated" | "ai"
  role?: "background" | "surface" | "text" | "muted" | "accent" | "brand" | "neutral" | "semantic"
  name?: string
  confidence: number
  frequency?: number
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case nr:
        h = (ng - nb) / d + (ng < nb ? 6 : 0);
        break;
      case ng:
        h = (nb - nr) / d + 2;
        break;
      case nb:
        h = (nr - ng) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function isDark(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const { l } = rgbToHsl(r, g, b);
  return l < 20;
}

function buildColorGroups(payload?: GenerationResultProps["colorPayload"]) {
  if (payload?.actualColors && payload.actualColors.length) {
    const actual = payload.actualColors.filter((c) => c.source !== 'generated' && c.source !== 'ai');
    const brand = actual.filter((c) => c.role === 'brand' || c.role === 'accent');
    const neutral = actual.filter((c) => !brand.includes(c));
    return {
      actual,
      brand,
      neutral,
    };
  }

  return {
    actual: [] as ExtractedColor[],
    brand: [] as ExtractedColor[],
    neutral: [] as ExtractedColor[],
  };
}

function renderInline(text: string) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*|\`[^`]+\`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={idx} className="syntax-code">{part.slice(1, -1)}</code>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return <a key={idx} href={linkMatch[2]} className="text-accent hover:underline" target="_blank" rel="noreferrer">{linkMatch[1]}</a>;
    }
    return <span key={idx}>{part}</span>;
  });
}

function renderTable(lines: string[], startIdx: number) {
  const rows = lines
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((row) => row.length > 0 && !row.every((cell) => cell.match(/^[-:]+$/)));
  if (!rows.length) return null;

  return (
    <div key={startIdx} className="overflow-x-auto my-3">
      <table className="min-w-full text-xs border-collapse">
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={rIdx === 0 ? "border-b border-border font-semibold text-foreground" : "border-b border-border/40 text-[#F0EDE4]/80"}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-2 py-1 whitespace-nowrap">{renderInline(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (/^#\s+/.test(trimmedLine)) {
      elements.push(<h1 key={i} className="syntax-h1 mb-3 pt-2">{renderInline(trimmedLine.replace(/^#\s+/, ''))}</h1>);
    } else if (/^##\s+/.test(trimmedLine)) {
      elements.push(<h2 key={i} className="syntax-h2 mt-6 mb-3">{renderInline(trimmedLine.replace(/^##\s+/, ''))}</h2>);
    } else if (/^###\s+/.test(trimmedLine)) {
      elements.push(<h3 key={i} className="syntax-h3 mt-5 mb-2">{renderInline(trimmedLine.replace(/^###\s+/, ''))}</h3>);
    } else if (trimmedLine.startsWith("---") || trimmedLine.startsWith("***")) {
      elements.push(<hr key={i} className="border-border my-4" />);
    } else if (trimmedLine.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const table = renderTable(tableLines, i - tableLines.length);
      if (table) elements.push(table);
      continue;
    } else if (trimmedLine.match(/^[-*]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*]\s/)) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <ul key={i - items.length} className="list-disc list-inside my-2 syntax-text space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    } else if (trimmedLine.match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={i - items.length} className="list-decimal list-inside my-2 syntax-text space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    } else if (trimmedLine === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(<p key={i} className="syntax-text my-1 break-words">{renderInline(line)}</p>);
    }
    i++;
  }

  return elements;
}

export function GenerationResult({ url, content, isGenerating, onClose, colorPayload }: GenerationResultProps) {
  const [activeTab, setActiveTab] = useState("Markdown")
  
  const normalizedUrl = useMemo(() => {
    if (!url) return "https://stripe.com"
    return url.startsWith("http") ? url : `https://${url}`
  }, [url])

  const previewUrl = useMemo(() => {
    return `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=false&embed=screenshot.url`
  }, [normalizedUrl])

  const visibleOutput = content
  const isFinished = !isGenerating
  
  const colors = useMemo(() => buildColorGroups(colorPayload), [colorPayload])

  const downloadMarkdown = () => {
    const blob = new Blob([visibleOutput], { type: "text/markdown;charset=utf-8" })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const hostname = normalizedUrl.replace(/^https?:\/\//, "").replace(/[^\w.-]+/g, "-")
    a.href = objectUrl
    a.download = `DESIGN-${hostname || "site"}.md`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
  }

  const shareResult = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "DESIGN.MD",
        text: `Generated DESIGN.md for ${normalizedUrl}`,
      })
      return
    }
    await navigator.clipboard.writeText(visibleOutput)
  }
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A08] animate-in fade-in duration-300">
      {/* Top Bar */}
      <header className="h-[48px] flex items-center justify-between px-4 border-b border-[#222220] bg-[#0A0A08] shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold text-lg text-foreground">DESIGN<span className="text-accent">.MD</span></span>
          <button 
            onClick={onClose}
            className="text-xs text-muted hover:text-foreground transition-colors px-2 py-1 flex items-center gap-1"
          >
            ← Back
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          {url || "stripe.com"}
          <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={shareResult}
            className="text-xs text-muted hover:text-foreground px-3 py-1.5 rounded border border-border hover:border-[#444442] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <button
            onClick={downloadMarkdown}
            disabled={!visibleOutput}
            className="text-xs font-medium bg-accent text-[#0A0A08] px-3 py-1.5 rounded hover:bg-accent-muted transition-colors lime-glow-sm disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </header>
      
      {/* Split Pane Area */}
      <div className="flex flex-1 flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        {/* Left Panel (55%) */}
        <div className="w-full md:w-[55%] flex flex-col md:border-r border-[#222220] bg-surface relative animate-in slide-in-from-left-4 duration-300 md:h-full min-h-[60vh]">
          {/* Subtle Lime Border Accent */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C8F04A20] z-10 pointer-events-none" />
          
          <div className="flex flex-col border-b border-[#222220] bg-[#111110] shrink-0">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full mac-dot-red" />
                <span className="w-3 h-3 rounded-full mac-dot-yellow" />
                <span className="w-3 h-3 rounded-full mac-dot-green" />
                <span className="ml-3 text-xs text-muted font-mono">
                  DESIGN.md — {url || "stripe.com"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(visibleOutput)}
                  className="text-xs text-muted hover:text-foreground px-2 py-1 rounded border border-transparent hover:border-[#444442] transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadMarkdown}
                  disabled={!visibleOutput}
                  className="text-xs text-muted hover:text-foreground px-2 py-1 rounded border border-blue-500/0 hover:border-[#444442] transition-colors disabled:opacity-50"
                >
                  Download .md
                </button>
              </div>
            </div>
            
            <div className="flex px-4 gap-4 text-xs font-mono">
              {['Markdown'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-accent text-foreground' : 'border-transparent text-muted hover:text-foreground'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 font-dm-mono relative">
            {activeTab === 'Markdown' ? (
              <div className="max-w-3xl">
                {renderMarkdown(visibleOutput)}
                {!isFinished && (
                  <span className="inline-block w-2 h-4 bg-accent opacity-80 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm text-center">
                {isFinished 
                  ? `${activeTab} generation would appear here (placeholder).` 
                  : `Waiting for analysis to complete to generate ${activeTab}...`}
              </div>
            )}
            
            {/* Paywall Overlay */}
            {/* Paywall removed for first 3 free uses as requested */}
          </div>
        </div>

        {/* Right Panel (45%) */}
        <div className="w-full md:w-[45%] flex flex-col bg-[#0A0A08] animate-in slide-in-from-right-4 duration-300 md:h-full">
          
          {/* Top Right: Website Screenshot */}
          <div className="h-[55%] min-h-[300px] flex flex-col border-b border-[#222220] p-6 pt-5 shrink-0">
            <span className="text-[10px] uppercase text-muted tracking-wider mb-4 font-mono flex justify-between">
              Above the Fold
              <a href={normalizedUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline lowercase">visit site ↗</a>
            </span>
            <div className="flex-1 bg-surface border border-[#222220] rounded-xl relative overflow-hidden group">
              {/* Browser chrome */}
              <div className="absolute inset-x-0 top-0 h-8 border-b border-[#222220] bg-[#161615] flex items-center px-4 z-10">
                 <div className="flex gap-1.5 mr-4">
                   <div className="w-2.5 h-2.5 rounded-full mac-dot-red" />
                   <div className="w-2.5 h-2.5 rounded-full mac-dot-yellow" />
                   <div className="w-2.5 h-2.5 rounded-full mac-dot-green" />
                 </div>
                 <div className="text-[10px] text-muted font-mono truncate bg-black/40 px-2 py-0.5 rounded w-full text-center">
                   {url || "stripe.com"}
                 </div>
              </div>
              
              <div className="absolute inset-0 pt-8 bg-[#111110]">
                <img
                  src={previewUrl}
                  alt={`Screenshot of ${normalizedUrl}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Right: Extracted Colors */}
          <div className="flex-1 md:overflow-y-auto p-6 pt-5 flex flex-col shrink-0 min-h-[300px]">
            <span className="text-[10px] uppercase text-muted tracking-wider mb-2 font-mono">Actual Site Colors</span>
            <span className="text-[10px] text-muted/70 mb-4 font-mono">Found from page sources and screenshot pixels</span>
            
            <div className="bg-surface border border-[#222220] rounded-xl p-5 flex-1 flex flex-col gap-6">
              {colors.actual.length === 0 ? (
                <div className="text-xs text-muted">No reliable site colors found</div>
              ) : (
                <>
                  <div>
                    <div className="text-[10px] text-muted mb-3 font-mono">Neutral</div>
                    <div className="flex flex-wrap gap-2">
                      {colors.neutral.map((color, i) => (
                        <div key={i} className="group relative">
                          <div
                            className="w-9 h-9 rounded-lg shadow-sm"
                            style={{
                              backgroundColor: color.hex,
                              border: isDark(color.hex) ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)'
                            }}
                          />
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[10px] px-2 py-1 rounded text-foreground pointer-events-none z-10 whitespace-nowrap">
                            {color.hex} · {color.source} · {Math.round(color.confidence * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted mb-3 font-mono">Accent / Brand</div>
                    <div className="flex flex-wrap gap-2">
                      {colors.brand.map((color, i) => (
                        <div key={i} className="group relative">
                          <div
                            className="w-9 h-9 rounded-lg shadow-sm"
                            style={{
                              backgroundColor: color.hex,
                              border: isDark(color.hex) ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)'
                            }}
                          />
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-[10px] px-2 py-1 rounded text-foreground pointer-events-none z-10 whitespace-nowrap">
                            {color.hex} · {color.source} · {Math.round(color.confidence * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
