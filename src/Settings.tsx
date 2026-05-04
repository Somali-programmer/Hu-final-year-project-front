import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { motion } from 'motion/react';
import { KeyRound, Lock, AlertCircle, CheckCircle2, Fingerprint } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const [bioStatus, setBioStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bioMessage, setBioMessage] = useState('');

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setStatus('loading');
    try {
      const token = localStorage.getItem('hu_token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to change password');
      }

      setStatus('success');
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleRegisterBiometric = async () => {
    setBioStatus('loading');
    setBioMessage('');
    try {
      const token = localStorage.getItem('hu_token');
      const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // 1. Get options from server
      const optionsRes = await fetch('/api/auth/webauthn/generate-registration-options', {
        headers: authHeaders
      });
      if (!optionsRes.ok) throw new Error('Failed to get registration options');
      const options = await optionsRes.json();

      // 2. Pass options to browser authenticator
      const attResp = await startRegistration({ optionsJSON: options });

      // 3. Send back to server for verification
      const verifyRes = await fetch('/api/auth/webauthn/verify-registration', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(attResp),
      });

      if (!verifyRes.ok) {
        throw new Error('Failed to verify biometric registration');
      }

      setBioStatus('success');
      setBioMessage('Biometric login registered successfully! You can now use your fingerprint/face to login.');
    } catch (err: any) {
      console.error(err);
      setBioStatus('error');
      if (err.name === 'NotAllowedError') {
        setBioMessage('Registration was canceled or blocked by the browser.');
      } else {
        setBioMessage(err.message || 'Error occurred during registration.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hu-card-alt overflow-hidden mb-8"
      >
        <div className="p-6 md:p-8 flex items-center gap-4 bg-gradient-to-r from-hu-green to-hu-gold/20 relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white">Account Settings</h1>
            <p className="text-white/80">Manage your password and security preferences</p>
          </div>
        </div>

        <div className="p-6 md:p-8 border-b border-brand-primary/10">
          <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-brand-primary" />
            Biometric Login
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            Register your device's biometric authentication (like Touch ID, Face ID, or Windows Hello) to sign in faster without typing your password.
          </p>

          {bioStatus === 'error' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{bioMessage}</p>
            </div>
          )}

          {bioStatus === 'success' && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{bioMessage}</p>
            </div>
          )}

          <button
            onClick={handleRegisterBiometric}
            disabled={bioStatus === 'loading'}
            className="flex items-center gap-2 hu-button-rounded bg-brand-bg border border-hu-green text-brand-text hover:bg-hu-green/5 transition-colors w-full md:w-auto justify-center"
          >
            <Fingerprint className="w-4 h-4" />
            {bioStatus === 'loading' ? 'Registering...' : 'Register Device Biometrics'}
          </button>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-brand-text mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-primary" />
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <div>
              <label className="hu-label">Current Password</label>
              <input
                type="password"
                required
                className="hu-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="hu-label">New Password</label>
                <input
                  type="password"
                  required
                  className="hu-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength={6}
                />
              </div>
              
              <div>
                <label className="hu-label">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="hu-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="hu-button-rounded bg-brand-primary text-white"
              >
                {status === 'loading' ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
