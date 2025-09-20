import { useState, useMemo } from 'react';
import { activityPoolData } from '../data/activityPoolData.ts';
import { Activity, ActivityCategory } from '../types.ts';

export const useActivityPool = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');

    const filteredActivities = useMemo(() => {
        return activityPoolData.filter((activity: Activity) => {
            const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
            const matchesSearch = searchTerm === '' ||
                activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, selectedCategory]);

    const categories: ActivityCategory[] = useMemo(() => {
        return [...new Set(activityPoolData.map((a: Activity) => a.category))] as ActivityCategory[];
    }, []);

    return {
        activities: filteredActivities,
        categories,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
    };
};

