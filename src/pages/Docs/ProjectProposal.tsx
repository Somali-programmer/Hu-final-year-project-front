import React from 'react';
import { FileText, Target, Compass, Layers, BrainCircuit, Rocket, AlertTriangle, ArrowRightLeft, ShieldCheck, DatabaseZap, Activity, Code2, Network } from 'lucide-react';

const ProjectProposal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl flex gap-4 md:items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold text-base">Project Defense Notice: Architectural Evolution</p>
          <p className="leading-relaxed">
            This document outlines the evolutionary journey of the Haramaya University Attendance System (HU-AMS). It provides a deep dive into the engineering rationale of why the original prototype (Project I) was radically refactored into a scalable, enterprise-ready management platform (Project II).
          </p>
        </div>
      </div>

      <header className="space-y-4 border-b border-brand-primary/10 pb-8">
        <div className="flex items-center gap-3 text-brand-primary">
          <FileText className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">System Evolution & Architectural Proposal</h1>
        </div>
        <p className="text-gray-500 text-lg md:text-xl max-w-3xl leading-relaxed">
          The transformation from a localized, fragile tracking tool into a highly-scalable, university-wide operational database driven by robust declarative logic.
        </p>
      </header>

      <section className="space-y-16">
        {/* Phase 1: The Legacy Proposal */}
        <div className="hu-card p-8 md:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-hu-gold" />
            <h2 className="text-3xl font-bold text-brand-text">1. Project Genesis: The Legacy System (Project I)</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg">
            Initially, the system was conceived as a rudimentary <strong>"Online Attendance System for HU CS Students" (HU-OAS)</strong>. Its sole objective was narrow and isolated: to digitize the classroom roll-call for a specific department.
          </p>
          
          <div className="bg-brand-bg rounded-xl p-6 border border-brand-primary/10">
            <h4 className="font-bold text-brand-primary text-sm mb-4 tracking-wider uppercase flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Original Tech Stack Constraints (PERN)
            </h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-1">
                <strong className="text-brand-text block text-base">Frontend: Vanilla React.js</strong>
                <p>Lacked strict typing. UI components frequently crashed in production due to null reference errors when API payloads changed.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-brand-text block text-base">Backend: Node.js (Stateful)</strong>
                <p>The server held attendance state in memory. If the Node process crashed, ongoing attendance sessions were permanently lost.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-brand-text block text-base">Database: Local PostgreSQL</strong>
                <p>Monolithic design. Poor normalization meant duplicate student records and no clear segregation between Auth data and Profile data.</p>
              </div>
              <div className="space-y-1">
                <strong className="text-brand-text block text-base">Real-time: Socket.io</strong>
                <p>Required maintaining heavy, persistent bi-directional TCP connections. It could not scale beyond a few concurrent classroom sessions without load-balancing nightmares.</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Pivot & Why It Happened */}
        <div className="relative border-l-4 border-hu-gold pl-8 md:pl-12 ml-4 space-y-8">
          <div className="absolute -left-[26px] top-0 w-12 h-12 bg-brand-surface rounded-full border-4 border-hu-gold flex items-center justify-center">
            <Compass className="w-6 h-6 text-hu-gold" />
          </div>
          <h2 className="text-3xl font-bold text-brand-text">2. The Strategic Pivot (The Structural Flaw)</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            <p>
              During the initial implementation phase, a deep architectural audit surfaced a critical, systemic flaw: <strong>Attendance logic cannot exist in a vacuum. It is intrinsically dependent on a strict institutional hierarchy.</strong>
            </p>
            <p>
              We realized that an attendance record is meaningless on its own. It is inherently tied to a <em>Section</em>. That Section belongs to a <em>Batch</em> (e.g., Year 3), which iterates under a <em>Program</em> (Regular vs. Extension), situated in a physically distinct <em>Center</em> (Main Campus vs. Harar vs. Jigjiga).
            </p>
            
            <div className="bg-brand-primary/5 p-6 rounded-2xl space-y-4 border border-brand-primary/10">
              <h4 className="font-bold text-brand-primary text-xl flex items-center gap-2">
                <Activity className="w-6 h-6" /> The Resolution
              </h4>
              <p className="text-base text-brand-text/80">
                Building a simple "attendance app" without this underlying academic routing foundation resulted in fragile, unscalable, and hard-coded business logic. For example, Extension programs require 3 semesters per academic year, while Regular programs require exactly 2. Hardcoding these rules into the frontend or middleware was a recipe for technical debt.
              </p>
              <p className="text-base text-brand-text/80">
                <strong>We effectively paused "Project I" to build a complete "Department Management Platform" engine first.</strong> This pivot expanded the scope from a localized tracker into the highly-scalable <strong>HU-AMS (Haramaya University Attendance Management System)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Section (Deep Dive) */}
        <div className="hu-card p-8 md:p-10 space-y-10 shadow-lg">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-brand-primary" />
            <h2 className="text-3xl font-bold text-brand-text">3. Architectural Deep Dive: Legacy vs. Modern</h2>
          </div>
          <p className="text-base text-gray-500 max-w-3xl">
            We embraced a <strong>"Minor Change, Major Impact"</strong> engineering philosophy. This meant stepping back and leveraging high-level database paradigms to eradicate complex imperative code, shifting to a more fail-safe, declarative architecture.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 flex flex-col space-y-6">
              <h3 className="text-red-700 dark:text-red-400 font-bold text-xl flex items-center gap-2 border-b border-red-200 dark:border-red-800/50 pb-4">
                Project I (Imperative Bottlenecks)
              </h3>
              <ul className="space-y-6 text-sm md:text-base text-red-900/70 dark:text-red-200/70">
                <li className="space-y-1">
                  <strong className="block text-red-800 dark:text-red-300">Dynamic JS (Type Blindness)</strong>
                  JavaScript offered zero compile-time guarantees. A missing field in a JSON payload would crash the entire student dashboard silently.
                </li>
                <li className="space-y-1">
                  <strong className="block text-red-800 dark:text-red-300">O(N) Imperative Auto-Enrollment</strong>
                  When a section was created, the Node.js API ran a `for` loop to fetch 300+ students and executed 300+ individual DB insert queries. This blocked the event loop, caused memory spikes, and failed partially on network timeouts.
                </li>
                <li className="space-y-1">
                  <strong className="block text-red-800 dark:text-red-300">Stateful WebSocket Hell</strong>
                  Socket.io tightly coupled connections to a single Node instance. Real-time updates broke the moment the application was scaled horizontally across multiple containers.
                </li>
              </ul>
            </div>

            {/* The New Way */}
            <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border border-green-100 dark:border-green-900/30 flex flex-col space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Network className="w-32 h-32" />
              </div>
              <h3 className="text-green-700 dark:text-green-400 font-bold text-xl flex items-center gap-2 border-b border-green-200 dark:border-green-800/50 pb-4 z-10">
                Project II (Declarative Power)
              </h3>
              <ul className="space-y-6 text-sm md:text-base text-green-900/70 dark:text-green-200/70 z-10">
                <li className="space-y-1">
                  <strong className="block text-green-800 dark:text-green-300">Strict TypeScript End-to-End</strong>
                  Every API response maps strictly to a documented TypeScript Interface. If the database schema changes, the build fails at compile-time, preventing production outages.
                </li>
                <li className="space-y-1">
                  <strong className="block text-green-800 dark:text-green-300">O(1) Trigger-Based Enrollment</strong>
                  We moved business logic to the Database. A PostgreSQL `PL/pgSQL Trigger` executes a single cross-join insert instruction directly at the disk level. The Node server uses 0% CPU for enrollment.
                </li>
                <li className="space-y-1">
                  <strong className="block text-green-800 dark:text-green-300">Serverless WAL Streaming</strong>
                  By integrating Supabase, we leverage Postgres Write-Ahead Logs (WAL) to broadcast database mutations via stateless HTTP/WebSockets. Infinite scalability without maintaining TCP connections.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The New Intelligence Layer */}
        <div className="space-y-8">
           <h2 className="text-3xl font-bold text-brand-text border-l-4 border-brand-primary pl-4">4. Enterprise-Grade Safeguards & Intelligence</h2>
           
           <div className="grid md:grid-cols-2 gap-8">
            <div className="hu-card p-8 space-y-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-40 h-40 text-green-600" />
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-brand-text">Row Level Security (RLS)</h3>
              </div>
              <p className="text-base text-gray-600 leading-relaxed text-justify">
                Traditional Node API security relies on the developer remembering to add `WHERE user_id = req.user.id` to every single query. Human error inevitably leads to data scraping vulnerabilities. We implemented <strong>Supabase Row Level Security</strong>, moving constraints to the deepest level of the database kernel. Even if a malicious user bypasses the API, the database itself mathematically refuses to return rows that do not match the Cryptographic JWT ID of the requestor.
              </p>
            </div>

            <div className="hu-card p-8 space-y-6 relative overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BrainCircuit className="w-40 h-40 text-purple-600" />
              </div>
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-brand-text">Algorithmic Oversight</h3>
              </div>
              <p className="text-base text-gray-600 mb-4">The system architecture acts as an intelligent constraint engine:</p>
              <ul className="list-none space-y-4 text-sm md:text-base text-gray-500">
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold mt-0.5">01</span>
                  <span><strong>Geofence Interlocking:</strong> High-precision Haversine mathematical filtering prevents attendance subversion (proxy-signing) by blocking tokens entered outside a 50-meter radius of the instructor.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-purple-500 font-bold mt-0.5">02</span>
                  <span><strong>Dynamic Term Advancement:</strong> Automatically detects the difference between the 3-term Extension program and the 2-term Regular program during global cohort promotions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Vision & Action Plan */}
        <div className="bg-brand-primary text-white p-10 md:p-14 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 -translate-y-1/2 right-0 p-8 opacity-10 pointer-events-none text-hu-gold mix-blend-overlay">
            <DatabaseZap className="w-96 h-96" />
          </div>
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 border-b border-white/20 pb-6 inline-flex">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Rocket className="w-10 h-10 text-hu-gold" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">5. Professional Vision & Impact Core</h2>
            </div>
            
            <p className="text-gray-100 max-w-3xl text-xl leading-relaxed font-medium">
              HU-AMS is no longer just a digital roll-call application. It has evolved into a fully functional blueprint for the future of scalable digital administration at Haramaya University.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              <div className="bg-white/10 hover:bg-white/15 transition-colors p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-lg">
                <h4 className="font-bold text-hu-gold mb-3 text-xl tracking-wide">Institutional Scalability</h4>
                <p className="text-base text-gray-200 leading-relaxed">
                  Engineered with strict tenant logic ("Smart Pivot Logic") via Center mapping, the system is primed for immediate deployment beyond the Jigjiga Center, capable of unifying Harar, Main Campus, and extension hubs under one synchronized administrative umbrella.
                </p>
              </div>
              <div className="bg-white/10 hover:bg-white/15 transition-colors p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-lg">
                <h4 className="font-bold text-hu-gold mb-3 text-xl tracking-wide">Engineering Maturation</h4>
                <p className="text-base text-gray-200 leading-relaxed">
                  This system serves as a live demonstration that mature software engineering is not measured by writing millions of lines of imperative code. True engineering is establishing the correct relational architecture to guarantee data integrity with minimal moving parts.
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default ProjectProposal;
