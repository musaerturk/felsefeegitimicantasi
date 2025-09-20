

export enum Grade {
  TENTH = 10,
  ELEVENTH = 11,
}

export enum Tool {
  AJANDA = 'Ajanda',
  LESSON_PLAN = 'Ders Planlayıcı',
  EXAM_GENERATOR = 'Sınav Oluşturucu',
  QUESTION_BANK = 'Soru Bankası',
  EXAM_ANALYSIS = 'Sınav Analizi',
  UNIT_DATABASE = 'Ünite Veri Tabanı',
  DATABASE_MANAGEMENT = 'Referans Doküman Yönetimi',
  EVALUATION_FORMS = 'Etkinlik Kontrol Formu',
  SINIFLARIM = 'Sınıflarım',
  ETKINLIK_HAVUZU = 'Etkinlik Havuzu',
  CHECKLISTS = 'Ders İçi Performans Ölçeği',
  DEGERLENDIRME_OLCEKLERI = 'Değerlendirme Ölçekleri',
}

export interface StoredFile {
  name: string;
  content: string; // base64
  mimeType: string;
}

export interface UnitTopic {
    name: string;
    outcome: string; 
}

export interface UnitData {
    unitName: string;
    duration: string;
    fieldSkills: string[];
    tendencies: string[];
    socialEmotionalSkills: string[];
    values: string[];
    literacySkills: string[];
    interdisciplinaryRelations: string;
    conceptualSkills: string[];
    learningOutcomes: string[];
    contentFramework: string;
    keyConcepts: string;
    learningEvidence: string;
    basicAssumptions: string;
    preAssessment: string;
    bridging: string;
    teachingPractices: string;
    enrichment: string;
    support: string;
    topic?: string;
    topics?: UnitTopic[];
}

export interface Question {
    question: string;
    answer: string;
}

export enum QuestionType {
    KLASIK = 'Klasik',
    COKTAN_SECMELI = 'Çoktan Seçmeli',
    DOGRU_YANLIS = 'Doğru/Yanlış',
    BOSLUK_DOLDURMA = 'Boşluk Doldurma',
}
export const questionTypes = Object.values(QuestionType);
export type QuestionBankData = {
    [unit: number]: {
        [type in QuestionType]?: Question[];
    };
};

export enum DatabaseKey {
  // Kavramsal Beceriler
  KB1_TEMEL_BECERILER = 'KB1_TEMEL_BECERILER',
  KB2_BUTUNLESIK_BECERILER = 'KB2_BUTUNLESIK_BECERILER',
  KB3_UST_DUZEY_DUSUNME = 'KB3_UST_DUZEY_DUSUNME',
  // Fiziksel Beceriler
  FIZIKSEL_BECERILER = 'FIZIKSEL_BECERILER',
  // Eğilimler
  EGILIMLER_BENLIK = 'EGILIMLER_BENLIK',
  EGILIMLER_SOSYAL = 'EGILIMLER_SOSYAL',
  EGILIMLER_ENTELEKTUEL = 'EGILIMLER_ENTELEKTUEL',
  // Alan Becerileri
  ALAN_MATEMATIK = 'ALAN_MATEMATIK',
  ALAN_FEN = 'ALAN_FEN',
  ALAN_SOSYAL = 'ALAN_SOSYAL',
  ALAN_SANAT = 'ALAN_SANAT',
  ALAN_SPOR = 'ALAN_SPOR',
  ALAN_BILISIM = 'ALAN_BILISIM',
  ALAN_TASARIM = 'ALAN_TASARIM',
  ALAN_DIN = 'ALAN_DIN',
  ALAN_YABANCI_DIL = 'ALAN_YABANCI_DIL',
  // Sosyal-Duygusal Beceriler
  SDB_BENLIK_TANIMA = 'SDB_BENLIK_TANIMA',
  SDB_BENLIK_DUZENLEME = 'SDB_BENLIK_DUZENLEME',
  SDB_BENLIK_UYARLAMA = 'SDB_BENLIK_UYARLAMA',
  SDB_SOSYAL_ILETISIM = 'SDB_SOSYAL_ILETISIM',
  SDB_SOSYAL_ISBIRLIGI = 'SDB_SOSYAL_ISBIRLIGI',
  SDB_SOSYAL_FARKINDALIK = 'SDB_SOSYAL_FARKINDALIK',
  SDB_ORTAK_UYUM = 'SDB_ORTAK_UYUM',
  SDB_ORTAK_ESNEKLIK = 'SDB_ORTAK_ESNEKLIK',
  SDB_ORTAK_KARAR_VERME = 'SDB_ORTAK_KARAR_VERME',
  // Erdem-Değer-Eylem
  BILESENLER_ERDEM_DEGER_EYLEM = 'BILESENLER_ERDEM_DEGER_EYLEM',
  // Okuryazarlık
  OKURYAZARLIK_BILGI = 'OKURYAZARLIK_BILGI',
  OKURYAZARLIK_DIJITAL = 'OKURYAZARLIK_DIJITAL',
  OKURYAZARLIK_FINANSAL = 'OKURYAZARLIK_FINANSAL',
  OKURYAZARLIK_GORSEL = 'OKURYAZARLIK_GORSEL',
  OKURYAZARLIK_KULTUR = 'OKURYAZARLIK_KULTUR',
  OKURYAZARLIK_VATANDASLIK = 'OKURYAZARLIK_VATANDASLIK',
  OKURYAZARLIK_VERI = 'OKURYAZARLIK_VERI',
  OKURYAZARLIK_SURDURULEBILIRLIK = 'OKURYAZARLIK_SURDURULEBILIRLIK',
  OKURYAZARLIK_SANAT = 'OKURYAZARLIK_SANAT',
  // Öğrenme Çıktıları
  OUTCOMES = 'OUTCOMES',
}

export interface Student {
    id: string;
    name: string;
}

export interface Classroom {
    id: string;
    name: string;
    students: Student[];
}

export interface ExamQuestion {
    id: string;
    text: string;
    maxScore: number;
}
export interface StudentScores {
    studentId: string;
    scores: Record<string, number | null>;
}
export interface ExamAnalysisData {
    classroomId: string;
    examTitle: string;
    questions: ExamQuestion[];
    scores: StudentScores[];
}

export interface CalendarNote {
    text: string;
    reminder: boolean;
}

// FIX: Added missing PerformanceData and StudentPerformance types.
export interface StudentPerformance {
    studentId: string;
    studentName: string;
    scores: (number | null)[];
}
export type PerformanceData = Record<string, StudentPerformance[]>;

export type EvaluationStudentData = Record<string, boolean | string | number | null>;
export type AllEvaluationData = Record<string, Record<string, Record<string, EvaluationStudentData>>>;

export interface YesNoEvaluationForm {
    id: string;
    title: string;
    type: 'yes-no';
    items: { id: string; text: string }[];
    note?: string;
}
export interface MultiChoiceEvaluationForm {
    id: string;
    title: string;
    type: 'multi-choice';
    sections: {
        id: string;
        title: string;
        questions: {
            id: string;
            question: string;
            options: string[];
        }[];
    }[];
    note?: string;
}
export interface FreeTextEvaluationForm {
    id: string;
    title: string;
    type: 'free-text';
    items: { id: string; prompt: string }[];
    note?: string;
}
export interface RubricEvaluationForm {
    id: string;
    title: string;
    type: 'rubric';
    items: { id: string; text: string }[];
    scale: { value: number; label: string }[];
    note?: string;
}
export type EvaluationForm = YesNoEvaluationForm | MultiChoiceEvaluationForm | FreeTextEvaluationForm | RubricEvaluationForm;

export type ChecklistState = 'observed' | 'needs_improvement' | 'not_observed' | null;

export interface ChecklistItem {
    id: string;
    text: string;
}
export interface Checklist {
    id: string;
    title: string;
    isCustom: boolean;
    items: ChecklistItem[];
}
export type StudentChecklistData = ChecklistState[];
export type ChecklistData = Record<string, Record<string, StudentChecklistData>>;

export type ActivityCategory = 'Tartışma' | 'Araştırma' | 'Yaratıcı Yazma' | 'Analiz' | 'Grup Çalışması';
export const activityCategories: ActivityCategory[] = ['Tartışma', 'Araştırma', 'Yaratıcı Yazma', 'Analiz', 'Grup Çalışması'];

export interface Activity {
    id: string;
    title: string;
    category: ActivityCategory;
    description: string;
    duration: string;
    learningOutcomes: string[];
    materials?: string[];
    steps: string[];
    note?: string;
    evaluation?: string;
}