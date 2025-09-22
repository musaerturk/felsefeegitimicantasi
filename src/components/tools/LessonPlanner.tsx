import React, { useState, useCallback, useMemo } from 'react';
import { Grade, Tool, UnitData } from '../../types';
import ToolViewWrapper from './ToolViewWrapper';
import { useUnitDatabase } from '../../hooks/useUnitDatabase';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import MultiSelectModal, { Option } from '../ui/MultiSelectModal';
import { 
    alanBecerileriOptions, 
    egilimlerOptions, 
    sosyalDuygusalOptions,
    degerlerOptions,
    okuryazarlikOptions,
    ogrenmeCiktilariOptions10,
    ogrenmeCiktilariOptions11,
    kavramsalBecerilerOptions,
    OptionNode 
} from '../../data/unitDatabaseOptions';
import Card from '../ui/Card';

interface Props {
  grade: Grade;
  onBack: () => void;
}

// --- Dönüştürücü: OptionNode -> Option ---
const toOptions = (nodes: OptionNode[]): Option[] =>
  nodes.map((n) => ({
    value: n.id,
    label: n.label,
    children: n.children ? toOptions(n.children) : undefined,
  }));

const outcomeMap11 = new Map<string, string>();
ogrenmeCiktilariOptions11.forEach((unit: OptionNode) => {
    if (unit.children) {
        unit.children.forEach((outcome: OptionNode) => {
            outcomeMap11.set(outcome.id + '.', outcome.label);
            outcomeMap11.set(outcome.id.replace(/\./g, '') + '.', outcome.label); 
        });
    }
});

const getFullOutcomes11 = (outcomeCodes: string[]): string[] => {
    return outcomeCodes.map(code => {
        const cleanCode = code.replace(/ /g, '').endsWith('.') ? code.replace(/ /g, '') : code.replace(/ /g, '') + '.';
        return outcomeMap11.get(cleanCode) || code;
    });
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const MultiSelectField: React.FC<{
    label: string;
    selectedItems: string[];
    onOpen: () => void;
}> = ({ label, selectedItems, onOpen }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="p-2 bg-gray-700/50 border border-gray-600 rounded-md min-h-[40px] flex items-center justify-between">
            <span className="text-gray-300 text-sm italic">
                {selectedItems.length > 0 ? `${selectedItems.length} öğe seçildi` : 'Seçim yapılmadı'}
            </span>
            <Button onClick={onOpen} variant="secondary" className="!py-1 !px-2 text-xs">Seç</Button>
        </div>
    </div>
);

const LessonPlanner: React.FC<Props> = ({ grade, onBack }) => {
    const { units, updateUnit } = useUnitDatabase({ grade });
    const [activeUnitIndex, setActiveUnitIndex] = useState(0);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        options: Option[];
        selected: string[];
        onSave: (selected: string[]) => void;
    } | null>(null);

    const activeUnit = useMemo(() => units[activeUnitIndex], [units, activeUnitIndex]);

    const handleUpdate = useCallback((field: keyof UnitData, value: any) => {
        if (!activeUnit) return;
        const updatedUnit = { ...activeUnit, [field]: value };
        updateUnit(activeUnitIndex, updatedUnit);
    }, [activeUnit, activeUnitIndex, updateUnit]);

    const openModal = (title: string, options: OptionNode[], selected: string[] | undefined, field: keyof UnitData) => {
        setModalState({
            isOpen: true,
            title,
            options: toOptions(options), // ✅ Tip dönüşümü burada
            selected: selected || [],
            onSave: (newSelected) => {
                handleUpdate(field, newSelected);
                setModalState(null);
            },
        });
    };
    
    if (!activeUnit) {
        return <div className="flex justify-center items-center h-40"><p>Ünite verileri yükleniyor...</p></div>;
    }

    const toolName = grade === Grade.TENTH ? Tool.UNIT_DATABASE : 'Veri Tabanı: Üniteler' as Tool;
    const isTenthGrade = grade === Grade.TENTH;

    // renderTenthGradeForm ve renderEleventhGradeForm aynı kalıyor (değiştirmene gerek yok)

    return (
        <ToolViewWrapper toolName={toolName} onBack={onBack} isLoading={false} result="">
            {modalState?.isOpen && (
                <MultiSelectModal
                    title={modalState.title}
                    options={modalState.options}
                    initialSelected={modalState.selected}
                    onClose={() => setModalState(null)}
                    onSave={modalState.onSave}
                />
            )}
            {/* ... */}
        </ToolViewWrapper>
    );
};

export default LessonPlanner;
