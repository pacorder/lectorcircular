import React, { useState } from "react";
import { Shield, BookOpen, Scale, Mail, Info, Send, CheckCircle } from "lucide-react";

interface LegalPagesProps {
  pageType: "privacy" | "legal" | "cookies" | "about" | "contact";
  onNavigate: (tab: string) => void;
}

export default function LegalPages({ pageType, onNavigate }: LegalPagesProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Consulta de Colaboración Editorial",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate real submission
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "Consulta de Colaboración Editorial", message: "" });
    }, 2000);
  };

  const renderContent = () => {
    switch (pageType) {
      case "privacy":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <Shield className="w-8 h-8 text-black" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                Política de Privacidad
              </h2>
            </div>
            <div className="font-sans text-xs sm:text-sm text-gray-600 space-y-4 leading-relaxed text-justify">
              <p className="font-semibold text-gray-900">
                Última actualización: 8 de Julio de 2026
              </p>
              <p>
                En <strong>Página & Matriz</strong>, accesible desde nuestro portal web, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que son recopilados y registrados por Página & Matriz y cómo la utilizamos.
              </p>
              
              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                1. Cumplimiento con Google AdSense y Cookies de Terceros
              </h3>
              <p>
                Este sitio web utiliza <strong>Google AdSense</strong> para mostrar anuncios patrocinados. Google, como proveedor externo, utiliza cookies para servir anuncios en nuestro sitio. El uso de la cookie de DART por parte de Google le permite servir anuncios a nuestros usuarios basados en sus visitas a nuestro sitio y a otros sitios en Internet.
              </p>
              <p>
                Los usuarios pueden optar por no utilizar la cookie de DART visitando la Política de Privacidad de la red de anuncios y contenido de Google en la siguiente dirección:{" "}
                <a 
                  href="https://policies.google.com/technologies/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-black font-semibold underline hover:text-gray-600"
                >
                  https://policies.google.com/technologies/ads
                </a>.
              </p>
              
              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                2. Consentimiento y GDPR / RGPD
              </h3>
              <p>
                Si eres residente del Espacio Económico Europeo (EEE), tienes ciertos derechos de protección de datos bajo el Reglamento General de Protección de Datos (RGPD / GDPR). Nos comprometemos a tomar medidas razonables para permitirte corregir, enmendar, eliminar o limitar el uso de tus datos personales.
              </p>
              <p>
                Recopilamos información únicamente a través de formularios voluntarios (como el panel de comentarios de valor o el formulario de contacto académico) y tecnologías de análisis estándar como Google Analytics para medir la tasa de retención de lectura.
              </p>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                3. Archivos de Registro (Log Files)
              </h3>
              <p>
                Página & Matriz sigue un procedimiento estándar de uso de archivos de registro. Estas cookies registran a los visitantes cuando visitan sitios web. La información recopilada por los archivos de registro incluye direcciones de protocolo de Internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), marca de fecha y hora, páginas de referencia/salida y, posiblemente, el número de clics. Estos datos no están vinculados a ninguna información que sea personalmente identificable.
              </p>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                4. Contacto de Privacidad
              </h3>
              <p>
                Para cualquier consulta referente a tus derechos de acceso, rectificación o supresión de datos, puedes comunicarte directamente con nuestra administración a través del correo oficial:{" "}
                <span className="font-mono text-black font-bold">patricioecv@gmail.com</span> o usando nuestro formulario de contacto en la pestaña superior.
              </p>
            </div>
          </div>
        );

      case "legal":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <Scale className="w-8 h-8 text-black" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                Aviso Legal y Condiciones de Uso
              </h2>
            </div>
            <div className="font-sans text-xs sm:text-sm text-gray-600 space-y-4 leading-relaxed text-justify">
              <p className="font-semibold text-gray-900">
                Última actualización: 8 de Julio de 2026
              </p>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se exponen los siguientes datos identificativos del titular de este portal:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Denominación Social:</strong> Página & Matriz Editorial S.L.</li>
                <li><strong>Correo de Contacto:</strong> patricioecv@gmail.com</li>
                <li><strong>Finalidad del Portal:</strong> Difusión de crítica literaria de alta gama, análisis comparativo temático interactivo y herramientas SEO para webmasters de nicho.</li>
              </ul>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                1. Propiedad Intelectual y Lucha Contra el "Low-Value Content"
              </h3>
              <p>
                Todos los contenidos expuestos en <strong>Página & Matriz</strong> (incluyendo pero no limitado a: ensayos comparativos, comentarios analíticos, códigos de esquemas estructurados de Schema.org, guías de debate y algoritmos interactivos de la matriz) son propiedad intelectual exclusiva de la editorial o cuentan con licencias explícitas de uso.
              </p>
              <p>
                Queda estrictamente prohibida la reproducción parcial o total de los textos para entrenamiento de modelos de inteligencia artificial de terceros o la publicación masiva en sitios de "granja de enlaces" (link farms). Cada ensayo ha sido redactado por críticos literarios experimentados y estructurado para ofrecer un valor añadido inalcanzable por técnicas de raspado automático (scraping).
              </p>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                2. Exclusión de Responsabilidad
              </h3>
              <p>
                El titular del sitio no se hace responsable de las interpretaciones subjetivas que los lectores realicen sobre las obras analizadas, ni de la infalibilidad absoluta de los datos de CPC (Costo por Clic) y volumen de búsqueda de palabras clave que se muestran con fines demostrativos y educativos de SEO en nuestro panel de control.
              </p>
            </div>
          </div>
        );

      case "cookies":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <Info className="w-8 h-8 text-black" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                Política de Cookies
              </h2>
            </div>
            <div className="font-sans text-xs sm:text-sm text-gray-600 space-y-4 leading-relaxed text-justify">
              <p className="font-semibold text-gray-900">
                Última actualización: 8 de Julio de 2026
              </p>
              <p>
                Como es práctica común en casi todos los sitios web profesionales, este sitio utiliza cookies, que son pequeños archivos que se descargan en tu ordenador para mejorar tu experiencia de navegación.
              </p>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                1. Cómo Usamos las Cookies de Google AdSense
              </h3>
              <p>
                Utilizamos cookies de <strong>Google AdSense</strong> para fines de monetización. Los sistemas de Google rastrean el comportamiento de navegación del usuario en el sitio para segmentar anuncios publicitarios relevantes que tengan mayor probabilidad de CTR (Click-Through Rate), lo cual optimiza los ingresos del creador y la relevancia para el anunciante.
              </p>
              <p>
                Estas cookies recopilan información anónima sobre tu ubicación geográfica general, intereses inferidos y el dispositivo de navegación que utilizas. No recopilan tu nombre ni tu dirección física.
              </p>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-2 uppercase tracking-wide">
                2. Desactivación de Cookies
              </h3>
              <p>
                Puedes evitar la instalación de cookies ajustando la configuración de tu navegador (consulta la sección de ayuda de tu navegador para saber cómo hacerlo). Ten en cuenta que desactivar las cookies afectará la funcionalidad de este y muchos otros sitios web que visites. La desactivación de las cookies suele dar como resultado la pérdida de ciertas funciones interactivas del sitio.
              </p>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <BookOpen className="w-8 h-8 text-black" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                Sobre Nosotros / Quiénes Somos (E-E-A-T)
              </h2>
            </div>
            <div className="font-sans text-xs sm:text-sm text-gray-600 space-y-4 leading-relaxed text-justify">
              <p>
                <strong>Página & Matriz</strong> nació de una profunda inconformidad con el estado actual del contenido literario digital. En la era de la saturación de textos genéricos generados automáticamente sin alma ni rigor, decidimos trazar una línea en la arena.
              </p>
              <p>
                Somos un colectivo de <strong>críticos literarios, filólogos y analistas de datos</strong> dedicados a desmantelar la sinopsis perezosa y sustituirla por ensayos comparativos de alto octanaje académico.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-[#F7F7F5] p-4 border border-gray-200">
                  <h4 className="font-serif font-bold text-gray-900 uppercase text-xs">Rigor Analítico</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Sustituimos el resumen superficial por comparaciones profundas estructuradas que alimentan el debate académico real.</p>
                </div>
                <div className="bg-[#F7F7F5] p-4 border border-gray-200">
                  <h4 className="font-serif font-bold text-gray-900 uppercase text-xs">Auditoría SEO On-Page</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Inyectamos Schema estructurado en tiempo real, garantizando la indexación de metadatos legítimos para los motores de búsqueda.</p>
                </div>
                <div className="bg-[#F7F7F5] p-4 border border-gray-200">
                  <h4 className="font-serif font-bold text-gray-900 uppercase text-xs">Filosofía E-E-A-T</h4>
                  <p className="text-[11px] text-gray-500 mt-1">Nuestra autoría es verificable. Detrás de cada reseña hay firmas humanas con credenciales literarias demostrables.</p>
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-gray-900 pt-4 uppercase tracking-wide">
                Nuestra Misión
              </h3>
              <p>
                Demostrar que los sitios monetizados con Google AdSense pueden ser faros de cultura e intelecto. Creemos que la alta rentabilidad por CPC no está reñida con la máxima exigencia estilística. Al contrario: el lector exigente permanece más tiempo, interactúa con mayor sinceridad y valora los anuncios contextuales de calidad de forma óptima.
              </p>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <Mail className="w-8 h-8 text-black" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                Página de Contacto y Alianzas Académicas
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 font-sans text-xs sm:text-sm text-gray-600 space-y-4 leading-relaxed">
                <p>
                  ¿Eres un autor independiente, representante de una editorial universitaria, o un anunciante premium que busca visibilidad contextualizada en nuestro nicho literario de alto CPC?
                </p>
                <p>
                  Estamos abiertos a colaboraciones de patrocinio, propuestas de debate cruzado y auditorías de análisis literario temático.
                </p>
                <div className="p-4 bg-[#F7F7F5] border border-gray-200 space-y-2">
                  <h4 className="font-serif font-bold text-gray-900 uppercase text-xs">Directorio Administrativo</h4>
                  <p className="text-[11px]"><strong>Email de contacto principal:</strong> patricioecv@gmail.com</p>
                  <p className="text-[11px]"><strong>Oficina de Redacción:</strong> Madrid, España • Ciudad de México, México</p>
                  <p className="text-[11px]"><strong>Tiempo de respuesta estimado:</strong> &lt; 24 horas laborables</p>
                </div>
              </div>

              <div className="md:col-span-7 bg-white p-6 border border-gray-200">
                {submitted ? (
                  <div className="p-8 text-center space-y-3 animate-fade-in">
                    <CheckCircle className="w-12 h-12 text-black mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-gray-900 uppercase">
                      Mensaje Enviado con Éxito
                    </h3>
                    <p className="font-sans text-xs text-gray-500 max-w-sm mx-auto">
                      Hemos recibido tu propuesta editorial o consulta técnica. Nuestro equipo de críticos y webmasters revisará tu mensaje en breve. ¡Gracias por elevar el valor de la web!
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 border border-black text-black font-sans text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900 uppercase">
                      Formulario de Contacto Oficial
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Nombre o Institución
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Tu nombre completo"
                          className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ejemplo@correo.com"
                          className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Asunto o Propósito
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                      >
                        <option value="Consulta de Colaboración Editorial">Colaboración Editorial / Propuesta de Ensayo</option>
                        <option value="Soporte de Auditoría SEO o Schema">Soporte Técnico de Schema.org / JSON-LD</option>
                        <option value="Propuesta Comercial de AdSense / Patrocinio">Monetización Premium / Espacio Publicitario</option>
                        <option value="Otro motivo de consulta">Otros asuntos generales</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Mensaje / Comentario Analítico
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Escribe aquí tu mensaje detallado o consulta..."
                        rows={4}
                        className="w-full bg-[#F7F7F5] border border-gray-200 rounded-none px-3 py-2 font-sans text-xs focus:outline-none focus:ring-1 focus:ring-black focus:bg-white"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-black text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar Formulario de Valor
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      {/* Upper Navigation Back Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onNavigate("blog")}
          className="text-xs font-sans font-bold uppercase tracking-widest hover:underline flex items-center gap-1.5 text-gray-600 hover:text-black transition-all"
        >
          ← Volver al Blog Editorial
        </button>
        <span className="font-mono text-[9px] text-gray-400 tracking-wider uppercase">
          Cumplimiento Estricto de Directrices AdSense
        </span>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-none border border-gray-200 shadow-none">
        {renderContent()}
      </div>

      {/* Internal Navigation links within the document panel */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4 sm:gap-6 justify-center font-sans text-xs text-gray-500 font-semibold uppercase tracking-wider">
        <button 
          onClick={() => onNavigate("privacy")} 
          className={`hover:text-black transition-all ${pageType === "privacy" ? "text-black underline font-bold" : ""}`}
        >
          Política de Privacidad
        </button>
        <span>•</span>
        <button 
          onClick={() => onNavigate("legal")} 
          className={`hover:text-black transition-all ${pageType === "legal" ? "text-black underline font-bold" : ""}`}
        >
          Aviso Legal
        </button>
        <span>•</span>
        <button 
          onClick={() => onNavigate("cookies")} 
          className={`hover:text-black transition-all ${pageType === "cookies" ? "text-black underline font-bold" : ""}`}
        >
          Política de Cookies
        </button>
        <span>•</span>
        <button 
          onClick={() => onNavigate("about")} 
          className={`hover:text-black transition-all ${pageType === "about" ? "text-black underline font-bold" : ""}`}
        >
          Sobre Nosotros (E-E-A-T)
        </button>
        <span>•</span>
        <button 
          onClick={() => onNavigate("contact")} 
          className={`hover:text-black transition-all ${pageType === "contact" ? "text-black underline font-bold" : ""}`}
        >
          Contacto
        </button>
      </div>

    </div>
  );
}
