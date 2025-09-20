

import React, { useState, useCallback, useEffect } from 'react';
import { Grade, Tool } from './types';
import GradeSelector from './components/GradeSelector';
import Toolbox from './components/Toolbox';
import Header from './components/ui/Header';
import Agenda from './components/tools/Agenda';
import LessonPlanner from './components/tools/LessonPlanner';
import ExamGenerator from './components/tools/ExamGenerator';
import QuestionBank from './components/tools/QuestionBank';
import ExamAnalyzer from './components/tools/ExamAnalyzer';
import DatabaseManagement from './components/tools/DatabaseManagement';
import UnitDatabase from './components/tools/UnitDatabase';
import ClassroomManager from './components/tools/ClassroomManager';
import ActivityPool from './components/tools/ActivityPool';
import EvaluationScales from './components/tools/EvaluationScales';
import { LogoIcon } from './components/ui/Icons';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Show splash for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);


  const handleGradeSelect = useCallback((grade: Grade) => {
    setSelectedGrade(grade);
    setActiveTool(null);
  }, []);

  const handleToolSelect = useCallback((tool: Tool) => {
    setActiveTool(tool);
  }, []);

  const resetGrade = useCallback(() => {
    setSelectedGrade(null);
    setActiveTool(null);
  }, []);

  const goBackToToolbox = useCallback(() => {
    setActiveTool(null);
  }, []);

  const renderActiveTool = () => {
    if (!selectedGrade) return null;

    switch (activeTool) {
      case Tool.AJANDA:
        return <Agenda grade={selectedGrade} onBack={goBackToToolbox} />;
      case Tool.LESSON_PLAN:
        return <LessonPlanner grade={selectedGrade} onBack={goBackToToolbox} />;
      case Tool.EXAM_GENERATOR:
        return <ExamGenerator grade={selectedGrade} onBack={goBackToToolbox} />;
      case Tool.QUESTION_BANK:
        return <QuestionBank grade={selectedGrade} onBack={goBackToToolbox} />;
      case Tool.EXAM_ANALYSIS:
        // FIX: Removed unused 'grade' prop to match the updated component props.
        return <ExamAnalyzer onBack={goBackToToolbox} />;
      case Tool.UNIT_DATABASE:
        return <UnitDatabase grade={selectedGrade} onBack={goBackToToolbox} />;
      case Tool.DATABASE_MANAGEMENT:
        return <DatabaseManagement grade={selectedGrade} onBack={goBackToToolbox} />;
      case Tool.DEGERLENDIRME_OLCEKLERI:
        return <EvaluationScales onBack={goBackToToolbox} />;
      case Tool.SINIFLARIM:
        return <ClassroomManager onBack={goBackToToolbox} />;
      case Tool.ETKINLIK_HAVUZU:
        // FIX: Added the required 'grade' prop. This likely addresses the reported error which seems to have misidentified the component.
        return <ActivityPool grade={selectedGrade} onBack={goBackToToolbox} />;
      default:
        return <Toolbox onSelectTool={handleToolSelect} grade={selectedGrade} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
       {isLoading ? (
            <div className="flex-grow flex items-center justify-center animate-fade-in">
              <LogoIcon className="h-48 w-48 text-indigo-400" />
            </div>
          ) : (
            <>
              <Header 
                selectedGrade={selectedGrade} 
                onResetGrade={resetGrade} 
              />
              <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex flex-col items-center">
                {!selectedGrade ? (
                  <div className="w-full flex-grow flex items-center justify-center">
                     <GradeSelector onSelectGrade={handleGradeSelect} />
                  </div>
                ) : (
                  <div className="w-full max-w-6xl">
                    {renderActiveTool()}
                  </div>
                )}
              </main>
              <footer className="text-center p-4 text-gray-500 text-sm">
                Felsefe Eğitimi Çantası © 2024
              </footer>
            </>
        )}
    </div>
  );
};

export default App;