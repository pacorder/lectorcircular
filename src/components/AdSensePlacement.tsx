import React, { useState } from "react";
import { Info, HelpCircle, Eye, EyeOff, Sparkles, DollarSign } from "lucide-react";

interface AdSensePlacementProps {
  type: "leaderboard" | "in-feed" | "matched-content" | "sidebar";
  cpc: number;
}

export default function AdSensePlacement({ type, cpc }: AdSensePlacementProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMockAd, setShowMockAd] = useState(true);

  // Layout info depending on the type
  const getAdDetails = () => {
    switch (type) {
      case "leaderboard":
        return {
          title: "Anuncio Adaptable Superior (Header Leaderboard)",
          size: "Ancho adaptable (ej. 728x90, 970x90)",
          placementReason: "Ubicado inmediatamente bajo el encabezado o título del artículo. Capta la atención inmediata del lector y asegura una tasa de visualización (viewability) de casi el 100%, ideal para pujas automáticas vCPM.",
          cpcBoost: "CPC alto por interés inmediato.",
          mockTitle: "La Mayor Librería de Ediciones Limitadas",
          mockSubtitle: "Encuentra ejemplares numerados de clásicos universales con envío express.",
          mockCta: "Ver Catálogo",
          mockBrand: "LiberPremium"
        };
      case "in-feed":
        return {
          title: "Anuncio de Texto/Gráfico In-Feed (Párrafos intermedios)",
          size: "Adaptable al flujo de lectura (ej. 336x280, nativo)",
          placementReason: "Incrustado de manera orgánica tras el primer o segundo subencabezado H2. Se mezcla estéticamente con el contenido editorial para conseguir un CTR (Click-Through Rate) óptimo sin irrumpir violentamente en la lectura del usuario.",
          cpcBoost: "CTR máximo debido al encuadre nativo.",
          mockTitle: "Fountain Pens & Ink - Estilo Clásico",
          mockSubtitle: "Colección de plumas de caligrafía japonesas de madera de cerezo hecha a mano.",
          mockCta: "Explorar Oferta",
          mockBrand: "KyotoCraft"
        };
      case "matched-content":
        return {
          title: "Contenido Coincidente y Enlaces Recomendados (Matched Content)",
          size: "Bloque bento multi-recomenación",
          placementReason: "Situado al final del post, adyacente a las preguntas de discusión y FAQs. Ofrece una mezcla de publicaciones propias del blog y anuncios patrocinados hiper-segmentados, disminuyendo la tasa de rebote del sitio y acumulando clics indirectos.",
          cpcBoost: "Alto volumen de páginas vistas por sesión.",
          mockTitle: "Cuadernos de Piel de Búfalo Auténtica",
          mockSubtitle: "Cosido italiano, papel de hilo de algodón de 120g para escritores exigentes.",
          mockCta: "Personalizar Cuaderno",
          mockBrand: "Muralia Leather"
        };
      case "sidebar":
        return {
          title: "Anuncio Vertical en Barra Lateral (Large Skyscraper)",
          size: "300x600 o 160x600",
          placementReason: "Fijado de manera pegajosa (sticky sidebar) en pantallas de escritorio. Permanece en el campo visual del lector mientras se desplaza a lo largo del extenso análisis literario de alto valor.",
          cpcBoost: "Excelente para campañas de branding de larga exposición.",
          mockTitle: "MasterClass: Escritura Creativa Avanzada",
          mockSubtitle: "Aprende el método de estructuración de tramas de novelistas premiados.",
          mockCta: "Acceso Gratuito",
          mockBrand: "LitAcademy"
        };
    }
  };

  const info = getAdDetails();

  return (
    <div className="my-8 border border-dashed border-gray-300 bg-gray-50/50 rounded-none overflow-hidden shadow-none transition-all">
      
      {/* Header Tag Bar */}
      <div className="bg-[#F1F1EF] px-4 py-2 border-b border-dashed border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-black animate-pulse"></span>
          <span className="font-mono text-[10px] font-bold text-gray-600 tracking-wider uppercase">
            Zona Optimizada AdSense • {info.size}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMockAd(!showMockAd)}
            className="flex items-center gap-1 text-[10px] font-sans text-gray-600 hover:text-black hover:underline bg-white px-2 py-0.5 rounded-none border border-gray-200 shadow-none"
            title="Alternar entre ver anuncio simulado o ver esqueleto técnico"
          >
            {showMockAd ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ocultar Anuncio</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Anuncio</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-1 rounded-none text-gray-500 hover:bg-gray-200 transition-all"
            title="¿Por qué este anuncio supera las políticas?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ad Body Area */}
      <div className="p-4 sm:p-6 bg-white/70 min-h-[90px] flex flex-col justify-center items-center">
        
        {showMockAd ? (
          /* Mock Creative Native Advertisement */
          <div className="w-full max-w-xl p-4 bg-[#F7F7F5] rounded-none border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-none hover:bg-white transition-all">
            <div className="flex-1">
              <span className="inline-block px-1.5 py-0.5 bg-black text-white rounded-none font-mono text-[9px] font-extrabold uppercase tracking-wide mr-2 mb-1.5 border border-black">
                Anuncio Patrocinado
              </span>
              <span className="text-xs font-mono text-gray-400 font-medium">by {info.mockBrand}</span>
              <h4 className="font-sans text-sm font-bold text-[#1A1A1A] mt-1 leading-tight">
                {info.mockTitle}
              </h4>
              <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                {info.mockSubtitle}
              </p>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <button className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-sans text-xs font-bold rounded-none transition-all shadow-none w-full sm:w-auto whitespace-nowrap">
                {info.mockCta}
              </button>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 justify-center sm:justify-start">
                <DollarSign className="w-3 h-3" />
                <span>CPC Estimado: ~${cpc.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        ) : (
          /* Technical Placement Block Frame */
          <div className="w-full py-6 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[11px] text-gray-400 uppercase tracking-widest font-bold">
              [ADSBYGOOGLE UNIT]
            </span>
            <div className="mt-2 text-xs text-gray-500 max-w-sm font-mono leading-relaxed bg-[#F7F7F5] px-4 py-2 rounded-none border border-gray-200">
              {`<!-- Página&Matriz Responsive Ad Unit -->`}
              <br/>
              {`<ins class="adsbygoogle"`}
              <br/>
              {`     style="display:block"`}
              <br/>
              {`     data-ad-client="ca-pub-XXXXXXXXXXXXXX"`}
              <br/>
              {`     data-ad-slot="YYYYYYYYYY"`}
              <br/>
              {`     data-ad-format="auto"></ins>`}
            </div>
          </div>
        )}

        {/* AdSense Optimization Strategy Explainer */}
        {showExplanation && (
          <div className="mt-4 w-full p-4 bg-[#F7F7F5] rounded-none border border-gray-200 flex gap-3 text-xs leading-relaxed text-gray-700">
            <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <strong className="font-semibold text-[#1A1A1A] font-sans">
                Estrategia Antiexclusión de Google AdSense:
              </strong>
              <p className="font-sans">
                {info.placementReason}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 pt-2 border-t border-gray-200 font-mono text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>{info.cpcBoost}</span>
                </span>
                <span>• CLS Optimizado: Sí</span>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
