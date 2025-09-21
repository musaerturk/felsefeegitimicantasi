import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Tool, EvaluationForm, Classroom, AllEvaluationData, YesNoEvaluationForm, MultiChoiceEvaluationForm, EvaluationStudentData, FreeTextEvaluationForm, RubricEvaluationForm } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { CheckBadgeIcon, AcademicCapIcon, PrinterIcon, DownloadIcon } from '../ui/Icons';
import { useClassroomManager } from '../../hooks/useClassroomManager';
import Accordion from '../ui/Accordion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Loader from '../ui/Loader';

// --- Data Definitions ---
const evaluationFormsData: EvaluationForm[] = [
  {
    id: 'activity_1_felsefe',
    title: 'Etkinlik 1: Felsefe Üzerine Felsefe Yapılabilir mi?',
    type: 'yes-no',
    items: [
      { id: 'a1_1', text: 'Konu ile ilgili görüş geliştirdi.' },
      { id: 'a1_2', text: 'Konuyla ilgili kendi görüşünü gerekçeleriyle açıkladı.' },
      { id: 'a1_3', text: 'Tartışmada arkadaşlarını nezaketle dinledi.' },
      { id: 'a1_4', text: 'Kendisinden farklı düşünenlere saygılı yaklaştı.' },
      { id: 'a1_5', text: 'Zamanı başarılı bir şekilde yönetti.' },
      { id: 'a1_6', text: 'Etkinlik sürecine aktif katılım sağladı.' },
      { id: 'a1_7', text: 'Yansıtma yazısı yazdı.' },
      { id: 'a1_8', text: 'Yansıtma yazısını sınıf arkadaşlarıyla paylaştı.' },
    ],
    note: '“Hayır”la işaretlenen bölümleri bir kez daha gözden geçirmesini ve eksiklerini tamamlamasını isteyiniz.',
  },
  {
    id: 'activity_2_turku',
    title: 'Etkinlik 2: Türkülerde Felsefe',
    type: 'yes-no',
    items: [
      { id: 'a2_1', text: 'Bir çalışma planı hazırlayarak bu plana bağlı kaldı.' },
      { id: 'a2_2', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a2_3', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a2_4', text: 'Âşık Veysel ve Neşet Ertaş’ın türkülerindeki felsefi kavramlarla ilgili doğru bilgilere ulaştı.' },
      { id: 'a2_5', text: 'Elde ettiği verileri kullanarak bir rapor hazırladı.' },
      { id: 'a2_6', text: 'Raporunu sınıfta sundu.' },
      { id: 'a2_7', text: 'Zamanı başarılı bir şekilde yönetti.' },
      { id: 'a2_8', text: 'Sunum yaparken dili etkin ve düzgün kullandı.' },
    ],
    note: '“Hayır”la işaretlenen bölümleri bir kez daha gözden geçirmesini ve eksiklerini tamamlamasını isteyiniz.',
  },
  {
    id: 'activity_3_kadin_filozoflar',
    title: 'Etkinlik 3: Tarihte Kadın Filozoflar',
    type: 'multi-choice',
    sections: [
      {
        id: 'a3_s1',
        title: '1. Genel Katılım ve Motivasyon',
        questions: [
          { id: 'a3_q1', question: 'Öğrencinin etkinliğe olan ilgisi nasıldı?', options: ['Çok yüksek', 'Yüksek', 'Orta', 'Düşük'] },
        ],
      },
      {
        id: 'a3_s2',
        title: '2. Araştırma Süreci Değerlendirmesi',
        questions: [
          { id: 'a3_q2', question: 'Araştırma sorularını doğru şekilde anladı mı?', options: ['Çok iyi anladı.', 'Kısmen anladı.', 'Anlamakta zorlandı.'] },
          { id: 'a3_q3', question: 'Araştırma sürecindeki kaynak seçimi nasıldı?', options: ['Güvenilir ve ilgili kaynaklar seçti.', 'Kısmen doğru kaynaklar seçti.', 'Uygun olmayan kaynaklar tercih etti.'] },
        ],
      },
      {
        id: 'a3_s3',
        title: '3. Rapor Hazırlama ve İletişim Becerileri',
        questions: [
          { id: 'a3_q4', question: 'Raporun içeriği nasıldı?', options: ['Konuyla tamamen ilgili ve kapsamlıydı.', 'Kısmen ilgiliydi.', 'Yetersiz veya konuyla alakasızdı.'] },
          { id: 'a3_q5', question: 'Raporu paylaşma sırasında kullanılan görseller veya ek materyaller nasıldı?', options: ['Etkili ve destekleyiciydi.', 'Kısmen etkili ve destekleyiciydi.', 'Yetersiz veya hiç kullanılmadı.'] },
          { id: 'a3_q6', question: 'İletişim becerileri (ses tonu, netlik, dinleyici ile etkileşim) nasıldı?', options: ['Çok başarılıydı.', 'Orta düzeydeydi.', 'Geliştirilmesi gerekiyor.'] },
        ],
      },
    ],
  },
  {
    id: 'activity_4_mantik_turleri',
    title: 'Etkinlik 4: Mantık Türleri',
    type: 'yes-no',
    items: [
        { id: 'a4_1', text: 'Araştırma sürecini planladı ve güvenilir kaynaklar kullandı.' },
        { id: 'a4_2', text: 'Farklı mantık türlerinin temel kavramlarını doğru tespit etti.' },
        { id: 'a4_3', text: 'Mantık türlerinin öne çıkan özelliklerini ve kullanım alanlarını belirledi.' },
        { id: 'a4_4', text: 'Çalışma kâğıdındaki karşılaştırmaları eksiksiz ve mantıksal tutarlılık içinde tamamladı.' },
        { id: 'a4_5', text: 'Araştırma sonuçlarını sınıfta açık ve anlaşılır bir şekilde sundu.' },
        { id: 'a4_6', text: 'Tartışmalara yapıcı bir şekilde katılarak farklı görüşleri değerlendirdi.' },
    ],
    note: '“Hayır”la işaretlenen bölümleri bir kez daha gözden geçirmesini ve eksiklerini tamamlamasını isteyiniz.',
  },
  {
    id: 'activity_5_wittgenstein',
    title: 'Etkinlik 5: Ludwig Wittgenstein ve “Dil Oyunu”',
    type: 'multi-choice',
    sections: [
        {
            id: 'a5_s1', title: '1. Genel Katılım ve Motivasyon',
            questions: [{ id: 'a5_q1', question: 'Öğrencinin etkinliğe olan ilgisi nasıldı?', options: ['Çok yüksek', 'Yüksek', 'Orta', 'Düşük'] }],
        },
        {
            id: 'a5_s2', title: '2. Araştırma Süreci Değerlendirmesi',
            questions: [
                { id: 'a5_q2', question: 'Araştırma sorularını doğru şekilde anladı mı?', options: ['Çok iyi anladı.', 'Kısmen anladı.', 'Anlamakta zorlandı.'] },
                { id: 'a5_q3', question: 'Araştırma sürecindeki kaynak seçimi nasıldı?', options: ['Güvenilir ve ilgili kaynaklar seçti.', 'Kısmen güvenilir ve ilgili kaynaklar seçti.', 'Uygun olmayan kaynaklar tercih etti.'] },
                { id: 'a5_q4', question: 'Araştırma sırasında iş birliği ve takım çalışması becerilerini kullandı mı?', options: ['Çok iyi iş birliği yaptı.', 'Kısmen iş birliği yaptı.', 'İş birliği yapmadı.'] },
            ],
        },
        {
            id: 'a5_s3', title: '3. Sunum ve İletişim Becerileri',
            questions: [
                { id: 'a5_q5', question: 'Sunumun içeriği nasıldı?', options: ['Konuyla tamamen ilgili ve kapsamlıydı.', 'Konuyla kısmen ilgili ve kapsamlıydı.', 'Yetersiz veya konuyla alakasızdı.'] },
                { id: 'a5_q6', question: 'Sunum sırasında kullanılan görseller veya ek materyaller nasıldı?', options: ['Etkili ve destekleyiciydi.', 'Kısmen etkili ve destekleyiciydi.', 'Yetersiz veya hiç kullanılmadı.'] },
                { id: 'a5_q7', question: 'İletişim becerileri (ses tonu, netlik, dinleyici ile etkileşim) nasıldı?', options: ['Çok başarılıydı.', 'Orta düzeydeydi', 'Geliştirilmesi gerekiyor.'] },
            ],
        },
        {
            id: 'a5_s4', title: '4. Yansıtma ve Değerlendirme',
            questions: [{ id: 'a5_q8', question: 'Öğrencinin yansıtma yazısı nasıl ele alınıyor?', options: ['Detaylı ve tutarlıydı.', 'Kısmen detaylı ve tutarlıydı.', 'Yüzeysel veya tutarsızdı.'] }],
        },
    ],
  },
  {
    id: 'activity_6_bilim_akil',
    title: 'Etkinlik 6: Bilimde Akıl Yürütme',
    type: 'yes-no',
    items: [
        { id: 'a6_1', text: '“Çalışma Kâğıdı”ndaki problem durumlarından birini seçti veya kendi problem durumunu oluşturdu.' },
        { id: 'a6_2', text: 'Belirlenen problem üzerine bir hipotez geliştirdi.' },
        { id: 'a6_3', text: 'Geliştirdiği hipotezi özdeşlik ilkesine göre değerlendirdi.' },
        { id: 'a6_4', text: 'Geliştirdiği hipotezi çelişmezlik ilkesine göre değerlendirdi.' },
        { id: 'a6_5', text: 'Geliştirdiği hipotezi üçüncü hâlin imkânsızlığı ilkesine göre değerlendirdi.' },
        { id: 'a6_6', text: 'Geliştirdiği hipotezi yeter sebep ilkesine göre değerlendirdi.' },
        { id: 'a6_7', text: 'Geliştirdiği hipotezi geri çıkarım mantığına göre değerlendirdi.' },
        { id: 'a6_8', text: 'Hipotezinin mantıksal analiz sürecini içeren detaylı bir rapor hazırladı.' },
        { id: 'a6_9', text: 'Raporu sınıfta sundu.' },
        { id: 'a6_10', text: 'Tartışma sırasında diğer öğrencilerle birlikte hipotezlerin mantıksal tutarlılığını değerlendirdi.' },
        { id: 'a6_11', text: 'Tartışma sırasında alternatif hipotezler önerdi.' },
        { id: 'a6_12', text: 'Hipotezleri geri çıkarım yöntemiyle yeniden ele aldı.' },
    ],
  },
  {
    id: 'activity_7_arguman_diyagrami',
    title: 'Etkinlik 7: Argüman Diyagramı Oluşturma',
    type: 'yes-no',
    items: [
        { id: 'a7_1', text: 'Argümanı ve alt argümanları doğru ve eksiksiz şekilde oluşturdu.' },
        { id: 'a7_2', text: 'Diyagramı açık şekilde ve mantıksal bir sırada oluşturdu.' },
        { id: 'a7_3', text: 'Tüm argüman ilişkilerini net bir şekilde gösterdi.' },
        { id: 'a7_4', text: 'Hataları tespit etti ve düzeltti.' },
        { id: 'a7_5', text: 'Çözümde yaratıcı ve özgün yaklaşım sergiledi.' },
        { id: 'a7_6', text: 'Öğretmenle iş birliği yaptı.' },
        { id: 'a7_7', text: 'Diyagramı tam ve doğru bir şekilde kodladı.' },
        { id: 'a7_8', text: 'Kodu başarıyla çalıştırdı.' },
    ],
  },
  {
    id: 'activity_8_schrodinger',
    title: 'Etkinlik 8: “Schrödinger’in Kedisi” ve Argümanları',
    type: 'free-text',
    items: [
        { id: 'a8_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a8_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a8_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_9_varlik_nedir',
    title: 'Etkinlik 9: Varlık Nedir?',
    type: 'yes-no',
    items: [
        { id: 'a9_1', text: 'Araştırma Süreci: Güvenilir kaynaklar kullandı.' },
        { id: 'a9_2', text: 'Araştırma Süreci: İlgili filozof ve kavram hakkında yeterli bilgi topladı.' },
        { id: 'a9_3', text: 'Araştırma Süreci: Akademik veri tabanlarından yararlandı.' },
        { id: 'a9_4', text: 'Araştırma Süreci: Araştırma sırasında önemli noktaları not aldı.' },
        { id: 'a9_5', text: 'Metin Yazımı: En az 250 kelime uzunluğunda metin yazdı.' },
        { id: 'a9_6', text: 'Metin Yazımı: Kavramın tanımını ve filozofun düşüncesindeki yerini açıkladı.' },
        { id: 'a9_7', text: 'Metin Yazımı: Kavramın tarihsel gelişimini ve başka filozoflarla ilişkisini ele aldı.' },
        { id: 'a9_8', text: 'Metin Yazımı: Kavramın varlık felsefesindeki önemini belirtti.' },
        { id: 'a9_9', text: 'Metin Yazımı: Bilimsel bir dil ve akademik üslup kullandı.' },
        { id: 'a9_10', text: 'Metin Yazımı: Bilgileri, güvenilir ve tutarlı bir şekilde sundu.' },
        { id: 'a9_11', text: 'Kelime Bulutu: En az 10 temel kavram belirledi.' },
        { id: 'a9_12', text: 'Kelime Bulutu: Kelime bulutu oluşturdu.' },
        { id: 'a9_13', text: 'Kelime Bulutu: Kelimeler arasındaki önem hiyerarşisini doğru şekilde yansıttı.' },
        { id: 'a9_14', text: 'Sunum: Kelime seçimlerini ve filozofun varlık anlayışını açıkladı.' },
        { id: 'a9_15', text: 'Sunum: Sunumu sırasında açık ve anlaşılır bir anlatım kullandı.' },
        { id: 'a9_16', text: 'Genel: Etkinlik sürecine aktif katıldı.' },
        { id: 'a9_17', text: 'Genel: Zamanı başarılı bir şekilde yönetti.' },
        { id: 'a9_18', text: 'Genel: Yaratıcı ve özgün bir çalışma ortaya koydu.' },
    ],
  },
  {
    id: 'activity_10_ibni_sina_descartes',
    title: 'Etkinlik 10: İbni Sina’nın “Uçan Adam” ile Descartes’ın “Cogito”sunu Karşılaştırma',
    type: 'yes-no',
    items: [
      { id: 'a10_1', text: 'Rehber soruları dikkatli bir şekilde okudu.' },
      { id: 'a10_2', text: '“Çalışma Kâğıdı”ndaki metinleri dikkatli bir şekilde okudu.' },
      { id: 'a10_3', text: '“Çalışma Kâğıdı”ndaki metinleri doğru analiz etti.' },
      { id: 'a10_4', text: 'İbni Sina ve Descartes’ın görüşlerini eksiksiz, doğru ve tutarlı şekilde açıkladı.' },
      { id: 'a10_5', text: 'İbni Sina ve Descartes’ın görüşlerindeki benzerlikleri ve farklılıkları anladı.' },
      { id: 'a10_6', text: '“İnsanın kendi varlığını idraki” problemine ilişkin düşüncelerinin benzerliklerini ve farklılıklarını içeren dijital materyal hazırladı.' },
      { id: 'a10_7', text: 'Düzenli, yaratıcı ve anlaşılır bir dijital materyal hazırladı.' },
      { id: 'a10_8', text: 'Dijital materyalin içeriğini destekleyici görseller kullandı.' },
      { id: 'a10_9', text: 'Dijital materyali etkileyici bir biçimde ve içeriğin anlaşılmasını destekleyecek açıklamalar kullanarak sundu.' },
      { id: 'a10_10', text: 'Etkinlik sürecinde zorlandığı noktalarda öğretmeniyle iletişim kurdu.' },
    ]
  },
  {
    id: 'activity_11a_yarasa_yansitma',
    title: 'Etkinlik 11: Yarasa Olmak Nasıl Bir Şeydir? (Yansıtma)',
    type: 'free-text',
    items: [
        { id: 'a11a_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a11a_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a11a_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_11b_yarasa_degerlendirme',
    title: 'Etkinlik 11: Yarasa Olmak Nasıl Bir Şeydir? (Değerlendirme)',
    type: 'yes-no',
    items: [
        { id: 'a11b_1', text: 'Rehber soruları dikkatli bir şekilde okudu.' },
        { id: 'a11b_2', text: '“Bilgi Notu”nu dikkatli bir şekilde okudu.' },
        { id: 'a11b_3', text: '“Çalışma Kâğıdı”ndaki metinleri dikkatli bir şekilde okudu.' },
        { id: 'a11b_4', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
        { id: 'a11b_5', text: 'En az 200 kelimeden oluşan bir deneme ya da karşıt argüman geliştirdiği metin yazdı.' },
        { id: 'a11b_6', text: 'Konuyu tamamen anladığını gösteren düşünceler ortaya koydu.' },
        { id: 'a11b_7', text: 'Görüş ve iddialarını tutarlı bir şekilde sundu.' },
        { id: 'a11b_8', text: 'Düşüncelerini yeterince açıkladı ve örneklerle zenginleştirdi.' },
        { id: 'a11b_9', text: 'Konuya yenilikçi bir yaklaşım getirerek yaratıcı fikirler ve bakış açıları sundu.' },
        { id: 'a11b_10', text: 'Dil kurallarına tamamen uygun, akıcı ve açık bir anlatım ortaya koydu.' },
    ]
  },
  {
    id: 'activity_12_bilgi_turleri',
    title: 'Etkinlik 12: Bilgi Türleri',
    type: 'rubric',
    items: [
      { id: 'a12_1', text: 'İçeriğin Doğruluğu' },
      { id: 'a12_2', text: 'Kavramlar Arası İlişki' },
      { id: 'a12_3', text: 'Dağılım' },
      { id: 'a12_4', text: 'Görsellik' },
      { id: 'a12_5', text: 'Özgünlük' },
      { id: 'a12_6', text: 'Kaynak Kullanımı' },
      { id: 'a12_7', text: 'Bilgi Derinliği' },
    ],
    scale: [
      { value: 3, label: 'Mükemmel' },
      { value: 2, label: 'Yeterli' },
      { value: 1, label: 'Geliştirilmeli' },
    ],
    note: 'Her ölçüt için uygun puanı seçiniz. Toplam puan, öğrencinin genel performansını yansıtır.',
  },
  {
    id: 'activity_13_gazali_descartes',
    title: 'Etkinlik 13: Gazali’nin Descartes’a Etkisi',
    type: 'yes-no',
    items: [
        { id: 'a13_1', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
        { id: 'a13_2', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
        { id: 'a13_3', text: 'Gazali ve Descartes’ın şüphecilik hakkındaki görüşleri ile ilgili yeterli bilgi topladı.' },
        { id: 'a13_4', text: 'Gazali ile Descartes’ın şüphecilik konusuna yaklaşımlarını karşılaştırarak bu iki filozofun görüşlerindeki benzerlikleri belirledi.' },
        { id: 'a13_5', text: 'Gazali ile Descartes’ın şüphecilik konusuna yaklaşımlarını karşılaştırarak bu iki filozofun görüşlerindeki farklılıkları belirledi.' },
        { id: 'a13_6', text: 'Elde ettiği verilerle bir dijital sunum/video hazırladı.' },
        { id: 'a13_7', text: 'Hazırladığı dijital sunumu/videoyu sınıfta sundu.' },
        { id: 'a13_8', text: 'Etkinlik sürecine aktif katılım sağladı.' },
        { id: 'a13_9', text: 'İş birliği içinde çalıştı.' },
        { id: 'a13_10', text: 'Etkinlik sürecinde zorlandığı noktalarda öğretmeniyle iletişim kurdu.' },
    ]
  },
  {
    id: 'activity_14_hume_duyular',
    title: 'Etkinlik 14: David Hume’da Duyular ve Akıl İlişkisi',
    type: 'yes-no',
    items: [
        { id: 'a14_1', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okudu.' },
        { id: 'a14_2', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
        { id: 'a14_3', text: 'D. Hume’un “nedensellik ilkesi” hakkındaki görüşlerini doğru analiz etti.' },
        { id: 'a14_4', text: 'D. Hume’un “nedensellik ilkesi” hakkındaki görüşlerinden hareketle duyular ve akıl arasındaki ilişkiyi çözümledi.' },
        { id: 'a14_5', text: 'Yansıtma yazısını yazdı.' },
        { id: 'a14_6', text: 'Yansıtma yazısını sınıfla paylaştı.' },
        { id: 'a14_7', text: 'Etkinlik sürecine aktif katılım sağladı.' },
    ]
  },
  {
    id: 'activity_15_gyges_yuzugu',
    title: 'Etkinlik 15: Gyges’in Yüzüğü Sende Olursa',
    type: 'free-text',
    items: [
        { id: 'a15_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a15_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a15_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_16_yapay_zeka',
    title: 'Etkinlik 16: Yapay Zekânın Eylemleri',
    type: 'yes-no',
    items: [
      { id: 'a16_1', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a16_2', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a16_3', text: 'Yapay zekâ konusunda yeterli bilgi topladı.' },
      { id: 'a16_4', text: 'Konu ile ilgili görüş geliştirdi ve bu görüşü gerekçelendirdi.' },
      { id: 'a16_5', text: 'Yansıtma yazısı yazdı.' },
      { id: 'a16_6', text: 'Yansıtma yazısını sınıf arkadaşlarıyla paylaştı.' },
      { id: 'a16_7', text: 'Turing testi soru listesini eksiksiz bir şekilde hazırladı.' },
      { id: 'a16_8', text: 'Etkinlik sürecine aktif katılım sağladı.' },
      { id: 'a16_9', text: 'Zamanı başarılı bir şekilde yönetti.' },
      { id: 'a16_10', text: 'Etkinlik sürecinde zorlandığı noktalarda öğretmeniyle iletişim kurdu.' },
    ],
  },
  {
    id: 'activity_17a_olculu_toplum_yansitma',
    title: 'Etkinlik 17: Günümüz Toplumları Ne Kadar Ölçülü? (Yansıtma)',
    type: 'free-text',
    items: [
        { id: 'a17a_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a17a_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a17a_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_17b_olculu_toplum_degerlendirme',
    title: 'Etkinlik 17: Günümüz Toplumları Ne Kadar Ölçülü? (Değerlendirme)',
    type: 'yes-no',
    items: [
      { id: 'a17b_1', text: 'Konuyla ilgili ve dikkat çekici bir başlık attı.' },
      { id: 'a17b_2', text: 'Konuyu tamamen anladığını gösteren düşünceler ortaya koydu.' },
      { id: 'a17b_3', text: 'Görüş ve iddialarını tutarlı bir şekilde sundu.' },
      { id: 'a17b_4', text: 'Düşüncelerini yeterince açıkladı ve örneklerle zenginleştirdi.' },
      { id: 'a17b_5', text: 'Konuya yenilikçi bir yaklaşım getirerek yaratıcı fikirler ve bakış açıları sundu.' },
      { id: 'a17b_6', text: 'Denemeyi bilimsel açıdan hatasız bir şekilde yazdı.' },
      { id: 'a17b_7', text: 'Özgün anlatıma sahip bir deneme yazdı.' },
      { id: 'a17b_8', text: 'Yazısında akıcı ve anlaşılır bir dil kullandı.' },
      { id: 'a17b_9', text: 'Yazım kurallarına uydu.' },
      { id: 'a17b_10', text: 'Noktalama işaretlerini doğru kullandı.' },
    ]
  },
  {
    id: 'activity_18_guzellik',
    title: 'Etkinlik 18: Güzelliğin Dört Temeli',
    type: 'yes-no',
    items: [
      { id: 'a18_1', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okudu.' },
      { id: 'a18_2', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
      { id: 'a18_3', text: 'Tartışma konusuyla ilgili görüşlerini açık ve anlaşılır biçimde ifade etti.' },
      { id: 'a18_4', text: 'Etkinlik sırasında arkadaşlarını nezaketle dinledi.' },
      { id: 'a18_5', text: 'Kendisinden farklı düşünenlere saygılı yaklaştı.' },
      { id: 'a18_6', text: 'Konuyla ilgili kendi görüşünü gerekçeleriyle açıkladı.' },
      { id: 'a18_7', text: 'Yansıtma yazısını yazdı.' },
      { id: 'a18_8', text: 'Yansıtma yazısını sınıfla paylaştı.' },
    ],
  },
  {
    id: 'activity_19_danto',
    title: 'Etkinlik 19: Arthur Danto’nun Sanat Anlayışı',
    type: 'free-text',
    items: [
        { id: 'a19_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a19_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a19_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_20_sanat_nedir',
    title: 'Etkinlik 20: Sanat Nedir?',
    type: 'free-text',
    items: [
        { id: 'a20_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a20_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a20_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_21_adil_dunya',
    title: 'Etkinlik 21: Adil Bir Dünya',
    type: 'yes-no',
    items: [
      { id: 'a21_1', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a21_2', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a21_3', text: 'Ütopya kavramı, ütopyaların özellikleri ve ütopya türleri hakkında doğru bilgilere ulaştı.' },
      { id: 'a21_4', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okuyarak sunulan bilgileri doğru bir şekilde anladı.' },
      { id: 'a21_5', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
      { id: 'a21_6', text: 'En az 250 kelimeden oluşan bir ütopya yazdı.' },
      { id: 'a21_7', text: 'Yaratıcı ve özgün bir ütopya tasarladı.' },
      { id: 'a21_8', text: 'Yazdığı ütopyada güvenilir ve tutarlı görüşler ortaya koydu.' },
      { id: 'a21_9', text: 'Yazdığı ütopya metnini sınıf arkadaşlarına sundu.' },
      { id: 'a21_10', text: 'Arkadaşlarına sunumu sırasında açık ve anlaşılır bir anlatım kullandı.' },
    ],
  },
  {
    id: 'activity_22_robotlar',
    title: 'Etkinlik 22: Robotların Siyasal Dünyası',
    type: 'yes-no',
    items: [
      { id: 'a22_1', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a22_2', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a22_3', text: 'Distopya kavramı, distopyaların özellikleri ve distopya türleri hakkında doğru bilgilere ulaştı.' },
      { id: 'a22_4', text: 'Rehber soruları cevap veren bir bakış açısı ortaya koydu.' },
      { id: 'a22_5', text: 'En az 250 kelimeden oluşan bir distopya yazdı.' },
      { id: 'a22_6', text: 'Yazdığı distopyada rehber sorulara cevap sunacak bir perspektif oluşturdu.' },
      { id: 'a22_7', text: 'Yaratıcı ve özgün bir distopya tasarladı.' },
      { id: 'a22_8', text: 'Yazdığı distopyada güvenilir ve tutarlı görüşler ortaya koydu.' },
      { id: 'a22_9', text: 'Yazdığı distopya metnini sınıf arkadaşlarına sundu.' },
      { id: 'a22_10', text: 'Arkadaşlarına sunumu sırasında açık ve anlaşılır bir anlatım kullandı.' },
    ],
  },
  {
    id: 'activity_23_gozetim',
    title: 'Etkinlik 23: Gözetim Toplumu',
    type: 'yes-no',
    items: [
      { id: 'a23_1', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okudu.' },
      { id: 'a23_2', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
      { id: 'a23_3', text: 'Yapılan tartışmaya aktif katılım sağladı.' },
      { id: 'a23_4', text: 'Tartışmada görüşlerini gerekçeleriyle sundu.' },
      { id: 'a23_5', text: 'Arkadaşlarını nezaketle dinledi.' },
      { id: 'a23_6', text: 'Kendisinden farklı düşüncelere saygı ile yaklaştı.' },
      { id: 'a23_7', text: 'Kendisine yapılan uyarı ve müdahaleleri dikkate aldı.' },
      { id: 'a23_8', text: 'Yansıtma yazısı yazdı.' },
      { id: 'a23_9', text: 'Yansıtma yazısını sınıf arkadaşlarıyla paylaştı.' },
    ],
  },
  {
    id: 'activity_24_nedensellik',
    title: 'Etkinlik 24: Evrendeki Nedensellik ve Mucize',
    type: 'yes-no',
    items: [
      { id: 'a24_1', text: 'Kavramları Anlama: Nedensellik, zorunluluk, rastlantısallık ve mucize kavramlarına birer örnek verdi.' },
      { id: 'a24_2', text: 'Kavramları Anlama: Verdiği örneklerin doğruluğunu değerlendirerek hatalarını düzeltti.' },
      { id: 'a24_3', text: 'Metin Analizi: “Çalışma Kâğıdı”ndaki filozof metinlerini dikkatlice okuyarak analiz etti.' },
      { id: 'a24_4', text: 'Metin Analizi: Anlamadığı terimleri belirleyip bu kavramların anlamlarını güvenilir kaynaklardan araştırdı.' },
      { id: 'a24_5', text: 'Metin Analizi: “Çalışma Kâğıdı”ndaki tabloyu eksiksiz ve doğru bir şekilde doldurdu.' },
      { id: 'a24_6', text: 'Metin Yazımı: En az 200 kelimelik bir metin yazdı.' },
      { id: 'a24_7', text: 'Metin Yazımı: Yazdığı metinde konunun ve kavramların tanıtımına yer verdi.' },
      { id: 'a24_8', text: 'Metin Yazımı: Yazdığı metinde Farabi ve Gazali’nin görüşlerini karşılaştırdı.' },
      { id: 'a24_9', text: 'Metin Yazımı: Yazdığı metinde filozofların fikirleri üzerine özgün değerlendirmeler yaptı.' },
      { id: 'a24_10', text: 'Metin Yazımı: Yazdığı metinde bilimsel ve akademik bir üslup kullandı.' },
      { id: 'a24_11', text: 'Metin Yazımı: Çalışmasını zamanında teslim etti.' },
      { id: 'a24_12', text: 'Genel Değerlendirme: Zaman yönetimini başarılı şekilde sağladı.' },
      { id: 'a24_13', text: 'Genel Değerlendirme: Çalışma boyunca yaratıcı ve özgün fikirler ortaya koydu.' },
    ]
  },
  {
    id: 'activity_25a_tanri_iyi_yansitma',
    title: 'Etkinlik 25: Tanrı-İyi İlişkisi (Yansıtma)',
    type: 'free-text',
    items: [
        { id: 'a25a_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a25a_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a25a_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_25b_tanri_iyi_degerlendirme',
    title: 'Etkinlik 25: Tanrı-İyi İlişkisi (Değerlendirme)',
    type: 'rubric',
    items: [
      { id: 'a25b_1', text: 'Etkinliğe Katılım' },
      { id: 'a25b_2', text: 'Metin Analizi (ek çalışma kağıdı)' },
      { id: 'a25b_3', text: 'Araştırma süreci' },
      { id: 'a25b_4', text: 'Araştırma raporu(içerik)' },
      { id: 'a25b_5', text: 'Araştırma raporu(yazım ve üslup)' },
      { id: 'a25b_6', text: 'Zaman yönetimi çalışma disiplini' },
    ],
    scale: [
      { value: 4, label: 'Mükemmel' },
      { value: 3, label: 'İyi' },
      { value: 2, label: 'Orta' },
      { value: 1, label: 'Yetersiz' },
    ],
    note: 'Her ölçüt için uygun puanı seçiniz. Toplam puan, öğrencinin genel performansını yansıtır.',
  },
  {
    id: 'activity_26a_ayna_metaforu_yansitma',
    title: 'Etkinlik 26: Ayna Metaforu/Tanrı-Âlem İlişkisi (Yansıtma)',
    type: 'free-text',
    items: [
        { id: 'a26a_1', prompt: '3 Yaz (Öğrendiğiniz üç önemli bilgiyi yazınız.)' },
        { id: 'a26a_2', prompt: '2 Sor (Cevabını merak ettiğiniz iki soru yazınız.)' },
        { id: 'a26a_3', prompt: '1 Paylaş (Öğrendiklerinizin önemi hakkında düşüncenizi yazarak paylaşınız.)' },
    ],
  },
  {
    id: 'activity_26b_ayna_metaforu_degerlendirme',
    title: 'Etkinlik 26: Ayna Metaforu/Tanrı-Âlem İlişkisi (Değerlendirme)',
    type: 'yes-no',
    items: [
      { id: 'a26b_1', text: 'Etkinlik sürecine aktif katılım sağladı.' },
      { id: 'a26b_2', text: 'Metni dikkatlice okuyarak analiz etti.' },
      { id: 'a26b_3', text: 'Ayna metaforunun anlamını kavradı.' },
      { id: 'a26b_4', text: 'Soruları mantıklı ve metne uygun şekilde cevapladı.' },
      { id: 'a26b_5', text: 'Tanrı-âlem ilişkisini ayna metaforu üzerinden değerlendirdi.' },
      { id: 'a26b_6', text: 'Tanrı-âlem ilişkisini yorumlayan en az 250 kelimelik bir metin yazdı.' },
      { id: 'a26b_7', text: 'Çalışma boyunca yaratıcı ve özgün fikirler ortaya koydu.' },
      { id: 'a26b_8', text: '“Çıkış Kartı”nı eksiksiz ve anlaşılır şekilde doldurdu.' },
    ],
  },
  {
    id: 'activity_27_hermeneutik',
    title: 'Etkinlik 27: Sosyal Bilimlerde Hermeneutik Yöntem',
    type: 'yes-no',
    items: [
      { id: 'a27_1', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okudu.' },
      { id: 'a27_2', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
      { id: 'a27_3', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a27_4', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a27_5', text: 'Konu ile ilgili yeterli bilgi topladı.' },
      { id: 'a27_6', text: 'Elde ettiği verileri kaydetti.' },
      { id: 'a27_7', text: 'Elde ettiği verileri kullanarak bir rapor hazırladı.' },
      { id: 'a27_8', text: 'Raporunu sınıfta sundu.' },
      { id: 'a27_9', text: 'Zamanı başarılı bir şekilde yönetti.' },
      { id: 'a27_10', text: 'Etkinlik sürecinde zorlandığı noktalarda öğretmeniyle iletişim kurdu.' },
    ],
  },
  {
    id: 'activity_28_determinizm',
    title: 'Etkinlik 28: Sosyal Bilimlerde Determinizm',
    type: 'yes-no',
    items: [
      { id: 'a28_1', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okudu.' },
      { id: 'a28_2', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
      { id: 'a28_3', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a28_4', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a28_5', text: 'Konu ile ilgili yeterli bilgi topladı.' },
      { id: 'a28_6', text: 'Elde ettiği verileri kaydetti.' },
      { id: 'a28_7', text: 'Elde ettiği verileri kullanarak bir afiş hazırladı.' },
      { id: 'a28_8', text: 'Hazırladığı afişi sınıfta sundu.' },
      { id: 'a28_9', text: 'Zamanı başarılı bir şekilde yönetti.' },
      { id: 'a28_10', text: 'Etkinlik sürecinde zorlandığı noktalarda öğretmeniyle iletişim kurdu.' },
    ],
  },
  {
    id: 'activity_29_bilim_olmayan',
    title: 'Etkinlik 29: Bilim ve Bilim Olmayan',
    type: 'yes-no',
    items: [
      { id: 'a29_1', text: '“Çalışma Kâğıdı”ndaki metni dikkatli bir şekilde okudu.' },
      { id: 'a29_2', text: '“Çalışma Kâğıdı”ndaki soruları doğru cevapladı.' },
      { id: 'a29_3', text: 'Güvenilir kaynaklar kullanarak araştırma yaptı.' },
      { id: 'a29_4', text: 'Araştırma yaparken akademik veri tabanlarından yararlandı.' },
      { id: 'a29_5', text: 'Konu ile ilgili yeterli bilgi topladı.' },
      { id: 'a29_6', text: 'Rudolf Carnap’ın “bilim ve bilim olmayan” görüşünü değerlendirdi.' },
      { id: 'a29_7', text: 'Yansıtma yazısını yazdı.' },
      { id: 'a29_8', text: 'Yansıtma yazısını sınıfla paylaştı.' },
      { id: 'a29_9', text: 'Zamanı başarılı bir şekilde yönetti.' },
      { id: 'a29_10', text: 'Etkinlik sürecinde zorlandığı noktalarda öğretmeniyle iletişim kurdu.' },
    ],
  },
];

// --- Data Hook ---
const STORAGE_KEY = 'philosophy_evaluation_data_v1';
const useEvaluationData = () => {
    const [allData, setAllData] = useState<AllEvaluationData>({});

    useEffect(() => {
        try {
            const item = localStorage.getItem(STORAGE_KEY);
            if (item) setAllData(JSON.parse(item));
        } catch (error) { console.error("Error loading evaluation data:", error); }
    }, []);

    const saveData = (newData: AllEvaluationData) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setAllData(newData);
        } catch (error) { console.error("Error saving evaluation data:", error); }
    };

    const updateStudentAnswer = useCallback((classroomId: string, formId: string, studentId: string, itemId: string, value: boolean | string | number | null) => {
        setAllData(prev => {
            const newData = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (!newData[classroomId]) newData[classroomId] = {};
            if (!newData[classroomId][formId]) newData[classroomId][formId] = {};
            if (!newData[classroomId][formId][studentId]) newData[classroomId][formId][studentId] = {};
            
            newData[classroomId][formId][studentId][itemId] = value;
            saveData(newData);
            return newData;
        });
    }, []);

    const getClassFormData = useCallback((classroomId: string, formId: string) => {
        return allData[classroomId]?.[formId] || {};
    }, [allData]);

    return { getClassFormData, updateStudentAnswer };
};

// --- Helper Components ---
const PrintLayout: React.FC<{ form: EvaluationForm, classData?: any, classroom?: Classroom, printMode: 'blank' | 'filled' }> = ({ form, classData, classroom, printMode }) => {
    const renderStudentForm = (studentData: EvaluationStudentData | null, studentName?: string) => (
        <div className="p-4 border border-gray-300 rounded-lg mb-4" style={{ pageBreakInside: 'avoid' }}>
            {studentName && <h3 className="text-lg font-bold mb-3">{studentName}</h3>}
            {form.type === 'yes-no' && (
                <table className="w-full text-sm border-collapse">
                    <tbody>
                        {(form as YesNoEvaluationForm).items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="py-2 pr-4">{item.text}</td>
                                <td className="py-2 text-center w-16">
                                    {printMode === 'filled' && studentData?.[item.id] === true ? 'Evet' : <span className="inline-block w-4 h-4 border border-gray-400"></span>}
                                </td>
                                <td className="py-2 text-center w-16">
                                    {printMode === 'filled' && studentData?.[item.id] === false ? 'Hayır' : <span className="inline-block w-4 h-4 border border-gray-400"></span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {form.type === 'multi-choice' && (
                <div className="space-y-4">
                    {(form as MultiChoiceEvaluationForm).sections.map(section => (
                        <div key={section.id}>
                            <h4 className="font-bold text-md mb-2">{section.title}</h4>
                            {section.questions.map(q => (
                                <div key={q.id} className="mb-3 pl-2">
                                    <p className="mb-1 text-sm">{q.question}</p>
                                    <div className="space-y-1">
                                        {q.options.map(opt => (
                                            <div key={opt} className="flex items-center">
                                                <span className="inline-block w-4 h-4 border border-gray-400 rounded-full mr-2">
                                                    {printMode === 'filled' && studentData?.[q.id] === opt ? <span className="block w-2 h-2 bg-black rounded-full m-0.5"></span> : ''}
                                                </span>
                                                <span>{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            {form.type === 'free-text' && (
                <div className="space-y-4">
                    {(form as FreeTextEvaluationForm).items.map(item => (
                        <div key={item.id}>
                            <h4 className="font-bold text-md mb-2">{item.prompt}</h4>
                            {printMode === 'filled' && studentData?.[item.id] ? (
                                <p className="text-sm border-l-2 pl-2 italic">{studentData[item.id]}</p>
                            ) : (
                                <div className="h-24 border-b border-gray-300"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {form.type === 'rubric' && (() => {
                const rubricForm = form as RubricEvaluationForm;
                const scores = studentData || {};
                const totalScore = rubricForm.items.reduce((sum, item) => sum + ((scores[item.id] as number) || 0), 0);
                const maxScore = rubricForm.items.length * Math.max(...rubricForm.scale.map(s => s.value));

                return (
                    <>
                        <table className="w-full text-sm border-collapse border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-3 text-left border">Ölçüt</th>
                                    {rubricForm.scale.map(opt => <th key={opt.value} className="py-2 px-3 text-center border">{opt.label} ({opt.value})</th>)}
                                    {printMode === 'filled' && <th className="py-2 px-3 text-center border">Puan</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {rubricForm.items.map(item => (
                                    <tr key={item.id} className="border">
                                        <td className="py-2 px-3 border">{item.text}</td>
                                        {rubricForm.scale.map(opt => (
                                            <td key={opt.value} className="py-2 px-3 text-center border">
                                                <span className="inline-block w-4 h-4 border border-gray-400 rounded-full">
                                                    {printMode === 'filled' && scores[item.id] === opt.value ? <span className="block w-2 h-2 bg-black rounded-full m-0.5"></span> : ''}
                                                </span>
                                            </td>
                                        ))}
                                        {printMode === 'filled' && <td className="py-2 px-3 text-center border font-bold">{scores[item.id] ?? '-'}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {printMode === 'filled' && (
                            <div className="text-right font-bold text-md mt-4">
                                Toplam Puan: {totalScore} / {maxScore}
                            </div>
                        )}
                    </>
                );
            })()}
            {form.note && <p className="text-xs italic mt-4">{form.note}</p>}
        </div>
    );
    
    if (printMode === 'blank') {
        return <>{renderStudentForm(null)}</>;
    }

    return <>{classroom?.students.map(s => renderStudentForm(classData?.[s.id], s.name))}</>;
};

// --- Main Component ---
interface Props {
  onBack: () => void;
}
const EvaluationForms: React.FC<Props> = ({ onBack }) => {
  const [selectedForm, setSelectedForm] = useState<EvaluationForm | null>(null);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [openStudents, setOpenStudents] = useState<Record<string, boolean>>({});
  const { classrooms } = useClassroomManager();
  const { getClassFormData, updateStudentAnswer } = useEvaluationData();
  const printRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePdfOrPrint = async (mode: 'blank' | 'filled', action: 'save' | 'print') => {
    const contentToPrint = printRef.current?.querySelector(`.print-mode-${mode}`);
    if (!contentToPrint || isProcessing) return;
    setIsProcessing(true);

    const container = document.createElement('div');
    container.className = "bg-white text-black p-8 font-sans";
    container.style.width = '210mm';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.zIndex = '-1';
    
    const titleEl = document.createElement('h2');
    titleEl.className = "text-xl font-bold mb-4";
    titleEl.innerText = selectedForm?.title || 'Değerlendirme Formu';
    container.appendChild(titleEl);

    if (selectedClass && mode === 'filled') {
        const classEl = document.createElement('h3');
        classEl.className = "text-lg mb-6";
        classEl.innerText = `Sınıf: ${selectedClass.name}`;
        container.appendChild(classEl);
    }

    container.appendChild(contentToPrint.cloneNode(true));
    document.body.appendChild(container);
    
    try {
        const canvas = await html2canvas(container, { scale: 2 });
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const margin = 40;
        const contentWidth = pdfWidth - margin * 2;
        const contentHeight = (canvas.height * contentWidth) / canvas.width;
        
        let heightLeft = contentHeight;
        let position = 0;
        pdf.addImage(canvas, 'PNG', margin, margin, contentWidth, contentHeight);
        heightLeft -= (pdf.internal.pageSize.getHeight() - 2 * margin);

        while (heightLeft > 0) {
            position -= (pdf.internal.pageSize.getHeight() - 2 * margin);
            pdf.addPage();
            pdf.addImage(canvas, 'PNG', margin, position + margin, contentWidth, contentHeight);
            heightLeft -= (pdf.internal.pageSize.getHeight() - 2 * margin);
        }

        if (action === 'save') {
            pdf.save(`${(selectedForm?.title || 'form').replace(/ /g, '_')}.pdf`);
        } else {
            pdf.autoPrint();
            window.open(pdf.output('bloburl'), '_blank');
        }
    } catch (error) {
        console.error("PDF generation failed:", error);
    } finally {
        document.body.removeChild(container);
        setIsProcessing(false);
    }
  };
  
  const studentData = selectedClass && selectedForm ? getClassFormData(selectedClass.id, selectedForm.id) : {};

  // -- RENDER LOGIC --

  if (!selectedForm) {
    return (
      <div className="w-full animate-fade-in">
        <div className="flex items-center mb-6">
            <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </Button>
            <h2 className="text-3xl font-bold">{Tool.EVALUATION_FORMS}</h2>
        </div>
        <p className="text-lg text-gray-400 text-center mb-8">Kullanmak istediğiniz etkinlik değerlendirme formunu seçin.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluationFormsData.map(form => (
            <Card key={form.id} onClick={() => setSelectedForm(form)} className="cursor-pointer flex flex-col items-center text-center p-8">
              <CheckBadgeIcon className="h-12 w-12 mb-4 text-purple-400"/>
              <h3 className="text-xl font-semibold mb-2 text-white">{form.title}</h3>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedClass) {
     return (
        <div className="w-full animate-fade-in">
             <div className="flex items-center mb-6">
                <Button onClick={() => setSelectedForm(null)} variant="secondary" className="!p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Button>
                <h2 className="text-2xl font-bold truncate">{selectedForm.title}</h2>
            </div>
            <Card>
                <div className="text-center p-8">
                    <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
                    <h3 className="text-2xl font-bold mb-2">Sınıf Seçin</h3>
                    <p className="text-gray-400 mb-6">Hangi sınıf için değerlendirme yapmak istiyorsunuz?</p>
                    {classrooms.length > 0 ? (
                        <select onChange={(e) => setSelectedClass(classrooms.find(c => c.id === e.target.value) || null)} defaultValue="" className="w-full max-w-xs mx-auto bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="" disabled>-- Sınıf Seç --</option>
                            {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    ) : <p className="text-amber-400">Önce "Sınıflarım" aracını kullanarak bir sınıf oluşturmalısınız.</p>}
                </div>
            </Card>
        </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="absolute -left-full top-0 -z-10">
        <div ref={printRef}>
            <div className="print-mode-blank"><PrintLayout form={selectedForm} printMode="blank" /></div>
            <div className="print-mode-filled"><PrintLayout form={selectedForm} classData={studentData} classroom={selectedClass} printMode="filled" /></div>
        </div>
      </div>
      <div className="flex items-center mb-6">
        <Button onClick={() => setSelectedClass(null)} variant="secondary" className="!p-2 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </Button>
        <div className="flex-grow min-w-0">
          <h2 className="text-2xl font-bold truncate">{selectedForm.title}</h2>
          <p className="text-sm text-indigo-400">{selectedClass.name}</p>
        </div>
        <div className="flex flex-wrap items-center space-x-2 ml-4">
          <Button onClick={() => generatePdfOrPrint('blank', 'save')} variant="secondary" disabled={isProcessing}>{isProcessing ? <Loader size="sm"/> : <DownloadIcon className="h-4 w-4 mr-2"/>}Boş Form (PDF)</Button>
          <Button onClick={() => generatePdfOrPrint('blank', 'print')} variant="secondary" disabled={isProcessing}>{isProcessing ? <Loader size="sm"/> : <PrinterIcon className="h-4 w-4 mr-2"/>}Boş Form</Button>
          <Button onClick={() => generatePdfOrPrint('filled', 'print')} variant="secondary" disabled={isProcessing}>{isProcessing ? <Loader size="sm"/> : <PrinterIcon className="h-4 w-4 mr-2"/>}Dolu Formlar</Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {selectedClass.students.map(student => (
          <Accordion 
            key={student.id} 
            title={student.name}
            isOpen={!!openStudents[student.id]}
            onToggle={() => setOpenStudents(prev => ({...prev, [student.id]: !prev[student.id]}))}>
            <div className="p-4">
                {selectedForm.type === 'yes-no' && (
                    <div className="space-y-3">
                        {(selectedForm as YesNoEvaluationForm).items.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">{item.text}</span>
                                <div className="flex space-x-2">
                                    <Button 
                                        onClick={() => updateStudentAnswer(selectedClass.id, selectedForm.id, student.id, item.id, true)} 
                                        variant={studentData[student.id]?.[item.id] === true ? 'primary' : 'secondary'}
                                        className="!py-1 !px-4 text-xs">Evet</Button>
                                    <Button 
                                        onClick={() => updateStudentAnswer(selectedClass.id, selectedForm.id, student.id, item.id, false)} 
                                        variant={studentData[student.id]?.[item.id] === false ? 'primary' : 'secondary'}
                                        className="!py-1 !px-4 text-xs !bg-rose-800/80 hover:!bg-rose-700/80">Hayır</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 {selectedForm.type === 'multi-choice' && (
                     <div className="space-y-6">
                        {(selectedForm as MultiChoiceEvaluationForm).sections.map(section => (
                            <div key={section.id}>
                                <h4 className="font-semibold text-md mb-3 text-indigo-300 border-b border-gray-700 pb-1">{section.title}</h4>
                                {section.questions.map(q => (
                                    <div key={q.id} className="mb-3">
                                        <p className="mb-2 text-sm text-gray-300">{q.question}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {q.options.map(opt => (
                                                <Button 
                                                    key={opt}
                                                    onClick={() => updateStudentAnswer(selectedClass.id, selectedForm.id, student.id, q.id, opt)}
                                                    variant={studentData[student.id]?.[q.id] === opt ? 'primary' : 'secondary'}
                                                    className="!py-1 !px-3 text-xs"
                                                >{opt}</Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                     </div>
                )}
                {selectedForm.type === 'free-text' && (
                    <div className="space-y-4">
                        {(selectedForm as FreeTextEvaluationForm).items.map(item => (
                            <div key={item.id}>
                                <label className="block text-sm font-semibold text-gray-300 mb-1">{item.prompt}</label>
                                <textarea
                                    value={(studentData[student.id]?.[item.id] as string) || ''}
                                    onChange={(e) => updateStudentAnswer(selectedClass.id, selectedForm.id, student.id, item.id, e.target.value)}
                                    rows={3}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                )}
                {selectedForm.type === 'rubric' && (() => {
                    const form = selectedForm as RubricEvaluationForm;
                    const studentScores = studentData[student.id] || {};
                    const totalScore = form.items.reduce((sum, item) => sum + ((studentScores[item.id] as number) || 0), 0);
                    const maxScore = form.items.length * Math.max(...form.scale.map(s => s.value));

                    return (
                        <div className="space-y-4">
                            {form.items.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <span className="text-sm text-gray-300 mb-2 sm:mb-0 flex-1">{item.text}</span>
                                    <div className="flex space-x-2 bg-gray-900/50 p-1 rounded-lg">
                                        {form.scale.map(opt => (
                                            <Button
                                                key={opt.value}
                                                onClick={() => updateStudentAnswer(selectedClass!.id, form.id, student.id, item.id, opt.value)}
                                                variant={studentScores[item.id] === opt.value ? 'primary' : 'secondary'}
                                                className="!py-1 !px-3 text-xs"
                                            >{opt.label} ({opt.value})</Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="text-right font-bold text-lg pt-4 mt-4 border-t border-gray-700">
                                Toplam Puan: <span className="text-indigo-400">{totalScore} / {maxScore}</span>
                            </div>
                        </div>
                    );
                })()}
                {selectedForm.note && <p className="text-xs italic text-gray-500 mt-4 pt-4 border-t border-gray-700">{selectedForm.note}</p>}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default EvaluationForms;