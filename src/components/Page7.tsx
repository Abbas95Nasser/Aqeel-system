import React, { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';

const ExperienceImageUpload = ({ storageKey }: { storageKey: string }) => {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem(storageKey);
    if (savedImage) {
      setImage(savedImage);
    }

    const handleClear = () => {
      setImage(null);
      localStorage.removeItem(storageKey);
    };
    window.addEventListener('clearForm', handleClear);
    return () => window.removeEventListener('clearForm', handleClear);
  }, [storageKey]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملف صورة صالح.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        try {
          localStorage.setItem(storageKey, base64String);
        } catch (err) {
          console.warn('Storage quota exceeded, image not saved to localStorage');
          alert('حجم الصورة كبير جداً، لم يتم حفظها في الذاكرة المؤقتة ولكن ستظهر في الطباعة.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImage(null);
    localStorage.removeItem(storageKey);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageChange}
      />
      {image ? (
        <div className="relative group flex items-center">
          <div className="w-10 h-10 border border-black rounded-sm overflow-hidden shadow-sm print:w-16 print:h-16 bg-gray-50">
            <img src={image} alt="Experience" className="w-full h-full object-cover" />
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
          className="flex items-center gap-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded border border-black text-xs font-bold transition-colors shadow-sm no-print"
          title="إرفاق صورة"
        >
          <Upload className="w-4 h-4" />
          إرفاق صورة
        </button>
      )}
    </div>
  );
};

export default function Page7({ memberId }: { memberId: string }) {
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
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="الخبرة 1" />
            </div>
            <ExperienceImageUpload storageKey={`memberForm_${memberId}_exp1_image`} />
          </div>
          <div className="flex items-end gap-4">
            <div className="border-b-2 border-dotted border-black h-8 relative flex-1">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" />
            </div>
            <ExperienceImageUpload storageKey={`memberForm_${memberId}_exp2_image`} />
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
        <div className="flex flex-col md:flex-row justify-between px-2 sm:px-4 mt-16 gap-8 md:gap-4">
          <div className="border border-black p-4 w-full md:w-[48%] min-h-[180px] flex flex-col justify-between bg-gray-50/10">
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">اسم منظم الاستمارة :</span>
              <input type="text" className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold" required title="اسم منظم الاستمارة" />
            </div>
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">التاريخ :</span>
              <input type="text" className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold" required title="تاريخ منظم الاستمارة" />
            </div>
            <div className="flex gap-2 items-end">
              <span className="font-bold whitespace-nowrap text-sm">التوقيع :</span>
              <input type="text" className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold" required title="توقيع منظم الاستمارة" />
            </div>
          </div>

          <div className="border border-black p-4 w-full md:w-[48%] min-h-[180px] flex flex-col justify-between bg-gray-50/10">
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">اسم صاحب الاستمارة :</span>
              <input type="text" className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold" required title="اسم صاحب الاستمارة" />
            </div>
            <div className="flex gap-2 items-end mb-4">
              <span className="font-bold whitespace-nowrap text-sm">التاريخ :</span>
              <input type="text" className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold" required title="تاريخ صاحب الاستمارة" />
            </div>
            <div className="flex gap-2 items-end">
              <span className="font-bold whitespace-nowrap text-sm">التوقيع :</span>
              <input type="text" className="flex-1 outline-none bg-transparent border-b-2 border-dotted border-gray-500 pb-1 text-sm font-bold" required title="توقيع صاحب الاستمارة" />
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
