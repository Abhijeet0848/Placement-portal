import React, { useState } from 'react';
import { FileText, CheckCircle, Download, Briefcase, Building } from 'lucide-react';

export const StudentOffers: React.FC = () => {
  const [offers, setOffers] = useState([
    {
      id: '1',
      company: 'Google',
      role: 'Frontend Engineer',
      package: '25 LPA',
      status: 'Pending',
      date: '2023-11-20',
      letterText: 'Dear Student,\n\nWe are thrilled to offer you the position of Frontend Engineer at Google. Your skills and interview performance were outstanding.\n\nPackage: 25 LPA\nJoining Date: July 2024\n\nPlease accept this offer digitally to confirm your placement.\n\nBest regards,\nGoogle Recruitment Team'
    }
  ]);

  const [selectedOffer, setSelectedOffer] = useState(offers[0]);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setOffers(offers.map(o => o.id === selectedOffer.id ? { ...o, status: 'Accepted' } : o));
      setSelectedOffer({ ...selectedOffer, status: 'Accepted' });
      setIsAccepting(false);
      alert('Offer Accepted! Congratulations on your placement!');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Digital Offers</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Placement Offer Letters</h2>
          </div>
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <FileText className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Offer List */}
        <div className="col-span-1 space-y-4">
          {offers.map(offer => (
            <div 
              key={offer.id} 
              onClick={() => setSelectedOffer(offer)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedOffer.id === offer.id 
                  ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg">{offer.company}</h3>
                {offer.status === 'Accepted' ? (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> ACCEPTED
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md">
                    PENDING ACTION
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mb-1"><Briefcase className="w-3.5 h-3.5" /> {offer.role}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> {offer.package}</p>
            </div>
          ))}
        </div>

        {/* Offer Details */}
        <div className="col-span-2">
          {selectedOffer ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="flex justify-between items-center border-b border-slate-100 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Official Offer Letter</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedOffer.company} • {selectedOffer.date}</p>
                </div>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors" title="Download PDF">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-loose whitespace-pre-wrap font-serif bg-slate-50 p-6 rounded-xl border border-slate-200">
                {selectedOffer.letterText}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                {selectedOffer.status === 'Accepted' ? (
                  <div className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold border border-emerald-200">
                    <CheckCircle className="w-5 h-5" /> Digital Signature Verified (Accepted)
                  </div>
                ) : (
                  <button 
                    onClick={handleAccept}
                    disabled={isAccepting}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                  >
                    {isAccepting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Sign & Accept Offer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Select an offer to view details.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
