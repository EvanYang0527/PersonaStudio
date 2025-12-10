import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getFiscalQuarter } from '../../utils';
import { Button, Input, TextArea } from '../shared/Primitives';

const EditProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    name: "",
    background: "",
    resources: []
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        background: project.background || "",
        resources: project.resources && project.resources.length > 0 ? project.resources : [{ name: "", url: "" }]
      });
    }
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name) return;
    const validResources = formData.resources.filter(r => r.name || r.url);
    onSave({
      ...project,
      ...formData,
      resources: validResources,
      updated: "Just now"
    });
    onClose();
  };

  const handleResourceChange = (index, field, value) => {
    const newResources = [...formData.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setFormData({ ...formData, resources: newResources });
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { name: "", url: "" }]
    });
  };

  const removeResource = (index) => {
    if (formData.resources.length === 1) {
        handleResourceChange(0, 'name', '');
        handleResourceChange(0, 'url', '');
        return;
    }
    const newResources = formData.resources.filter((_, i) => i !== index);
    setFormData({ ...formData, resources: newResources });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Edit Project Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <div className="flex flex-col gap-1.5 w-full">
               <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Start Date (Read Only)</label>
               <div className="px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 text-sm flex items-center justify-between cursor-not-allowed">
                 <span>{project?.startDate || "Not set"}</span>
                 <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-bold">{getFiscalQuarter(project?.startDate)}</span>
               </div>
          </div>

          <TextArea
            label="Background & Context"
            rows={3}
            value={formData.background}
            onChange={(e) => setFormData({...formData, background: e.target.value})}
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project Resources</label>
            {formData.resources.map((resource, index) => (
              <div key={index} className="flex gap-2 items-start">
                 <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                       className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-sm"
                       placeholder="Resource Name"
                       value={resource.name}
                       onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                    />
                    <input
                       className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-sm"
                       placeholder="URL"
                       value={resource.url}
                       onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                    />
                 </div>
                 <button
                    onClick={() => removeResource(index)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors mt-[1px]"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
            ))}
           <Button
               variant="ghost"
               onClick={addResource}
               className="w-full border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
               icon={Plus}
           >
               Add Resource
           </Button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectModal;
