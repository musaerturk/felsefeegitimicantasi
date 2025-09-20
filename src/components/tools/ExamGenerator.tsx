import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Grade, Tool, StoredFile, Question, QuestionType, questionTypes } from '../../types';
import { generateExam } from '../../services/geminiService';
import Button from '../ui/Button';
import ToolViewWrapper from './ToolViewWrapper';
import { useDatabase } from '../../hooks/useDatabase';
import { useUnitDatabase } from '../../hooks/useUnitDatabase';
import QuestionBankModal from '../ui/QuestionBankModal';
import { DocumentPlusIcon, PrinterIcon } from '../ui/Icons';
import Card from '../ui/Card';

interface Props {
  grade: Grade;
  onBack: () => void;
}

const PrintableExam: React.FC<{ questions: Question[]; title: string; }> = ({ questions, title }) => {
    return (
        <div id="printable-exam" className="bg-gray-900/50 p-6 rounded-md">
            <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
            <p className="text-center text-sm text-gray-400 mb-6">Felsefe Dersi Sınavı</p>
            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={index} className="flex flex-col sm:flex-row py-2 border-b border-gray-700/50 last:border-b-0" style={{ pageBreakInside: 'avoid' }}>
                        <div className="font-bold pr-2 mb-1 sm:mb-0">{index + 1}.</div>
                        <div className="flex-grow">
                            <p className="text-gray-200">{q.question}</p>
                             <div className="text-sm text-green-300 bg-black/20 p-2 rounded mt-2">
                                <strong>Cevap:</strong> {q.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExamGenerator: React.FC<Props> = ({ grade, onBack }) => {
    const { units } = useUnitDatabase({ grade });
    const { files } = useDatabase({ grade });
    const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
    const [questionCount, setQuestionCount] = useState(5);
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.KLASIK);
    const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBankOpen, setIsBankOpen] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);


    const outcomesForSelectedUnit = useMemo(() => {
        if (units[selectedUnitIndex]?.learningOutcomes.length > 0) {
            return units[selectedUnitIndex].learningOutcomes;
        }
        return [`${units[selectedUnitIndex]?.unitName || `Ünite ${selectedUnitIndex + 1}`} genel kazanımları`];
    }, [units, selectedUnitIndex]);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        
        const dbFiles = Object.values(files).filter((file): file is StoredFile => file !== null);

        const result = await generateExam(grade, outcomesForSelectedUnit, questionCount, questionType, dbFiles);
        if (result) {
            setGeneratedQuestions(prev => [...prev, ...result]);
        }
        setIsLoading(false);
    }, [grade, outcomesForSelectedUnit, questionCount, questionType, files]);

    const handleAddFromBank = (questionsFromBank: Question[]) => {
        setGeneratedQuestions(prev => [...prev, ...questionsFromBank]);
        setIsBankOpen(false);
    };
    
    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
            <head>
                <title>Sınav Çıktısı</title>
                <style>
                    body { font-family: sans-serif; margin: 2rem; }
                    h3, p { text-align: center; }
                    .question-item { display: flex; padding-top: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb; page-break-inside: avoid; }
                    .question-num { font-weight: bold; padding-right: 0.5rem; }
                    .question-content { flex-grow: 1; }
                    .answer { font-size: 0.875rem; color: #166534; background-color: #f0fdf4; padding: 0.5rem; border-radius: 0.25rem; margin-top: 0.5rem; }
                </style>
            </head>
            <body>
                <h3>${units[selectedUnitIndex]?.unitName || 'Felsefe Sınavı'}</h3>
                <p>Felsefe Dersi Sınavı</p>
                <div style="margin-top: 2rem;">
                    ${generatedQuestions.map((q, index) => `
                        <div class="question-item">
                            <div class="question-num">${index + 1}.</div>
                            <div class="question-content">
                                <p style="text-align: left;">${q.question}</p>
                                <div class="answer"><strong>Cevap:</strong> ${q.answer}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };
    
    const renderResultComponent = (resultString: string) => {
        return (
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <div>
                         <Button onClick={() => setGeneratedQuestions([])} variant="secondary" className="!text-xs !py-1 !px-2 bg-rose-800/50 hover:bg-rose-700/50">Listeyi Temizle</Button>
                    </div>
                    <Button onClick={handlePrint} variant="secondary" disabled={generatedQuestions.length === 0}><PrinterIcon className="h-4 w-4 mr-2"/> Yazdır</Button>
                </div>
                 <div ref={printRef}>
                    <PrintableExam questions={generatedQuestions} title={units[selectedUnitIndex]?.unitName || 'Felsefe Sınavı'} />
                 </div>
            </div>
        );
    };

    return (
        <>
            {isBankOpen && <QuestionBankModal grade={grade} onClose={() => setIsBankOpen(false)} onSave={handleAddFromBank} />}
            <ToolViewWrapper 
                toolName={Tool.EXAM_GENERATOR} 
                onBack={onBack} 
                isLoading={isLoading} 
                result={generatedQuestions.length > 0 ? ' ' : ''}
                renderResult={renderResultComponent}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Ünite</label>
                            <select
                                value={selectedUnitIndex}
                                onChange={(e) => setSelectedUnitIndex(parseInt(e.target.value, 10))}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                            >
                                {units.map((unit, index) => (
                                    <option key={index} value={index}>{unit.unitName || `Ünite ${index + 1}`}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Soru Tipi</label>
                            <select value={questionType} onChange={e => setQuestionType(e.target.value as QuestionType)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2">
                                {questionTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Oluşturulacak Soru Sayısı</label>
                            <input type="number" value={questionCount} onChange={e => setQuestionCount(Math.max(1, parseInt(e.target.value, 10)))} min="1" max="20" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2" />
                        </div>
                    </div>
                     <div className="bg-gray-800/50 p-3 rounded-md">
                        <p className="text-xs font-semibold text-gray-400 mb-2">Sınav şu kazanımlara göre oluşturulacak:</p>
                        <ul className="text-xs text-gray-300 list-disc list-inside max-h-24 overflow-y-auto">
                            {outcomesForSelectedUnit.map(o => <li key={o}>{o}</li>)}
                        </ul>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <Button onClick={() => setIsBankOpen(true)} variant="secondary">
                            <DocumentPlusIcon className="h-5 w-5 mr-2" />
                            Soru Bankasından Ekle
                        </Button>
                        <Button onClick={handleGenerate} isLoading={isLoading}>
                            Yapay Zeka İle Oluştur
                        </Button>
                    </div>
                </div>
            </ToolViewWrapper>
        </>
    );
};

export default ExamGenerator;