import React from 'react';
import { Server, Database, Layers, Globe, Lock, AlertTriangle, Code, Key, Workflow, Map, ShieldAlert, Cpu, Network, FileJson, Clock } from 'lucide-react';

const Architecture: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl flex gap-4 md:items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold text-base">Project Defense Notice: Engineering Architecture Blueprint</p>
          <p className="leading-relaxed">
            This module represents Phase 2 of the structural defense documentation. It expands upon the theoretical concepts outlined in Phase 1 (System Documentation) into granular engineering execution and proprietary algorithms.
          </p>
          <p className="opacity-80 pt-1 text-xs">
            <strong>Note:</strong> Sensitive infrastructural configurations may be redacted post-defense.
          </p>
        </div>
      </div>

      <header className="space-y-4 border-b border-brand-primary/10 pb-8">
        <div className="flex items-center gap-3 text-brand-primary">
          <Layers className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">System Architecture</h1>
        </div>
        <p className="text-gray-500 text-lg md:text-xl max-w-3xl leading-relaxed">
          The definitive technical stack, algorithmic procedures, and database constraints mapping the HU-AMS.
        </p>
      </header>

      <section className="space-y-12">
        {/* Module 1 & 2: Frontend & Backend */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">01</span>
              Frontend Pipeline (SPA)
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Engineered natively using <strong>React 18 + Vite + TypeScript</strong>. It performs entirely off-server, interpreting JSON REST payloads and manipulating the Virtual DOM with sub-millisecond lag.
            </p>
            <ul className="text-xs font-mono font-bold text-brand-primary flex flex-wrap gap-2 pt-2">
              <li className="bg-brand-primary/5 px-2 py-1 rounded">React Router</li>
              <li className="bg-brand-primary/5 px-2 py-1 rounded">Tailwind CSS</li>
            </ul>
          </div>

          <div className="hu-card p-8 space-y-4 shadow-xl shadow-brand-primary/5">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">02</span>
              Stateless API Kernel
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              A high-concurrency <strong>Node.js & Express.js</strong> server acts as the central mitigating gateway. It operates in pure 'stateless' mode—relying entirely on JWT payloads and Postgres to maintain context.
            </p>
            <ul className="text-xs font-mono font-bold text-brand-primary flex flex-wrap gap-2 pt-2">
              <li className="bg-brand-primary/5 px-2 py-1 rounded">Express.js</li>
              <li className="bg-brand-primary/5 px-2 py-1 rounded">Bcrypt</li>
            </ul>
          </div>
        </div>

        {/* Module 3: Database & ERD */}
        <div className="hu-card p-8 md:p-10 space-y-8 bg-brand-surface border-brand-primary/10">
          <h2 className="text-3xl font-bold text-brand-text flex items-center gap-3">
             <span className="bg-brand-primary/10 text-brand-primary w-10 h-10 flex items-center justify-center rounded-xl text-lg">03</span>
             PostgreSQL 3NF Topography (ERD)
          </h2>
          <p className="text-base text-gray-600 max-w-3xl leading-relaxed">
            By locking physical academic structures into explicit foreign-key constraints directly at the disk level, we eliminate arbitrary software bugs resulting in 'orphan records'. 
          </p>
          <div className="bg-[#0f172a] rounded-2xl p-6 md:p-8 font-mono text-xs md:text-sm text-gray-300 shadow-2xl overflow-x-auto border border-gray-800 my-6">
             <pre className="text-green-400 leading-relaxed">
{`[users] 1 -- 1 [student_profiles]
   | id (uuid PK)    | user_id (FK)
   | email           | batch_id (FK)
   | password_hash   | center_id (FK)

[programs] 1 -- * [batches]
   | id (PK)        | id (PK)
   | name           | current_semester

[courses] 1 -- * [sections] * -- 1 [batches]
                   | id (PK)
[centers] 1 ------ | center_id (FK)
                   | current_instructor_id (FK)

[sections] 1 -- * [enrollments] * -- 1 [student_profiles]
                    | section_id (PK/FK)
                    | student_id (PK/FK)`}
             </pre>
          </div>
        </div>

        {/* Module 4 & 5 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2 text-hu-gold">
              <span className="bg-hu-gold/20 text-hu-gold w-8 h-8 flex items-center justify-center rounded-lg text-sm">04</span>
              Autonomy Triggers
            </h3>
            <p className="text-sm text-gray-600"><em>[IEEE Ref: System Doc §04]</em></p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Implemented via <code>PL/pgSQL</code> Triggers. Instead of an Express `.map()` loop, the injection of a new User executes a Postgres kernel function: <code>INSERT INTO enrollments SELECT ... FROM sections WHERE batch_id = NEW.batch_id</code>. Zero API latency.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2 text-purple-600">
              <span className="bg-purple-600/10 text-purple-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">05</span>
              Geodesic Math Vector
            </h3>
             <p className="text-sm text-gray-600"><em>[IEEE Ref: System Doc §06]</em></p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
               The API calculates the Haversine distance using native radial curves: 
               <br/><code className="text-xs bg-gray-100 p-1 rounded mt-2 block">Δφ = (lat2-lat1) * Math.PI/180;</code>
               <code className="text-xs bg-gray-100 p-1 rounded mt-1 block">dist = R * (2 * atan2(√a, √(1-a)));</code>
            </p>
          </div>
        </div>

         {/* Module 6 & 7 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2 text-green-600">
              <span className="bg-green-600/10 text-green-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">06</span>
              HS256 Zero-Trust JWT
            </h3>
            <p className="text-sm text-gray-600"><em>[IEEE Ref: System Doc §10]</em></p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
               We utilize <code>HMAC SHA-256</code> to cryptographically sign the UUID and RBAC role. The server refuses execution if the signature validator algorithm throws a <code>JsonWebTokenError</code>.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4">
             <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2 text-blue-600">
              <span className="bg-blue-600/10 text-blue-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">07</span>
              Serverless WAL Sync
            </h3>
            <p className="text-sm text-gray-600"><em>[IEEE Ref: System Doc §07]</em></p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              HU-AMS subscribes to the Postgres Write-Ahead Log (WAL). When a student modifies their tuple in the `attendance_records` table, the delta is piped directly to the Instructor's React component.
            </p>
          </div>
        </div>

        {/* Module 8 */}
        <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">08</span>
              Collision Mitigation & Concurrency
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              In standard SQL flows, 300 concurrent inserts cause Primary Key deadlocks. We implemented a Composite Key lock on <code>(session_id, student_id)</code> coupled with <code>ON CONFLICT DO NOTHING</code>, allowing identical POST requests to be absorbed gracefully.
            </p>
        </div>

        {/* Module 9 & 10 */}
        <div className="grid md:grid-cols-2 gap-8">
           <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">09</span>
              Row-Level Security (RLS)
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              We enabled RLS policies. Even if the API kernel was compromised, Postgres natively prevents a Student from running a <code>SELECT * FROM sections</code> query because their UUID does not match the Instructor's UUID predicate.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-3 text-brand-text mb-2">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">10</span>
              Materialized Views
            </h3>
            <p className="text-sm text-gray-600"><em>[IEEE Ref: System Doc §09]</em></p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              To drive Quality Assurance dashboards without freezing the database, we rely on <code>MATERIALIZED VIEWS</code>. These generate snapshots of complex joined aggregates overnight via cron jobs, serving high-throughput reads.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Architecture;

