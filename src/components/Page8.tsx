import React, { useState, useCallback } from 'react';
import { Trash2, Plus, Image as ImageIcon, X, Loader2, Crop, Check, Eye, Maximize2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'motion/react';
import { storageService } from '../services/storageService';
import { Member } from '../types';

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
  imageUrl?: string;
  onImageChange: (url: string | null) => void;
  displayLabel: string;
  memberId: string;
  section: string;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onImageChange, displayLabel, memberId, section, showToast }) => {
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
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
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        
        setUploadProgress(40);
        const url = await storageService.uploadMemberImage(memberId, section, blob as File);
        
        onImageChange(url);
        setIsCropping(false);
        setTempImage(null);
        setUploadProgress(100);
        
        setTimeout(() => setUploadProgress(0), 1000);
      } catch (e) {
        showToast?.('فشل في رفع الصورة. تأكد من اتصالك بالإنترنت.', 'error');
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast?.('يرجى اختيار ملف صورة صالح.', 'error');
      return;
    }

    setUploadProgress(1);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result as string);
      setIsCropping(true);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
      onImageChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div
        className={`border-2 border-dashed p-3 text-center h-full min-h-[240px] relative flex flex-col items-center justify-center cursor-pointer transition-all duration-500 bg-white rounded-xl group overflow-hidden print:border-solid print:border-black print:rounded-none print:h-64 print:w-full ${isDragging
            ? 'border-blue-600 bg-blue-50/90 ring-8 ring-blue-100/50 scale-[1.02] shadow-2xl z-10'
            : 'border-gray-200 hover:bg-gray-50 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'
          }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
      >
        {uploadProgress > 0 && (
          <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center rounded-lg">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {imageUrl ? (
          <div className="w-full h-full relative group/img flex items-center justify-center p-1">
            <img src={imageUrl} alt={displayLabel} className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-500 group-hover/img:scale-[1.02]" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 no-print rounded-lg">
              <button type="button" onClick={() => setIsPreviewOpen(true)} className="bg-white text-gray-900 p-3 rounded-full shadow-2xl hover:scale-110 active:scale-90"><Maximize2 className="w-5 h-5" /></button>
              <button type="button" onClick={() => { setTempImage(imageUrl); setIsCropping(true); }} className="bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-90"><Crop className="w-5 h-5" /></button>
              <button type="button" onClick={handleRemove} className="bg-red-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 active:scale-90"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <ImageIcon className="w-14 h-14 text-gray-300 mb-4 opacity-20" />
            <span className="font-black text-sm text-gray-600">{displayLabel}</span>
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} disabled={uploadProgress > 0} />
          </div>
        )}
      </div>

      <FullImageModal isOpen={isPreviewOpen} image={imageUrl || null} onClose={() => setIsPreviewOpen(false)} label={displayLabel} />

      {isCropping && tempImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative flex-1 bg-gray-900 min-h-[400px]">
              <Cropper image={tempImage} crop={crop} zoom={zoom} aspect={4 / 3} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} showGrid={true} />
            </div>
            <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
              <button onClick={handleCropSave} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"><Check className="w-6 h-6" />حفظ ورفع</button>
              <button onClick={handleCropCancel} className="flex-1 bg-gray-100 text-gray-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  memberId: string;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function Page8({ data, onChange, memberId, showToast }: PageProps) {
  const customIds = data.documents?.customIds || [];

  const addCustomId = () => {
    onChange('documents.customIds', [...customIds, { title: '', images: [] }]);
  };

  const updateCustomId = (index: number, field: string, value: any) => {
    const updated = [...customIds];
    updated[index] = { ...updated[index], [field]: value };
    onChange('documents.customIds', updated);
  };

  const removeCustomId = (index: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الهوية وجميع الصور المرتبطة بها؟')) {
      onChange('documents.customIds', customIds.filter((_, i) => i !== index));
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
              <div className="flex justify-between items-center mb-5 bg-blue-600 text-white py-2 px-4 rounded-lg"><h3 className="font-black text-sm">البطاقة الوطنية</h3></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload imageUrl={data.documents?.nationalIdFrontUrl} onImageChange={(url) => onChange('documents.nationalIdFrontUrl', url || '')} displayLabel="الوجه الأمامي" memberId={memberId} section="national_front" />
                <ImageUpload imageUrl={data.documents?.nationalIdBackUrl} onImageChange={(url) => onChange('documents.nationalIdBackUrl', url || '')} displayLabel="الوجه الخلفي" memberId={memberId} section="national_back" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-5 bg-blue-600 text-white py-2 px-4 rounded-lg"><h3 className="font-black text-sm">بطاقة السكن</h3></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload imageUrl={data.documents?.residenceCardFrontUrl} onImageChange={(url) => onChange('documents.residenceCardFrontUrl', url || '')} displayLabel="الوجه الأمامي" memberId={memberId} section="residence_front" />
                <ImageUpload imageUrl={data.documents?.residenceCardBackUrl} onImageChange={(url) => onChange('documents.residenceCardBackUrl', url || '')} displayLabel="الوجه الخلفي" memberId={memberId} section="residence_back" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-5 bg-blue-600 text-white py-2 px-4 rounded-lg"><h3 className="font-black text-sm">بطاقة الناخب</h3></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload imageUrl={data.documents?.voterCardFrontUrl} onImageChange={(url) => onChange('documents.voterCardFrontUrl', url || '')} displayLabel="الوجه الأمامي" memberId={memberId} section="voter_front" />
                <ImageUpload imageUrl={data.documents?.voterCardBackUrl} onImageChange={(url) => onChange('documents.voterCardBackUrl', url || '')} displayLabel="الوجه الخلفي" memberId={memberId} section="voter_back" />
              </div>
            </div>
          </div>

          {customIds.map((custom, index) => (
            <div key={index} className="print-page-break border border-blue-100 p-6 rounded-2xl bg-blue-50/20 relative transition-all lg:col-span-2">
              <div className="flex justify-between items-start mb-6 no-print gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={custom.title}
                    onChange={(e) => updateCustomId(index, 'title', e.target.value)}
                    placeholder="عنوان الهوية الإضافية (مثال: جواز سفر...)"
                    className="w-full border-b-2 border-blue-200 outline-none bg-transparent font-black text-lg py-1 focus:border-blue-600"
                    required
                  />
                </div>
                <button type="button" onClick={() => removeCustomId(index)} className="bg-white text-red-500 p-3 rounded-xl shadow-sm border border-red-100 active:scale-95"><Trash2 className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1].map((imgIdx) => (
                  <ImageUpload 
                    key={imgIdx} 
                    imageUrl={custom.images[imgIdx]} 
                    onImageChange={(url) => {
                        const newImages = [...(custom.images || [])];
                        newImages[imgIdx] = url || '';
                        updateCustomId(index, 'images', newImages);
                    }} 
                    displayLabel={imgIdx === 0 ? 'الوجه الأمامي' : 'الوجه الخلفي'} 
                    memberId={memberId} 
                    section={`custom_${index}_${imgIdx}`} 
                    showToast={showToast}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="no-print flex justify-center pt-6 lg:col-span-2">
            <button type="button" onClick={addCustomId} className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg transform hover:-translate-y-1"><Plus className="w-6 h-6" />إضافة مسمسك إضافي جديد</button>
          </div>
        </div>
        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (8)
        </div>
      </div>
    </div>
  );
}
