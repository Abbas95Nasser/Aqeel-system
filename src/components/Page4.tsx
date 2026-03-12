import React from 'react';

export default function Page4() {
  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">

        <div className="mt-8 mb-12">
          <div className="font-bold text-lg mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&#x2756; هل لديك انتماء سياسي او حزبي :</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <span>نعم</span>
                <input type="radio" name="political_affiliation" className="w-5 h-5 border-2 border-black cursor-pointer" required title="هل لديك انتماء سياسي او حزبي" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mr-4">
                <span>كلا</span>
                <input type="radio" name="political_affiliation" className="w-5 h-5 border-2 border-black cursor-pointer" required title="هل لديك انتماء سياسي او حزبي" />
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="تفاصيل الانتماء السياسي" />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" />
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="font-bold text-lg mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&#x2756; هل لديك انتماء او عمل في منظمات المجتمع المدني :</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <span>نعم</span>
                <input type="radio" name="civil_society" className="w-5 h-5 border-2 border-black cursor-pointer" required title="هل لديك انتماء او عمل في منظمات المجتمع المدني" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mr-4">
                <span>كلا</span>
                <input type="radio" name="civil_society" className="w-5 h-5 border-2 border-black cursor-pointer" required title="هل لديك انتماء او عمل في منظمات المجتمع المدني" />
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="تفاصيل منظمات المجتمع المدني" />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="font-bold text-lg mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&#x2756; هل مشمول بأجتثاث البعث :</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <span>نعم</span>
                <input type="radio" name="baath_party" className="w-5 h-5 border-2 border-black cursor-pointer" required title="هل مشمول بأجتثاث البعث" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mr-4">
                <span>كلا</span>
                <input type="radio" name="baath_party" className="w-5 h-5 border-2 border-black cursor-pointer" required title="هل مشمول بأجتثاث البعث" />
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="تفاصيل اجتثاث البعث" />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" />
            </div>
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (4)
        </div>
      </div>
    </div>
  );
}
