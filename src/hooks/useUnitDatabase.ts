import { useState, useCallback, useEffect } from 'react';
import { Grade, UnitData, UnitTopic } from '../types.ts';

const STORAGE_KEY_PREFIX = 'philosophy_unit_database_';

const createEmptyUnit = (name: string, outcomes: string[] = []): UnitData => ({
    unitName: name,
    duration: '',
    fieldSkills: [],
    tendencies: [],
    socialEmotionalSkills: [],
    values: [],
    literacySkills: [],
    interdisciplinaryRelations: '',
    conceptualSkills: [],
    learningOutcomes: outcomes,
    contentFramework: '',
    keyConcepts: '',
    learningEvidence: '',
    basicAssumptions: '',
    preAssessment: '',
    bridging: '',
    teachingPractices: '',
    enrichment: '',
    support: '',
    topic: '',
    topics: [],
});

const initialTenthGradeUnits: UnitData[] = [
  {
    unitName: 'Ünite 1: Felsefeyi Tanıma',
    duration: '3 Hafta',
    fieldSkills: ['Felsefi Metin Analizi', 'Sokratik Sorgulama'],
    tendencies: ['Entelektüel Merak'],
    socialEmotionalSkills: ['Öz Farkındalık'],
    values: ['Bilgelik', 'Adalet'],
    literacySkills: ['Eleştirel Okuryazarlık'],
    interdisciplinaryRelations: 'Tarih, Edebiyat',
    conceptualSkills: ['Analitik Düşünme'],
    learningOutcomes: ['10.1.1. Felsefenin anlamını açıklar.', '10.1.2. Felsefi düşüncenin özelliklerini örneklendirir.'],
    contentFramework: 'Felsefenin ne olduğu, temel kavramları ve tarihsel gelişimi.',
    keyConcepts: 'Felsefe, Bilgelik, Düşünce, Sorgulama, Argüman',
    learningEvidence: 'Sınıf içi tartışmalar, kısa cevaplı sorular, argüman analizi ödevi.',
    basicAssumptions: 'Öğrenciler "düşünce" ve "sorgulama" kavramlarına aşinadır.',
    preAssessment: 'Felsefe nedir? sorusuna beyin fırtınası.',
    bridging: 'Günlük hayattan felsefi sorularla derse giriş (Örn: Adalet nedir?).',
    teachingPractices: '',
    enrichment: 'Platon\'un "Mağara Alegorisi" metninin okunup tartışılması.',
    support: 'Temel felsefi kavramlar sözlüğü sağlanması.',
    topic: 'Felsefenin tanımı, düşüncenin özellikleri ve temel kavramlar.',
    topics: [],
  },
  ...Array.from({ length: 8 }, (_, i) => createEmptyUnit(`Ünite ${i + 2}`))
];

const initialEleventhGradeUnits: UnitData[] = [
    {
        ...createEmptyUnit('1. Ünite: MÖ 6. yy - MS 2. yy Felsefesi'),
        duration: '10 ders saati',
        learningOutcomes: ['11.1.1.', '11.1.2.', '11.1.3.', '11.1.4.'],
        topics: [
            { name: 'FELSEFENİN ORTAYA ÇIKIŞI', outcome: '11.1.1.' },
            { name: 'MÖ 6. YÜZYIL-MS 2. YÜZYIL FELSEFESİNİN AYIRICI NİTELİKLERİ', outcome: '11.1.2.' },
            { name: 'MÖ 6. YÜZYIL-MS 2. YÜZYIL FİLOZOFLARININ FELSEFİ GÖRÜŞLERİNİN ANALİZİ', outcome: '11.1.3.' },
            { name: 'MÖ 6. YÜZYIL-MS 2. YÜZYIL FELSEFESİNİN DÜŞÜNCE VE ARGÜMANLARINI DEĞERLENDİRME', outcome: '11.1.4.' },
        ]
    },
    {
        ...createEmptyUnit('2. Ünite: MS 2. yy - MS 15. yy Felsefesi'),
        duration: '16 ders saati',
        learningOutcomes: ['11.2.1.', '11.2.2.', '11.2.3.', '11.2.4.'],
        topics: [
            { name: 'MS 2. YÜZYIL-MS 15. YÜZYIL FELSEFESİNİN ORTAYA ÇIKIŞI', outcome: '11.2.1.' },
            { name: 'MS 2. YÜZYIL-MS 15. YÜZYIL FELSEFESİNİN AYIRICI NİTELİKLERİ', outcome: '11.2.2.' },
            { name: 'MS 2. YÜZYIL-MS 15. YÜZYIL FİLOZOFLARININ FELSEFİ GÖRÜŞLERİNİN ANALİZİ', outcome: '11.2.3.' },
            { name: 'MS 2. YÜZYIL-MS 15. YÜZYIL FELSEFESİNİN DÜŞÜNCE VE ARGÜMANLARINI DEĞERLENDİRME', outcome: '11.2.4.' },
        ]
    },
    {
        ...createEmptyUnit('3. Ünite: 15. - 17. yy Felsefesi'),
        duration: '12 ders saati',
        learningOutcomes: ['11.3.1.', '11.3.2.', '11.3.3.', '11.3.4.'],
        topics: [
            { name: '15. YÜZYIL-17. YÜZYIL FELSEFESİNİN ORTAYA ÇIKIŞI', outcome: '11.3.1.' },
            { name: '15. YÜZYIL-17. YÜZYIL FELSEFESİNİN AYIRICI NİTELİKLERİ', outcome: '11.3.2.' },
            { name: '15. YÜZYIL-17. YÜZYIL FİLOZOFLARININ FELSEFİ GÖRÜŞLERİNİN ANALİZİ', outcome: '11.3.3.' },
            { name: '15. YÜZYIL-17. YÜZYIL FELSEFESİNİN DÜŞÜNCE VE ARGÜMANLARINI DEĞERLENDİRME', outcome: '11.3.4.' },
        ]
    },
    {
        ...createEmptyUnit('4. Ünite: 18. - 19. yy Felsefesi'),
        duration: '14 ders saati',
        learningOutcomes: ['11.4.1.', '11.4.2.', '11.4.3.', '11.4.4.'],
        topics: [
            { name: '18. YÜZYIL-19. YÜZYIL FELSEFESİNİN ORTAYA ÇIKIŞI', outcome: '11.4.1.' },
            { name: '18. YÜZYIL-19. YÜZYIL FELSEFESİNİN AYIRICI NİTELİKLERİ', outcome: '11.4.2.' },
            { name: '18. YÜZYIL-19. YÜZYIL FİLOZOFLARININ FELSEFİ GÖRÜŞLERİNİN ANALİZİ', outcome: '11.4.3.' },
            { name: '18. YÜZYIL-19. YÜZYIL FELSEFESİNİN DÜŞÜNCE VE ARGÜMANLARINI DEĞERLENDİRME', outcome: '11.4.4.' },
        ]
    },
    {
        ...createEmptyUnit('5. Ünite: 20. yy Felsefesi'),
        duration: '22 ders saati',
        learningOutcomes: ['11.5.1.', '11.5.2.', '11.5.3.', '11.5.4.', '11.5.5.'],
        topics: [
            { name: '20. YÜZYIL FELSEFESİNİN ORTAYA ÇIKIŞI', outcome: '11.5.1.' },
            { name: '20. YÜZYIL FELSEFESİNİN AYIRICI NİTELİKLERİ', outcome: '11.5.2.' },
            { name: '20. YÜZYIL FİLOZOFLARININ FELSEFİ GÖRÜŞLERİNİN ANALİZİ', outcome: '11.5.3.' },
            { name: '20. YÜZYIL FELSEFESİNİN DÜŞÜNCE VE ARGÜMANLARINI DEĞERLENDİRME', outcome: '11.5.4.' },
            { name: '20 VE 21. YÜZYIL FELSEFECİLERİ VE YAŞADIKLARI COĞRAFYA', outcome: '11.5.5.' },
        ]
    },
];

export const useUnitDatabase = ({ grade }: { grade: Grade }) => {
    const [units, setUnits] = useState<UnitData[]>([]);
    const storageKey = `${STORAGE_KEY_PREFIX}${grade}`;
    
    const getInitialData = useCallback(() => {
        return grade === Grade.TENTH ? initialTenthGradeUnits : initialEleventhGradeUnits;
    }, [grade]);

    useEffect(() => {
        try {
            const item = localStorage.getItem(storageKey);
            const initialData = getInitialData();
            if (item) {
                // Basic validation to prevent loading malformed data
                const parsed = JSON.parse(item);
                if (Array.isArray(parsed) && parsed.length === initialData.length) {
                    setUnits(parsed);
                } else {
                    setUnits(initialData);
                }
            } else {
                setUnits(initialData);
            }
        } catch (error) {
            console.error("Error loading unit database from localStorage", error);
            setUnits(getInitialData());
        }
    }, [storageKey, getInitialData]);

    const saveData = (newUnits: UnitData[]) => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(newUnits));
            setUnits(newUnits);
        } catch (error) {
            console.error("Error saving unit database to localStorage", error);
        }
    };

    const updateUnit = useCallback((unitIndex: number, updatedUnit: UnitData) => {
        setUnits(prevUnits => {
            const newUnits = [...prevUnits];
            if (newUnits[unitIndex]) {
                newUnits[unitIndex] = updatedUnit;
                saveData(newUnits);
                return newUnits;
            }
            return prevUnits;
        });
    }, []);

    return { units, updateUnit };
};