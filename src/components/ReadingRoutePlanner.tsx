import React, { useState } from "react";
import { Sparkles, Navigation, Clock, GraduationCap, ArrowRight, AlertCircle, Bookmark } from "lucide-react";
import { ReadingRoute } from "../types";

export default function ReadingRoutePlanner() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<ReadingRoute | null>(null);

  // Ready-to-use premium pre-compiled curriculums for offline or fallback mode
  const CURRICULUM_PRESETS: Record<string, ReadingRoute> = {
    "Filosofía del Nihilismo Ruso": {
      nicheTopic: "Filosofía del Nihilismo Ruso en el siglo XIX",
      targetAudience: "Lectores con interés en filosofía política, existencialismo y el trasfondo social de las revoluciones rusas.",
      estimatedTotalWeeks: 12,
      steps: [
        {
          step: 1,
          bookTitle: "Padres e hijos",
          author: "Iván Turguénev",
          purpose: "Es la obra fundamental que introduce el término 'Nihilista' a través de su protagonista, Bazárov. Sirve como el mapa ideológico perfecto para entender la ruptura generacional.",
          estimatedHours: 8,
          criticalFocus: "Presta atención a cómo el utilitarismo científico rompe con las tradiciones religiosas y el misticismo del viejo orden agrario ruso."
        },
        {
          step: 2,
          bookTitle: "¿Qué hacer?",
          author: "Nikolái Chernishevski",
          purpose: "La novela 'manual' de los revolucionarios rusos de la época. Describe el 'Egoísmo Racional' como la base de la nueva moral y fue la obra predilecta que influyó directamente en Lenin.",
          estimatedHours: 12,
          criticalFocus: "Analiza el palacio de cristal como símbolo de la utopía científica racionalista y el diseño mecánico de las relaciones afectivas cooperativas."
        },
        {
          step: 3,
          bookTitle: "Crimen y castigo",
          author: "Fiódor Dostoyevski",
          purpose: "La respuesta psicológica devastadora contra el Egoísmo Racional. Dostoyevski lleva las tesis de Chernishevski al asesinato práctico para argumentar que el raciocinio no puede gobernar el alma.",
          estimatedHours: 18,
          criticalFocus: "Estudia la teoría del hombre extraordinario de Raskólnikov y compárala con el concepto de superhombre utilitario occidental."
        },
        {
          step: 4,
          bookTitle: "Los demonios",
          author: "Fiódor Dostoyevski",
          purpose: "La culminación del trayecto: el nihilismo colectivo vuelto terrorismo y anarquía conspirativa. El retrato profético de la degradación moral y social de una comunidad que rechaza todo valor fundacional.",
          estimatedHours: 24,
          criticalFocus: "Enfócate en la figura de Stavroguin como el nihilista pasivo estéril y en Verjovenski como el maquinador político amoral."
        }
      ]
    },
    "Antropoceno y Ficción Climática": {
      nicheTopic: "Evolución de la Ficción Climática (Cli-Fi)",
      targetAudience: "Lectores de ciencia ficción dura, activistas ambientales y estudiantes de ecología de sistemas.",
      estimatedTotalWeeks: 10,
      steps: [
        {
          step: 1,
          bookTitle: "La sequía",
          author: "J.G. Ballard",
          purpose: "Establece los cimientos del colapso ambiental como reflejo de la parálisis psíquica humana. Una obra precursora donde un mar de polímeros impide la evaporación del agua.",
          estimatedHours: 10,
          criticalFocus: "Observa la disolución de los límites civilizatorios a medida que la sequía física desmorona el código moral burgués de los sobrevivientes."
        },
        {
          step: 2,
          bookTitle: "Dune",
          author: "Frank Herbert",
          purpose: "La obra maestra fundacional de la ecología de sistemas. Herbert introduce por primera vez un planeta entero modelado bajo principios de escasez hídrica y terraformación generacional.",
          estimatedHours: 25,
          criticalFocus: "Sigue el plan de Pardot Kynes de 500 años y analiza la especia como una alegoría del imperialismo extractivo contemporáneo."
        },
        {
          step: 3,
          bookTitle: "El año del diluvio",
          author: "Margaret Atwood",
          purpose: "Un panorama bio-distópico donde las corporaciones biotecnológicas dominan el planeta y un diluvio sin agua (una pandemia de manipulación genética) barre a la humanidad.",
          estimatedHours: 14,
          criticalFocus: "Analiza el culto de los 'Jardineros de Dios' y su asombroso intento de conciliar la teología judeocristiana con la ciencia ecológica radical."
        }
      ]
    }
  };

  const handlePresetSelect = (key: string) => {
    setTopic(key);
    setRoute(CURRICULUM_PRESETS[key]);
    setError(null);
  };

  const handleGenerateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setRoute(null);

    try {
      const response = await fetch("/api/gemini/reading-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok || data.fallback) {
        // Fallback to presets or simulated response
        const fallbackRoute = CURRICULUM_PRESETS[topic];
        if (fallbackRoute) {
          setRoute(fallbackRoute);
          setError("Nota: Se está mostrando un plan de lectura pre-diseñado por nuestro equipo de literatura. Añade tu API Key de Gemini en el menú de Secrets para generar rutas de aprendizaje dinámicas e instantáneas para cualquier tema de nicho.");
        } else {
          // Dynamic simulation fallback
          setRoute({
            nicheTopic: topic,
            targetAudience: "Lectores autodidactas y críticos literarios interesados en la materia.",
            estimatedTotalWeeks: 8,
            steps: [
              {
                step: 1,
                bookTitle: `Introducción a: ${topic}`,
                author: "Autor de Referencia Clásico",
                purpose: "Sirve como el punto de anclaje básico y conceptual para mapear las premisas más elementales de esta corriente literaria.",
                estimatedHours: 10,
                criticalFocus: "Familiarízate con los temas recurrentes y la estética fundacional del autor principal."
              },
              {
                step: 2,
                bookTitle: `Deconstrucción Crítica de: ${topic}`,
                author: "Ensayista Contemporáneo",
                purpose: "Ofrece un punto de vista contrastante e histórico, analizando el impacto social que causó la corriente original.",
                estimatedHours: 12,
                criticalFocus: "Busca los puntos de fricción filosófica que causaron controversias en el momento de la publicación original."
              }
            ]
          });
          setError("Modo Simulación: Diseñando bosquejo estructural. Configura tu GEMINI_API_KEY en Ajustes > Secretos para habilitar la generación de currículums de lectura dinámicos en tiempo real para cualquier micro-nicho.");
        }
      } else {
        setRoute(data);
      }
    } catch (err: any) {
      console.error(err);
      setError("No se pudo conectar con el servidor de IA. Cargando plan sobre nihilismo ruso pregrabado.");
      setRoute(CURRICULUM_PRESETS["Filosofía del Nihilismo Ruso"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3 py-1 bg-black text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded-none border border-black">
          Experiencia de Usuario (UX) E-E-A-T
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1A1A1A] mt-4 leading-tight uppercase">
          Planificador de Rutas Literarias
        </h1>
        <p className="font-sans text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
          Google evalúa la "Autoridad y Confianza" (E-E-A-T) del contenido. Al ofrecer currículums estructurados de lectura en lugar de listados aleatorios de libros, transformas tu blog en una enciclopedia de referencia digna de AdSense Premium.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls & Presets */}
        <div className="lg:col-span-4 bg-white p-6 rounded-none border border-gray-200 shadow-none flex flex-col gap-6">
          <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-black" />
            Trazar Plan
          </h2>

          <form onSubmit={handleGenerateRoute} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">
                Tema de Estudio Literario
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej. Filosofía del Nihilismo Ruso"
                className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-4 py-3 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black text-white font-sans text-xs font-bold uppercase tracking-widest rounded-none hover:bg-gray-800 transition-all shadow-none flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Calculando..." : "Generar Currículum (IA)"}
            </button>
          </form>

          {/* Presets Card */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-sans text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              Temas de Estudio Listos (Demostración)
            </h3>
            <div className="space-y-2">
              {Object.keys(CURRICULUM_PRESETS).map((key, i) => (
                <button
                  key={i}
                  onClick={() => handlePresetSelect(key)}
                  className="w-full text-left p-3 rounded-none bg-[#F7F7F5] border border-gray-200 hover:border-black font-sans text-xs text-gray-700 hover:text-black transition-all flex items-center justify-between"
                >
                  <span className="truncate font-semibold">{key}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Timeline */}
        <div className="lg:col-span-8">
          
          {loading ? (
            /* Timeline Loader state */
            <div className="bg-white p-8 rounded-none border border-gray-200 shadow-none min-h-[400px] flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-none animate-spin"></div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-6 tracking-tight uppercase">
                Modelando Ruta de Aprendizaje
              </h3>
              <p className="font-sans text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
                Nuestra IA está ordenando cronológica y conceptualmente las obras para que los conceptos complejos fluyan con sentido didáctico continuo...
              </p>
            </div>
          ) : route ? (
            /* Actual Timeline Curriculum Render */
            <div className="space-y-6">
              
              {/* Warn banner if fallbacked */}
              {error && (
                <div className="bg-gray-100 border-l-4 border-black p-4 rounded-none flex gap-3 text-xs text-gray-800 leading-relaxed">
                  <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Nota de Simulación</span>
                    {error}
                  </div>
                </div>
              )}

              {/* Route Summary Metadata header */}
              <div className="bg-white p-6 sm:p-8 rounded-none border border-gray-200 shadow-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                    Ruta Educativa de Alto Impacto
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mt-1">
                    {route.nicheTopic}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mt-2 max-w-xl">
                    <strong className="text-gray-700">Público Objetivo:</strong> {route.targetAudience}
                  </p>
                </div>
                <div className="bg-[#F7F7F5] px-4 py-3 rounded-none border border-gray-200 flex flex-col justify-center items-center shrink-0 w-full sm:w-auto text-center">
                  <span className="font-mono text-[10px] text-gray-500 font-bold uppercase">Duración Sugerida</span>
                  <span className="font-sans text-xl font-extrabold text-black mt-1 flex items-center gap-1.5 uppercase">
                    <Clock className="w-5 h-5 text-black" />
                    {route.estimatedTotalWeeks} Semanas
                  </span>
                </div>
              </div>

              {/* Vertical timeline bento connectors */}
              <div className="relative border-l-2 border-gray-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
                {route.steps.map((step, idx) => (
                  <div key={idx} className="relative group">
                    
                    {/* Circle Bullet Badge with step number */}
                    <span className="absolute -left-[45px] sm:-left-[61px] top-1.5 w-10 h-10 rounded-none bg-black text-white flex justify-center items-center font-mono text-sm font-bold border-4 border-[#faf9f6] shadow-none group-hover:bg-gray-800 transition-all">
                      {step.step}
                    </span>

                    {/* Bento card detail */}
                    <div className="bg-white p-6 rounded-none border border-gray-200 shadow-none group-hover:border-black transition-all relative overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                        <div>
                          <span className="font-mono text-[9px] text-gray-400 font-bold uppercase block tracking-wider">
                            Paso Prerrequisito 0{step.step}
                          </span>
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mt-0.5 leading-tight">
                            {step.bookTitle}
                          </h4>
                          <span className="font-sans text-xs text-gray-500 font-medium">
                            por {step.author}
                          </span>
                        </div>
                        <div className="px-2.5 py-1 bg-gray-100 rounded-none text-gray-600 font-mono text-[10px] font-semibold">
                          Esfuerzo: ~{step.estimatedHours} horas
                        </div>
                      </div>

                      <div className="space-y-3 font-sans text-xs leading-relaxed text-gray-600">
                        <div>
                          <strong className="text-gray-900 font-bold block mb-0.5">Propósito Pedagógico en la Ruta:</strong>
                          <p className="text-justify">{step.purpose}</p>
                        </div>
                        
                        <div className="p-3 bg-[#F7F7F5] rounded-none border border-gray-200 flex gap-2 text-gray-700">
                          <GraduationCap className="w-5 h-5 text-black shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-gray-900 font-bold text-[11px] block mb-0.5">Foco Crítico de Análisis (Clave SEO):</strong>
                            <p className="text-[11px]">{step.criticalFocus}</p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* Welcome empty state */
            <div className="bg-[#F7F7F5] p-8 rounded-none border-2 border-dashed border-gray-300 min-h-[400px] flex flex-col justify-center items-center text-center">
              <span className="p-3 bg-white rounded-none border border-gray-200">
                <Navigation className="w-8 h-8 text-black" />
              </span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mt-6 tracking-tight uppercase">
                Generador de Mapas Conceptuales Activo
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 max-w-sm mt-2 leading-relaxed">
                Escribe un micro-nicho en el panel de control izquierdo para estructurar una ruta didáctica de aprendizaje con enlaces críticos y esfuerzos medidos.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
