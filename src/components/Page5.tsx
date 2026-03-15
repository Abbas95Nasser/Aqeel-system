import React from 'react';
import { Member } from '../types';

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function Page5({ data, onChange }: PageProps) {
  const judicialQuestions = data.judicialInformation?.questions || [false, false, false, false, false, false];
  const judicialHistory = data.judicialInformation?.history || [];

  const updateJudicialQuestion = (index: number, value: boolean) => {
    const newQuestions = [...judicialQuestions];
    newQuestions[index] = value;
    onChange('judicialInformation.questions', newQuestions);
  };

  const updateJudicialHistory = (index: number, field: string, value: string) => {
    const newHistory = [...judicialHistory];
    if (!newHistory[index]) {
      newHistory[index] = { date: '', type: '', reason: '', location: '', result: '' };
    }
    newHistory[index] = { ...newHistory[index], [field]: value };
    onChange('judicialInformation.history', newHistory);
  };

  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">

        {/* Section 10: Religious Status */}
        <div className="mb-2 mt-8">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع الديني
          </div>
        </div>

        <div className="mb-8">
          <div className="font-bold text-lg mb-4">المذهب :</div>
          <div className="border-b-2 border-dotted border-black h-8 relative mb-6">
            <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                required 
                value={data.religiousInformation?.sect || ''}
                onChange={(e) => onChange('religiousInformation.sect', e.target.value)}
            />
          </div>

          <div className="font-bold text-lg mb-4">المرجع والتقليد :</div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                required 
                value={data.religiousInformation?.reference || ''}
                onChange={(e) => onChange('religiousInformation.reference', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 11: Judicial Status */}
        <div className="mb-2 mt-12">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع القضائي
          </div>
        </div>

        <div className="mb-6">
          <div className="font-bold text-lg mb-4">الأحكام القضائية (رسمية من قبل الدولة ، أو من قبل جهات أو دول)</div>

          <div className="space-y-2">
            {[
              "1) هل تم سجنه أو اعتقاله ؟",
              "2) هل هو ملاحق حالياً؟",
              "3) هل صدر بحقّه أحكام؟",
              "4) هل نفذ أو ينفذ أحكاماً؟",
              "5) هل محكوم بجناية ؟",
              "6) هل متهم بملف فساد ؟"
            ].map((question, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 border-b border-gray-200 sm:border-none pb-2 sm:pb-0">
                <div className="w-full sm:w-64 font-bold">{question}</div>
                <div className="flex items-center gap-8 sm:gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span>نعم</span>
                    <input 
                        type="radio" 
                        name={`judicial_${i}`} 
                        className="w-5 h-5 border-2 border-black cursor-pointer" 
                        required 
                        checked={judicialQuestions[i] === true}
                        onChange={() => updateJudicialQuestion(i, true)}
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span>كلا</span>
                    <input 
                        type="radio" 
                        name={`judicial_${i}`} 
                        className="w-5 h-5 border-2 border-black cursor-pointer" 
                        required 
                        checked={judicialQuestions[i] === false}
                        onChange={() => updateJudicialQuestion(i, false)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-black mb-8 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="form-row bg-blue-300 font-bold text-center border-b border-black sm:!flex-row !flex-row">
              <div className="w-10 py-2 border-l border-black sm:!w-10 !w-10 shrink-0">ت</div>
              <div className="w-40 py-2 border-l border-black sm:!w-40 !w-40 shrink-0">التاريخ (من / الى )</div>
              <div className="flex-1 min-w-[120px] py-2 border-l border-black">نوع المشكلة</div>
              <div className="flex-1 min-w-[120px] py-2 border-l border-black">السبب</div>
              <div className="flex-1 min-w-[120px] py-2 border-l border-black">المكان</div>
              <div className="flex-1 min-w-[120px] py-2">النتيجة</div>
            </div>
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="form-row h-10 sm:!flex-row !flex-row">
                <div className="w-10 border-l border-black bg-blue-200 flex items-center justify-center font-bold sm:!w-10 !w-10 shrink-0">{idx + 1}</div>
                <div className="w-40 border-l border-black sm:!w-40 !w-40 shrink-0">
                    <input type="text" className="form-input h-full px-1" value={judicialHistory[idx]?.date || ''} onChange={(e) => updateJudicialHistory(idx, 'date', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[120px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={judicialHistory[idx]?.type || ''} onChange={(e) => updateJudicialHistory(idx, 'type', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[120px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={judicialHistory[idx]?.reason || ''} onChange={(e) => updateJudicialHistory(idx, 'reason', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[120px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={judicialHistory[idx]?.location || ''} onChange={(e) => updateJudicialHistory(idx, 'location', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[120px]">
                    <input type="text" className="form-input h-full px-1" value={judicialHistory[idx]?.result || ''} onChange={(e) => updateJudicialHistory(idx, 'result', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (5)
        </div>
      </div>
    </div>
  );
}
