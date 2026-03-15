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

const initialMemberState: Member = {
  id: '',
  name: '',
  phone: '',
  governorate: '',
  dateAdded: '',
  timestamp: 0,
  personalInformation: {
    fullName: '',
    fatherName: '',
    motherName: '',
    birthYear: '',
    nationality: 'عراقية',
    ethnicity: '',
    height: '',
    weight: '',
    healthStatus: '',
    healthNotes: '',
    socialStatus: '',
  },
  housingInformation: {
    governorate: '',
    district: '',
    neighborhood: '',
    zukaq: '',
    dar: '',
    nearestLandmark: '',
    phone: '',
  },
  previousHousing: {
    governorate: '',
    district: '',
    neighborhood: '',
    zukaq: '',
    dar: '',
    nearestLandmark: '',
    phone: '',
  },
  familyInformation: {
    totalMembers: '',
    males: '',
    females: '',
    wivesCount: '',
    relationship: '',
  },
  educationInformation: {
    level: '',
    graduationYear: '',
    institution: '',
    address: '',
    specialization: '',
  },
  workInformation: {
    incomeStatus: '',
    isWorking: false,
    details: {},
  },
  politicalInformation: {
    hasAffiliation: false,
    affiliationDetails: '',
    hasCivilSocietyInvolvement: false,
    civilSocietyDetails: '',
    isMshmoolBaath: false,
    baathDetails: '',
  },
  religiousInformation: {
    sect: '',
    reference: '',
  },
  judicialInformation: {
    questions: [false, false, false, false, false, false],
    history: [],
  },
  additionalInformation: {
    travels: [],
    communication: [],
    skills: [],
    experiences: [],
  },
  pledgeInformation: {
    organizerName: '',
    organizerDate: '',
    organizerSignature: '',
    ownerName: '',
    ownerDate: '',
    ownerSignature: '',
  },
  documents: {
    customIds: [],
  },
  metadata: {
    createdAt: null,
    updatedAt: null,
    createdBy: '',
  },
};

export default function MemberForm({ onBack, memberId }: MemberFormProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Member>(initialMemberState);
  const [isChanged, setIsChanged] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-fill existing member data if editing
  useEffect(() => {
    if (memberId && memberId !== 'new') {
      loadMemberData(memberId);
    }
  }, [memberId]);

  const loadMemberData = async (id: string) => {
    try {
      const data = await memberService.getMember(id);
      if (data) {
        setFormData(data);
      }
    } catch (err) {
      console.error('Failed to load member data:', err);
      setError('فشل في تحميل بيانات المنتمي من قاعدة البيانات');
    }
  };

  const updateFormData = (path: string, value: any) => {
    setIsChanged(true);
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNext = () => {
    if (currentPage < 8) setCurrentPage(currentPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveOnly = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const adminUid = auth.currentUser?.uid || 'anonymous';
      const dataToSave = {
        ...formData,
        dateAdded: formData.dateAdded || new Date().toLocaleDateString('ar-EG'),
        timestamp: formData.timestamp || Date.now(),
      };

      // Sync summary fields only if THEY ARE EMPTY (don't overwrite manual edits)
      if (!dataToSave.name) dataToSave.name = dataToSave.personalInformation.fullName || '';
      if (!dataToSave.phone) dataToSave.phone = dataToSave.housingInformation.phone || '';
      if (!dataToSave.governorate) dataToSave.governorate = dataToSave.housingInformation.governorate || '';

      if (memberId && memberId !== 'new') {
        await memberService.updateMember(memberId, dataToSave);
      } else {
        const newId = await memberService.addMember(dataToSave, adminUid);
        // If it was a new member, we should stay in edit mode for this ID
        // But for simplicity in this flow, we just update the local state if needed
      }
      setIsChanged(false);
      showToast('تم حفظ البيانات بنجاح', 'success');
    } catch (err) {
      console.error(err);
      setError('فشل في حفظ البيانات.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const adminUid = auth.currentUser?.uid || 'anonymous';
      const dataToSave = {
        ...formData,
        dateAdded: formData.dateAdded || new Date().toLocaleDateString('ar-EG'),
        timestamp: formData.timestamp || Date.now(),
      };

      // Sync summary fields only if THEY ARE EMPTY
      if (!dataToSave.name) dataToSave.name = dataToSave.personalInformation.fullName || '';
      if (!dataToSave.phone) dataToSave.phone = dataToSave.housingInformation.phone || '';
      if (!dataToSave.governorate) dataToSave.governorate = dataToSave.housingInformation.governorate || '';

      if (memberId && memberId !== 'new') {
        await memberService.updateMember(memberId, dataToSave);
      } else {
        await memberService.addMember(dataToSave, adminUid);
      }
      setIsChanged(false);
      setIsSuccess(true);
      setTimeout(() => onBack(), 2000);
    } catch (err: any) {
      console.error(err);
      setError('حدث خطأ أثناء حفظ البيانات.');
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
            onClick={() => {
              if (isChanged) {
                if (window.confirm('لديك تغييرات غير محفوظة، هل تريد العودة دون حفظ؟')) {
                  onBack();
                }
              } else {
                onBack();
              }
            }}
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
          <button 
            type="button"
            onClick={currentPage === 8 ? handleFinalSubmit : handleSaveOnly}
            disabled={isSubmitting}
            className={`flex items-center gap-2 font-black px-10 py-3.5 rounded-2xl transition-all shadow-xl disabled:opacity-50 ${
              currentPage === 8 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' 
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100'
            }`}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {currentPage === 8 ? 'حفظ نهائي' : 'حفظ كمسودة'}
          </button>
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
      <form onSubmit={(e) => e.preventDefault()} className="relative print:m-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {currentPage === 1 && <Page1 data={formData} onChange={updateFormData} showToast={showToast} />}
            {currentPage === 2 && <Page2 data={formData} onChange={updateFormData} showToast={showToast} />}
            {currentPage === 3 && <Page3 data={formData} onChange={updateFormData} showToast={showToast} />}
            {currentPage === 4 && <Page4 data={formData} onChange={updateFormData} showToast={showToast} />}
            {currentPage === 5 && <Page5 data={formData} onChange={updateFormData} showToast={showToast} />}
            {currentPage === 6 && <Page6 data={formData} onChange={updateFormData} showToast={showToast} />}
            {currentPage === 7 && <Page7 data={formData} onChange={updateFormData} memberId={memberId || 'new'} showToast={showToast} />}
            {currentPage === 8 && <Page8 data={formData} onChange={updateFormData} memberId={memberId || 'new'} showToast={showToast} />}
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            layout
            initial={{ opacity: 0, y: -40, x: '-50%', scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9, filter: 'blur(5px)' }}
            className={`fixed top-6 left-1/2 flex items-center gap-4 px-6 py-4 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-[200] font-bold no-print min-w-[360px] border-2 backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-white/90 border-emerald-100 text-emerald-900' : 'bg-white/90 border-red-100 text-red-900'
            }`}
          >
            <div className={`p-3 rounded-2xl ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-black">{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="p-2 rounded-2xl hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
