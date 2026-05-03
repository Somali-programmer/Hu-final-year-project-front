import React from 'react';
import { Book, Shield, Users, MapPin, Zap, Database, Lock, Server, AlertTriangle, ShieldCheck, Activity, BrainCircuit, Globe, PieChart, Clock, Hash } from 'lucide-react';

const SystemDocumentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 rounded-r-xl flex gap-4 md:items-center shadow-sm">
        <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
        <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-500">
          <p className="font-bold text-base">Project Defense Notice: Technical Documentation</p>
          <p className="leading-relaxed">
            This module represents Phase 1 of the structural defense documentation. It covers the high-level theoretical concepts, paradigms, and conceptual maps governing the HU-AMS platform. For specific code execution and ERDs, refer to Phase 2 (System Architecture).
          </p>
        </div>
      </div>

      <header className="space-y-4 border-b border-brand-primary/10 pb-8">
        <div className="flex items-center gap-3 text-brand-primary">
          <Book className="w-10 h-10" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">System Documentation</h1>
        </div>
        <p className="text-gray-500 text-lg md:text-xl max-w-3xl leading-relaxed">
          The theoretical paradigms and operational concepts driving the Haramaya University Attendance System (HU-AMS).
        </p>
      </header>

      <section className="space-y-12">
        
        {/* Topic 1 */}
        <div className="hu-card p-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
            <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">01</span>
            Executive Summary & Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            HU-AMS is an enterprise-grade digital infrastructure designed to eradicate paper-based tracking inefficiencies across Haramaya University's distributed campuses (Main, Harar, Jigjiga). It guarantees geographical presence and cryptographically verifies student attendance with sub-second latency, solving the critical mass-enrollment computational overhead problem.
          </p>
        </div>

        {/* Topic 2 & 3 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">02</span>
              Physical-to-Logical Map
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The physical academic world is conceptually modeled as a highly interlocked tree. Departments hold Programs (Regular/Extension). Programs spawn Batches (e.g., Year 2). And Batches operate within physical Centers. This strict mapping ensures students in different geographic polygons never intersect unauthorized records.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">03</span>
              4-Tier Access Control Policy
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We abstracted user authority into four rigid bounds: Admin (Structural routing & cohort promotion), QA (Deep-metrics omniscience), Instructor (Cryptographic session authority), and Student (Payload generator). Authority is non-transferable and strictly validated.
            </p>
          </div>
        </div>

        {/* Topic 4 */}
        <div className="hu-card p-8 space-y-4 border-l-4 border-l-hu-gold">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
            <span className="bg-hu-gold/20 text-hu-gold w-8 h-8 flex items-center justify-center rounded-lg text-sm">04</span>
            The Autonomous Enrollment Paradigm
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Traditionally, associating 300+ students to a newly created Class Section drops server throughput to zero. The HU-AMS adopts an "Autonomous Paradigm". By mathematically analyzing a Student's Batch and Center IDs against newly injected Sections, the system bypasses API loops and structurally binds them at the hardware level. 
            <br/><br/><em className="text-sm">For the procedural execution of this paradigm, see Architecture [1].</em>
          </p>
        </div>

        {/* Topic 5 & 6 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4 border-t-4 border-t-purple-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-purple-500/10 text-purple-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">05</span>
              Volatile Cryptographic Handshakes
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              QR codes are easily photographed and forwarded, defeating the purpose of attendance. HU-AMS utilizes a Volatile Handshake conceptually similar to an RSA SecurID. A 6-digit cryptographic seed is instantiated by the instructor and violently expires post-session.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 border-t-4 border-t-green-500">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-green-500/10 text-green-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm">06</span>
              Spatial Geofencing Guardrails
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Digital tokens are useless if the student is miles away. The system treats the Instructor's device as literal longitude/latitude coordinate (Zero-Point). It calculates the mathematical perimeter around that point to guarantee physical human presence. <br/><br/><em className="text-xs">See Architecture [2] for the specific formulas.</em>
            </p>
          </div>
        </div>

        {/* Topic 7 & 8 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">07</span>
              The Latency-Free Sync Framework
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A core documentation requirement is addressing network congestion. We theorized a unidirectional sync model where Instructor screens do not refresh but listen to "database echoes". This prevents the network from collapsing during mass 08:00 AM check-ins.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-brand-text">
              <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 flex items-center justify-center rounded-lg text-sm">08</span>
              Temporal Lifecycle Modeling
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Time is not treated as a string, but as an immutable status actor. A Session holds absolute timestamps defining standard vs late thresholds. Students crossing this boundary are programmatically downgraded to prevent grace-period abuse.
            </p>
          </div>
        </div>

        {/* Topic 9 & 10 */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="hu-card p-8 space-y-4 bg-purple-50/30 dark:bg-purple-900/10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-700 dark:text-purple-400">
              <span className="bg-purple-500/20 text-purple-700 dark:text-purple-400 w-8 h-8 flex items-center justify-center rounded-lg text-sm">09</span>
              Institutional Audit Taxonomies
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We conceptualized a robust taxonomy for Quality Assurance. Instead of viewing isolated records, the QA abstraction provides macro-perspectives. It allows the institution to visualize cascading failure risks by identifying correlation between Centers, Batches, and Drop-out rates.
            </p>
          </div>

          <div className="hu-card p-8 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-red-700 dark:text-red-400">
              <span className="bg-red-500/20 text-red-700 dark:text-red-400 w-8 h-8 flex items-center justify-center rounded-lg text-sm">10</span>
              Penetration & Security Posture
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The core security paradigm assumes the client is fundamentally compromised. By centralizing verification logic inside a state-agnostic microkernel and heavily mutating tokens prior to storage, the system achieves a Zero-Trust perimeter. <br/><br/><em className="text-xs">See Architecture [3] for Token Encryption execution.</em>
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default SystemDocumentation;
