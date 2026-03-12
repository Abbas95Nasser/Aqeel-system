import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, Image as ImageIcon, X, Loader2, Crop, Check, RotateCcw, Eye, Maximize2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { storageService } from '../services/storageService';

// Full Image Modal Component
const FullImageModal = ({ isOpen, image, onClose, label }: { isOpen: boolean; image: string | null; onClose: () => void; label: string }) => {
  if (!isOpen || !image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl no-print"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors flex items-center gap-2 font-bold"
          >
            <X className="w-6 h-6" />
            <span>إغلاق</span>
          </button>

          <div className="bg-white/5 p-2 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <img
              src={image}
              alt={label}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-white text-xl font-black tracking-widest uppercase">{label}</h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

interface CustomIDCardProps {
  custom: { id: string; title: string };
  index: number;
  memberId: string;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
  updateTitle: (id: string, title: string) => void;
  removeCustomId: (id: string, e: React.MouseEvent) => void;
}

const CustomIDCard: React.FC<CustomIDCardProps> = ({
  custom,
  index,
  memberId,
  showToast,
  updateTitle,
  removeCustomId
}) => {
  const [imageIds, setImageIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`memberForm_${memberId}_custom_${custom.id}_images`);
    if (saved) {
      try {
        setImageIds(JSON.parse(saved));
      } catch (e) {
        setImageIds(['front', 'back']);
      }
    } else {
      setImageIds(['front', 'back']); // Default
    }
  }, [custom.id, memberId]);

  const addImage = () => {
    const newId = Date.now().toString();
    const newList = [...imageIds, newId];
    setImageIds(newList);
    localStorage.setItem(`memberForm_${memberId}_custom_${custom.id}_images`, JSON.stringify(newList));
    if (showToast) showToast('تم إضافة حقل صورة جديد', 'success');
  };

  const removeImage = (imgId: string) => {
    const newList = imageIds.filter(id => id !== imgId);
    setImageIds(newList);
    localStorage.setItem(`memberForm_${memberId}_custom_${custom.id}_images`, JSON.stringify(newList));
  };

  return (
    <div className="print-page-break border border-blue-100 p-6 rounded-2xl bg-blue-50/20 relative group/card transition-all hover:border-blue-300 hover:bg-blue-50/40 print:border-black print:bg-transparent print:p-0 print:border-none lg:col-span-2">
      <div className="flex justify-between items-start mb-6 no-print gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">عنوان الهوية الإضافية {index + 1}</label>
          <input
            type="text"
            value={custom.title}
            onChange={(e) => updateTitle(custom.id, e.target.value)}
            placeholder="مثال: هوية النقابة، جواز سفر..."
            className="w-full border-b-2 border-blue-200 outline-none bg-transparent font-black text-lg py-1 focus:border-blue-600 transition-all placeholder:text-blue-200"
            required
          />
        </div>
        <button
          type="button"
          onClick={(e) => removeCustomId(custom.id, e)}
          className="bg-white hover:bg-red-50 text-red-500 p-3 rounded-xl transition-all shadow-sm border border-red-100 hover:border-red-300 mt-4 active:scale-95 z-20"
          title="حذف هذه الهوية"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="print:block hidden bg-blue-300 p-2 border border-black text-center font-bold mb-4">
        {custom.title || `هوية إضافية ${index + 1}`}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {imageIds.map((imgId, i) => (
          <ImageUpload
            key={imgId}
            storageKey={`memberForm_${memberId}_img_${custom.id}_${imgId}`}
            displayLabel={imgId === 'front' ? 'الوجه الأمامي' : imgId === 'back' ? 'الوجه الخلفي' : `صورة إضافية ${i + 1}`}
            showToast={showToast}
            onRemove={() => {
              if (imgId !== 'front' && imgId !== 'back') {
                removeImage(imgId);
              }
            }}
          />
        ))}
        <button
          type="button"
          onClick={addImage}
          className="no-print border-2 border-dashed border-blue-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-blue-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[240px] group/add"
        >
          <div className="p-4 bg-blue-50 rounded-full group-hover/add:bg-blue-100 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">إضافة صورة أخرى</span>
        </button>
      </div>
    </div>
  );
};

// Utility to create a cropped image
const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

interface ImageUploadProps {
  storageKey: string;
  displayLabel: string;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
  onRemove?: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ storageKey, displayLabel, showToast, onRemove }) => {
  const [image, setImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [customId, setCustomId] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleCropSave = async () => {
    if (tempImage && croppedAreaPixels) {
      try {
        setUploadProgress(10);
        const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
        
        // Convert base64 to Blob for Firebase Storage upload
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        
        const parts = storageKey.split('_');
        const mId = parts[1];
        const section = parts[3];
        const imgId = parts[4];

        setUploadProgress(40);
        const url = await storageService.uploadMemberImage(mId, `${section}_${imgId}`, blob as File);
        
        setImage(url);
        setIsCropping(false);
        setTempImage(null);
        setUploadProgress(100);
        
        localStorage.setItem(storageKey, url);
        if (showToast) showToast('تم رفع الصورة بنجاح إلى السحابة', 'success');
        
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (e) {
        console.error(e);
        setUploadProgress(0);
        if (showToast) showToast('فشل في رفع الصورة. تأكد من اتصالك بالإنترنت.', 'error');
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  useEffect(() => {
    const savedImage = localStorage.getItem(storageKey);
    if (savedImage) {
      setImage(savedImage);
    }
    const savedId = localStorage.getItem(storageKey + '_id');
    if (savedId) {
      setCustomId(savedId);
    }

    const handleClear = () => {
      setImage(null);
      setCustomId('');
      setError('');
      setUploadProgress(0);
      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageKey + '_id');
    };
    const handleClearSection = (e: any) => {
      const section = e.detail?.section;
      if (section && storageKey.includes(`_img_${section}_`)) {
        handleClear();
      }
    };
    window.addEventListener('clearForm', handleClear);
    window.addEventListener('clearSection', handleClearSection);
    return () => {
      window.removeEventListener('clearForm', handleClear);
      window.removeEventListener('clearSection', handleClearSection);
    };
  }, [storageKey]);

  // Lock body scroll when cropping or previewing
  useEffect(() => {
    if (isCropping || isPreviewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCropping, isPreviewOpen]);

  const processFile = (file: File, isDrop: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      if (showToast) showToast('يرجى اختيار ملف صورة صالح.', 'error');
      else alert('يرجى اختيار ملف صورة صالح.');
      return;
    }

    if (isDrop && showToast) {
      showToast('تم استلام الملف، جاري المعالجة...', 'success');
    }

    setUploadProgress(1); // Start progress
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onloadend = () => {
      const base64String = reader.result as string;
      setTempImage(base64String);
      setIsCropping(true);
      setUploadProgress(0); // Reset progress
    };

    reader.onerror = () => {
      if (showToast) showToast('حدث خطأ أثناء قراءة الملف.', 'error');
      else alert('حدث خطأ أثناء قراءة الملف.');
      setUploadProgress(0);
    };

    reader.readAsDataURL(file);
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.replace(/\D/g, ''); // Only allow numbers
    const trimmedId = newId.trim();

    setCustomId(newId);

    if (trimmedId !== '') {
      const memberPrefix = storageKey.split('_img_')[0];
      const allKeys = Object.keys(localStorage);

      const isDuplicate = allKeys.some(key => {
        if (key.startsWith(memberPrefix) && key.endsWith('_id') && key !== (storageKey + '_id')) {
          const storedValue = localStorage.getItem(key);
          return storedValue && storedValue.trim() === trimmedId;
        }
        return false;
      });

      if (isDuplicate) {
        setError('هذا المعرف مستخدم بالفعل لصورة أخرى لهذا المنتمي.');
        return;
      }
    }

    setError('');
    localStorage.setItem(storageKey + '_id', newId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], true);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      setImage(null);
      setCustomId('');
      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageKey + '_id');
      if (onRemove) onRemove();
      if (showToast) showToast('تم حذف الصورة بنجاح');
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div
        className={`border-2 border-dashed p-3 text-center h-full min-h-[240px] relative flex flex-col items-center justify-center cursor-pointer transition-all duration-500 bg-white rounded-xl group overflow-hidden print:border-solid print:border-black print:rounded-none print:h-64 print:w-full ${isDragging
            ? 'border-blue-600 bg-blue-50/90 ring-8 ring-blue-100/50 scale-[1.02] shadow-2xl z-10'
            : 'border-gray-200 hover:bg-gray-50 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title="انقر أو اسحب الصورة هنا لرفعها. سيتم حفظها تلقائياً."
      >
        {!image && !isDragging && (
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        )}

        {isDragging && (
          <div className="absolute inset-0 z-20 bg-blue-600/5 flex flex-col items-center justify-center rounded-lg pointer-events-none backdrop-blur-[2px]">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl animate-bounce flex items-center gap-2">
              <Plus className="w-5 h-5" />
              أفلت الصورة هنا الآن
            </div>
          </div>
        )}

        {uploadProgress > 0 && (
          <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center rounded-lg">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-600">
                {uploadProgress}%
              </div>
            </div>
            <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-inner">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-xs font-bold text-blue-700 mt-3 tracking-widest uppercase">جاري الرفع</span>
          </div>
        )}

        {image ? (
          <div className="w-full h-full relative group/img flex items-center justify-center p-1">
            <img
              src={image}
              alt={displayLabel}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm transition-transform duration-500 group-hover/img:scale-[1.02] print:rounded-none"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 no-print rounded-lg">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="bg-white text-gray-900 p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempImage(image);
                  setIsCropping(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90"
              >
                <Crop className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-90"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <div className={`mb-4 flex flex-col items-center transition-all duration-500 ${isDragging ? 'text-blue-600 scale-110' : 'text-gray-300'} print:hidden`}>
              <div className={`p-6 rounded-2xl mb-4 transition-all duration-500 ${isDragging ? 'bg-blue-100 shadow-inner rotate-12' : 'bg-gray-50 group-hover:bg-blue-50 group-hover:rotate-3'}`}>
                <ImageIcon className={`w-14 h-14 transition-all duration-500 ${isDragging ? 'opacity-100' : 'opacity-20 group-hover:opacity-40'}`} />
              </div>
              <span className={`font-black text-sm tracking-tight transition-colors duration-300 ${isDragging ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'}`}>{displayLabel}</span>
              <div className="flex items-center gap-2 mt-3">
                <span className="h-px w-4 bg-gray-200"></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isDragging ? 'أفلت الآن' : 'اسحب أو انقر'}</span>
                <span className="h-px w-4 bg-gray-200"></span>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer no-print"
              onChange={handleImageChange}
              disabled={uploadProgress > 0}
            />
          </div>
        )}
      </div>

      <div className="no-print flex flex-col gap-1.5 px-2 py-1 bg-gray-50/50 rounded-lg border border-gray-100 transition-colors focus-within:border-blue-200 focus-within:bg-blue-50/30">
        <div className="flex items-center gap-3">
          <label className="text-[9px] font-black text-gray-400 whitespace-nowrap uppercase tracking-[0.15em]">المعرف الرقمي</label>
          <input
            type="text"
            value={customId}
            onChange={handleIdChange}
            placeholder="أدخل المعرف هنا..."
            className={`flex-1 text-xs bg-transparent outline-none py-1 transition-all font-mono font-bold ${error ? 'text-red-600 placeholder:text-red-300' : 'text-gray-700 placeholder:text-gray-300'}`}
          />
        </div>
        {error && <span className="text-[9px] text-red-500 font-black animate-pulse">{error}</span>}
      </div>

      <FullImageModal
        isOpen={isPreviewOpen}
        image={image}
        onClose={() => setIsPreviewOpen(false)}
        label={displayLabel + (customId ? ` - ${customId}` : '')}
      />

      {isCropping && tempImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                  <Crop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">تعديل وقص الصورة</h3>
                </div>
              </div>
              <button
                onClick={handleCropCancel}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="relative flex-1 bg-gray-900 min-h-[400px]">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={true}
              />
            </div>

            <div className="p-8 bg-white border-t border-gray-100">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleCropSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Check className="w-6 h-6" />
                    حفظ ورفع
                  </button>
                  <button
                    onClick={handleCropCancel}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Page8Props {
  customIds: { id: string; title: string }[];
  setCustomIds: React.Dispatch<React.SetStateAction<{ id: string; title: string }[]>>;
  memberId: string;
  showToast?: (msg: string, type?: 'success' | 'error') => void;
}

export default function Page8({ customIds, setCustomIds, memberId, showToast }: Page8Props) {
  const addCustomId = () => {
    setCustomIds([...customIds, { id: Date.now().toString() + Math.random().toString(36).substring(2, 7), title: '' }]);
  };

  const updateTitle = (id: string, title: string) => {
    setCustomIds(customIds.map(c => c.id === id ? { ...c, title } : c));
  };

  const removeCustomId = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه الهوية وجميع الصور المرتبطة بها؟')) {
      const updatedIds = customIds.filter(c => c.id !== id);
      setCustomIds(updatedIds);
      if (showToast) showToast('تم حذف الهوية الإضافية بنجاح', 'success');
    }
  };

  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white">
      <div className="border border-black p-4 min-h-[1000px] relative">
        <div className="mb-2 mt-8">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            المستمسكات الثبوتية
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 pb-16 print:block">
          <div className="space-y-10 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 space-y-0 print:block print:space-y-10">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-5 bg-blue-600 text-white py-2 px-4 rounded-lg">
                <h3 className="font-black text-sm">البطاقة الوطنية</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload storageKey={`memberForm_${memberId}_img_national_front`} displayLabel="الوجه الأمامي" showToast={showToast} />
                <ImageUpload storageKey={`memberForm_${memberId}_img_national_back`} displayLabel="الوجه الخلفي" showToast={showToast} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-5 bg-blue-600 text-white py-2 px-4 rounded-lg">
                <h3 className="font-black text-sm">بطاقة السكن</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload storageKey={`memberForm_${memberId}_img_residence_front`} displayLabel="الوجه الأمامي" showToast={showToast} />
                <ImageUpload storageKey={`memberForm_${memberId}_img_residence_back`} displayLabel="الوجه الخلفي" showToast={showToast} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-5 bg-blue-600 text-white py-2 px-4 rounded-lg">
                <h3 className="font-black text-sm">بطاقة الناخب</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload storageKey={`memberForm_${memberId}_img_voter_front`} displayLabel="الوجه الأمامي" showToast={showToast} />
                <ImageUpload storageKey={`memberForm_${memberId}_img_voter_back`} displayLabel="الوجه الخلفي" showToast={showToast} />
              </div>
            </div>
          </div>

          {customIds.map((custom, index) => (
            <CustomIDCard
              key={custom.id}
              custom={custom}
              index={index}
              memberId={memberId}
              showToast={showToast}
              updateTitle={updateTitle}
              removeCustomId={removeCustomId}
            />
          ))}

          <div className="no-print flex justify-center pt-6 lg:col-span-2">
            <button
              type="button"
              onClick={addCustomId}
              className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
            >
              <Plus className="w-6 h-6" />
              إضافة مسمسك إضافي جديد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
