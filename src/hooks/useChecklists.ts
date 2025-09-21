import { useState, useCallback, useEffect } from 'react';
import { Classroom, Checklist, ChecklistData, ChecklistState } from '../types.ts';

const STORAGE_KEY_PREFIX = 'philosophy_checklists_data_';
const CUSTOM_CHECKLISTS_KEY = 'philosophy_custom_checklists_v2';

const defaultChecklists: Checklist[] = [
    {
        id: 'default_socratic_discussion',
        title: 'Sokratik Tartışma Becerileri',
        isCustom: false,
        items: [
            { id: 'soc_1', text: 'Sorulara açık uçlu ve düşünülmüş cevaplar veriyor.' },
            { id: 'soc_2', text: 'Başkalarının görüşlerini dikkatle dinliyor ve anladığını gösteriyor.' },
            { id: 'soc_3', text: 'Kendi argümanlarını mantıksal temellere dayandırıyor.' },
            { id: 'soc_4', text: 'Farklı bakış açılarını sorguluyor ve değerlendiriyor.' },
            { id: 'soc_5', text: 'Tartışmaya yapıcı bir şekilde katkıda bulunuyor.' },
        ],
    },
    {
        id: 'default_argument_analysis',
        title: 'Argüman Analizi Becerileri',
        isCustom: false,
        items: [
            { id: 'arg_1', text: 'Bir metindeki ana argümanı tespit ediyor.' },
            { id: 'arg_2', text: 'Öncülleri ve sonucu doğru bir şekilde ayırt ediyor.' },
            { id: 'arg_3', text: 'Argümanın geçerliliğini ve tutarlılığını değerlendiriyor.' },
            { id: 'arg_4', text: 'Mantık hatalarını (safsataları) fark ediyor.' },
            { id: 'arg_5', text: 'Karşı argümanlar geliştirebiliyor.' },
        ],
    }
];

export const useChecklists = (classroom: Classroom | null) => {
    const [checklistData, setChecklistData] = useState<ChecklistData>({});
    const [allChecklists, setAllChecklists] = useState<Checklist[]>(defaultChecklists);
    const storageKey = classroom ? `${STORAGE_KEY_PREFIX}${classroom.id}` : null;

    useEffect(() => {
        try {
            const savedCustom = localStorage.getItem(CUSTOM_CHECKLISTS_KEY);
            const customChecklists = savedCustom ? JSON.parse(savedCustom) : [];
            setAllChecklists([...defaultChecklists, ...customChecklists]);
        } catch (e) {
            console.error("Failed to load custom checklists", e);
            setAllChecklists(defaultChecklists);
        }
    }, []);

    useEffect(() => {
        if (!storageKey) {
            setChecklistData({});
            return;
        }
        try {
            const item = localStorage.getItem(storageKey);
            setChecklistData(item ? JSON.parse(item) : {});
        } catch (error) {
            console.error("Error loading checklist data:", error);
            setChecklistData({});
        }
    }, [storageKey]);

    const saveData = useCallback((data: ChecklistData) => {
        if (!storageKey) return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            setChecklistData(data);
        } catch (error) {
            console.error("Error saving checklist data:", error);
        }
    }, [storageKey]);

    const updateStudentChecklistState = useCallback((checklistId: string, studentId: string, itemIndex: number, state: ChecklistState) => {
        const newData = { ...checklistData };
        if (!newData[checklistId]) {
            newData[checklistId] = {};
        }
        if (!newData[checklistId][studentId]) {
            const checklist = allChecklists.find(c => c.id === checklistId);
            newData[checklistId][studentId] = Array(checklist?.items.length || 0).fill(null);
        }
        newData[checklistId][studentId][itemIndex] = state;
        saveData(newData);
    }, [checklistData, allChecklists, saveData]);
    
    const saveCustomChecklists = (customChecklists: Checklist[]) => {
         try {
            localStorage.setItem(CUSTOM_CHECKLISTS_KEY, JSON.stringify(customChecklists));
            setAllChecklists([...defaultChecklists, ...customChecklists]);
        } catch (error) {
            console.error("Error saving custom checklists", error);
        }
    };
    
    const addCustomChecklist = useCallback((title: string, items: string[]) => {
        const customChecklists = allChecklists.filter(c => c.isCustom);
        const newChecklist: Checklist = {
            id: `custom_${crypto.randomUUID()}`,
            title,
            items: items.map((text) => ({ id: `item_${crypto.randomUUID()}`, text })),
            isCustom: true,
        };
        saveCustomChecklists([...customChecklists, newChecklist]);
    }, [allChecklists]);
    
    const deleteCustomChecklist = useCallback((checklistId: string) => {
        const customChecklists = allChecklists.filter(c => c.isCustom && c.id !== checklistId);
        saveCustomChecklists(customChecklists);
    }, [allChecklists]);

    return { allChecklists, checklistData, updateStudentChecklistState, addCustomChecklist, deleteCustomChecklist };
};