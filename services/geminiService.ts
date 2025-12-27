
import { GoogleGenAI } from "@google/genai";
import { NewsResponse, NewsItem, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function fetchEducationNews(): Promise<NewsResponse> {
  const model = "gemini-3-flash-preview";
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  const todayStr = now.toLocaleDateString('pt-BR');

  const prompt = `
    Data de hoje: ${todayStr}. 
    Estamos em ${currentYear}. Busque notícias de HOJE e previsões para ${nextYear}.
    Atue como um analista de notícias focado em PROFESSORES.

    REGRAS DE FORMATAÇÃO:
    - Use EXATAMENTE as tags [PISO], [CONCURSOS], [BENEFICIOS], [REGRAS], [SINDICATO].
    - Para cada seção, liste no máximo 4 notícias principais para manter a interface fluida.
    - Se não houver notícias recentes para uma categoria, escreva: "Nenhuma atualização relevante hoje."

    FOCO DE CONTEÚDO:
    1. [PISO]: Prioridade total. Reajuste do MEC para ${currentYear}/${nextYear}. Piso em estados como RJ, SP, MG e capitais.
    2. [CONCURSOS]: Apenas editais vigentes, autorizações de novos concursos para professores em ${currentYear}/${nextYear}.
    3. [BENEFICIOS]: FUNDEB, abonos, progressões de carreira, 13º, e gratificações específicas.
    4. [REGRAS]: Mudanças em leis, BNCC, jornada de trabalho, planejamento de aulas.
    5. [SINDICATO]: SEPE RJ, SINPRO e UPPES. Greves, assembleias e negociações de piso regional.

    Use negrito (**texto**) apenas para dados vitais (valores R$, datas, nomes de cidades/sindicatos).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Não foi possível carregar as notícias no momento.";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri,
    })).filter((s: GroundingSource) => s.uri);

    return {
      summary: text,
      items: [],
      sources: sources,
    };
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    throw error;
  }
}
