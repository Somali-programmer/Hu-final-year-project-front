import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  UserCircle,
  Briefcase,
  GraduationCap,
  Play,
  CalendarDays,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const menuItems = [
  { name: 'Overview', path: '/', icon: LayoutDashboard, roles: ['student', 'instructor', 'admin', 'qa'] },
  // Admin
  { name: 'Staff', path: '/admin/staff', icon: Briefcase, roles: ['admin'] },
  { name: 'Students', path: '/admin/students', icon: GraduationCap, roles: ['admin'] },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen, roles: ['admin'] },
  { name: 'Programs', path: '/admin/programs', icon: Layers, roles: ['admin'] },
  { name: 'Batches', path: '/admin/batches', icon: Users, roles: ['admin'] },
  { name: 'Centers', path: '/admin/centers', icon: MapPin, roles: ['admin'] },
  { name: 'System Config', path: '/admin/settings', icon: Settings, roles: ['admin'] },
  // Instructor
  { name: 'Live Sessions', path: '/instructor/sessions', icon: Play, roles: ['instructor'] },
  { name: 'My Sections', path: '/instructor/sections', icon: CalendarDays, roles: ['instructor'] },
  { name: 'Reports', path: '/instructor/reports', icon: FileText, roles: ['instructor'] },
  { name: 'Session History', path: '/instructor/history', icon: Clock, roles: ['instructor'] },
  // QA
  { name: 'Audit Logs', path: '/qa/audit', icon: ShieldCheck, roles: ['qa'] },
  { name: 'Corrections', path: '/qa/corrections', icon: ClipboardCheck, roles: ['qa'] },
  { name: 'Reports', path: '/qa/reports', icon: BarChart3, roles: ['qa'] },
  // Student
  { name: 'My Attendance', path: '/student/attendance', icon: CheckCircle2, roles: ['student'] },
  { name: 'Schedule', path: '/student/schedule', icon: Calendar, roles: ['student'] },
  // Common
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['student', 'instructor', 'admin', 'qa'] },
  { name: 'Profile', path: '/profile', icon: UserCircle, roles: ['student', 'instructor', 'admin', 'qa'] },
  { name: 'Documentation', path: '/docs', icon: BookOpen, roles: ['student', 'instructor', 'admin', 'qa'] },
];
