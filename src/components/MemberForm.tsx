import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ChevronLeft, Save, X, Check, Loader2, AlertCircle, 
  User, Home as HomeIcon, GraduationCap, Briefcase, Shield, Plus, 
  Info, FileCheck, Image as ImageIcon, Trash2, Camera, Upload, 
  MapPin, Phone, Calendar, Mail, FileText, Printer, CheckCircle2,
  ShieldCheck, Users
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { memberService } from '../services/memberService';
import { storageService } from '../services/storageService';
import { Member } from '../types';

// Import All 8 Pages 
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import Page8 from './Page8';

interface MemberFormProps {
  onBack: () => void;
  memberId?: string; // If present, we are editing
}

export default function MemberForm({ onBack, memberId }: MemberFormProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customIds, setCustomIds] = useState<{ id: string; title: string }[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-fill existing member data if editing
  useEffect(() => {
    if (memberId) {
      loadMemberData(memberId);
    }
  }, [memberId]);

  const loadMemberData = async (id: string) => {
    try {
      const data = await memberService.getMember(id);
      if (data) {
        // Here we'd fill the form inputs. Page components handle their own inputs for now.
        // In a production app, we would use a form state management library like React Hook Form.
      }
    } catch (err) {
      console.error('Failed to load member data:', err);
      setError('فشل في تحميل بيانات المنتمي من قاعدة البيانات');
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    // Basic alert for now, Home.tsx handles the rich UI toasts
    alert(msg);
  };

  const handleNext = () => {
    if (currentPage < 8) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Gather all data from form across all 8 pages
      const adminUid = auth.currentUser?.uid || 'anonymous';
      
      const getValue = (selector: string) => (document.querySelector(selector) as HTMLInputElement)?.value || '';
      const getRadioValue = (name: string) => (document.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement)?.value || '';

      const formData: any = {
        name: getValue('input[title="الاسم الرباعي واللقب"]'),
        phone: getValue('input[title="رقم الموبايل"]'),
        governorate: getValue('input[title="المحافظة (السكن الحالي)"]') || getValue('input[title="المحافظة"]'),
        dateAdded: new Date().toLocaleDateString('ar-EG'),
        timestamp: Date.now(),
        personalInformation: {
          fullName: getValue('input[title="الاسم الرباعي واللقب"]'),
          fatherName: getValue('input[title="اسم الأب"]'),
          motherName: getValue('input[title="اسم الأم"]'),
          birthYear: getValue('input[title="سنة الولادة"]'),
          nationality: getValue('input[title="الجنسية"]'),
          ethnicity: getValue('input[title="القومية"]'),
          height: getValue('input[title="الطول"]'),
          weight: getValue('input[title="الوزن"]'),
          healthStatus: getRadioValue('health_status'),
          healthNotes: getValue('input[title="ملاحظات الوضع الصحي"]'),
          socialStatus: getRadioValue('social_status'),
        },
        housingInformation: {
          governorate: getValue('input[title="المحافظة (السكن الحالي)"]'),
          district: getValue('input[title="القضاء (السكن الحالي)"]'),
          neighborhood: getValue('input[title="المحلة (السكن الحالي)"]'),
          zukaq: getValue('input[title="زقاق (السكن الحالي)"]'),
          dar: getValue('input[title="رقم الدار (السكن الحالي)"]'),
          nearestLandmark: getValue('input[title="أقرب نقطة دالة (السكن الحالي)"]'),
          phone: getValue('input[title="رقم الهاتف (السكن الحالي)"]'),
        },
        educationInformation: {
          level: getRadioValue('education_level'),
          graduationYear: getValue('input[title="تاريخ التخرج"]'),
          institution: getValue('input[title="آخر مؤسسة تخرج منها"]'),
          address: getValue('input[title="العنوان التفصيلي"]'),
          specialization: getValue('input[title="التخصص الدقيق"]'),
        },
        documents: {
          nationalIdFrontUrl: localStorage.getItem(`memberForm_${memberId || 'new'}_img_national_front`),
          nationalIdBackUrl: localStorage.getItem(`memberForm_${memberId || 'new'}_img_national_back`),
          residenceCardFrontUrl: localStorage.getItem(`memberForm_${memberId || 'new'}_img_residence_front`),
          residenceCardBackUrl: localStorage.getItem(`memberForm_${memberId || 'new'}_img_residence_back`),
          voterCardFrontUrl: localStorage.getItem(`memberForm_${memberId || 'new'}_img_voter_front`),
          voterCardBackUrl: localStorage.getItem(`memberForm_${memberId || 'new'}_img_voter_back`),
        }
      };

      // 3. Save to Firestore
      let savedId = memberId;
      if (memberId && memberId !== 'new') {
         await memberService.updateMember(memberId, formData);
      } else {
         savedId = await memberService.addMember(formData, adminUid);
      }

      // 4. Cleanup localStorage for this member
      const keysToRemove = Object.keys(localStorage).filter(key => key.includes(`memberForm_${memberId || 'new'}`));
      keysToRemove.forEach(key => localStorage.removeItem(key));

      setIsSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (err: any) {
      console.error(err);
      setError('حدث خطأ أثناء حفظ البيانات. يرجى التحقق من اتصالك بالإنترنت وصلاحيات قاعدة البيانات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pages = [
    { title: 'المعلومات الشخصية', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'معلومات السكن', icon: HomeIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'الحالة العائلية', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { title: 'التحصيل الدراسي', icon: GraduationCap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'السيرة المهنية', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'النشاط السياسي', icon: Shield, color: 'text-rose-500', bg: 'bg-rose-50' },
    { title: 'التعهد والخبرات', icon: Info, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { title: 'المستمسكات', icon: FileCheck, color: 'text-sky-500', bg: 'bg-sky-50' }
  ];

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white m-8 rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-500 border border-emerald-50 text-center">
        <div className="w-24 h-24 bg-emerald-100/50 rounded-full flex items-center justify-center text-emerald-600 mb-8 border-4 border-emerald-50 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">تم الحفظ بنجاح</h2>
        <p className="text-gray-500 font-bold mb-8 text-lg">لقد تم مزامنة كافة المعلومات والصور مع قاعدة البيانات السحابية بنجاح.</p>
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-4 bg-white hover:bg-red-50 text-red-500 rounded-3xl shadow-xl shadow-red-50 border border-gray-100 transition-all hover:scale-110 active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {memberId ? 'تعديل استمارة منتمي' : 'إضافة استمارة جديدة'}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"></span>
              <p className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                الخطوة {currentPage} من 8: {pages[currentPage-1].title}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2.5 rounded-[2rem] shadow-xl border border-gray-50">
          <button 
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-900 text-white font-black px-6 py-3.5 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            <Printer className="w-5 h-5" />
            طباعة الاستمارة
          </button>
          {currentPage === 8 ? (
            <button 
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-600 text-white font-black px-10 py-3.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              حفظ الاستمارة في Firestore
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 text-white font-black px-10 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 transform hover:-translate-y-1 active:translate-y-0"
            >
              الصفحة التالية
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="hidden md:flex justify-between items-center mb-12 px-8 overflow-hidden no-print">
        {pages.map((p, i) => {
          const step = i + 1;
          const isActive = step === currentPage;
          const isCompleted = step < currentPage;
          const Icon = p.icon;

          return (
            <React.Fragment key={step}>
              <div 
                className={`flex flex-col items-center gap-3 relative z-10 cursor-pointer group transition-all duration-500 ${isActive ? 'scale-110' : ''}`}
                onClick={() => setCurrentPage(step)}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl ${
                  isActive ? `bg-blue-600 text-white ring-8 ring-blue-50` : 
                  isCompleted ? 'bg-emerald-600 text-white' : 
                  'bg-white text-gray-400 grayscale border border-gray-100'
                }`}>
                  {isCompleted ? <Check className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>الخطوة 0{step}</span>
                  <span className={`text-[11px] font-black mt-0.5 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{p.title}</span>
                </div>
              </div>
              {step < 8 && (
                <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all duration-700 bg-gray-100 overflow-hidden relative ${isCompleted ? 'bg-indigo-600' : ''}`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    className="absolute inset-0 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-2 border-red-100/50 text-red-600 px-8 py-5 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-xl shadow-red-50/20 no-print">
          <div className="bg-white p-3 rounded-2xl shadow-sm text-red-500"><AlertCircle className="w-6 h-6" /></div>
          <div>
            <p className="font-black text-lg leading-none">تنبيه الحفظ</p>
            <p className="text-sm font-bold mt-1.5 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Form Content */}
      <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="relative print:m-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {currentPage === 1 && <Page1 />}
            {currentPage === 2 && <Page2 />}
            {currentPage === 3 && <Page3 />}
            {currentPage === 4 && <Page4 />}
            {currentPage === 5 && <Page5 />}
            {currentPage === 6 && <Page6 />}
            {currentPage === 7 && <Page7 memberId={memberId || 'new'} />}
            {currentPage === 8 && <Page8 customIds={customIds} setCustomIds={setCustomIds} memberId={memberId || 'new'} showToast={showToast} />}
          </motion.div>
        </AnimatePresence>

        {/* Floating Page Controls - Standard Fixed Bottom */}
        <div className="mt-12 flex justify-between items-center py-8 border-t border-gray-100 no-print">
          <button 
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`flex items-center gap-3 font-bold px-8 py-4 rounded-2xl transition-all ${
              currentPage === 1 ? 'text-gray-300 pointer-events-none' : 'text-gray-500 hover:bg-gray-100 active:scale-95'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
            السابق
          </button>
          
          <div className="flex gap-2">
            {[1,2,3,4,5,6,7,8].map(num => (
              <button 
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${num === currentPage ? 'w-10 bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>

          <button 
            type="button"
            onClick={currentPage === 8 ? handleFinalSubmit : handleNext}
            disabled={isSubmitting}
            className={`flex items-center gap-3 font-bold px-12 py-4 rounded-2xl transition-all shadow-xl active:scale-95 ${
              currentPage === 8 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
            }`}
          >
            {currentPage === 8 ? (isSubmitting ? 'جاري الحفظ...' : 'حفظ نهائي') : 'التالي'}
            {currentPage === 8 ? <Save className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
