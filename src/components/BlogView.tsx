import React, { useState, useEffect } from "react";
import { BlogPost } from "../types";
import { STATIC_BLOG_POSTS } from "../data";
import AdSensePlacement from "./AdSensePlacement";
import { 
  Clock, User, Calendar, BookMarked, Code, 
  MessageSquare, FileCode, CheckCircle2, Copy, Check 
} from "lucide-react";

export default function BlogView() {
  const [posts, setPosts] = useState<BlogPost[]>(STATIC_BLOG_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost>(STATIC_BLOG_POSTS[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<string, { author: string; text: string; date: string }[]>>({
    "temporalidad-cien-anos": [
      { author: "Profa. Carla Ruiz", text: "Excelente análisis comparando la temporalidad mítica con el ciclo histórico latinoamericano. Esto es lo que AdSense necesita para certificar originalidad.", date: "Hace 2 días" },
      { author: "Marcos_Reader", text: "La relación entre los nombres Aureliano y José Arcadio como variables recurrentes es brillante. Ayuda mucho a digerir la novela.", date: "Hace 1 día" }
    ],
    "ecologia-dune-herbert": [
      { author: "Ecolit_Fan", text: "Pardot Kynes siempre ha sido mi personaje favorito. Herbert tenía amigos ecólogos reales y este artículo rescata el rigor de esa inspiración.", date: "Hace 3 días" }
    ],
    "libertad-crimen-castigo": [
      { author: "Estudiante_Filo", text: "Muy bien explicado el dilema utilitario contra el imperativo categórico que Dostoyevski destapa. El formato con preguntas de discusión sirve para preparar mi clase.", date: "Hace 5 días" }
    ]
  });
  
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Dynamically inject the schema JSON-LD markup into the head of the document
  useEffect(() => {
    // Remove existing dynamic schema tags
    const existingTags = document.querySelectorAll("script[data-dynamic-schema]");
    existingTags.forEach(tag => tag.remove());

    // Inject new post schema
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-dynamic-schema", "true");
    script.text = selectedPost.schemaMarkup;
    document.head.appendChild(script);

    return () => {
      // Clean up on unmount or post switch
      script.remove();
    };
  }, [selectedPost]);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(selectedPost.schemaMarkup);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;

    const newComment = {
      author: newCommentAuthor,
      text: newCommentText,
      date: "Ahora mismo"
    };

    setComments(prev => ({
      ...prev,
      [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment]
    }));

    setNewCommentAuthor("");
    setNewCommentText("");
  };

  // Simple and highly secure custom Markdown-to-JSX renderer to handle deep headings
  const renderBlogPostContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // H3 Render
      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "");
        return (
          <h3 key={idx} id={`heading-${idx}`} className="font-serif text-2xl font-bold text-gray-900 mt-8 mb-4 tracking-tight border-l-4 border-[#1c1c1c] pl-3">
            {title}
          </h3>
        );
      }
      
      // Bold List Items
      if (trimmed.startsWith("*   **")) {
        const parts = trimmed.split("**");
        if (parts.length >= 3) {
          const boldPart = parts[1];
          const regularPart = parts.slice(2).join("**").replace(/^\s*:\s*/, "");
          return (
            <li key={idx} className="ml-6 list-disc text-gray-700 leading-relaxed my-2 font-sans text-sm">
              <strong className="text-gray-900">{boldPart}</strong>: {regularPart}
            </li>
          );
        }
      }
      
      // Standard List Items
      if (trimmed.startsWith("* ")) {
        return (
          <li key={idx} className="ml-6 list-disc text-gray-700 leading-relaxed my-2 font-sans text-sm">
            {trimmed.replace("* ", "")}
          </li>
        );
      }

      // Empty Lines
      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }

      // Paragraph Render
      return (
        <p key={idx} className="font-sans text-base text-gray-700 leading-relaxed my-4 text-justify">
          {/* Support inline bolding in paragraphs */}
          {trimmed.includes("**") ? (
            trimmed.split("**").map((chunk, i) => i % 2 === 1 ? <strong key={i} className="text-gray-900 font-semibold">{chunk}</strong> : chunk)
          ) : trimmed.includes("*") ? (
            trimmed.split("*").map((chunk, i) => i % 2 === 1 ? <em key={i} className="italic text-gray-900">{chunk}</em> : chunk)
          ) : (
            trimmed
          )}
        </p>
      );
    });
  };

  // Generate Table of Contents from headings
  const getTableOfContents = (text: string) => {
    const lines = text.split("\n");
    return lines
      .map((line, idx) => {
        if (line.trim().startsWith("### ")) {
          return {
            id: `heading-${idx}`,
            text: line.trim().replace("### ", "")
          };
        }
        return null;
      })
      .filter(Boolean) as { id: string; text: string }[];
  };

  const toc = getTableOfContents(selectedPost.content);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Blog Intro & Low Value content advice card */}
      <div className="bg-black text-white p-6 sm:p-8 rounded-none mb-10 border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <span className="bg-[#F1F1EF] text-black text-[9px] font-bold font-mono px-2.5 py-1 rounded-none uppercase tracking-widest">
            Estrategia de Valor Editorial
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl mt-3 font-semibold tracking-tight text-white leading-tight">
            Superando la Barrera de "Contenido de Bajo Valor"
          </h1>
          <p className="font-sans text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Un blog aprobado por AdSense necesita análisis profundos, formatos enriquecidos (FAQs, debates) y estructura de Schema Markup robusta en vez de reescribir sinopsis trilladas.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-white/5 px-4 py-3 rounded-none border border-white/10 flex flex-col">
            <span className="font-mono text-[10px] text-gray-400">Páginas de Ejemplo</span>
            <span className="font-sans text-xl font-bold text-white">3 Críticas</span>
          </div>
          <div className="bg-white/5 px-4 py-3 rounded-none border border-white/10 flex flex-col">
            <span className="font-mono text-[10px] text-gray-400">Schema Inyectado</span>
            <span className="font-sans text-xl font-bold text-emerald-400">Automático</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Side Post Selector / Right Side Active Reading Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-none border border-gray-200 shadow-none">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-gray-700" />
              Artículos de Nicho
            </h2>
            
            <div className="space-y-3">
              {posts.map((post) => {
                const isSelected = post.id === selectedPost.id;
                return (
                  <button
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      setActiveFaq(null);
                    }}
                    className={`w-full text-left p-4 rounded-none transition-all border ${
                      isSelected
                        ? "bg-[#F7F7F5] border-black shadow-none ring-0"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-none font-sans text-[9px] font-bold uppercase tracking-widest">
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-800 font-bold bg-[#F1F1EF] px-1.5 py-0.5 rounded-none border border-gray-200">
                        CPC: ${post.estimatedCpc.toFixed(2)}
                      </span>
                    </div>
                    
                    <h3 className="font-serif text-md font-bold text-gray-900 mt-2 leading-snug">
                      {post.title}
                    </h3>
                    
                    <p className="font-sans text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-gray-400 text-[11px] font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE OF CONTENTS - SEO Best Practice */}
          <div className="bg-[#F7F7F5] p-5 rounded-none border border-gray-200 shadow-none sticky top-24 hidden lg:block">
            <h3 className="font-sans text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">
              Tabla de Contenidos
            </h3>
            <ul className="space-y-2">
              {toc.map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.id}`}
                    className="font-sans text-xs text-gray-600 hover:text-black hover:underline transition-all block py-1"
                  >
                    • {item.text}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#seccion-debate"
                  className="font-sans text-xs text-[#b35900] hover:text-orange-800 hover:underline transition-all block py-1 font-medium"
                >
                  • Guía de Debate Literario
                </a>
              </li>
              <li>
                <a
                  href="#seccion-faq"
                  className="font-sans text-xs text-[#006644] hover:text-emerald-800 hover:underline transition-all block py-1 font-medium"
                >
                  • Preguntas Frecuentes (Schema)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Reading Pane */}
        <div className="lg:col-span-8 space-y-6">
          <article className="bg-white p-6 sm:p-10 rounded-none border border-gray-200 shadow-none">
            
            {/* Category and CPC bar */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                Categoría: {selectedPost.category}
              </span>
              <div className="flex items-center gap-1 bg-[#F1F1EF] px-2.5 py-1 rounded-none text-xs font-mono text-gray-700 border border-gray-200">
                <span>Palabra Clave Nicho:</span>
                <span className="font-bold underline text-gray-900">"{selectedPost.keywords[0]}"</span>
              </div>
            </div>

            {/* Article Main Title */}
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 mt-6 leading-tight tracking-tight">
              {selectedPost.title}
            </h1>

            {/* Author and Date metadata block */}
            <div className="flex items-center gap-4 mt-6 py-4 border-t border-b border-gray-50">
              <img
                src={selectedPost.author.avatar}
                alt={selectedPost.author.name}
                className="w-11 h-11 rounded-none object-cover border border-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <span className="block font-sans text-sm font-semibold text-gray-900">
                  {selectedPost.author.name}
                </span>
                <span className="block font-sans text-xs text-gray-400">
                  {selectedPost.author.bio}
                </span>
              </div>
              <div className="text-right text-xs font-sans text-gray-400 space-y-1">
                <span className="flex items-center justify-end gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.publishedAt}
                </span>
                <span className="flex items-center justify-end gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.readTime}
                </span>
              </div>
            </div>

            {/* AD PLACEMENT ZONE 1: Under H1 / Leaderboard */}
            <AdSensePlacement type="leaderboard" cpc={selectedPost.estimatedCpc} />

            {/* Content Body */}
            <div className="prose max-w-none mt-6">
              {renderBlogPostContent(selectedPost.content)}
            </div>

            {/* AD PLACEMENT ZONE 2: In-Feed Ad mid-way through */}
            <AdSensePlacement type="in-feed" cpc={selectedPost.estimatedCpc} />

            {/* SECTION: Interactive Study / Discussion Guide (Proof of Original Value) */}
            <section id="seccion-debate" className="mt-12 p-6 sm:p-8 bg-[#F7F7F5] rounded-none border border-gray-200 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 bg-black text-white rounded-none">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                  Guía de Debate Literario para Clubes de Lectura
                </h3>
              </div>
              <p className="font-sans text-xs text-gray-500 mb-6 leading-relaxed">
                Este blog no solo resume; fomenta el diálogo crítico. Utiliza estas preguntas generadas para detonar debates profundos en tus clases o círculos de lectura.
              </p>

              <div className="space-y-4">
                {selectedPost.discussionPrompts.map((prompt, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-4 rounded-none border border-gray-200 shadow-none">
                    <span className="font-mono text-xs font-bold text-gray-400 shrink-0 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <p className="font-sans text-sm text-gray-700 leading-relaxed font-medium">
                      {prompt}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION: Dynamic Injected Schema Markup Explainer & Visualizer */}
            <section className="mt-8 bg-[#F7F7F5] p-6 rounded-none border border-gray-200">
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileCode className="w-5 h-5 text-gray-700" />
                  <h4 className="font-serif text-lg font-bold text-gray-900">
                    SEO Técnico: Structured Data Schema.org
                  </h4>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-gray-100 text-black border border-black rounded-none font-sans text-xs font-semibold shadow-none transition-all"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar JSON-LD</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                Este artículo inyecta dinámicamente un esquema <strong className="font-bold">BlogPosting</strong> estructurado en el <code className="bg-gray-100 px-1 py-0.5 rounded-none font-mono text-[11px] text-gray-800 font-semibold">&lt;head&gt;</code> para avisar de forma inmediata a los bots de Google Search el autor real, las palabras clave exactas de nicho y el conteo de palabras genuino.
              </p>
              
              <details className="mt-3 group border-t border-gray-200 pt-3">
                <summary className="font-sans text-xs text-gray-600 cursor-pointer font-bold select-none hover:text-black">
                  Ver código JSON-LD inyectado en el DOM
                </summary>
                <pre className="mt-3 p-3 bg-gray-900 rounded-none text-[10px] text-emerald-400 font-mono overflow-x-auto leading-relaxed max-h-60 shadow-inner">
                  {selectedPost.schemaMarkup}
                </pre>
              </details>
            </section>

            {/* SECTION: Accordion FAQ (Mapped in Search Results) */}
            <section id="seccion-faq" className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-gray-700" />
                <h3 className="font-serif text-2xl font-bold text-gray-900">
                  Preguntas Frecuentes (FAQ Schema)
                </h3>
              </div>
              <p className="font-sans text-xs text-gray-500 mb-6 leading-relaxed">
                Secciones auto-identificables por buscadores. Las siguientes respuestas responden a consultas populares del motor de búsqueda:
              </p>

              <div className="space-y-3">
                {selectedPost.faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-200 rounded-none overflow-hidden transition-all shadow-none">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full text-left px-5 py-4 bg-[#F7F7F5] hover:bg-[#F1F1EF] font-sans text-sm font-semibold text-gray-900 flex justify-between items-center gap-4 transition-all animate-none"
                      >
                        <span>{faq.question}</span>
                        <span className="font-mono text-lg text-gray-400 shrink-0 select-none">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 py-4 bg-white border-t border-gray-200 font-sans text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* AD PLACEMENT ZONE 3: Bottom / Matched Content */}
            <AdSensePlacement type="matched-content" cpc={selectedPost.estimatedCpc} />

            {/* SECTION: Real-time Comments Thread */}
            <section className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Discusion de la Comunidad
              </h3>
              
              {/* Comment form */}
              <form onSubmit={handleAddComment} className="bg-[#F7F7F5] p-5 rounded-none border border-gray-200 mb-6 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newCommentAuthor}
                    onChange={(e) => setNewCommentAuthor(e.target.value)}
                    placeholder="Tu nombre o pseudónimo"
                    className="flex-1 bg-white border border-gray-200 rounded-none px-4 py-2 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Añade un análisis, duda filosófica o contraargumento al post..."
                  rows={3}
                  className="bg-white border border-gray-200 rounded-none px-4 py-2 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="self-end px-5 py-2 bg-black text-white font-sans text-xs font-semibold rounded-none hover:bg-gray-800 transition-all shadow-none uppercase tracking-widest"
                >
                  Publicar Comentario de Valor
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {(comments[selectedPost.id] || []).map((c, i) => (
                  <div key={i} className="p-4 bg-white rounded-none border border-gray-200 shadow-none">
                    <div className="flex justify-between items-center mb-1.5">
                      <strong className="font-sans text-xs font-bold text-gray-900">{c.author}</strong>
                      <span className="font-mono text-[10px] text-gray-400">{c.date}</span>
                    </div>
                    <p className="font-sans text-xs text-gray-600 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </section>

          </article>
        </div>

      </div>

    </div>
  );
}
