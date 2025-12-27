
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="mb-4">© 2024 EducaFoco - Central de Notícias para Docentes</p>
        <div className="flex justify-center items-center gap-2 text-sm">
          <span>Desenvolvido por</span>
          <a 
            href="https://www.linkedin.com/in/orafaelhaddad/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white font-semibold hover:text-blue-400 transition-all flex items-center gap-1"
          >
            Professor Rafael Haddad
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
