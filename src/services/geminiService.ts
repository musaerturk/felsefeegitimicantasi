

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { StoredFile, UnitData, Question, Activity, ActivityCategory } from '../types';
import { activityPoolData } from "../data/activityPoolData";

// FIX: Switched to process.env.API_KEY to align with the provided guidelines for Gemini API usage. This resolves the TypeScript error with `import.meta.env` and ensures compliance.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // FIX: Updated error message to be more generic and compliant with guidelines, which state not to instruct users on how to set the API key.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateMultipartContent = async (prompt: string, files: StoredFile[]): Promise<string> => {
    try {
        const fileParts = files.map(file => ({
            inlineData: {
                data: file.content,
                mimeType: file.mimeType,
            },
        }));

        const contents = {
            parts: [{ text: prompt }, ...fileParts]
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        if (error instanceof Error) {
            return `API isteği başarısız oldu: ${error.message}`;
        }
        return "API isteği sırasında bilinmeyen bir hata oluştu.";
    }
};


const generateSimpleContent = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        if (error instanceof Error) {
            return `API isteği başarısız oldu: ${error.message}`;
        }
        return "API isteği sırasında bilinmeyen bir hata oluştu.";
    }
};

export const generateEvaluationForm = async (formType: string, topic: string, criteria: string, scale: string): Promise<string> => {
    const criteriaPrompt = criteria ? `\n\nFormda özellikle şu kriterlere odaklan:\n- ${criteria.split('\n').join('\n- ')}` : '';

    const prompt = `
Bir felsefe öğretmeni için bir "${formType}" formu oluştur.

**Formun Amacı:**
- Konu: "${topic}"
- Değerlendirme Ölçeği: "${scale}"
${criteriaPrompt}

**İstenen Çıktı:**
Doğrudan bir öğretmenin kullanabileceği, net ve yapılandırılmış bir değerlendirme formu metni oluştur. Form, başlıkları, maddeleri ve puanlama/değerlendirme bölümlerini içermelidir. Markdown formatında, başlıklar için '**' kullanarak, maddeler için ise liste formatında bir çıktı ver.
`;
    return generateSimpleContent(prompt);
};

export const generateActivity = async ({ unitName, topic, outcome, activityType }: {
    unitName: string;
    topic: string;
    outcome: string;
    activityType: ActivityCategory;
}): Promise<Activity | null> => {
    const prompt = `
    Bir 11. sınıf felsefe öğretmeni için Maarif Modeli'ne uygun, yaratıcı ve ilgi çekici bir ders etkinliği oluştur.

    **Etkinliğin Bağlamı:**
    - **Ünite:** ${unitName}
    - **Konu:** ${topic}
    - **Kazanım:** ${outcome}
    - **İstenen Etkinlik Türü:** ${activityType}

    **İstenen Çıktı (JSON Formatında):**
    Lütfen aşağıdaki yapıya tam olarak uyan bir JSON nesnesi oluştur. Bu yapı, bir öğretmenin etkinliği doğrudan uygulayabilmesi için gerekli tüm detayları içermelidir.

    - **title (string):** Etkinlik için ilgi çekici bir başlık.
    - **category (string):** Etkinlik türü. Bu değer "${activityType}" olmalı.
    - **description (string):** Etkinliğin amacını ve ne hakkında olduğunu açıklayan kısa bir paragraf.
    - **duration (string):** Etkinliğin tahmini süresi (örn: "40-45 dakika").
    - **learningOutcomes (array of strings):** Ana kazanıma ek olarak, bu etkinliğin desteklediği alt becerileri veya hedefleri listeleyin. Ana kazanım da bu listede olabilir.
    - **materials (array of strings):** Etkinlik için gerekli olan tüm materyallerin listesi. Materyal gerekmiyorsa boş bir dizi döndür.
    - **steps (array of strings):** Etkinliğin uygulanma adımlarını detaylı bir şekilde, bir öğretmenin takip edebileceği netlikte listele. Adımları "1. Adım: Hazırlık", "2. Adım: Uygulama" gibi alt başlıklarla yapılandır.
    - **note (string, optional):** Öğretmene yönelik ek ipuçları, notlar veya dikkat edilmesi gerekenler.
    - **evaluation (string, optional):** Bu etkinliğin nasıl değerlendirilebileceğine dair öneriler (örn: "Değerlendirme Formları aracındaki 'X' formu kullanılabilir." veya "Öğrenci yanıtları rubrik ile değerlendirilebilir.").
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        learningOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        materials: { type: Type.ARRAY, items: { type: Type.STRING } },
                        steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                        note: { type: Type.STRING },
                        evaluation: { type: Type.STRING },
                    },
                    required: ["title", "category", "description", "duration", "learningOutcomes", "materials", "steps"],
                },
            },
        });

        const jsonString = response.text;
        const parsedJson = JSON.parse(jsonString);

        if (typeof parsedJson === 'object' && parsedJson !== null && 'title' in parsedJson && 'steps' in parsedJson) {
            return { ...parsedJson, id: `ai_${crypto.randomUUID()}` } as Activity;
        }
        return null;

    } catch (error) {
        console.error("Error generating activity:", error);
        return null;
    }
};

export const generateLessonPlan = (grade: number, planData: UnitData, dbFiles: StoredFile[]) => {
    const fileReferencePrompt = dbFiles.length > 0
        ? `Ayrıca, ekteki referans dokümanlarını ('${dbFiles.map(f => f.name).join("', '")}') ana kaynak olarak kullanabilirsin.`
        : '';

    const activityInspirationCategories = [...new Set(activityPoolData.map(a => a.category))];
    const activityInspirationPrompt = `Bu adımları oluştururken, bir felsefe öğretmeninin kullanabileceği pratik ve ilgi çekici yöntemler öner. Örneğin, Etkinlik Havuzumuzda bulunan '${activityInspirationCategories.join("', '")}' gibi çeşitli etkinlik türlerinden ilham alabilirsin.`;

    const prompt = `
Bir 10. sınıf felsefe öğretmeni için Maarif Modeli'ne uygun bir ders planı hazırlıyorsun. Senin görevin, aşağıda tüm detayları verilen ders planı iskeletini kullanarak, sadece "Öğretme-Öğrenme Uygulamaları" bölümünü doldurmak.

**Ders Planının Ana Hatları (Bağlam):**
- **Ünite Adı:** ${planData.unitName}
- **Alan Becerileri:** ${planData.fieldSkills.join(', ') || 'Belirtilmemiş'}
- **Kavramsal Beceriler:** ${planData.conceptualSkills.join(', ') || 'Belirtilmemiş'}
- **Eğilimler:** ${planData.tendencies.join(', ') || 'Belirtilmemiş'}
- **Sosyal-Duygusal Öğrenme Becerileri:** ${planData.socialEmotionalSkills.join(', ') || 'Belirtilmemiş'}
- **Değerler:** ${planData.values.join(', ') || 'Belirtilmemiş'}
- **Okuryazarlık Becerileri:** ${planData.literacySkills.join(', ') || 'Belirtilmemiş'}
- **Öğrenme Çıktıları (Süreç Bileşenleri):** ${planData.learningOutcomes.join(', ') || 'Belirtilmemiş'}
- **İçerik Çerçevesi:** ${planData.contentFramework || 'Belirtilmemiş'}
- **Anahtar Kavramlar:** ${planData.keyConcepts || 'Belirtilmemiş'}
- **Ön Bilgiler (Temel Kabuller):** ${planData.basicAssumptions || 'Belirtilmemiş'}
- **Köprü Kurma:** ${planData.bridging || 'Belirtilmemiş'}

**İstenen Çıktı:**
Yukarıdaki zengin bağlamı dikkate alarak, bu ünitenin hedeflerine ulaşmasını sağlayacak yaratıcı, etkileşimli ve detaylı bir "Öğretme-Öğrenme Uygulamaları" bölümü yaz. Bu bölüm, bir öğretmenin dersi işlerken adım adım takip edebileceği pratik aktiviteler, tartışma soruları, grup çalışmaları gibi somut yaşantılar içermelidir.

**Çıktı Formatı (Bu Başlıkları Kullanarak Detaylandır):**
**Giriş:**
(Derse nasıl başlanacağını, öğrencilerin dikkatinin nasıl çekileceğini ve konuya nasıl motive edileceklerini anlatan 1-2 adımlık bir bölüm.)

**Geliştirme:**
(Konunun nasıl işleneceğini, hangi etkinliklerin, tartışmaların, soru-cevapların veya grup çalışmalarının yapılacağını, hangi materyallerin kullanılacağını detaylandıran 3-5 adımlık bir bölüm. Burası en detaylı kısım olmalı.)

**Sonuç:**
(Dersin nasıl özetleneceği, konunun nasıl pekiştirileceği ve öğrenmelerin nasıl hızlıca değerlendirileceği ile ilgili 1-2 adımlık bir bölüm.)

${activityInspirationPrompt}
${fileReferencePrompt}
`;
    
    return dbFiles.length > 0 ? generateMultipartContent(prompt, dbFiles) : generateSimpleContent(prompt);
};


export const generateLessonPlanGrade11 = async (
    { grade, unit, subTopic, methods, fullOutcomes, dbFiles }: 
    { grade: number; unit: UnitData; subTopic: string; methods: string; fullOutcomes: string[], dbFiles: StoredFile[] }
): Promise<{ process: string; evaluation: string; } | null> => {

    const fileReferencePrompt = dbFiles.length > 0
        ? `Ayrıca, ekteki referans dokümanlarını ('${dbFiles.map(f => f.name).join("', '")}') ana kaynak olarak kullan.`
        : '';
    
    const prompt = `
Bir 11. sınıf felsefe öğretmeni için detaylı bir ders planı içeriği oluştur. Planın odak noktası "ÖĞRENME ÖĞRETME SÜRECİ" ve "ÖLÇME DEĞERLENDİRME" bölümleri olacak.

**Dersin Bağlamı:**
- **Ünite:** ${unit.unitName}
- **Alt Konu (Öğrenme Alanı):** ${subTopic}
- **Kazanımlar:**
${fullOutcomes.map(o => `- ${o}`).join('\n')}
- **Planlanan Öğretim Yöntemleri:** ${methods}

**İstenen Çıktı:**
Yukarıdaki bağlamı dikkate alarak, aşağıdaki iki bölüm için içerik oluştur. İçerik, bir öğretmenin dersi etkili bir şekilde işlemesini ve öğrencilerin öğrenmesini değerlendirmesini sağlayacak pratik, somut ve yaratıcı adımlar içermelidir. ${fileReferencePrompt}

Çıktıyı, 'process' ve 'evaluation' anahtarlarına sahip bir JSON nesnesi olarak formatla.

- **process:** Bu bölümde "ÖĞRENME ÖĞRETME SÜRECİ"ni detaylandır. Giriş (dikkat çekme, motive etme), Geliştirme (konu işlenişi, etkinlikler, tartışmalar) ve Sonuç (özet, pekiştirme) adımlarını açıkça belirt.
- **evaluation:** Bu bölümde "ÖLÇME DEĞERLENDİRME" kısmını detaylandır. Ders içinde ve sonunda öğrencilerin kazanımlara ulaşıp ulaşmadığını anlamak için kullanılabilecek çeşitli ölçme araçları ve yöntemleri (soru-cevap, kısa sınav, gözlem formu, proje vb.) öner.
`;

    try {
        const fileParts = dbFiles.map(file => ({
            inlineData: {
                data: file.content,
                mimeType: file.mimeType,
            },
        }));

        const contents = {
            parts: [{ text: prompt }, ...fileParts]
        };
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: dbFiles.length > 0 ? contents : prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        process: { type: Type.STRING, description: "Öğrenme-öğretme sürecinin detaylı adımları." },
                        evaluation: { type: Type.STRING, description: "Ölçme ve değerlendirme yöntemleri ve araçları." },
                    },
                    required: ["process", "evaluation"],
                },
            },
        });

        const jsonString = response.text;
        const parsedJson = JSON.parse(jsonString);

        if (typeof parsedJson === 'object' && parsedJson !== null && 'process' in parsedJson && 'evaluation' in parsedJson) {
            return parsedJson as { process: string; evaluation: string; };
        }
        return null;

    } catch (error) {
        console.error("Error generating 11th grade lesson plan:", error);
        return null;
    }
};

export const generateExam = async (grade: number, outcomes: string[], count: number, type: string, dbFiles: StoredFile[]): Promise<Question[] | null> => {
     const fileReferencePrompt = dbFiles.length > 0
        ? `Ekteki referans dokümanlarını ('${dbFiles.map(f => f.name).join("', '")}') ana kaynak olarak kullanarak, `
        : '';
    
    const outcomeLabels = outcomes.join('\n- ');
    const prompt = `${fileReferencePrompt}${grade}. sınıf felsefe dersi için, aşağıdaki öğrenme çıktılarını kapsayan bir sınav hazırla:\n\n**Öğrenme Çıktıları:**\n- ${outcomeLabels}\n\n**Sınav İçeriği:**\n- Toplam ${count} adet "${type}" tipinde soru.\n\nÇıktıyı, her bir nesnenin 'question' (soru metni) ve 'answer' (cevap metni) anahtarlarına sahip olduğu bir JSON nesneleri dizisi olarak formatla. Eğer hiç soru üretemezsen, boş bir dizi döndür.`;
    
    try {
        const fileParts = dbFiles.map(file => ({
            inlineData: {
                data: file.content,
                mimeType: file.mimeType,
            },
        }));

        const contents = {
            parts: [{ text: prompt }, ...fileParts]
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: dbFiles.length > 0 ? contents : prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING },
                        },
                        required: ["question", "answer"],
                    },
                },
            },
        });
        
        const jsonString = response.text;
        const parsedJson = JSON.parse(jsonString);

        if (Array.isArray(parsedJson)) {
            return parsedJson.filter(
                (item): item is Question => 
                    typeof item === 'object' &&
                    item !== null &&
                    'question' in item &&
                    'answer' in item
            );
        }
        return null;

    } catch (error) {
        console.error("Error generating exam:", error);
        return null;
    }
};

export const extractQuestionsFromPdf = async (file: StoredFile): Promise<Question[] | null> => {
    const prompt = "Sağlanan PDF belgesini analiz et. Belgedeki tüm soru ve cevap çiftlerini ayıkla. Sayfa numaraları, başlıklar, altbilgiler ve konuyla ilgisiz metinleri yoksay. Çıktıyı, her bir nesnenin 'question' (soru metni) ve 'answer' (cevap metni) anahtarlarına sahip olduğu bir JSON nesneleri dizisi olarak formatla. Eğer hiç soru bulamazsan, boş bir dizi döndür.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            data: file.content,
                            mimeType: file.mimeType,
                        },
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING },
                        },
                        required: ["question", "answer"],
                    },
                },
            },
        });
        
        // The response text is already a JSON string because of the responseMimeType
        const jsonString = response.text;
        const parsedJson = JSON.parse(jsonString);

        // Basic validation
        if (Array.isArray(parsedJson)) {
            return parsedJson.filter(
                (item): item is Question => 
                    typeof item === 'object' &&
                    item !== null &&
                    'question' in item &&
                    'answer' in item
            );
        }
        return null;

    } catch (error) {
        console.error("Error extracting questions from PDF:", error);
        return null;
    }
};
