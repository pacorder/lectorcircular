import React, { useState } from "react";
import { 
  COMPETITOR_ANALYSIS, 
  NICHE_KEYWORDS_STRATEGY 
} from "../data";
import { NicheKeyword } from "../types";
import { 
  BarChart3, Globe, ShieldAlert, Sparkles, AlertCircle, 
  Search, ArrowRight, Clipboard, Check, Lightbulb, ListCollapse 
} from "lucide-react";

interface SeoOutlineResult {
  keyword: string;
  recommendedTitle: string;
  searchIntent: string;
  cpcPotential: string;
  structuralOutline: string[];
  secondaryKeywords: string[];
  highValueExplanation: string;
  adPlacementSuggestions: string[];
}

export default function SeoDashboard() {
  const [competitors] = useState(COMPETITOR_ANALYSIS);
  const [keywords] = useState<NicheKeyword[]>(NICHE_KEYWORDS_STRATEGY);
  const [selectedKeyword, setSelectedKeyword] = useState<NicheKeyword | null>(null);
  
  const [customKeyword, setCustomKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outline, setOutline] = useState<SeoOutlineResult | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Ready offline outlines matching NICHE_KEYWORDS_STRATEGY for flawless offline experience
  const OFFLINE_OUTLINES: Record<string, SeoOutlineResult> = {
    "existencialismo crimen y castigo analisis": {
      keyword: "existencialismo crimen y castigo analisis",
      recommendedTitle: "El Existencialismo en Crimen y Castigo: Análisis del Nihilismo de Raskólnikov",
      searchIntent: "Informational (Alto tiempo de retención)",
      cpcPotential: "$1.15 USD",
      structuralOutline: [
        "H1: El Existencialismo en Crimen y Castigo: Más allá del Racionalismo",
        "H2: San Petersburgo como Cárcel Psicológica y Moral de Raskólnikov",
        "H3: La Teoría del Hombre Extraordinario: ¿Por qué Napoleón?",
        "H2: La Caída Ontológica: El Aislamiento de la Humanidad tras el Crimen",
        "H2: Sonia Semiónovna: La Compasión activa contra el Nihilismo de los Fuertes",
        "H2: FAQ y Preguntas de Discusión en Clubes de Lectura"
      ],
      secondaryKeywords: ["nihilismo dostoievski", "raskolnikov napoleon teorias", "crimen y castigo analisis filosofico"],
      highValueExplanation: "Esta estructura huye de las simples sinopsis de personajes que plagan internet y se centra en las tensiones filosóficas entre Dostoyevski y los utilitaristas rusos de 1860, lo que garantiza el interés genuino de profesores y alumnos universitarios aumentando el dwell time en tu página.",
      adPlacementSuggestions: [
        "Anuncio superior adaptable justo debajo de la introducción filosófica.",
        "Anuncio in-feed nativo de 336x280 antes de abordar la 'Teoría de Napoleón'.",
        "Bloque Matched Content (Contenido coincidente) al pie, al costado de las FAQs estructuradas."
      ]
    },
    "ecologia de Dune ciencia ficcion": {
      keyword: "ecologia de Dune ciencia ficcion",
      recommendedTitle: "La Ecología en Dune: Frank Herbert y las Raíces Científicas del Arrakis de Ficción",
      searchIntent: "Informational (Tráfico de alto volumen y nicho)",
      cpcPotential: "$1.45 USD",
      structuralOutline: [
        "H1: La Ecología en Dune: Frank Herbert y las Raíces Científicas de Arrakis",
        "H2: Dune como Obra Fundadora del Cli-Fi (Ficción Climática)",
        "H3: Truchas de Arena y Gusanos: La Simbiosis en Circuito Cerrado",
        "H2: Pardot Kynes: El Ecólogo como Verdadero Profeta Contra el Extractivismo",
        "H2: Lecciones del Desierto de Ficción para el Cambio Climático Global",
        "H2: Preguntas de Debate Ecológico de Dune"
      ],
      secondaryKeywords: ["ecologia de sistemas frank herbert", "clifi dune", "arrakis ecosistema analisis"],
      highValueExplanation: "Articula la novela como un estudio ecológico integral fundamentado en el ciclo del agua, capturando el tráfico interesado en sostenibilidad y literatura especulativa.",
      adPlacementSuggestions: [
        "Anuncio de texto nativo intercalado en la sección de simbiología del gusano de arena.",
        "Skyscraper vertical adaptable en la barra lateral derecha para leer sin distracciones en tablets."
      ]
    }
  };

  const handleKeywordClick = async (kw: NicheKeyword) => {
    setSelectedKeyword(kw);
    setLoading(true);
    setError(null);
    setOutline(null);

    try {
      const response = await fetch("/api/gemini/seo-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw.keyword }),
      });

      const data = await response.json();

      if (!response.ok || data.fallback) {
        // Fallback to pre-coded premium blueprints
        const fallbackOutline = OFFLINE_OUTLINES[kw.keyword];
        if (fallbackOutline) {
          setOutline(fallbackOutline);
          setError("Nota: Cargando esquema SEO estático optimizado. Conecta tu API Key de Gemini en Secrets para poder generar esquemas dinámicos para cualquier palabra clave imaginable.");
        } else {
          // Simulated blueprint generator
          setOutline({
            keyword: kw.keyword,
            recommendedTitle: kw.recommendedTitle,
            searchIntent: kw.searchIntent,
            cpcPotential: `$${kw.estimatedCpc.toFixed(2)} USD`,
            structuralOutline: kw.structuralOutline.map((heading, i) => i === 0 ? `H1: ${heading}` : `H2: ${heading}`),
            secondaryKeywords: [kw.keyword.split(" ")[0] + " analisis", "resumen de capitulos " + kw.keyword.split(" ")[0], "temas principales " + kw.keyword.split(" ")[0]],
            highValueExplanation: "Este enfoque aborda arquetipos narrativos y debates ideológicos ausentes en portales comerciales generales, mitigando la tasa de rebote del visitante calificado.",
            adPlacementSuggestions: [
              "Anuncio adaptable inmediatamente abajo de la introducción principal.",
              "Bloque nativo de anuncios antes de la tabla comparativa o de datos técnicos."
            ]
          });
          setError("Modo Simulación: Diseñando esquema SEO. Configura tu GEMINI_API_KEY en Ajustes > Secretos para activar el consultor SEO en tiempo real.");
        }
      } else {
        setOutline(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("No se pudo conectar con el motor SEO de Gemini. Mostrando plantilla pregrabada.");
      setOutline(OFFLINE_OUTLINES["existencialismo crimen y castigo analisis"]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customKeyword.trim()) return;
    
    const kwObj: NicheKeyword = {
      keyword: customKeyword,
      searchVolume: 500,
      difficulty: 30,
      estimatedCpc: 1.25,
      searchIntent: "Informational",
      recommendedTitle: `Análisis Crítico de: ${customKeyword}`,
      adSenseViability: "Moderate",
      structuralOutline: ["Introducción", "Desarrollo del Simbolismo", "Conclusión y Debate"]
    };

    handleKeywordClick(kwObj);
  };

  const handleCopyOutline = () => {
    if (!outline) return;
    const text = `PALABRA CLAVE: ${outline.keyword}
TÍTULO RECOMENDADO: ${outline.recommendedTitle}
CPC ESTIMADO: ${outline.cpcPotential}
ESTRUCTURA DE ENCABEZADOS:
${outline.structuralOutline.map(h => ` - ${h}`).join("\n")}
PALABRAS CLAVE SECUNDARIAS: ${outline.secondaryKeywords.join(", ")}
ARGUMENTACIÓN DE ALTO VALOR:
${outline.highValueExplanation}`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Competitor analysis header banner */}
      <div className="bg-black text-white p-6 sm:p-10 rounded-none mb-10 shadow-none border border-gray-800">
        <div className="max-w-3xl">
          <span className="px-2.5 py-1 bg-white text-black rounded-none font-mono text-[9px] font-bold uppercase tracking-widest border border-white">
            Análisis de Competencia & Estrategia de Nicho
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mt-4 leading-tight uppercase">
            Planificador Editorial y Estratégico
          </h1>
          <p className="font-sans text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Hemos analizado las debilidades de los blogs literarios genéricos hispanoamericanos para diseñar una estrategia de palabras clave con alto coste por clic (CPC) en AdSense y baja dificultad SEO (KD).
          </p>
        </div>
      </div>

      {/* Grid: Competitor Gap Analysis & KeyWord Strategy Table */}
      <div className="space-y-10">
        
        {/* SECTION: Competitor analysis cards */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase">
            <Globe className="w-5.5 h-5.5 text-black" />
            Análisis de Competencia: Brechas de Contenido (Content Gap)
          </h2>
          <p className="font-sans text-xs text-gray-500 max-w-2xl leading-relaxed">
            Identificamos por qué los grandes portales son vulnerables. Sus sinopsis superficiales son detectadas como "thin content" por Google AdSense, abriendo un canal para que tu contenido estructurado los reemplace en las primeras posiciones.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competitors.map((comp, idx) => (
              <div key={idx} className="bg-white p-6 rounded-none border border-gray-200 shadow-none relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 uppercase">
                    {comp.name}
                  </h3>
                  <a href="#" className="font-mono text-[10px] text-gray-400 hover:underline">{comp.url}</a>
                  
                  <div className="flex justify-between items-center mt-3 bg-[#F7F7F5] p-2 rounded-none border border-gray-200 text-[11px] font-sans">
                    <span className="text-gray-500">Tráfico: <strong>{comp.monthlyTraffic}</strong></span>
                    <span className="px-1.5 py-0.5 bg-black text-white font-bold rounded-none font-mono text-[9px] uppercase tracking-wider">
                      SEO: {comp.seoStrength}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 font-sans text-xs">
                    <div>
                      <strong className="text-gray-400 uppercase tracking-widest text-[9px] block">Enfoque Niche:</strong>
                      <p className="text-gray-700">{comp.nicheFocus}</p>
                    </div>
                    <div className="p-2.5 bg-[#F7F7F5] rounded-none border border-gray-200">
                      <strong className="text-gray-900 font-bold text-[10px] flex items-center gap-1 uppercase tracking-wider">
                        <ShieldAlert className="w-3.5 h-3.5 text-black" />
                        Debilidad (Low Value Content):
                      </strong>
                      <p className="text-gray-800 mt-0.5 text-[11px] text-justify">{comp.weakness}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-200 bg-white">
                  <strong className="text-gray-900 font-bold text-[10px] font-sans uppercase tracking-wider block mb-1">Estrategia para vencerlos:</strong>
                  <p className="font-sans text-[11px] text-gray-600 leading-relaxed text-justify">
                    {comp.beatingStrategy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: Niche Keywords & Outline planner */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table of strategic keywords */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-none border border-gray-200 shadow-none space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 uppercase">
                  <BarChart3 className="w-5 h-5 text-black" />
                  Estrategia de Palabras Clave
                </h3>
                <span className="font-sans text-xs text-gray-400">
                  Selecciona una keyword estratégica para estructurar su esquema de alto valor (IA).
                </span>
              </div>
              
              {/* Custom Keyword input */}
              <form onSubmit={handleCustomKeywordSubmit} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="Tu palabra clave..."
                  className="bg-[#F7F7F5] border border-gray-200 rounded-none px-3 py-1.5 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-black focus:bg-white w-full sm:w-36 transition-all"
                  required
                />
                <button type="submit" className="px-3 py-1.5 bg-black text-white rounded-none font-sans text-xs font-bold uppercase tracking-widest hover:bg-gray-800 flex items-center gap-1 shrink-0">
                  <Search className="w-3.5 h-3.5" />
                  Analizar
                </button>
              </form>
            </div>

            {/* Keyword Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pr-2">Palabra Clave</th>
                    <th className="pb-3 px-2 text-center">Volumen</th>
                    <th className="pb-3 px-2 text-center">Dificultad (KD)</th>
                    <th className="pb-3 px-2 text-center">AdSense CPC</th>
                    <th className="pb-3 px-2 text-center">Viabilidad</th>
                    <th className="pb-3 pl-2 text-right">Esquema</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {keywords.map((kw, i) => {
                    const isSelected = selectedKeyword?.keyword === kw.keyword;
                    return (
                      <tr 
                        key={i} 
                        className={`hover:bg-gray-50/50 transition-all ${
                          isSelected ? "bg-[#F7F7F5] font-semibold" : ""
                        }`}
                      >
                        <td className="py-3.5 pr-2">
                          <span className="block text-gray-900 font-bold font-mono">"{kw.keyword}"</span>
                          <span className="block text-gray-400 text-[10px] mt-0.5">{kw.recommendedTitle}</span>
                        </td>
                        <td className="py-3.5 px-2 text-center text-gray-600 font-mono">
                          {kw.searchVolume} / mes
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <span className="px-2 py-0.5 rounded-none font-mono font-bold text-[10px] bg-gray-100 text-gray-800">
                            {kw.difficulty} / 100
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-center text-black font-bold font-mono text-[11px]">
                          ${kw.estimatedCpc.toFixed(2)} USD
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-none font-bold uppercase tracking-widest">
                            {kw.adSenseViability}
                          </span>
                        </td>
                        <td className="py-3.5 pl-2 text-right">
                          <button
                            onClick={() => handleKeywordClick(kw)}
                            className={`p-1.5 rounded-none border transition-all ${
                              isSelected 
                                ? "bg-black text-white border-black" 
                                : "bg-white text-gray-400 border-gray-200 hover:text-gray-900 hover:border-gray-900"
                            }`}
                            title="Planificar estructura con IA"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Blueprint outline planner result */}
          <div className="lg:col-span-5">
            {loading ? (
              /* Loader */
              <div className="bg-white p-8 rounded-none border border-gray-200 shadow-none min-h-[350px] flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-none animate-spin"></div>
                <h4 className="font-serif text-xl font-bold text-gray-900 mt-5 uppercase">
                  Consultor SEO Generando Outline...
                </h4>
                <p className="font-sans text-xs text-gray-400 max-w-xs mt-2">
                  Estructurando encabezados H1-H3 e identificando intenciones de búsqueda transaccionales con baja competencia...
                </p>
              </div>
            ) : outline ? (
              /* Content Outline layout */
              <div className="space-y-4">
                
                {/* Fallback warning alert if needed */}
                {error && (
                  <div className="bg-gray-100 border-l-4 border-black p-3 rounded-none flex gap-2 text-[11px] text-gray-800 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-black shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Main Outline Card */}
                <div className="bg-white p-6 rounded-none border border-gray-200 shadow-none space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                  
                  <div className="flex justify-between items-start gap-4 border-b border-gray-200 pb-3">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                        Estructura Estratégica Recomendada
                      </span>
                      <h4 className="font-serif text-lg font-bold text-gray-900 mt-0.5 leading-tight">
                        "{outline.keyword}"
                      </h4>
                    </div>
                    <button
                      onClick={handleCopyOutline}
                      className="p-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-black rounded-none flex items-center gap-1 font-sans text-[10px] font-bold uppercase tracking-wider transition-all shadow-none shrink-0"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Recommended Title */}
                  <div className="bg-[#F7F7F5] p-3 rounded-none border border-gray-200">
                    <strong className="text-gray-400 text-[9px] font-sans uppercase tracking-widest block">Título H1 Sugerido:</strong>
                    <span className="font-serif text-md font-bold text-gray-900 leading-snug block mt-0.5">
                      {outline.recommendedTitle}
                    </span>
                    <div className="flex flex-wrap gap-x-4 mt-2 font-mono text-[9px] text-gray-500">
                      <span>Intención: <strong>{outline.searchIntent}</strong></span>
                      <span>Potencial AdSense: <strong className="text-black font-bold">{outline.cpcPotential}</strong></span>
                    </div>
                  </div>

                  {/* Heading Checklist */}
                  <div className="space-y-2">
                    <strong className="text-gray-900 text-[10px] font-sans uppercase tracking-widest block flex items-center gap-1">
                      <ListCollapse className="w-3.5 h-3.5" />
                      Encabezados y Jerarquía Editorial (H1-H3):
                    </strong>
                    <div className="space-y-1.5 font-sans text-xs">
                      {outline.structuralOutline.map((heading, i) => (
                        <div key={i} className="flex gap-2 items-start py-1 px-2.5 bg-white rounded-none border border-gray-200 hover:bg-gray-50">
                          <span className="font-mono font-bold text-[10px] text-gray-400 shrink-0">
                            {heading.split(":")[0]}
                          </span>
                          <span className="text-gray-700 text-[11px] leading-tight">
                            {heading.split(":").slice(1).join(":") || heading}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary keywords */}
                  <div className="space-y-1">
                    <strong className="text-gray-900 text-[10px] font-sans uppercase tracking-widest block">Indexar Semántica Secundaria:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {outline.secondaryKeywords.map((tag, i) => (
                        <span key={i} className="font-mono text-[9px] font-bold bg-[#F7F7F5] border border-gray-200 text-gray-800 px-2 py-0.5 rounded-none">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* High Value Argumentation */}
                  <div className="p-3 bg-[#F7F7F5] rounded-none border border-gray-200 flex gap-2 font-sans text-xs text-black">
                    <Lightbulb className="w-4 h-4 text-black shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Por qué supera el Low Value Content:</strong>
                      <p className="text-[11px] text-justify leading-relaxed">{outline.highValueExplanation}</p>
                    </div>
                  </div>

                  {/* Ad placements inside this layout */}
                  <div className="pt-3 border-t border-gray-200 space-y-1.5">
                    <strong className="text-black text-[10px] font-sans uppercase tracking-widest block">Sugerencia de Ubicación de Banners AdSense:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-gray-500 font-sans text-[11px] leading-tight">
                      {outline.adPlacementSuggestions.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            ) : (
              /* Welcome instruction card */
              <div className="bg-[#F7F7F5] p-8 rounded-none border-2 border-dashed border-gray-300 min-h-[350px] flex flex-col justify-center items-center text-center">
                <span className="p-3 bg-white rounded-none border border-gray-200 text-gray-500">
                  <BarChart3 className="w-6 h-6 text-black" />
                </span>
                <h4 className="font-serif text-lg font-bold text-gray-900 mt-4 uppercase">
                  Visualizador de Estructuras Activo
                </h4>
                <p className="font-sans text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                  Haz clic en el icono de varita mágica de cualquier palabra clave de la lista o escribe una propia para recibir un plano estructural de alta retención.
                </p>
              </div>
            )}
          </div>

        </section>

      </div>

    </div>
  );
}
