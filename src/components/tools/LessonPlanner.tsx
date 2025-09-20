import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Grade, Tool, StoredFile, UnitData, UnitTopic } from '../../types.ts';
import { generateLessonPlan, generateLessonPlanGrade11 } from '../../services/geminiService.ts';
import Button from '../ui/Button.tsx';
import ToolViewWrapper from './ToolViewWrapper.tsx';
import { useDatabase } from '../../hooks/useDatabase.ts';
import { useUnitDatabase } from '../../hooks/useUnitDatabase.ts';
import PlanOutput from '../ui/PlanOutput.tsx';
import { ogrenmeCiktilariOptions10, ogrenmeCiktilariOptions11, alanBecerileriOptions, kavramsalBecerilerOptions, egilimlerOptions, sosyalDuygusalOptions, degerlerOptions, okuryazarlikOptions, OptionNode } from '../../data/unitDatabaseOptions.ts';
import Accordion from '../ui/Accordion.tsx';
import MultiSelectModal from '../ui/MultiSelectModal.tsx';

interface Props {
  grade: Grade;
  onBack: () => void;
}

const outcomeMap11 = new Map<string, string>();
ogrenmeCiktilariOptions11.forEach((unit: OptionNode) => {
    if (unit.children) {
        unit.children.forEach((outcome: OptionNode) => {
            outcomeMap11.set(outcome.id + '.', outcome.label);
            outcomeMap11.set(outcome.id.replace(/\./g, '') + '.', outcome.label); // Handle variations
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
            <Button onClick={onOpen} variant="secondary" className="!py-1 !px-2 text-xs">Seç/Düzenle</Button>
        </div>
    </div>
);

const LessonPlanner: React.FC<Props> = ({ grade, onBack }) => {
    const { units } = useUnitDatabase({ grade });
    const [isLoading, setIsLoading] = useState(false);
    const [editablePlan, setEditablePlan] = useState('');
    const { files } = useDatabase({ grade });

    // --- Common State ---
    const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
    const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; options: OptionNode[]; selected: string[]; onSave: (selected: string[]) => void; } | null>(null);


    // --- Grade 10 State ---
    const [planData, setPlanData] = useState<UnitData | null>(null);
    const [lessonHours, setLessonHours] = useState('2');
    const [date, setDate] = useState('');
    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
        'beceriler': true,
        'program_arasi': false,
        'ogrenme_sureci': false,
        'ogretme_yasantilari': false,
        'farklilastirma': false,
    });
    
    // --- Grade 11 State ---
    const [className, setClassName] = useState('');
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
    const [duration, setDuration] = useState('2 ders saati');
    const [methods, setMethods] = useState('Anlatım, Soru-Cevap, Tartışma, Beyin Fırtınası');
    const [resources, setResources] = useState('MEB onaylı Lise Felsefe Ders Kitabı\nAkıllı tahta\nDers videoları\nEBA içerikleri');

    const selectedUnit = useMemo(() => units[selectedUnitIndex], [units, selectedUnitIndex]);
    
    // Grade 11 derived state
    const topics = useMemo(() => selectedUnit?.topics || [], [selectedUnit]);
    const selectedTopic = useMemo(() => topics[selectedTopicIndex], [topics, selectedTopicIndex]);
    const outcomeCode = useMemo(() => selectedTopic?.outcome || '', [selectedTopic]);
    const fullOutcomeText = useMemo(() => {
        if (!outcomeCode) return '';
        const results = getFullOutcomes11([outcomeCode]);
        return results[0] || '';
    }, [outcomeCode]);

    useEffect(() => {
        if (grade === Grade.TENTH) {
            setPlanData(selectedUnit);
        } else {
            setSelectedTopicIndex(0);
        }
    }, [selectedUnitIndex, selectedUnit, grade]);

    // --- Grade 10 Logic ---
    const handlePlanDataChange = (field: keyof UnitData, value: any) => {
        setPlanData(prev => prev ? { ...prev, [field]: value } : null);
    };
    
    const openModal = (title: string, options: OptionNode[], selected: string[] | undefined, field: keyof UnitData) => {
        setModalState({
            isOpen: true, title, options, selected: selected || [],
            onSave: (newSelected) => {
                handlePlanDataChange(field, newSelected);
                setModalState(null);
            },
        });
    };

    const toggleAccordion = (id: string) => {
        setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const constructFullPlanGrade10 = useCallback((unit: UnitData, experiences: string, lessonDate: string): string => {
        const sections = [
            { title: 'DERS PLANI', content: `**Sınıf:** 10\n**Ders Saati:** ${lessonHours}\n**Tarih:** ${lessonDate || '.../.../....'}` },
            { title: 'Ünite Adı', content: unit.unitName },
            { title: 'Süre', content: unit.duration },
            { title: 'ALAN BECERİLERİ', content: unit.fieldSkills.join('\n• ') },
            { title: 'KAVRAMSAL BECERİLER', content: unit.conceptualSkills.join('\n• ') },
            { title: 'EĞİLİMLER', content: unit.tendencies.join('\n• ') },
            { title: 'PROGRAMLAR ARASI BİLEŞENLER' },
            { title: '  Sosyal-Duygusal Öğrenme Becerileri', content: unit.socialEmotionalSkills.join('\n• ') },
            { title: '  Değerler', content: unit.values.join('\n• ') },
            { title: '  Okuryazarlık Becerileri', content: unit.literacySkills.join('\n• ') },
            { title: 'DİSİPLİNLER ARASI İLİŞKİLER', content: unit.interdisciplinaryRelations },
            { title: 'BECERİLER ARASI İLİŞKİLER', content: unit.conceptualSkills.join('\n• ') },
            { title: 'SÜREÇ BİLEŞENLERİ (Öğrenme Çıktıları)', content: unit.learningOutcomes.join('\n') },
            { title: 'İÇERİK ÇERÇEVESİ', content: unit.contentFramework },
            { title: 'ÖĞRENME KANITLARI (Ölçme ve Değerlendirme)', content: unit.learningEvidence },
            { title: 'ÖĞRENME-ÖĞRETME YAŞANTILARI' },
            { title: '  Temel Kabuller', content: unit.basicAssumptions },
            { title: '  Ön Değerlendirme Süreci', content: unit.preAssessment },
            { title: '  Köprü Kurma', content: unit.bridging },
            { title: '  Öğretme-Öğrenme Uygulamaları', content: `\n${experiences}\n` },
            { title: 'FARKLILAŞTIRMA' },
            { title: '  Zenginleştirme', content: unit.enrichment },
            { title: '  Destekleme', content: unit.support },
        ];
    
        return sections
            .map(section => {
                 if (section.content?.startsWith('**')) return section.content; // Already formatted
                if (section.content) {
                    return `**${section.title}:**\n${section.content.startsWith('• ') ? '' : '• '}${section.content}`;
                }
                return `\n--------------------------------\n**${section.title}**\n--------------------------------`;
            })
            .join('\n\n');
    }, [lessonHours]);

    const handleGenerateGrade10 = useCallback(async () => {
        if (!planData) return;
        setIsLoading(true);
        setEditablePlan('');
        
        const dbFiles = Object.values(files).filter((file): file is StoredFile => file !== null);

        const generatedExperiences = await generateLessonPlan(grade, planData, dbFiles);
        
        if (generatedExperiences) {
            const lessonDateStr = date ? new Date(date).toLocaleDateString('tr-TR') : 'Belirtilmemiş';
            const fullPlan = constructFullPlanGrade10(planData, generatedExperiences, lessonDateStr);
            setEditablePlan(fullPlan);
        }
        
        setIsLoading(false);
    }, [grade, planData, date, files, constructFullPlanGrade10]);

    // --- Grade 11 Logic ---
    const constructFullPlanGrade11 = useCallback((generatedContent: { process: string; evaluation: string; }): string => {
        const plan = `
**11/${className || '...'} SINIFI DERS PLANI**

**Öğrenme Alanı-Ünite:** ${selectedUnit.unitName}
**Alt Öğrenme Alanı:** ${selectedTopic?.name || 'Belirtilmemiş'}
**Süre:** ${duration}          **Tarih:** ${date ? new Date(date).toLocaleDateString('tr-TR') : '.../.../....'}

---

**Kazanımlar:**
• ${fullOutcomeText || 'Belirtilmemiş'}

**Öğretim Yöntemleri:**
${methods}

**Araç-Gereçler ve Kaynaklar:**
${resources}

---

**ÖĞRENME ÖĞRETME SÜRECİ:**
${generatedContent.process}

---

**ÖLÇME DEĞERLENDİRME:**
${generatedContent.evaluation}

---

**Ders Öğretmeni**         **Okul Müdürü**
`;
        return plan.trim();
    }, [className, duration, date, selectedUnit, methods, resources, selectedTopic, fullOutcomeText]);

    const handleGenerateGrade11 = useCallback(async () => {
        if (!selectedUnit || !selectedTopic) return;
        setIsLoading(true);
        setEditablePlan('');

        const dbFiles = Object.values(files).filter((file): file is StoredFile => file !== null);
        
        const generatedContent = await generateLessonPlanGrade11({
            grade,
            unit: selectedUnit,
            subTopic: selectedTopic.name,
            methods,
            fullOutcomes: [fullOutcomeText],
            dbFiles
        });
        
        if (generatedContent) {
            const fullPlan = constructFullPlanGrade11(generatedContent);
            setEditablePlan(fullPlan);
        } else {
            setEditablePlan("Plan oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        }
        
        setIsLoading(false);
    }, [grade, selectedUnit, methods, files, constructFullPlanGrade11, selectedTopic, fullOutcomeText, date]); // Added date to dependencies
    
    // --- Common Render Logic ---
    const renderResultComponent = (resultString: string) => {
        if (!selectedUnit) return null;
        return <PlanOutput content={resultString} onContentChange={setEditablePlan} title={selectedUnit.unitName} />;
    };

    const renderGrade11Form = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Sınıf Şubesi (Örn: A)">
                    <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
                </FormField>
                <FormField label="Ünite">
                    <select value={selectedUnitIndex} onChange={e => setSelectedUnitIndex(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
                        {units.map((unit, index) => <option key={index} value={index}>{unit.unitName}</option>)}
                    </select>
                </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField label="Konu">
                    <select value={selectedTopicIndex} onChange={e => setSelectedTopicIndex(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" disabled={topics.length === 0}>
                        {topics.map((topic, index) => <option key={index} value={index}>{topic.name}</option>)}
                    </select>
                </FormField>
                 <FormField label="Kazanım">
                    <div className="w-full bg-gray-800/50 border border-gray-700/50 rounded-md px-3 py-2 text-sm text-gray-300 min-h-[42px] flex items-center">
                        {fullOutcomeText || 'Lütfen bir konu seçin.'}
                    </div>
                </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Süre">
                    <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
                </FormField>
                <FormField label="Tarih">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
                </FormField>
            </div>
            <FormField label="Öğretim Yöntemleri">
                <textarea value={methods} rows={3} onChange={e => setMethods(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
            </FormField>
            <FormField label="Araç-Gereçler ve Kaynaklar">
                <textarea value={resources} rows={4} onChange={e => setResources(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
            </FormField>
            <div className="text-right pt-2">
                <Button onClick={handleGenerateGrade11} isLoading={isLoading} disabled={!selectedTopic}>
                    Ders Planı Oluştur
                </Button>
            </div>
        </div>
    );

    const renderGrade10Form = () => {
        if (!planData) return <div>Ünite verisi yükleniyor...</div>;

        return (
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <FormField label="Planı Oluşturulacak Ünite">
                            <select value={selectedUnitIndex} onChange={(e) => setSelectedUnitIndex(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
                                {units.map((unit, index) => <option key={index} value={index}>{unit.unitName || `Ünite ${index + 1}`}</option>)}
                            </select>
                        </FormField>
                    </div>
                    <FormField label="Ders Saati">
                        <input type="number" min="1" value={lessonHours} onChange={(e) => setLessonHours(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
                    </FormField>
                    <FormField label="Tarih">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"/>
                    </FormField>
                </div>
                
                <Accordion title="Beceriler ve Eğilimler" isOpen={openAccordions['beceriler']} onToggle={() => toggleAccordion('beceriler')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <MultiSelectField label="Alan Becerileri" selectedItems={planData.fieldSkills} onOpen={() => openModal('Alan Becerileri Seç', alanBecerileriOptions, planData.fieldSkills, 'fieldSkills')} />
                        <MultiSelectField label="Kavramsal Beceriler" selectedItems={planData.conceptualSkills} onOpen={() => openModal('Kavramsal Beceriler Seç', kavramsalBecerilerOptions, planData.conceptualSkills, 'conceptualSkills')} />
                        <MultiSelectField label="Eğilimler" selectedItems={planData.tendencies} onOpen={() => openModal('Eğilimler Seç', egilimlerOptions, planData.tendencies, 'tendencies')} />
                    </div>
                </Accordion>
                <Accordion title="Programlar Arası Bileşenler" isOpen={openAccordions['program_arasi']} onToggle={() => toggleAccordion('program_arasi')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <MultiSelectField label="Sosyal-Duygusal Öğrenme Becerileri" selectedItems={planData.socialEmotionalSkills} onOpen={() => openModal('Sosyal-Duygusal Beceriler', sosyalDuygusalOptions, planData.socialEmotionalSkills, 'socialEmotionalSkills')} />
                        <MultiSelectField label="Değerler" selectedItems={planData.values} onOpen={() => openModal('Değerler Seç', degerlerOptions, planData.values, 'values')} />
                        <MultiSelectField label="Okuryazarlık Becerileri" selectedItems={planData.literacySkills} onOpen={() => openModal('Okuryazarlık Becerileri', okuryazarlikOptions, planData.literacySkills, 'literacySkills')} />
                        <FormField label="Disiplinler Arası İlişkiler"><textarea rows={2} value={planData.interdisciplinaryRelations} onChange={e => handlePlanDataChange('interdisciplinaryRelations', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    </div>
                </Accordion>
                <Accordion title="Öğrenme Süreci" isOpen={openAccordions['ogrenme_sureci']} onToggle={() => toggleAccordion('ogrenme_sureci')}>
                     <div className="space-y-4 p-2">
                        <MultiSelectField label="Süreç Bileşenleri (Öğrenme Çıktıları)" selectedItems={planData.learningOutcomes} onOpen={() => openModal('Öğrenme Çıktıları Seç', ogrenmeCiktilariOptions10, planData.learningOutcomes, 'learningOutcomes')} />
                        <FormField label="İçerik Çerçevesi"><textarea rows={3} value={planData.contentFramework} onChange={e => handlePlanDataChange('contentFramework', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                        <FormField label="Öğrenme Kanıtları (Ölçme ve Değerlendirme)"><textarea rows={3} value={planData.learningEvidence} onChange={e => handlePlanDataChange('learningEvidence', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    </div>
                </Accordion>
                 <Accordion title="Öğretme-Öğrenme Yaşantıları" isOpen={openAccordions['ogretme_yasantilari']} onToggle={() => toggleAccordion('ogretme_yasantilari')}>
                     <div className="space-y-4 p-2">
                        <FormField label="Temel Kabuller"><textarea rows={2} value={planData.basicAssumptions} onChange={e => handlePlanDataChange('basicAssumptions', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                        <FormField label="Ön Değerlendirme Süreci"><textarea rows={2} value={planData.preAssessment} onChange={e => handlePlanDataChange('preAssessment', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                        <FormField label="Köprü Kurma"><textarea rows={2} value={planData.bridging} onChange={e => handlePlanDataChange('bridging', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                        <p className="text-xs text-gray-500 mt-1">"Öğretme-Öğrenme Uygulamaları" bölümü, aşağıdaki butona tıkladığınızda yapay zeka tarafından oluşturulacaktır.</p>
                    </div>
                </Accordion>
                <Accordion title="Farklılaştırma" isOpen={openAccordions['farklilastirma']} onToggle={() => toggleAccordion('farklilastirma')}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <FormField label="Zenginleştirme"><textarea rows={3} value={planData.enrichment} onChange={e => handlePlanDataChange('enrichment', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                        <FormField label="Destekleme"><textarea rows={3} value={planData.support} onChange={e => handlePlanDataChange('support', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" /></FormField>
                    </div>
                </Accordion>
                <div className="text-right pt-2">
                    <Button onClick={handleGenerateGrade10} isLoading={isLoading} disabled={!planData}>
                        Ders Planı Oluştur
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <ToolViewWrapper toolName={Tool.LESSON_PLAN} onBack={onBack} isLoading={isLoading} result={editablePlan} renderResult={renderResultComponent}>
             {modalState?.isOpen && (
                <MultiSelectModal
                    title={modalState.title}
                    options={modalState.options}
                    initialSelected={modalState.selected}
                    onClose={() => setModalState(null)}
                    onSave={modalState.onSave}
                />
            )}
            {grade === Grade.TENTH ? renderGrade10Form() : renderGrade11Form()}
        </ToolViewWrapper>
    );
};

export default LessonPlanner;