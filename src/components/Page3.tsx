import React from 'react';

export default function Page3() {
  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">
        {/* Section 9: Work */}
        <div className="mb-2 mt-8">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            العمل
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8">
          <div className="font-bold text-lg">الدخل الشهري العام الوضع المادي:</div>
          <div className="border border-black form-row flex-1 w-full sm:w-auto">
            <div className="form-label flex-1 justify-center">جيد</div>
            <div className="form-field form-field-bordered flex-1 justify-center"><input type="radio" name="income" className="w-5 h-5 cursor-pointer" required title="الدخل الشهري العام" /></div>
            <div className="form-label flex-1 justify-center border-r border-black sm:border-r-black border-r-transparent">متوسط</div>
            <div className="form-field form-field-bordered flex-1 justify-center"><input type="radio" name="income" className="w-5 h-5 cursor-pointer" required title="الدخل الشهري العام" /></div>
            <div className="form-label flex-1 justify-center border-r border-black sm:border-r-black border-r-transparent">مكتفى</div>
            <div className="form-field form-field-bordered flex-1 justify-center"><input type="radio" name="income" className="w-5 h-5 cursor-pointer" required title="الدخل الشهري العام" /></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8">
          <div className="font-bold text-lg">هل يعمل حالياً:</div>
          <div className="border border-black form-row w-full sm:w-64">
            <div className="form-label flex-1 justify-center">نعم</div>
            <div className="form-field form-field-bordered flex-1 justify-center">
              <input type="radio" name="isWorking" className="w-5 h-5 cursor-pointer" required title="هل يعمل حالياً" />
            </div>
            <div className="form-label flex-1 justify-center border-r border-black sm:border-r-black border-r-transparent">كلا</div>
            <div className="form-field form-field-bordered flex-1 justify-center">
              <input type="radio" name="isWorking" className="w-5 h-5 cursor-pointer" required title="هل يعمل حالياً" />
            </div>
          </div>
        </div>

        <div className="border border-black mb-8">
          <div className="form-row bg-blue-300 font-bold text-center border-b border-black">
            <div className="w-48 py-2 border-l border-black">التفاصيل</div>
            <div className="flex-1 py-2">الأول</div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">قطاع حكومي</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">قطاع أهلي</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">قطاع مختلط</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">العنوان</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">الوظيفة</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">تاريخ البدء</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">أوقات الدوام</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
          <div className="form-row">
            <div className="w-48 bg-blue-200 font-bold p-2 border-l border-black flex items-center">المردود الشهري</div>
            <div className="flex-1"><input type="text" className="form-input" /></div>
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (3)
        </div>
      </div>
    </div>
  );
}
