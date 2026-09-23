import React from 'react';
import { X, Award, CheckCircle2, Calendar, Clock, UserCheck, ShieldCheck, Trash2 } from 'lucide-react';
import { VerificationRecord } from '../types';

interface VerificationLedgerModalProps {
  records: VerificationRecord[];
  onClose: () => void;
  onClearRecords: () => void;
}

export const VerificationLedgerModal: React.FC<VerificationLedgerModalProps> = ({
  records,
  onClose,
  onClearRecords,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-emerald-800/50 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sallah Witness Certificates & Records</h3>
              <p className="text-xs text-stone-400">
                Verified mutual agreements confirming observed daily prayers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg bg-stone-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-12 text-stone-400 space-y-2">
              <ShieldCheck className="w-12 h-12 text-stone-600 mx-auto" />
              <div className="text-sm font-medium text-stone-300">No Witness Records Yet</div>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Use the "Scan Mate" camera scanner on any prayer time to observe and attest that your praying partner has performed their Sallah.
              </p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {rec.prayerName} Sallah
                    </span>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Observed: <strong className="text-stone-200">{rec.mateName}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {rec.confidence}% Verified
                  </span>
                </div>

                <div className="text-xs text-stone-300 italic bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                  "{rec.witnessStatement}"
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2 pt-1 border-t border-stone-800/60">
                  <span>Posture: <strong className="text-stone-300">{rec.posture}</strong></span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      {rec.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-500" />
                      {rec.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="p-4 border-t border-stone-800 bg-stone-950 flex justify-between items-center">
            <span className="text-xs text-stone-400">
              Total Verified: {records.length} {records.length === 1 ? 'record' : 'records'}
            </span>
            <button
              onClick={onClearRecords}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800/40 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Log
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
