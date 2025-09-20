
import { useState, useCallback, useEffect } from 'react';
import { Question, Grade, QuestionType, QuestionBankData } from '../types';

const STORAGE_KEY_PREFIX = 'philosophy_question_bank_v2_';

interface UseQuestionBankProps {
  grade: Grade;
}

export const useQuestionBank = ({ grade }: UseQuestionBankProps) => {
  const [questions, setQuestions] = useState<QuestionBankData>({});
  const storageKey = `${STORAGE_KEY_PREFIX}${grade}`;

  useEffect(() => {
    try {
      const item = localStorage.getItem(storageKey);
      if (item) {
        setQuestions(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error loading questions from localStorage", error);
      setQuestions({});
    }
  }, [storageKey]);

  const saveQuestions = (newQuestions: QuestionBankData) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newQuestions));
      setQuestions(newQuestions);
    } catch (error) {
      console.error("Error saving questions to localStorage", error);
    }
  };

  const addQuestions = useCallback((unit: number, questionType: QuestionType, newQuestions: Question[]) => {
    setQuestions(prev => {
      const updatedBank = { ...prev };
      if (!updatedBank[unit]) {
        updatedBank[unit] = {};
      }
      const existing = updatedBank[unit][questionType] || [];
      updatedBank[unit][questionType] = [...existing, ...newQuestions];
      saveQuestions(updatedBank);
      return updatedBank;
    });
  }, [storageKey]);

  const deleteQuestion = useCallback((unit: number, questionType: QuestionType, questionIndex: number) => {
    setQuestions(prev => {
      const updatedBank = { ...prev };
      if (updatedBank[unit] && updatedBank[unit][questionType]) {
        updatedBank[unit][questionType] = updatedBank[unit][questionType]!.filter((_, i) => i !== questionIndex);
        
        if (updatedBank[unit][questionType]!.length === 0) {
            delete updatedBank[unit][questionType];
        }
        if (Object.keys(updatedBank[unit]).length === 0) {
            delete updatedBank[unit];
        }
        saveQuestions(updatedBank);
      }
      return updatedBank;
    });
  }, [storageKey]);

  return { questions, addQuestions, deleteQuestion };
};