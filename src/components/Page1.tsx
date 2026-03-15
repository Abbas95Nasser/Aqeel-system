import React from 'react';
import { Member } from '../types';

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
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

export default function Page1({ data, onChange }: PageProps) {
  const handleNameChange = (part: 'first' | 'father' | 'family' | 'title', value: string) => {
    // Current parts
    const currentName = data.personalInformation.fullName || '';
    const parts = currentName.split(' ');
    let [first = '', father = '', family = '', title = ''] = parts;

    if (part === 'first') first = value;
    if (part === 'father') father = value;
    if (part === 'family') family = value;
    if (part === 'title') title = value;

    const newFullName = `${first} ${father} ${family} ${title}`.trim();
    onChange('personalInformation.fullName', newFullName);
  };

  const nameParts = (data.personalInformation.fullName || '').split(' ');
  const [firstName = '', fatherName = '', familyName = '', titleName = ''] = nameParts;

  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-24 sm:w-32 h-32 sm:h-40 border border-black flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0 relative overflow-hidden">
            {data.documents.personalPhotoUrl ? (
                <img src={data.documents.personalPhotoUrl} alt="Personal" className="w-full h-full object-cover" />
            ) : (
                "الصورة"
            )}
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
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="اكتب اسم المزكي هنا..." 
                    autoFocus 
                    value={data.pledgeInformation.organizerName || ''}
                    onChange={(e) => onChange('pledgeInformation.organizerName', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-32">السكن</div>
            <div className="form-label w-24 border-r border-black">المحافظة</div>
            <div className="form-field form-field-bordered w-32">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="المحافظة" 
                    value={data.housingInformation.governorate || ''}
                    onChange={(e) => onChange('housingInformation.governorate', e.target.value)}
                />
            </div>
            <div className="form-label w-12 border-r border-black">م:</div>
            <div className="form-field form-field-bordered w-16">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="محلة" 
                    value={data.housingInformation.neighborhood || ''}
                    onChange={(e) => onChange('housingInformation.neighborhood', e.target.value)}
                />
            </div>
            <div className="form-label w-12 border-r border-black">ز:</div>
            <div className="form-field form-field-bordered w-16">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="زقاق"
                    value={data.housingInformation.zukaq || ''}
                    onChange={(e) => onChange('housingInformation.zukaq', e.target.value)}
                />
            </div>
            <div className="form-label w-12 border-r border-black">د:</div>
            <div className="form-field form-field-bordered w-16">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="دار"
                    value={data.housingInformation.dar || ''}
                    onChange={(e) => onChange('housingInformation.dar', e.target.value)}
                />
            </div>
            <div className="form-label w-32 border-r border-black">أقرب نقطة دالة:</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="مثال: قرب مدرسة النور"
                    value={data.housingInformation.nearestLandmark || ''}
                    onChange={(e) => onChange('housingInformation.nearestLandmark', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-32">العمل والانتماء</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="اكتب العمل والانتماء هنا..."
                    value={data.workInformation.incomeStatus || ''}
                    onChange={(e) => onChange('workInformation.incomeStatus', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-32">نوع العلاقة</div>
            <div className="form-field form-field-bordered">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="مثال: صديق، قريب، زميل عمل"
                    value={data.familyInformation.relationship || ''}
                    onChange={(e) => onChange('familyInformation.relationship', e.target.value)}
                />
            </div>
            <div className="form-label w-32 border-r border-black">رقم الموبايل</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    pattern="^[0-9]{10,11}$" 
                    placeholder="07XXXXXXXXX"
                    value={data.housingInformation.phone || ''}
                    onChange={(e) => onChange('housingInformation.phone', e.target.value)}
                />
            </div>
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
              <input 
                type="text" 
                className="form-input flex-1 border-l border-black/10" 
                required 
                placeholder="الاسم الأول" 
                value={firstName}
                onChange={(e) => handleNameChange('first', e.target.value)}
              />
              <input 
                type="text" 
                className="form-input flex-1 border-l border-black/10" 
                required 
                placeholder="اسم الأب" 
                value={fatherName}
                onChange={(e) => handleNameChange('father', e.target.value)}
              />
              <input 
                type="text" 
                className="form-input flex-1 border-l border-black/10" 
                required 
                placeholder="اسم العائلة" 
                value={familyName}
                onChange={(e) => handleNameChange('family', e.target.value)}
              />
              <input 
                type="text" 
                className="form-input flex-1" 
                required 
                placeholder="اللقب" 
                value={titleName}
                onChange={(e) => handleNameChange('title', e.target.value)}
              />
            </div>
            <div className="form-label w-32 border-r border-black">الشهرة</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="الشهرة..."
                    value={data.name || ''}
                    onChange={(e) => onChange('name', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-48">مكان وتاريخ الولادة</div>
            <div className="form-field form-field-bordered flex">
              <div className="flex-1 border-l border-black/10">
                <GovernorateSelect 
                  value={data.personalInformation.birthYear?.split(',')[0] || ''}
                  onChange={(val) => {
                    const year = data.personalInformation.birthYear?.split(',')[1] || '';
                    onChange('personalInformation.birthYear', `${val},${year}`);
                  }}
                  required
                  className="w-full h-full px-4 outline-none border-none text-right font-bold"
                />
              </div>
              <input 
                type="text" 
                className="form-input flex-1" 
                required 
                placeholder="سنة الولادة" 
                value={data.personalInformation.birthYear?.split(',')[1] || ''}
                onChange={(e) => onChange('personalInformation.birthYear', `${data.personalInformation.birthYear?.split(',')[0] || ''},${e.target.value}`)}
              />
            </div>
            <div className="form-label w-32 border-r border-black">الجنسية</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="عراقية"
                    value={data.personalInformation.nationality || ''}
                    onChange={(e) => onChange('personalInformation.nationality', e.target.value)}
                />
            </div>
          </div>
          <div className="form-row">
            <div className="form-label w-48">القومية</div>
            <div className="form-field">
                <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="القومية..."
                    value={data.personalInformation.ethnicity || ''}
                    onChange={(e) => onChange('personalInformation.ethnicity', e.target.value)}
                />
            </div>
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
          <div className="form-field form-field-bordered">
            <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="سم"
                value={data.personalInformation.height || ''}
                onChange={(e) => onChange('personalInformation.height', e.target.value)}
            />
          </div>
          <div className="form-label w-32 border-r border-black sm:border-r-black border-r-transparent">الوزن</div>
          <div className="form-field">
            <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="كغم"
                value={data.personalInformation.weight || ''}
                onChange={(e) => onChange('personalInformation.weight', e.target.value)}
            />
          </div>
        </div>

        {/* Section 4: Health Status */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع الصحي
          </div>
        </div>
        <div className="border border-black mb-6 flex flex-wrap">
          <label className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input 
                type="radio" 
                name="health_status" 
                value="سليم" 
                className="w-5 h-5" 
                required 
                checked={data.personalInformation.healthStatus === 'سليم'}
                onChange={(e) => onChange('personalInformation.healthStatus', e.target.value)}
            />
            <span className="font-bold text-lg">سليم</span>
          </label>
          <label className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border-l border-black py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input 
                type="radio" 
                name="health_status" 
                value="غير سليم" 
                className="w-5 h-5" 
                required 
                checked={data.personalInformation.healthStatus === 'غير سليم'}
                onChange={(e) => onChange('personalInformation.healthStatus', e.target.value)}
            />
            <span className="font-bold text-lg text-red-600">غير سليم</span>
          </label>
          <div className="flex-[2] min-w-[200px] flex items-center px-4 py-2 bg-gray-50/50">
            <span className="font-bold text-sm whitespace-nowrap ml-2">الملاحظات:</span>
            <input 
                type="text" 
                className="flex-1 bg-transparent border-b border-gray-300 outline-none text-sm py-1" 
                placeholder="اكتب أي ملاحظات هنا..." 
                value={data.personalInformation.healthNotes || ''}
                onChange={(e) => onChange('personalInformation.healthNotes', e.target.value)}
            />
          </div>
        </div>

        {/* Section 5: Social Status */}
        <div className="mb-2">
          <div className="inline-block border border-dashed border-black px-4 py-1 font-bold text-lg mb-2">
            الوضع الاجتماعي
          </div>
        </div>
        <div className="border border-black mb-6 flex flex-wrap">
          {['عازب', 'خاطب', 'متزوج', 'مطلق', 'أرمل'].map((status, idx) => (
            <label key={status} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 ${idx < 4 ? 'border-l border-black' : ''} py-2 cursor-pointer hover:bg-gray-50`}>
                <input 
                    type="radio" 
                    name="social_status" 
                    value={status} 
                    className="w-4 h-4"
                    checked={data.personalInformation.socialStatus === status}
                    onChange={(e) => onChange('personalInformation.socialStatus', e.target.value)}
                />
                <span className="font-bold">{status}</span>
            </label>
          ))}
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 right-0 text-center font-bold">
          (1)
        </div>
      </div>
    </div>
  );
}
