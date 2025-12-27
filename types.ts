
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: 'Regras' | 'Benefícios' | 'Concursos' | 'Mudanças' | 'Geral';
  date: string;
  url: string;
  source: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface NewsResponse {
  summary: string;
  items: NewsItem[];
  sources: GroundingSource[];
}
