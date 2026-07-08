import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client safely (lazy-loaded or conditional initialization)
let aiClient: GoogleGenAI | null = null;
const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables. Please configure it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
};

// API: Healthcheck
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// API: Comparative Literary Matrix Generator
app.post("/api/gemini/compare", async (req, res) => {
  try {
    const { bookA, bookB } = req.body;
    if (!bookA || !bookB) {
      return res.status(400).json({ error: "Faltan los nombres de los libros a comparar." });
    }

    const ai = getAiClient();
    const prompt = `Realiza un análisis comparativo y estructurado de alto valor literario entre el libro "${bookA}" y el libro "${bookB}". 
Para superar el filtro de 'contenido de bajo valor', sé sumamente específico, analizando temas profundos, complejidad de personajes, ritmo narrativo, público objetivo ideal y proporcionando temas de discusión interesantes.
Devuelve el resultado estrictamente estructurado en formato JSON según el siguiente esquema de ejemplo:
{
  "bookA": {
    "title": "Título A",
    "author": "Autor A",
    "summary": "Resumen original corto de alto impacto filosófico"
  },
  "bookB": {
    "title": "Título B",
    "author": "Autor B",
    "summary": "Resumen original corto de alto impacto filosófico"
  },
  "themes": [
    { "name": "Tema común 1", "description": "Cómo lo aborda el Libro A vs el Libro B", "scoreA": 85, "scoreB": 60 }
  ],
  "pacingA": "Ritmo A (ej. Rápido, Lento y Filosófico)",
  "pacingB": "Ritmo B",
  "characterComplexity": "Análisis comparativo de la profundidad psicológica de los personajes de ambos libros",
  "targetAudience": "A quién se recomienda leer cada uno",
  "discussionStarters": [
    "Pregunta de debate profunda 1",
    "Pregunta de debate profunda 2"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bookA: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["title", "author", "summary"]
            },
            bookB: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                summary: { type: Type.STRING },
              },
              required: ["title", "author", "summary"]
            },
            themes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  scoreA: { type: Type.INTEGER },
                  scoreB: { type: Type.INTEGER },
                },
                required: ["name", "description", "scoreA", "scoreB"]
              }
            },
            pacingA: { type: Type.STRING },
            pacingB: { type: Type.STRING },
            characterComplexity: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            discussionStarters: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["bookA", "bookB", "themes", "pacingA", "pacingB", "characterComplexity", "targetAudience", "discussionStarters"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se pudo obtener una respuesta del modelo de IA.");
    }

    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error("Error in /api/gemini/compare:", error);
    res.status(500).json({
      error: "Ocurrió un error al generar la matriz comparativa de libros.",
      details: error.message || String(error),
      fallback: true
    });
  }
});

// API: Reading Route Planner
app.post("/api/gemini/reading-route", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Falta el tema literario para trazar la ruta." });
    }

    const ai = getAiClient();
    const prompt = `Diseña una ruta de aprendizaje y lectura secuencial de alta calidad para el tema: "${topic}".
Para superar la barrera de 'contenido de bajo valor', define un plan estructurado, explicando el propósito pedagógico de cada libro y los aspectos críticos en los que debe fijarse el lector.
Devuelve el resultado estrictamente en formato JSON según el siguiente esquema de ejemplo:
{
  "nicheTopic": "Tema",
  "targetAudience": "Perfil de lector ideal para esta ruta",
  "estimatedTotalWeeks": 8,
  "steps": [
    {
      "step": 1,
      "bookTitle": "Título del Libro 1",
      "author": "Autor del Libro 1",
      "purpose": "Por qué se empieza aquí y qué aporta al entendimiento global del tema",
      "estimatedHours": 12,
      "criticalFocus": "En qué concepto o recurso narrativo/técnico clave debe poner atención el lector"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nicheTopic: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            estimatedTotalWeeks: { type: Type.INTEGER },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  bookTitle: { type: Type.STRING },
                  author: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  estimatedHours: { type: Type.INTEGER },
                  criticalFocus: { type: Type.STRING },
                },
                required: ["step", "bookTitle", "author", "purpose", "estimatedHours", "criticalFocus"]
              }
            }
          },
          required: ["nicheTopic", "targetAudience", "estimatedTotalWeeks", "steps"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se pudo obtener una respuesta del modelo de IA.");
    }

    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error("Error in /api/gemini/reading-route:", error);
    res.status(500).json({
      error: "Ocurrió un error al trazar la ruta de lectura.",
      details: error.message || String(error),
      fallback: true
    });
  }
});

// API: SEO Content Outline Generator (Niche Strategy Workspace Tool)
app.post("/api/gemini/seo-outline", async (req, res) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: "Falta la palabra clave para generar el esquema SEO." });
    }

    const ai = getAiClient();
    const prompt = `Como consultor experto en SEO y AdSense para blogs literarios de nicho, genera una propuesta de esquema estructural ultra-optimizado y una propuesta de post de alto valor para superar la política de 'Contenido de bajo valor' de Google AdSense para la palabra clave: "${keyword}".
Devuelve un JSON estructurado con el título recomendado, la estructura jerárquica de encabezados, las palabras clave secundarias recomendadas, el análisis del tipo de intención de búsqueda y la justificación del alto valor que aporta al lector en comparación con resúmenes superficiales ordinarios.
Esquema de ejemplo:
{
  "keyword": "palabra clave",
  "recommendedTitle": "Título SEO Atractivo y con Gancho",
  "searchIntent": "Informational o Commercial",
  "cpcPotential": "$1.50 USD",
  "structuralOutline": [
    "H1: Título",
    "H2: Sección Introductoria",
    "H3: Subsección de Análisis profundo",
    "H2: Sección de Debate o FAQ"
  ],
  "secondaryKeywords": ["palabra 1", "palabra 2"],
  "highValueExplanation": "Explicación de por qué este enfoque supera las sinopsis genéricas de la competencia y engancha al usuario aumentando el tiempo de permanencia.",
  "adPlacementSuggestions": [
    "Anuncio adaptable al inicio bajo el H1 para captar impresiones tempranas.",
    "Bloque de anuncio in-feed entre las secciones H2 principales para maximizar CTR.",
    "Anuncio de contenido coincidente al final junto a las preguntas de discusión de alto valor."
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING },
            recommendedTitle: { type: Type.STRING },
            searchIntent: { type: Type.STRING },
            cpcPotential: { type: Type.STRING },
            structuralOutline: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            secondaryKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            highValueExplanation: { type: Type.STRING },
            adPlacementSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["keyword", "recommendedTitle", "searchIntent", "cpcPotential", "structuralOutline", "secondaryKeywords", "highValueExplanation", "adPlacementSuggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No se pudo obtener una respuesta del modelo de IA.");
    }

    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error("Error in /api/gemini/seo-outline:", error);
    res.status(500).json({
      error: "Ocurrió un error al generar el esquema estructural SEO.",
      details: error.message || String(error),
      fallback: true
    });
  }
});

// Handle serving the frontend bundle based on environment
const startViteAndExpress = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from dist/ in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startViteAndExpress().catch((err) => {
  console.error("Failed to start server:", err);
});
