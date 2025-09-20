import { useState, useCallback, useEffect } from 'react';
import { Classroom, Student } from '../types.ts';

const STORAGE_KEY = 'philosophy_classrooms';

export const useClassroomManager = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);

    useEffect(() => {
        try {
            const item = localStorage.getItem(STORAGE_KEY);
            if (item) {
                const parsed = JSON.parse(item);
                if (Array.isArray(parsed)) {
                    setClassrooms(parsed);
                }
            }
        } catch (error) {
            console.error("Error loading classrooms from localStorage", error);
        }
    }, []);

    const saveData = (newClassrooms: Classroom[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newClassrooms));
            setClassrooms(newClassrooms);
        } catch (error) {
            console.error("Error saving classrooms to localStorage", error);
        }
    };

    const addClassroom = useCallback((name: string) => {
        if (!name.trim()) return;
        const newClassroom: Classroom = {
            id: crypto.randomUUID(),
            name: name.trim(),
            students: [],
        };
        saveData([...classrooms, newClassroom]);
    }, [classrooms]);

    const deleteClassroom = useCallback((id: string) => {
        const newClassrooms = classrooms.filter(c => c.id !== id);
        saveData(newClassrooms);
    }, [classrooms]);

    const addStudent = useCallback((classroomId: string, studentName: string) => {
        if (!studentName.trim()) return;
        const newStudent: Student = {
            id: crypto.randomUUID(),
            name: studentName.trim(),
        };
        const newClassrooms = classrooms.map(c => {
            if (c.id === classroomId) {
                const updatedStudents = [...c.students, newStudent].sort((a,b) => a.name.localeCompare(b.name));
                return { ...c, students: updatedStudents };
            }
            return c;
        });
        saveData(newClassrooms);
    }, [classrooms]);

    const deleteStudent = useCallback((classroomId: string, studentId: string) => {
        const newClassrooms = classrooms.map(c => {
            if (c.id === classroomId) {
                return { ...c, students: c.students.filter(s => s.id !== studentId) };
            }
            return c;
        });
        saveData(newClassrooms);
    }, [classrooms]);

    return { classrooms, addClassroom, deleteClassroom, addStudent, deleteStudent };
};