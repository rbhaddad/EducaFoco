
import React from 'react';

interface HeaderProps {
  onTabChange?: (tab: 'PISO' | 'CONCURSOS' | 'BENEFICIOS' | 'REGRAS' | 'SINDICATO') => void;
}

const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            EducaFoco
          </span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
          <button onClick={() => onTabChange?.('PISO')} className="hover:text-blue-600 transition-colors">Piso</button>
          <button onClick={() => onTabChange?.('BENEFICIOS')} className="hover:text-blue-600 transition-colors">Benefícios</button>
          <button onClick={() => onTabChange?.('CONCURSOS')} className="hover:text-blue-600 transition-colors">Concursos</button>
          <button onClick={() => onTabChange?.('SINDICATO')} className="hover:text-blue-600 transition-colors">Sindicatos</button>
          <button onClick={() => onTabChange?.('REGRAS')} className="hover:text-blue-600 transition-colors">Regras</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
