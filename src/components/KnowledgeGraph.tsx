import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

// --- Types ---
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  group: string;
  size: number;
  description: string;
  details?: string[];
  validation: "Recherche" | "Qualitative Daten" | "Quantitative Daten" | "Fakt" | "Bulletproof";
  confidence: number; // 0.0 to 1.0
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  strength?: number;
  relation: string; // e.g., "leitet ab", "enthält", "basiert auf", "validiert durch", "informiert"
}

// --- Data ---
const nodes: GraphNode[] = [
  // Central Node
  {
    id: "kg",
    label: "Knowledge Graph",
    group: "core",
    size: 42,
    description: "Dein gesamtes Unternehmenswissen — strukturiert, verbunden, validiert.",
    details: ["342 validierte Fakten", "89 getestete Annahmen", "12 Datenquellen"],
    validation: "Bulletproof",
    confidence: 0.95,
  },

  // Positionierung Cluster
  {
    id: "pos",
    label: "Positionierung",
    group: "positionierung",
    size: 28,
    description: "Marktposition basierend auf validiertem Wissen.",
    details: ["USP: Wissenssystem statt Agentur", "3 Differenzierungsmerkmale", "Validiert durch 60-Fragen-Audit"],
    validation: "Fakt",
    confidence: 0.91,
  },
  {
    id: "usp",
    label: "USP",
    group: "positionierung",
    size: 16,
    description: "Alleinstellungsmerkmal aus Marktanalyse abgeleitet.",
    details: ["Knowledge Graph als Kern", "Loop statt Projekt"],
    validation: "Quantitative Daten",
    confidence: 0.87,
  },
  {
    id: "wettbewerb",
    label: "Wettbewerb",
    group: "positionierung",
    size: 14,
    description: "12 direkte Wettbewerber analysiert und kategorisiert.",
    details: ["4 Full-Service-Agenturen", "5 SEO-Spezialisten", "3 Beratungen"],
    validation: "Quantitative Daten",
    confidence: 0.89,
  },
  {
    id: "markt",
    label: "Marktanalyse",
    group: "positionierung",
    size: 12,
    description: "B2B SaaS/IT-Markt, DACH-Region.",
    validation: "Recherche",
    confidence: 0.72,
  },

  // Zielgruppen Cluster
  {
    id: "zg",
    label: "Zielgruppen",
    group: "zielgruppen",
    size: 26,
    description: "3 validierte Personas aus 60-Fragen-Audit.",
    details: ["GF/Inhaber (Primär)", "CMO/Marketing-Leiter", "Head of Growth"],
    validation: "Fakt",
    confidence: 0.93,
  },
  {
    id: "persona1",
    label: "GF / Inhaber",
    group: "zielgruppen",
    size: 18,
    description: "Primäre Persona: GF eines B2B-Unternehmens, 5–50 MA.",
    details: ["Alter: 35–50", "Pain: keine Marketing-Kompetenz", "Budget: 30–80k"],
    validation: "Qualitative Daten",
    confidence: 0.85,
  },
  {
    id: "persona2",
    label: "CMO",
    group: "zielgruppen",
    size: 14,
    description: "Marketing-Leiter sucht datengetriebenen Partner.",
    details: ["Alter: 30–45", "Pain: schlechte Agentur-Erfahrung", "Entscheider: Ja"],
    validation: "Qualitative Daten",
    confidence: 0.82,
  },
  {
    id: "painpoints",
    label: "Pain Points",
    group: "zielgruppen",
    size: 12,
    description: "Validierte Schmerzpunkte der Zielgruppe.",
    details: ["Veraltete Website", "SEO auf kaputtem Fundament", "Entscheidungen auf Annahmen"],
    validation: "Fakt",
    confidence: 0.91,
  },

  // SEO Cluster
  {
    id: "seo",
    label: "SEO-Strategie",
    group: "seo",
    size: 24,
    description: "Content-Strategie aus Knowledge Graph abgeleitet.",
    details: ["142 Keywords identifiziert", "28 mit Ranking-Potenzial", "6 Pillar Pages geplant"],
    validation: "Quantitative Daten",
    confidence: 0.88,
  },
  {
    id: "keywords",
    label: "Keywords",
    group: "seo",
    size: 14,
    description: "Keyword-Cluster nach Suchintention gruppiert.",
    details: ["Transaktional: 34", "Informational: 89", "Navigational: 19"],
    validation: "Quantitative Daten",
    confidence: 0.92,
  },
  {
    id: "content",
    label: "Content-Plan",
    group: "seo",
    size: 16,
    description: "Redaktionsplan basierend auf Keyword-Gaps.",
    details: ["12 Landingpages", "24 Blog-Artikel", "6 Pillar Pages"],
    validation: "Qualitative Daten",
    confidence: 0.78,
  },
  {
    id: "gaps",
    label: "Content Gaps",
    group: "seo",
    size: 11,
    description: "Lücken im Vergleich zu Top-3-Wettbewerbern.",
    validation: "Recherche",
    confidence: 0.74,
  },

  // Branding Cluster
  {
    id: "brand",
    label: "Branding",
    group: "branding",
    size: 22,
    description: "Visuelle und verbale Identität aus Positionierung abgeleitet.",
    details: ["Designsystem definiert", "Brand Voice Guidelines", "Farbpalette: Sand + Ultraviolett"],
    validation: "Fakt",
    confidence: 0.90,
  },
  {
    id: "voice",
    label: "Brand Voice",
    group: "branding",
    size: 14,
    description: "Direkt, konkret, editorial, ruhig.",
    details: ["Tonalität: Selbstbewusst", "Anrede: Du", "Keine Buzzwords"],
    validation: "Fakt",
    confidence: 0.93,
  },
  {
    id: "design",
    label: "Designsystem",
    group: "branding",
    size: 14,
    description: "Typografie, Farben, Spacing — alles aus Brand abgeleitet.",
    details: ["Source Serif 4 + Inter", "Sand + Ultraviolett", "Editorial Grid"],
    validation: "Bulletproof",
    confidence: 0.96,
  },
  {
    id: "messaging",
    label: "Messaging",
    group: "branding",
    size: 16,
    description: "Kernbotschaften und Messaging-Hierarchie.",
    details: ["Tagline: From 1 to X", "Problem: Hoffnung ist keine Strategie", "Proof: 60 Fragen. 1 Knowledge Graph."],
    validation: "Qualitative Daten",
    confidence: 0.84,
  },

  // Kampagnen Cluster
  {
    id: "kampagnen",
    label: "Kampagnen",
    group: "kampagnen",
    size: 22,
    description: "Laufende und geplante Marketing-Kampagnen.",
    details: ["LinkedIn Outreach (aktiv)", "SEO Content Sprint (Q2)", "Webinar-Serie (geplant)"],
    validation: "Recherche",
    confidence: 0.68,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    group: "kampagnen",
    size: 14,
    description: "Content-Strategie: Frequenzwechsel statt Lautstärke.",
    details: ["3 Posts/Woche", "Behind the Process: 35%", "Fakten vs. Annahmen: 25%"],
    validation: "Qualitative Daten",
    confidence: 0.76,
  },
  {
    id: "hypothesen",
    label: "Hypothesen",
    group: "kampagnen",
    size: 12,
    description: "Aktive Tests und validierte Hypothesen.",
    details: ["14 aktive Tests", "8 validiert", "6 widerlegt"],
    validation: "Quantitative Daten",
    confidence: 0.83,
  },

  // Website Cluster
  {
    id: "website",
    label: "Website",
    group: "website",
    size: 24,
    description: "Astro-basierte Website — neue Landingpage am selben Tag.",
    details: ["8 Seiten live", "Core Web Vitals: 98/100", "Astro + React + Tailwind"],
    validation: "Bulletproof",
    confidence: 0.97,
  },
  {
    id: "landingpages",
    label: "Landingpages",
    group: "website",
    size: 14,
    description: "Conversion-optimierte Seiten aus Content-Plan.",
    details: ["4 live", "8 geplant", "A/B-Tests aktiv"],
    validation: "Quantitative Daten",
    confidence: 0.86,
  },
  {
    id: "tracking",
    label: "Tracking",
    group: "website",
    size: 14,
    description: "Umfassendes Tracking über PostHog + GSC.",
    details: ["PostHog Events", "Google Search Console", "Conversion-Tracking"],
    validation: "Bulletproof",
    confidence: 0.98,
  },
  {
    id: "architektur",
    label: "Architektur",
    group: "website",
    size: 11,
    description: "Agile Astro-Architektur für schnelle Iterationen.",
    validation: "Fakt",
    confidence: 0.94,
  },
];

const links: GraphLink[] = [
  // Core connections
  { source: "kg", target: "pos", strength: 0.8, relation: "leitet ab" },
  { source: "kg", target: "zg", strength: 0.8, relation: "definiert" },
  { source: "kg", target: "seo", strength: 0.8, relation: "leitet ab" },
  { source: "kg", target: "brand", strength: 0.8, relation: "leitet ab" },
  { source: "kg", target: "kampagnen", strength: 0.7, relation: "informiert" },
  { source: "kg", target: "website", strength: 0.7, relation: "steuert" },

  // Positionierung
  { source: "pos", target: "usp", relation: "enthält" },
  { source: "pos", target: "wettbewerb", relation: "basiert auf" },
  { source: "pos", target: "markt", relation: "basiert auf" },
  { source: "pos", target: "brand", relation: "informiert" },

  // Zielgruppen
  { source: "zg", target: "persona1", relation: "enthält" },
  { source: "zg", target: "persona2", relation: "enthält" },
  { source: "zg", target: "painpoints", relation: "validiert durch" },
  { source: "zg", target: "seo", relation: "informiert" },
  { source: "persona1", target: "painpoints", relation: "hat" },

  // SEO
  { source: "seo", target: "keywords", relation: "enthält" },
  { source: "seo", target: "content", relation: "leitet ab" },
  { source: "seo", target: "gaps", relation: "identifiziert" },
  { source: "content", target: "website", relation: "liefert an" },
  { source: "keywords", target: "content", relation: "informiert" },

  // Branding
  { source: "brand", target: "voice", relation: "enthält" },
  { source: "brand", target: "design", relation: "enthält" },
  { source: "brand", target: "messaging", relation: "leitet ab" },
  { source: "messaging", target: "kampagnen", relation: "steuert" },
  { source: "voice", target: "content", relation: "formt" },

  // Kampagnen
  { source: "kampagnen", target: "linkedin", relation: "enthält" },
  { source: "kampagnen", target: "hypothesen", relation: "generiert" },
  { source: "hypothesen", target: "kg", relation: "validiert" },

  // Website
  { source: "website", target: "landingpages", relation: "enthält" },
  { source: "website", target: "tracking", relation: "enthält" },
  { source: "website", target: "architektur", relation: "basiert auf" },
  { source: "tracking", target: "hypothesen", relation: "liefert Daten für" },
  { source: "landingpages", target: "seo", relation: "optimiert für" },
];

// --- Group Colors ---
const groupColors: Record<string, string> = {
  core: "#2400E5",
  positionierung: "#6b5ce7",
  zielgruppen: "#3b82f6",
  seo: "#0ea5e9",
  branding: "#8b5cf6",
  kampagnen: "#a855f7",
  website: "#6366f1",
};

const validationColors: Record<string, string> = {
  "Recherche": "#f59e0b",        // amber
  "Qualitative Daten": "#3b82f6", // blue
  "Quantitative Daten": "#0ea5e9", // sky
  "Fakt": "#22c55e",              // green
  "Bulletproof": "#2400E5",       // ultraviolett
};

const validationIcons: Record<string, string> = {
  "Recherche": "◔",
  "Qualitative Daten": "◑",
  "Quantitative Daten": "◕",
  "Fakt": "●",
  "Bulletproof": "◉",
};

// Get relations for a specific node from the links array
function getNodeRelations(nodeId: string, allLinks: GraphLink[], allNodes: GraphNode[]): Array<{ targetId: string; targetLabel: string; targetGroup: string; relation: string }> {
  const relations: Array<{ targetId: string; targetLabel: string; targetGroup: string; relation: string }> = [];
  allLinks.forEach((link) => {
    const srcId = typeof link.source === "string" ? link.source : link.source.id;
    const tgtId = typeof link.target === "string" ? link.target : link.target.id;
    if (srcId === nodeId) {
      const targetNode = allNodes.find((n) => n.id === tgtId);
      if (targetNode) relations.push({ targetId: tgtId, targetLabel: targetNode.label, targetGroup: targetNode.group, relation: (link as any).relation || "verbunden" });
    }
    if (tgtId === nodeId) {
      const sourceNode = allNodes.find((n) => n.id === srcId);
      if (sourceNode) relations.push({ targetId: srcId, targetLabel: sourceNode.label, targetGroup: sourceNode.group, relation: (link as any).relation || "verbunden" });
    }
  });
  return relations;
}

// --- Component ---
export default function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.min(rect.width * 0.65, 700),
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll("*").remove();

    // Clone data for D3 mutation
    const nodeData: GraphNode[] = nodes.map((d) => ({ ...d }));
    const linkData: GraphLink[] = links.map((d) => ({ ...d }));

    // Create simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodeData)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(linkData)
          .id((d) => d.id)
          .distance((d) => {
            const src = d.source as GraphNode;
            const tgt = d.target as GraphNode;
            return 80 + (60 - (src.size + tgt.size) / 2) * 1.5;
          })
          .strength((d) => (d as GraphLink).strength || 0.4)
      )
      .force("charge", d3.forceManyBody().strength(-300).distanceMax(400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<GraphNode>().radius((d) => d.size + 8))
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    // Container group for zoom
    const g = svg.append("g");

    // Zoom behavior — only pinch/ctrl+scroll, NOT regular scroll
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .filter((event) => {
        // Allow pinch (touch) and ctrl+scroll, block regular scroll
        if (event.type === "wheel") {
          return event.ctrlKey || event.metaKey;
        }
        // Allow all other events (drag, touch pinch, dblclick)
        return true;
      })
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Links
    const link = g
      .append("g")
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(linkData)
      .join("line")
      .attr("stroke", "rgba(245, 240, 232, 0.08)")
      .attr("stroke-width", 1);

    // Node groups
    const node = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodeData)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node glow (for core node)
    node
      .filter((d) => d.group === "core")
      .append("circle")
      .attr("r", (d) => d.size + 12)
      .attr("fill", "none")
      .attr("stroke", groupColors.core)
      .attr("stroke-width", 2)
      .attr("opacity", 0.3)
      .style("animation", "pulse 3s ease-in-out infinite");

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => {
        const color = groupColors[d.group] || "#6366f1";
        return d.group === "core" ? color : color;
      })
      .attr("fill-opacity", (d) => (d.group === "core" ? 1 : 0.85))
      .attr("stroke", (d) => groupColors[d.group] || "#6366f1")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.5);

    // Node labels
    node
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.size + 16)
      .attr("fill", "rgba(245, 240, 232, 0.7)")
      .attr("font-size", (d) => (d.size > 20 ? "12px" : "10px"))
      .attr("font-family", "'Inter', sans-serif")
      .attr("font-weight", (d) => (d.size > 20 ? "500" : "400"))
      .attr("pointer-events", "none");

    // Core node label inside
    node
      .filter((d) => d.group === "core")
      .append("text")
      .text("KG")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#f5f0e8")
      .attr("font-size", "14px")
      .attr("font-family", "'JetBrains Mono', monospace")
      .attr("font-weight", "700")
      .attr("pointer-events", "none");

    // Hover interactions
    node
      .on("mouseenter", function (event, d) {
        // Highlight node
        d3.select(this)
          .select("circle:not(:first-child), circle")
          .transition()
          .duration(200)
          .attr("r", d.size * 1.2)
          .attr("fill-opacity", 1);

        // Highlight connected links
        link
          .transition()
          .duration(200)
          .attr("stroke", (l) => {
            const src = (l.source as GraphNode).id;
            const tgt = (l.target as GraphNode).id;
            return src === d.id || tgt === d.id
              ? "rgba(36, 0, 229, 0.5)"
              : "rgba(245, 240, 232, 0.04)";
          })
          .attr("stroke-width", (l) => {
            const src = (l.source as GraphNode).id;
            const tgt = (l.target as GraphNode).id;
            return src === d.id || tgt === d.id ? 2 : 1;
          });

        // Dim unconnected nodes
        const connectedIds = new Set<string>();
        connectedIds.add(d.id);
        linkData.forEach((l) => {
          const src = (l.source as GraphNode).id;
          const tgt = (l.target as GraphNode).id;
          if (src === d.id) connectedIds.add(tgt);
          if (tgt === d.id) connectedIds.add(src);
        });

        node
          .transition()
          .duration(200)
          .attr("opacity", (n) => (connectedIds.has(n.id) ? 1 : 0.2));

        // Tooltip
        const svgRect = svgRef.current!.getBoundingClientRect();
        setTooltipPos({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top - 20,
        });
        setHoveredNode(d);
      })
      .on("mousemove", function (event) {
        const svgRect = svgRef.current!.getBoundingClientRect();
        setTooltipPos({
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top - 20,
        });
      })
      .on("mouseleave", function () {
        // Reset all
        node
          .transition()
          .duration(300)
          .attr("opacity", 1);

        node
          .selectAll("circle")
          .transition()
          .duration(300)
          .attr("r", function () {
            const parentData = d3.select(this.parentNode as SVGGElement).datum() as GraphNode;
            const isGlow =
              d3.select(this).attr("fill") === "none";
            return isGlow ? parentData.size + 12 : parentData.size;
          })
          .attr("fill-opacity", function () {
            const parentData = d3.select(this.parentNode as SVGGElement).datum() as GraphNode;
            return parentData.group === "core" ? 1 : 0.85;
          });

        link
          .transition()
          .duration(300)
          .attr("stroke", "rgba(245, 240, 232, 0.08)")
          .attr("stroke-width", 1);

        setHoveredNode(null);
      });

    // Simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Add CSS animation for pulse
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; r: ${42 + 12}; }
        50% { opacity: 0.6; r: ${42 + 18}; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      simulation.stop();
      style.remove();
    };
  }, [dimensions]);

  // Scroll-driven zoom + physics nudge
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = window.scrollY;
    let nudgeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      // --- Visual zoom ---
      const rect = container.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(viewportCenter - elementCenter);
      const maxDistance = window.innerHeight;

      const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
      const scale = 1 + 0.5 * (1 - normalizedDistance) * (1 - normalizedDistance);

      container.style.transform = `scale(${scale})`;
      container.style.transformOrigin = "center center";

      // --- Physics nudge: give D3 simulation a kick on scroll ---
      const sim = simulationRef.current;
      if (!sim) return;

      const scrollDelta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;

      // Only nudge if graph is somewhat visible and there's actual scroll movement
      if (Math.abs(scrollDelta) > 2 && normalizedDistance < 0.8) {
        // Restart simulation with low alpha — nodes jiggle gently
        sim.alpha(0.08).restart();

        // Stop it again after a short moment so it settles
        if (nudgeTimeout) clearTimeout(nudgeTimeout);
        nudgeTimeout = setTimeout(() => {
          sim.alphaTarget(0);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (nudgeTimeout) clearTimeout(nudgeTimeout);
    };
  }, []);

  // Compute relations for hovered node using the ORIGINAL arrays
  const hoveredRelations = hoveredNode
    ? getNodeRelations(hoveredNode.id, links, nodes)
    : [];
  const displayedRelations = hoveredRelations.slice(0, 6);
  const extraRelationsCount = hoveredRelations.length - 6;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ transition: "transform 0.1s linear", willChange: "transform" }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        style={{ maxHeight: "700px", touchAction: "pan-y" }}
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="pointer-events-none absolute z-30 max-w-sm"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="rounded-lg border px-4 py-3"
            style={{
              background: "rgba(26, 26, 26, 0.95)",
              borderColor: groupColors[hoveredNode.group] || "#6366f1",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header: Group tag + Confidence bar */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: groupColors[hoveredNode.group] || "#6366f1",
                  }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: groupColors[hoveredNode.group] || "#6366f1",
                  }}
                >
                  {hoveredNode.group}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "rgba(245, 240, 232, 0.6)",
                  }}
                >
                  {hoveredNode.confidence.toFixed(2)}
                </span>
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "80px",
                    height: "4px",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${hoveredNode.confidence * 100}%`,
                      background: validationColors[hoveredNode.validation] || "#6366f1",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h4
              className="text-sm font-semibold mb-1"
              style={{
                color: "#f5f0e8",
                fontFamily: "'Source Serif 4', serif",
              }}
            >
              {hoveredNode.label}
            </h4>

            {/* Description */}
            <p
              className="text-xs leading-relaxed mb-2"
              style={{ color: "rgba(245, 240, 232, 0.7)" }}
            >
              {hoveredNode.description}
            </p>

            {/* Details */}
            {hoveredNode.details && (
              <ul className="space-y-0.5 mb-2">
                {hoveredNode.details.map((detail, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "rgba(245, 240, 232, 0.55)" }}
                  >
                    <span
                      style={{
                        color: groupColors[hoveredNode.group],
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "9px",
                      }}
                    >
                      ▸
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}

            {/* Validation badge */}
            <div className="mb-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: `${validationColors[hoveredNode.validation] || "#6366f1"}26`,
                  color: validationColors[hoveredNode.validation] || "#6366f1",
                }}
              >
                {validationIcons[hoveredNode.validation] || "●"} {hoveredNode.validation}
              </span>
            </div>

            {/* Relations */}
            {hoveredRelations.length > 0 && (
              <div>
                <span
                  className="block text-xs mb-1.5"
                  style={{
                    color: "rgba(245, 240, 232, 0.4)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Relationen:
                </span>
                <div className="flex flex-wrap gap-1">
                  {displayedRelations.map((rel, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs"
                      style={{
                        background: `${groupColors[rel.targetGroup] || "#6366f1"}26`,
                        color: "rgba(245, 240, 232, 0.7)",
                      }}
                    >
                      <span style={{ color: "rgba(245, 240, 232, 0.4)" }}>{rel.relation}</span>
                      <span style={{ color: "rgba(245, 240, 232, 0.4)" }}>&rarr;</span>
                      {rel.targetLabel}
                    </span>
                  ))}
                  {extraRelationsCount > 0 && (
                    <span
                      className="inline-flex items-center rounded px-1.5 py-0.5 text-xs"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "rgba(245, 240, 232, 0.4)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      +{extraRelationsCount}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile hint */}
      <p
        className="mt-3 text-center text-xs sm:hidden"
        style={{
          color: "rgba(245, 240, 232, 0.4)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Tippe auf Nodes für Details. Ziehe zum Verschieben.
      </p>
      <p
        className="mt-3 text-center text-xs hidden sm:block"
        style={{
          color: "rgba(245, 240, 232, 0.3)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        Hover für Details · Drag zum Verschieben · Scroll zum Zoomen
      </p>
    </div>
  );
}
