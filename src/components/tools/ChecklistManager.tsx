import React, { useState } from 'react';
import { Tool, Classroom, Checklist, ChecklistState, ChecklistItem, Student } from '../../types.ts';
import Button from '../ui/Button.tsx';
import Card from '../ui/Card.tsx';
import { useClassroomManager } from '../../hooks/useClassroomManager.ts';
import { useChecklists } from '../../hooks/useChecklists.ts';
import { AcademicCapIcon } from '../ui/Icons.tsx';
import Accordion from '../ui/Accordion.tsx';

interface Props {
  onBack: () => void;
}

const StateIcon: React.FC<{ state: ChecklistState }> = ({ state }) => {
    switch (state) {
        case 'observed':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'needs_improvement':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
        case 'not_observed':
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
};

const ChecklistManager: React.FC<Props> = ({ onBack }) => {
    const { classrooms } = useClassroomManager();
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
    const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
    
    const { allChecklists, checklistData, updateStudentChecklistState, addCustomChecklist, deleteCustomChecklist } = useChecklists(selectedClass);

    const [isCreating, setIsCreating] = useState(false);
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [newChecklistItems, setNewChecklistItems] = useState<string[]>(['']);

    const handleSelectClass = (classId: string) => {
        setSelectedChecklist(null);
        setSelectedClass(classrooms.find((c: Classroom) => c.id === classId) || null);
    };

    const handleItemTextChange = (index: number, text: string) => {
        const newItems = [...newChecklistItems];
        newItems[index] = text;
        setNewChecklistItems(newItems);
    };

    const handleAddNewItem = () => {
        setNewChecklistItems([...newChecklistItems, '']);
    };

    const handleRemoveItem = (index: number) => {
        if (newChecklistItems.length > 1) {
            setNewChecklistItems(newChecklistItems.filter((_, i) => i !== index));
        }
    };
    
    const handleSaveNewChecklist = () => {
        const trimmedTitle = newChecklistTitle.trim();
        const trimmedItems = newChecklistItems.map(item => item.trim()).filter(item => item !== '');
        if (trimmedTitle && trimmedItems.length > 0) {
            addCustomChecklist(trimmedTitle, trimmedItems);
            setIsCreating(false);
            setNewChecklistTitle('');
            setNewChecklistItems(['']);
        }
    };
    
    if (!selectedClass) {
        return (
             <div className="w-full animate-fade-in">
                 <div className="flex items-center mb-6">
                    <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Button>
                    <h2 className="text-3xl font-bold">{Tool.CHECKLISTS}</h2>
                </div>
                <Card>
                    <div className="text-center p-8">
                        <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
                        <h3 className="text-2xl font-bold mb-2">Sınıf Seçin</h3>
                        <p className="text-gray-400 mb-6">Hangi sınıf için gözlem yapmak istiyorsunuz?</p>
                        {classrooms.length > 0 ? (
                            <div className="max-w-xs mx-auto">
                                <select 
                                    onChange={(e) => handleSelectClass(e.target.value)}
                                    defaultValue=""
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>-- Sınıf Seç --</option>
                                    {classrooms.map((c: Classroom) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        ) : (
                            <p className="text-amber-400">Önce "Sınıflarım" aracını kullanarak bir sınıf oluşturmalısınız.</p>
                        )}
                    </div>
                </Card>
            </div>
        );
    }

    if (selectedChecklist) {
        const currentData = checklistData[selectedChecklist.id] || {};
        const states: ChecklistState[] = ['observed', 'needs_improvement', 'not_observed', null];
        return (
             <div className="w-full animate-fade-in">
                 <div className="flex items-center mb-6">
                    <Button onClick={() => setSelectedChecklist(null)} variant="secondary" className="!p-2 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </Button>
                    <h2 className="text-2xl font-bold">{selectedClass.name} - <span className="text-indigo-400">{selectedChecklist.title}</span></h2>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 bg-gray-800 p-2 border border-gray-700 text-left">Öğrenci</th>
                                {selectedChecklist.items.map((item: ChecklistItem) => (
                                    <th key={item.id} className="p-2 border border-gray-700 align-bottom min-w-[150px]">
                                        <div className="text-sm font-medium -rotate-45 origin-bottom-left translate-x-3 -translate-y-1/2 whitespace-nowrap">
                                            {item.text}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedClass.students.map((student: Student) => (
                                <tr key={student.id}>
                                    <th scope="row" className="sticky left-0 bg-gray-800 p-2 border border-gray-700 text-left font-medium">{student.name}</th>
                                    {selectedChecklist.items.map((item: ChecklistItem, index: number) => {
                                        const studentStates = currentData[student.id] || [];
                                        const currentState = studentStates[index] || null;
                                        return (
                                            <td key={item.id} className="p-2 border border-gray-700 text-center">
                                                <button onClick={() => {
                                                    const currentIndex = states.indexOf(currentState);
                                                    const nextState = states[(currentIndex + 1) % states.length];
                                                    updateStudentChecklistState(selectedChecklist.id, student.id, index, nextState);
                                                }}
                                                className="rounded-full p-1 hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <StateIcon state={currentState} />
                                                </button>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             </div>
        )
    }

    return (
        <div className="w-full animate-fade-in">
             <div className="flex items-center mb-6">
                <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Button>
                <h2 className="text-3xl font-bold">{Tool.CHECKLISTS}</h2>
                 <Button onClick={() => setSelectedClass(null)} variant="secondary" className="ml-auto">Sınıf Değiştir</Button>
            </div>
            <p className="text-gray-400 mb-4">Gözlem yapmak için <span className="font-bold text-indigo-300">{selectedClass.name}</span> sınıfından bir kontrol listesi seçin veya yeni bir tane oluşturun.</p>
            
            <div className="space-y-4">
                <Accordion title="Hazır Listeler" isOpen={true} onToggle={() => {}}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allChecklists.filter((c: Checklist) => !c.isCustom).map((checklist: Checklist) => (
                            <Card key={checklist.id} onClick={() => setSelectedChecklist(checklist)} className="cursor-pointer">
                                <h4 className="font-semibold text-lg">{checklist.title}</h4>
                                <ul className="text-xs text-gray-400 mt-2 list-disc pl-4">
                                    {checklist.items.slice(0, 3).map((item: ChecklistItem) => <li key={item.id}>{item.text}</li>)}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </Accordion>
                <Accordion title="Özel Listelerim" isOpen={true} onToggle={() => {}}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allChecklists.filter((c: Checklist) => c.isCustom).map((checklist: Checklist) => (
                            <Card key={checklist.id} onClick={() => setSelectedChecklist(checklist)} className="cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-lg flex-grow">{checklist.title}</h4>
                                    <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Bu listeyi silmek istediğinizden emin misiniz?')) deleteCustomChecklist(checklist.id); }} className="text-rose-400 hover:text-rose-300 text-xl">&times;</button>
                                </div>
                                <ul className="text-xs text-gray-400 mt-2 list-disc pl-4">
                                    {checklist.items.slice(0, 3).map((item: ChecklistItem) => <li key={item.id}>{item.text}</li>)}
                                </ul>
                            </Card>
                        ))}
                    </div>
                    <Button onClick={() => setIsCreating(true)} variant="secondary" className="mt-4">Yeni Liste Oluştur</Button>
                    
                    {isCreating && (
                        <Card className="mt-4 bg-gray-900/50">
                             <h4 className="text-lg font-semibold mb-3 text-indigo-400">Yeni Kontrol Listesi</h4>
                             <div className="space-y-3">
                                <input type="text" value={newChecklistTitle} onChange={e => setNewChecklistTitle(e.target.value)} placeholder="Liste Başlığı" className="w-full bg-gray-700 rounded p-2"/>
                                {newChecklistItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input type="text" value={item} onChange={e => handleItemTextChange(index, e.target.value)} placeholder={`Gözlem Maddesi ${index + 1}`} className="w-full bg-gray-700 rounded p-2"/>
                                        <button onClick={() => handleRemoveItem(index)} className="text-rose-400 hover:text-rose-300">&times;</button>
                                    </div>
                                ))}
                                <Button onClick={handleAddNewItem} variant="secondary" className="text-xs !py-1 !px-2">Madde Ekle</Button>
                             </div>
                             <div className="flex justify-end space-x-2 mt-4">
                                 <Button onClick={() => setIsCreating(false)} variant="secondary">İptal</Button>
                                 <Button onClick={handleSaveNewChecklist}>Kaydet</Button>
                             </div>
                        </Card>
                    )}
                </Accordion>
            </div>
        </div>
    );
};

export default ChecklistManager;