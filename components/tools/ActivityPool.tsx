
import React, { useState, useMemo, useEffect } from 'react';
import { Tool, Activity, ActivityCategory, Grade, activityCategories } from '../../types';
import ToolViewWrapper from './ToolViewWrapper';
import { useActivityPool } from '../../hooks/useActivityPool';
import Card from '../ui/Card';
import { SparklesIcon } from '../ui/Icons';
import ActivityModal from '../ui/ActivityModal';
import { useUnitDatabase } from '../../hooks/useUnitDatabase';
import { generateActivity } from '../../services/geminiService';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import { ogrenmeCiktilariOptions11 } from '../../data/unitDatabaseOptions';

interface Props {
  onBack: () => void;
  grade: Grade;
}

const outcomeMap11 = new Map<string, string>();
ogrenmeCiktilariOptions11.forEach(unit => {
    if (unit.children) {
        unit.children.forEach(outcome => {
            outcomeMap11.set(outcome.id + '.', outcome.label);
            outcomeMap11.set(outcome.id.replace(/\./g, '') + '.', outcome.label); 
        });
    }
});
const getFullOutcomeText11 = (outcomeCode: string): string => {
    if (!outcomeCode) return "Belirtilmemiş";
    const cleanCode = outcomeCode.replace(/ /g, '').endsWith('.') ? outcomeCode.replace(/ /g, '') : outcomeCode.replace(/ /g, '') + '.';
    return outcomeMap11.get(cleanCode) || outcomeCode;
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const ActivityPool: React.FC<Props> = ({ grade, onBack }) => {
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    // Grade 10 logic
    const { activities, categories, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useActivityPool();
    
    // Grade 11 logic
    const { units } = useUnitDatabase({ grade });
    const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);
    const [selectedActivityType, setSelectedActivityType] = useState<ActivityCategory>(activityCategories[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedActivity, setGeneratedActivity] = useState<Activity | null>(null);

    const selectedUnit = useMemo(() => units[selectedUnitIndex], [units, selectedUnitIndex]);
    const topics = useMemo(() => selectedUnit?.topics || [], [selectedUnit]);
    const selectedTopic = useMemo(() => topics[selectedTopicIndex], [topics, selectedTopicIndex]);
    const outcomeCode = useMemo(() => selectedTopic?.outcome || '', [selectedTopic]);
    const fullOutcomeText = useMemo(() => getFullOutcomeText11(outcomeCode), [outcomeCode]);

    useEffect(() => {
        setSelectedTopicIndex(0);
    }, [selectedUnitIndex]);

    const handleGenerateActivity = async () => {
        if (!selectedUnit || !selectedTopic) return;
        setIsLoading(true);
        setGeneratedActivity(null);
        const result = await generateActivity({
            unitName: selectedUnit.unitName,
            topic: selectedTopic.name,
            outcome: fullOutcomeText,
            activityType: selectedActivityType
        });
        setGeneratedActivity(result);
        setIsLoading(false);
    };

    const renderGeneratedActivity = () => {
        if (isLoading) {
            return (
                <Card>
                    <div className="flex flex-col items-center justify-center h-40">
                        <Loader />
                        <p className="mt-4 text-gray-400">Yapay zeka etkinliğinizi oluşturuyor...</p>
                    </div>
                </Card>
            );
        }
        if (generatedActivity) {
            return <Card onClick={() => setSelectedActivity(generatedActivity)} className="cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white flex-grow pr-2">{generatedActivity.title}</h3>
                    <SparklesIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-400 mb-4 flex-grow">{generatedActivity.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-700/50">
                    <span>{generatedActivity.category}</span>
                    <span>{generatedActivity.duration}</span>
                </div>
                <p className="text-center text-xs text-indigo-400 mt-4">Detayları görmek için tıklayın.</p>
            </Card>
        }
        return null;
    };
    
    if (grade === Grade.ELEVENTH) {
        return (
            <>
                {selectedActivity && <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
                <ToolViewWrapper toolName={Tool.ETKINLIK_HAVUZU} onBack={onBack} isLoading={false} result="">
                    <Card>
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-indigo-400">Yapay Zeka Destekli Etkinlik Oluşturucu</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Ünite Seçin">
                                    <select value={selectedUnitIndex} onChange={e => setSelectedUnitIndex(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
                                        {units.map((unit, index) => <option key={index} value={index}>{unit.unitName}</option>)}
                                    </select>
                                </FormField>
                                <FormField label="Konu Seçin">
                                    <select value={selectedTopicIndex} onChange={e => setSelectedTopicIndex(parseInt(e.target.value, 10))} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" disabled={topics.length === 0}>
                                        {topics.map((topic, index) => <option key={index} value={index}>{topic.name}</option>)}
                                    </select>
                                </FormField>
                            </div>
                            <div className="bg-gray-800/50 p-3 rounded-md">
                                <p className="text-xs font-semibold text-gray-400 mb-1">İlgili Kazanım:</p>
                                <p className="text-sm text-gray-300">{fullOutcomeText}</p>
                            </div>
                             <FormField label="Etkinlik Türü Seçin">
                                <select value={selectedActivityType} onChange={e => setSelectedActivityType(e.target.value as ActivityCategory)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
                                    {activityCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </FormField>
                            <div className="text-right pt-2">
                                <Button onClick={handleGenerateActivity} isLoading={isLoading} disabled={!selectedTopic}>
                                    <SparklesIcon className="h-5 w-5 mr-2" />
                                    Etkinlik Oluştur
                                </Button>
                            </div>
                        </div>
                    </Card>
                    <div className="mt-6">
                        {renderGeneratedActivity()}
                    </div>
                </ToolViewWrapper>
            </>
        );
    }
    
    // Grade 10 View
    return (
        <>
            {selectedActivity && <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
            <ToolViewWrapper toolName={Tool.ETKINLIK_HAVUZU} onBack={onBack} isLoading={false} result="">
                <div className="space-y-6">
                    <Card>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Etkinlik ara..."
                                className="w-full md:flex-grow bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value as ActivityCategory | 'all')}
                                className="w-full md:w-52 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">Tüm Kategoriler</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map(activity => (
                            <Card key={activity.id} onClick={() => setSelectedActivity(activity)} className="cursor-pointer flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-white flex-grow pr-2">{activity.title}</h3>
                                    <SparklesIcon className="h-6 w-6 text-fuchsia-400 flex-shrink-0" />
                                </div>
                                <p className="text-sm text-gray-400 mb-4 flex-grow">{activity.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-2 border-t border-gray-700/50">
                                    <span>{activity.category}</span>
                                    <span>{activity.duration}</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {activities.length === 0 && (
                        <p className="text-center text-gray-500 py-10">Aradığınız kriterlere uygun etkinlik bulunamadı.</p>
                    )}
                </div>
            </ToolViewWrapper>
        </>
    );
};

export default ActivityPool;