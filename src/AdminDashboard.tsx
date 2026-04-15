import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { User, Course, Section, UserRole, Semester, ProgramType, Center, DayOfWeek } from './types';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Users, 
  BookOpen, 
  Settings, 
  ShieldCheck, 
  Database, 
  Search, 
  Trash2, 
  Edit2, 
  Eye,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2, 
  X,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  Download,
  Upload,
  FileSpreadsheet,
  Calendar,
  Lock,
  FileText
} from 'lucide-react';
import Papa from 'papaparse';
import AnalyticsCard from './components/AnalyticsCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from 'recharts';

import { useNavigate } from 'react-router-dom';
import { useAppData } from './AppDataContext';

interface AdminDashboardProps {
  view?: 'overview' | 'staff' | 'students' | 'courses' | 'sections' | 'semesters' | 'settings' | 'audit' | 'centers';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ view = 'overview' }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { 
    users, courses, sections, semesters, auditLogs, centers,
    addSemester, setActiveSemester, addSection, updateSection, deleteSection,
    addUser, updateUser, deleteUser, addCourse, updateCourse, deleteCourse, addAuditLog,
    addCenter, updateCenter, deleteCenter
  } = useAppData();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBackup = () => {
    alert('System data backup initiated... (Mock Action)');
  };

  const handleDownloadTemplate = () => {
    const csvContent = "fullName,email,idNumber,programType,center,batch\nMawlid Mahamed Abdi,mawlid.mahamed@haramaya.edu.et,0331/15,regular,main,2023 Batch\nMustafe Kadar Kalif,mustafe.kadar@haramaya.edu.et,0328/15,regular,main,2023 Batch";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "student_import_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        const errors: string[] = [];
        
        // Basic validation
        data.forEach((row, index) => {
          if (!row.fullName || !row.email) {
            errors.push(`Row ${index + 1}: Name and Email are required.`);
          }
        });

        setImportData(data);
        setImportErrors(errors);
      }
    });
  };

  const processImport = () => {
    if (importErrors.length > 0) {
      alert("Please fix errors before importing.");
      return;
    }

    importData.forEach(student => {
      const newUser: User = {
        userId: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fullName: student.fullName,
        email: student.email,
        idNumber: student.idNumber,
        role: 'student',
        department: 'Computer Science',
        programType: (student.programType?.toLowerCase() || 'regular') as ProgramType,
        center: (student.center?.toLowerCase() || (centers.length > 0 ? centers[0].centerId : 'main')) as Center,
        batch: student.batch,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      addUser(newUser);
    });

    addAuditLog({
      action: 'CREATE',
      entityType: 'USER',
      entityId: 'bulk-import',
      entityName: 'Bulk Student Import',
      performedBy: currentUser?.fullName || 'Admin',
      details: `Imported ${importData.length} students via CSV`
    });

    setIsImportModalOpen(false);
    setImportData([]);
    setImportErrors([]);
    alert(`Successfully imported ${importData.length} students.`);
  };

  const handleDownloadDeptReport = (dept: string) => {
    alert(`Generating department-level report for ${dept}... (Mock Download)`);
  };

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    type?: 'danger' | 'warning';
  } | null>(null);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [selectedSectionDetails, setSelectedSectionDetails] = useState<Section | null>(null);

  // Student Management Filters
  const [filterCenter, setFilterCenter] = useState<Center | 'all'>('all');
  const [filterProgram, setFilterProgram] = useState<ProgramType | 'all'>('all');
  const [filterBatch, setFilterBatch] = useState<string>('all');

  // Form States
  const [userForm, setUserForm] = useState<Partial<User>>({
    fullName: '',
    email: '',
    role: 'student',
    department: 'Computer Science',
    idNumber: '',
    isActive: true,
    programType: 'regular',
    center: centers.length > 0 ? centers[0].centerId : 'main',
    batch: ''
  });

  const [courseForm, setCourseForm] = useState<Partial<Course>>({
    courseCode: '',
    title: '',
    creditHours: 3,
    department: 'Computer Science'
  });

  const [sectionForm, setSectionForm] = useState<Partial<Section>>({
    courseId: '',
    instructorId: '',
    room: '',
    programType: 'regular',
    center: centers.length > 0 ? centers[0].centerId : 'main',
    startDate: '',
    endDate: '',
    schedule: [],
    meetingDates: [],
    midExamDates: [],
    finalExamDates: []
  });

  const [semesterForm, setSemesterForm] = useState<Partial<Semester>>({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });

  const [centerForm, setCenterForm] = useState({ name: '', location: '', description: '' });
  const [editingCenter, setEditingCenter] = useState<any>(null);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.userId, userForm);
      addAuditLog({
        action: 'UPDATE',
        entityType: 'USER',
        entityId: editingUser.userId,
        entityName: userForm.fullName || editingUser.fullName,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Updated user ${userForm.role}`
      });
    } else {
      const newUser: User = {
        ...userForm,
        userId: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        isActive: true
      } as User;
      addUser(newUser);
      addAuditLog({
        action: 'CREATE',
        entityType: 'USER',
        entityId: newUser.userId,
        entityName: newUser.fullName,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Created new ${newUser.role}`
      });
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserForm({ fullName: '', email: '', role: 'student', department: 'Computer Science', idNumber: '', isActive: true });
  };

  const handleDeleteUser = (userId: string) => {
    setConfirmConfig({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete User',
      onConfirm: () => {
        const userToDelete = users.find(u => u.userId === userId);
        deleteUser(userId);
        if (userToDelete) {
          addAuditLog({
            action: 'DELETE',
            entityType: 'USER',
            entityId: userId,
            entityName: userToDelete.fullName,
            performedBy: currentUser?.fullName || 'Admin',
            details: `Deleted user ${userToDelete.role}`
          });
        }
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      updateCourse(editingCourse.courseId, courseForm);
      addAuditLog({
        action: 'UPDATE',
        entityType: 'COURSE',
        entityId: editingCourse.courseId,
        entityName: courseForm.title || editingCourse.title,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Updated course ${courseForm.courseCode}`
      });
    } else {
      const newCourse: Course = {
        ...courseForm,
        courseId: `course-${Date.now()}`
      } as Course;
      addCourse(newCourse);
      addAuditLog({
        action: 'CREATE',
        entityType: 'COURSE',
        entityId: newCourse.courseId,
        entityName: newCourse.title,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Created course ${newCourse.courseCode}`
      });
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
    setCourseForm({ courseCode: '', title: '', creditHours: 3, department: 'Computer Science' });
  };

  const handleDeleteCourse = (courseId: string) => {
    setConfirmConfig({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course? All associated sections may be affected.',
      type: 'danger',
      confirmText: 'Delete Course',
      onConfirm: () => {
        const courseToDelete = courses.find(c => c.courseId === courseId);
        deleteCourse(courseId);
        if (courseToDelete) {
          addAuditLog({
            action: 'DELETE',
            entityType: 'COURSE',
            entityId: courseId,
            entityName: courseToDelete.title,
            performedBy: currentUser?.fullName || 'Admin',
            details: `Deleted course ${courseToDelete.courseCode}`
          });
        }
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleSaveSemester = (e: React.FormEvent) => {
    e.preventDefault();
    const newSemester = {
      ...semesterForm,
      semesterId: `sem-${Date.now()}`
    } as Semester;
    
    addSemester(newSemester);
    if (newSemester.isActive) {
      setActiveSemester(newSemester.semesterId);
    }
    
    addAuditLog({
      action: 'CREATE',
      entityType: 'SEMESTER',
      entityId: newSemester.semesterId,
      entityName: newSemester.name,
      performedBy: currentUser?.fullName || 'Admin',
      details: `Created semester (Active: ${newSemester.isActive})`
    });
    
    setIsSemesterModalOpen(false);
    setSemesterForm({ name: '', startDate: '', endDate: '', isActive: false });
  };

  const handleSaveCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCenter) {
      updateCenter(editingCenter.centerId, centerForm);
      addAuditLog({
        action: 'UPDATE',
        entityType: 'CENTER',
        entityId: editingCenter.centerId,
        entityName: centerForm.name,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Updated center ${centerForm.name}`
      });
    } else {
      const newCenter = {
        ...centerForm,
        centerId: centerForm.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString()
      };
      addCenter(newCenter);
      addAuditLog({
        action: 'CREATE',
        entityType: 'CENTER',
        entityId: newCenter.centerId,
        entityName: newCenter.name,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Created center ${newCenter.name}`
      });
    }
    setIsCenterModalOpen(false);
    setCenterForm({ name: '', location: '', description: '' });
    setEditingCenter(null);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    const activeSemester = semesters.find(s => s.isActive);
    if (!activeSemester) {
      alert('Please set an active semester first.');
      return;
    }

    if (editingSection) {
      updateSection(editingSection.sectionId, sectionForm);

      addAuditLog({
        action: 'UPDATE',
        entityType: 'SECTION',
        entityId: editingSection.sectionId,
        entityName: sectionForm.room || editingSection.room,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Updated section for course ${sectionForm.courseId}`
      });
    } else {
      const newSection: Section = {
        ...sectionForm,
        sectionId: `section-${Date.now()}`,
        semesterId: activeSemester.semesterId,
        geofenceCenter: { latitude: 0, longitude: 0 }, // Default, instructor sets this
        geofenceRadius: 50
      } as Section;
      addSection(newSection);
      
      addAuditLog({
        action: 'CREATE',
        entityType: 'SECTION',
        entityId: newSection.sectionId,
        entityName: newSection.room,
        performedBy: currentUser?.fullName || 'Admin',
        details: `Created section for course ${newSection.courseId}`
      });
    }
    setIsSectionModalOpen(false);
    setEditingSection(null);
    setSectionForm({ courseId: '', instructorId: '', room: '', programType: 'regular', center: centers.length > 0 ? centers[0].centerId : 'main', startDate: '', endDate: '', schedule: [] });
  };

  const handleDeleteCenter = (centerId: string) => {
    setConfirmConfig({
      title: 'Delete Center',
      message: 'Are you sure you want to delete this center? This may affect students and sections assigned to it.',
      type: 'danger',
      confirmText: 'Delete Center',
      onConfirm: () => {
        const centerToDelete = centers.find(c => c.centerId === centerId);
        deleteCenter(centerId);
        if (centerToDelete) {
          addAuditLog({
            action: 'DELETE',
            entityType: 'CENTER',
            entityId: centerId,
            entityName: centerToDelete.name,
            performedBy: currentUser?.fullName || 'Admin',
            details: `Deleted center ${centerToDelete.name}`
          });
        }
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteSection = (sectionId: string) => {
    setConfirmConfig({
      title: 'Delete Section Assignment',
      message: 'Are you sure you want to delete this section assignment?',
      type: 'danger',
      confirmText: 'Delete Assignment',
      onConfirm: () => {
        const sectionToDelete = sections.find(s => s.sectionId === sectionId);
        deleteSection(sectionId);
        if (sectionToDelete) {
          addAuditLog({
            action: 'DELETE',
            entityType: 'SECTION',
            entityId: sectionId,
            entityName: sectionToDelete.room,
            performedBy: currentUser?.fullName || 'Admin',
            details: `Deleted section for course ${sectionToDelete.courseId}`
          });
        }
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const filteredStaff = users.filter(u => 
    u.role !== 'student' && (
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.idNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredStudents = users.filter(u => 
    u.role === 'student' && 
    (filterCenter === 'all' || u.center === filterCenter) &&
    (filterProgram === 'all' || u.programType === filterProgram) &&
    (filterBatch === 'all' || u.batch === filterBatch) &&
    (
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.idNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const batches = Array.from(new Set(users.filter(u => u.role === 'student' && u.batch).map(u => u.batch!))).sort();

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock data for charts
  const userRoleData = [
    { name: 'Students', value: users.filter(u => u.role === 'student').length },
    { name: 'Instructors', value: users.filter(u => u.role === 'instructor').length },
    { name: 'Admin', value: users.filter(u => u.role === 'admin').length },
    { name: 'QA', value: users.filter(u => u.role === 'qa').length },
  ];

  const systemActivityData = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
  ];

  const COLORS = ['#000000', '#D4AF37', '#6B7280', '#E5E7EB'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8">
        <div className="text-left">
          <p className="hu-label">Administrative Portal</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-black tracking-tight">
            System <span className="text-gray-black/40 italic">Architecture</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Removed internal tab buttons */}
        </div>
      </div>

      {view === 'overview' && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Total Users', value: users.length, icon: Users, color: 'text-hu-blue', bg: 'bg-hu-blue/10' },
              { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'text-hu-green', bg: 'bg-hu-green/10' },
              { label: 'Total Sections', value: sections.length, icon: Database, color: 'text-hu-green', bg: 'bg-hu-green/10' },
              { label: 'System Status', value: 'Operational', icon: ShieldCheck, color: 'text-hu-green', bg: 'bg-hu-green/10' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hu-card p-5 md:p-8 border-none flex flex-col items-center justify-center text-center"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner", stat.bg, stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="hu-label mb-1">{stat.label}</p>
                <p className={cn("text-2xl md:text-3xl font-serif font-bold", stat.label === 'System Status' ? 'text-hu-green' : 'text-hu-charcoal')}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Visual Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <AnalyticsCard title="User Distribution" subtitle="By Role">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 700 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </AnalyticsCard>

            <AnalyticsCard title="System Activity" subtitle="Weekly Requests">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemActivityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 700 }}
                  />
                  <Bar dataKey="value" fill="#000000" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </AnalyticsCard>
          </div>

          {/* Quick Actions Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { title: 'Course Catalog', desc: 'Architect the academic curriculum and course structures.', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50', path: '/admin/courses' },
              { title: 'Section Assignments', desc: 'Assign courses to instructors and set schedules.', icon: LayoutDashboard, color: 'text-indigo-500', bg: 'bg-indigo-50', path: '/admin/sections' },
              { title: 'Staff Management', desc: 'Manage instructors and administrative staff.', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50', path: '/admin/staff' },
              { title: 'Student Management', desc: 'Manage student enrollment and records.', icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-50', path: '/admin/students' },
              { title: 'Audit Trail', desc: 'Review system activity and administrative logs.', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-50', path: '/admin/audit' },
              { title: 'System Backup', desc: 'Securely archive all system data and configurations.', icon: Database, color: 'text-hu-gold', bg: 'bg-hu-cream', action: handleBackup }
            ].map((action) => (
              <div key={action.title} className="hu-card-alt p-6 md:p-10 space-y-6 border-none">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shadow-inner", action.bg, action.color)}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-xl md:text-2xl text-black">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{action.desc}</p>
                <button 
                  onClick={() => action.path ? navigate(action.path) : action.action?.()}
                  className="w-full py-4 bg-hu-green/10 hover:bg-hu-green hover:text-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                >
                  {action.action ? 'Execute Backup' : `Manage ${action.title.split(' ')[0]}`}
                </button>
              </div>
            ))}
          </section>

          {/* Department Reports Section */}
          <section className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-hu-green" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Departmental Reports</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {['Computer Science', 'Information Systems', 'Software Engineering', 'IT Management'].map((dept) => (
                <div key={dept} className="hu-card-alt p-6 flex items-center justify-between group hover:bg-hu-cream/20 transition-all">
                  <div>
                    <p className="text-sm font-bold text-black">{dept}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Attendance Summary</p>
                  </div>
                  <button 
                    onClick={() => handleDownloadDeptReport(dept)}
                    className="p-3 bg-hu-cream rounded-xl text-hu-green hover:bg-hu-green hover:text-white transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {(view === 'staff' || view === 'students') && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">
              {view === 'staff' ? 'Staff Management' : 'Student Management'}
            </h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  placeholder={`Search ${view}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-hu-cream/30 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ fullName: '', email: '', role: view === 'staff' ? 'instructor' : 'student', department: 'Computer Science', idNumber: '', isActive: true, batch: '' });
                  setIsUserModalOpen(true);
                }}
                className="hu-button-rounded flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest">Add {view === 'staff' ? 'Staff' : 'Student'}</span>
              </button>
            </div>
          </div>

          {view === 'students' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="hu-card-alt p-6 border-none bg-hu-green/5">
                <p className="text-[10px] font-bold text-hu-green uppercase tracking-widest">Total Students</p>
                <p className="text-3xl font-serif font-bold text-black mt-2">{filteredStudents.length}</p>
                <p className="text-xs text-gray-400 mt-1">In current filter</p>
              </div>
              <div className="hu-card-alt p-6 border-none bg-hu-gold/5">
                <p className="text-[10px] font-bold text-hu-gold uppercase tracking-widest">Active Status</p>
                <p className="text-3xl font-serif font-bold text-black mt-2">
                  {filteredStudents.filter(s => s.isActive).length}
                </p>
                <p className="text-xs text-gray-400 mt-1">Currently enrolled</p>
              </div>
              <div className="hu-card-alt p-6 border-none bg-indigo-50">
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Selected Context</p>
                <p className="text-sm font-bold text-black mt-2 capitalize">
                  {filterCenter === 'all' ? 'All Centers' : filterCenter} • {filterProgram === 'all' ? 'All Programs' : filterProgram}
                </p>
                <p className="text-xs text-gray-400 mt-1">Batch: {filterBatch === 'all' ? 'All' : filterBatch}</p>
              </div>
            </div>
          )}

          {view === 'students' && (
            <div className="flex flex-wrap items-center gap-4 p-6 bg-gray-50 rounded-[24px]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Center</label>
                <select 
                  value={filterCenter}
                  onChange={(e) => setFilterCenter(e.target.value as any)}
                  className="px-4 py-2 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all shadow-sm"
                >
                  <option value="all">All Centers</option>
                  {centers.map(c => (
                    <option key={c.centerId} value={c.centerId}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Program</label>
                <select 
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value as any)}
                  className="px-4 py-2 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all shadow-sm"
                >
                  <option value="all">All Programs</option>
                  <option value="regular">Regular</option>
                  <option value="extension">Extension</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 ml-1">Batch</label>
                <select 
                  value={filterBatch}
                  onChange={(e) => setFilterBatch(e.target.value)}
                  className="px-4 py-2 bg-white border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all shadow-sm"
                >
                  <option value="all">All Batches</option>
                  {batches.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <button 
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-2 bg-hu-charcoal text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import Students
                </button>
                <button className="px-4 py-2 bg-hu-cream text-hu-green rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-hu-green hover:text-white transition-all shadow-sm">
                  Export List
                </button>
              </div>
            </div>
          )}

          <div className="hu-card-alt overflow-hidden border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-hu-cream/20">
                    <th className="px-4 py-4 md:px-8 md:py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">User</th>
                    <th className="px-4 py-4 md:px-8 md:py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">
                      {view === 'staff' ? 'Role' : 'Program & Center'}
                    </th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">
                      {view === 'staff' ? 'Department' : 'Batch'}
                    </th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Status</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(view === 'staff' ? filteredStaff : filteredStudents).map((u, i) => (
                    <motion.tr 
                      key={u.userId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-hu-cream/10 transition-colors group"
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-hu-green/10 rounded-xl flex items-center justify-center text-hu-green font-bold text-xs shadow-sm">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-black">{u.fullName}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] font-medium text-gray-400">{u.email}</p>
                              {u.idNumber && (
                                <>
                                  <span className="text-gray-200">•</span>
                                  <p className="text-[10px] font-bold text-hu-green font-mono">{u.idNumber}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {view === 'staff' ? (
                          <span className="px-4 py-1.5 bg-hu-green/10 text-black rounded-full text-[10px] font-bold uppercase tracking-widest border border-hu-green/10">
                            {u.role}
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest w-fit",
                              u.programType === 'regular' ? 'bg-hu-green/10 text-hu-green' : 'bg-hu-gold/10 text-hu-gold'
                            )}>
                              {u.programType}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {u.center}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {view === 'staff' ? (
                          <p className="text-sm font-medium text-gray-400">{u.department}</p>
                        ) : (
                          <p className="text-sm font-bold text-black">{u.batch || 'N/A'}</p>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-hu-green uppercase tracking-widest">
                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", u.isActive ? "bg-hu-green" : "bg-red-500")} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              setEditingUser(u);
                              setUserForm(u);
                              setIsUserModalOpen(true);
                            }}
                            className="p-2 text-gray-300 hover:text-hu-gold transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.userId)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {view === 'courses' && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Course Catalog</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-hu-cream/30 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({ courseCode: '', title: '', creditHours: 3, department: 'Computer Science' });
                  setIsCourseModalOpen(true);
                }}
                className="hu-button-rounded flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest">Add Course</span>
              </button>
            </div>
          </div>

          <div className="hu-card-alt overflow-hidden border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-hu-cream/20">
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Course Code</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Title</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Credit Hours</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Department</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCourses.map((c, i) => (
                    <motion.tr 
                      key={c.courseId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-hu-cream/10 transition-colors group"
                    >
                      <td className="px-8 py-6 text-sm font-bold text-hu-green font-mono whitespace-nowrap">{c.courseCode}</td>
                      <td className="px-8 py-6 text-sm font-bold text-black whitespace-nowrap">{c.title}</td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{c.creditHours} Units</td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{c.department}</td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => {
                              setEditingCourse(c);
                              setCourseForm(c);
                              setIsCourseModalOpen(true);
                            }}
                            className="p-2 text-gray-300 hover:text-hu-gold transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(c.courseId)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {view === 'centers' && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">University Centers</h2>
            <button 
              onClick={() => {
                setEditingCenter(null);
                setCenterForm({ name: '', location: '', description: '' });
                setIsCenterModalOpen(true);
              }}
              className="hu-button-rounded flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">Add Center</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center, i) => (
              <motion.div
                key={center.centerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="hu-card group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-hu-green/10 rounded-2xl flex items-center justify-center text-hu-green group-hover:bg-hu-green group-hover:text-white transition-all duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setEditingCenter(center);
                        setCenterForm({ name: center.name, location: center.location || '', description: center.description || '' });
                        setIsCenterModalOpen(true);
                      }}
                      className="p-2 text-gray-300 hover:text-hu-gold transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCenter(center.centerId)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-hu-charcoal mb-1">{center.name}</h3>
                <p className="text-xs font-bold text-hu-green uppercase tracking-widest mb-4">{center.location || 'No Location Set'}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6">{center.description || 'No description provided.'}</p>
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Created At</span>
                    <span className="text-xs font-bold text-hu-charcoal">{new Date(center.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">ID</span>
                    <span className="text-xs font-mono font-bold text-hu-green">{center.centerId}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {view === 'semesters' && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Academic Semesters</h2>
            <button 
              onClick={() => setIsSemesterModalOpen(true)}
              className="hu-button-rounded flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">Add Semester</span>
            </button>
          </div>

          <div className="hu-card-alt overflow-hidden border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-hu-cream/20">
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Name</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Start Date</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">End Date</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Status</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {semesters.map((s, i) => (
                    <motion.tr 
                      key={s.semesterId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-hu-cream/10 transition-colors group"
                    >
                      <td className="px-8 py-6 text-sm font-bold text-black whitespace-nowrap">{s.name}</td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{s.startDate}</td>
                      <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{s.endDate}</td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {s.isActive ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest">Active</span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-widest">Inactive</span>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        {!s.isActive && (
                          <button 
                            onClick={() => {
                              setConfirmConfig({
                                title: 'Change Active Semester',
                                message: 'Warning: This will archive all current active sections and update the default view for all Instructors and Students. Proceed?',
                                type: 'warning',
                                confirmText: 'Set Active',
                                onConfirm: () => {
                                  setActiveSemester(s.semesterId);
                                  setIsConfirmModalOpen(false);
                                }
                              });
                              setIsConfirmModalOpen(true);
                            }}
                            className="text-xs font-bold text-hu-gold hover:text-hu-green uppercase tracking-widest transition-colors"
                          >
                            Set Active
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {view === 'audit' && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Audit Trail</h2>
          </div>

          <div className="hu-card-alt overflow-hidden border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-hu-cream/20">
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Timestamp</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Action</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Entity Type</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Entity Name</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Performed By</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-sm font-medium text-gray-400">
                        No audit logs available.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log, i) => (
                      <motion.tr 
                        key={log.logId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-hu-cream/10 transition-colors group"
                      >
                        <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                            log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-black whitespace-nowrap">{log.entityType}</td>
                        <td className="px-8 py-6 text-sm font-bold text-hu-green whitespace-nowrap">{log.entityName}</td>
                        <td className="px-8 py-6 text-sm font-medium text-gray-500 whitespace-nowrap">{log.performedBy}</td>
                        <td className="px-8 py-6 text-sm font-medium text-gray-400">{log.details}</td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {view === 'sections' && (
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">Section Assignments</h2>
            <button 
              onClick={() => {
                setEditingSection(null);
                setSectionForm({ courseId: '', instructorId: '', room: '', programType: 'regular', center: centers.length > 0 ? centers[0].centerId : 'main', startDate: '', endDate: '', schedule: [] });
                setIsSectionModalOpen(true);
              }}
              className="hu-button-rounded flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">Assign Section</span>
            </button>
          </div>

          <div className="hu-card-alt overflow-hidden border-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-hu-cream/20">
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Section</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Program & Center</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Course Details</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Instructor</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Room</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Schedule</th>
                    <th className="px-8 py-6 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-black/70 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sections.map((s, i) => {
                    const course = courses.find(c => c.courseId === s.courseId);
                    const instructor = users.find(u => u.userId === s.instructorId);
                    return (
                      <motion.tr 
                        key={s.sectionId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-hu-cream/10 transition-colors group"
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">ID: {s.sectionId.split('-')[1] || s.sectionId}</span>
                            <span className="text-sm font-bold text-black mt-1">Section {s.sectionId.split('-')[1] || s.sectionId}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={cn(
                              "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest w-fit",
                              s.programType === 'regular' ? 'bg-hu-green/10 text-hu-green' : 'bg-hu-gold/10 text-hu-gold'
                            )}>
                              {s.programType}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {s.center}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <p className="text-sm font-bold text-black">{course?.courseCode || 'N/A'}</p>
                          <p className="text-xs text-gray-400 mt-1 font-medium italic">{course?.title || 'Course title not found'}</p>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <p className="text-sm font-bold text-black">{instructor?.fullName || 'Unassigned'}</p>
                          <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-widest">{instructor?.userId || 'No Instructor ID'}</p>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{s.room}</td>
                        <td className="px-8 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">
                          {s.schedule.map((sch, idx) => (
                            <div key={idx}>{sch.dayOfWeek} • {sch.startTime} - {sch.endTime}</div>
                          ))}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => {
                                setSelectedSectionDetails(s);
                                setIsDetailsModalOpen(true);
                              }}
                              className="p-2 text-gray-300 hover:text-hu-green transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingSection(s);
                                setSectionForm(s);
                                setIsSectionModalOpen(true);
                              }}
                              className="p-2 text-gray-300 hover:text-hu-gold transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSection(s.sectionId)}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {view === 'settings' && (
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-black">System Configuration</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Academic Terms */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-hu-green" />
                  <h3 className="text-base md:text-lg font-bold text-black">Academic Terms</h3>
                </div>
                <button 
                  onClick={() => {
                    setSemesterForm({ name: '', startDate: '', endDate: '', isActive: false });
                    setIsSemesterModalOpen(true);
                  }}
                  className="px-4 py-2 bg-hu-green/10 text-hu-green rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-hu-green hover:text-white transition-all"
                >
                  + Add Term
                </button>
              </div>
              <div className="hu-card-alt p-5 md:p-8 space-y-6">
                <div className="space-y-4">
                  {semesters.length > 0 ? semesters.map((sem) => (
                    <div 
                      key={sem.semesterId} 
                      className={cn(
                        "flex justify-between items-center p-5 rounded-2xl transition-all border",
                        sem.isActive 
                          ? "bg-hu-green/5 border-hu-green/20" 
                          : "bg-gray-50 border-gray-100 opacity-70"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          sem.isActive ? "bg-hu-green text-white" : "bg-white text-gray-400 shadow-sm"
                        )}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">{sem.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {new Date(sem.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {new Date(sem.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {sem.isActive ? (
                          <span className="px-3 py-1 bg-hu-green text-white rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">Active</span>
                        ) : (
                          <button 
                            onClick={() => {
                              setConfirmConfig({
                                title: 'Activate Semester',
                                message: `Are you sure you want to set "${sem.name}" as the active semester? This will deactivate the current one.`,
                                type: 'warning',
                                confirmText: 'Activate',
                                onConfirm: () => {
                                  setActiveSemester(sem.semesterId);
                                  setIsConfirmModalOpen(false);
                                  addAuditLog({
                                    action: 'UPDATE',
                                    entityType: 'SEMESTER',
                                    entityId: sem.semesterId,
                                    entityName: sem.name,
                                    performedBy: currentUser?.fullName || 'Admin',
                                    details: `Activated semester ${sem.name}`
                                  });
                                }
                              });
                              setIsConfirmModalOpen(true);
                            }}
                            className="px-3 py-1 bg-white text-gray-400 border border-gray-200 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-hu-green hover:text-white hover:border-hu-green transition-all"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-xs text-gray-400 font-medium italic">No academic terms configured yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance Policies */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-hu-green" />
                <h3 className="text-lg font-bold text-black">Attendance Policies</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Regular Program Policy */}
                <div className="hu-card-alt p-5 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h4 className="font-serif font-bold text-hu-green">Regular Program</h4>
                    <span className="px-2 py-0.5 bg-hu-green/10 text-hu-green text-[9px] font-bold uppercase tracking-widest rounded-md">Standard</span>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">Threshold</p>
                        <p className="text-[10px] text-gray-400">Exam eligibility.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={80} className="w-14 px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-center outline-none" />
                        <span className="text-xs font-bold text-black">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">Geofence</p>
                        <p className="text-[10px] text-gray-400">Radius in meters.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={50} className="w-14 px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-center outline-none" />
                        <span className="text-xs font-bold text-black">m</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">Token Expiry</p>
                        <p className="text-[10px] text-gray-400">Minutes.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={15} className="w-14 px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-center outline-none" />
                        <span className="text-xs font-bold text-black">min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extension Program Policy */}
                <div className="hu-card-alt p-5 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <h4 className="font-serif font-bold text-hu-gold">Extension Program</h4>
                    <span className="px-2 py-0.5 bg-hu-gold/10 text-hu-gold text-[9px] font-bold uppercase tracking-widest rounded-md">Weekend</span>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">Threshold</p>
                        <p className="text-[10px] text-gray-400">Exam eligibility.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={75} className="w-14 px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-center outline-none" />
                        <span className="text-xs font-bold text-black">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">Geofence</p>
                        <p className="text-[10px] text-gray-400">Radius in meters.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={100} className="w-14 px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-center outline-none" />
                        <span className="text-xs font-bold text-black">m</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">Token Expiry</p>
                        <p className="text-[10px] text-gray-400">Minutes.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={30} className="w-14 px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-bold text-center outline-none" />
                        <span className="text-xs font-bold text-black">min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="hu-button-rounded py-3 px-8 text-[10px]">Save Policy Updates</button>
              </div>
            </div>
          </div>
        </section>
      )}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUserModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 md:p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-black">
                  {editingUser ? 'Edit Personnel' : 'Add New Personnel'}
                </h3>
                <button onClick={() => setIsUserModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSaveUser} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input
                      required
                      type="text"
                      value={userForm.fullName || ''}
                      onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. Dr. Abebe Kebede"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input
                      required
                      type="email"
                      value={userForm.email || ''}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="email@haramaya.edu.et"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</label>
                    <select
                      value={userForm.role || 'student'}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Administrator</option>
                      <option value="qa">QA Officer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">ID Number (Optional)</label>
                    <input
                      type="text"
                      value={userForm.idNumber || ''}
                      onChange={(e) => setUserForm({ ...userForm, idNumber: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. 0328/15"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Department</label>
                    <input
                      required
                      type="text"
                      value={userForm.department || ''}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. Computer Science"
                    />
                  </div>

                  {userForm.role === 'student' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Program Type</label>
                        <select
                          value={userForm.programType || 'regular'}
                          onChange={(e) => setUserForm({ ...userForm, programType: e.target.value as ProgramType })}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                        >
                          <option value="regular">Regular</option>
                          <option value="extension">Extension</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Center</label>
                        <select
                          value={userForm.center || (centers.length > 0 ? centers[0].centerId : 'main')}
                          onChange={(e) => setUserForm({ ...userForm, center: e.target.value as Center })}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                        >
                          {centers.map(c => (
                            <option key={c.centerId} value={c.centerId}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Batch / Cohort</label>
                        <input
                          type="text"
                          value={userForm.batch || ''}
                          onChange={(e) => setUserForm({ ...userForm, batch: e.target.value })}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                          placeholder="e.g. 2023 Batch"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-hu-green text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-hu-gold transition-all shadow-xl shadow-hu-green/20"
                  >
                    {editingUser ? 'Update Personnel' : 'Create Personnel'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Course Modal */}
      <AnimatePresence>
        {isCourseModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <h3 className="text-2xl font-serif font-bold text-black">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button onClick={() => setIsCourseModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSaveCourse} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Course Code</label>
                    <input
                      required
                      type="text"
                      value={courseForm.courseCode || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. CoSc4038"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Course Title</label>
                    <input
                      required
                      type="text"
                      value={courseForm.title || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. Distributed Systems"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Credit Hours</label>
                    <input
                      required
                      type="number"
                      value={courseForm.creditHours ?? ''}
                      onChange={(e) => setCourseForm({ ...courseForm, creditHours: parseInt(e.target.value) })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      min="1"
                      max="6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Department</label>
                    <input
                      required
                      type="text"
                      value={courseForm.department || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsCourseModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-hu-green text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-hu-gold transition-all shadow-xl shadow-hu-green/20"
                  >
                    {editingCourse ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Section Modal */}
      <AnimatePresence>
        {isSectionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSectionModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <h3 className="text-2xl font-serif font-bold text-black">
                  {editingSection ? 'Edit Section Assignment' : 'Assign New Section'}
                </h3>
                <button onClick={() => setIsSectionModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSaveSection} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Course</label>
                    <select
                      required
                      value={sectionForm.courseId || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, courseId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                    >
                      <option value="">Select Course</option>
                      {courses.map(c => (
                        <option key={c.courseId} value={c.courseId}>{c.courseCode} - {c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Instructor</label>
                    <select
                      required
                      value={sectionForm.instructorId || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, instructorId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                    >
                      <option value="">Select Instructor</option>
                      {users.filter(u => u.role === 'instructor').map(u => (
                        <option key={u.userId} value={u.userId}>{u.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Room</label>
                    <input
                      required
                      type="text"
                      value={sectionForm.room || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, room: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. Block 24, Room 102"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Program Type</label>
                    <select
                      required
                      value={sectionForm.programType || 'regular'}
                      onChange={(e) => setSectionForm({ ...sectionForm, programType: e.target.value as ProgramType })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                    >
                      <option value="regular">Regular</option>
                      <option value="extension">Extension</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Center</label>
                    <select
                      required
                      value={sectionForm.center || (centers.length > 0 ? centers[0].centerId : 'main')}
                      onChange={(e) => setSectionForm({ ...sectionForm, center: e.target.value as Center })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all appearance-none"
                    >
                      {centers.map(c => (
                        <option key={c.centerId} value={c.centerId}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Start Date</label>
                    <input
                      required
                      type="date"
                      value={sectionForm.startDate || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, startDate: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">End Date</label>
                    <input
                      required
                      type="date"
                      value={sectionForm.endDate || ''}
                      onChange={(e) => setSectionForm({ ...sectionForm, endDate: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule Blocks</label>
                    <div className="flex gap-2">
                      {sectionForm.programType === 'extension' && (
                        <button
                          type="button"
                          onClick={() => setSectionForm({
                            ...sectionForm,
                            schedule: [
                              { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '12:00' },
                              { dayOfWeek: 'Saturday', startTime: '14:00', endTime: '16:00' },
                              { dayOfWeek: 'Sunday', startTime: '08:30', endTime: '11:30' }
                            ]
                          })}
                          className="text-[10px] font-bold text-hu-gold hover:text-hu-green transition-colors border border-hu-gold/20 px-2 py-1 rounded-lg"
                        >
                          Weekend Preset
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSectionForm({
                          ...sectionForm,
                          schedule: [...(sectionForm.schedule || []), { dayOfWeek: 'Monday', startTime: '08:00', endTime: '10:00' }]
                        })}
                        className="text-xs font-bold text-hu-green hover:text-hu-gold transition-colors"
                      >
                        + Add Block
                      </button>
                    </div>
                  </div>

                  {sectionForm.schedule?.map((block, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                      <select
                        value={block.dayOfWeek || 'Monday'}
                        onChange={(e) => {
                          const newSchedule = [...(sectionForm.schedule || [])];
                          newSchedule[index].dayOfWeek = e.target.value as DayOfWeek;
                          setSectionForm({ ...sectionForm, schedule: newSchedule });
                        }}
                        className="flex-1 px-4 py-2 bg-white border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={block.startTime || ''}
                        onChange={(e) => {
                          const newSchedule = [...(sectionForm.schedule || [])];
                          newSchedule[index].startTime = e.target.value;
                          setSectionForm({ ...sectionForm, schedule: newSchedule });
                        }}
                        className="w-32 px-4 py-2 bg-white border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      />
                      <span className="text-gray-400 font-bold">-</span>
                      <input
                        type="time"
                        value={block.endTime || ''}
                        onChange={(e) => {
                          const newSchedule = [...(sectionForm.schedule || [])];
                          newSchedule[index].endTime = e.target.value;
                          setSectionForm({ ...sectionForm, schedule: newSchedule });
                        }}
                        className="w-32 px-4 py-2 bg-white border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSchedule = [...(sectionForm.schedule || [])];
                          newSchedule.splice(index, 1);
                          setSectionForm({ ...sectionForm, schedule: newSchedule });
                        }}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!sectionForm.schedule || sectionForm.schedule.length === 0) && (
                    <p className="text-xs text-gray-400 italic text-center py-4">No schedule blocks added yet.</p>
                  )}
                </div>

                {sectionForm.programType === 'extension' && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Specific Meeting Dates (Weekends)</label>
                      <button
                        type="button"
                        onClick={() => setSectionForm({
                          ...sectionForm,
                          meetingDates: [...(sectionForm.meetingDates || []), new Date().toISOString().split('T')[0]]
                        })}
                        className="text-xs font-bold text-hu-green hover:text-hu-gold transition-colors"
                      >
                        + Add Date
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {sectionForm.meetingDates?.map((date, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                          <input
                            type="date"
                            value={date || ''}
                            onChange={(e) => {
                              const newDates = [...(sectionForm.meetingDates || [])];
                              newDates[index] = e.target.value;
                              setSectionForm({ ...sectionForm, meetingDates: newDates });
                            }}
                            className="flex-1 px-3 py-2 bg-white border-none rounded-lg text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newDates = [...(sectionForm.meetingDates || [])];
                              newDates.splice(index, 1);
                              setSectionForm({ ...sectionForm, meetingDates: newDates });
                            }}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {(!sectionForm.meetingDates || sectionForm.meetingDates.length === 0) && (
                      <p className="text-xs text-gray-400 italic text-center py-2">No specific dates added. Will assume every weekend between start and end date.</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                  {/* Mid Exam Dates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-hu-gold">Mid Exam Dates</label>
                      <button
                        type="button"
                        onClick={() => setSectionForm({
                          ...sectionForm,
                          midExamDates: [...(sectionForm.midExamDates || []), '']
                        })}
                        className="text-[10px] font-bold text-hu-green hover:text-hu-gold transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {sectionForm.midExamDates?.map((date, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="date"
                            value={date || ''}
                            onChange={(e) => {
                              const newDates = [...(sectionForm.midExamDates || [])];
                              newDates[index] = e.target.value;
                              setSectionForm({ ...sectionForm, midExamDates: newDates });
                            }}
                            className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newDates = [...(sectionForm.midExamDates || [])];
                              newDates.splice(index, 1);
                              setSectionForm({ ...sectionForm, midExamDates: newDates });
                            }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final Exam Dates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-hu-gold">Final Exam Dates</label>
                      <button
                        type="button"
                        onClick={() => setSectionForm({
                          ...sectionForm,
                          finalExamDates: [...(sectionForm.finalExamDates || []), '']
                        })}
                        className="text-[10px] font-bold text-hu-green hover:text-hu-gold transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {sectionForm.finalExamDates?.map((date, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="date"
                            value={date || ''}
                            onChange={(e) => {
                              const newDates = [...(sectionForm.finalExamDates || [])];
                              newDates[index] = e.target.value;
                              setSectionForm({ ...sectionForm, finalExamDates: newDates });
                            }}
                            className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newDates = [...(sectionForm.finalExamDates || [])];
                              newDates.splice(index, 1);
                              setSectionForm({ ...sectionForm, finalExamDates: newDates });
                            }}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSectionModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-hu-green text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-hu-gold transition-all shadow-xl shadow-hu-green/20"
                  >
                    {editingSection ? 'Update Section' : 'Assign Section'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Section Details Modal */}
      <AnimatePresence>
        {isDetailsModalOpen && selectedSectionDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-black">Section Details</h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    {(() => {
                      const course = courses.find(c => c.courseId === selectedSectionDetails.courseId);
                      return `${course?.courseCode} - Section ${selectedSectionDetails.sectionId.split('-')[1] || selectedSectionDetails.sectionId}`;
                    })()}
                  </p>
                </div>
                <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="p-8 space-y-8 overflow-y-auto flex-1">
                {/* Schedule Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-hu-green">
                    <Clock className="w-5 h-5" />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Assigned Schedule</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedSectionDetails.schedule.map((block, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1">
                        <span className="text-xs font-bold text-hu-gold uppercase tracking-widest">{block.dayOfWeek}</span>
                        <span className="text-sm font-bold text-black">{block.startTime} - {block.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geofence Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-hu-green">
                    <MapPin className="w-5 h-5" />
                    <h4 className="text-sm font-bold uppercase tracking-widest">Geofence Configuration</h4>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[24px] grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Latitude</p>
                      <p className="text-sm font-mono font-bold text-black">{selectedSectionDetails.geofenceCenter.latitude.toFixed(6)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Longitude</p>
                      <p className="text-sm font-mono font-bold text-black">{selectedSectionDetails.geofenceCenter.longitude.toFixed(6)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Radius</p>
                      <p className="text-sm font-bold text-black">{selectedSectionDetails.geofenceRadius} Meters</p>
                    </div>
                  </div>
                </div>

                {/* Exam Dates Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-hu-gold">
                      <Calendar className="w-5 h-5" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Mid Exam Dates</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSectionDetails.midExamDates?.length ? selectedSectionDetails.midExamDates.map((date, idx) => (
                        <span key={idx} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                          {date}
                        </span>
                      )) : <p className="text-xs text-gray-400 italic">No mid exam dates set</p>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-hu-gold">
                      <Calendar className="w-5 h-5" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Final Exam Dates</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSectionDetails.finalExamDates?.length ? selectedSectionDetails.finalExamDates.map((date, idx) => (
                        <span key={idx} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">
                          {date}
                        </span>
                      )) : <p className="text-xs text-gray-400 italic">No final exam dates set</p>}
                    </div>
                  </div>
                </div>

                {/* Meeting Dates (Weekends) */}
                {selectedSectionDetails.programType === 'extension' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-hu-green">
                      <Calendar className="w-5 h-5" />
                      <h4 className="text-sm font-bold uppercase tracking-widest">Specific Meeting Weekends</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSectionDetails.meetingDates?.length ? selectedSectionDetails.meetingDates.map((date, idx) => (
                        <span key={idx} className="px-4 py-2 bg-hu-cream/50 text-hu-gold rounded-xl text-xs font-bold">
                          {date}
                        </span>
                      )) : <p className="text-xs text-gray-400 italic">No specific dates set</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full py-4 bg-hu-charcoal text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Semester Modal */}
      <AnimatePresence>
        {isSemesterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSemesterModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <h3 className="text-2xl font-serif font-bold text-black">
                  Add New Semester
                </h3>
                <button onClick={() => setIsSemesterModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSaveSemester} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Semester Name</label>
                    <input
                      required
                      type="text"
                      value={semesterForm.name || ''}
                      onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                      placeholder="e.g. Fall 2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Start Date</label>
                    <input
                      required
                      type="date"
                      value={semesterForm.startDate || ''}
                      onChange={(e) => setSemesterForm({ ...semesterForm, startDate: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">End Date</label>
                    <input
                      required
                      type="date"
                      value={semesterForm.endDate || ''}
                      onChange={(e) => setSemesterForm({ ...semesterForm, endDate: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActiveSemester"
                      checked={semesterForm.isActive || false}
                      onChange={(e) => setSemesterForm({ ...semesterForm, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-hu-green focus:ring-hu-green"
                    />
                    <label htmlFor="isActiveSemester" className="text-sm font-bold text-gray-700 cursor-pointer">
                      Set as Active Semester
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsSemesterModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-hu-green text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-hu-gold transition-all shadow-xl shadow-hu-green/20"
                  >
                    Add Semester
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Center Modal */}
      <AnimatePresence>
        {isCenterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCenterModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <h3 className="text-2xl font-serif font-bold text-black">
                  {editingCenter ? 'Edit Center' : 'Add New Center'}
                </h3>
                <button onClick={() => setIsCenterModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleSaveCenter} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Center Name</label>
                  <input
                    required
                    type="text"
                    value={centerForm.name}
                    onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                    placeholder="e.g. Jigjiga Extension Center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                  <input
                    type="text"
                    value={centerForm.location}
                    onChange={(e) => setCenterForm({ ...centerForm, location: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all"
                    placeholder="e.g. Jigjiga, Somali Region"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</label>
                  <textarea
                    value={centerForm.description}
                    onChange={(e) => setCenterForm({ ...centerForm, description: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-hu-gold/20 outline-none transition-all min-h-[120px]"
                    placeholder="Brief description of the center..."
                  />
                </div>
                <div className="pt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsCenterModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-hu-green text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-hu-green-dark shadow-lg shadow-hu-green/20 transition-all"
                  >
                    {editingCenter ? 'Update Center' : 'Create Center'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-hu-cream/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-hu-green/10 rounded-2xl flex items-center justify-center text-hu-green">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-black">Bulk Import Students</h3>
                    <p className="text-xs text-gray-400 font-medium">Upload CSV file to enroll multiple students at once.</p>
                  </div>
                </div>
                <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto flex-1">
                {/* Template Download */}
                <div className="p-6 bg-hu-cream/20 rounded-2xl border border-hu-gold/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-hu-gold shadow-sm">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">CSV Template</p>
                      <p className="text-[10px] text-gray-400 font-medium">Download the required format for import.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-white text-hu-gold border border-hu-gold/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-hu-gold hover:text-white transition-all"
                  >
                    Download
                  </button>
                </div>

                {/* File Upload Area */}
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-12 text-center space-y-4 hover:border-hu-green/30 transition-all bg-gray-50/50">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm text-gray-300">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">Click or drag CSV file here</p>
                      <p className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Preview / Errors */}
                {importData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Import Preview</h4>
                      <span className="px-3 py-1 bg-hu-green/10 text-hu-green rounded-full text-[10px] font-bold">
                        {importData.length} Records Found
                      </span>
                    </div>
                    
                    {importErrors.length > 0 ? (
                      <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-2">
                        <div className="flex items-center gap-2 text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-xs font-bold">Validation Errors Found</p>
                        </div>
                        <ul className="text-[10px] text-red-400 font-medium list-disc pl-4 space-y-1">
                          {importErrors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {importErrors.length > 5 && <li>And {importErrors.length - 5} more errors...</li>}
                        </ul>
                      </div>
                    ) : (
                      <div className="hu-card-alt overflow-hidden border-gray-100">
                        <table className="w-full text-left text-[10px]">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 font-bold text-gray-400 uppercase tracking-widest">Name</th>
                              <th className="px-4 py-3 font-bold text-gray-400 uppercase tracking-widest">Email</th>
                              <th className="px-4 py-3 font-bold text-gray-400 uppercase tracking-widest">ID</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {importData.slice(0, 5).map((row, i) => (
                              <tr key={i}>
                                <td className="px-4 py-3 font-bold text-black">{row.fullName}</td>
                                <td className="px-4 py-3 text-gray-400">{row.email}</td>
                                <td className="px-4 py-3 font-mono text-hu-green">{row.idNumber}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {importData.length > 5 && (
                          <div className="p-3 bg-hu-cream/10 text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            + {importData.length - 5} more records
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportData([]);
                    setImportErrors([]);
                  }}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={importData.length === 0 || importErrors.length > 0}
                  onClick={processImport}
                  className="flex-1 py-4 bg-hu-green text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-hu-gold transition-all shadow-xl shadow-hu-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Import
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && confirmConfig && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden p-8 space-y-6"
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto",
                confirmConfig.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-hu-gold/10 text-hu-gold'
              )}>
                <AlertCircle className="w-8 h-8" />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-xl font-serif font-bold text-black">{confirmConfig.title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {confirmConfig.message}
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className={cn(
                    "flex-1 py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl",
                    confirmConfig.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-hu-gold hover:bg-hu-charcoal shadow-hu-gold/20'
                  )}
                >
                  {confirmConfig.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
