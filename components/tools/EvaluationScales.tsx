import React, { useState } from 'react';
import { Tool } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EvaluationForms from './EvaluationForms';
import ChecklistManager from './ChecklistManager';
import { ClipboardDocumentCheckIcon, CheckBadgeIcon } from '../ui/Icons';

interface Props {
  onBack: () => void;
}

const EvaluationScales: React.FC<Props> = ({ onBack }) => {
  const [selectedScale, setSelectedScale] = useState<Tool | null>(null);

  if (selectedScale === Tool.EVALUATION_FORMS) {
    return <EvaluationForms onBack={() => setSelectedScale(null)} />;
  }

  if (selectedScale === Tool.CHECKLISTS) {
    return <ChecklistManager onBack={() => setSelectedScale(null)} />;
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center mb-6">
        <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </Button>
        <h2 className="text-3xl font-bold">{Tool.DEGERLENDIRME_OLCEKLERI}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          onClick={() => setSelectedScale(Tool.EVALUATION_FORMS)}
          className="cursor-pointer group flex flex-col items-center text-center p-8"
        >
          <CheckBadgeIcon className="h-12 w-12 mb-4 text-purple-400"/>
          <h3 className="text-xl font-semibold mb-2 text-white">{Tool.EVALUATION_FORMS}</h3>
          <p className="text-sm text-gray-400">Maarif Modeli etkinlikleri için yapılandırılmış değerlendirme formlarını kullanın.</p>
        </Card>
        <Card
          onClick={() => setSelectedScale(Tool.CHECKLISTS)}
          className="cursor-pointer group flex flex-col items-center text-center p-8"
        >
          <ClipboardDocumentCheckIcon className="h-12 w-12 mb-4 text-teal-400"/>
          <h3 className="text-xl font-semibold mb-2 text-white">{Tool.CHECKLISTS}</h3>
          <p className="text-sm text-gray-400">Öğrenci becerilerini ve ders içi performansını gözlemlemek için kontrol listeleri kullanın.</p>
        </Card>
      </div>
    </div>
  );
};

export default EvaluationScales;
