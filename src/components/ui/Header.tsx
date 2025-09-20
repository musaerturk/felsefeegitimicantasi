
import React from 'react';
import { Grade } from '../../types';
import { LogoIcon } from './Icons';

interface HeaderProps {
  selectedGrade: Grade | null;
  onResetGrade: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedGrade, onResetGrade }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-indigo-400"/>
            <h1 className="text-lg sm:text-xl font-bold text-gray-100">
              Felsefe Eğitimi Çantası
            </h1>
          </div>
          {selectedGrade && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium bg-indigo-500 text-white px-3 py-1 rounded-full">
                Sınıf: {selectedGrade}
              </span>
              <button
                onClick={onResetGrade}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Değiştir
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;