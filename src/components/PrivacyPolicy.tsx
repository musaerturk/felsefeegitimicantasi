import React from 'react';
import Button from './ui/Button.tsx';
import Card from './ui/Card.tsx';

interface Props {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onBack }) => {
    const lastUpdated = new Date().toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <div className="flex items-center mb-6">
                <Button onClick={onBack} variant="secondary" className="!p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </Button>
                <h1 className="text-3xl font-bold">Gizlilik Politikası</h1>
            </div>
            <Card>
                <div className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300 space-y-4">
                    <p className="text-xs text-gray-500">Son Güncelleme Tarihi: {lastUpdated}</p>

                    <h2 className="text-indigo-400">Giriş</h2>
                    <p>"Felsefe Eğitimi Çantası" ("Uygulama") olarak gizliliğinize büyük önem veriyoruz. Bu gizlilik politikası, Uygulamayı kullandığınızda hangi verilerin nasıl işlendiğini açıklamaktadır. Uygulamamız, verilerinizi sunucularımızda saklamak yerine doğrudan sizin cihazınızda tutma prensibiyle tasarlanmıştır.</p>
                    
                    <h2 className="text-indigo-400">1. Toplanan Veriler ve Kullanım Amaçları</h2>
                    <p>Uygulamamızın temel işleyişi, verileri <strong>yerel depolama (Local Storage)</strong> üzerinde, yani tamamen sizin kontrolünüzdeki tarayıcıda/cihazda saklamaya dayanır.</p>
                    <ul>
                        <li><strong>Yerel Olarak Saklanan Veriler:</strong> Sınıf listeleri, öğrenci isimleri, ajanda notları, sınav analiz verileri, soru bankaları ve oluşturduğunuz diğer tüm içerikler <strong>yalnızca sizin cihazınızda</strong> saklanır. Bu bilgilere tarafımızdan erişilemez ve bu veriler herhangi bir sunucuya gönderilmez. Bu verilerin güvenliği, kullandığınız cihazın güvenliğine bağlıdır.</li>
                        <li><strong>Yapay Zeka Özellikleri İçin İşlenen Veriler:</strong> "Ders Planlayıcı", "Sınav Oluşturucu", "Etkinlik Havuzu" gibi yapay zeka destekli araçları kullandığınızda, girdiğiniz istemler (örneğin, ders planı kriterleri, sınav kazanımları) ve yüklediğiniz dosyaların içeriği, yanıt oluşturulabilmesi amacıyla Google'ın <strong>Gemini API</strong> hizmetine gönderilir. Bu işlem sırasında verileriniz Google'ın gizlilik politikalarına tabi olarak işlenir.</li>
                    </ul>

                    <h2 className="text-indigo-400">2. Veri Paylaşımı</h2>
                    <p>Uygulamada yerel olarak saklanan verileriniz (öğrenci listeleri vb.) hiçbir üçüncü tarafla paylaşılmaz. Yalnızca yapay zeka özelliklerini kullanırken girdiğiniz veriler, yanıt oluşturulması için Google ile paylaşılır. Google'ın gizlilik politikasına <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">buradan</a> ulaşabilirsiniz.</p>
                    
                    <h2 className="text-indigo-400">3. Kullanıcının Sorumlulukları</h2>
                    <p>Uygulamaya girdiğiniz verilerden, özellikle öğrencilerle ilgili kişisel verilerden (isim vb.) siz sorumlusunuz. Bu tür verileri işlerken, kendi kurumunuzun ve ülkenizin veri koruma yönetmeliklerine (örneğin KVKK) uymanız önemlidir.</p>

                    <h2 className="text-indigo-400">4. Çerezler (Cookies)</h2>
                    <p>Uygulamamız, kullanıcıları takip etmek için çerezler (cookies) kullanmaz. Sadece uygulamanın işlevselliği için gerekli olan verileri saklamak amacıyla yerel depolama (Local Storage) teknolojisini kullanır.</p>

                    <h2 className="text-indigo-400">5. Bu Politikadaki Değişiklikler</h2>
                    <p>Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır. Politikayı düzenli olarak gözden geçirmenizi tavsiye ederiz.</p>
                    
                    <h2 className="text-indigo-400">6. İletişim</h2>
                    <p>Gizlilik politikamızla ilgili herhangi bir sorunuz olursa, lütfen bizimle iletişime geçin.</p>
                </div>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;