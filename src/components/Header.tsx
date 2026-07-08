import React from "react";
import { BookOpen, BarChart3, Navigation, Compass, Settings2, Globe } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  apiStatus: { hasApiKey: boolean; loading: boolean };
}

export default function Header({ currentTab, setCurrentTab, apiStatus }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tighter uppercase text-[#1A1A1A]">
                Página<span className="text-gray-400 font-light">&Matriz</span>
              </h1>
              <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] uppercase font-bold tracking-widest rounded-none">
                SEO Studio
              </span>
            </div>
            <span className="text-[10px] font-sans text-gray-400 uppercase tracking-widest mt-0.5">
              Originalidad y Estructura vs Low-Value Content
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setCurrentTab("blog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-none font-sans text-xs font-semibold uppercase tracking-widest transition-all ${
                currentTab === "blog"
                  ? "bg-black text-white border border-black shadow-none"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black border border-transparent"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Blog
            </button>

            <button
              onClick={() => setCurrentTab("matrix")}
              className={`flex items-center gap-2 px-4 py-2 rounded-none font-sans text-xs font-semibold uppercase tracking-widest transition-all ${
                currentTab === "matrix"
                  ? "bg-black text-white border border-black shadow-none"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black border border-transparent"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Matriz IA
            </button>

            <button
              onClick={() => setCurrentTab("routes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-none font-sans text-xs font-semibold uppercase tracking-widest transition-all ${
                currentTab === "routes"
                  ? "bg-black text-white border border-black shadow-none"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black border border-transparent"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              Rutas
            </button>

            <button
              onClick={() => setCurrentTab("seo")}
              className={`flex items-center gap-2 px-4 py-2 rounded-none font-sans text-xs font-semibold uppercase tracking-widest transition-all ${
                currentTab === "seo"
                  ? "bg-black text-white border border-black shadow-none"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black border border-transparent"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              SEO & Adsense
            </button>
          </nav>

          {/* API Key Status / Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#F1F1EF] px-3 py-1.5 rounded-none border border-gray-200">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-none opacity-75 ${
                  apiStatus.hasApiKey ? "bg-emerald-400" : "bg-amber-400"
                }`}></span>
                <span className={`relative inline-flex rounded-none h-2 w-2 ${
                  apiStatus.hasApiKey ? "bg-emerald-500" : "bg-amber-500"
                }`}></span>
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500 font-semibold">
                {apiStatus.loading ? "Verificando..." : apiStatus.hasApiKey ? "Gemini Conectada" : "Modo Fallback"}
              </span>
            </div>

            {/* Mobile Nav Toggle Info */}
            <div className="md:hidden flex items-center bg-gray-100 p-1.5 rounded-none border border-gray-200">
              <Globe className="w-4 h-4 text-[#1A1A1A]" />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Header Navigation */}
      <div className="md:hidden flex border-t border-gray-200 bg-white overflow-x-auto divide-x divide-gray-200">
        <button
          onClick={() => setCurrentTab("blog")}
          className={`flex-1 min-w-[90px] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-widest ${
            currentTab === "blog" ? "bg-black text-white" : "text-gray-500 bg-white"
          }`}
        >
          Blog
        </button>
        <button
          onClick={() => setCurrentTab("matrix")}
          className={`flex-1 min-w-[90px] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-widest ${
            currentTab === "matrix" ? "bg-black text-white" : "text-gray-500 bg-white"
          }`}
        >
          Matriz
        </button>
        <button
          onClick={() => setCurrentTab("routes")}
          className={`flex-1 min-w-[90px] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-widest ${
            currentTab === "routes" ? "bg-black text-white" : "text-gray-500 bg-white"
          }`}
        >
          Rutas
        </button>
        <button
          onClick={() => setCurrentTab("seo")}
          className={`flex-1 min-w-[90px] py-3 text-center font-sans text-[10px] font-bold uppercase tracking-widest ${
            currentTab === "seo" ? "bg-black text-white" : "text-gray-500 bg-white"
          }`}
        >
          SEO/CPC
        </button>
      </div>
    </header>
  );
}
