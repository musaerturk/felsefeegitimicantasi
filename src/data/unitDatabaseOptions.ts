// OptionNode interface'ini tanımla
export interface OptionNode {
  id: string;
  label: string;
  children?: OptionNode[];
}

// 10. Sınıf Öğrenme Çıktıları
export const ogrenmeCiktilariOptions10: OptionNode[] = [
  { id: '10.1', label: '10.1. Felsefenin Anlamı ve Önemi' },
  { id: '10.2', label: '10.2. Felsefi Düşüncenin Özellikleri' },
  // Diğer 10. sınıf çıktıları...
];

// 11. Sınıf Öğrenme Çıktıları  
export const ogrenmeCiktilariOptions11: OptionNode[] = [
  { id: '11.1', label: '11.1. Varlık Felsefesi' },
  { id: '11.2', label: '11.2. Bilgi Felsefesi' },
  // Diğer 11. sınıf çıktıları...
];

// Alan Becerileri
export const alanBecerileriOptions: OptionNode[] = [
  { id: 'ab1', label: 'Eleştirel Düşünme' },
  { id: 'ab2', label: 'Analitik Düşünme' },
  // Diğer alan becerileri...
];

// Kavramsal Beceriler
export const kavramsalBecerilerOptions: OptionNode[] = [
  { id: 'kb1', label: 'Kavram Analizi' },
  { id: 'kb2', label: 'Argüman Değerlendirme' },
  // Diğer kavramsal beceriler...
];

// Eğilimler
export const egilimlerOptions: OptionNode[] = [
  { id: 'e1', label: 'Bireysel Farklılıklar' },
  { id: 'e2', label: 'Öğrenme Stilleri' },
  // Diğer eğilimler...
];

// Sosyal-Duygusal Beceriler
export const sosyalDuygusalOptions: OptionNode[] = [
  { id: 'sd1', label: 'Empati' },
  { id: 'sd2', label: 'İşbirliği' },
  // Diğer sosyal-duygusal beceriler...
];

// Değerler
export const degerlerOptions: OptionNode[] = [
  { id: 'd1', label: 'Adalet' },
  { id: 'd2', label: 'Özgürlük' },
  // Diğer değerler...
];

// Okuryazarlık Becerileri
export const okuryazarlikOptions: OptionNode[] = [
  { id: 'o1', label: 'Metin Okuryazarlığı' },
  { id: 'o2', label: 'Medya Okuryazarlığı' },
  // Diğer okuryazarlık becerileri...
];

// Generic export'ları da koruyalım
export const allGrades = ['9', '10', '11', '12'];
export const allUnits = ['Unit1', 'Unit2', 'Unit3', 'Unit4'];
export const allTopics = ['Topic1', 'Topic2', 'Topic3'];
export const allConcepts = ['Concept1', 'Concept2'];
export const allObjectives = ['Objective1', 'Objective2'];
export const allActivities = ['Activity1', 'Activity2'];
export const allResources = ['Resource1', 'Resource2'];
export const allAssessments = ['Assessment1', 'Assessment2'];
export const allKeywords = ['Keyword1', 'Keyword2'];
