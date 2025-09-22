import React, { useState, useCallback, useMemo } from 'react';
import { Grade, Tool, UnitData } from '../../types';
import ToolViewWrapper from './ToolViewWrapper';
import { useUnitDatabase } from '../../hooks/useUnitDatabase';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';
import MultiSelectModal from '../ui/MultiSelectModal';
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

const outcomeMap11 = new Map<string, string>();
ogrenmeCiktilariOptions11.forEach(unit => {
    if (unit.children) {
        unit.children.forEach(outcome => {
            outcomeMap11.set(outcome.id + '.', outcome.label);
            // Handle variations like "11.1.1." vs "1111."
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

const UnitDatabase: React.FC<Props> = ({ grade, onBack }) => {
    const { units, updateUnit } = useUnitDatabase({ grade });
    const [activeUnitIndex, setActiveUnitIndex] = useState(0);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        options: OptionNode[];
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
            options,
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

    const renderTenthGradeForm = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSelectField label="Alan Becerileri" selectedItems={activeUnit.fieldSkills} onOpen={() => openModal('Alan Becerileri Seç', alanBecerileriOptions, activeUnit.fieldSkills, 'fieldSkills')} />
                <MultiSelectField label="Eğilimler" selectedItems={activeUnit.tendencies} onOpen={() => openModal('Eğilimler Seç', egilimlerOptions, activeUnit.tendencies, 'tendencies')} />
            </div>
            
            <Accordion title="PROGRAM ARASI BİLEŞENLER" isOpen={true} onToggle={()=>{}}>
                <div className="space-y-4 p-2">
                    <MultiSelectField label="Sosyal-Duygusal Öğrenme Becerileri" selectedItems={activeUnit.socialEmotionalSkills} onOpen={() => openModal('Sosyal-Duygusal Öğrenme Becerileri Seç', sosyalDuygusalOptions, activeUnit.socialEmotionalSkills, 'socialEmotionalSkills')} />
                    <MultiSelectField label="Değerler" selectedItems={activeUnit.values} onOpen={() => openModal('Değerler Seç', degerlerOptions, activeUnit.values, 'values')} />
                    <MultiSelectField label="Okur Yazarlık Becerileri" selectedItems={activeUnit.literacySkills} onOpen={() => openModal('Okur Yazarlık Becerileri Seç', okuryazarlikOptions, activeUnit.literacySkills, 'literacySkills')} />
                    <FormField label="Disiplinler Arası İlişkiler"><textarea rows={3} value={activeUnit.interdisciplinaryRelations} onChange={e => handleUpdate('interdisciplinaryRelations', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    <MultiSelectField label="Beceriler Arası İlişkiler (Kavramsal)" selectedItems={activeUnit.conceptualSkills} onOpen={() => openModal('Kavramsal Beceriler Seç', kavramsalBecerilerOptions, activeUnit.conceptualSkills, 'conceptualSkills')} />
                    <MultiSelectField label="Öğrenme Çıktıları ve Süreç Bileşenleri" selectedItems={activeUnit.learningOutcomes} onOpen={() => openModal('Öğrenme Çıktıları Seç', ogrenmeCiktilariOptions10, activeUnit.learningOutcomes, 'learningOutcomes')} />
                    <FormField label="İçerik Çerçevesi"><textarea rows={3} value={activeUnit.contentFramework} onChange={e => handleUpdate('contentFramework', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    <FormField label="Anahtar Kavramlar"><input type="text" value={activeUnit.keyConcepts} onChange={e => handleUpdate('keyConcepts', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    <FormField label="Öğrenme Kanıtları (Ölçme Değerlendirme)"><textarea rows={3} value={activeUnit.learningEvidence} onChange={e => handleUpdate('learningEvidence', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                </div>
            </Accordion>
            
            <Accordion title="ÖĞRENME-ÖĞRETME YAŞANTILARI" isOpen={true} onToggle={()=>{}}>
                <div className="space-y-4 p-2">
                     <FormField label="Temel Kabuller"><textarea rows={3} value={activeUnit.basicAssumptions} onChange={e => handleUpdate('basicAssumptions', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                     <FormField label="Ön Değerlendirme Süreci"><textarea rows={3} value={activeUnit.preAssessment} onChange={e => handleUpdate('preAssessment', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                     <FormField label="Köprü Kurma"><textarea rows={3} value={activeUnit.bridging} onChange={e => handleUpdate('bridging', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                     <FormField label="Öğrenme Öğretme Uygulamaları"><textarea rows={10} value={activeUnit.teachingPractices} onChange={e => handleUpdate('teachingPractices', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                </div>
            </Accordion>
             <Accordion title="FARKLILAŞTIRMA" isOpen={true} onToggle={()=>{}}>
                <div className="space-y-4 p-2">
                    <FormField label="Zenginleştirme"><textarea rows={3} value={activeUnit.enrichment} onChange={e => handleUpdate('enrichment', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    <FormField label="Destekleme"><textarea rows={3} value={activeUnit.support} onChange={e => handleUpdate('support', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                </div>
            </Accordion>
        </>
    );

    const renderEleventhGradeForm = () => (
        <Card className="bg-gray-800/50">
            <h3 className="text-lg font-semibold mb-3 text-indigo-400">Ünite Konuları ve Kazanımları</h3>
            {activeUnit.topics && activeUnit.topics.length > 0 ? (
                <div className="space-y-4">
                {activeUnit.topics.map((topic, i) => (
                    <div key={i} className="p-3 bg-gray-900/40 rounded-md border border-gray-700/50">
                        <p className="font-semibold text-gray-200">{topic.name}</p>
                        <p className="text-sm text-gray-400 mt-1 pl-2 border-l-2 border-indigo-500">{getFullOutcomes11([topic.outcome])[0]}</p>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 italic">Bu ünite için konu bulunmuyor.</p>
            )}
        </Card>
    );

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
            <div className="flex border-b border-gray-700 mb-4 overflow-x-auto">
                {units.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveUnitIndex(index)}
                        className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${
                            activeUnitIndex === index
                                ? 'border-b-2 border-indigo-400 text-indigo-400'
                                : 'text-gray-400 hover:bg-gray-800/50'
                        }`}
                    >
                        Ünite {index + 1}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField label="Ünite Adı">
                        <input
                            type="text"
                            value={activeUnit.unitName}
                            onChange={(e) => handleUpdate('unitName', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormField>
                    <FormField label="Süresi">
                        <input
                            type="text"
                            value={activeUnit.duration}
                            onChange={(e) => handleUpdate('duration', e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </FormField>
                </div>
                
                {isTenthGrade ? renderTenthGradeForm() : renderEleventhGradeForm()}
            </div>
        </ToolViewWrapper>
    );
};

export default UnitDatabase;
