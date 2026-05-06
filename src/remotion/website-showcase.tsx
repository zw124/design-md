import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const accent = "#A7C957";
const warm = "#D8D2C4";
const bg = "#050604";
const panel = "#10110F";
const border = "rgba(216, 210, 196, 0.14)";
const muted = "rgba(216, 210, 196, 0.56)";

function lineDelay(index: number) {
  return index * 5 + 76;
}

function GeneratedMarkdown() {
  const frame = useCurrentFrame();
  const rows = [
    "# DESIGN.md - apple.com",
    "## 01. Brand Identity",
    "- Visual philosophy: precise, minimal, product-led.",
    "- Keywords: refined, direct, calm, premium.",
    "## 02. Color System",
    "| Primary | #0071E3 | rgba(0,113,227,1) |",
    "| Text | #161617 | rgba(22,22,23,1) |",
    "| Surface | #F5F5F7 | rgba(245,245,247,1) |",
    "## 03. Typography",
    "| Display | 56px | 700 | 64px |",
    "| Body | 16px | 400 | 24px |",
    "## 04. Component Stylings",
  ];

  return (
    <div style={styles.markdownPanel}>
      <div style={styles.panelHeader}>
        <span style={{ ...styles.dot, background: "#FF5F57" }} />
        <span style={{ ...styles.dot, background: "#FFBD2E" }} />
        <span style={{ ...styles.dot, background: "#28C840" }} />
        <span style={styles.headerTitle}>DESIGN.md</span>
      </div>
      <div style={styles.markdownBody}>
        {rows.map((row, index) => {
          const opacity = interpolate(frame, [lineDelay(index), lineDelay(index) + 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const x = interpolate(frame, [lineDelay(index), lineDelay(index) + 10], [18, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={row}
              style={{
                ...styles.markdownLine,
                opacity,
                transform: `translateX(${x}px)`,
                color: row.startsWith("#") ? warm : row.startsWith("|") ? accent : "rgba(216,210,196,0.82)",
                fontWeight: row.startsWith("#") ? 700 : 500,
              }}
            >
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WebsiteCard() {
  const frame = useCurrentFrame();
  const loading = interpolate(frame, [58, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0, 1),
  });

  return (
    <div style={styles.browser}>
      <div style={styles.browserBar}>
        <div style={styles.traffic}>
          <span style={{ ...styles.dot, background: "#FF5F57" }} />
          <span style={{ ...styles.dot, background: "#FFBD2E" }} />
          <span style={{ ...styles.dot, background: "#28C840" }} />
        </div>
        <div style={styles.address}>designmd-alpha.vercel.app</div>
      </div>
      <div style={styles.website}>
        <nav style={styles.nav}>
          <div style={styles.logo}>DESIGN<span style={{ color: accent }}>.MD</span></div>
          <div style={styles.navLinks}>
            <span>Features</span>
            <span>Generator</span>
          </div>
        </nav>
        <section style={styles.hero}>
          <div style={styles.pill}>
            <span style={styles.pulse} />
            Generate source-backed DESIGN.md files
          </div>
          <h1 style={styles.h1}>Turn any website into DESIGN.MD</h1>
          <p style={styles.copy}>
            Verified colors, precise component specs, typography, layout rules, and an agent-ready prompt guide.
          </p>
          <div style={styles.inputRow}>
            <span style={styles.inputText}>apple.com</span>
            <span style={styles.generateButton}>Generating...</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${loading * 100}%` }} />
          </div>
        </section>
      </div>
    </div>
  );
}

export function WebsiteShowcase() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const rotateY = interpolate(frame, [0, 90, 170, 239], [-22, -10, 12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0, 1),
  });
  const rotateX = interpolate(frame, [0, 120, 239], [10, 4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const floatY = Math.sin(frame / 18) * 12;
  const cardScale = interpolate(intro, [0, 1], [0.82, 1]);
  const titleOpacity = interpolate(frame, [8, 34, 185, 220], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markdownOpacity = interpolate(frame, [104, 132], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markdownX = interpolate(frame, [104, 132], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0, 1),
  });

  return (
    <AbsoluteFill style={styles.frame}>
      <div style={styles.grid} />
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={{ ...styles.titleBlock, opacity: titleOpacity }}>
        <div style={styles.kicker}>3D Website Showcase</div>
        <div style={styles.title}>DESIGN.MD converts any site into a precise design system.</div>
      </div>
      <div style={styles.stage}>
        <div
          style={{
            ...styles.perspectiveWrap,
            transform: `translateX(-250px) translateY(${floatY}px) scale(${cardScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          }}
        >
          <WebsiteCard />
        </div>
        <div
          style={{
            ...styles.markdownWrap,
            opacity: markdownOpacity,
            transform: `translateX(${markdownX}px) rotateY(-10deg) rotateX(4deg)`,
          }}
        >
          <GeneratedMarkdown />
        </div>
      </div>
      <div style={styles.footer}>Verified tokens · Exact CSS values · Agent-ready prompt guide</div>
    </AbsoluteFill>
  );
}

const styles: Record<string, React.CSSProperties> = {
  frame: {
    background: bg,
    overflow: "hidden",
    color: warm,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(216,210,196,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(216,210,196,0.055) 1px, transparent 1px)",
    backgroundSize: "72px 72px",
    maskImage: "radial-gradient(circle at 50% 48%, black 0%, transparent 72%)",
  },
  glowOne: {
    position: "absolute",
    width: 760,
    height: 760,
    left: -220,
    top: 120,
    background: "radial-gradient(circle, rgba(167,201,87,0.20), transparent 65%)",
    filter: "blur(20px)",
  },
  glowTwo: {
    position: "absolute",
    width: 680,
    height: 680,
    right: -180,
    bottom: -160,
    background: "radial-gradient(circle, rgba(216,210,196,0.12), transparent 66%)",
    filter: "blur(24px)",
  },
  titleBlock: {
    position: "absolute",
    top: 70,
    left: 110,
    width: 980,
  },
  kicker: {
    color: accent,
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  title: {
    fontSize: 46,
    lineHeight: "54px",
    fontWeight: 760,
    letterSpacing: 0,
  },
  stage: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    perspective: 1600,
    transformStyle: "preserve-3d",
  },
  perspectiveWrap: {
    width: 1040,
    transformStyle: "preserve-3d",
    filter: "drop-shadow(0 42px 90px rgba(0,0,0,0.45))",
  },
  browser: {
    width: 1040,
    height: 640,
    background: panel,
    border: `1px solid ${border}`,
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 44px 120px rgba(0,0,0,0.50)",
  },
  browserBar: {
    height: 58,
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "0 20px",
    background: "rgba(216,210,196,0.06)",
    borderBottom: `1px solid ${border}`,
  },
  traffic: {
    display: "flex",
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 99,
    display: "inline-block",
  },
  address: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    background: "rgba(0,0,0,0.32)",
    color: muted,
    fontSize: 15,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  website: {
    height: 582,
    background:
      "linear-gradient(180deg, rgba(5,6,4,0.94), rgba(5,6,4,0.98)), linear-gradient(90deg, rgba(216,210,196,0.06) 1px, transparent 1px)",
    backgroundSize: "auto, 56px 56px",
  },
  nav: {
    height: 74,
    padding: "0 54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${border}`,
    background: "rgba(10,11,9,0.72)",
    backdropFilter: "blur(18px)",
  },
  logo: {
    fontSize: 24,
    fontWeight: 820,
    fontFamily: "Georgia, serif",
  },
  navLinks: {
    display: "flex",
    gap: 34,
    color: muted,
    fontSize: 15,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  hero: {
    paddingTop: 92,
    width: 760,
    margin: "0 auto",
    textAlign: "center",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 16px",
    border: `1px solid ${border}`,
    borderRadius: 999,
    color: muted,
    fontSize: 16,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    marginBottom: 40,
  },
  pulse: {
    width: 9,
    height: 9,
    borderRadius: 99,
    background: accent,
    boxShadow: "0 0 22px rgba(167,201,87,0.8)",
  },
  h1: {
    fontSize: 70,
    lineHeight: "76px",
    margin: "0 0 24px",
    fontFamily: "Georgia, serif",
    color: warm,
    fontWeight: 800,
  },
  copy: {
    width: 610,
    margin: "0 auto 46px",
    color: muted,
    fontSize: 18,
    lineHeight: "28px",
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  inputRow: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    border: `1px solid ${border}`,
    borderRadius: 10,
    background: "rgba(16,17,15,0.92)",
  },
  inputText: {
    paddingLeft: 18,
    color: "rgba(216,210,196,0.74)",
    fontSize: 18,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  generateButton: {
    height: 48,
    padding: "0 24px",
    borderRadius: 7,
    display: "grid",
    placeItems: "center",
    background: accent,
    color: "#0A0A08",
    fontWeight: 800,
    fontSize: 16,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
  },
  progressTrack: {
    marginTop: 34,
    height: 4,
    borderRadius: 99,
    background: "rgba(216,210,196,0.12)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
    background: accent,
  },
  markdownWrap: {
    position: "absolute",
    right: 120,
    top: 310,
    width: 650,
    transformStyle: "preserve-3d",
    filter: "drop-shadow(0 34px 76px rgba(0,0,0,0.48))",
  },
  markdownPanel: {
    height: 560,
    borderRadius: 16,
    overflow: "hidden",
    border: `1px solid ${border}`,
    background: "rgba(16,17,15,0.96)",
  },
  panelHeader: {
    height: 50,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 18px",
    borderBottom: `1px solid ${border}`,
    background: "rgba(216,210,196,0.06)",
  },
  headerTitle: {
    marginLeft: 14,
    color: muted,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: 14,
  },
  markdownBody: {
    padding: 24,
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: 17,
    lineHeight: "30px",
  },
  markdownLine: {
    whiteSpace: "nowrap",
  },
  footer: {
    position: "absolute",
    left: 110,
    bottom: 64,
    color: "rgba(216,210,196,0.62)",
    fontFamily: '"SFMono-Regular", Consolas, monospace',
    fontSize: 22,
  },
};
