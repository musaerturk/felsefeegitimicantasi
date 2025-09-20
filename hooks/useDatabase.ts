import { useState, useCallback, useEffect } from 'react';
import { StoredFile, DatabaseKey, Grade } from '../types';

const STORAGE_KEY_PREFIX = 'philosophy_database_files_';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });

const OUTCOMES_11_CONTENT = `
11. Sınıf Felsefe Dersi Öğrenme Çıktıları:

Ünite 1: MÖ 6. yy - MS 2. yy Felsefesi
11.1.1. Felsefenin ortaya çıkışını hazırlayan düşünce ortamını açıklar.
11.1.2. MÖ 6. yüzyıl-MS 2. yüzyıl felsefesinin karakteristik özelliklerini açıklar.
11.1.3. Örnek felsefi metinlerden hareketle MÖ 6. yüzyıl-MS 2. yüzyıl filozoflarının felsefi görüşlerini analiz eder.
11.1.4. MÖ 6. yüzyıl-MS 2. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.

Ünite 2: MS 2. yy - MS 15. yy Felsefesi
11.2.1. MS 2. yüzyıl-MS 15. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.
11.2.2. MS 2. yüzyıl-MS 15. yüzyıl felsefesinin karakteristik özelliklerini açıklar.
11.2.3. Örnek felsefi metinlerden hareketle MS 2. yüzyıl-MS 15. yüzyıl filozoflarının felsefi görüşlerini analiz eder.
11.2.4. MS 2. yüzyıl-MS 15. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.

Ünite 3: 15. - 17. yy Felsefesi
11.3.1. 15. yüzyıl-17. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.
11.3.2. 15. yüzyıl-17. yüzyıl felsefesinin karakteristik özelliklerini açıklar.
11.3.3. Örnek felsefi metinlerden hareketle 15. yüzyıl-17. yüzyıl filozoflarının felsefi görüşlerini analiz eder.
11.3.4. 15. yüzyıl-17. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.

Ünite 4: 18. - 19. yy Felsefesi
11.4.1. 18. yüzyıl -19. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.
11.4.2. 18. yüzyıl -19. yüzyıl felsefesinin karakteristik özelliklerini açıklar.
11.4.3. Örnek felsefi metinlerinden hareketle 18. yüzyıl -19. yüzyıl filozoflarının felsefi görüşlerini analiz eder.
11.4.4. 18. yüzyıl -19. yüzyıl felsefesindeki örnek düşünce ve argümanları felsefi açıdan değerlendirir.

Ünite 5: 20. yy Felsefesi
11.5.1. 20. yüzyıl felsefesini hazırlayan düşünce ortamını açıklar.
11.5.2. 20. yüzyıl felsefesinin karakteristik özelliklerini açıklar.
11.5.3. Örnek felsefi metinlerden hareketle 20. yüzyıl filozoflarının felsefi görüşlerini analiz eder.
11.5.4. 20. yüzyıl felsefesi örnek düşünce ve argümanları felsefi açıdan değerlendirir.
11.5.5. Harita üzerinde 20 ve 21. yüzyıl felsefecilerinin yaşadıkları coğrafyayı gösterir
`;

const getInitialFiles = (grade: Grade): Record<string, StoredFile | null> => {
    if (grade === Grade.ELEVENTH) {
        return {
            [DatabaseKey.OUTCOMES]: {
                name: '11_sinif_kazanimlar.txt',
                content: btoa(unescape(encodeURIComponent(OUTCOMES_11_CONTENT))),
                mimeType: 'text/plain'
            }
        };
    }
    // Default to 10th grade which has more built-in files
    return {}; 
};


export const useDatabase = ({ grade }: { grade: Grade }) => {
  const [files, setFiles] = useState<Record<string, StoredFile | null>>({});
  const storageKey = `${STORAGE_KEY_PREFIX}${grade}`;

  useEffect(() => {
    try {
      const item = localStorage.getItem(storageKey);
      const initialFiles = getInitialFiles(grade);
      const savedFiles = item ? JSON.parse(item) : {};
      
      setFiles({ ...initialFiles, ...savedFiles });

    } catch (error) {
      console.error("Error loading database files from localStorage", error);
      setFiles(getInitialFiles(grade));
    }
  }, [storageKey, grade]);

  const saveData = (data: Record<string, StoredFile | null>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setFiles(data);
    } catch (error) {
      console.error("Error saving database files to localStorage", error);
    }
  };

  const uploadFile = useCallback(async (key: DatabaseKey, file: File) => {
    try {
      const content = await fileToBase64(file);
      const newFile: StoredFile = {
        name: file.name,
        content,
        mimeType: file.type,
      };
      setFiles(prev => {
        const updatedFiles = { ...prev, [key]: newFile };
        saveData(updatedFiles);
        return updatedFiles;
      });
    } catch (error) {
      console.error("Error uploading file", error);
    }
  }, [storageKey]);

  const deleteFile = useCallback((key: DatabaseKey) => {
    setFiles(prev => {
      const updatedFiles = { ...prev };
      delete updatedFiles[key];
      saveData(updatedFiles);
      return updatedFiles;
    });
  }, [storageKey]);

  return { files, uploadFile, deleteFile };
};