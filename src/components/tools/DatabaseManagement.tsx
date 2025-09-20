import React, { useRef, useState } from 'react';
import { Tool, DatabaseKey, Grade } from '../../types';
import ToolViewWrapper from './ToolViewWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Accordion from '../ui/Accordion';
import { useDatabase } from '../../hooks/useDatabase';

interface Props {
  grade: Grade;
  onBack: () => void;
}

// FIX: Moved Node type outside the component to be used for databaseStructure, and to fix the type inference issue.
type Node = {
    id?: string;
    title: string;
    type?: 'item';
    key?: DatabaseKey;
    children?: Node[];
};

const databaseStructure: Node[] = [
  {
    id: '1. Öğrenme Çıktısı Çerçevesi',
    title: '1. Öğrenme Çıktısı Çerçevesi',
    children: [
      {
        id: 'Kavramsal Beceriler',
        title: 'Kavramsal Beceriler',
        children: [
          { type: 'item', key: DatabaseKey.KB1_TEMEL_BECERILER, title: 'Temel Beceriler KB1' },
          { type: 'item', key: DatabaseKey.KB2_BUTUNLESIK_BECERILER, title: 'Bütünleşik Beceriler KB2' },
          { type: 'item', key: DatabaseKey.KB3_UST_DUZEY_DUSUNME, title: 'Üst Düzey Düşünme Becerileri KB3' },
        ],
      },
      { type: 'item', key: DatabaseKey.FIZIKSEL_BECERILER, title: 'Fiziksel Beceriler' },
      {
        id: 'Eğilimler',
        title: 'Eğilimler',
        children: [
          { type: 'item', key: DatabaseKey.EGILIMLER_BENLIK, title: 'E1 Benlik Eğilimleri' },
          { type: 'item', key: DatabaseKey.EGILIMLER_SOSYAL, title: 'E2 Sosyal Eğilimleri' },
          { type: 'item', key: DatabaseKey.EGILIMLER_ENTELEKTUEL, title: 'E3 Entelektüel Eğilimleri' },
        ],
      },
      {
        id: 'Alan Becerileri',
        title: 'Alan Becerileri',
        children: [
          { type: 'item', key: DatabaseKey.ALAN_MATEMATIK, title: 'Matematik Alan Becerileri (MAB)' },
          { type: 'item', key: DatabaseKey.ALAN_FEN, title: 'Fen Bilimleri Alan Becerileri (FBAB)' },
          { type: 'item', key: DatabaseKey.ALAN_SOSYAL, title: 'Sosyal Bilimler Alan Becerileri (SBAB)' },
          { type: 'item', key: DatabaseKey.ALAN_SANAT, title: 'Sanat Alan Becerileri (SAB)' },
          { type: 'item', key: DatabaseKey.ALAN_SPOR, title: 'Beden Eğitimi, Oyun ve Spor Alan Becerileri (BEOSAB)' },
          { type: 'item', key: DatabaseKey.ALAN_BILISIM, title: 'Bilişim Teknolojileri ve Yazılım Alan Becerileri (BTYAB)' },
          { type: 'item', key: DatabaseKey.ALAN_TASARIM, title: 'Tasarım Alan Becerileri (TSRMAB)' },
          { type: 'item', key: DatabaseKey.ALAN_DIN, title: 'Din Eğitimi ve Öğretimi Alan Becerileri (DAB)' },
          { type: 'item', key: DatabaseKey.ALAN_YABANCI_DIL, title: 'Yabancı Dil Alan Becerileri (YDAB)' },
        ],
      },
    ],
  },
  {
    id: '2. Programlar Arası Bileşenler',
    title: '2. Programlar Arası Bileşenler',
    children: [
      {
        id: 'Sosyal-Duygusal Öğrenme Becerileri',
        title: 'Sosyal-Duygusal Öğrenme Becerileri',
        children: [
          {
            id: 'Benlik Becerileri SDB1',
            title: 'Benlik Becerileri SDB1',
            children: [
              { type: 'item', key: DatabaseKey.SDB_BENLIK_TANIMA, title: 'SDB1.1. Kendini Tanıma (Öz Farkındalık Becerisi)' },
              { type: 'item', key: DatabaseKey.SDB_BENLIK_DUZENLEME, title: 'SDB1.2. Kendini Düzenleme (Öz Düzenleme Becerisi)' },
              { type: 'item', key: DatabaseKey.SDB_BENLIK_UYARLAMA, title: 'SDB1.3. Kendine Uyarlama (Öz Yansıtma Becerisi)' },
            ],
          },
          {
            id: 'Sosyal Yaşam Becerileri SDB2',
            title: 'Sosyal Yaşam Becerileri SDB2',
            children: [
              { type: 'item', key: DatabaseKey.SDB_SOSYAL_ILETISIM, title: 'SDB2.1. İletişim Becerisi' },
              { type: 'item', key: DatabaseKey.SDB_SOSYAL_ISBIRLIGI, title: 'SDB2.2. İş Birliği Becerisi' },
              { type: 'item', key: DatabaseKey.SDB_SOSYAL_FARKINDALIK, title: 'SDB2.3. Sosyal Farkındalık Becerisi' },
            ],
          },
          {
            id: 'Ortak/Birleşik Beceriler SDB3',
            title: 'Ortak/Birleşik Beceriler SDB3',
            children: [
              { type: 'item', key: DatabaseKey.SDB_ORTAK_UYUM, title: 'SDB3.1. Uyum Becerisi' },
              { type: 'item', key: DatabaseKey.SDB_ORTAK_ESNEKLIK, title: 'SDB3.2. Esneklik Becerisi' },
              { type: 'item', key: DatabaseKey.SDB_ORTAK_KARAR_VERME, title: 'SDB3.3. Sorumlu Karar Verme Becerisi' },
            ],
          },
        ],
      },
      {
        id: 'Erdem-Değer-Eylem Çerçevesi',
        title: 'Erdem-Değer-Eylem Çerçevesi',
        children: [
            { type: 'item', key: DatabaseKey.BILESENLER_ERDEM_DEGER_EYLEM, title: 'Erdem-Değer-Eylem Çerçevesi' },
        ]
      },
      {
        id: 'Okuryazarlık Becerileri',
        title: 'Okuryazarlık Becerileri',
        children: [
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_BILGI, title: 'OB1. Bilgi Okuryazarlığı' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_DIJITAL, title: 'OB2. Dijital Okuryazarlık' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_FINANSAL, title: 'OB3. Finansal Okuryazarlık' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_GORSEL, title: 'OB4. Görsel Okuryazarlık' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_KULTUR, title: 'OB5. Kültür Okuryazarlığı' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_VATANDASLIK, title: 'OB6. Vatandaşlık Okuryazarlığı' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_VERI, title: 'OB7. Veri Okuryazarlığı' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_SURDURULEBILIRLIK, title: 'OB8. Sürdürülebilirlik Okuryazarlığı' },
          { type: 'item', key: DatabaseKey.OKURYAZARLIK_SANAT, title: 'OB9. Sanat Okuryazarlığı' },
        ],
      },
    ],
  },
  {
    id: '3. Öğrenme Çıktıları',
    title: '3. Öğrenme Çıktıları',
    children: [
      { type: 'item', key: DatabaseKey.OUTCOMES, title: 'Öğrenme Çıktıları' },
    ],
  },
];


const DatabaseManagement: React.FC<Props> = ({ grade, onBack }) => {
    const { files, uploadFile, deleteFile } = useDatabase({ grade });
    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const toggleAccordion = (id: string) => {
        setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleFileChange = (key: DatabaseKey, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(key, e.target.files[0]);
        }
    };

    const handleUploadClick = (key: string) => {
        fileInputRefs.current[key]?.click();
    };
    
    const isVirtual = (key: DatabaseKey) => {
        if (key === DatabaseKey.OUTCOMES && grade === Grade.TENTH) return true;
        const virtualKeys: DatabaseKey[] = [
            DatabaseKey.KB1_TEMEL_BECERILER,
            DatabaseKey.KB2_BUTUNLESIK_BECERILER,
            DatabaseKey.KB3_UST_DUZEY_DUSUNME,
            DatabaseKey.EGILIMLER_BENLIK,
            DatabaseKey.EGILIMLER_SOSYAL,
            DatabaseKey.EGILIMLER_ENTELEKTUEL,
            DatabaseKey.SDB_BENLIK_TANIMA,
            DatabaseKey.SDB_BENLIK_DUZENLEME,
            DatabaseKey.SDB_BENLIK_UYARLAMA,
            DatabaseKey.SDB_SOSYAL_ILETISIM,
            DatabaseKey.SDB_SOSYAL_ISBIRLIGI,
            DatabaseKey.SDB_SOSYAL_FARKINDALIK,
            DatabaseKey.SDB_ORTAK_UYUM,
            DatabaseKey.SDB_ORTAK_ESNEKLIK,
            DatabaseKey.SDB_ORTAK_KARAR_VERME,
            DatabaseKey.BILESENLER_ERDEM_DEGER_EYLEM,
            DatabaseKey.OKURYAZARLIK_BILGI,
            DatabaseKey.OKURYAZARLIK_DIJITAL,
            DatabaseKey.OKURYAZARLIK_FINANSAL,
            DatabaseKey.OKURYAZARLIK_GORSEL,
            DatabaseKey.OKURYAZARLIK_KULTUR,
            DatabaseKey.OKURYAZARLIK_VATANDASLIK,
            DatabaseKey.OKURYAZARLIK_VERI,
            DatabaseKey.OKURYAZARLIK_SURDURULEBILIRLIK,
            DatabaseKey.OKURYAZARLIK_SANAT,
        ];
        return virtualKeys.includes(key);
    };

    const renderNode = (node: Node, isSub: boolean = false): JSX.Element => {
        if (node.type === 'item' && node.key) {
            const file = files[node.key];
            const key = node.key;
            const virtual = isVirtual(key);
            return (
                <div key={key} className="p-3 bg-gray-800/50 rounded-md border border-gray-700/50 mb-2">
                    <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-200 truncate">{node.title}</p>
                            {file ? (
                                <p className="text-xs text-green-400 truncate">{file.name}</p>
                            ) : (
                                <p className="text-xs text-amber-400">Dosya Yüklenmedi</p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                             {virtual ? (
                                <span className="text-xs text-gray-500 italic">Yerleşik</span>
                             ) : (
                                <>
                                    <input
                                        type="file"
                                        accept=".pdf,.txt,.md"
                                        ref={el => {fileInputRefs.current[key] = el;}}
                                        onChange={(e) => handleFileChange(key, e)}
                                        className="hidden"
                                    />
                                    <Button onClick={() => handleUploadClick(key)} variant="secondary" className="!py-1 !px-2 text-xs">
                                        {file ? 'Değiştir' : 'Yükle'}
                                    </Button>
                                    {file && (
                                        <Button onClick={() => deleteFile(key)} variant="secondary" className="!py-1 !px-2 text-xs bg-rose-800/50 hover:bg-rose-700/50">
                                            Sil
                                        </Button>
                                    )}
                                </>
                             )}
                        </div>
                    </div>
                </div>
            );
        }

        if (node.children) {
            const id = node.id || node.title;
            return (
                <Accordion
                    key={id}
                    title={node.title}
                    isOpen={!!openAccordions[id]}
                    onToggle={() => toggleAccordion(id)}
                    isSubAccordion={isSub}
                >
                    <div className="space-y-2">
                        {node.children.map(child => renderNode(child, true))}
                    </div>
                </Accordion>
            );
        }

        return <div key={node.title}>{node.title}</div>;
    };

    return (
        <ToolViewWrapper toolName={Tool.DATABASE_MANAGEMENT} onBack={onBack} isLoading={false} result="">
            <p className="text-gray-400 mb-4 text-sm">
                Buradan yapay zekanın kullanacağı referans dokümanları (veri tabanını) yönetebilirsiniz.
                Yerleşik olarak sunulan temel dokümanlar değiştirilemez. Diğer alanlara kendi PDF, TXT veya MD dosyalarınızı yükleyebilirsiniz.
                Yüklediğiniz dosyalar, ilgili araçlarda kaynak olarak kullanılacaktır.
            </p>
            <div className="space-y-4">
                {databaseStructure.map(node => renderNode(node))}
            </div>
        </ToolViewWrapper>
    );
};

export default DatabaseManagement;