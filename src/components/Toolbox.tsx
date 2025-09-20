

import React from 'react';
import { Grade, Tool } from '../types';
import Card from './ui/Card';
import {
  CalendarIcon,
  BookIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  DatabaseIcon,
  ArchiveBoxIcon,
  CheckBadgeIcon,
  UsersIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon
} from './ui/Icons';

interface ToolboxProps {
  onSelectTool: (tool: Tool) => void;
  grade: Grade;
}

const tools10 = [
  { tool: Tool.SINIFLARIM, title: 'Sınıflarım', description: 'Sınıflarınızı ve öğrenci listelerinizi yönetin.', icon: UsersIcon },
  { tool: Tool.LESSON_PLAN, title: 'Ders Planlayıcı', description: 'Yapay zeka destekli ders planları oluşturun.', icon: BookIcon },
  { tool: Tool.ETKINLIK_HAVUZU, title: 'Etkinlik Havuzu', description: 'Dersleriniz için hazır etkinlikleri keşfedin.', icon: SparklesIcon },
  { tool: Tool.QUESTION_BANK, title: 'Soru Bankası', description: 'Kendi soru bankanızı oluşturun ve yönetin.', icon: LightBulbIcon },
  { tool: Tool.EXAM_GENERATOR, title: 'Sınav Oluşturucu', description: 'Belirlediğiniz kazanımlara göre sınavlar hazırlayın.', icon: DocumentTextIcon },
  { tool: Tool.EXAM_ANALYSIS, title: 'Sınav Analizi', description: 'Sınav sonuçlarını analiz edin ve raporlar oluşturun.', icon: ChartBarIcon },
  { tool: Tool.DEGERLENDIRME_OLCEKLERI, title: 'Değerlendirme Ölçekleri', description: 'Etkinlik kontrol formları ve ders içi performans ölçeklerini kullanın.', icon: CheckBadgeIcon },
  { tool: Tool.AJANDA, title: 'Ajanda', description: 'Yıllık planınızı haftalık olarak görüntüleyin ve düzenleyin.', icon: CalendarIcon },
];

const tools11 = [
    { tool: Tool.SINIFLARIM, title: 'Sınıflarım', description: 'Sınıflarınızı ve öğrenci listelerinizi yönetin.', icon: UsersIcon },
    { tool: Tool.LESSON_PLAN, title: 'Ders Planlayıcı', description: 'Yapay zeka destekli ders planları oluşturun.', icon: BookIcon },
    { tool: Tool.EXAM_GENERATOR, title: 'Sınav Oluşturucu', description: 'Belirlediğiniz kazanımlara göre sınavlar hazırlayın.', icon: DocumentTextIcon },
    { tool: Tool.EXAM_ANALYSIS, title: 'Sınav Analizi', description: 'Sınav sonuçlarını analiz edin ve raporlar oluşturun.', icon: ChartBarIcon },
    { tool: Tool.QUESTION_BANK, title: 'Soru Bankası', description: 'Kendi soru bankanızı oluşturun ve yönetin.', icon: LightBulbIcon },
    { tool: Tool.ETKINLIK_HAVUZU, title: 'Etkinlik Havuzu', description: 'Yapay zeka ile ünite ve kazanımlara özel etkinlikler oluşturun.', icon: SparklesIcon },
    { tool: Tool.CHECKLISTS, title: 'Değerlendirme Formları', description: 'Etkinlikler ve performans için değerlendirme formları kullanın.', icon: CheckBadgeIcon },
    { tool: Tool.AJANDA, title: 'Ajanda', description: 'Yıllık planınızı haftalık olarak görüntüleyin ve düzenleyin.', icon: CalendarIcon },
];

const Toolbox: React.FC<ToolboxProps> = ({ onSelectTool, grade }) => {
  const toolList = grade === Grade.TENTH ? tools10 : tools11;
  const gridClasses = "grid grid-cols-2 gap-6";
  
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        <span className="text-gray-400">{grade}. Sınıf</span> Eğitim Çantası
      </h2>
      <div className={gridClasses}>
        {toolList.map(({ tool, title, description, icon: Icon }) => (
          <Card
            key={tool}
            onClick={() => onSelectTool(tool)}
            className="cursor-pointer group flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white flex-grow pr-2">{title}</h3>
                <Icon className="h-7 w-7 text-indigo-400 flex-shrink-0" />
            </div>
            <p className="text-sm text-gray-400 flex-grow">{description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;