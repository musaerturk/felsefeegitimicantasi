import React from 'react';
import Button from '../ui/Button.tsx';
import Card from '../ui/Card.tsx';
import Loader from '../ui/Loader.tsx';
import { Tool } from '../../types.ts';

interface ToolViewWrapperProps {
  toolName: Tool;
  onBack: () => void;
  children: React.ReactNode;
  isLoading: boolean;
  result: string;
  renderResult?: (result: string) => React.ReactNode;
}

const ToolViewWrapper: React.FC<ToolViewWrapperProps> = ({ toolName, onBack, children, isLoading, result, renderResult }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center mb-6">
        <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </Button>
        <h2 className="text-2xl sm:text-3xl font-bold">{toolName}</h2>
      </div>
      
      <Card className="mb-6">
        {children}
      </Card>
      
      {(isLoading || result) && (
        <Card>
          <h3 className="text-xl font-semibold mb-4 text-indigo-400">Oluşturulan İçerik</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader />
            </div>
          ) : (
            renderResult ? renderResult(result) : (
                <div className="bg-gray-900/50 p-4 rounded-md max-h-[50vh] overflow-y-auto">
                <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
                </div>
            )
          )}
        </Card>
      )}
    </div>
  );
};

export default ToolViewWrapper;
