import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { Member } from '../types';

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  memberId: string;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

const ExperienceImageUpload = ({ 
  imageUrl, 
  onImageChange, 
  memberId, 
  section,
  showToast
}: { 
  imageUrl?: string; 
  onImageChange: (url: string | null) => void; 
  memberId: string;
  section: string;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        showToast?.('يرجى اختيار ملف صورة صالح.', 'error');
        return;
      }
      
      setIsUploading(true);
      try {
        const url = await storageService.uploadMemberImage(memberId, section, file);
        onImageChange(url);
      } catch (err) {
        console.error('Upload failed:', err);
        showToast?.('فشل في رفع الصورة إلى السحابة.', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2 no-print">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      {imageUrl ? (
        <div className="relative group flex items-center">
          <div className="w-10 h-10 border border-black rounded-sm overflow-hidden shadow-sm print:w-16 print:h-16 bg-gray-50">
            <img src={imageUrl} alt="Experience" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-0.5 rounded-full shadow-lg z-10 transition-all hover:scale-110 active:scale-95 no-print"
            title="حذف الصورة"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded border border-black text-xs font-bold transition-colors shadow-sm no-print disabled:opacity-50"
          title="إرفاق صورة"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          إرفاق صورة
        </button>
      )}
    </div>
  );
};

export default function Page7({ data, onChange, memberId, showToast }: PageProps) {
  const experiences = data.additionalInformation?.experiences || [];

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experiences];
    if (!newExp[index]) {
      newExp[index] = { title: '', imageUrl: '' };
    }
    newExp[index] = { ...newExp[index], [field]: value };
    onChange('additionalInformation.experiences', newExp);
  };

  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white">
      <div className="border border-black p-4 min-h-[1000px] relative">

        {/* Section 15: Experiences */}
        <div className="mb-2 mt-8">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الخبرات :
          </div>
        </div>

        <div className="space-y-8 mt-6 mb-16">
          <div className="flex items-end gap-4">
            <div className="border-b-2 border-dotted border-black h-8 relative flex-1">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                required 
                placeholder="الخبرة 1"
                value={experiences[0]?.title || ''}
                onChange={(e) => updateExperience(0, 'title', e.target.value)}
              />
            </div>
            <ExperienceImageUpload 
                imageUrl={experiences[0]?.imageUrl} 
                onImageChange={(url) => updateExperience(0, 'imageUrl', url || '')} 
                memberId={memberId} 
                section="exp1"
                showToast={showToast}
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="border-b-2 border-dotted border-black h-8 relative flex-1">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                placeholder="الخبرة 2"
                value={experiences[1]?.title || ''}
                onChange={(e) => updateExperience(1, 'title', e.target.value)}
              />
            </div>
            <ExperienceImageUpload 
                imageUrl={experiences[1]?.imageUrl} 
                onImageChange={(url) => updateExperience(1, 'imageUrl', url || '')} 
                memberId={memberId} 
                section="exp2"
                showToast={showToast}
            />
          </div>
        </div>

        {/* Section 16: Pledge */}
        <div className="mb-2 mt-12">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            التعهد :
          </div>
        </div>

        <div className="mt-6 mb-16 px-4">
          <p className="text-xl font-bold leading-loose">
            اني الموقع ادناه اتعهد بصحة المعلومات التي ادليت بها ، وان التزم بدفع اشتراك قدرة
            <br />
            (5000 الف دينار ) شهرياً .
          </p>
        </div>

        {/* Signatures */}
        <div className="flex flex-col md:flex-row justify-between px-2 sm:px-4 mt-16 gap-8 md:gap-4 font-bold">
          <div className="border border-black p-4 w-full md:w-[48%] min-h-[180px] flex flex-col justify-between bg-gray-50/10">
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">اسم منظم الاستمارة :</span>
              <input 
                type="text" 
                className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold px-1" 
                required 
                value={data.pledgeInformation?.organizerName || ''}
                onChange={(e) => onChange('pledgeInformation.organizerName', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">التاريخ :</span>
              <input 
                type="text" 
                className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold px-1" 
                required 
                value={data.pledgeInformation?.organizerDate || ''}
                onChange={(e) => onChange('pledgeInformation.organizerDate', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-end">
              <span className="font-bold whitespace-nowrap text-sm">التوقيع :</span>
              <input 
                type="text" 
                className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold px-1" 
                required 
                value={data.pledgeInformation?.organizerSignature || ''}
                onChange={(e) => onChange('pledgeInformation.organizerSignature', e.target.value)}
              />
            </div>
          </div>

          <div className="border border-black p-4 w-full md:w-[48%] min-h-[180px] flex flex-col justify-between bg-gray-50/10">
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">اسم صاحب الاستمارة :</span>
              <input 
                type="text" 
                className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold px-1" 
                required 
                value={data.pledgeInformation?.ownerName || ''}
                onChange={(e) => onChange('pledgeInformation.ownerName', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">التاريخ :</span>
              <input 
                type="text" 
                className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold px-1" 
                required 
                value={data.pledgeInformation?.ownerDate || ''}
                onChange={(e) => onChange('pledgeInformation.ownerDate', e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-end">
              <span className="font-bold whitespace-nowrap text-sm">التوقيع :</span>
              <input 
                type="text" 
                className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold px-1" 
                required 
                value={data.pledgeInformation?.ownerSignature || ''}
                onChange={(e) => onChange('pledgeInformation.ownerSignature', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (7)
        </div>
      </div>
    </div>
  );
}
