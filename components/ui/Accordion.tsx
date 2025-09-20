import React from 'react';
import { ChevronDownIcon } from './Icons';

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isSubAccordion?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, isOpen, onToggle, isSubAccordion = false }) => {
  const containerClasses = isSubAccordion
    ? "border border-gray-700/50 rounded-lg overflow-hidden bg-gray-900/20"
    : "border border-gray-700/80 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm shadow-md";

  const buttonClasses = "w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors duration-200";
  
  const titleClasses = isSubAccordion
    ? "text-md font-semibold text-gray-200"
    : "text-lg font-bold text-indigo-400";


  return (
    <div className={containerClasses}>
      <button
        onClick={onToggle}
        className={buttonClasses}
        aria-expanded={isOpen}
      >
        <h3 className={titleClasses}>{title}</h3>
        <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        style={{ transitionProperty: 'grid-template-rows, opacity' }}
      >
        <div className="overflow-hidden">
            <div className={`p-4 ${isSubAccordion ? 'border-t border-gray-700/50' : 'border-t border-gray-700/80'}`}>
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;