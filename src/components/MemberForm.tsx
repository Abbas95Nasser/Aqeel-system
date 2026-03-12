import React, { useRef, useEffect, useState } from 'react';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import Page8 from './Page8';
import { Printer, ArrowRight, Save, ChevronRight, ChevronLeft, Trash2, CheckCircle, AlertCircle, X, Loader2, Search, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import { motion, AnimatePresence } from 'motion/react';

interface MemberFormProps {
  onBack: () => void;
  memberId?: string;
}

type ToastType = 'success' | 'error' | 'info';

export default function MemberForm({ onBack, memberId }: MemberFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isPrintConfirmOpen, setIsPrintConfirmOpen] = useState(false);
  // Function to generate a formal unique ID
  const generateFormalId = () => {
    const savedMembers = localStorage.getItem('members_list');
    let nextId = 1;
    if (savedMembers) {
      try {
        const members = JSON.parse(savedMembers);
        const numericIds = members
          .map((m: any) => parseInt(m.id))
          .filter((id: number) => !isNaN(id));
        if (numericIds.length > 0) {
          nextId = Math.max(...numericIds) + 1;
        }
      } catch (e) {
        console.error('Failed to parse members for ID generation', e);
      }
    }
    return nextId.toString().padStart(6, '0');
  };

  const [currentMemberId, setCurrentMemberId] = useState<string>(memberId || generateFormalId());
  const [currentMemberName, setCurrentMemberName] = useState<string>('');
  const [customIds, setCustomIds] = useState<{ id: string; title: string }[]>([]);
  const totalPages = 8;

  // Sync with prop if it changes
  useEffect(() => {
    if (memberId) {
      setCurrentMemberId(memberId);
    }
  }, [memberId]);

  // Fetch member name when currentMemberId changes
  useEffect(() => {
    const savedMembers = localStorage.getItem('members_list');
    if (savedMembers) {
      try {
        const members = JSON.parse(savedMembers);
        const member = members.find((m: any) => m.id === currentMemberId);
        if (member) {
          setCurrentMemberName(member.name);
        } else {
          setCurrentMemberName('');
        }
      } catch (e) {
        setCurrentMemberName('');
      }
    }
  }, [currentMemberId]);

  const getElementPath = (element: Element) => {
    const input = element as HTMLInputElement;
    if (input.name && input.type !== 'radio' && input.type !== 'checkbox') {
      return input.name;
    }

    let path = '';
    let current: Element | null = element;
    while (current && current !== formRef.current) {
      let index = 0;
      let sibling = current.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === current.tagName) index++;
        sibling = sibling.previousElementSibling;
      }
      path = `${current.tagName}[${index}]/${path}`;
      current = current.parentElement;
    }
    return path;
  };

  // Load data on mount or when ID changes
  useEffect(() => {
    const idToLoad = currentMemberId;

    // Reset form inputs before loading new data
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input:not([type="file"]), textarea, select');
      inputs.forEach((input: any) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
    }

    // Load custom IDs
    const savedCustomIds = localStorage.getItem(`memberFormCustomIds_${idToLoad}`);
    if (savedCustomIds) {
      try {
        setCustomIds(JSON.parse(savedCustomIds));
      } catch (e) {
        setCustomIds([]);
      }
    } else {
      setCustomIds([]);
    }

    // Load form data
    const savedData = localStorage.getItem(`memberFormData_${idToLoad}`);
    if (savedData && formRef.current) {
      try {
        const formData = JSON.parse(savedData);
        const inputs = formRef.current.querySelectorAll('input:not([type="file"]), textarea, select');

        inputs.forEach((input: any) => {
          const path = getElementPath(input);
          if (formData[path] !== undefined) {
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = formData[path];
            } else {
              if (!input.closest('.group\\/card')) {
                input.value = formData[path];
              }
            }
          }
        });
      } catch (e) {
        console.error('Failed to load form data', e);
      }
    }

    // Load current page
    const savedPage = localStorage.getItem(`memberForm_lastPage_${idToLoad}`);
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
    } else {
      setCurrentPage(1);
    }
  }, [currentMemberId]);

  // Save current page whenever it changes
  useEffect(() => {
    localStorage.setItem(`memberForm_lastPage_${currentMemberId}`, currentPage.toString());
  }, [currentPage, currentMemberId]);

  // Save custom IDs whenever they change
  useEffect(() => {
    const idToSave = currentMemberId;
    if (customIds.length > 0 || localStorage.getItem(`memberFormCustomIds_${idToSave}`)) {
      localStorage.setItem(`memberFormCustomIds_${idToSave}`, JSON.stringify(customIds));
    }
  }, [customIds, currentMemberId]);

  const next = () => {
    performSave(true, true); // Silent save on next
    setCurrentPage(p => Math.min(totalPages, p + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prev = () => {
    performSave(true, true); // Silent save on prev
    setCurrentPage(p => Math.max(1, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lock body scroll when preview, search, clear confirm, or print confirm is open
  useEffect(() => {
    if (isPreviewOpen || isClearConfirmOpen || isPrintConfirmOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPreviewOpen, isClearConfirmOpen, isPrintConfirmOpen]);

  // Add keyboard navigation (Enter to go to next field + Ctrl+Arrows for pages)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPreviewOpen) setIsPreviewOpen(false);
        if (isClearConfirmOpen) setIsClearConfirmOpen(false);
        if (isPrintConfirmOpen) setIsPrintConfirmOpen(false);
      }

      // Page navigation shortcuts (Ctrl + Arrows)
      if (e.ctrlKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        if (e.key === 'ArrowRight') {
          next();
        } else {
          prev();
        }
        return;
      }

      if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'file') {
        e.preventDefault();
        const form = formRef.current;
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input:not([type="file"]), select, textarea')) as HTMLElement[];
          const index = inputs.indexOf(e.target);
          if (index > -1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, currentPage]); // Added currentPage to ensure next/prev use latest state if needed, though they use functional updates

  const validateForm = () => {
    // Validation is disabled to allow saving/printing without filling all inputs
    setErrors([]);
    return true;
  };



  const handlePrint = async (mode: 'all' | 'current' = 'all') => {
    if (!formRef.current) return;

    setIsPrinting(true);
    setIsPrintConfirmOpen(false);
    showToast(mode === 'all' ? 'جاري تحضير كافة الصفحات للطباعة...' : 'جاري تحضير الصفحة الحالية للطباعة...', 'info');

    try {
      // 1. Sync current values
      syncInputsToAttributes();

      // 2. Get the print content based on mode
      const selector = mode === 'all' ? '.hidden.print\\:block' : '.current-page-print-container';
      const printOnlyContent = formRef.current.querySelector(selector);

      if (!printOnlyContent) throw new Error('Print content not found');

      // 3. Create a temporary container
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error('Could not open print window');

      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(style => style.outerHTML)
        .join('\n');

      printWindow.document.write(`
        <html dir="rtl" lang="ar">
          <head>
            <title>نظام إدارة المنتمين - طباعة</title>
            ${styles}
            <style>
              @page { size: A4; margin: 0; }
              body { background: white !important; margin: 0; padding: 0; }
              .no-print { display: none !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              /* Force visibility of all elements in the print content */
              .hidden.print\\:block { display: block !important; }
            </style>
          </head>
          <body class="bg-white">
            <div class="print-container">
              ${printOnlyContent.innerHTML}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      showToast('تم فتح نافذة الطباعة', 'success');
    } catch (err) {
      console.error('Print error:', err);
      showToast('حدث خطأ تقني أثناء التحضير للطباعة.', 'error');
    } finally {
      setIsPrinting(false);
    }
  };

  const syncInputsToAttributes = () => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input, textarea, select');
      inputs.forEach((input: any) => {
        try {
          if (input.type === 'checkbox' || input.type === 'radio') {
            if (input.checked) {
              input.setAttribute('checked', 'checked');
            } else {
              input.removeAttribute('checked');
            }
          } else if (input.type !== 'file') {
            input.setAttribute('value', input.value || '');
            if (input.tagName === 'TEXTAREA') {
              input.textContent = input.value || '';
            } else if (input.tagName === 'SELECT') {
              const options = input.querySelectorAll('option');
              options.forEach((opt: any) => {
                if (opt.value === input.value) {
                  opt.setAttribute('selected', 'selected');
                } else {
                  opt.removeAttribute('selected');
                }
              });
            }
          }
        } catch (e) {
          // Silent fail for individual inputs
        }
      });
    }
  };

  const handlePreview = () => {
    syncInputsToAttributes();
    setPreviewPage(1);
    setIsPreviewOpen(true);
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleClear = () => {
    setIsClearConfirmOpen(true);
  };

  const confirmClear = () => {
    // 1. Reset local states
    setCustomIds([]);
    setErrors([]);
    setCurrentPage(1);

    // 2. Clear localStorage
    localStorage.removeItem(`memberFormData_${currentMemberId}`);
    localStorage.removeItem(`memberFormCustomIds_${currentMemberId}`);
    localStorage.removeItem(`memberForm_lastPage_${currentMemberId}`);

    // 3. Reset the form element (clears uncontrolled inputs)
    if (formRef.current) {
      formRef.current.reset();

      // Manually clear any inputs that might not be caught by reset()
      const allInputs = formRef.current.querySelectorAll('input, textarea, select');
      allInputs.forEach((input: any) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else if (input.type !== 'file') {
          input.value = '';
        }
      });
    }

    // 3. Dispatch event to clear image uploads in child components
    window.dispatchEvent(new Event('clearForm'));

    showToast('تم مسح الحقول بنجاح', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsClearConfirmOpen(false);
  };

  const performSave = (isAuto = false, silent = false) => {
    if (!formRef.current) return;

    validateForm();

    const inputs = formRef.current.querySelectorAll('input:not([type="file"]), textarea, select');
    const formData: Record<string, any> = {};

    let memberName = '';
    let memberPhone = '';
    let memberGov = '';

    let hasData = false;

    inputs.forEach((input: any) => {
      const path = getElementPath(input);
      if (input.type === 'radio') {
        if (input.checked) {
          formData[path] = true;
          hasData = true;
        } else {
          formData[path] = false;
        }
      } else if (input.type === 'checkbox') {
        formData[path] = input.checked;
        if (input.checked) hasData = true;
      } else {
        formData[path] = input.value;
        if (input.value.trim() !== '') hasData = true;

        if (input.title === 'الاسم الرباعي واللقب') memberName = input.value;
        if (input.title === 'رقم الموبايل') memberPhone = input.value;
        if (input.title === 'المحافظة') memberGov = input.value;
      }
    });

    // Prevent auto-saving completely empty forms
    if (isAuto && !hasData && customIds.length === 0) {
      return;
    }

    const idToUse = currentMemberId;

    try {
      localStorage.setItem(`memberFormData_${idToUse}`, JSON.stringify(formData));

      const savedMembers = localStorage.getItem('members_list');
      let members = savedMembers ? JSON.parse(savedMembers) : [];

      const existingIndex = members.findIndex((m: any) => m.id === idToUse);
      const memberInfo = {
        id: idToUse,
        name: memberName || 'غير مسمى',
        phone: memberPhone || '---',
        governorate: memberGov || '---',
        dateAdded: existingIndex >= 0 ? members[existingIndex].dateAdded : new Date().toLocaleDateString('ar-EG'),
        timestamp: existingIndex >= 0 ? (members[existingIndex].timestamp || Date.now()) : Date.now()
      };

      if (existingIndex >= 0) {
        members[existingIndex] = memberInfo;
      } else {
        members.push(memberInfo);
      }

      localStorage.setItem('members_list', JSON.stringify(members));

      if (!silent) {
        showToast(isAuto ? 'تم الحفظ التلقائي بنجاح' : 'تم حفظ بيانات الاستمارة بنجاح!', 'success');
      }
    } catch (e: any) {
      console.error('Save operation failed:', e);

      if (!isAuto) {
        let errorMessage = 'حدث خطأ غير متوقع أثناء الحفظ.';

        if (e.name === 'QuotaExceededError' || e.code === 22) {
          errorMessage = 'مساحة تخزين المتصفح ممتلئة. يرجى حذف بعض الاستمارات القديمة أو تفريغ ذاكرة المتصفح للمتابعة.';
        } else {
          errorMessage = `خطأ في الحفظ: ${e.message || 'يرجى التحقق من إعدادات المتصفح والمحاولة مرة أخرى.'}`;
        }

        showToast(errorMessage, 'error');
      } else {
        console.error('Auto-save failed silently:', e.message);
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate a small delay for better UX feedback
    setTimeout(() => {
      performSave(false, false);
      setIsSaving(false);
    }, 600);
  };

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      performSave(true, true); // Silent auto-save
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentMemberId]);

  return (
    <div className="py-8 relative">
      {/* Sticky Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-gray-100 z-[60] no-print group/sticky">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: `${(currentPage / totalPages) * 100}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />
        {/* Floating Page Indicator on Hover */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-b-xl border border-t-0 border-gray-100 shadow-lg text-[10px] font-black text-blue-600 opacity-0 group-hover/sticky:opacity-100 transition-opacity duration-300 pointer-events-none">
          {Math.round((currentPage / totalPages) * 100)}% مكتمل
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-[100] font-bold transition-all duration-300 animate-in fade-in slide-in-from-top-4 no-print min-w-[320px] border ${toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
            }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className={`p-1 rounded-full transition-colors ${toast.type === 'success' ? 'hover:bg-emerald-100' : 'hover:bg-red-100'
              }`}
          >
            <X className="w-4 h-4 opacity-50" />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 print-container overflow-x-hidden">

        {/* Floating Navigation Buttons */}
        <div className="fixed inset-y-0 left-4 right-4 pointer-events-none flex items-center justify-between z-40 no-print hidden lg:flex">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: currentPage === 1 ? 0 : 1, x: currentPage === 1 ? 20 : 0 }}
            type="button"
            onClick={prev}
            disabled={currentPage === 1}
            className="pointer-events-auto p-4 rounded-full bg-white/80 backdrop-blur-md shadow-2xl border border-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all active:scale-90 disabled:opacity-0"
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: currentPage === totalPages ? 0 : 1, x: currentPage === totalPages ? -20 : 0 }}
            type="button"
            onClick={next}
            disabled={currentPage === totalPages}
            className="pointer-events-auto p-4 rounded-full bg-white/80 backdrop-blur-md shadow-2xl border border-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white transition-all active:scale-90 disabled:opacity-0"
          >
            <ChevronLeft className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 p-4 rounded-lg no-print">
            <h3 className="text-red-800 font-bold mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              يرجى تصحيح الأخطاء التالية:
            </h3>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {errors.slice(0, 10).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {errors.length > 10 && <li>... و {errors.length - 10} أخطاء أخرى</li>}
            </ul>
          </div>
        )}

        {/* Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 no-print bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-100 gap-6 relative z-50">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={onBack}
              className="group text-gray-500 hover:text-gray-900 font-black py-3 px-6 rounded-2xl flex items-center gap-3 transition-all hover:bg-gray-50 active:scale-95 justify-center whitespace-nowrap"
            >
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              الرجوع للرئيسية
            </button>

            {/* Top Navigation Controls */}
            <div className="flex items-center gap-2 border-r border-gray-100 pr-4 mr-2 no-print">
              <button
                type="button"
                onClick={prev}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-center px-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">الصفحة</span>
                <span className="text-sm font-black text-blue-600 leading-none">
                  {currentPage} <span className="text-gray-300 mx-0.5">/</span> {totalPages}
                </span>
              </div>
              <button
                type="button"
                onClick={next}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            {currentMemberName && (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-blue-700 text-sm font-black shadow-sm animate-in fade-in slide-in-from-right-4">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                تعديل: {currentMemberName}
                <span className="mr-2 px-2 py-0.5 bg-blue-100 rounded-lg text-[10px] opacity-70">
                  {currentMemberId}
                </span>
              </div>
            )}
            {!currentMemberName && (
              <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 text-sm font-black shadow-sm">
                رقم المعرف: {currentMemberId}
              </div>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">

            <button
              type="button"
              onClick={handleClear}
              className="bg-red-50/50 hover:bg-red-50 text-red-600 font-black py-3 px-6 rounded-2xl border-2 border-red-100 flex items-center justify-center gap-3 transition-all hover:shadow-lg active:scale-95 w-full sm:w-auto"
            >
              <Trash2 className="w-5 h-5" />
              مسح
            </button>
            <div className="relative group w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 transition-all active:scale-95 w-full disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
            <button
              type="button"
              onClick={handlePreview}
              className="bg-white hover:bg-gray-50 text-gray-700 font-black py-3 px-6 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 transition-all hover:border-blue-200 hover:shadow-lg active:scale-95 w-full sm:w-auto"
            >
              <Eye className="w-5 h-5 text-gray-400" />
              معاينة
            </button>
            <div className="flex flex-col items-center w-full sm:w-auto gap-1">
              <button
                type="button"
                onClick={() => setIsPrintConfirmOpen(true)}
                disabled={isPrinting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all active:scale-95 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPrinting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
                {isPrinting ? 'جاري التجهيز...' : 'طباعة'}
              </button>
            </div>
          </div>
        </div>

        {/* Visual Stepped Progress Bar */}
        <div className="mb-10 no-print bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden relative group/progress">
          {/* Percentage Label */}
          <div className="absolute top-6 right-10 flex items-baseline gap-1">
            <span className="text-3xl font-black text-blue-600">{Math.round((currentPage / totalPages) * 100)}</span>
            <span className="text-sm font-bold text-gray-400">%</span>
          </div>

          {/* Progress Background Line */}
          <div className="absolute top-[52px] sm:top-[60px] left-16 right-16 h-3 bg-gray-50 rounded-full z-0 overflow-hidden border border-gray-100/50 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)] relative"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentPage - 1) / (totalPages - 1)) * 100}%` }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer"></div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            {[
              "الشخصية",
              "السكن",
              "الدراسة",
              "العمل",
              "السياسي",
              "إضافي",
              "التعهد",
              "الوثائق"
            ].map((label, i) => {
              const pageNum = i + 1;
              const isCompleted = currentPage > pageNum;
              const isActive = currentPage === pageNum;

              return (
                <div key={i} className="flex flex-col items-center group flex-1 relative">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[1.25rem] flex items-center justify-center font-black transition-all duration-500 relative z-20 ${isActive
                      ? 'bg-blue-600 text-white shadow-[0_20px_40px_rgba(37,99,235,0.4)] ring-4 ring-blue-100 scale-110'
                      : isCompleted
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                        : 'bg-white border-2 border-gray-100 text-gray-300 hover:border-blue-300 hover:text-blue-500 hover:shadow-xl'
                      }`}
                  >
                    {/* Pulse Ring for Active Step */}
                    {isActive && (
                      <motion.div
                        className="absolute -inset-2 rounded-[1.5rem] border-2 border-blue-400/30 z-10 pointer-events-none"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}

                    {/* Always show the number, with a checkmark badge if completed */}
                    <span className="text-base sm:text-2xl relative">
                      {pageNum}
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-4 -right-4 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </span>

                    {/* Active Indicator Glow */}
                    {isActive && (
                      <motion.div
                        layoutId="glow"
                        className="absolute -inset-4 rounded-[2rem] bg-blue-400/10 blur-xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </motion.button>

                  <motion.div
                    className="mt-6 flex flex-col items-center min-h-[40px]"
                    animate={{
                      opacity: isActive || isCompleted ? 1 : 0.4,
                      scale: isActive ? 1.15 : 1,
                      y: isActive ? 0 : 4
                    }}
                  >
                    <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-[0.25em] mb-2 transition-colors duration-500 ${isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-700' : 'text-gray-400'
                      }`}>
                      {label}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="h-1.5 w-8 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.8)]"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}

                    {isCompleted && !isActive && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-1 w-4 rounded-full bg-emerald-400/50"
                      />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-50 gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">
                  {currentPage}
                </div>
                <div className="absolute -top-3 -right-3 px-2 py-0.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <span className="text-[10px] text-white font-black whitespace-nowrap">
                    {Math.round((currentPage / totalPages) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">
                  المرحلة الحالية
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {currentPage === totalPages ? 'اكتملت جميع المراحل' : `متبقي ${totalPages - currentPage} مراحل`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={prev}
                disabled={currentPage === 1}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all ${currentPage === 1
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                  : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-xl active:scale-95'
                  }`}
              >
                <ChevronRight className="w-5 h-5" />
                السابق
              </button>
              <button
                type="button"
                onClick={next}
                disabled={currentPage === totalPages}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-black text-sm transition-all ${currentPage === totalPages
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-95'
                  }`}
              >
                التالي
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* The Form - Scrollable on mobile */}
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent print:overflow-visible print:mx-0 print:px-0 print:block">
          <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="w-full print:block">
            <div className="print:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="print:hidden current-page-print-container"
                >
                  {currentPage === 1 && <Page1 />}
                  {currentPage === 2 && <Page2 />}
                  {currentPage === 3 && <Page3 />}
                  {currentPage === 4 && <Page4 />}
                  {currentPage === 5 && <Page5 />}
                  {currentPage === 6 && <Page6 />}
                  {currentPage === 7 && <Page7 memberId={currentMemberId} />}
                  {currentPage === 8 && <Page8 customIds={customIds} setCustomIds={setCustomIds} memberId={currentMemberId} showToast={showToast} />}
                </motion.div>
              </AnimatePresence>

              {/* Print-only version of all pages */}
              <div className="hidden print:block space-y-0">
                <Page1 />
                <Page2 />
                <Page3 />
                <Page4 />
                <Page5 />
                <Page6 />
                <Page7 memberId={currentMemberId} />
                <Page8 customIds={customIds} setCustomIds={setCustomIds} memberId={currentMemberId} showToast={showToast} />
              </div>
            </div>
          </form>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="mt-8 mb-16 no-print bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <button
            type="button"
            onClick={prev}
            disabled={currentPage === 1}
            className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all w-full sm:w-auto ${currentPage === 1
              ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
              : 'bg-white border-2 border-gray-100 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-xl active:scale-95'
              }`}
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${currentPage !== 1 ? 'group-hover:-translate-x-1' : ''}`} />
            الصفحة السابقة
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-50/50 px-6 py-3 rounded-2xl border border-gray-100 shadow-inner">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest ml-3">المرحلة</span>
              <span className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black shadow-lg shadow-blue-200">{currentPage}</span>
              <span className="mx-3 text-gray-300 font-light">/</span>
              <span className="text-gray-600 font-black">{totalPages}</span>
            </div>

            <div className="hidden md:flex flex-col">
              <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-gray-400 mt-1 uppercase tracking-tighter">اكتمل {Math.round((currentPage / totalPages) * 100)}%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            disabled={currentPage === totalPages}
            className={`group flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-sm transition-all w-full sm:w-auto ${currentPage === totalPages
              ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 active:scale-95'
              }`}
          >
            الصفحة التالية
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${currentPage !== totalPages ? 'group-hover:translate-x-1' : ''}`} />
          </button>
        </div>
      </div>

      {/* Custom Clear Confirmation Modal */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6 text-red-600">
              <div className="bg-red-100 p-4 rounded-2xl shadow-inner shadow-red-200/50 animate-pulse">
                <Trash2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black">Confirm Clear</h3>
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest">Action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to clear all form fields? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmClear}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-200"
              >
                Yes, clear all
              </button>
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Print Confirmation Modal */}
      {isPrintConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200 no-print">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6 text-blue-600">
              <div className="bg-blue-50 p-4 rounded-2xl">
                <Printer className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black">خيارات الطباعة</h3>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">حدد نطاق الطباعة المطلوب</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed font-medium">
              هل ترغب في طباعة كافة صفحات الاستمارة (8 صفحات) أم طباعة الصفحة الحالية فقط؟
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handlePrint('all')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-100 flex items-center justify-center gap-3"
              >
                <Printer className="w-5 h-5" />
                طباعة كافة الصفحات (الكل)
              </button>
              <button
                onClick={() => handlePrint('current')}
                className="w-full bg-white border-2 border-gray-100 text-gray-700 font-black py-4 rounded-2xl transition-all hover:border-blue-200 hover:bg-blue-50/30 active:scale-95 flex items-center justify-center gap-3"
              >
                <Eye className="w-5 h-5 text-gray-400" />
                طباعة الصفحة الحالية فقط
              </button>
              <button
                onClick={() => setIsPrintConfirmOpen(false)}
                className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors mt-2"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Print Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md z-[120] flex flex-col no-print">
          <div className="bg-white p-4 border-b flex flex-col sm:flex-row justify-between items-center shadow-md gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                معاينة الاستمارة (صفحة {previewPage} من {totalPages})
              </h2>
              <div className="hidden md:flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-xs font-bold text-blue-700">وضع المعاينة النشط</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setPreviewPage(prev => Math.max(1, prev - 1))}
                  disabled={previewPage === 1}
                  className="p-2 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="الصفحة السابقة"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="px-4 font-bold text-gray-700 min-w-[60px] text-center">
                  {previewPage} / {totalPages}
                </span>
                <button
                  onClick={() => setPreviewPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={previewPage === totalPages}
                  className="p-2 hover:bg-white rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="الصفحة التالية"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

              <button
                type="button"
                onClick={() => setIsPrintConfirmOpen(true)}
                disabled={isPrinting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPrinting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
                <span className="hidden xs:inline">{isPrinting ? 'جاري التجهيز...' : 'طباعة'}</span>
              </button>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-3 rounded-lg transition-all border border-red-100"
                title="إغلاق المعاينة"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-300/30 custom-scrollbar flex justify-center overscroll-contain">
            <div className="w-full max-w-4xl animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden ring-1 ring-black/5">
                <div className="pointer-events-none select-none origin-top transition-all duration-500">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={previewPage}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {previewPage === 1 && <Page1 />}
                      {previewPage === 2 && <Page2 />}
                      {previewPage === 3 && <Page3 />}
                      {previewPage === 4 && <Page4 />}
                      {previewPage === 5 && <Page5 />}
                      {previewPage === 6 && <Page6 />}
                      {previewPage === 7 && <Page7 memberId={currentMemberId} />}
                      {previewPage === 8 && <Page8 customIds={customIds} setCustomIds={setCustomIds} memberId={currentMemberId} showToast={showToast} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-8 mb-12 flex justify-center gap-4 no-print">
                <button
                  onClick={() => setPreviewPage(prev => Math.max(1, prev - 1))}
                  disabled={previewPage === 1}
                  className="bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                  الصفحة السابقة
                </button>
                <button
                  onClick={() => setPreviewPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={previewPage === totalPages}
                  className="bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  الصفحة التالية
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="bg-white border-2 border-red-100 text-red-600 font-bold py-3 px-8 rounded-xl shadow-sm hover:bg-red-50 transition-all flex items-center gap-2 active:scale-95"
                >
                  <X className="w-5 h-5" />
                  إغلاق المعاينة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
