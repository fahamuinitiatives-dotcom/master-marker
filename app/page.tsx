'use client';
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-surface-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold mb-2">Admin: Upload Verified Questions</h1>
        <p className="text-sm text-slate-500 mb-6">Only accounts with role=admin can submit this form to the database. Validates source label regex.</p>
        <form className="space-y-4">
          <input type="text" placeholder="Subject (e.g. 0455)" className="w-full border rounded-xl p-3" />
          <input type="text" placeholder="Source Label (e.g. 0455/22/M/J/24 Q3(c))" className="w-full border rounded-xl p-3" pattern="^0455/\d{2}/[FMJON]/[J|N]/\d{2}\sQ\d(\([a-f]\))?$" />
          <textarea placeholder="Question Text" className="w-full border rounded-xl p-3 h-24" />
          <textarea placeholder="Mark Scheme JSON" className="w-full border rounded-xl p-3 h-24 font-mono text-xs" />
          <button className="bg-black text-white px-6 py-2 rounded-xl">Upload Verified Source</button>
        </form>
      </div>
    </div>
  );
}