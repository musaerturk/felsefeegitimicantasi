export interface Classroom {
  id: string;
  name: string;
  students: Student[];
}

export interface Student {
  id: string;
  name: string;
}

export const useClassroomManager = () => {
  const classrooms: Classroom[] = [
    { id: '1', name: '10-A', students: [{ id: '1', name: 'Ahmet' }] },
    { id: '2', name: '11-B', students: [{ id: '2', name: 'Ayşe' }] }
  ];

  const addClassroom = (name: string) => {
    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name,
      students: []
    };
    classrooms.push(newClassroom);
  };

  const deleteClassroom = (id: string) => {
    const index = classrooms.findIndex(c => c.id === id);
    if (index !== -1) {
      classrooms.splice(index, 1);
    }
  };

  const addStudent = (classroomId: string, studentName: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (classroom) {
      classroom.students.push({
        id: Date.now().toString(),
        name: studentName
      });
    }
  };

  const deleteStudent = (classroomId: string, studentId: string) => {
    const classroom = classrooms.find(c => c.id === classroomId);
    if (classroom) {
      classroom.students = classroom.students.filter(s => s.id !== studentId);
    }
  };

  return {
    classrooms,
    addClassroom,
    deleteClassroom,
    addStudent,
    deleteStudent,
  };
};