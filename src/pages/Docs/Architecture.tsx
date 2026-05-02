import React from 'react';
import { Server, Database, Layers, Globe, Lock, AlertTriangle, Code, Key } from 'lucide-react';

const Architecture: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-xl flex gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
        <div className="space-y-1 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold">Project Defense Notice</p>
          <p>
            This document details the exact software architecture and design patterns utilized in the Haramaya University Attendance System (HU-AMS).
          </p>
          <p className="opacity-80 pt-1">
            <strong>Note:</strong> Some sensitive internal architectural decisions (such as specific Edge Function setups and encryption keys) may be redacted or simplified post-presentation for security reasons.
          </p>
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-3 text-hu-gold">
          <Layers className="w-8 h-8" />
          <h1 className="text-4xl font-serif font-bold tracking-tight">System Architecture</h1>
        </div>
        <p className="text-gray-500 text-lg">
          A deep dive into the HU-AMS Attendance System technical stack and logic.
        </p>
      </header>

      <section className="space-y-12">
        {/* Tech Stack Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="hu-card p-6 space-y-4">
            <div className="flex items-center gap-3 text-brand-primary">
              <Globe className="w-5 h-5" />
              <h3 className="font-bold">Frontend (Client Layer)</h3>
            </div>
            <p className="text-sm text-gray-500">
              A Single Page Application (SPA) built with <strong>React 18 + Vite</strong>. It runs entirely in the user's browser, communicating with the backend via RESTful HTTP requests.
            </p>
            <ul className="text-[10px] uppercase font-bold tracking-widest text-brand-muted flex flex-wrap gap-2">
              <li className="bg-hu-cream px-2 py-1 rounded dark:bg-brand-bg">React Router DOM</li>
              <li className="bg-hu-cream px-2 py-1 rounded dark:bg-brand-bg">Tailwind CSS</li>
              <li className="bg-hu-cream px-2 py-1 rounded dark:bg-brand-bg">Framer Motion</li>
            </ul>
          </div>

          <div className="hu-card p-6 space-y-4 shadow-xl shadow-brand-primary/5">
            <div className="flex items-center gap-3 text-brand-primary">
              <Server className="w-5 h-5" />
              <h3 className="font-bold">Backend (API Layer)</h3>
            </div>
            <p className="text-sm text-gray-500">
              A stateful <strong>Node.js & Express.js</strong> server. It acts as the gatekeeper, validating JWTs, computing GPS distances, and preventing illegal database operations.
            </p>
            <ul className="text-[10px] uppercase font-bold tracking-widest text-brand-muted flex flex-wrap gap-2">
              <li className="bg-hu-cream px-2 py-1 rounded dark:bg-brand-bg">Express Middleware</li>
              <li className="bg-hu-cream px-2 py-1 rounded dark:bg-brand-bg">JSON Web Tokens</li>
              <li className="bg-hu-cream px-2 py-1 rounded dark:bg-brand-bg">BcryptJS</li>
            </ul>
          </div>
        </div>

        {/* Database Design */}
        <div className="hu-card p-8 space-y-8 bg-brand-surface border-brand-primary/10">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-brand-primary" />
            <h2 className="text-2xl font-bold text-brand-text">PostgreSQL Relational Model</h2>
          </div>
          
          <p className="text-sm text-gray-500 max-w-2xl">
            We chose <strong>PostgreSQL (via Supabase)</strong> for its strict schema enforcement, ACID compliance, and robust trigger capabilities, which are essential for academic integrity.
          </p>

          <div className="relative border-l-2 border-hu-cream pl-6 ml-4 space-y-8 dark:border-brand-primary/20">
            <div className="space-y-2">
              <div className="absolute -left-2.5 w-5 h-5 bg-hu-gold rounded-full border-4 border-white dark:border-brand-surface" />
              <h4 className="font-bold text-brand-text">3NF Normalization</h4>
              <p className="text-sm text-gray-600">The database conforms to the Third Normal Form (3NF). <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">users</span> table only holds auth data. Academic metadata is split into <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">student_profiles</span> and <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">staff_profiles</span> linked via foreign-key 1-to-1 relationships.</p>
            </div>
            
            <div className="space-y-2">
              <div className="absolute -left-2.5 w-5 h-5 bg-brand-primary rounded-full border-4 border-white dark:border-brand-surface" />
              <h4 className="font-bold text-brand-text">The "Smart Pivot Logic" (Batches & Centers)</h4>
              <p className="text-sm text-gray-600">A <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">Section</span> is physically and temporally coupled. It requires a <code className="text-xs">course_id</code>, a <code className="text-xs">batch_id</code> (e.g., Year 3 Regular), and a <code className="text-xs">center_id</code> (e.g., Main Campus). This solves the complex routing problem of Extension vs Regular students taking the same Course.</p>
            </div>

            <div className="space-y-2">
              <div className="absolute -left-2.5 w-5 h-5 bg-brand-primary rounded-full border-4 border-white dark:border-brand-surface" />
              <h4 className="font-bold text-brand-text">Concurrent Transactions</h4>
              <p className="text-sm text-gray-600">When 200 students hit "Mark Attendance" at 08:05 AM, the Node.js server streams the DB inserts. Because the unique constraint is <code className="text-xs">(session_id, student_id)</code>, PostgreSQL naturally drops duplicate concurrent submissions without crashing the API.</p>
            </div>
          </div>
        </div>

        {/* Deep Dive into System Integration */}
        <div className="grid md:grid-cols-2 gap-6">
           <div className="hu-card p-6 space-y-4 shadow-xl shadow-brand-primary/5">
            <div className="flex items-center gap-3 text-brand-primary">
              <Code className="w-5 h-5" />
              <h3 className="font-bold">REST API Design</h3>
            </div>
            <p className="text-sm text-gray-500">
              The Express server uses a router-based design matching standard REST verbs.
            </p>
            <div className="bg-brand-bg rounded-xl p-4 font-mono text-[10px] text-brand-muted space-y-1">
               <p className="text-green-600 dark:text-green-400">GET /api/attendance/active-sessions</p>
               <p className="text-yellow-600 dark:text-yellow-400">POST /api/attendance/mark</p>
               <p className="text-blue-600 dark:text-blue-400">PUT /api/admin/advance-term</p>
            </div>
          </div>

          <div className="hu-card-alt p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-brand-text">Token Security (JWT)</h3>
            </div>
            <p className="text-sm text-gray-500">
              We bypass traditional cookie-sessions to avoid Cross-Site Request Forgery (CSRF).
            </p>
            <div className="bg-brand-bg/50 rounded-xl p-4 font-mono text-[10px] text-brand-muted space-y-1 border border-brand-primary/10">
               <p>Header: HS256</p>
               <p className="text-brand-primary">Payload: {`{ id, role, exp }`}</p>
               <p>Signature: VERIFIED_SERVER_SIDE</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Architecture;
