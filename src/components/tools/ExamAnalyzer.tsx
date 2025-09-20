import React, { useState, useEffect, useRef } from 'react';
import { Tool, Classroom, ExamQuestion } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useClassroomManager } from '../../hooks/useClassroomManager';
import { useExamAnalysisData } from '../../hooks/useExamAnalysisData';
import { AcademicCapIcon, DownloadIcon, PrinterIcon } from '../ui/Icons';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(...registerables);

interface Props {
  onBack: () => void;
}

const ExamAnalyzer: React.FC<Props> = ({ onBack }) => {
    const { classrooms } = useClassroomManager();
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
    const [step, setStep] = useState(1); // 1: Select Class, 2: Define Exam, 3: Enter Scores, 4: View Report
    const { analysisData, updateExamTitle, updateQuestions, updateStudentScore, resetAnalysis } = useExamAnalysisData(selectedClass);
    const [isProcessing, setIsProcessing] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    
    const chartsRef = useRef<Record<string, any>>({});

    const handleSelectClass = (classId: string) => {
        const classroom = classrooms.find(c => c.id === classId);
        setSelectedClass(classroom || null);
    };
    
    const handleNextStep = () => setStep(prev => prev + 1);
    const handlePrevStep = () => setStep(prev => prev - 1);
    
    const handleAddQuestion = () => {
        if (!analysisData) return;
        const newQuestion: ExamQuestion = { id: crypto.randomUUID(), text: `Soru ${analysisData.questions.length + 1}`, maxScore: 10 };
        updateQuestions([...analysisData.questions, newQuestion]);
    };

    const handleUpdateQuestion = (index: number, field: 'text' | 'maxScore', value: string | number) => {
        if (!analysisData) return;
        const newQuestions = [...analysisData.questions];
        const question = newQuestions[index];
        if (field === 'maxScore') {
             const score = parseInt(value as string, 10);
             if(!isNaN(score) && score >= 0) question.maxScore = score;
        } else {
             question.text = value as string;
        }
        updateQuestions(newQuestions);
    };

    const handleDeleteQuestion = (index: number) => {
        if (!analysisData) return;
        updateQuestions(analysisData.questions.filter((_, i) => i !== index));
    };
    
    const renderClassSelection = () => (
        <Card>
            <div className="text-center p-8">
                <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
                <h3 className="text-2xl font-bold mb-2">Adım 1: Sınıf Seçin</h3>
                <p className="text-gray-400 mb-6">Analiz yapmak istediğiniz sınıfı seçin.</p>
                {classrooms.length > 0 ? (
                    <div className="max-w-xs mx-auto">
                        <select
                            onChange={(e) => handleSelectClass(e.target.value)}
                            value={selectedClass?.id || ""}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="" disabled>-- Sınıf Seç --</option>
                            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                         <Button onClick={handleNextStep} disabled={!selectedClass} className="mt-6">İleri</Button>
                    </div>
                ) : (
                    <p className="text-amber-400">Önce "Sınıflarım" aracını kullanarak bir sınıf oluşturmalısınız.</p>
                )}
            </div>
        </Card>
    );
    
    const renderExamDefinition = () => (
        <Card>
            <h3 className="text-xl font-semibold mb-4 text-indigo-400">Adım 2: Sınav Yapısını Tanımla</h3>
            <div className="space-y-4">
                <input
                    type="text"
                    value={analysisData?.examTitle || ''}
                    onChange={(e) => updateExamTitle(e.target.value)}
                    placeholder="Sınav Başlığı"
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                />
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {analysisData?.questions.map((q, i) => (
                        <div key={q.id} className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded">
                            <input type="text" value={q.text} onChange={e => handleUpdateQuestion(i, 'text', e.target.value)} className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm"/>
                            <input type="number" value={q.maxScore} onChange={e => handleUpdateQuestion(i, 'maxScore', e.target.value)} className="w-20 bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-sm text-center"/>
                            <button onClick={() => handleDeleteQuestion(i)} className="text-rose-400 hover:text-rose-300 font-bold">&times;</button>
                        </div>
                    ))}
                </div>
                 <Button onClick={handleAddQuestion} variant="secondary">Soru Ekle</Button>
                 <div className="flex justify-between mt-4">
                     <Button onClick={handlePrevStep} variant="secondary">Geri</Button>
                     <Button onClick={handleNextStep} disabled={!analysisData || analysisData.questions.length === 0}>İleri</Button>
                 </div>
            </div>
        </Card>
    );

    const renderScoreEntry = () => {
         if(!analysisData || !selectedClass) return null;
         return (
             <Card>
                <h3 className="text-xl font-semibold mb-4 text-indigo-400">Adım 3: Puanları Gir</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-600">
                                <th className="p-2 sticky left-0 bg-gray-800">Öğrenci</th>
                                {analysisData.questions.map(q => <th key={q.id} className="p-2 text-center" title={q.text}>{q.text} ({q.maxScore}p)</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedClass.students.map(student => {
                                const studentScores = analysisData.scores.find(s => s.studentId === student.id);
                                return (
                                    <tr key={student.id} className="border-b border-gray-700/50">
                                        <td className="p-2 font-medium sticky left-0 bg-gray-800">{student.name}</td>
                                        {analysisData.questions.map(q => (
                                            <td key={q.id} className="p-1">
                                                <input
                                                    type="number"
                                                    max={q.maxScore}
                                                    min={0}
                                                    value={studentScores?.scores[q.id] ?? ''}
                                                    onChange={e => updateStudentScore(student.id, q.id, e.target.value === '' ? null : Math.min(q.maxScore, parseInt(e.target.value, 10)))}
                                                    className="w-full bg-gray-700 border border-gray-600 rounded text-center py-1"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 <div className="flex justify-between mt-4">
                     <Button onClick={handlePrevStep} variant="secondary">Geri</Button>
                     <Button onClick={handleNextStep}>Raporu Görüntüle</Button>
                 </div>
             </Card>
         )
    };

    const renderReport = () => {
        if (!analysisData || !selectedClass) return null;
        
        const studentResults = selectedClass.students.map(student => {
            const scoresData = analysisData.scores.find(s => s.studentId === student.id);
            const totalScore = analysisData.questions.reduce((sum, q) => sum + (scoresData?.scores[q.id] ?? 0), 0);
            return {
                id: student.id,
                name: student.name,
                totalScore,
                isSuccessful: totalScore >= 50,
            };
        });
        
        const successfulStudents = studentResults.filter(s => s.isSuccessful).length;
        const totalStudents = selectedClass.students.length;
        const classSuccessRate = totalStudents > 0 ? (successfulStudents / totalStudents) * 100 : 0;
        
        const questionSuccessRates = analysisData.questions.map(q => {
            const totalPointsForQuestion = analysisData.scores.reduce((sum, s) => sum + (s.scores[q.id] ?? 0), 0);
            const maxPossiblePoints = totalStudents * q.maxScore;
            const successRate = maxPossiblePoints > 0 ? (totalPointsForQuestion / maxPossiblePoints) * 100 : 0;
            return { label: q.text, rate: successRate };
        });
        
        const scoreRanges = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        const scoreDistribution = scoreRanges.slice(0, -1).map((start, i) => {
            const end = scoreRanges[i+1];
            const count = studentResults.filter(s => s.totalScore >= start && s.totalScore < end).length;
            return { label: `${start}-${end-1}`, count };
        });
        scoreDistribution[scoreDistribution.length - 1].label = "90-100";
        scoreDistribution[scoreDistribution.length - 1].count += studentResults.filter(s => s.totalScore === 100).length;


        useEffect(() => {
            Object.values(chartsRef.current).forEach(chart => chart.destroy());
            chartsRef.current = {};

            const createChart = (canvasId: string, type: 'bar' | 'pie' | 'doughnut', labels: string[], data: number[], label: string, backgroundColors?: string[]) => {
                const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
                if (!ctx) return;
                chartsRef.current[canvasId] = new Chart(ctx, {
                    type: type,
                    data: { labels, datasets: [{ label, data, backgroundColor: backgroundColors || '#4f46e5', borderColor: '#374151', borderWidth: 1 }] },
                    options: { responsive: true, plugins: { legend: { labels: { color: '#d1d5db' } } },
                        scales: type === 'bar' ? {
                            y: { beginAtZero: true, ticks: { color: '#9ca3af', precision: 0 }, grid: { color: '#4b5563' } },
                            x: { ticks: { color: '#9ca3af' }, grid: { color: '#4b5563' } } } : {}
                    }
                });
            };
            
            createChart('questionSuccessChart', 'bar', questionSuccessRates.map(q => q.label), questionSuccessRates.map(q => q.rate), 'Soru Başarı Oranı (%)');
            createChart('classSuccessChart', 'pie', ['Başarılı', 'Başarısız'], [successfulStudents, totalStudents - successfulStudents], 'Sınıf Başarı Durumu', ['#22c55e', '#ef4444']);
            createChart('scoreDistributionChart', 'bar', scoreDistribution.map(r => r.label), scoreDistribution.map(r => r.count), 'Puan Dağılımı (Öğrenci Sayısı)');

        }, [analysisData]);

        const generatePdfReport = async(action: 'save' | 'print') => {
             if (!reportRef.current) return;
             setIsProcessing(true);
             try {
                const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#111827'});
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const margin = 40;
                const contentWidth = pdfWidth - margin * 2;
                const contentHeight = (canvas.height * contentWidth) / canvas.width;
                let heightLeft = contentHeight;
                let position = 0;
                pdf.addImage(canvas, 'PNG', margin, margin, contentWidth, contentHeight);
                heightLeft -= (pdfHeight - 2 * margin);
                while (heightLeft > 0) {
                  position -= (pdfHeight - 2 * margin);
                  pdf.addPage();
                  pdf.addImage(canvas, 'PNG', margin, position + margin, contentWidth, contentHeight);
                  heightLeft -= (pdfHeight - 2 * margin);
                }
                if (action === 'save') pdf.save(`${analysisData.examTitle.replace(/ /g, '_')}_analiz.pdf`);
                else {
                    pdf.autoPrint();
                    window.open(pdf.output('bloburl'), '_blank');
                }
             } finally {
                setIsProcessing(false);
             }
        };

        return (
            <div>
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <Button onClick={handlePrevStep} variant="secondary">Geri</Button>
                        <div className="flex space-x-2">
                            <Button onClick={() => generatePdfReport('save')} variant="secondary" disabled={isProcessing}><DownloadIcon className="h-5 w-5 mr-2" /> PDF İndir</Button>
                            <Button onClick={() => generatePdfReport('print')} variant="secondary" disabled={isProcessing}><PrinterIcon className="h-5 w-5 mr-2" /> Yazdır</Button>
                        </div>
                    </div>
                 </Card>
                 <div ref={reportRef} className="p-4 bg-gray-900">
                    <Card>
                        <h3 className="text-2xl font-bold text-center mb-2 text-indigo-400">{analysisData.examTitle}</h3>
                        <p className="text-center text-gray-400 mb-6">Sınıf Başarı Oranı: <strong className="text-xl text-white">{classSuccessRate.toFixed(2)}%</strong></p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                             <div>
                                <h4 className="font-semibold mb-2 text-center">Soru Bazında Başarı Dağılımı (%)</h4>
                                <canvas id="questionSuccessChart"></canvas>
                            </div>
                            <div className="flex flex-col items-center">
                                <h4 className="font-semibold mb-2 text-center">Sınıf Başarı Durumu</h4>
                                <div className="max-w-[300px]"><canvas id="classSuccessChart"></canvas></div>
                            </div>
                        </div>
                         <div>
                            <h4 className="font-semibold mb-2 mt-4 text-center">Puan Dağılım Aralığı</h4>
                            <canvas id="scoreDistributionChart"></canvas>
                        </div>

                        <h4 className="font-semibold mb-2 mt-8">Öğrenci Sonuçları</h4>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b-2 border-gray-600">
                                    <th className="text-left p-2">Öğrenci</th>
                                    <th className="text-center p-2">Toplam Puan</th>
                                    <th className="text-center p-2">Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentResults.map(s => (
                                    <tr key={s.id} className="border-b border-gray-700">
                                        <td className="p-2">{s.name}</td>
                                        <td className="text-center p-2">{s.totalScore}</td>
                                        <td className={`text-center p-2 font-bold ${s.isSuccessful ? 'text-green-400' : 'text-rose-400'}`}>
                                            {s.isSuccessful ? 'Başarılı' : 'Başarısız'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                 </div>
            </div>
        )
    };

    const renderContent = () => {
        switch(step){
            case 1: return renderClassSelection();
            case 2: return renderExamDefinition();
            case 3: return renderScoreEntry();
            case 4: return renderReport();
            default: return renderClassSelection();
        }
    }

    return (
        <div className="w-full animate-fade-in">
            <div className="flex items-center mb-6">
                <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Button>
                <h2 className="text-3xl font-bold">{Tool.EXAM_ANALYSIS}</h2>
                 {selectedClass && <Button onClick={() => { if(window.confirm('Mevcut analizi sıfırlamak istediğinizden emin misiniz?')) { resetAnalysis(); setStep(2); } }} variant="secondary" className="ml-auto !text-xs !py-1 !px-2 bg-rose-800/50 hover:bg-rose-700/50">Analizi Sıfırla</Button>}
            </div>
            {renderContent()}
        </div>
    );
};

export default ExamAnalyzer;