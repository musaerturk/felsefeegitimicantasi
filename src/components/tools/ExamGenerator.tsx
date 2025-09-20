import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Grade, Tool, StoredFile, Question, QuestionType, questionTypes } from '../../types.ts';
import { generateExam } from '../../services/geminiService.ts';
import Button from '../ui/Button.tsx';
import ToolViewWrapper from './ToolViewWrapper.tsx';
import { useDatabase } from '../../hooks/useDatabase.ts';
import { useUnitDatabase } from '../../hooks/useUnitDatabase.ts';
import QuestionBankModal from '../ui/QuestionBankModal.tsx';
import { DocumentPlusIcon, PrinterIcon, DownloadIcon } from '../ui/Icons.tsx';
import Card from '../ui/Card.tsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Loader from '../ui/Loader.tsx';

interface Props {
  grade: Grade;
  onBack: () => void;
}

// Component for on-screen display (dark theme)
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

// Component for PDF/Print rendering (light theme)
const PdfExamContent: React.FC<{ questions: Question[]; title: string; }> = ({ questions, title }) => (
    <div className="p-8 bg-white text-black font-sans text-sm" style={{ width: '210mm' }}>
        <h3 className="text-xl font-bold text-center mb-2" style={{ color: '#000000' }}>{title}</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Felsefe Dersi Sınavı</p>
        <div className="space-y-4">
            {questions.map((q, index) => (
                <div key={index} className="flex py-2 border-b border-gray-300 last:border-b-0" style={{ pageBreakInside: 'avoid' }}>
                    <div className="font-bold pr-2">{index + 1}.</div>
                    <div className="flex-grow">
                        <p style={{color: '#000000'}}>{q.question}</p>
                        <div className="text-sm p-2 rounded mt-2" style={{ color: '#155724', backgroundColor: '#d4edda', border: '1px solid #c3e6cb' }}>
                            <strong>Cevap:</strong> {q.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const ExamGenerator: React.FC<Props> = ({ grade, onBack }) => {
    const { units } = useUnitDatabase({ grade });
    const { files } = useDatabase({ grade });
    const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
    const [questionCount, setQuestionCount] = useState(5);
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.KLASIK);
    const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBankOpen, setIsBankOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const pdfContentRef = useRef<HTMLDivElement>(null);


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
    
    const generatePdfOrPrint = async (action: 'save' | 'print') => {
        if (!pdfContentRef.current || isProcessing) return;
        setIsProcessing(true);
        try {
            const canvas = await html2canvas(pdfContentRef.current, { scale: 2 });
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const margin = 40;
            const contentWidth = pdfWidth - margin * 2;
            const contentHeight = (canvas.height * contentWidth) / canvas.width;
            
            let heightLeft = contentHeight;
            let position = 0;
            pdf.addImage(canvas, 'PNG', margin, margin, contentWidth, contentHeight);
            heightLeft -= (pdf.internal.pageSize.getHeight() - 2 * margin);

            while (heightLeft > 0) {
                position -= (pdf.internal.pageSize.getHeight() - 2 * margin);
                pdf.addPage();
                pdf.addImage(canvas, 'PNG', margin, position + margin, contentWidth, contentHeight);
                heightLeft -= (pdf.internal.pageSize.getHeight() - 2 * margin);
            }

            if (action === 'save') {
                pdf.save(`${(units[selectedUnitIndex]?.unitName || 'Sinav').replace(/ /g, '_')}_sinav.pdf`);
            } else {
                pdf.autoPrint();
                window.open(pdf.output('bloburl'), '_blank');
            }
        } catch (error) {
            console.error("PDF/Print generation failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const renderResultComponent = (resultString: string) => {
        const examTitle = units[selectedUnitIndex]?.unitName || 'Felsefe Sınavı';
        return (
            <div>
                 <div className="flex justify-between items-center mb-4">
                    <div>
                         <Button onClick={() => setGeneratedQuestions([])} variant="secondary" className="!text-xs !py-1 !px-2 bg-rose-800/50 hover:bg-rose-700/50">Listeyi Temizle</Button>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={() => generatePdfOrPrint('save')} variant="secondary" disabled={isProcessing || generatedQuestions.length === 0}>
                            {isProcessing ? <Loader size="sm" /> : <DownloadIcon className="h-4 w-4 mr-2"/>} PDF İndir
                        </Button>
                        <Button onClick={() => generatePdfOrPrint('print')} variant="secondary" disabled={isProcessing || generatedQuestions.length === 0}>
                            {isProcessing ? <Loader size="sm" /> : <PrinterIcon className="h-4 w-4 mr-2"/>} Yazdır
                        </Button>
                    </div>
                </div>
                 
                 {/* This is the displayed version for the user */}
                 <PrintableExam questions={generatedQuestions} title={examTitle} />

                 {/* This is the hidden version for PDF/print */}
                 <div className="absolute top-0 -left-full -z-10">
                    <div ref={pdfContentRef}>
                         <PdfExamContent questions={generatedQuestions} title={examTitle} />
                    </div>
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