import React, { useState } from "react";
import { Sparkles, ArrowRightLeft, BookOpen, AlertCircle, HelpCircle, GraduationCap, ArrowRight } from "lucide-react";

interface ThemeItem {
  name: string;
  description: string;
  scoreA: number;
  scoreB: number;
}

interface ComparisonResult {
  bookA: { title: string; author: string; summary: string };
  bookB: { title: string; author: string; summary: string };
  themes: ThemeItem[];
  pacingA: string;
  pacingB: string;
  characterComplexity: string;
  targetAudience: string;
  discussionStarters: string[];
}

export default function ComparisonMatrix() {
  const [bookA, setBookA] = useState("");
  const [bookB, setBookB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Quick Select templates to guide users
  const TEMPLATES = [
    { a: "1984 (George Orwell)", b: "Un mundo feliz (Aldous Huxley)" },
    { a: "Pedro Páramo (Juan Rulfo)", b: "Cien años de soledad (García Márquez)" },
    { a: "Fahrenheit 451 (Ray Bradbury)", b: "Fundación (Isaac Asimov)" }
  ];

  // Static Fallbacks for beautiful offline experience if API is offline or key is missing
  const OFFLINE_FALLBACKS: Record<string, ComparisonResult> = {
    "1984 vs Un mundo feliz": {
      bookA: {
        title: "1984",
        author: "George Orwell",
        summary: "Una distopía totalitaria asfixiante centrada en el control conductual represivo, la vigilancia absoluta de las conciencias y la destrucción deliberada del lenguaje individual."
      },
      bookB: {
        title: "Un mundo feliz",
        author: "Aldous Huxley",
        summary: "Una distopía hedonista basada en la desensibilización mediante el placer sintético, el condicionamiento genético estricto y la abolición del dolor a cambio del conformismo absoluto."
      },
      themes: [
        { name: "Control del Estado", description: "1984 vigila mediante el dolor y el miedo. Un Mundo Feliz desactiva mediante el Soma y la diversión constante.", scoreA: 98, scoreB: 92 },
        { name: "Tratamiento de la Verdad", description: "Orwell reescribe los archivos del pasado para moldear el presente. Huxley ahoga la verdad en un mar de distracciones irrelevantes.", scoreA: 95, scoreB: 88 },
        { name: "Sometimiento Social", description: "En 1984 el individuo es aplastado por el Gran Hermano. En Un mundo feliz el individuo abraza voluntariamente su esclavitud biológica.", scoreA: 90, scoreB: 95 }
      ],
      pacingA: "Frenético, claustrofóbico e intensamente dramático.",
      pacingB: "Sarcástico, intelectualizado y de ritmo progresivo.",
      characterComplexity: "Winston Smith es un rebelde imperfecto dominado por el miedo, lo que lo hace profundamente humano y trágico. John el Salvaje personifica la colisión romántica e irresoluble entre el misticismo trágico y la estabilidad artificial.",
      targetAudience: "Lectores interesados en el control autoritario, el totalitarismo clásico y la soberanía del pensamiento libre en regímenes de control de masas.",
      discussionStarters: [
        "¿Es más probable un totalitarismo punitivo (Orwell) o un totalitarismo anestésico (Huxley) en nuestra sociedad hiperconectada?",
        "¿Representa el soma de Huxley una alegoría de las redes sociales y la satisfacción instantánea moderna?",
        "¿De qué manera influye la manipulación del idioma (neolengua) en la anulación de la rebeldía íntima de Winston?"
      ]
    },
    "Pedro Páramo vs Cien años de soledad": {
      bookA: {
        title: "Pedro Páramo",
        author: "Juan Rulfo",
        summary: "Una obra maestra espectral que fragmenta la cronología para retratar a Comala, un pueblo habitado por murmullos, almas en pena y el rencor acumulado de un cacique implacable."
      },
      bookB: {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        summary: "La epopeya mítica de la estirpe Buendía en Macondo, donde los milagros más asombrosos conviven pacíficamente con la política real y el inevitable bucle del eterno retorno."
      },
      themes: [
        { name: "Tratamiento de la Muerte", description: "En Rulfo los muertos flotan de manera asfixiante y no se dan cuenta de su estado. En García Márquez la muerte es una transición melancólica pero integrada en la casa.", scoreA: 99, scoreB: 78 },
        { name: "Caciquismo y Patriarcado", description: "Pedro Páramo es un rencor vivo que seca la tierra. José Arcadio Buendía es un visionario fundador devorado por la locura inventiva.", scoreA: 95, scoreB: 85 },
        { name: "Estructura Temporal", description: "Pedro Páramo es una constelación de susurros no lineales sin fronteras claras de presente/pasado. Macondo es un tiempo circular recurrente.", scoreA: 98, scoreB: 92 }
      ],
      pacingA: "Lento, denso, poético y espectral.",
      pacingB: "Fluido, exuberante, dinámico y de largo aliento generacional.",
      characterComplexity: "Pedro Páramo es una fuerza de la naturaleza motivado únicamente por un amor frustrado y destructivo. Úrsula Iguarán es el contrapeso moral que ancla la realidad mágica a la cordura práctica de la tierra.",
      targetAudience: "Amantes de la poesía narrativa, el gótico hispanoamericano profundo y la experimentación cronológica sofisticada.",
      discussionStarters: [
        "¿Qué diferencia la soledad desértica de Juan Preciado en Comala de la soledad mítica de Aureliano Buendía en Macondo?",
        "¿Es Comala un purgatorio espiritual o una representación física de la herencia colonial desolada?",
        "¿Cómo influye la escasez de adjetivos en Rulfo frente a la desbordante adjetivación de García Márquez en sus respectivas magias literarias?"
      ]
    }
  };

  const handleTemplateSelect = (a: string, b: string) => {
    // Strip author parenthesis for clean state
    const cleanA = a.split("(")[0].trim();
    const cleanB = b.split("(")[0].trim();
    setBookA(cleanA);
    setBookB(cleanB);
    setError(null);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookA.trim() || !bookB.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    
    // Simple interval animation for loader steps to make it look highly responsive and fun
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch("/api/gemini/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookA, bookB }),
      });

      const data = await response.json();

      if (!response.ok || data.fallback) {
        // Fallback to static matching or dynamic warning
        const fallbackKey = `${bookA} vs ${bookB}`;
        const alternateKey = `${bookB} vs ${bookA}`;
        
        let foundFallback = OFFLINE_FALLBACKS[fallbackKey] || OFFLINE_FALLBACKS[alternateKey];
        
        // If template doesn't match exactly, try partial match
        if (!foundFallback) {
          const keys = Object.keys(OFFLINE_FALLBACKS);
          const matchedKey = keys.find(k => 
            (k.toLowerCase().includes(bookA.toLowerCase()) && k.toLowerCase().includes(bookB.toLowerCase()))
          );
          if (matchedKey) foundFallback = OFFLINE_FALLBACKS[matchedKey];
        }

        if (foundFallback) {
          setResult(foundFallback);
          setError("Nota: Se están mostrando datos analizados previamente. Conecta tu API Key de Gemini en el panel de secretos para generar matrices literarias en tiempo real para cualquier libro del mundo.");
        } else {
          // Mock a generic premium response to simulate high quality without failing
          setResult({
            bookA: { title: bookA, author: "Autor Analizado", summary: `Un análisis original y pormenorizado del universo literario, simbolismo y estructura de ${bookA}.` },
            bookB: { title: bookB, author: "Autor Analizado", summary: `Un análisis crítico pormenorizado centrado en los tropos narrativos primordiales de ${bookB}.` },
            themes: [
              { name: "Estructura Narrativa", description: `Divergencia entre los mecanismos estilísticos empleados en ${bookA} frente al enfoque lineal de ${bookB}.`, scoreA: 85, scoreB: 70 },
              { name: "Desarrollo Temático", description: `Profundización en las preocupaciones ideológicas principales que sustentan el relato de ambas obras.`, scoreA: 90, scoreB: 80 },
              { name: "Originalidad Creativa", description: `Evaluación del valor y trascendencia histórica de los recursos narrativos de cada pieza.`, scoreA: 88, scoreB: 92 }
            ],
            pacingA: "Estilo reflexivo y adaptado al tema principal.",
            pacingB: "Ritmo fluido con contrastes dramáticos.",
            characterComplexity: "Ambos textos demuestran que la evolución interna de sus protagonistas desafía los arquetipos binarios tradicionales.",
            targetAudience: "Estudiantes universitarios, críticos literarios y entusiastas de la narrativa profunda.",
            discussionStarters: [
              `¿De qué manera influye el contexto sociocultural de ${bookA} en su resolución moral final en comparación con ${bookB}?`,
              "¿Qué personaje secundario sirve como puente de empatía en ambos relatos?"
            ]
          });
          setError("Modo Simulación: Mostrando maqueta estructural. Configura GEMINI_API_KEY en el panel de Ajustes > Secretos para habilitar la generación de análisis comparativos avanzados ilimitados de IA.");
        }
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("No se pudo conectar con la API de análisis. Mostrando análisis literario sintético pregrabado.");
      setResult(OFFLINE_FALLBACKS["1984 vs Un mundo feliz"]);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const loadingQuotes = [
    "Consultando bibliografía comparada...",
    "Mapeando matrices temáticas estructurales...",
    "Analizando profundidad psicológica de los personajes...",
    "Estructurando guía de debate de alto valor..."
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3 py-1 bg-black text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded-none border border-black">
          Herramienta Interactiva de Alta Retención
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A] mt-4 leading-tight uppercase">
          Matriz Comparativa Literaria
        </h1>
        <p className="font-sans text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Google premia la interactividad. Esta utilidad genera análisis cruzados profundos en segundos, proporcionando a tus usuarios esquemas de estudio y fichas de debate listas para imprimir que ningún competidor ofrece.
        </p>
      </div>

      {/* Grid: Inputs Form & Pre-sets selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Form */}
        <div className="bg-white p-6 rounded-none border border-gray-200 shadow-none flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-black" />
            Configurar Comparación
          </h2>

          <form onSubmit={handleCompare} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">
                Libro de Referencia (A)
              </label>
              <input
                type="text"
                value={bookA}
                onChange={(e) => setBookA(e.target.value)}
                placeholder="Ej. Cien años de soledad"
                className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-4 py-3 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <div className="flex justify-center my-1">
              <span className="p-2 bg-gray-100 rounded-none border border-gray-200">
                <ArrowRightLeft className="w-4 h-4 text-gray-500" />
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">
                Libro de Contraste (B)
              </label>
              <input
                type="text"
                value={bookB}
                onChange={(e) => setBookB(e.target.value)}
                placeholder="Ej. Pedro Páramo"
                className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-4 py-3 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black text-white font-sans text-xs font-bold uppercase tracking-widest rounded-none hover:bg-gray-800 transition-all shadow-none flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <GraduationCap className="w-4 h-4" />
              {loading ? "Cruzando Datos..." : "Cruzar Análisis Literario (IA)"}
            </button>
          </form>

          {/* Preset templates card */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-sans text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              Plantillas de Alto Valor Listas
            </h3>
            <div className="space-y-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTemplateSelect(tmpl.a, tmpl.b)}
                  className="w-full text-left p-2.5 rounded-none bg-[#F7F7F5] border border-gray-200 hover:border-black font-sans text-xs text-gray-700 hover:text-black transition-all flex items-center justify-between"
                >
                  <span className="truncate">{tmpl.a.split(" ")[0]} vs {tmpl.b.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Results dashboard / Load Screen */}
        <div className="lg:col-span-2">
          
          {loading ? (
            /* Loading micro-interaction state */
            <div className="bg-white p-8 rounded-none border border-gray-200 shadow-none min-h-[450px] flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-none animate-spin"></div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-6 tracking-tight uppercase">
                Modelando Enfoque Comparativo
              </h3>
              <p className="font-sans text-sm text-black font-semibold mt-2 animate-pulse uppercase tracking-wider">
                {loadingQuotes[loadingStep]}
              </p>
              <span className="font-sans text-xs text-gray-400 max-w-sm mt-6 leading-relaxed">
                Nuestros modelos Gemini están estructurando las conexiones narrativas para evitar duplicidad o superficialidad en los datos.
              </span>
            </div>
          ) : result ? (
            /* Matrix Result Panel */
            <div className="space-y-6">
              
              {/* Warnings/Simulation notes */}
              {error && (
                <div className="bg-gray-100 border-l-4 border-black p-4 rounded-none flex gap-3 text-xs text-gray-800 leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Nota de Optimización</span>
                    {error}
                  </div>
                </div>
              )}

              {/* Side-by-side core descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Book A Card */}
                <div className="bg-white p-6 rounded-none border border-gray-200 shadow-none relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                  <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Libro A
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                    {result.bookA.title}
                  </h3>
                  <span className="font-sans text-xs text-gray-500 block mb-3">
                    por {result.bookA.author}
                  </span>
                  <p className="font-sans text-xs text-gray-600 leading-relaxed text-justify">
                    {result.bookA.summary}
                  </p>
                </div>

                {/* Book B Card */}
                <div className="bg-white p-6 rounded-none border border-gray-200 shadow-none relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                  <span className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Libro B
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                    {result.bookB.title}
                  </h3>
                  <span className="font-sans text-xs text-gray-500 block mb-3">
                    por {result.bookB.author}
                  </span>
                  <p className="font-sans text-xs text-gray-600 leading-relaxed text-justify">
                    {result.bookB.summary}
                  </p>
                </div>

              </div>

              {/* Comparative Themes Match Bar Charts */}
              <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200 shadow-none">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase">
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  Métricas de Intersección Temática (Rigor Literario)
                </h3>
                
                <div className="space-y-6">
                  {result.themes.map((theme, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h4 className="font-sans text-sm font-bold text-gray-800">
                          {theme.name}
                        </h4>
                        <span className="font-sans text-xs text-gray-500 max-w-md sm:text-right">
                          {theme.description}
                        </span>
                      </div>
                      
                      {/* Interactive comparative double progress bar */}
                      <div className="space-y-1.5">
                        {/* Book A score */}
                        <div className="flex items-center gap-3">
                          <span className="w-24 text-[10px] font-mono text-gray-500 truncate text-right">
                            {result.bookA.title}
                          </span>
                          <div className="flex-1 bg-gray-100 h-2.5 rounded-none overflow-hidden">
                            <div
                              className="bg-black h-full rounded-none transition-all duration-1000"
                              style={{ width: `${theme.scoreA}%` }}
                            ></div>
                          </div>
                          <span className="w-8 font-mono text-[10px] font-bold text-gray-900 text-left">
                            {theme.scoreA}%
                          </span>
                        </div>

                        {/* Book B score */}
                        <div className="flex items-center gap-3">
                          <span className="w-24 text-[10px] font-mono text-gray-500 truncate text-right">
                            {result.bookB.title}
                          </span>
                          <div className="flex-1 bg-gray-100 h-2.5 rounded-none overflow-hidden">
                            <div
                              className="bg-gray-400 h-full rounded-none transition-all duration-1000"
                              style={{ width: `${theme.scoreB}%` }}
                            ></div>
                          </div>
                          <span className="w-8 font-mono text-[10px] font-bold text-gray-500 text-left">
                            {theme.scoreB}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extra literary depth breakdown (Pacing and Characters) */}
              <div className="bg-white p-6 rounded-none border border-gray-200 shadow-none space-y-4">
                <h4 className="font-serif text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 uppercase">
                  Divergencias Estructurales y Psicológicas
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <strong className="block text-gray-900 font-bold mb-1">Ritmo Comparado:</strong>
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-none text-[10px] font-semibold">
                        {result.bookA.title}: {result.pacingA}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-none text-[10px] font-semibold">
                        {result.bookB.title}: {result.pacingB}
                      </span>
                    </div>
                  </div>
                  <div>
                    <strong className="block text-gray-900 font-bold mb-1">Complejidad de Personajes:</strong>
                    <p className="text-gray-600 leading-relaxed">
                      {result.characterComplexity}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs font-sans">
                  <strong className="text-gray-900 font-bold block mb-1">Recomendación de Audiencia Cruzada:</strong>
                  <p className="text-gray-600 leading-relaxed">
                    {result.targetAudience}
                  </p>
                </div>
              </div>

              {/* Shareable printable debate guide */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-none border border-gray-200">
                <h4 className="font-serif text-xl font-bold text-gray-950 mb-4 uppercase">
                  Ficha de Debate Imprimible (Alto Valor Académico)
                </h4>
                <p className="font-sans text-xs text-gray-600 mb-4 leading-relaxed">
                  Exporta esta guía de contraste conceptual para dinamizar foros universitarios o lecturas colectivas en tu propio portal literario:
                </p>
                
                <div className="space-y-3">
                  {result.discussionStarters.map((prompt, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-none border border-gray-200 text-xs font-sans text-gray-700 leading-relaxed">
                      <strong>Pregunta 0{idx + 1}:</strong> {prompt}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Welcome / Instruction State */
            <div className="bg-[#F7F7F5] p-8 rounded-none border-2 border-dashed border-gray-300 min-h-[450px] flex flex-col justify-center items-center text-center">
              <span className="p-3 bg-white rounded-none border border-gray-200">
                <ArrowRightLeft className="w-8 h-8 text-black" />
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-6 tracking-tight uppercase">
                Esperando Configuración de Matriz
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 max-w-sm mt-2 leading-relaxed">
                Introduce dos libros en el panel de control izquierdo o selecciona una de las plantillas prediseñadas para comenzar a modelar la retención SEO.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
