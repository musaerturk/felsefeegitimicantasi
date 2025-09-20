import React, { useState, useCallback, useRef } from 'react';
import { Grade, Tool, StoredFile, Question, QuestionType, questionTypes } from '../../types';
import { extractQuestionsFromPdf } from '../../services/geminiService';
import Button from '../ui/Button';
import ToolViewWrapper from './ToolViewWrapper';
import { useQuestionBank } from '../../hooks/useQuestionBank';
import Accordion from '../ui/Accordion';
import Card from '../ui/Card';
import { useUnitDatabase } from '../../hooks/useUnitDatabase';

interface Props {
  grade: Grade;
  onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const QuestionBank: React.FC<Props> = ({ grade, onBack }) => {
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.KLASIK);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { questions, addQuestions, deleteQuestion } = useQuestionBank({ grade });
  const { units } = useUnitDatabase({ grade });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleExtract = useCallback(async () => {
    if (!selectedFile || selectedUnit < 0 || !selectedType) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const base64Content = await fileToBase64(selectedFile);
      const file: StoredFile = {
        name: selectedFile.name,
        content: base64Content,
        mimeType: selectedFile.type,
      };

      const extracted = await extractQuestionsFromPdf(file);

      if (extracted && extracted.length > 0) {
        addQuestions(selectedUnit + 1, selectedType, extracted);
        setSelectedFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
      } else if (extracted) {
        setError('PDF içerisinde soru ve cevap bulunamadı.');
      }
      else {
        setError('Sorular PDF\'ten ayıklanamadı. Lütfen dosya formatını kontrol edin.');
      }
    } catch (err) {
      console.error(err);
      setError('Dosya işlenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile, selectedUnit, selectedType, addQuestions]);

  const toggleAnswer = (unit: number, type: QuestionType, index: number) => {
      const key = `${unit}-${type}-${index}`;
      setVisibleAnswers(prev => ({...prev, [key]: !prev[key]}));
  }

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const unitsWithQuestions = Object.keys(questions).map(Number).sort((a, b) => a - b);

  return (
    <ToolViewWrapper toolName={Tool.QUESTION_BANK} onBack={onBack} isLoading={false} result="">
        <Card>
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">PDF'ten Soru Ayıkla</h3>
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="unit-select" className="block text-sm font-medium text-gray-300 mb-1">Soruların Kaydedileceği Ünite</label>
                        <select
                            id="unit-select"
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(Number(e.target.value))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {units.map((unit, i) => <option key={i} value={i}>{unit.unitName || `Ünite ${i + 1}`}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="type-select" className="block text-sm font-medium text-gray-300 mb-1">Soru Tipi</label>
                         <select
                            id="type-select"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as QuestionType)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {questionTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-1">Soru-Cevap içeren PDF Dosyası</label>
                    <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-200 hover:file:bg-gray-600"
                    />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <div className="text-right">
                <Button onClick={handleExtract} isLoading={isLoading} disabled={!selectedFile || selectedUnit < 0 || !selectedType}>
                    Yükle ve Ayıkla
                </Button>
                </div>
            </div>
        </Card>
        
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Kaydedilmiş Sorular</h3>
            {unitsWithQuestions.length === 0 ? (
                <p className="text-gray-400">Henüz soru eklenmemiş. Başlamak için yukarıdan bir PDF yükleyin.</p>
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
                                    <div className="space-y-4">
                                        {currentQuestions.map((q, index) => (
                                            <div key={index} className="p-3 bg-gray-800/50 rounded-md border border-gray-700/50">
                                                <p className="font-semibold text-gray-200 mb-2">{index + 1}. {q.question}</p>
                                                <div className="mt-2">
                                                    {visibleAnswers[`${unitNum}-${type}-${index}`] ? (
                                                        <div className="text-sm text-green-300 bg-black/20 p-2 rounded">
                                                        <p><strong>Cevap:</strong> {q.answer}</p>
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="flex justify-end items-center space-x-2 mt-2">
                                                    <Button onClick={() => toggleAnswer(unitNum, questionType, index)} variant="secondary" className="!py-1 !px-2 text-xs">
                                                        {visibleAnswers[`${unitNum}-${type}-${index}`] ? 'Cevabı Gizle' : 'Cevabı Göster'}
                                                    </Button>
                                                    <Button onClick={() => deleteQuestion(unitNum, questionType, index)} variant="secondary" className="!py-1 !px-2 text-xs bg-rose-800/50 hover:bg-rose-700/50">
                                                        Sil
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                                )
                            })}
                        </Accordion>
                    ))}
                </div>
            )}
        </div>
    </ToolViewWrapper>
  );
};

export default QuestionBank;