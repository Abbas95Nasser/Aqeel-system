import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, FileText, Activity, Edit, Trash2, ChevronUp, ChevronDown, ArrowUpDown, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeProps {
  onAddMember: (memberId?: string) => void;
}

interface Member {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  dateAdded: string;
  timestamp?: number;
}

type SortKey = 'name' | 'phone' | 'governorate' | 'dateAdded';
type SortOrder = 'asc' | 'desc' | null;
type ToastType = 'success' | 'error';

export default function Home({ onAddMember }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: 'dateAdded',
    order: 'desc'
  });

  useEffect(() => {
    const savedMembers = localStorage.getItem('members_list');
    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {
        console.error('Failed to parse members list', e);
      }
    }
  }, []);

  const saveMembers = (updatedMembers: Member[]) => {
    setMembers(updatedMembers);
    localStorage.setItem('members_list', JSON.stringify(updatedMembers));
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const deleteMember = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemberToDelete(id);
  };

  const confirmDelete = () => {
    if (!memberToDelete) return;
    
    const id = memberToDelete;
    try {
      setMembers(prevMembers => {
        const updatedMembers = prevMembers.filter(m => m.id !== id);
        localStorage.setItem('members_list', JSON.stringify(updatedMembers));
        return updatedMembers;
      });
      
      // Also remove from selectedIds if it was there
      setSelectedIds(prev => {
        if (prev.has(id)) {
          const next = new Set(prev);
          next.delete(id);
          return next;
        }
        return prev;
      });
      
      // Clean up all associated data for this member
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(id)) {
          localStorage.removeItem(key);
        }
      });
      
      showToast('تم حذف المنتمي وجميع بياناته بنجاح');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('حدث خطأ أثناء محاولة الحذف', 'error');
    } finally {
      setMemberToDelete(null);
    }
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key ? (prev.order === 'asc' ? 'desc' : prev.order === 'desc' ? null : 'asc') : 'asc'
    }));
  };

  const processedMembers = members
    .filter(member => 
      (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (member.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (member.governorate || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig.key || !sortConfig.order) return 0;
      
      let valA: any = a[sortConfig.key] || '';
      let valB: any = b[sortConfig.key] || '';
      
      // Special handling for dateAdded sorting using timestamp if available
      if (sortConfig.key === 'dateAdded') {
        valA = a.timestamp || 0;
        valB = b.timestamp || 0;
      } else {
        // For strings, use localeCompare for better Arabic support
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
      setSelectedIds(new Set(processedMembers.map(m => m.id)));
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

  const downloadCSV = () => {
    const selectedMembers = members.filter(m => selectedIds.has(m.id));
    if (selectedMembers.length === 0) return;

    const headers = ['الاسم', 'الهاتف', 'المحافظة', 'تاريخ الإضافة'];
    const rows = selectedMembers.map(m => [
      m.name || '',
      m.phone || '',
      m.governorate || '',
      m.dateAdded || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `سجل_المنتمين_${new Date().toLocaleDateString('ar-EG')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`تم تصدير ${selectedMembers.length} منتمين بنجاح`);
  };

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
    if (sortConfig.order === 'asc') return <ChevronUp className="w-3 h-3 text-blue-600" />;
    if (sortConfig.order === 'desc') return <ChevronDown className="w-3 h-3 text-blue-600" />;
    return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            layout
            initial={{ opacity: 0, y: -40, x: '-50%', scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9, filter: 'blur(5px)' }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -50) setToast(null);
            }}
            className={`fixed top-6 left-1/2 flex items-center gap-4 px-6 py-4 rounded-[24px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] z-[200] font-bold no-print min-w-[360px] border-2 backdrop-blur-xl cursor-grab active:cursor-grabbing ${
              toast.type === 'success' 
                ? 'bg-white/90 border-emerald-100 text-emerald-900' 
                : 'bg-white/90 border-red-100 text-red-900'
            }`}
          >
            <div className={`p-3 rounded-2xl ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} shadow-inner`}>
              {toast.type === 'success' ? (
                <CheckCircle className="w-6 h-6 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 shrink-0" />
              )}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-black leading-tight tracking-tight">{toast.message}</span>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1 opacity-60 ${toast.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                {toast.type === 'success' ? 'عملية ناجحة' : 'تنبيه من النظام'}
              </span>
            </div>
            <button 
              onClick={() => setToast(null)}
              className={`group/close p-2.5 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-90 ${
                toast.type === 'success' 
                  ? 'hover:bg-emerald-50 text-emerald-300 hover:text-emerald-600' 
                  : 'hover:bg-red-50 text-red-300 hover:text-red-600'
              }`}
              title="إغلاق التنبيه"
            >
              <X className="w-5 h-5 transition-transform group-hover/close:rotate-90" />
            </button>
            
            {/* Animated Progress Bar */}
            <div className="absolute bottom-0 left-4 right-4 h-1 bg-gray-100/50 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام إدارة التنظيم السياسي</h1>
          <p className="text-gray-500">لوحة التحكم الرئيسية لإدارة المنتمين والاستمارات</p>
        </div>
        <button 
          onClick={() => onAddMember()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <UserPlus className="w-5 h-5" />
          إضافة منتمي جديد
        </button>
      </div>

      {/* Custom Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6 text-red-600">
              <div className="bg-red-100 p-4 rounded-2xl shadow-inner shadow-red-200/50 animate-pulse">
                <Trash2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black">تأكيد الحذف</h3>
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest">إجراء غير قابل للتراجع</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              هل أنت متأكد من حذف هذا المنتمي؟ سيتم حذف جميع بياناته وصوره نهائياً من النظام. لا يمكن التراجع عن هذا الإجراء.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-200"
              >
                نعم، احذف الآن
              </button>
              <button 
                onClick={() => setMemberToDelete(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all active:scale-95"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-600">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">إجمالي المنتمين</p>
            <p className="text-3xl font-bold text-gray-900">{members.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="bg-emerald-100 p-4 rounded-lg text-emerald-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">الاستمارات المكتملة</p>
            <p className="text-3xl font-bold text-gray-900">{members.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="bg-purple-100 p-4 rounded-lg text-purple-600">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold">النشاط الأخير</p>
            <p className="text-3xl font-bold text-gray-900">اليوم</p>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
              {selectedIds.size} مختار
            </span>
            <span className="font-medium hidden sm:inline">تم تحديد عدد من المنتمين لإجراء عمليات جماعية</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={downloadCSV}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              تصدير CSV ({selectedIds.size})
            </button>
            <button 
              onClick={() => {
                if (window.confirm(`هل أنت متأكد من حذف ${selectedIds.size} منتمين؟`)) {
                  setMembers(prevMembers => {
                    const updated = prevMembers.filter(m => !selectedIds.has(m.id));
                    localStorage.setItem('members_list', JSON.stringify(updated));
                    return updated;
                  });
                  
                  // Clean up localStorage for each deleted member
                  selectedIds.forEach(id => {
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                      if (key.includes(id)) localStorage.removeItem(key);
                    });
                  });
                  
                  const count = selectedIds.size;
                  setSelectedIds(new Set());
                  showToast(`تم حذف ${count} منتمين بنجاح`);
                }
              }}
              className="bg-red-500 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              حذف المحدد ({selectedIds.size})
            </button>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Search and Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
            سجل المنتمين
          </h2>
          
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors text-right"
              placeholder="ابحث بالاسم، رقم الهاتف، أو المحافظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-4 sm:px-6 py-4 text-right border-b border-gray-100 w-10">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all"
                      checked={processedMembers.length > 0 && selectedIds.size === processedMembers.length}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-4 sm:px-6 py-4 text-right text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer group select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    الاسم الرباعي واللقب
                    <SortIndicator column="name" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="hidden sm:table-cell px-6 py-4 text-right text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer group select-none"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center gap-2">
                    رقم الهاتف
                    <SortIndicator column="phone" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="hidden md:table-cell px-6 py-4 text-right text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer group select-none"
                  onClick={() => handleSort('governorate')}
                >
                  <div className="flex items-center gap-2">
                    المحافظة
                    <SortIndicator column="governorate" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="hidden lg:table-cell px-6 py-4 text-right text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer group select-none"
                  onClick={() => handleSort('dateAdded')}
                >
                  <div className="flex items-center gap-2">
                    تاريخ الإضافة
                    <SortIndicator column="dateAdded" />
                  </div>
                </th>
                <th scope="col" className="px-4 sm:px-6 py-4 text-center text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedMembers.length > 0 ? (
                processedMembers.map((member, index) => (
                  <tr 
                    key={member.id} 
                    onClick={(e) => toggleSelectMember(member.id, e)}
                    className={`group hover:bg-blue-50/40 transition-all duration-200 cursor-pointer odd:bg-white even:bg-gray-50/50 ${selectedIds.has(member.id) ? 'bg-blue-50/60' : ''}`}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap border-r-4 border-transparent group-hover:border-blue-500 transition-all w-10">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer transition-all"
                          checked={selectedIds.has(member.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectMember(member.id, e as any);
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 border border-blue-200 shadow-sm">
                          {member.name ? member.name.charAt(0) : '?'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 truncate max-w-[140px] sm:max-w-xs">{member.name || 'بدون اسم'}</span>
                            <span className="text-[10px] font-mono bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded border border-blue-100/50">
                              {member.id}
                            </span>
                          </div>
                          <span className="sm:hidden text-[10px] text-gray-500 mt-0.5 font-medium" dir="ltr">{member.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      <span dir="ltr" className="bg-gray-100 px-2 py-1 rounded text-xs">{member.phone || '---'}</span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {member.governorate || '---'}
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded">{member.dateAdded}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-2">
                        <motion.button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddMember(member.id);
                          }}
                          whileHover={{ scale: 1.1, backgroundColor: '#eff6ff' }}
                          whileTap={{ scale: 0.9 }}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 bg-blue-50/50 px-3.5 py-2 rounded-xl transition-colors border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md group/edit"
                          title="تعديل بيانات المنتمي"
                        >
                          <Edit className="w-4 h-4 transition-transform group-hover/edit:-rotate-12 group-hover/edit:scale-110" />
                          <span className="hidden sm:inline font-black text-xs uppercase tracking-wider">تعديل</span>
                        </motion.button>
                        <motion.button 
                          onClick={(e) => deleteMember(member.id, e)}
                          whileHover={{ scale: 1.1, backgroundColor: '#fef2f2' }}
                          whileTap={{ scale: 0.9 }}
                          className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 bg-red-50/50 px-3.5 py-2 rounded-xl transition-colors border border-red-100 hover:border-red-300 shadow-sm hover:shadow-md group/del"
                          title="حذف هذا المنتمي نهائياً من النظام"
                        >
                          <Trash2 className="w-4 h-4 transition-transform group-hover/del:rotate-12 group-hover/del:scale-110" />
                          <span className="hidden sm:inline font-black text-xs uppercase tracking-wider">حذف</span>
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FileText className="w-12 h-12 mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900 mb-1">لا يوجد منتمين</p>
                      <p className="text-sm">ابدأ بإضافة أول منتمي للنظام.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
