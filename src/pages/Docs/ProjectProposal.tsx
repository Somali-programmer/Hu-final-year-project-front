import React from 'react';
import { FileText, Target, Compass, ArrowRightLeft, DatabaseZap, CheckCircle, Scale, GraduationCap, Server, Flag } from 'lucide-react';

const ProjectProposal: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl flex gap-4 md:items-center shadow-sm">
        <FileText className="w-8 h-8 text-yellow-600 flex-shrink-0" />
        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold text-base">Project Defense Notice: Structural Evolution & Proposal</p>
          <p className="leading-relaxed">
            This module represents Phase 4 of the structural defense documentation. It outlines the evolutionary journey from our original FYP Proposal (Project I) to the current enterprise-grade implementation (Project II), detailing the specific architectural sequence logic and engineering pivots executed.
          </p>
        </div>
      </div>

      <header className="space-y-4 border-b border-brand-primary/10 pb-8">
        <div className="flex items-center gap-3 text-brand-primary">
          <GraduationCap className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">Project Proposal & Evolution</h1>
        </div>
        <p className="text-gray-500 text-lg md:text-xl max-w-3xl leading-relaxed">
           A professional system architect's report bridging our original legacy proposition with the modern distributed framework we achieved.
        </p>
      </header>

      <section className="space-y-8">
        
        {/* Topic 01 */}
        <div className="hu-card p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
            <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">01</span>
            Project I Proposition (The Original Vision)
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            At inception, our FYP proposal outlined a localized "Online Attendance System for HU CS Students". The proposed solution was inherently limited: building a fast web application to replace manual roll-call using Vanilla React.js, Express.js, a Local PostgreSQL instance, and Socket.io for synchronous websocket communication.
          </p>
        </div>

        {/* Topic 02 */}
        <div className="hu-card p-8 space-y-4 border-l-4 border-l-hu-gold">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
            <span className="bg-hu-gold/20 text-hu-gold w-8 h-8 flex items-center justify-center rounded-lg text-sm">02</span>
            The Realization (Structural Dependency Flaw)
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            During the implementation phase of Project II, a deep architectural audit revealed a critical flaw: <strong>An attendance system cannot function in isolation.</strong> Building an "Attendance" module before an "Institutional Management" module was a severe inversion of system logic. An attendance record does not exist without a <em>Section</em>, which belongs to a <em>Batch</em>, inside a <em>Program</em>, under a <em>Department</em>, located at a physical <em>Center</em>.
          </p>
        </div>

        {/* Topic 03 & 04 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">03</span>
              The Core Rationale (Why We Changed)
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Persisting with the original model meant hardcoding logic (like the 3-semester Extension rule vs 2-semester Regular rule) directly into frontend JavaScript components. This would result in tremendous technical debt and guarantee structural failure if the university expanded its centers.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 border-t-4 border-t-brand-primary">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-primary">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">04</span>
              The Pivot: Minor Change, Major Impact
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We executed a strategic pivot. While retaining the PERN meta-stack, we invoked "minor" technological shifts causing a "major" system impact. We replaced raw JavaScript with strict TypeScript, guaranteeing dimensional modeling safety. And we upgraded our backend to a Serverless paradigm (Supabase), tapping into hardware-level database capabilities.
            </p>
          </div>
        </div>

        {/* Topic 05 */}
        <div className="hu-card p-8 space-y-4 border-t-4 border-purple-500">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-600">
            <span className="bg-purple-600/10 text-purple-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">05</span>
            Current Implementation: The HU-AMS Platform
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            What we have built now is essentially a Full Academic Management Platform that <em>happens</em> to perform high-speed cryptographic attendance. We constructed an institutional skeleton mapping across Main Campus, Harar, and Jigjiga first, subsequently injecting the automated attendance module on top of that deeply interlocked data tree.
          </p>
        </div>

        {/* Topic 06 & 07 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
             <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">06</span>
              Engineering Achievements
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We eradicated massive `for` loops in Node.js by pushing execution to PostgreSQL <code>PL/pgSQL Triggers</code>, allowing autonomous enrollment of hundreds of students in milliseconds. We also replaced heavy Socket.io setups with native Write-Ahead Log (WAL) streams.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4">
             <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">07</span>
               Our Vision and Mission
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our vision is to entirely digitize operational tracking across all East African academic institutions. Our mission is to prove that scaling is conquered not via more servers, but by constructing mathematically correct, hardware-optimized relationships at the database layer.
            </p>
          </div>
        </div>
        
        {/* Topic 08 */}
        <div className="hu-card p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
            <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">08</span>
             Planned Feature Achievements
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            We successfully delivered an algorithmic geofencing model (preventing proxy check-ins), a Role-Based Access Control matrix tied directly to JSON Web Tokens, asynchronous institutional mass-ingestion tools via CSV schemas, and systemic Quality Assurance dash-boarding designed to spot attendance anomalies.
          </p>
        </div>

        {/* Topic 09 & 10 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4 bg-red-50/50 dark:bg-red-900/10 border-t-4 border-red-500">
             <h2 className="text-2xl font-bold flex items-center gap-3 text-red-700 dark:text-red-400">
              <span className="bg-red-500/10 text-red-700 dark:text-red-400 w-8 h-8 flex items-center justify-center rounded-lg text-sm">09</span>
               Comparative Reasoning: Legacy vs. HU-AMS
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The legacy proposal was <em>Stateful and Imperative</em>; the modern system is <em>Stateless and Declarative</em>. Project I relied on middleware holding memory and executing logic, creating scaling limits. Project II treats the middleware purely as a lightweight router, passing strict logic resolution entirely to the Database Kernel engines. 
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 bg-green-50/50 dark:bg-green-900/10 border-t-4 border-green-500">
             <h2 className="text-2xl font-bold flex items-center gap-3 text-green-700 dark:text-green-400">
              <span className="bg-green-500/10 text-green-700 dark:text-green-400 w-8 h-8 flex items-center justify-center rounded-lg text-sm">10</span>
               The Sequential Logic Evolution
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              From the perspective of a System Architect, the sequence evolved from "Event-Driven" to "Structure-Driven". We stopped trying to compute attendance events dynamically. Instead, we established an immutable geographic and academic grid constraint. The sequence logic dictates that you define the matrix first, and attendance becomes a simple automatic intersection metric within that matrix.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default ProjectProposal;

