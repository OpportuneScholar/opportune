import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import DocumentVerificationPanel from '../../components/DocumentVerificationPanel.jsx';

export default function InstitutionDocuments() {
  const { session } = useAuth();
  const data = useData();
  const myStudents = data.students.filter((s) => s.institutionId === session.id);
  const docs = data.documents.filter((d) => myStudents.some((s) => s.id === d.studentId));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-slate-900">Document Verification</h1>
        <p className="text-slate-500 mt-1 text-sm">Review documents submitted by your connected students.</p>
      </div>
      <DocumentVerificationPanel documents={docs} students={myStudents} />
    </div>
  );
}
