import React, { useState, useEffect } from 'react';
import Button from './Button.tsx';
import { AgendaWeek } from '../../data/agendaData.ts';

interface WeekEditModalProps {
  weekData: AgendaWeek;
  onClose: () => void;
  onSave: (updatedWeek: AgendaWeek) => void;
}

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);


const WeekEditModal: React.FC<WeekEditModalProps> = ({ weekData, onClose, onSave }) => {
  const [formData, setFormData] = useState<AgendaWeek>(weekData);

  useEffect(() => {
    setFormData(weekData);
  }, [weekData]);

  const handleChange = (field: keyof AgendaWeek, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-indigo-400">{formData.week}. Haftayı Düzenle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            <FormField label="Konu">
                 <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => handleChange('topic', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                />
            </FormField>
             <FormField label="Öğrenme Çıktıları">
                <textarea
                    rows={3}
                    value={formData.outcomes}
                    onChange={(e) => handleChange('outcomes', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                />
            </FormField>
            <FormField label="Öğrenme-Öğretme Yaşantıları (Etkinlikler)">
                <textarea
                    rows={5}
                    value={formData.activities}
                    onChange={(e) => handleChange('activities', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                />
            </FormField>
            <FormField label="Notlar / Değerlendirme">
                <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2"
                />
            </FormField>
        </div>
        <div className="flex justify-end p-4 border-t border-gray-700 space-x-2">
          <Button onClick={onClose} variant="secondary">İptal</Button>
          <Button onClick={handleSave}>Kaydet</Button>
        </div>
      </div>
    </div>
  );
};

export default WeekEditModal;