
export interface OptionNode {
    id: string;
    label: string;
    children?: OptionNode[];
}

export const kavramsalBecerilerOptions: OptionNode[] = [
    { id: 'kb_analitik', label: 'Analitik Düşünme' },
    { id: 'kb_elestirel', label: 'Eleştirel Düşünme' },
    { id: 'kb_yaratici', label: 'Yaratıcı Düşünme' },
    { id: 'kb_problem_cozme', label: 'Problem Çözme' },
];

export const alanBecerileriOptions: OptionNode[] = [
    { id: 'ab_metin_analizi', label: 'Felsefi Metin Analizi' },
    { id: 'ab_sokratik', label: 'Sokratik Sorgulama' },
    { id: 'ab_arguman', label: 'Argüman Geliştirme' },
];

export const egilimlerOptions: OptionNode[] = [
    { id: 'eg_merak', label: 'Entelektüel Merak' },
    { id: 'eg_suphecilik', label: 'Yapıcı Şüphecilik' },
    { id: 'eg_acik_fikirlilik', label: 'Açık Fikirlilik' },
];

export const sosyalDuygusalOptions: OptionNode[] = [
    { id: 'sd_farkindalik', label: 'Öz Farkındalık' },
    { id: 'sd_empati', label: 'Empati' },
    { id: 'sd_iletisim', label: 'Etkili İletişim' },
];

export const degerlerOptions: OptionNode[] = [
    { id: 'd_bilgelik', label: 'Bilgelik' },
    { id: 'd_adalet', label: 'Adalet' },
    { id: 'd_cesaret', label: 'Entelektüel Cesaret' },
    { id: 'd_sorumluluk', label: 'Sorumluluk' },
];

export const okuryazarlikOptions: OptionNode[] = [
    { id: 'oy_elestirel', label: 'Eleştirel Okuryazarlık' },
    { id: 'oy_dijital', label: 'Dijital Okuryazarlık' },
    { id: 'oy_kultur', label: 'Kültür Okuryazarlığı' },
];

export const ogrenmeCiktilariOptions10: OptionNode[] = [
    { id: '10.1.1', label: '10.1.1. Felsefenin anlamını açıklar.' },
    { id: '10.1.2', label: '10.1.2. Felsefi düşüncenin özelliklerini örneklendirir.' },
    { id: '10.2.1', label: '10.2.1. Varlık felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.2.2', label: '10.2.2. Varlığın niceliği ve niteliği ile ilgili temel görüşleri karşılaştırır.' },
    { id: '10.3.1', label: '10.3.1. Bilgi felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.3.2', label: '10.3.2. Bilginin kaynağı hakkındaki temel görüşleri analiz eder.' },
    { id: '10.4.1', label: '10.4.1. Ahlak felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.4.2', label: '10.4.2. Ahlaki eylemin amacı hakkındaki temel görüşleri karşılaştırır.' },
    { id: '10.5.1', label: '10.5.1. Sanat felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.5.2', label: '10.5.2. Sanatın ne olduğu hakkındaki temel görüşleri analiz eder.' },
    { id: '10.6.1', label: '10.6.1. Siyaset felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.6.2', label: '10.6.2. İdeal devlet düzeni arayışlarını değerlendirir.' },
    { id: '10.7.1', label: '10.7.1. Din felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.7.2', label: '10.7.2. Tanrı\'nın varlığına ilişkin temel argümanları analiz eder.' },
    { id: '10.8.1', label: '10.8.1. Bilim felsefesinin temel kavramlarını ve problemlerini açıklar.' },
    { id: '10.8.2', label: '10.8.2. Bilimsel yöntemin doğasını sorgular.' },
];

export const ogrenmeCiktilariOptions11: OptionNode[] = [
    { 
        id: 'unit_11_1', 
        label: 'Ünite 1: MÖ 6. yy - MS 2. yy Felsefesi',
        children: [
            { id: '11.1.1', label: '11.1.1. Felsefenin ortaya çıkışını hazırlayan düşünce ortamını açıklar.' },
            { id: '11.1.2', label: '11.1.2. MÖ 6. yüzyıl-MS 2. yüzyıl felsefesinin karakteristik özelliklerini açıklar.' },
            { id: '11.1.3', label: '11.1.3. Örnek felsefi metinlerden hareketle MÖ 6. yüzyıl-MS 2. yüzyıl filozoflarının felsefi görüşlerini analiz eder.' },
            { id: '11.1.4', label: '11.1.4. MÖ 6. yüzyıl-MS 2. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.' },
        ]
    },
    { 
        id: 'unit_11_2', 
        label: 'Ünite 2: MS 2. yy - MS 15. yy Felsefesi',
        children: [
            { id: '11.2.1', label: '11.2.1. MS 2. yüzyıl-MS 15. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.' },
            { id: '11.2.2', label: '11.2.2. MS 2. yüzyıl-MS 15. yüzyıl felsefesinin karakteristik özelliklerini açıklar.' },
            { id: '11.2.3', label: '11.2.3. Örnek felsefi metinlerden hareketle MS 2. yüzyıl-MS 15. yüzyıl filozoflarının felsefi görüşlerini analiz eder.' },
            { id: '11.2.4', label: '11.2.4. MS 2. yüzyıl-MS 15. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.' },
        ]
    },
    { 
        id: 'unit_11_3', 
        label: 'Ünite 3: 15. - 17. yy Felsefesi',
        children: [
            { id: '11.3.1', label: '11.3.1. 15. yüzyıl-17. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.' },
            { id: '11.3.2', label: '11.3.2. 15. yüzyıl-17. yüzyıl felsefesinin karakteristik özelliklerini açıklar.' },
            { id: '11.3.3', label: '11.3.3. Örnek felsefi metinlerden hareketle 15. yüzyıl-17. yüzyıl filozoflarının felsefi görüşlerini analiz eder.' },
            { id: '11.3.4', label: '11.3.4. 15. yüzyıl-17. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.' },
        ]
    },
    { 
        id: 'unit_11_4', 
        label: 'Ünite 4: 18. - 19. yy Felsefesi',
        children: [
            { id: '11.4.1', label: '11.4.1. 18. yüzyıl -19. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.' },
            { id: '11.4.2', label: '11.4.2. 18. yüzyıl -19. yüzyıl felsefesinin karakteristik özelliklerini açıklar.' },
            { id: '11.4.3', label: '11.4.3. Örnek felsefi metinlerinden hareketle 18. yüzyıl -19. yüzyıl filozoflarının felsefi görüşlerini analiz eder.' },
            { id: '11.4.4', label: '11.4.4. 18. yüzyıl -19. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.' },
        ]
    },
    { 
        id: 'unit_11_5', 
        label: 'Ünite 5: 20. yy Felsefesi',
        children: [
            { id: '11.5.1', label: '11.5.1. 20. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.' },
            { id: '11.5.2', label: '11.5.2. 20. yüzyıl felsefesinin karakteristik özelliklerini açıklar.' },
            { id: '11.5.3', label: '11.5.3. Örnek felsefi metinlerden hareketle 20. yüzyıl filozoflarının felsefi görüşlerini analiz eder.' },
            { id: '11.5.4', label: '11.5.4. 20. yüzyıl felsefesi örnek düşünce ve argümanları felsefi açıdan değerlendirir.' },
            { id: '11.5.5', label: '11.5.5. Harita üzerinde 20 ve 21. yüzyıl felsefecilerinin yaşadıkları coğrafyayı gösterir' },
        ]
    },
];