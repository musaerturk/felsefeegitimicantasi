import React, { useState } from 'react';
import Button from './Button.tsx';
import { Grade, Question, QuestionType } from '../../types.ts';
import { useQuestionBank } from '../../hooks/useQuestionBank.ts';
import Accordion from './Accordion.tsx';
import { useUnitDatabase } from '../../hooks/useUnitDatabase.ts';

interface QuestionBankModalProps {
    grade: Grade;
    onClose: () => void;
    onSave: (selectedQuestions: Question[]) => void;
}

const QuestionBankModal: React.FC<QuestionBankModalProps> = ({ grade, onClose, onSave }) => {
    const { questions } = useQuestionBank({ grade });
    const { units } = useUnitDatabase({ grade });
    const [selectedQuestions, setSelectedQuestions] = useState<Set<Question>>(new Set());
    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

    const handleToggleQuestion = (question: Question) => {
        setSelectedQuestions(prev => {
            const newSet = new Set(prev);
            const questionArr = Array.from(newSet);
            const existingQuestion = questionArr.find(q => q.question === question.question && q.answer === question.answer);
            
            if (existingQuestion) {
                newSet.delete(existingQuestion);
            } else {
                newSet.add(question);
            }
            return newSet;
        });
    };

    const handleSave = () => {
        onSave(Array.from(selectedQuestions));
    };

    const toggleAccordion = (id: string) => {
        setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const unitsWithQuestions = Object.keys(questions).map(Number).sort((a, b) => a - b);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col border border-gray-700">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-indigo-400">Soru Bankasından Soru Seç</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    {unitsWithQuestions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Soru bankanızda hiç soru bulunmuyor.</p>
                    ) : (
                        <div className="space-y-2">
                             {unitsWithQuestions.map(unitNum => (
                                <Accordion key={unitNum} title={units[unitNum - 1]?.unitName || `Ünite ${unitNum}`} isOpen={!!openAccordions[`unit-${unitNum}`]} onToggle={() => toggleAccordion(`unit-${unitNum}`)}>
                                    {Object.keys(questions[unitNum]!).map(type => {
                                        const questionType = type as QuestionType;
                                        const currentQuestions = questions[unitNum]![questionType]!;
                                        const accordionId = `unit-${unitNum}-${type}`;
                                        return (
                                        <Accordion key={type} title={`${questionType} (${currentQuestions.length} Soru)`} isSubAccordion isOpen={!!openAccordions[accordionId]} onToggle={() => toggleAccordion(accordionId)}>
                                            <div className="space-y-2">
                                                {currentQuestions.map((q: Question, index: number) => {
                                                    const isSelected = Array.from(selectedQuestions).some(sq => sq.question === q.question);
                                                    return (
                                                        <label key={index} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-700/50 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => handleToggleQuestion(q)}
                                                                className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500 rounded flex-shrink-0 mt-1"
                                                            />
                                                            <div className="flex-grow">
                                                                <p className="text-sm text-gray-200">{q.question}</p>
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </Accordion>
                                        )
                                    })}
                                </Accordion>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end p-4 border-t border-gray-700 space-x-2">
                    <Button onClick={onClose} variant="secondary">İptal</Button>
                    <Button onClick={handleSave}>Seçilenleri Ekle ({selectedQuestions.size})</Button>
                </div>
            </div>
        </div>
    );
};

export default QuestionBankModal;
