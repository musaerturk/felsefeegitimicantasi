import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Grade, Tool, CalendarNote } from '../../types.ts';
import { useAgendaData } from '../../hooks/useAgendaData.ts';
import Button from '../ui/Button.tsx';
import Card from '../ui/Card.tsx';

// --- Internal Hook for Daily Notes ---
const useCalendarNotes = ({ grade }: { grade: Grade }) => {
  const STORAGE_KEY_PREFIX = 'philosophy_calendar_notes_v2_';
  type CalendarData = Record<string, CalendarNote>; // Key is YYYY-MM-DD
  const storageKey = `${STORAGE_KEY_PREFIX}${grade}`;

  const [notes, setNotes] = useState<CalendarData>({});

  useEffect(() => {
    try {
      const item = localStorage.getItem(storageKey);
      if (item) setNotes(JSON.parse(item));
    } catch (error) {
      console.error("Error loading calendar notes from localStorage", error);
    }
  }, [storageKey]);

  const saveData = (data: CalendarData) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setNotes(data);
    } catch (error) {
      console.error("Error saving calendar notes to localStorage", error);
    }
  };

  const updateNote = useCallback((dateKey: string, text: string, reminder: boolean) => {
    setNotes(prev => {
      const newNotes = JSON.parse(JSON.stringify(prev));
      newNotes[dateKey] = { text, reminder };
      saveData(newNotes);
      return newNotes;
    });
  }, []);
  
  const getNote = useCallback((dateKey: string): CalendarNote => {
      return notes[dateKey] || { text: '', reminder: false };
  }, [notes]);

  return { getNote, updateNote };
};

// --- Helper Functions & Constants ---
const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// --- Main Component ---
interface Props {
  grade: Grade;
  onBack: () => void;
}

const Agenda: React.FC<Props> = ({ grade, onBack }) => {
    const { weeks: agendaContent } = useAgendaData({ grade });
    const { getNote, updateNote } = useCalendarNotes({ grade });
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

    const academicCalendar = useMemo(() => {
        const getStartOfDay = (d: Date) => {
            const date = new Date(d);
            date.setUTCHours(0, 0, 0, 0);
            return date;
        };

        const SCHOOL_YEAR_START_DATE = getStartOfDay(new Date('2025-09-08T00:00:00.000Z'));
        const SCHOOL_YEAR_END_DATE = getStartOfDay(new Date('2026-06-28T00:00:00.000Z'));
        
        const HOLIDAY_PERIODS = [
            { start: getStartOfDay(new Date('2025-11-10T00:00:00.000Z')), title: 'Ara Tatil' },     
            { start: getStartOfDay(new Date('2026-01-19T00:00:00.000Z')), title: 'Yarıyıl Tatili' }, 
            { start: getStartOfDay(new Date('2026-01-26T00:00:00.000Z')), title: 'Yarıyıl Tatili' }, 
            { start: getStartOfDay(new Date('2026-03-16T00:00:00.000Z')), title: 'Ara Tatil' },      
        ];
        
        const holidayStartTimes = new Set(HOLIDAY_PERIODS.map(p => p.start.getTime()));
        const holidayTitles = HOLIDAY_PERIODS.reduce((acc: Record<number, string>, p: {start: Date, title: string}) => {
            acc[p.start.getTime()] = p.title;
            return acc;
        }, {} as Record<number, string>);


        let calendar = [];
        let currentDate = new Date(SCHOOL_YEAR_START_DATE.getTime());
        let academicWeekCounter = 1;

        while (currentDate.getTime() <= SCHOOL_YEAR_END_DATE.getTime()) {
            const endOfWeek = new Date(currentDate.getTime());
            endOfWeek.setUTCDate(currentDate.getUTCDate() + 6);
            
            const currentWeekStartTime = currentDate.getTime();
            const isHolidayWeek = holidayStartTimes.has(currentWeekStartTime);
            const holidayTitle = isHolidayWeek ? holidayTitles[currentWeekStartTime] : '';

            calendar.push({
                startDate: new Date(currentDate.getTime()),
                endDate: new Date(endOfWeek.getTime()),
                academicWeek: isHolidayWeek ? null : academicWeekCounter,
                title: isHolidayWeek ? holidayTitle : `Eğitim Haftası: ${academicWeekCounter}. Hafta`
            });

            if (!isHolidayWeek) {
                academicWeekCounter++;
            }
            
            currentDate.setUTCDate(currentDate.getUTCDate() + 7);
        }
        return calendar;
    }, []);

    useEffect(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const todayIndex = academicCalendar.findIndex(week => today >= week.startDate && today <= week.endDate);
        setCurrentWeekIndex(todayIndex > -1 ? todayIndex : 0);
    }, [academicCalendar]);

    const currentWeekData = useMemo(() => academicCalendar[currentWeekIndex], [academicCalendar, currentWeekIndex]);
    const currentAgendaContent = useMemo(() => {
        if (currentWeekData?.academicWeek) {
            return agendaContent.find(w => w.week === currentWeekData.academicWeek);
        }
        return null;
    }, [agendaContent, currentWeekData]);

    const handleSetReminder = (dateKey: string, text: string, shouldRemind: boolean) => {
        if (shouldRemind && Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    updateNote(dateKey, text, true);
                    new Notification("Hatırlatıcı Ayarlandı!", {
                        body: `"${text.substring(0, 50)}..." için bildirim alacaksınız.`,
                        icon: '/assets/icon-192.png'
                    });
                } else {
                    alert("Bildirimlere izin vermediğiniz için hatırlatıcı ayarlanamadı.");
                    updateNote(dateKey, text, false);
                }
            });
        } else {
             updateNote(dateKey, text, shouldRemind);
        }
    };

    const goToPrevWeek = () => setCurrentWeekIndex(prev => Math.max(0, prev - 1));
    const goToNextWeek = () => setCurrentWeekIndex(prev => Math.min(academicCalendar.length - 1, prev + 1));
    
    if (!currentWeekData) {
        return <div className="text-center p-8">Ajanda verileri yükleniyor...</div>;
    }

    const formatDateRange = (start: Date, end: Date) => {
        const formatDate = (date: Date) => date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    return (
        <div className="w-full animate-fade-in">
            <div className="flex items-center mb-6">
                <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Button>
                <h2 className="text-2xl sm:text-3xl font-bold">{Tool.AJANDA}</h2>
            </div>

            <Card className="mb-6">
                <div className="flex justify-between items-center p-4">
                    <Button onClick={goToPrevWeek} disabled={currentWeekIndex === 0} aria-label="Önceki Hafta">
                        &larr; Önceki
                    </Button>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-indigo-400">{currentWeekData.title}</h3>
                        <p className="text-sm text-gray-400">{formatDateRange(currentWeekData.startDate, currentWeekData.endDate)}</p>
                    </div>
                    <Button onClick={goToNextWeek} disabled={currentWeekIndex === academicCalendar.length - 1} aria-label="Sonraki Hafta">
                        Sonraki &rarr;
                    </Button>
                </div>
                {currentAgendaContent && (
                    <div className="border-t border-gray-700 p-4 space-y-2 text-sm">
                        <p><strong className="font-semibold text-gray-200">Ünite:</strong> {currentAgendaContent.topic}</p>
                        <p><strong className="font-semibold text-gray-200">{grade === Grade.TENTH ? 'Öğrenme Çıktısı' : 'Kazanım'}:</strong> <span className="text-gray-300">{currentAgendaContent.outcomes}</span></p>
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {daysOfWeek.map((day, dayIndex) => {
                    const dayDate = new Date(currentWeekData.startDate);
                    dayDate.setDate(currentWeekData.startDate.getDate() + dayIndex);
                    const dateKey = formatDateKey(dayDate);
                    const note = getNote(dateKey);
                    const isHoliday = currentWeekData.academicWeek === null;

                    return (
                        <Card key={day} className={`flex flex-col min-h-[200px] ${dayIndex > 4 ? 'bg-gray-800/30 border-gray-700/30' : ''}`}>
                            <h4 className={`font-bold text-center border-b pb-2 mb-2 ${dayIndex > 4 ? 'border-gray-700/50' : 'border-gray-700'}`}>{day}</h4>
                            <textarea
                                placeholder={isHoliday ? currentWeekData.title : "Not ekle..."}
                                value={note.text}
                                onChange={(e) => updateNote(dateKey, e.target.value, note.reminder)}
                                disabled={isHoliday}
                                aria-label={`${day} için notlar`}
                                className="w-full flex-grow bg-transparent text-sm p-1 rounded focus:outline-none focus:bg-gray-700/50 resize-none disabled:text-amber-300 disabled:placeholder-amber-300"
                            />
                            {!isHoliday && (
                                <div className="mt-2 pt-2 border-t border-gray-700 flex items-center justify-end">
                                    <label className="flex items-center text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={note.reminder}
                                            onChange={(e) => handleSetReminder(dateKey, note.text, e.target.checked)}
                                            className="form-checkbox h-4 w-4 bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500 rounded"
                                        />
                                        <span className="ml-2">Alarm</span>
                                    </label>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Agenda;