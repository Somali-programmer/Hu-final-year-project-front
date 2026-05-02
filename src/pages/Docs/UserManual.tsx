import React from 'react';
import { BookOpen, CheckCircle, Smartphone, MonitorPlay, AlertTriangle } from 'lucide-react';

const UserManual: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-xl flex gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div className="space-y-1 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold">Project Defense Notice</p>
          <p>
            This manual outlines the operational workflow for end-users interacting with the HU-AMS platform.
          </p>
          <p className="opacity-80 pt-1">
            <strong>Note:</strong> Following the final year presentation, internal test credentials and simulated environment instructions will be removed to ensure production integrity and security.
          </p>
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-3 text-brand-primary">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-4xl font-serif font-bold tracking-tight">User Manual</h1>
        </div>
        <p className="text-gray-500 text-lg">
          Step-by-step instructions for Instructors, Students, and Administrators to navigate the HU-AMS platform.
        </p>
      </header>

      <section className="space-y-8">
        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <MonitorPlay className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-bold text-brand-text">For Instructors</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <h3 className="font-bold text-lg text-brand-primary">Starting an Attendance Session</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to the portal using your University Email.</li>
              <li>Navigate to the <strong>Sessions</strong> tab in your dashboard.</li>
              <li>Select your active Class/Section from the dropdown.</li>
              <li>Configure the Session (Duration, Late Threshold).</li>
              <li>Ensure your device GPS is enabled and allowed in the browser.</li>
              <li>Click <strong>Start Session</strong>. A 6-digit token will be displayed on your screen to share with students.</li>
            </ol>
            
            <h3 className="font-bold text-lg text-brand-primary mt-6">Monitoring & Reports</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Open the <strong>Reports</strong> tab to see overall attendance percentage.</li>
              <li>You can view individual attendance records for your scheduled sections.</li>
              <li>Export attendance directly using the "Export" button for grading.</li>
            </ul>
          </div>
        </div>

        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Smartphone className="w-6 h-6 text-hu-gold" />
            <h2 className="text-2xl font-bold text-brand-text">For Students</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <h3 className="font-bold text-lg text-brand-primary">Marking Your Attendance</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in with your Student ID (Username).</li>
              <li>Go to the <strong>Mark Attendance</strong> tab.</li>
              <li>View active sessions for your enrolled courses.</li>
              <li>Click "Mark Attendance" on an active session.</li>
              <li><strong>Critical:</strong> You MUST allow location access in your browser when prompted. Without GPS, attendance cannot be recorded.</li>
              <li>Enter the 6-digit token provided by your instructor.</li>
              <li>A success notification will appear once the system verifies your location is within the class radius.</li>
            </ol>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 p-4 rounded-xl flex gap-3 text-sm mt-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-yellow-800 dark:text-yellow-600">
                If you get a "Not inside geofence" error, ensure your Wi-Fi is on (it helps GPS accuracy) and you are physically inside the designated lecture hall or center.
              </p>
            </div>
          </div>
        </div>

        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-brand-text">For Administrators</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <h3 className="font-bold text-lg text-brand-primary">Managing Users</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Navigate to <strong>Administration &gt; Students</strong> or <strong>Staff</strong>.</li>
              <li>Use the Bulk Import tool with the provided CSV template to add multiple users quickly.</li>
              <li>Reset passwords and assign roles (Instructor, QA, Admin).</li>
            </ul>

            <h3 className="font-bold text-lg text-brand-primary mt-6">Sections & Enrollments</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure <strong>Programs</strong> and <strong>Batches</strong> are configured properly.</li>
              <li>When assigning a Section to a Course, link the correct Instructor.</li>
              <li>The system uses "Autonomous Enrollment". Once a Section is created for a given Batch and Center, students in that Batch are automatically enrolled by database triggers.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserManual;
