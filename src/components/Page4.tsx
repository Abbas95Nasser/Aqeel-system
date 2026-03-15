import React from 'react';
import { Member } from '../types';

interface PageProps {
  data: Member;
  onChange: (path: string, value: any) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export default function Page4({ data, onChange }: PageProps) {
  return (
    <div className="border-4 border-double border-gray-800 p-2 mb-8 print-page-break print-break-inside-avoid bg-white overflow-hidden">
      <div className="border border-black p-4 min-h-[1000px] relative">

        <div className="mt-8 mb-12">
          <div className="font-bold text-lg mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&#x2756; هل لديك انتماء سياسي او حزبي :</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <span>نعم</span>
                <input 
                    type="radio" 
                    name="political_affiliation" 
                    className="w-5 h-5 border-2 border-black cursor-pointer" 
                    required 
                    checked={data.politicalInformation?.hasAffiliation === true}
                    onChange={() => onChange('politicalInformation.hasAffiliation', true)}
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mr-4">
                <span>كلا</span>
                <input 
                    type="radio" 
                    name="political_affiliation" 
                    className="w-5 h-5 border-2 border-black cursor-pointer" 
                    required 
                    checked={data.politicalInformation?.hasAffiliation === false}
                    onChange={() => onChange('politicalInformation.hasAffiliation', false)}
                />
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent" 
                required 
                placeholder="تفاصيل الانتماء السياسي"
                value={data.politicalInformation?.affiliationDetails || ''}
                onChange={(e) => onChange('politicalInformation.affiliationDetails', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="font-bold text-lg mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&#x2756; هل لديك انتماء او عمل في منظمات المجتمع المدني :</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <span>نعم</span>
                <input 
                    type="radio" 
                    name="civil_society" 
                    className="w-5 h-5 border-2 border-black cursor-pointer" 
                    required 
                    checked={data.politicalInformation?.hasCivilSocietyInvolvement === true}
                    onChange={() => onChange('politicalInformation.hasCivilSocietyInvolvement', true)}
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mr-4">
                <span>كلا</span>
                <input 
                    type="radio" 
                    name="civil_society" 
                    className="w-5 h-5 border-2 border-black cursor-pointer" 
                    required 
                    checked={data.politicalInformation?.hasCivilSocietyInvolvement === false}
                    onChange={() => onChange('politicalInformation.hasCivilSocietyInvolvement', false)}
                />
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent" 
                required 
                placeholder="تفاصيل منظمات المجتمع المدني"
                value={data.politicalInformation?.civilSocietyDetails || ''}
                onChange={(e) => onChange('politicalInformation.civilSocietyDetails', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="font-bold text-lg mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span>&#x2756; هل مشمول بأجتثاث البعث :</span>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <span>نعم</span>
                <input 
                    type="radio" 
                    name="baath_party" 
                    className="w-5 h-5 border-2 border-black cursor-pointer" 
                    required 
                    checked={data.politicalInformation?.isMshmoolBaath === true}
                    onChange={() => onChange('politicalInformation.isMshmoolBaath', true)}
                />
              </label>
              <label className="flex items-center gap-2 cursor-pointer mr-4">
                <span>كلا</span>
                <input 
                    type="radio" 
                    name="baath_party" 
                    className="w-5 h-5 border-2 border-black cursor-pointer" 
                    required 
                    checked={data.politicalInformation?.isMshmoolBaath === false}
                    onChange={() => onChange('politicalInformation.isMshmoolBaath', false)}
                />
              </label>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-b-2 border-dotted border-black h-8 relative">
              <input 
                type="text" 
                className="absolute bottom-0 w-full outline-none bg-transparent" 
                required 
                placeholder="تفاصيل اجتثاث البعث"
                value={data.politicalInformation?.baathDetails || ''}
                onChange={(e) => onChange('politicalInformation.baathDetails', e.target.value)}
              />
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
