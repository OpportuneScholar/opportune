import React, { useState } from 'react';
import { Plus, FolderOpen, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { DOCUMENT_TYPES } from '../../data/seedData.js';
import DocumentCard from '../../components/DocumentCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Modal from '../../components/Modal.jsx';
import StatusBadge, { statusToTone } from '../../components/StatusBadge.jsx';
import { formatDate } from '../../utils/format.js';

const emptyForm = {
  type: DOCUMENT_TYPES[0],
  certificateNumber: '',
  issueDate: '',
  expiryDate: '',
  noExpiry: false,
  fileName: '',
};

export default function Documents() {
  const { session } = useAuth();
  const data = useData();
  const myDocs = data.documents.filter((d) => d.studentId === session.id);

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [detailDoc, setDetailDoc] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.certificateNumber) errs.certificateNumber = 'Required';
    if (!form.issueDate) errs.issueDate = 'Required';
    if (!form.fileName) errs.fileName = 'Please choose a file';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    data.addDocument(session.id, {
      type: form.type,
      certificateNumber: form.certificateNumber,
      issueDate: form.issueDate,
      expiryDate: form.noExpiry ? null : form.expiryDate,
      noExpiry: form.noExpiry,
      fileName: form.fileName,
    });
    setForm(emptyForm);
    setErrors({});
    setAddOpen(false);
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const okTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!okTypes.includes(file.type)) {
      setErrors((er) => ({ ...er, fileName: 'Only PDF, JPG or PNG files are accepted' }));
      return;
    }
    update('fileName', file.name);
    setErrors((er) => ({ ...er, fileName: undefined }));
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
          <p className="text-slate-500 mt-1 text-sm">Store your documents once and reuse them across every application.</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {myDocs.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents yet"
          description="Add your first document to start building your vault."
          action={<button onClick={() => setAddOpen(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add Document</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onClick={() => setDetailDoc(doc)} />
          ))}
        </div>
      )}

      {/* Add Document Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setErrors({}); }} title="Add Document" size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Document Type</label>
            <select className="input" value={form.type} onChange={(e) => update('type', e.target.value)}>
              {DOCUMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Certificate Number</label>
            <input className="input" value={form.certificateNumber} onChange={(e) => update('certificateNumber', e.target.value)} placeholder="e.g. UP/INC/2026/00981" />
            {errors.certificateNumber && <p className="text-xs text-red-600 mt-1">{errors.certificateNumber}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Issue Date</label>
              <input className="input" type="date" value={form.issueDate} onChange={(e) => update('issueDate', e.target.value)} />
              {errors.issueDate && <p className="text-xs text-red-600 mt-1">{errors.issueDate}</p>}
            </div>
            <div>
              <label className="label">Expiry Date</label>
              <input className="input" type="date" disabled={form.noExpiry} value={form.expiryDate} onChange={(e) => update('expiryDate', e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.noExpiry} onChange={(e) => update('noExpiry', e.target.checked)} className="rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
            This document has no expiry
          </label>
          <div>
            <label className="label">Upload File (PDF, JPG, PNG)</label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-6 cursor-pointer hover:border-brand-400 transition-colors text-sm text-slate-500">
              <Upload className="w-4 h-4" />
              {form.fileName || 'Click to select a file'}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
            </label>
            {errors.fileName && <p className="text-xs text-red-600 mt-1">{errors.fileName}</p>}
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">Upload Document</button>
        </form>
      </Modal>

      {/* Document Detail Modal */}
      <Modal open={!!detailDoc} onClose={() => setDetailDoc(null)} title={detailDoc?.type}>
        {detailDoc && (
          <div className="space-y-3 text-sm">
            <Row label="Status"><StatusBadge label={detailDoc.status} tone={statusToTone(detailDoc.status)} size="sm" /></Row>
            <Row label="Certificate Number">{detailDoc.certificateNumber || '—'}</Row>
            <Row label="Issue Date">{formatDate(detailDoc.issueDate)}</Row>
            <Row label="Expiry Date">{detailDoc.noExpiry ? 'No expiry' : formatDate(detailDoc.expiryDate)}</Row>
            <Row label="File">{detailDoc.fileName || '—'}</Row>
            {detailDoc.status === 'Rejected' && (
              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                <p className="font-medium text-xs mb-0.5">Rejection Reason</p>
                <p className="text-sm">{detailDoc.rejectionReason}</p>
              </div>
            )}
            {detailDoc.status === 'Rejected' && (
              <button
                onClick={() => { setDetailDoc(null); setAddOpen(true); setForm({ ...emptyForm, type: detailDoc.type }); }}
                className="btn-primary w-full py-2.5 mt-2"
              >
                Replace Document
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-medium">{children}</span>
    </div>
  );
}
