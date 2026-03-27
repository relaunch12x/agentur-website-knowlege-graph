import { useState } from "react";

interface Founder {
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  story: string[];
}

const founders: Founder[] = [
  {
    id: "raphael",
    name: "Raphael",
    role: "Gründer & System-Architekt",
    image: "/raphael.png",
    quote: "Ich habe gebaut, bevor ich validiert habe.",
    story: [
      "Nach meinem Studium habe ich als Freelancer Websites gebaut — und schnell gemerkt: Der eigentliche Hebel ist nicht die Website, sondern was dahinter passiert. Messaging. Positionierung. Daten.",
      "Also habe ich mein erstes Startup gegründet: Sportbench. Starkes Team, Finanzierung, funktionierender Prototyp. Auf dem Papier war alles richtig.",
      "Und trotzdem ist es gescheitert. Nicht weil das Produkt schlecht war — sondern weil unsere Entscheidungen auf Annahmen basierten. Als ich begriffen hatte, wie es richtig geht, war die Finanzierung aufgebraucht.",
      "Danach habe ich in einer Digitalagentur gearbeitet. Dutzende B2B-Unternehmen gesehen. Überall dasselbe Muster: Strategie ist ein Dokument. Personas sind Vermutungen. Daten liegen in Silos.",
      "Was hätte mir damals wirklich geholfen? Nicht noch ein Framework. Sondern ein System, das eine Frage beantwortet: Was davon ist ein Fakt — und was eine Annahme?",
      "Das habe ich gebaut.",
    ],
  },
  {
    id: "johannes",
    name: "Johannes",
    role: "Co-Founder & Business-Stratege",
    image: "/johannes.png",
    quote: "Die meisten treffen Entscheidungen auf Basis von Annahmen.",
    story: [
      "Gelernter Bankkaufmann, Wirtschaftsingenieur — und immer die gleiche Frage: Wie macht man ein Produkt marktfähig und lässt eine Firma gesund wachsen?",
      "Die Antwort habe ich bei Stadtbienen gefunden. Als Head of Bee2B habe ich ein B2B-Geschäftsmodell entwickelt, das heute das Hauptstandbein des Unternehmens ist. Sales, Finanzen, Strategie — alles von null aufgebaut.",
      "Dabei eine Sache über B2B-Unternehmen gelernt: Die meisten treffen Entscheidungen auf Basis von Annahmen. Und wenn es Daten gibt, werden sie so zusammengestellt, dass sie die eigene Meinung untermauern.",
      "Dann kam AI. Nicht als Hype, sondern als echte Veränderung. Websites und Content werden qualitativ massiv steigen. Wer jetzt nicht auf die neue Geschwindigkeit kommt, verliert Boden.",
      "Als Raphael mir Relaunch12x gezeigt hat, hat alles geklickt: das Produkt, das Timing, der Mehrwert. Ich hätte mir selbst so einen Partner bei Stadtbienen gewünscht — jemand, der Annahmen in Fakten verwandelt.",
      "In Raphis Expertise und Motivation zu investieren war die leichteste Entscheidung.",
    ],
  },
];

export default function GruenderstoryTabs() {
  const [activeId, setActiveId] = useState("raphael");
  const active = founders.find((f) => f.id === activeId)!;

  return (
    <div>
      {/* Tab Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "clamp(32px, 4vw, 48px)" }}>
        {founders.map((founder) => (
          <button
            key={founder.id}
            onClick={() => setActiveId(founder.id)}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: activeId === founder.id ? 600 : 400,
              color: activeId === founder.id ? "var(--color-ink)" : "var(--color-ink-light)",
              background: activeId === founder.id ? "var(--color-sand)" : "transparent",
              border: "1px solid",
              borderColor: activeId === founder.id ? "rgba(26,26,26,0.12)" : "transparent",
              borderRadius: "var(--radius-md)",
              padding: "10px 24px",
              cursor: "pointer",
              transition: "all var(--duration-normal) var(--ease-default)",
              letterSpacing: "0.01em",
            }}
          >
            {founder.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        key={activeId}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "clamp(24px, 4vw, 40px)",
          animation: "fadeIn var(--duration-normal) var(--ease-smooth)",
        }}
      >
        {/* Photo + Meta */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "clamp(100px, 16vw, 140px)",
              height: "clamp(100px, 16vw, 140px)",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid var(--color-sand-dark)",
              flexShrink: 0,
            }}
          >
            <img
              src={active.image}
              alt={`${active.name}, ${active.role} von Relaunch12x`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "1.125rem",
                color: "var(--color-ink)",
                margin: "0 0 2px",
              }}
            >
              {active.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--color-ink-light)",
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              {active.role}
            </p>
          </div>
        </div>

        {/* Quote */}
        <blockquote
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1.125rem, 1.5vw, 1.375rem)",
            color: "var(--color-ink)",
            textAlign: "center",
            padding: "clamp(16px, 2vw, 24px) 0",
            borderTop: "1px solid rgba(26,26,26,0.08)",
            borderBottom: "1px solid rgba(26,26,26,0.08)",
            margin: 0,
          }}
        >
          „{active.quote}"
        </blockquote>

        {/* Story Paragraphs */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(12px, 2vw, 20px)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {active.story.map((paragraph, i) => {
            const isLast = i === active.story.length - 1;
            return (
              <p
                key={i}
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.125rem)",
                  color: isLast ? "var(--color-ink)" : "var(--color-ink-light)",
                  lineHeight: 1.75,
                  margin: 0,
                  ...(isLast
                    ? {
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--color-ultraviolett)",
                        letterSpacing: "0.02em",
                        paddingTop: "clamp(4px, 1vw, 8px)",
                      }
                    : {}),
                }}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
