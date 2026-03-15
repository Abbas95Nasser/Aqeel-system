import React, { useState } from 'react';
import { Member } from '../types';

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

const governorates = [
  'بغداد', 'نينوى', 'البصرة', 'ذي قار', 'السليمانية', 'بابل', 'أربيل', 'الأنبار', 
  'ديالى', 'النجف', 'كركوك', 'صلاح الدين', 'المثنى', 'ميسان', 'كربلاء', 'القادسية', 'دهوك', 'واسط'
];

const GovernorateSelect = ({ value, onChange, required, className = "form-input" }: { value: string, onChange: (val: string) => void, required?: boolean, className?: string }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)} 
    required={required}
    className={`${className} cursor-pointer appearance-none bg-white`}
    style={{ textAlignLast: 'right' }}
  >
    <option value="">اختر المحافظة...</option>
    {governorates.map(gov => (
      <option key={gov} value={gov}>{gov}</option>
    ))}
  </select>
);

const PhoneInput = ({ title, required, value, onChange }: { title: string, required?: boolean, value: string, onChange: (val: string) => void }) => {
  const [error, setError] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);
    
    if (val.length > 0 && val.length < 10) {
      setError('يجب أن يكون 10 أو 11 رقماً');
    } else {
      setError('');
    }
    onChange(val);
  };

  return (
    <div className="relative w-full flex flex-col justify-center h-full group">
      <input
        type="text"
        className={`form-input w-full text-lg font-bold transition-colors ${error ? 'text-red-600 bg-red-50/30' : 'focus:bg-blue-50/30'}`}
        required={required}
        title={title}
        value={value}
        onChange={handleInput}
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

export default function Page2({ data, onChange }: PageProps) {
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
            <div className="form-field form-field-bordered">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.familyInformation?.males || ''}
                    onChange={(e) => onChange('familyInformation.males', e.target.value)}
                />
            </div>
            <div className="form-label w-32 border-r border-black bg-white">الاناث</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.familyInformation?.females || ''}
                    onChange={(e) => onChange('familyInformation.females', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-64">عدد الزوجات</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.familyInformation?.wivesCount || ''}
                    onChange={(e) => onChange('familyInformation.wivesCount', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-64">الصلة</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.familyInformation?.relationship || ''}
                    onChange={(e) => onChange('familyInformation.relationship', e.target.value)}
                />
            </div>
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
              <div className="flex-1 min-w-[100px] border-l border-black">
                <GovernorateSelect 
                    value={data.housingInformation?.governorate || ''}
                    onChange={(val) => onChange('housingInformation.governorate', val)}
                    required
                />
              </div>
              <div className="flex-1 min-w-[80px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.housingInformation?.district || ''}
                    onChange={(e) => onChange('housingInformation.district', e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[60px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.housingInformation?.neighborhood || ''}
                    onChange={(e) => onChange('housingInformation.neighborhood', e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[60px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.housingInformation?.zukaq || ''}
                    onChange={(e) => onChange('housingInformation.zukaq', e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[80px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.housingInformation?.dar || ''}
                    onChange={(e) => onChange('housingInformation.dar', e.target.value)}
                />
              </div>
              <div className="flex-[2] min-w-[150px]">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.housingInformation?.nearestLandmark || ''}
                    onChange={(e) => onChange('housingInformation.nearestLandmark', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row border-t border-black sm:!flex-row !flex-row">
              <div className="form-label w-32 border-l border-black sm:!w-32 !w-32 shrink-0">رقم الهاتف</div>
              <div className="form-field max-w-[300px]">
                <PhoneInput 
                    title="رقم الهاتف (السكن الحالي)" 
                    required 
                    value={data.housingInformation?.phone || ''}
                    onChange={(val) => onChange('housingInformation.phone', val)}
                />
              </div>
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
              <div className="flex-1 min-w-[100px] border-l border-black">
                <GovernorateSelect 
                    value={data.previousHousing?.governorate || ''}
                    onChange={(val) => onChange('previousHousing.governorate', val)}
                    required
                />
              </div>
              <div className="flex-1 min-w-[80px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.previousHousing?.district || ''}
                    onChange={(e) => onChange('previousHousing.district', e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[60px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.previousHousing?.neighborhood || ''}
                    onChange={(e) => onChange('previousHousing.neighborhood', e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[60px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.previousHousing?.zukaq || ''}
                    onChange={(e) => onChange('previousHousing.zukaq', e.target.value)}
                />
              </div>
              <div className="flex-1 min-w-[80px] border-l border-black">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.previousHousing?.dar || ''}
                    onChange={(e) => onChange('previousHousing.dar', e.target.value)}
                />
              </div>
              <div className="flex-[2] min-w-[150px]">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={data.previousHousing?.nearestLandmark || ''}
                    onChange={(e) => onChange('previousHousing.nearestLandmark', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row border-t border-black sm:!flex-row !flex-row">
              <div className="form-label w-32 border-l border-black sm:!w-32 !w-32 shrink-0">رقم الهاتف</div>
              <div className="form-field max-w-[300px]">
                <PhoneInput 
                    title="رقم الهاتف (السكن السابق)" 
                    required 
                    value={data.previousHousing?.phone || ''}
                    onChange={(val) => onChange('previousHousing.phone', val)}
                />
              </div>
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
          {['بكالوريوس', 'ماجستير', 'دكتوراه'].map((level) => (
            <label key={level} className="flex-1 min-w-[100px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                    type="radio" 
                    name="education_level" 
                    value={level} 
                    className="w-4 h-4" 
                    required 
                    checked={data.educationInformation?.level === level}
                    onChange={(e) => onChange('educationInformation.level', e.target.value)}
                />
                <span className="font-bold">{level}</span>
            </label>
          ))}
          <div className="flex-[1.5] min-w-[150px] flex items-center px-4 py-2 bg-gray-50/50">
            <span className="font-bold text-sm whitespace-nowrap ml-2">تاريخ التخرج:</span>
            <input 
                type="text" 
                className="flex-1 bg-transparent border-b border-gray-300 outline-none text-sm py-1" 
                required 
                placeholder="السنة..." 
                value={data.educationInformation?.graduationYear || ''}
                onChange={(e) => onChange('educationInformation.graduationYear', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>&#x2756;</span> آخر مؤسسة تخرج منها والعنوان التفصيلي والتخصص الدقيق
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent" 
                required 
                placeholder="آخر مؤسسة تخرج منها"
                value={data.educationInformation?.institution || ''}
                onChange={(e) => onChange('educationInformation.institution', e.target.value)}
              />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent" 
                required 
                placeholder="العنوان التفصيلي"
                value={data.educationInformation?.address || ''}
                onChange={(e) => onChange('educationInformation.address', e.target.value)}
              />
            </div>
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent" 
                required 
                placeholder="التخصص الدقيق"
                value={data.educationInformation?.specialization || ''}
                onChange={(e) => onChange('educationInformation.specialization', e.target.value)}
              />
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
