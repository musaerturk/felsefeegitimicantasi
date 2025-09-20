import React, { useState } from 'react';
import { Activity } from '../../types';
import Button from './Button';

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={className}>
        <h4 className="font-bold text-indigo-300 mb-2 border-b border-gray-700 pb-1">{title}</h4>
        {children}
    </div>
);

const InfoNoteModal: React.FC<{ title: string; content: string; onClose: () => void }> = ({ title, content, onClose }) => (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]"
        onClick={onClose}
    >
        <div 
            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col border border-gray-700"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-indigo-400">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                {content}
            </div>
            <div className="p-4 border-t border-gray-700 text-right">
                <Button onClick={onClose}>Kapat</Button>
            </div>
        </div>
    </div>
);


const ActivityModal: React.FC<ActivityModalProps> = ({ activity, onClose }) => {
  const [infoNoteContent, setInfoNoteContent] = useState<{ title: string, content: string } | null>(null);

  const parseStep = (step: string) => {
    const tagRegex = /(<(?:BİLGİ_NOTU|ÇALIŞMA_KAĞIDI)>.*?<\/(?:BİLGİ_NOTU|ÇALIŞMA_KAĞIDI)>)/s;
    const parts = step.split(tagRegex);

    return (
      <span>
        {parts.map((part, index) => {
          if (!part) return null;

          const infoNoteMatch = part.match(/<BİLGİ_NOTU>(.*?)<\/BİLGİ_NOTU>/s);
          if (infoNoteMatch) {
            const noteText = infoNoteMatch[1].trim();
            return (
              <React.Fragment key={index}>
                <br />
                <Button 
                    variant="secondary" 
                    onClick={() => setInfoNoteContent({title: "Bilgi Notu", content: noteText})}
                    className="!py-1 !px-2 text-xs mt-2"
                >
                    Bilgi Notu'nu Görüntüle
                </Button>
              </React.Fragment>
            );
          }
          
          const worksheetMatch = part.match(/<ÇALIŞMA_KAĞIDI>(.*?)<\/ÇALIŞMA_KAĞIDI>/s);
          if (worksheetMatch) {
            const worksheetText = worksheetMatch[1].trim();
            return (
              <React.Fragment key={index}>
                <br />
                <Button 
                    variant="secondary" 
                    onClick={() => setInfoNoteContent({title: "Çalışma Kâğıdı", content: worksheetText})}
                    className="!py-1 !px-2 text-xs mt-2"
                >
                    Çalışma Kâğıdı'nı Görüntüle
                </Button>
              </React.Fragment>
            );
          }

          return part;
        })}
      </span>
    );
  };
  
  return (
    <>
    {infoNoteContent && <InfoNoteModal title={infoNoteContent.title} content={infoNoteContent.content} onClose={() => setInfoNoteContent(null)} />}
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-fuchsia-400">{activity.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-gray-300">
            <div className="flex justify-between text-sm text-gray-400">
                <span><strong>Kategori:</strong> {activity.category}</span>
                <span><strong>Süre:</strong> {activity.duration}</span>
            </div>
            
            <p className="text-base">{activity.description}</p>
            
            <Section title="Öğrenme Çıktıları">
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    {activity.learningOutcomes.map((outcome, i) => <li key={i}>{outcome}</li>)}
                </ul>
            </Section>

            {activity.materials && (
                <Section title="Gerekli Materyaller">
                     <ul className="list-disc pl-5 space-y-1 text-sm">
                        {activity.materials.map((material, i) => <li key={i}>{material}</li>)}
                    </ul>
                </Section>
            )}

            <Section title="Uygulama Adımları">
                <ol className="list-decimal pl-5 space-y-3 text-sm whitespace-pre-wrap leading-relaxed">
                    {activity.steps.map((step, i) => <li key={i}>{parseStep(step)}</li>)}
                </ol>
            </Section>
            
            {activity.note && (
                 <Section title="Öğretmen Notu">
                    <p className="text-sm italic text-gray-400">{activity.note}</p>
                </Section>
            )}
            
             {activity.evaluation && (
                 <Section title="Değerlendirme">
                    <p className="text-sm">{activity.evaluation}</p>
                </Section>
            )}

        </div>
        <div className="p-4 border-t border-gray-700 text-right">
            <button
                onClick={onClose}
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Kapat
            </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ActivityModal;
