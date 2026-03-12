import React, { useState, useRef } from 'react';

const PhoneInput = ({ title, required }: { title: string, required?: boolean }) => {
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let val = target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    target.value = val;

    if (val.length > 0 && val.length < 10) {
      setError('يجب أن يكون 10 أو 11 رقماً');
      target.setCustomValidity('يجب أن يكون 10 أو 11 رقماً');
    } else {
      setError('');
      target.setCustomValidity('');
    }
  };

  return (
    <div className="relative w-full flex flex-col justify-center h-full group">
      <input
        ref={inputRef}
        type="text"
        className={`form-input w-full text-lg font-bold transition-colors ${error ? 'text-red-600 bg-red-50/30' : 'focus:bg-blue-50/30'}`}
        required={required}
        title={title}
        onInput={handleInput}
        maxLength={11}
        placeholder="07XXXXXXXXX"
        dir="ltr"
        style={{ textAlign: 'right', paddingRight: '1rem' }}
      />
      {error && (
        <div className="absolute -bottom-5 right-0 z-20 pointer-events-none">
          <span className="text-[10px] text-white bg-red-500 font-black px-2 py-0.5 rounded shadow-xl whitespace-nowrap border border-red-400 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default function Page2() {
  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">
        {/* Section 6: Family Status */}
        <div className="mb-2 mt-8">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع العائلي
          </div>
        </div>
        <div className="border border-black mb-12">
          <div className="form-row bg-blue-300 font-bold text-center border-b border-black">
            <div className="w-full py-2">الوضع العائلي</div>
          </div>
          <div className="form-row">
            <div className="form-label w-64">عدد افراد العائلة الكلي:</div>
            <div className="form-label w-32 border-r border-black bg-white">الذكور</div>
            <div className="form-field form-field-bordered"><input type="text" className="form-input" required title="عدد الذكور" /></div>
            <div className="form-label w-32 border-r border-black bg-white">الاناث</div>
            <div className="form-field"><input type="text" className="form-input" required title="عدد الاناث" /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-64">عدد الزوجات</div>
            <div className="form-field"><input type="text" className="form-input" required title="عدد الزوجات" /></div>
          </div>
          <div className="form-row">
            <div className="form-label w-64">الصلة</div>
            <div className="form-field"><input type="text" className="form-input" required title="الصلة" /></div>
          </div>
        </div>

        {/* Section 7: Residence */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            السكن
          </div>
        </div>

        {/* Current Residence */}
        <div className="font-bold mb-1">السكن الحالي</div>
        <div className="border border-black mb-8 overflow-x-auto custom-scrollbar">
          <div className="min-w-full sm:min-w-[800px]">
            <div className="form-row bg-blue-300 font-bold text-center border-b border-black sm:!flex-row !flex-row">
              <div className="flex-1 min-w-[100px] py-2 border-l border-black">المحافظة</div>
              <div className="flex-1 min-w-[80px] py-2 border-l border-black">القضاء</div>
              <div className="flex-1 min-w-[60px] py-2 border-l border-black">المحلة</div>
              <div className="flex-1 min-w-[60px] py-2 border-l border-black">زقاق</div>
              <div className="flex-1 min-w-[80px] py-2 border-l border-black">رقم الدار</div>
              <div className="flex-[2] min-w-[150px] py-2">اقرب نقطة دالة</div>
            </div>
            <div className="form-row sm:!flex-row !flex-row">
              <div className="flex-1 min-w-[100px] border-l border-black"><input type="text" className="form-input" required title="المحافظة (السكن الحالي)" /></div>
              <div className="flex-1 min-w-[80px] border-l border-black"><input type="text" className="form-input" required title="القضاء (السكن الحالي)" /></div>
              <div className="flex-1 min-w-[60px] border-l border-black"><input type="text" className="form-input" required title="المحلة (السكن الحالي)" /></div>
              <div className="flex-1 min-w-[60px] border-l border-black"><input type="text" className="form-input" required title="زقاق (السكن الحالي)" /></div>
              <div className="flex-1 min-w-[80px] border-l border-black"><input type="text" className="form-input" required title="رقم الدار (السكن الحالي)" /></div>
              <div className="flex-[2] min-w-[150px]"><input type="text" className="form-input" required title="أقرب نقطة دالة (السكن الحالي)" /></div>
            </div>
            <div className="form-row border-t border-black sm:!flex-row !flex-row">
              <div className="form-label w-32 border-l border-black sm:!w-32 !w-32 shrink-0">رقم الهاتف</div>
              <div className="form-field max-w-[300px]"><PhoneInput title="رقم الهاتف (السكن الحالي)" required /></div>
            </div>
          </div>
        </div>

        {/* Previous Residence */}
        <div className="font-bold mb-1">السكن السابق</div>
        <div className="border border-black mb-12 overflow-x-auto custom-scrollbar">
          <div className="min-w-full sm:min-w-[800px]">
            <div className="form-row bg-blue-300 font-bold text-center border-b border-black sm:!flex-row !flex-row">
              <div className="flex-1 min-w-[100px] py-2 border-l border-black">المحافظة</div>
              <div className="flex-1 min-w-[80px] py-2 border-l border-black">القضاء</div>
              <div className="flex-1 min-w-[60px] py-2 border-l border-black">المحلة</div>
              <div className="flex-1 min-w-[60px] py-2 border-l border-black">زقاق</div>
              <div className="flex-1 min-w-[80px] py-2 border-l border-black">رقم الدار</div>
              <div className="flex-[2] min-w-[150px] py-2">اقرب نقطة دالة</div>
            </div>
            <div className="form-row sm:!flex-row !flex-row">
              <div className="flex-1 min-w-[100px] border-l border-black"><input type="text" className="form-input" required title="المحافظة (السكن السابق)" /></div>
              <div className="flex-1 min-w-[80px] border-l border-black"><input type="text" className="form-input" required title="القضاء (السكن السابق)" /></div>
              <div className="flex-1 min-w-[60px] border-l border-black"><input type="text" className="form-input" required title="المحلة (السكن السابق)" /></div>
              <div className="flex-1 min-w-[60px] border-l border-black"><input type="text" className="form-input" required title="زقاق (السكن السابق)" /></div>
              <div className="flex-1 min-w-[80px] border-l border-black"><input type="text" className="form-input" required title="رقم الدار (السكن السابق)" /></div>
              <div className="flex-[2] min-w-[150px]"><input type="text" className="form-input" required title="أقرب نقطة دالة (السكن السابق)" /></div>
            </div>
            <div className="form-row border-t border-black sm:!flex-row !flex-row">
              <div className="form-label w-32 border-l border-black sm:!w-32 !w-32 shrink-0">رقم الهاتف</div>
              <div className="form-field max-w-[300px]"><PhoneInput title="رقم الهاتف (السكن السابق)" required /></div>
            </div>
          </div>
        </div>

        {/* Section 8: Education */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            المستوى العلمي
          </div>
        </div>
        <div className="border border-black mb-8 flex flex-wrap">
          <label className="flex-1 min-w-[100px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="education_level" value="بكالوريوس" className="w-4 h-4" required title="المستوى العلمي" />
            <span className="font-bold">بكالوريوس</span>
          </label>
          <label className="flex-1 min-w-[100px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="education_level" value="ماجستير" className="w-4 h-4" required title="المستوى العلمي" />
            <span className="font-bold">ماجستير</span>
          </label>
          <label className="flex-1 min-w-[100px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input type="radio" name="education_level" value="دكتوراه" className="w-4 h-4" required title="المستوى العلمي" />
            <span className="font-bold">دكتوراه</span>
          </label>
          <div className="flex-[1.5] min-w-[150px] flex items-center px-4 py-2 bg-gray-50/50">
            <span className="font-bold text-sm whitespace-nowrap ml-2">تاريخ التخرج:</span>
            <input type="text" className="flex-1 bg-transparent border-b border-gray-300 outline-none text-sm py-1" required title="تاريخ التخرج" placeholder="السنة..." />
          </div>
        </div>

        <div className="mt-8">
          <div className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>&#x2756;</span> آخر مؤسسة تخرج منها والعنوان التفصيلي والتخصص الدقيق
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="آخر مؤسسة تخرج منها" />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="العنوان التفصيلي" />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input type="text" className="absolute bottom-0 w-full outline-none bg-transparent" required title="التخصص الدقيق" />
            </div>
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (2)
        </div>
      </div>
    </div>
  );
}
