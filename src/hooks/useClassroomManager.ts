import { useState } from 'react';

export interface Student {
  id: string;
  name: string;
}

export interface Classroom {
  id: string;
  name: string;
  students: Student[];
}

export const useClassroomManager = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { id: '1', name: '10-A', students: [{ id: '1', name: 'Ahmet' }] },
    { id: '2', name: '11-B', students: [{ id: '2', name: 'Ayşe' }] }
  ]);

  const addClassroom = (name: string) => {
    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name,
      students: []
    };
    setClassrooms(prev => [...prev, newClassroom]);
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(prev => prev.filter(c => c.id !== id));
  };

  const addStudent = (classroomId: string, studentName: string) => {
    setClassrooms(prev =>
      prev.map(c =>
        c.id === classroomId
          ? {
              ...c,
              students: [
                ...c.students,
                { id: Date.now().toString(), name: studentName }
              ]
            }
          : c
      )
    );
  };

  const deleteStudent = (classroomId: string, studentId: string) => {
    setClassrooms(prev =>
      prev.map(c =>
        c.id === classroomId
          ? {
              ...c,
              students: c.students.filter(s => s.id !== studentId)
            }
          : c
      )
    );
  };

  return {
    classrooms,
    addClassroom,
    deleteClassroom,
    addStudent,
    deleteStudent,
  };
};