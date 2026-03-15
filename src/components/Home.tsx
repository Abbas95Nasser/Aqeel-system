import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, FileText, Activity, Edit, Trash2, ChevronUp, ChevronDown, ArrowUpDown, CheckCircle, AlertCircle, X, Loader2, Download, Filter, MapPin, ShieldCheck, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { memberService } from '../services/memberService';
import { Member } from '../types';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

interface HomeProps {
  onAddMember: (memberId?: string) => void;
}

type SortKey = 'name' | 'phone' | 'governorate' | 'dateAdded';
type SortOrder = 'asc' | 'desc' | null;
type ToastType = 'success' | 'error';

export default function Home({ onAddMember }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: 'dateAdded',
    order: 'desc'
  });

  const [stats, setStats] = useState<{ total: number; byGovernorate: Record<string, number> }>({
    total: 0,
    byGovernorate: {}
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allMembers = await memberService.getAllMembers();
      setMembers(allMembers);

      const dashboardStats = await memberService.getStats();
      setStats({
        total: dashboardStats.total,
        byGovernorate: dashboardStats.byGovernorate
      });

    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      showToast(`خطأ في تحميل البيانات من قاعدة البيانات: ${err.code || err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const deleteMember = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemberToDelete(id);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    const id = memberToDelete;

    try {
      await memberService.deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast('تم حذف المنتمي بنجاح');
      fetchData(); // Refresh stats
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('حدث خطأ أثناء محاولة الحذف من قاعدة البيانات', 'error');
    } finally {
      setMemberToDelete(null);
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key
        ? (prev.order === 'asc' ? 'desc' : prev.order === 'desc' ? null : 'asc')
        : 'asc'
    }));
  };

  const processedMembers = members
    .filter(member => {
      const name = (member.name || member.personalInformation?.fullName || '').toLowerCase();
      const phone = (member.phone || member.housingInformation?.phone || '').toLowerCase();
      const governorate = (member.governorate || member.housingInformation?.governorate || '').toLowerCase();
      const search = searchQuery.toLowerCase();
      
      return name.includes(search) || phone.includes(search) || governorate.includes(search);
    })
    .sort((a, b) => {
      if (!sortConfig.key || !sortConfig.order) return 0;

      let valA: any = (sortConfig.key === 'name' ? (a.name || a.personalInformation?.fullName) : (a as any)[sortConfig.key]) || '';
      let valB: any = (sortConfig.key === 'name' ? (b.name || b.personalInformation?.fullName) : (b as any)[sortConfig.key]) || '';

      if (sortConfig.key === 'dateAdded') {
        valA = a.timestamp || 0;
        valB = b.timestamp || 0;
      } else {
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.order === 'asc'
            ? valA.localeCompare(valB, 'ar')
            : valB.localeCompare(valA, 'ar');
        }
      }

      if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;

      return 0;
    });

  const toggleSelectAll = () => {
    if (selectedIds.size === processedMembers.length && processedMembers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processedMembers.map(m => m.id as string)));
    }
  };

  const toggleSelectMember = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const exportToExcel = () => {
    const selectedMembers = members.filter(m => selectedIds.has(m.id as string));
    const dataToExport = selectedMembers.length > 0 ? selectedMembers : processedMembers;

    if (dataToExport.length === 0) {
      showToast('لا توجد بيانات لتصديرها', 'error');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(m => ({
      'المعرف': m.id,
      'الاسم الكامل': m.name || m.personalInformation?.fullName,
      'الهاتف': m.phone || m.housingInformation?.phone,
      'المحافظة': m.governorate || m.housingInformation?.governorate,
      'تاريخ الإضافة': m.dateAdded,
      // Personal Info
      'الأب': m.personalInformation?.fatherName || '',
      'الأم': m.personalInformation?.motherName || '',
      'سنة الولادة': m.personalInformation?.birthYear || '',
      'الجنسية': m.personalInformation?.nationality || '',
      'القومية': m.personalInformation?.ethnicity || '',
      'الطول': m.personalInformation?.height || '',
      'الوزن': m.personalInformation?.weight || '',
      'الحالة الصحية': m.personalInformation?.healthStatus || '',
      'ملاحظات صحية': m.personalInformation?.healthNotes || '',
      'الحالة الاجتماعية': m.personalInformation?.socialStatus || '',
      // Housing Info
      'محافظة السكن': m.housingInformation?.governorate || '',
      'القضاء': m.housingInformation?.district || '',
      'المحلة': m.housingInformation?.neighborhood || '',
      'زقاق': m.housingInformation?.zukaq || '',
      'دار': m.housingInformation?.dar || '',
      'أقرب نقطة دالة': m.housingInformation?.nearestLandmark || '',
      // Previous Housing
      'المحافظة السابقة': m.previousHousing?.governorate || '',
      'القضاء السابق': m.previousHousing?.district || '',
      // Family Info
      'عدد الأفراد': m.familyInformation?.totalMembers || '',
      'الذكور': m.familyInformation?.males || '',
      'الإناث': m.familyInformation?.females || '',
      'عدد الزوجات': m.familyInformation?.wivesCount || '',
      // Education Info
      'المستوى العلمي': m.educationInformation?.level || '',
      'سنة التخرج': m.educationInformation?.graduationYear || '',
      'المؤسسة التعليمية': m.educationInformation?.institution || '',
      'التخصص': m.educationInformation?.specialization || '',
      // Work Info
      'حالة الدخل': m.workInformation?.incomeStatus || '',
      'هل يعمل؟': m.workInformation?.isWorking ? 'نعم' : 'لا',
      'الدائرة/الجهة': m.workInformation?.details?.government || m.workInformation?.details?.private || '',
      'العنوان الوظيفي': m.workInformation?.details?.jobTitle || '',
      'تاريخ المباشرة': m.workInformation?.details?.startDate || '',
      'الراتب الشهري': m.workInformation?.details?.monthlyIncome || ''
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "المنتمين");
    XLSX.writeFile(workbook, `Aqeel_System_Members_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast(`تم تصدير ${dataToExport.length} سجل بنجاح`);
  };

  const exportToPDF = () => {
    const selectedMembers = members.filter(m => selectedIds.has(m.id as string));
    const dataToExport = selectedMembers.length > 0 ? selectedMembers : processedMembers;

    if (dataToExport.length === 0) {
      showToast('لا توجد بيانات لتصديرها', 'error');
      return;
    }

    // Create a temporary element for PDF generation to ensure a clean look
    const printElement = document.createElement('div');
    printElement.dir = 'rtl';
    printElement.className = 'pdf-export-container p-8 font-serif';
    printElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #111827;">نظام إدارة المنتمين - تقرير البيانات</h1>
        <p style="color: #6B7280; font-weight: bold;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
        <p style="color: #6B7280; font-size: 12px;">عدد السجلات: ${dataToExport.length}</p>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #F9FAFB; border-bottom: 2px solid #E5E7EB;">
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #374151; font-weight: 800;">المعرف</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #374151; font-weight: 800;">الاسم الكامل</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #374151; font-weight: 800;">الهاتف</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #374151; font-weight: 800;">المحافظة</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #374151; font-weight: 800;">تاريخ الانضمام</th>
          </tr>
        </thead>
        <tbody>
          ${dataToExport.map(m => `
            <tr style="border-bottom: 1px solid #F3F4F6;">
              <td style="padding: 12px; text-align: right; font-size: 11px; color: #6B7280;">${m.id}</td>
              <td style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #111827;">${m.name || m.personalInformation?.fullName}</td>
              <td style="padding: 12px; text-align: right; font-size: 11px; color: #4B5563;">${m.phone || m.housingInformation?.phone || '---'}</td>
              <td style="padding: 12px; text-align: right; font-size: 11px; color: #059669;">${m.governorate || m.housingInformation?.governorate || '---'}</td>
              <td style="padding: 12px; text-align: right; font-size: 10px; color: #9CA3AF;">${m.dateAdded}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 40px; text-align: left; font-size: 10px; color: #9CA3AF;">
        تم إنشاء هذا التقرير تلقائياً بواسطة نظام العقيل لإدارة المنتمين
      </div>
    `;

    const opt: any = {
      margin: 10,
      filename: `Aqeel_System_Members_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    showToast('جاري تصدير ملف PDF...');
    html2pdf().set(opt).from(printElement).save().then(() => {
      showToast('تم تصدير ملف PDF بنجاح');
    }).catch((err: any) => {
      console.error('PDF Export failed:', err);
      showToast('فشل تصدير ملف PDF. يرجى المحاولة مرة أخرى.', 'error');
    });
  };

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />;

    if (sortConfig.order === 'asc')
      return <ChevronUp className="w-3 h-3 text-blue-600" />;

    if (sortConfig.order === 'desc')
      return <ChevronDown className="w-3 h-3 text-blue-600" />;

    return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold animate-pulse">جاري تحميل البيانات من Firestore...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Toast Notification */}
      <AnimatePresence mode="wait">
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
              {toast.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-blue-600" />
            نظام إدارة المنتمين
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            <Activity className="w-4 h-4" />
            لوحة تحكم الأداء التنظيمي والقاعدة البياناتية
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportToExcel}
            className="bg-white border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-50 flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-5 h-5" />
            تصدير Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-white border-2 border-blue-100 text-blue-600 hover:bg-blue-50 font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-50 flex items-center gap-2 transition-all active:scale-95"
          >
            <FileDown className="w-5 h-5" />
            تصدير PDF
          </button>
          <button
            onClick={() => onAddMember()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-100 flex items-center gap-2 transition-all transform hover:-translate-y-1 active:translate-y-0"
          >
            <UserPlus className="w-5 h-5" />
            إضافة استمارة جديدة
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 overflow-hidden relative">
            <Users className="w-8 h-8 relative z-10" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">إجمالي المنتمين</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">المحافظات النشطة</p>
            <p className="text-3xl font-black text-gray-900">{Object.keys(stats.byGovernorate).length}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">توزيع المنتمين حسب المحافظة</p>
            <MapPin className="w-4 h-4 text-gray-200" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {Object.entries(stats.byGovernorate).map(([gov, count]) => (
              <div key={gov} className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-3 shrink-0 border border-gray-100">
                <span className="font-bold text-gray-700">{gov}</span>
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Table Section */}
      <div id="members-table-container" className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <h2 className="text-xl font-black text-gray-800">قاعدة البيانات التنظيمية</h2>
          </div>
          <div className="relative w-full md:w-96 group no-print">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="block w-full pr-12 pl-4 py-4 border border-gray-100 rounded-2xl bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 text-sm font-bold shadow-sm transition-all text-right"
              placeholder="ابحث بالاسم، رقم الهاتف، أو المحافظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/10">
              <tr>
                <th className="px-8 py-5 text-right w-10 no-print">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-gray-200 rounded-lg focus:ring-blue-500 cursor-pointer"
                    checked={processedMembers.length > 0 && selectedIds.size === processedMembers.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('name')} className="px-6 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] cursor-pointer group">
                  <div className="flex items-center gap-2">الاسم الكامل <SortIndicator column="name" /></div>
                </th>
                <th className="px-6 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">الهاتف</th>
                <th onClick={() => handleSort('governorate')} className="px-6 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] cursor-pointer group">
                  <div className="flex items-center gap-2">المحافظة <SortIndicator column="governorate" /></div>
                </th>
                <th onClick={() => handleSort('dateAdded')} className="px-6 py-5 text-right text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] cursor-pointer group">
                  <div className="flex items-center gap-2">تاريخ الانضمام <SortIndicator column="dateAdded" /></div>
                </th>
                <th className="px-8 py-5 text-center text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] no-print">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedMembers.length > 0 ? (
                processedMembers.map((member) => (
                  <tr key={member.id} className={`group hover:bg-blue-50/20 transition-all ${selectedIds.has(member.id!) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-8 py-5 no-print">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 border-gray-200 rounded-lg cursor-pointer"
                        checked={selectedIds.has(member.id!)}
                        onChange={(e) => toggleSelectMember(member.id!, e)}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                          {(member.name || member.personalInformation?.fullName || '?').charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-900">{member.name || member.personalInformation?.fullName || 'بدون اسم'}</span>
                          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">ID: {member.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-600" dir="ltr">{member.phone || member.housingInformation?.phone || '---'}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black border border-emerald-100">
                        {member.governorate || member.housingInformation?.governorate || '---'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-400 font-bold">{member.dateAdded}</td>
                    <td className="px-8 py-5 no-print">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => onAddMember(member.id)} className="p-3 bg-white border border-gray-100 rounded-2xl text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-90">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => deleteMember(member.id!, e)} className="p-3 bg-white border border-gray-100 rounded-2xl text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-100 transition-all active:scale-90">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Users className="w-20 h-20" />
                      <p className="text-xl font-black">لا توجد بيانات مطابقة للبحث</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[300] flex items-center justify-center p-6 animate-in fade-in">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-gray-100">
            <div className="flex items-center gap-6 mb-8 text-red-600">
              <div className="bg-red-50 p-5 rounded-3xl shadow-inner"><Trash2 className="w-10 h-10" /></div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">تأكيد حذف المنتمي</h3>
                <p className="text-[10px] font-black uppercase text-red-400 tracking-widest mt-1">إجراء غير قابل للتراجع</p>
              </div>
            </div>
            <p className="text-gray-500 font-bold leading-relaxed mb-10">سيتم حذف كافة بيانات المنتمي وصوره من قاعدة البيانات السحابية (Firestore) بشكل نهائي. هل تريد المتابعة؟</p>
            <div className="flex gap-4">
              <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-100 transition-all active:scale-95">حذف نهائي</button>
              <button onClick={() => setMemberToDelete(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black py-4 rounded-2xl transition-all">إلغاء</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
