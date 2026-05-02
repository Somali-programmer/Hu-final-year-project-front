import React from 'react';
import { Book, Shield, Users, MapPin, Zap, Database, Lock, Server, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

const SystemDocumentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-xl flex gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div className="space-y-1 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold">Project Defense Notice</p>
          <p>
            This documentation is prepared for the Haramaya University Final Year Project Defense. It contains deep developer-level explanations of the proprietary algorithms and business logic designed by the student developers.
          </p>
          <p className="opacity-80 pt-1">
            <strong>Note:</strong> This is a temporary detailed view. We will remove sensitive infrastructure information (such as specific trigger codes and JWT signing strategies) after the presentation day to ensure production security.
          </p>
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-3 text-brand-primary">
          <Book className="w-8 h-8" />
          <h1 className="text-4xl font-serif font-bold tracking-tight">System Documentation</h1>
        </div>
        <p className="text-gray-500 text-lg">
          A comprehensive developer guide to the HU Smart Attendance Management System.
        </p>
      </header>

      <section className="space-y-8">
        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-hu-gold" />
            <h2 className="text-2xl font-bold text-brand-text">1. User Roles & Access Control</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-brand-primary">Administration</h3>
              <p className="text-sm text-gray-500">System super-users. They manage the entity-relationship mappings (Departments → Programs → Batches) and execute the `Advance Term` database functions.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-brand-primary">Instructors</h3>
              <p className="text-sm text-gray-500">Session owners. They generate cryptographically secure 6-digit tokens and bind their live GPS coordinates as the session's geographic epicenter.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-brand-primary">Students</h3>
              <p className="text-sm text-gray-500">Clients who must satisfy both temporal (token validity) and spatial (geofence radius) constraints to register attendance.</p>
            </div>
          </div>
        </div>

        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-bold text-brand-text">2. Core Business Logic: Attendance Workflow</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            The attendance verification process is not a simple boolean flag. It is a multi-stage validation pipeline running on the Node.js Express backend.
          </p>
          <div className="space-y-6 text-gray-600 list-decimal pl-4">
            <div className="flex gap-4">
              <div className="font-bold text-brand-primary whitespace-nowrap">Step 01: Initiation</div>
              <div>
                <p>Instructor initializes a session. The system captures the instructor's coordinates <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">(lat_1, lon_1)</code>. A 6-digit token is generated and hashed using bcrypt before database insertion to prevent DB-level token scraping.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-brand-primary whitespace-nowrap">Step 02: Verification</div>
              <div>
                <p>Student enters the token. The backend first compares the bcrypt hash. If valid, the backend calculates the Haversine distance between the Section's epicenter <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">(lat_1, lon_1)</code> and the student's payload coordinates <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">(lat_2, lon_2)</code>.</p>
                <div className="bg-brand-bg rounded-xl p-4 mt-2 font-mono text-[11px] text-brand-muted">
                  <span className="text-brand-primary">const</span> dLat = toRad(lat2 - lat1);<br/>
                  <span className="text-brand-primary">const</span> a = Math.sin(dLat/2) * Math.sin(dLat/2) + ...;<br/>
                  <span className="text-brand-primary">const</span> distance = R * c; // Earth's radius * angular distance
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="font-bold text-brand-primary whitespace-nowrap">Step 03: Temporal Check</div>
              <div>
                <p>The system checks if <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">CURRENT_TIMESTAMP</code> &gt; <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">session.token_expiry</code>. If passed, but beyond the <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">late_threshold</code>, the status is marked as 'Late'. Otherwise, 'Present'.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-brand-text">3. Security Algorithms</h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-6 list-disc pl-4 text-sm text-gray-500">
            <li><strong>Password Hashing:</strong> We use <code className="text-xs">bcryptjs</code> with a Work Factor of 10 for all stored passwords. Plain text passwords never hit the database.</li>
            <li><strong>JWT Implementation:</strong> Stateless authentication. The JWT payload contains only <code className="text-xs">id, role, username</code>. Signed with a secure <code className="text-xs">HS256</code> algorithm and strict expiration.</li>
            <li><strong>SQL Injection Prevention:</strong> By utilizing the Supabase SDK, all inputs are parameterized before query execution.</li>
            <li><strong>Geofence Integrity:</strong> Future implementations will analyze User-Agent and connection IP to detect coordinate spoofing (simulated locations).</li>
          </ul>
        </div>
        
        <div className="hu-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-bold text-brand-text">4. Database Triggers & Auto-Enrollment</h2>
          </div>
          <p className="text-sm text-gray-500">
            To prevent performance bottlenecks in Express.js loops, we pushed the "Auto-Enrollment" logic down to the PostgreSQL layer using PL/pgSQL triggers.
          </p>
          <div className="bg-brand-bg rounded-xl p-4 text-[11px] font-mono text-brand-muted overflow-x-auto">
            <span className="text-purple-500">CREATE OR REPLACE FUNCTION</span> auto_enroll_students()<br/>
            RETURNS TRIGGER AS $$<br/>
            <span className="text-purple-500">BEGIN</span><br/>
            &nbsp;&nbsp;<span className="text-gray-400">-- Find all active sections where section.batch_id == new.batch_id</span><br/>
            &nbsp;&nbsp;<span className="text-purple-500">INSERT INTO</span> enrollments (student_id, section_id)<br/>
            &nbsp;&nbsp;<span className="text-purple-500">SELECT</span> NEW.id, id <span className="text-purple-500">FROM</span> sections<br/>
            &nbsp;&nbsp;<span className="text-purple-500">WHERE</span> batch_id = NEW.batch_id <span className="text-purple-500">AND</span> center_id = NEW.center_id;<br/>
            &nbsp;&nbsp;<span className="text-purple-500">RETURN</span> NEW;<br/>
            <span className="text-purple-500">END</span>; $$ LANGUAGE plpgsql;
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This guarantees <strong>The "Always-Sync" Principle</strong>, meaning the database guarantees data consistency without relying on the Node.js event loop.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SystemDocumentation;
