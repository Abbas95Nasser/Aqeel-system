import React from 'react';

export default function Page6() {
  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white">
      <div className="border border-black p-4 min-h-[1000px] relative">

        {/* Section 12: Travels */}
        <div className="mb-2 mt-8">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الاسفار
          </div>
        </div>

        <div className="border border-black mb-12 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="form-row bg-blue-300 font-bold text-center border-b border-black sm:!flex-row !flex-row">
              <div className="w-10 py-2 border-l border-black sm:!w-10 !w-10 shrink-0">ت</div>
              <div className="flex-[2] min-w-[160px] py-2 border-l border-black">الدولة التي سافرت لها</div>
              <div className="flex-1 min-w-[100px] py-2 border-l border-black">التاريخ</div>
              <div className="flex-1 min-w-[100px] py-2 border-l border-black">مدة السفر</div>
              <div className="flex-[2] min-w-[160px] py-2">الغرض من السفر</div>
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div key={num} className="form-row h-8 sm:!flex-row !flex-row">
                <div className="w-10 border-l border-black bg-blue-200 flex items-center justify-center font-bold sm:!w-10 !w-10 shrink-0">{num}</div>
                <div className="flex-[2] min-w-[160px] border-l border-black"><input type="text" className="form-input h-full" /></div>
                <div className="flex-1 min-w-[100px] border-l border-black"><input type="text" className="form-input h-full" /></div>
                <div className="flex-1 min-w-[100px] border-l border-black"><input type="text" className="form-input h-full" /></div>
                <div className="flex-[2] min-w-[160px]"><input type="text" className="form-input h-full" /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 13: Communication */}
        <div className="mb-2 mt-12">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            وسائل الاتصال
          </div>
        </div>

        <div className="border border-black mb-12 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="form-row bg-blue-300 font-bold text-center border-b border-black sm:!flex-row !flex-row">
              <div className="w-10 py-2 border-l border-black sm:!w-10 !w-10 shrink-0">ت</div>
              <div className="flex-1 min-w-[120px] py-2 border-l border-black">نوع الوسيلة</div>
              <div className="flex-1 min-w-[120px] py-2 border-l border-black">رقم الهاتف</div>
              <div className="flex-[2] min-w-[200px] py-2">مواقع التواصل الاجتماعي</div>
            </div>
            {[1, 2, 3].map((num) => (
              <div key={num} className="form-row h-10 sm:!flex-row !flex-row">
                <div className="w-10 border-l border-black bg-blue-200 flex items-center justify-center font-bold sm:!w-10 !w-10 shrink-0">.{num}</div>
                <div className="flex-1 min-w-[120px] border-l border-black"><input type="text" className="form-input h-full" required={num === 1} title={`نوع الوسيلة ${num}`} /></div>
                <div className="flex-1 min-w-[120px] border-l border-black"><input type="text" className="form-input h-full" required={num === 1} title={`رقم الهاتف ${num}`} /></div>
                <div className="flex-[2] min-w-[200px]"><input type="text" className="form-input h-full" required={num === 1} title={`مواقع التواصل الاجتماعي ${num}`} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 14: Skills */}
        <div className="mb-2 mt-12">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            المهارات:
          </div>
        </div>

        <div className="space-y-8 mt-6">
          <div className="border-b-2 border-dotted border-black h-8 relative">
            <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="المهارة 1" />
          </div>
          <div className="border-b-2 border-dotted border-black h-8 relative">
            <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" />
          </div>
          <div className="border-b-2 border-dotted border-black h-8 relative">
            <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" />
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (6)
        </div>
      </div>
    </div>
  );
}
