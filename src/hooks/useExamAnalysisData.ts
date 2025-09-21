import { useState, useCallback, useEffect } from 'react';
import { ExamAnalysisData, Classroom, ExamQuestion } from '../types.ts';

const STORAGE_KEY_PREFIX = 'philosophy_exam_analysis_v2_';

export const useExamAnalysisData = (classroom: Classroom | null) => {
    const [analysisData, setAnalysisData] = useState<ExamAnalysisData | null>(null);
    const storageKey = classroom ? `${STORAGE_KEY_PREFIX}${classroom.id}` : null;

    useEffect(() => {
        if (!storageKey) {
            setAnalysisData(null);
            return;
        }
        try {
            const item = localStorage.getItem(storageKey);
            if (item) {
                const parsedData: ExamAnalysisData = JSON.parse(item);
                const studentIds = new Set(classroom!.students.map(s => s.id));
                const syncedScores = parsedData.scores.filter(s => studentIds.has(s.studentId));
                
                classroom!.students.forEach(student => {
                    if (!syncedScores.some(s => s.studentId === student.id)) {
                        syncedScores.push({
                            studentId: student.id,
                            scores: {}
                        });
                    }
                });

                setAnalysisData({ ...parsedData, scores: syncedScores });
            } else {
                setAnalysisData({
                    classroomId: classroom!.id,
                    examTitle: `${classroom!.name} Sınav Analizi`,
                    questions: [],
                    scores: classroom!.students.map(s => ({ studentId: s.id, scores: {} })),
                });
            }
        } catch (error) {
            console.error("Error loading exam analysis data:", error);
             setAnalysisData({
                classroomId: classroom!.id,
                examTitle: `${classroom!.name} Sınav Analizi`,
                questions: [],
                scores: classroom!.students.map(s => ({ studentId: s.id, scores: {} })),
            });
        }
    }, [storageKey, classroom]);

    const saveData = useCallback((data: ExamAnalysisData | null) => {
        if (!storageKey || !data) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            setAnalysisData(data);
        } catch (error) {
            console.error("Error saving exam analysis data:", error);
        }
    }, [storageKey]);

    const updateExamTitle = (title: string) => {
        if (analysisData) saveData({ ...analysisData, examTitle: title });
    };

    const updateQuestions = (questions: ExamQuestion[]) => {
        if (analysisData) saveData({ ...analysisData, questions });
    };

    const updateStudentScore = (studentId: string, questionId: string, score: number | null) => {
         if (analysisData) {
            const newScores = analysisData.scores.map(s => {
                if (s.studentId === studentId) {
                    const updatedStudentScores = { ...s.scores, [questionId]: score };
                    if (score === null || isNaN(score)) {
                        delete updatedStudentScores[questionId];
                    }
                    return { ...s, scores: updatedStudentScores };
                }
                return s;
            });
            saveData({ ...analysisData, scores: newScores });
        }
    };
    
    const resetAnalysis = () => {
         if(storageKey) localStorage.removeItem(storageKey);
         if(classroom){
             setAnalysisData({
                classroomId: classroom.id,
                examTitle: `${classroom.name} Sınav Analizi`,
                questions: [],
                scores: classroom.students.map(s => ({ studentId: s.id, scores: {} })),
            });
         }
    };

    return { analysisData, updateExamTitle, updateQuestions, updateStudentScore, resetAnalysis };
};