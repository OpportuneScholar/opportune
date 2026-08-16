import React from 'react';
import { useData } from '../../context/DataContext.jsx';
import DocumentVerificationPanel from '../../components/DocumentVerificationPanel.jsx';

export default function AdminDocuments() {
  const data = useData();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Document Verification</h1>
        <p className="text-slate-500 mt-1 text-sm">Platform-wide document review with mandatory rejection reasons.</p>
      </div>
      <DocumentVerificationPanel documents={data.documents} students={data.students} />
    </div>
  );
}
