import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from '~/config';


async function fetchImageAsBase64(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function predictImage(imageUrl) {
  const base64 = await fetchImageAsBase64(imageUrl);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/jpeg", data: base64 },
            },
            {
              type: "text",
              text: `Analyze this image and identify what's in it. Respond with a JSON object only (no markdown, no backticks) in this exact format:
{
  "subject": "short label of the main subject",
  "confidence": "High / Medium / Low",
  "description": "2–3 sentence description of what you see",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}`,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content.map((b) => b.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

export default function ImageGallery() {
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/models/mnistfashion_test_images`)
      .then((res) => res.json())
      .then((data) => {
        const loaded = data.images.map((path, i) => ({
          id: i + 1,
          src: `${API_BASE_URL}${path}`,
          thumb: `${API_BASE_URL}${path}`,
          label: `Frame ${String(i + 1).padStart(2, "0")}`,
        }));
        setImages(loaded);
        setSelected(loaded[0]);
      });
  }, []);
  const stripRef = useRef(null);

  const scroll = (dir) => {
    stripRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const handleSelect = (img) => {
    setSelected(img);
    setPrediction(null);
    setError(null);
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    setError(null);
    try {
      const result = await predictImage(selected.src);
      setPrediction(result);
    } catch (e) {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = {
    High: "#2d7a4f",
    Medium: "#b07d2a",
    Low: "#c0392b",
  };
  if (!selected) return <div style={{ padding: 40, fontFamily: "monospace" }}>Loading images…</div>;
  return (
    <div style={styles.root}>
      <style>{css}</style>

      {/* Header */}
      <header style={styles.header}>
        <span style={styles.dot} />
        <h1 style={styles.title}>MNIST Fashion image classifier</h1>
        <span style={styles.counter}>{String(selected.id).padStart(2, "0")} / {images.length}</span>
      </header>

      {/* Main content area */}
      <div style={styles.contentArea}>
        {/* Stage */}
        <div style={styles.stage}>
          <div style={styles.frameOuter}>
            <div style={styles.frameInner} className="frame-inner">
              <img
                key={selected.id}
                src={selected.src}
                alt={selected.label}
                style={styles.mainImage}
                className="main-img"
              />
              <div style={styles.imageLabel}>{selected.label}</div>
            </div>
          </div>

          {/* Predict button */}
          <button
            style={{ ...styles.predictBtn, ...(loading ? styles.predictBtnLoading : {}) }}
            className="predict-btn"
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.btnInner}>
                <span className="spinner" style={styles.spinner} />
                Analysing…
              </span>
            ) : (
              <span style={styles.btnInner}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Predict
              </span>
            )}
          </button>
        </div>

        {/* Results panel */}
        <div style={styles.resultsPanel}>
          {!prediction && !error && !loading && (
            <div style={styles.emptyState}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c8bfb0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p style={styles.emptyText}>Select an image and click<br /><strong>Predict</strong> to identify it</p>
            </div>
          )}

          {loading && (
            <div style={styles.emptyState}>
              <div className="pulse-ring" style={styles.pulseRing} />
              <p style={{ ...styles.emptyText, color: "#6b7280" }}>Analysing image…</p>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>!</span>
              {error}
            </div>
          )}

          {prediction && (
            <div style={styles.predictionCard} className="pred-card">
              <div style={styles.predHeader}>
                <span style={styles.predSubject}>{prediction.subject}</span>
                <span style={{
                  ...styles.confidenceBadge,
                  background: confidenceColor[prediction.confidence] + "18",
                  color: confidenceColor[prediction.confidence],
                  borderColor: confidenceColor[prediction.confidence] + "40",
                }}>
                  {prediction.confidence} confidence
                </span>
              </div>

              <p style={styles.predDescription}>{prediction.description}</p>

              <div style={styles.tagsRow}>
                {prediction.tags?.map((tag) => (
                  <span key={tag} style={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Film strip */}
      <div style={styles.stripWrapper}>
        <button style={{ ...styles.arrow, left: 0 }} onClick={() => scroll(-1)} aria-label="scroll left">‹</button>

        <div ref={stripRef} style={styles.strip} className="strip">
          {images.map((img) => {
            const isActive = img.id === selected.id;
            const isHovered = img.id === hoveredId;
            return (
              <button
                key={img.id}
                style={{
                  ...styles.thumb,
                  ...(isActive ? styles.thumbActive : {}),
                  ...(isHovered && !isActive ? styles.thumbHover : {}),
                }}
                className={`thumb-btn ${isActive ? "active" : ""}`}
                onClick={() => handleSelect(img)}
                onMouseEnter={() => setHoveredId(img.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={img.label}
              >
                <img src={img.thumb} alt={img.label} style={styles.thumbImg} />
                {isActive && <div style={styles.activeBar} />}
                <span style={styles.thumbLabel}>{img.label}</span>
              </button>
            );
          })}
        </div>

        <button style={{ ...styles.arrow, right: 0 }} onClick={() => scroll(1)} aria-label="scroll right">›</button>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#f5f2ee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Courier New', monospace",
    color: "#2a2420",
    padding: "0 0 40px",
    overflowX: "hidden",
  },
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "28px 48px 20px",
    borderBottom: "1px solid #ddd8d0",
    boxSizing: "border-box",
    background: "#faf8f5",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#8b6f47",
    display: "inline-block",
    boxShadow: "0 0 10px #8b6f4744",
  },
  title: {
    margin: 0,
    fontSize: "11px",
    letterSpacing: "0.45em",
    fontWeight: 400,
    color: "#9a9088",
    textTransform: "uppercase",
  },
  counter: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    color: "#b0a898",
  },

  contentArea: {
    display: "flex",
    gap: "28px",
    padding: "40px 40px 28px",
    width: "100%",
    maxWidth: "1100px",
    boxSizing: "border-box",
    alignItems: "flex-start",
  },

  stage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    flex: "0 0 auto",
  },
  frameOuter: {
    padding: "3px",
    background: "linear-gradient(135deg, #c8b89a, #e8e0d4, #b8a888)",
    borderRadius: "2px",
    boxShadow: "0 4px 32px #00000018, 0 0 0 1px #ddd8d0",
  },
  frameInner: {
    position: "relative",
    background: "#f0ece6",
    overflow: "hidden",
    borderRadius: "1px",
  },
  mainImage: {
    display: "block",
    width: "clamp(260px, 42vw, 560px)",
    aspectRatio: "4/3",
    objectFit: "cover",
  },
  imageLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "28px 16px 12px",
    background: "linear-gradient(to top, #00000055, transparent)",
    fontSize: "10px",
    letterSpacing: "0.35em",
    color: "#fff",
    textTransform: "uppercase",
  },

  predictBtn: {
    padding: "10px 28px",
    background: "#2a2420",
    color: "#f5f2ee",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontSize: "11px",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    transition: "background 0.2s, transform 0.1s",
    alignSelf: "stretch",
  },
  predictBtnLoading: {
    background: "#7a706a",
    cursor: "not-allowed",
  },
  btnInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: 13,
    height: 13,
    border: "2px solid #ffffff44",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    display: "inline-block",
  },

  resultsPanel: {
    flex: 1,
    minHeight: 240,
    background: "#faf8f5",
    border: "1px solid #ddd8d0",
    borderRadius: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "28px",
    boxSizing: "border-box",
    alignSelf: "stretch",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 4,
  },
  emptyText: {
    margin: 0,
    fontSize: "13px",
    color: "#b0a898",
    lineHeight: 1.6,
    fontFamily: "'Courier New', monospace",
  },
  pulseRing: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "2px solid #8b6f47",
    marginBottom: 12,
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #f0c0b8",
    borderRadius: "2px",
    padding: "14px 18px",
    fontSize: "12px",
    color: "#c0392b",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontFamily: "'Courier New', monospace",
  },
  errorIcon: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#c0392b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "bold",
    flexShrink: 0,
  },

  predictionCard: {
    width: "100%",
  },
  predHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottom: "1px solid #e8e4de",
  },
  predSubject: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    fontFamily: "Georgia, serif",
    color: "#1a1612",
    textTransform: "capitalize",
  },
  confidenceBadge: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "4px 10px",
    borderRadius: "2px",
    border: "1px solid",
    fontFamily: "'Courier New', monospace",
  },
  predDescription: {
    margin: "0 0 18px",
    fontSize: "13px",
    lineHeight: 1.75,
    color: "#4a4440",
    fontFamily: "Georgia, serif",
  },
  tagsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "4px 10px",
    background: "#ede9e2",
    border: "1px solid #ddd8d0",
    borderRadius: "2px",
    color: "#7a706a",
    fontFamily: "'Courier New', monospace",
  },

  stripWrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "1020px",
    padding: "0 52px",
    boxSizing: "border-box",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "#faf8f5",
    border: "1px solid #ddd8d0",
    color: "#9a9088",
    width: 36,
    height: 36,
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: "34px",
    textAlign: "center",
    padding: 0,
    transition: "color 0.2s, border-color 0.2s",
    borderRadius: "1px",
  },
  strip: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none",
    padding: "6px 2px 12px",
  },
  thumb: {
    flex: "0 0 auto",
    width: 120,
    background: "none",
    border: "1px solid #ddd8d0",
    cursor: "pointer",
    padding: 0,
    position: "relative",
    transition: "border-color 0.2s, transform 0.2s",
    borderRadius: "1px",
    overflow: "hidden",
  },
  thumbActive: {
    borderColor: "#8b6f47",
    transform: "translateY(-3px)",
    boxShadow: "0 4px 12px #8b6f4728",
  },
  thumbHover: {
    borderColor: "#b0a898",
    transform: "translateY(-2px)",
  },
  thumbImg: {
    display: "block",
    width: "100%",
    aspectRatio: "4/3",
    objectFit: "cover",
    transition: "opacity 0.2s",
  },
  activeBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "#8b6f47",
  },
  thumbLabel: {
    display: "block",
    fontSize: "8px",
    letterSpacing: "0.25em",
    color: "#9a9088",
    textAlign: "center",
    padding: "5px 0 6px",
    background: "#faf8f5",
    textTransform: "uppercase",
  },
};

const css = `
  .strip::-webkit-scrollbar { display: none; }

  .main-img {
    animation: fadeIn 0.35s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(1.015); }
    to   { opacity: 1; transform: scale(1); }
  }

  .thumb-btn img { opacity: 0.7; }
  .thumb-btn:hover img, .thumb-btn.active img { opacity: 1; }

  .predict-btn:hover:not(:disabled) {
    background: #4a3c34 !important;
    transform: translateY(-1px);
  }
  .predict-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spinner { animation: spin 0.7s linear infinite; }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.15); opacity: 0.5; }
  }
  .pulse-ring { animation: pulse 1.4s ease-in-out infinite; }

  .pred-card {
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
