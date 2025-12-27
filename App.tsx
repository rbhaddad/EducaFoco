
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchEducationNews } from './services/geminiService';
import { NewsResponse } from './types';

// Memoized text component to prevent unnecessary re-renders of news lines
const NewsLine = memo(({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="flex gap-4 group py-2">
      {text.trim().startsWith('-') || text.trim().startsWith('*') || text.trim().match(/^\d+\./) ? (
        <div className="mt-2.5 w-1.5 h-1.5 bg-blue-500 group-hover:bg-blue-700 transition-colors rounded-full shrink-0"></div>
      ) : null}
      <div className="flex-1 text-slate-700 leading-relaxed text-base md:text-lg">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-bold text-blue-900 bg-blue-50 px-1 rounded mx-0.5">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </div>
    </div>
  );
});

NewsLine.displayName = 'NewsLine';

type Category = 'PISO' | 'CONCURSOS' | 'BENEFICIOS' | 'REGRAS' | 'SINDICATO' | 'GERAL';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Category>('PISO');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEducationNews();
      setNews(data);
      setLastUpdate(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error(err);
      setError("Falha na sincronização. Tente atualizar manualmente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categorizedContent = useMemo(() => {
    if (!news?.summary) return {};
    
    const sections: Record<string, string[]> = {
      PISO: [],
      CONCURSOS: [],
      BENEFICIOS: [],
      REGRAS: [],
      SINDICATO: [],
      GERAL: []
    };

    let currentCat: Category = 'GERAL';
    const lines = news.summary.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('[PISO]')) { currentCat = 'PISO'; return; }
      if (trimmed.includes('[CONCURSOS]')) { currentCat = 'CONCURSOS'; return; }
      if (trimmed.includes('[BENEFICIOS]')) { currentCat = 'BENEFICIOS'; return; }
      if (trimmed.includes('[REGRAS]')) { currentCat = 'REGRAS'; return; }
      if (trimmed.includes('[SINDICATO]')) { currentCat = 'SINDICATO'; return; }
      
      if (trimmed && !trimmed.startsWith('[') && !trimmed.endsWith(']')) {
        sections[currentCat].push(line);
      }
    });

    return sections;
  }, [news]);

  const tabs: { id: Category; label: string; icon: string; color: string }[] = [
    { id: 'PISO', label: 'Piso Salarial', icon: '💰', color: 'blue' },
    { id: 'CONCURSOS', label: 'Concursos', icon: '📝', color: 'indigo' },
    { id: 'SINDICATO', label: 'Sindicatos', icon: '✊', color: 'red' },
    { id: 'BENEFICIOS', label: 'Benefícios', icon: '🌟', color: 'amber' },
    { id: 'REGRAS', label: 'Regras', icon: '⚖️', color: 'slate' },
  ];

  const currentContent = categorizedContent[activeTab] || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-100">
      <Header onTabChange={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 w-full">
        {/* Hero Banner */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-indigo-800 rounded-[2rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                    Versão {new Date().getFullYear()} / {new Date().getFullYear() + 1}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                    EducaFoco: Portal do Magistério
                  </h1>
                  <p className="text-blue-100 text-lg opacity-90">
                    Sua central de notícias jurídicas, sindicais e salariais. Foco total em Piso Nacional, Concursos e SEPE/SINPRO.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={() => loadData()}
                    disabled={loading}
                    className="w-full md:w-auto bg-white text-indigo-700 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-white/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? 'Sincronizando...' : 'Sincronizar Agora'}
                    <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  {lastUpdate && !loading && (
                    <span className="text-blue-200 text-xs font-medium">
                      Último check: {lastUpdate}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>
        </section>

        {/* Improved Tabs UI */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 md:gap-3 p-1.5 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[120px] md:min-w-[160px] flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-0.5' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className="text-xl md:text-2xl">{tab.icon}</span>
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
                    <div className="h-7 bg-slate-200 rounded-lg w-1/4 mb-6"></div>
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-red-100 text-center shadow-sm">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-4xl">⚠️</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Sincronização Interrompida</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">{error}</p>
                <button onClick={loadData} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all">Recarregar agora</button>
              </div>
            ) : (
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[500px] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl filter drop-shadow-sm">{tabs.find(t => t.id === activeTab)?.icon}</span>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h2>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black uppercase">
                    Atualizado
                  </div>
                </div>
                
                {currentContent.length > 0 ? (
                  <div className="space-y-2">
                    {currentContent.map((line, i) => (
                      <NewsLine key={`${activeTab}-${i}`} text={line} />
                    ))}
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <div className="text-7xl mb-6 opacity-20 grayscale">🔎</div>
                    <h4 className="text-xl font-bold text-slate-700 mb-2">Sem atualizações no radar</h4>
                    <p className="text-slate-500 max-w-sm mx-auto mb-8">Nenhuma notícia crítica para esta categoria foi detectada nas últimas 24h.</p>
                    <button onClick={loadData} className="text-blue-600 font-black hover:bg-blue-50 px-6 py-3 rounded-xl transition-all">Forçar nova busca</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                Links da Matéria
              </h3>
              <div className="space-y-3">
                {news?.sources && news.sources.length > 0 ? (
                  news.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-transparent hover:border-blue-400"
                    >
                      <span className="text-sm font-bold truncate mb-1">
                        {source.title || "Notícia relacionada"}
                      </span>
                      <span className="text-[10px] opacity-60 flex items-center gap-1 group-hover:text-blue-100">
                        {new URL(source.uri || '').hostname}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    </a>
                  ))
                ) : (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-xs">Aguardando fontes...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Salary Focus Box */}
            <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-lg">💰</div>
                  <h3 className="text-lg font-black text-amber-900">Alerta de Piso</h3>
                </div>
                <p className="text-amber-800 text-sm leading-relaxed font-medium">
                  Acompanhe aqui o reajuste anual do MEC. O piso nacional é o mínimo garantido pela Lei 11.738/2008.
                </p>
                <button 
                  onClick={() => setActiveTab('PISO')}
                  className="mt-6 w-full py-3 bg-amber-200/50 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors"
                >
                  Ver Piso Atualizado
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.97 0-1.72 1.39-3.1 3.11-3.48V4h2.67v1.94c1.47.28 2.7 1.25 2.93 3.06h-1.93c-.15-.81-.69-1.51-2.34-1.51-1.64 0-2.07.76-2.07 1.4 0 .76.54 1.33 2.67 1.85s4.18 1.46 4.18 3.82c.01 2.05-1.56 3.16-3.41 3.51z"/></svg>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-bold">Monitor SEPE/UPPES</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6 font-medium">
                Sincronização direta com portais sindicais para avisos de assembleia e greve em tempo real.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  SINPRO: Ativo
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  SEPE: Verificando
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
