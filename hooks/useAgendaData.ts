import { useState, useCallback, useEffect } from 'react';
import { Grade } from '../types';
import { AgendaWeek, getInitialAgendaData } from '../data/agendaData';

const STORAGE_KEY_PREFIX = 'philosophy_agenda_data_';

export const useAgendaData = ({ grade }: { grade: Grade }) => {
  const [weeks, setWeeks] = useState<AgendaWeek[]>([]);
  const storageKey = `${STORAGE_KEY_PREFIX}${grade}`;

  useEffect(() => {
    try {
      const item = localStorage.getItem(storageKey);
      const initialData = getInitialAgendaData(grade);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length === initialData.length) {
            setWeeks(parsed);
        } else {
            setWeeks(initialData);
        }
      } else {
        setWeeks(initialData);
      }
    } catch (error) {
      console.error("Error loading agenda data from localStorage", error);
      setWeeks(getInitialAgendaData(grade));
    }
  }, [storageKey, grade]);

  const saveData = (newWeeks: AgendaWeek[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newWeeks));
      setWeeks(newWeeks);
    } catch (error) {
      console.error("Error saving agenda data to localStorage", error);
    }
  };

  const updateWeek = useCallback((weekIndex: number, updatedWeek: AgendaWeek) => {
    setWeeks(prevWeeks => {
      const newWeeks = [...prevWeeks];
      if (newWeeks[weekIndex]) {
        newWeeks[weekIndex] = updatedWeek;
        saveData(newWeeks);
        return newWeeks;
      }
      return prevWeeks;
    });
  }, [storageKey]);

  return { weeks, updateWeek };
};
