'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { ProposalForm } from '@/components/ProposalForm';
import { LoginForm } from '@/components/LoginForm';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upwork Proposal Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate professional, tailored proposals for Upwork jobs using AI. 
            Our tool helps you create compelling applications with process diagrams 
            to increase your chances of success.
          </p>
        </div>

        {user ? (
          <ProposalForm />
        ) : (
          <LoginForm onLoginSuccess={() => {}} />
        )}
      </div>
    </main>
  );
}
