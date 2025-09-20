import React, { useRef, useState } from 'react';
import Button from './Button';
import { DownloadIcon, PrinterIcon } from './Icons';
import Loader from './Loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PlanOutputProps {
    content: string;
    onContentChange: (newContent: string) => void;
    title: string;
}

const PlanOutput: React.FC<PlanOutputProps> = ({ content, onContentChange, title }) => {
    const pdfContentRef = useRef<HTMLDivElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const formatContentToHtml = (text: string) => {
        const lines = text.split('\n');
        const elements = [];
        let listItems = [];

        const flushList = () => {
            if (listItems.length > 0) {
                elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 mb-2">{listItems}</ul>);
                listItems = [];
            }
        };

        const parseInlineBold = (line: string, key: string) => {
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <span key={key}>
                    {parts.map((part, index) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={index}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </span>
            );
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                flushList();
                const level = (line.match(/^\s*/)?.[0]?.length || 0) / 2;
                elements.push(<h3 key={i} className={`font-bold mt-4 mb-2 ${level === 0 ? 'text-xl text-indigo-600' : 'text-lg text-indigo-700'}`}>{trimmedLine.slice(2, -2)}</h3>);
            } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
                listItems.push(<li key={i}>{parseInlineBold(trimmedLine.slice(2), `li-span-${i}`)}</li>);
            } else if (trimmedLine.startsWith('###')) {
                flushList();
                elements.push(<h4 key={i} className="text-md font-semibold text-gray-700 mt-3 mb-1">{trimmedLine.slice(3).trim()}</h4>);
            }
             else if (trimmedLine.match(/^----*$/)) {
                 flushList();
                 elements.push(<hr key={`hr-${i}`} className="my-4 border-gray-300" />);
            }
            else {
                flushList();
                 if (trimmedLine !== '') {
                    elements.push(<p key={i} className="mb-2">{parseInlineBold(trimmedLine, `p-span-${i}`)}</p>);
                 } else if (elements.length > 0 && lines[i-1]?.trim() !== '') {
                     elements.push(<br key={`br-${i}`} />);
                 }
            }
        }
        flushList();
        return elements;
    };


    const generatePdf = async (action: 'save' | 'print') => {
        const contentElement = pdfContentRef.current;
        if (!contentElement) return;
        setIsProcessing(true);

        try {
            const canvas = await html2canvas(contentElement, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true, 
            });
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });
            
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

            if (action === 'save') {
                pdf.save(`${title.replace(/ /g, '_')}_ders_plani.pdf`);
            } else if (action === 'print') {
                pdf.autoPrint();
                window.open(pdf.output('bloburl'), '_blank');
            }

        } catch (error) {
            console.error("PDF oluşturulurken hata oluştu:", error);
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-semibold text-indigo-400">Oluşturulan Ders Planı</h3>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => generatePdf('save')} variant="secondary" disabled={isProcessing}>
                        {isProcessing ? <Loader size="sm"/> : <DownloadIcon className="h-5 w-5 mr-2" />}
                        PDF İndir
                    </Button>
                    <Button onClick={() => generatePdf('print')} variant="secondary" disabled={isProcessing}>
                        {isProcessing ? <Loader size="sm"/> : <PrinterIcon className="h-5 w-5 mr-2" />}
                        Yazdır
                    </Button>
                </div>
            </div>

            {/* Hidden div for rendering PDF/print content, positioned off-screen */}
            <div className="absolute top-0 -left-full">
                <div ref={pdfContentRef} className="bg-white p-8 text-gray-900 font-sans text-sm leading-relaxed" style={{ width: '210mm', color: '#111827' }}>
                     <div className="prose prose-sm max-w-none">
                         {formatContentToHtml(content)}
                     </div>
                </div>
            </div>
            
            {/* Editable textarea for the user */}
            <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-[60vh] bg-gray-900/50 p-4 rounded-md border border-gray-700/50 text-gray-200 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                aria-label="Düzenlenebilir Ders Planı"
                placeholder="Ders planı burada görünecek..."
            />
        </div>
    );
};

export default PlanOutput;