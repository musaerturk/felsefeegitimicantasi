import { useState, useCallback, useEffect } from 'react';
import { PerformanceData, StudentPerformance, Student } from '../types';

const STORAGE_KEY = 'philosophy_performance_data_v2';

export const usePerformanceData = () => {
    const [allData, setAllData] = useState<PerformanceData>({});

    useEffect(() => {
        try {
            const item = localStorage.getItem(STORAGE_KEY);
            if (item) {
                setAllData(JSON.parse(item));
            }
        } catch (error) {
            console.error("Error loading performance data from localStorage", error);
        }
    }, []);

    const saveData = (newData: PerformanceData) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setAllData(newData);
        } catch (error) {
            console.error("Error saving performance data to localStorage", error);
        }
    };

    const getClassData = useCallback((classroomId: string, students: Student[]): StudentPerformance[] => {
        const classData = allData[classroomId] || [];
        const studentIdsInClass = new Set(students.map(s => s.id));
        
        // Filter out students who are no longer in the class
        const filteredData = classData.filter(pd => studentIdsInClass.has(pd.studentId));
        
        // Add new students who are not in the performance data yet
        const existingStudentIds = new Set(filteredData.map(pd => pd.studentId));
        const newStudentsToAdd = students
            .filter(s => !existingStudentIds.has(s.id))
            .map(s => ({
                studentId: s.id,
                studentName: s.name,
                scores: Array(8).fill(null)
            }));
            
        const combinedData = [...filteredData, ...newStudentsToAdd];

        // Update names in case they changed in ClassroomManager
        const nameMap = new Map(students.map(s => [s.id, s.name]));
        const finalData = combinedData.map(pd => ({
            ...pd,
            studentName: nameMap.get(pd.studentId) || pd.studentName
        }));

        return finalData.sort((a,b) => a.studentName.localeCompare(b.studentName));
    }, [allData]);

    const updateScore = useCallback((classroomId: string, studentId: string, criteriaIndex: number, score: number | null) => {
        setAllData(prev => {
            const classDataForUpdate = getClassData(classroomId, (prev[classroomId] || []).map(pd => ({id: pd.studentId, name: pd.studentName})));

            const newClassData = classDataForUpdate.map(s => {
                if (s.studentId === studentId) {
                    const newScores = [...s.scores];
                    newScores[criteriaIndex] = score;
                    return { ...s, scores: newScores };
                }
                return s;
            });
            const newData = { ...prev, [classroomId]: newClassData };
            saveData(newData);
            return newData;
        });
    }, [allData, getClassData]);

    return { allData, getClassData, updateScore };
};
