import React from 'react';
import { Grade } from '../types';
import Card from './ui/Card';

interface GradeSelectorProps {
  onSelectGrade: (grade: Grade) => void;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({ onSelectGrade }) => {
  return (
    <div className="text-center w-full max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        Hoş Geldiniz
      </h2>
      <p className="text-base md:text-lg text-gray-400 mb-8 md:mb-10">
        Başlamak için lütfen bir sınıf seviyesi seçin.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
            onClick={() => onSelectGrade(Grade.TENTH)}
            className="cursor-pointer group"
        >
            <h3 className="text-3xl font-bold mb-2 text-white">10. Sınıf</h3>
            <p className="text-gray-400">Maarif Modeline göre planlar, etkinlikler, sınavlar, analizler, soru bankası ve fazlası.</p>
            <span className="absolute bottom-6 right-6 text-gray-600 group-hover:text-indigo-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
        </Card>
        <Card
            onClick={() => onSelectGrade(Grade.ELEVENTH)}
            className="cursor-pointer group"
        >
            <h3 className="text-3xl font-bold mb-2 text-white">11. Sınıf</h3>
            <p className="text-gray-400">MÖ 6. - MS 2. Yüzyıl Felsefesi, 15.-17. Yüzyıl Felsefesi ve daha fazlası.</p>
            <span className="absolute bottom-6 right-6 text-gray-600 group-hover:text-indigo-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18" /></svg>
            </span>
        </Card>
      </div>
    </div>
  );
};

export default GradeSelector;