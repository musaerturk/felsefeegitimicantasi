import { useState } from 'react';

export interface ExamQuestion {
  id: string;
  text: string;
  maxScore: number;
}

export interface StudentScores {
  studentId: string;
  scores: { [questionId: string]: number | null };
}

export interface ExamAnalysisData {
  examTitle: string;
  questions: ExamQuestion[];
  scores: StudentScores[];
}

export const useExamAnalysisData = (classroomId?: string) => {
  const [analysisData, setAnalysisData] = useState<ExamAnalysisData>({
    examTitle: '',
    questions: [],
    scores: []
  });

  const updateExamTitle = (title: string) => {
    setAnalysisData(prev => ({ ...prev, examTitle: title }));
  };

  const updateQuestions = (questions: ExamQuestion[]) => {
    setAnalysisData(prev => ({ ...prev, questions }));
  };

  const updateStudentScore = (studentId: string, questionId: string, score: number | null) => {
    setAnalysisData(prev => {
      const studentScores = prev.scores.find(s => s.studentId === studentId);
      
      if (studentScores) {
        // Mevcut öğrenciyi güncelle
        return {
          ...prev,
          scores: prev.scores.map(s =>
            s.studentId === studentId
              ? { ...s, scores: { ...s.scores, [questionId]: score } }
              : s
          )
        };
      } else {
        // Yeni öğrenci ekle
        return {
          ...prev,
          scores: [...prev.scores, { studentId, scores: { [questionId]: score } }]
        };
      }
    });
  };

  const resetAnalysis = () => {
    setAnalysisData({
      examTitle: '',
      questions: [],
      scores: []
    });
  };

  return {
    analysisData,
    updateExamTitle,
    updateQuestions,
    updateStudentScore,
    resetAnalysis
  };
};
