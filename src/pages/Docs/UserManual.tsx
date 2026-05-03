import React from 'react';
import { BookOpen, CheckCircle, Smartphone, MonitorPlay, AlertTriangle, ShieldCheck, FileSpreadsheet, Lock, Key, Target, Activity, FileDown, Layers, Users, Combine } from 'lucide-react';

const UserManual: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl flex gap-4 md:items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold text-base">Project Defense Notice: Operational Workflow</p>
          <p className="leading-relaxed">
            This module represents Phase 3 of the structural defense documentation. It outlines the 10 core operational workflows and step-by-step procedures for all authorized personnel interacting with the HU-AMS platform.
          </p>
        </div>
      </div>

      <header className="space-y-4 border-b border-brand-primary/10 pb-8">
        <div className="flex items-center gap-3 text-brand-primary">
          <BookOpen className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">System User Manual</h1>
        </div>
        <p className="text-gray-500 text-lg md:text-xl max-w-3xl leading-relaxed">
          Comprehensive step-by-step operational instructions mapping all essential requirements for complete system utilization.
        </p>
      </header>

      <section className="space-y-8">
        
        {/* Core & Universal */}
        <div className="hu-card p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
            <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">01</span>
            Authentication & Safe Onboarding (All Users)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every user interacting with the platform must undergo verification. Access the central portal and provide your University credentials. Do not share or attempt to proxy logins, as your JWT payload binds your exact permissions to your device. Support is available for compromised credentials via the IT desk mapping.
          </p>
        </div>

        {/* INSTRUCTORS */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4 border-t-4 border-brand-primary">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-primary">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">02</span>
              Instructor: Genesis (Session Creation)
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> Navigate to the <code className="text-xs bg-gray-100 p-1 rounded">Sessions</code> tab. Select your target Section. Define boundaries including session length and late-threshold limits. The platform mandates that you grant HTML5 Location Access to establish the Session's "Zero-Point Geofence". Upon clicking "Start", display the generated 6-digit cryptographic seed to the lecture hall.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 border-t-4 border-brand-primary">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-primary">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">03</span>
               Instructor: Live Monitoring & Overrides
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> Open the <code className="text-xs bg-gray-100 p-1 rounded">Reports</code> tab while a session is active. Do not refresh; the system leverages WAL streams to push updates autonomously. In scenarios where a student's device fails algorithmically due to hardware constraints, the Instructor holds authorization to perform a manual Attendance Override directly from their ledger view.
            </p>
          </div>
        </div>

        {/* STUDENTS */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="hu-card p-8 space-y-4 border-t-4 border-hu-gold">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-hu-gold">
              <span className="bg-hu-gold/20 text-hu-gold w-8 h-8 flex items-center justify-center rounded-lg text-sm">04</span>
              Student: Discovery & Cryptographic Check-in
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> Upon logging in, go to the <code className="text-xs bg-gray-100 p-1 rounded">Mark Attendance</code> hub. Locate the actively broadcasting session matching your timeline. Inject the volatile 6-digit seed displayed by the Instructor. If accurate, the request securely transmits your coordinates for verification.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 border-t-4 border-hu-gold">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-hu-gold">
              <span className="bg-hu-gold/20 text-hu-gold w-8 h-8 flex items-center justify-center rounded-lg text-sm">05</span>
              Student: Perimeter Troubleshooting
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              If the system halts and outputs <em>"Not inside geofence"</em>, this is a calculated mathematical rejection. To resolve: 
              <br/>1. Verify your device Wi-Fi is enabled (dramatically improves GPS precision via cell-tower mapping). 
              <br/>2. Click "Allow" on the browser's Location prompt. 
              <br/>3. Physically move closer to the Instructor to enter the 50m radius.
            </p>
          </div>
        </div>

        {/* QUALITY ASSURANCE (QA) */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4 border-t-4 border-purple-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-600">
              <span className="bg-purple-600/10 text-purple-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">06</span>
               QA: Navigating Systemic Reports
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> Ensure your RBAC level is QA. Access the <code className="text-xs bg-gray-100 p-1 rounded">Analytics Hub</code>. You possess "God's Eye" read-only access. Monitor macro-trajectories by filtering variables such as entire Batches, Programs, or specific Campus Centers to flag anomalous absenteeism trends over a semester timeline.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 border-t-4 border-purple-500">
             <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-600">
              <span className="bg-purple-600/10 text-purple-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">07</span>
              QA: Exporting Audit Logs
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> For institutional compliance meetings with academic Deans, utilize the <code className="text-xs bg-gray-100 p-1 rounded">Export Module</code>. Configure parameters (date range, department, section) and download robust, tamper-evident CSV ledgers that provide immutable historical records of compliance.
            </p>
          </div>
        </div>

        {/* ADMINISTRATORS */}
        <div className="hu-card p-8 space-y-4 border-t-4 border-green-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-green-700">
              <span className="bg-green-600/10 text-green-700 w-8 h-8 flex items-center justify-center rounded-lg text-sm">08</span>
              Admin: Institutional Skeleton Mapping
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> Administrators do not collect attendance. Instead, they define mapping logic. Navigate to <code className="text-xs bg-gray-100 p-1 rounded">Admin Console</code>. First, map out the Centers (Main, Harar). Then forge Departments, assign Programs (Regular/Extension), and generate Batches matching the current Academic Year. This exact structure prevents data collisions.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4 border-t-4 border-green-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-green-700 mt-1">
              <span className="bg-green-600/10 text-green-700 w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0">09</span>
              Admin: Fast-Track Ingestion (CSV)
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> Under <code className="text-xs bg-gray-100 p-1 rounded">Users &gt; Bulk Import</code>. Manually typing 4,000 students is impossible. Download the system's exact CSV Schema Template. Populate it with Student IDs, Names, Batch mapping IDs, and emails. Upload it to instantly forge user accounts and trigger Postgres to auto-enroll them in their generated Sections.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 border-t-4 border-green-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-green-700 mt-1">
              <span className="bg-green-600/10 text-green-700 w-8 h-8 flex items-center justify-center rounded-lg text-sm shrink-0">10</span>
              Admin: Cohort Promotion (Advance Term)
            </h2>
             <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Workflow:</strong> At the close of an academic period, navigate to the <code className="text-xs bg-gray-100 p-1 rounded">Batch Management</code> panel. Execute the administrative "Advance Term" protocol. This mathematically increments the <code>current_semester</code> index for a program. If it exceeds constraints (e.g., &gt; 2 for Regular), it autonomously loops to Sem 1 and increments the Cohort Year.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default UserManual;

