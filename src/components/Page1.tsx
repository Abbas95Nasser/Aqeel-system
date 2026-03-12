import React from 'react';

export default function Page1() {
  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-24 sm:w-32 h-32 sm:h-40 border border-black flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
            الصورة
          </div>
          <div className="flex-1 flex justify-center mt-4 sm:mt-8">
            <div className="border-2 border-black bg-blue-300 px-4 sm:px-12 py-2 text-lg sm:text-2xl font-bold rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center mx-2">
              استمارة معلومات التنظيم السياسي
            </div>
          </div>
        </div>

        {/* Section 1: Basic Info */}
        <div className="border border-black mb-6">
          <div className="form-row">
            <div className="form-label w-32">اسم المزكي</div>
            <div className="form-field"><input type="text" className="form-input" required title="يرجى إدخال اسم الشخص الذي قام بالتزكية" placeholder="اكتب اسم المزكي هنا..." autoFocus /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-32">السكن</div>
            <div className="form-label w-24 border-r border-black">المحافظة</div>
            <div className="form-field form-field-bordered w-32"><input type="text" className="form-input" required title="اسم المحافظة الحالية" placeholder="المحافظة" /></div>
            <div className="form-label w-12 border-r border-black">م:</div>
            <div className="form-field form-field-bordered w-16"><input type="text" className="form-input" required title="رقم المحلة" placeholder="محلة" /></div>
            <div className="form-label w-12 border-r border-black">ز:</div>
            <div className="form-field form-field-bordered w-16"><input type="text" className="form-input" required title="رقم الزقاق" placeholder="زقاق" /></div>
            <div className="form-label w-12 border-r border-black">د:</div>
            <div className="form-field form-field-bordered w-16"><input type="text" className="form-input" required title="رقم الدار" placeholder="دار" /></div>
            <div className="form-label w-32 border-r border-black">أقرب نقطة دالة:</div>
            <div className="form-field"><input type="text" className="form-input" required title="وصف لأقرب معلم مشهور بجانب السكن" placeholder="مثال: قرب مدرسة النور" /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-32">العمل والانتماء</div>
            <div className="form-field"><input type="text" className="form-input" required title="طبيعة العمل الحالي والجهة المنتمي إليها" placeholder="اكتب العمل والانتماء هنا..." /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-32">نوع العلاقة</div>
            <div className="form-field form-field-bordered"><input type="text" className="form-input" required title="نوع العلاقة مع المزكي" placeholder="مثال: صديق، قريب، زميل عمل" /></div>
            <div className="form-label w-32 border-r border-black">رقم الموبايل</div>
            <div className="form-field"><input type="text" className="form-input" required pattern="^[0-9]{10,11}$" title="رقم الهاتف المكون من 10 أو 11 رقم" placeholder="07XXXXXXXXX" /></div>
          </div>
        </div>

        {/* Section 2: Member Info */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            معلومات المنتمي
          </div>
        </div>
        <div className="border border-black mb-6">
          <div className="form-row">
            <div className="form-label w-48">الاسم الرباعي واللقب</div>
            <div className="form-field form-field-bordered flex">
              <input type="text" className="form-input flex-1 border-l border-black/10" required title="الاسم الأول" placeholder="الاسم الأول" />
              <input type="text" className="form-input flex-1 border-l border-black/10" required title="اسم الأب" placeholder="اسم الأب" />
              <input type="text" className="form-input flex-1 border-l border-black/10" required title="اسم العائلة" placeholder="اسم العائلة" />
              <input type="text" className="form-input flex-1" required title="اللقب" placeholder="اللقب" />
            </div>
            <div className="form-label w-32 border-r border-black">الشهرة</div>
            <div className="form-field"><input type="text" className="form-input" title="الاسم المعروف به بين الناس (اختياري)" placeholder="الشهرة..." /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-48">مكان وتاريخ الولادة</div>
            <div className="form-field form-field-bordered flex">
              <input type="text" className="form-input flex-1 border-l border-black/10" required title="المحافظة" placeholder="المحافظة" />
              <input type="text" className="form-input flex-1" required title="سنة الولادة" placeholder="سنة الولادة" />
            </div>
            <div className="form-label w-32 border-r border-black">الجنسية</div>
            <div className="form-field"><input type="text" className="form-input" required title="الجنسية الأصلية" placeholder="عراقية" /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-48">القومية</div>
            <div className="form-field"><input type="text" className="form-input" required title="القومية (عربي، كردي، تركماني...)" placeholder="القومية..." /></div>
          </div>
        </div>

        {/* Section 3: Personal Specs */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            المواصفات الشخصية
          </div>
        </div>
        <div className="border border-black mb-6 form-row">
          <div className="form-label w-32">الطول</div>
          <div className="form-field form-field-bordered"><input type="text" className="form-input" required title="الطول بالسنتيمتر" placeholder="سم" /></div>
          <div className="form-label w-32 border-r border-black sm:border-r-black border-r-transparent">الوزن</div>
          <div className="form-field"><input type="text" className="form-input" required title="الوزن بالكيلوغرام" placeholder="كغم" /></div>
        </div>

        {/* Section 4: Health Status */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع الصحي
          </div>
        </div>
        <div className="border border-black mb-6 flex flex-wrap">
          <label className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="health_status" value="سليم" className="w-5 h-5" required title="الوضع الصحي" />
            <span className="font-bold text-lg">سليم</span>
          </label>
          <label className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="health_status" value="غير سليم" className="w-5 h-5" required title="الوضع الصحي" />
            <span className="font-bold text-lg text-red-600">غير سليم</span>
          </label>
          <div className="flex-[2] min-w-[200px] flex items-center px-4 py-2 bg-gray-50/50">
            <span className="font-bold text-sm whitespace-nowrap ml-2">الملاحظات:</span>
            <input type="text" className="flex-1 bg-transparent border-b border-gray-300 outline-none text-sm py-1" title="ملاحظات الوضع الصحي" placeholder="اكتب أي ملاحظات هنا..." />
          </div>
        </div>

        {/* Section 5: Social Status */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع الاجتماعي
          </div>
        </div>
        <div className="border border-black mb-6 flex flex-wrap">
          <label className="flex-1 min-w-[80px] flex items-center justify-center gap-2 border-l border-black py-2 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="social_status" value="عازب" className="w-4 h-4" title="الوضع الاجتماعي" />
            <span className="font-bold">عازب</span>
          </label>
          <label className="flex-1 min-w-[80px] flex items-center justify-center gap-2 border-l border-black py-2 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="social_status" value="خاطب" className="w-4 h-4" title="الوضع الاجتماعي" />
            <span className="font-bold">خاطب</span>
          </label>
          <label className="flex-1 min-w-[80px] flex items-center justify-center gap-2 border-l border-black py-2 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="social_status" value="متزوج" className="w-4 h-4" title="الوضع الاجتماعي" />
            <span className="font-bold">متزوج</span>
          </label>
          <label className="flex-1 min-w-[80px] flex items-center justify-center gap-2 border-l border-black py-2 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="social_status" value="مطلق" className="w-4 h-4" title="الوضع الاجتماعي" />
            <span className="font-bold">مطلق</span>
          </label>
          <label className="flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 cursor-pointer hover:bg-gray-50">
            <input type="radio" name="social_status" value="أرمل" className="w-4 h-4" title="الوضع الاجتماعي" />
            <span className="font-bold">أرمل</span>
          </label>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (1)
        </div>
      </div>
    </div>
  );
}
