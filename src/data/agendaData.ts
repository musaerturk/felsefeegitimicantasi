import { Grade } from '../types.ts';

export interface AgendaWeek {
  week: number;
  topic: string;
  outcomes: string;
  activities: string;
  notes: string;
}

const createEmptyWeek = (week: number): AgendaWeek => ({
  week,
  topic: '',
  outcomes: '',
  activities: '',
  notes: '',
});

export const agendaData10: AgendaWeek[] = [
    { week: 1, topic: 'Felsefeyi Tanıma', outcomes: '10.1.1.', activities: '', notes: '' },
    { week: 2, topic: 'Felsefeyi Tanıma', outcomes: '10.1.1.', activities: '', notes: '' },
    { week: 3, topic: 'Felsefeyi Tanıma', outcomes: '10.1.2.', activities: '', notes: '' },
    { week: 4, topic: 'Felsefeyi Tanıma', outcomes: '10.1.2.', activities: '', notes: '' },
    { week: 5, topic: 'Felsefeyi Tanıma', outcomes: '10.1.2.', activities: '', notes: '' },
    { week: 6, topic: 'Varlık Felsefesi', outcomes: '10.2.1.', activities: '', notes: '' },
    { week: 7, topic: 'Varlık Felsefesi', outcomes: '10.2.1.', activities: '', notes: '' },
    { week: 8, topic: 'Varlık Felsefesi', outcomes: '10.2.1.', activities: '', notes: '' },
    { week: 9, topic: 'Varlık Felsefesi', outcomes: '10.2.1.', activities: '', notes: '' },
    { week: 10, topic: 'Bilgi Felsefesi', outcomes: '10.3.1.', activities: '', notes: '' },
    { week: 11, topic: 'Bilgi Felsefesi', outcomes: '10.3.1.', activities: '', notes: '' },
    { week: 12, topic: 'Bilgi Felsefesi', outcomes: '10.3.1.', activities: '', notes: '' },
    { week: 13, topic: 'Ahlak Felsefesi', outcomes: '10.4.1.', activities: '', notes: '' },
    { week: 14, topic: 'Ahlak Felsefesi', outcomes: '10.4.1.', activities: '', notes: '' },
    { week: 15, topic: 'Ahlak Felsefesi', outcomes: '10.4.1.', activities: '', notes: '' },
    { week: 16, topic: 'Ahlak Felsefesi', outcomes: '10.4.1.', activities: '', notes: '' },
    { week: 17, topic: 'Ahlak Felsefesi', outcomes: '10.4.2.', activities: '', notes: '' },
    { week: 18, topic: 'Varlık Felsefesi', outcomes: '10.2.2.', activities: '', notes: '' },
    { week: 19, topic: 'Bilgi Felsefesi', outcomes: '10.3.2.', activities: '', notes: '' },
    { week: 20, topic: 'Sanat Felsefesi', outcomes: '10.5.1.', activities: '', notes: '' },
    { week: 21, topic: 'Sanat Felsefesi', outcomes: '10.5.2.', activities: '', notes: '' },
    { week: 22, topic: 'Siyaset Felsefesi', outcomes: '10.6.1.', activities: '', notes: '' },
    { week: 23, topic: 'Siyaset Felsefesi', outcomes: '10.6.1.', activities: '', notes: '' },
    { week: 24, topic: 'Siyaset Felsefesi', outcomes: '10.6.2.', activities: '', notes: '' },
    { week: 25, topic: 'Din Felsefesi', outcomes: '10.7.1.', activities: '', notes: '' },
    { week: 26, topic: 'Din Felsefesi', outcomes: '10.7.2.', activities: '', notes: '' },
    { week: 27, topic: 'Bilim Felsefesi', outcomes: '10.8.1.', activities: '', notes: '' },
    { week: 28, topic: 'Bilim Felsefesi', outcomes: '10.8.2.', activities: '', notes: '' },
    { week: 29, topic: 'Genel Tekrar', outcomes: '-', activities: '', notes: '' },
    { week: 30, topic: 'Genel Tekrar ve Yıl Sonu Değerlendirme', outcomes: '-', activities: '', notes: '' },
    { week: 31, topic: 'Yıl Sonu Değerlendirme', outcomes: '-', activities: '', notes: '' },
];


export const agendaData11: AgendaWeek[] = [
    { 
        week: 1, 
        topic: 'MÖ 6. Yüzyıl - MS 2. Yüzyıl Felsefesi: Felsefenin Ortaya Çıkışı', 
        outcomes: 'Felsefenin doğuşunu hazırlayan düşünce ortamını ve Sümer, Mezopotamya, Mısır, Çin, Hint, İran medeniyetlerinin felsefeye etkilerini açıklar.', 
        activities: 'Anlatım, Soru-Cevap, Tartışma. MÖ 6. yy Yunanistan koşulları, felsefenin mitolojiden ayrışması, doğu medeniyetlerinin felsefeye etkileri ve felsefenin doğuşunun nedenleri üzerine tartışma.', 
        notes: 'Öğrencilerden konuyla ilgili kısa özet yazmaları istenir. Medeniyetlerin felsefi düşünceleri hakkında sunum ödevi verilir. Ders sonunda kısa sınav yapılır.' 
    },
    { 
        week: 2, 
        topic: 'MÖ 6. Yüzyıl - MS 2. Yüzyıl Felsefesi: Anadolu\'da Yaşamış Antik Filozoflar', 
        outcomes: 'Felsefenin ortaya çıkışını hazırlayan düşünce ortamını açıklar. Anadolu\'da yaşamış filozofların isimlerini, yaşadıkları yerleri, hayatları ve öğretileri hakkında genel bilgi sahibi olur. Anadolu\'nun felsefedeki önemini kavrar.', 
        activities: 'Anlatım, Soru-Cevap, Örneklendirme. Felsefenin ortaya çıkışı ve Anadolu\'nun önemi. Thales, Anaksimandros, Anaksimenes, Anaksagoras, Herakleitos, Epiktetos, Diogenes, Lukianos, Ksenofanes ve Aristoteles hakkında bilgi verilir. Akıllı tahta sunumu yapılır ve filozofların sözleri tartışılır.', 
        notes: 'Öğrencilerden Anadolu filozofları hakkında kısa bir özet yazmaları istenir. Felsefenin ortaya çıkışını açıklamaları istenir. Ders içi katılım değerlendirilir.' 
    },
    { week: 3, topic: 'MÖ 6. yy - MS 2. yy Felsefesi', outcomes: '11.1.3.', activities: '', notes: '' },
    { week: 4, topic: 'MÖ 6. yy - MS 2. yy Felsefesi', outcomes: '11.1.3.', activities: '', notes: '' },
    { week: 5, topic: 'MÖ 6. yy - MS 2. yy Felsefesi', outcomes: '11.1.4.', activities: '', notes: '' },
    { week: 6, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.1.', activities: '', notes: '' },
    { week: 7, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.2.', activities: '', notes: '' },
    { week: 8, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.2.', activities: '', notes: '' },
    { week: 9, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.3.', activities: '', notes: '' },
    { week: 10, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.3.', activities: '', notes: '' },
    { week: 11, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.4.', activities: '', notes: '' },
    { week: 12, topic: 'MS 2. yy - MS 15. yy Felsefesi', outcomes: '11.2.4.', activities: '', notes: '' },
    { week: 13, topic: '15. - 17. yy Felsefesi', outcomes: '11.3.1.', activities: '', notes: '' },
    { week: 14, topic: '15. - 17. yy Felsefesi', outcomes: '11.3.2.', activities: '', notes: '' },
    { week: 15, topic: '15. - 17. yy Felsefesi', outcomes: '11.3.3.', activities: '', notes: '' },
    { week: 16, topic: '15. - 17. yy Felsefesi', outcomes: '11.3.3.', activities: '', notes: '' },
    { week: 17, topic: '15. - 17. yy Felsefesi', outcomes: '11.3.4.', activities: '', notes: '' },
    { week: 18, topic: '18. - 19. yy Felsefesi', outcomes: '11.4.1.', activities: '', notes: '' },
    { week: 19, topic: '18. - 19. yy Felsefesi', outcomes: '11.4.2.', activities: '', notes: '' },
    { week: 20, topic: '18. - 19. yy Felsefesi', outcomes: '11.4.3.', activities: '', notes: '' },
    { week: 21, topic: '18. - 19. yy Felsefesi', outcomes: '11.4.3.', activities: '', notes: '' },
    { week: 22, topic: '18. - 19. yy Felsefesi', outcomes: '11.4.4.', activities: '', notes: '' },
    { week: 23, topic: '18. - 19. yy Felsefesi', outcomes: '11.4.4.', activities: '', notes: '' },
    { week: 24, topic: '20. yy Felsefesi', outcomes: '11.5.1.', activities: '', notes: '' },
    { week: 25, topic: '20. yy Felsefesi', outcomes: '11.5.2.', activities: '', notes: '' },
    { week: 26, topic: '20. yy Felsefesi', outcomes: '11.5.3.', activities: '', notes: '' },
    { week: 27, topic: '20. yy Felsefesi', outcomes: '11.5.3.', activities: '', notes: '' },
    { week: 28, topic: '20. yy Felsefesi', outcomes: '11.5.3.', activities: '', notes: '' },
    { week: 29, topic: '20. yy Felsefesi', outcomes: '11.5.4.', activities: '', notes: '' },
    { week: 30, topic: '20. yy Felsefesi', outcomes: '11.5.4.', activities: '', notes: '' },
    { week: 31, topic: '20. yy Felsefesi', outcomes: '11.5.4.', activities: '', notes: '' },
    { week: 32, topic: '20. yy Felsefesi', outcomes: '11.5.5.', activities: '', notes: '' },
    { week: 33, topic: '20. yy Felsefesi', outcomes: '11.5.5.', activities: '', notes: '' },
    createEmptyWeek(34),
    createEmptyWeek(35),
    createEmptyWeek(36),
    createEmptyWeek(37),
    createEmptyWeek(38),
];

export const getInitialAgendaData = (grade: Grade): AgendaWeek[] => {
    return grade === Grade.TENTH ? agendaData10 : agendaData11;
};