import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../shared/Primitives';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, personaName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                  <AlertTriangle size={20} />
               </div>
               <h2 className="text-xl font-bold text-slate-800">Delete Persona?</h2>
            </div>
            <p className="text-slate-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-900">{personaName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button variant="danger" onClick={onConfirm} icon={Trash2}>Delete</Button>
            </div>
        </div>
    </div>
  );
};

export default DeleteConfirmationModal;
