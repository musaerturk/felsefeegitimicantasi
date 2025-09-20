import React, { useState, useEffect } from 'react';
import { Tool } from '../../types.ts';
import Button from '../ui/Button.tsx';
import Card from '../ui/Card.tsx';
import { useClassroomManager } from '../../hooks/useClassroomManager.ts';

interface Props {
    onBack: () => void;
}

const ClassroomManager: React.FC<Props> = ({ onBack }) => {
    const { classrooms, addClassroom, deleteClassroom, addStudent, deleteStudent } = useClassroomManager();
    const [newClassName, setNewClassName] = useState('');
    const [newStudentName, setNewStudentName] = useState('');
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    
    useEffect(() => {
        if(!selectedClassId && classrooms.length > 0){
            setSelectedClassId(classrooms[0].id)
        }
    }, [classrooms, selectedClassId])

    const handleAddClass = (e: React.FormEvent) => {
        e.preventDefault();
        addClassroom(newClassName);
        setNewClassName('');
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClassId) {
            addStudent(selectedClassId, newStudentName);
            setNewStudentName('');
        }
    };

    const selectedClass = classrooms.find(c => c.id === selectedClassId);

    return (
        <div className="w-full animate-fade-in">
            <div className="flex items-center mb-6">
                <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Button>
                <h2 className="text-3xl font-bold">{Tool.SINIFLARIM}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sınıf Yönetimi */}
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-indigo-400">Sınıflar ({classrooms.length})</h3>
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                        {classrooms.map(classroom => (
                            <div
                                key={classroom.id}
                                onClick={() => setSelectedClassId(classroom.id)}
                                className={`p-3 rounded-md cursor-pointer flex justify-between items-center transition-colors border ${selectedClassId === classroom.id ? 'bg-indigo-900/50 border-indigo-500' : 'bg-gray-700/50 border-transparent hover:bg-gray-600/50'}`}
                            >
                                <span className="font-medium">{classroom.name}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`'${classroom.name}' sınıfını silmek istediğinizden emin misiniz? Bu sınıfa ait tüm performans verileri de silinecektir.`)) {
                                            deleteClassroom(classroom.id);
                                            if (selectedClassId === classroom.id) {
                                                setSelectedClassId(classrooms.length > 1 ? classrooms.find(c => c.id !== classroom.id)!.id : null);
                                            }
                                        }
                                    }}
                                    className="text-rose-400 hover:text-rose-300 font-bold text-xl flex-shrink-0">&times;</button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddClass} className="flex space-x-2">
                        <input
                            type="text"
                            value={newClassName}
                            onChange={e => setNewClassName(e.target.value)}
                            placeholder="Yeni Sınıf Adı (örn: 10-A)"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Button type="submit">Ekle</Button>
                    </form>
                </Card>

                {/* Öğrenci Yönetimi */}
                <Card>
                    <h3 className="text-xl font-semibold mb-4 text-indigo-400">Öğrenciler ({selectedClass?.name || 'Sınıf Seçilmedi'})</h3>
                    {selectedClassId && selectedClass ? (
                        <>
                            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                               {selectedClass.students.map(student => (
                                    <div key={student.id} className="p-3 bg-gray-700/50 rounded-md flex justify-between items-center">
                                       <span>{student.name}</span>
                                       <button onClick={() => deleteStudent(selectedClass.id, student.id)} className="text-rose-400 hover:text-rose-300 font-bold text-xl flex-shrink-0">&times;</button>
                                    </div>
                                ))}
                            </div>
                             <form onSubmit={handleAddStudent} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newStudentName}
                                    onChange={e => setNewStudentName(e.target.value)}
                                    placeholder="Yeni Öğrenci Adı Soyadı"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <Button type="submit">Ekle</Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            Öğrenci eklemek için bir sınıf seçin veya yeni bir sınıf oluşturun.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ClassroomManager;