# Felsefe Eğitimi Çantası

Felsefe öğretmenleri için yapay zeka destekli, modern bir ders planlama, sınav hazırlama ve analiz aracı. Bu uygulama, Maarif Modeli'ne ve 11. Sınıf müfredatına uygun olarak Felsefe öğretmenlerinin ders materyallerini verimli bir şekilde yönetmelerine yardımcı olmak için tasarlanmıştır.

## ✨ Özellikler

- **Sınıf Seviyesi Seçimi:** 10. Sınıf (Maarif Modeli) ve 11. Sınıf için ayrı araç setleri.
- **Yapay Zeka Destekli Ders Planlayıcı:** Ünite, konu ve kazanımlara göre özelleştirilmiş ders planları oluşturun.
- **Sınav Oluşturucu & Analizi:** Kazanımlara yönelik sınavlar hazırlayın ve sonuçları detaylı grafiklerle analiz edin.
- **Soru Bankası:** PDF'lerden otomatik soru ayıklama ve kendi soru bankanızı yönetme.
- **Etkinlik Havuzu:** Yapay zeka ile dinamik etkinlikler oluşturun veya hazır etkinlikler arasından seçim yapın.
- **Değerlendirme Ölçekleri:** Ders içi performans ve etkinlikler için çeşitli değerlendirme formları.
- **Haftalık Ajanda:** Yıllık planınızı, tatil günlerini içeren interaktif bir haftalık ajanda üzerinde takip edin.
- **Sınıf Yönetimi:** Sınıf ve öğrenci listelerinizi kolayca oluşturun ve yönetin.
- **Çevrimdışı Destek:** PWA teknolojisi sayesinde çevrimdışı durumlarda bile temel erişim.

## 🚀 Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üstü)
- [npm](https://www.npmjs.com/) (Node.js ile birlikte gelir)

### Adımlar

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/felsefe-egitimi-cantasi.git
    cd felsefe-egitimi-cantasi
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Ortam Değişkenlerini Ayarlayın:**
    *   Proje kök dizininde `.env` adında bir dosya oluşturun.
    *   Google Gemini API anahtarınızı bu dosyaya ekleyin:
        ```
        API_KEY=BURAYA_API_ANAHTARINIZI_YAPISTIRIN
        ```
    *   API anahtarını [Google AI Studio](https://aistudio.google.com/app/apikey) üzerinden alabilirsiniz.

4.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
    Uygulama şimdi `http://localhost:5173` (veya terminalde belirtilen başka bir port) adresinde çalışıyor olacaktır.

## ☁️ Dağıtım (Deployment)

Uygulamanızı Netlify veya Vercel gibi bir platformda dağıtırken:

1. Projenizi bir GitHub deposuna yükleyin.
2. Platformda yeni bir site oluşturun ve GitHub deponuzu bağlayın.
3. Build ayarlarını aşağıdaki gibi yapılandırın:
    - **Build command:** `npm run build`
    - **Publish directory:** `dist`
4. Ortam değişkenlerini ekleyin:
    - **Key:** `API_KEY`
    - **Value:** Google Gemini API anahtarınız
5. "Deploy site" butonuna tıklayın.

## 🛠️ Derleme (Build)

Uygulamanın üretim için optimize edilmiş sürümünü oluşturmak için:

```bash
npm run build
```

Bu komut, statik dosyaları içeren bir `dist` klasörü oluşturacaktır. Bu klasörü herhangi bir statik site barındırma hizmetine yükleyebilirsiniz.

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
