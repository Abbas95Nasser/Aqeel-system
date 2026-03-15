import React from 'react';
import { Member } from '../types';

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function Page6({ data, onChange }: PageProps) {
  const travels = data.additionalInformation?.travels || [];
  const communication = data.additionalInformation?.communication || [];
  const skills = data.additionalInformation?.skills || [];

  const updateTravel = (index: number, field: string, value: string) => {
    const newTravels = [...travels];
    if (!newTravels[index]) {
      newTravels[index] = { country: '', date: '', duration: '', purpose: '' };
    }
    newTravels[index] = { ...newTravels[index], [field]: value };
    onChange('additionalInformation.travels', newTravels);
  };

  const updateContact = (index: number, field: string, value: string) => {
    const newCommunication = [...communication];
    if (!newCommunication[index]) {
      newCommunication[index] = { type: '', phone: '', socialMedia: '' };
    }
    newCommunication[index] = { ...newCommunication[index], [field]: value };
    onChange('additionalInformation.communication', newCommunication);
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    onChange('additionalInformation.skills', newSkills);
  };

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
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => (
              <div key={idx} className="form-row h-8 sm:!flex-row !flex-row">
                <div className="w-10 border-l border-black bg-blue-200 flex items-center justify-center font-bold sm:!w-10 !w-10 shrink-0">{idx + 1}</div>
                <div className="flex-[2] min-w-[160px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={travels[idx]?.country || ''} onChange={(e) => updateTravel(idx, 'country', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[100px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={travels[idx]?.date || ''} onChange={(e) => updateTravel(idx, 'date', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[100px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={travels[idx]?.duration || ''} onChange={(e) => updateTravel(idx, 'duration', e.target.value)} />
                </div>
                <div className="flex-[2] min-w-[160px]">
                    <input type="text" className="form-input h-full px-1" value={travels[idx]?.purpose || ''} onChange={(e) => updateTravel(idx, 'purpose', e.target.value)} />
                </div>
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
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="form-row h-10 sm:!flex-row !flex-row">
                <div className="w-10 border-l border-black bg-blue-200 flex items-center justify-center font-bold sm:!w-10 !w-10 shrink-0">.{idx + 1}</div>
                <div className="flex-1 min-w-[120px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={communication[idx]?.type || ''} onChange={(e) => updateContact(idx, 'type', e.target.value)} />
                </div>
                <div className="flex-1 min-w-[120px] border-l border-black">
                    <input type="text" className="form-input h-full px-1" value={communication[idx]?.phone || ''} onChange={(e) => updateContact(idx, 'phone', e.target.value)} />
                </div>
                <div className="flex-[2] min-w-[200px]">
                    <input type="text" className="form-input h-full px-1" value={communication[idx]?.socialMedia || ''} onChange={(e) => updateContact(idx, 'socialMedia', e.target.value)} />
                </div>
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
            <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                required 
                value={skills[0] || ''}
                onChange={(e) => updateSkill(0, e.target.value)}
            />
          </div>
          <div className="border-b-2 border-dotted border-black h-8 relative">
            <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                value={skills[1] || ''}
                onChange={(e) => updateSkill(1, e.target.value)}
            />
          </div>
          <div className="border-b-2 border-dotted border-black h-8 relative">
            <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent px-2" 
                value={skills[2] || ''}
                onChange={(e) => updateSkill(2, e.target.value)}
            />
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
