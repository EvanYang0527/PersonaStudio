import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Filter,
  Link as LinkIcon,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Users
} from 'lucide-react';
import { getFiscalQuarter } from '../utils';
import PersonaCard from './PersonaCard';
import { Button, Card } from './shared/Primitives';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import EditProjectModal from './modals/EditProjectModal';

const PersonaLibrary = ({ project, personas, onEdit, onCreateNew, onUpdateProject, onDeletePersona }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const isProjectView = !!project.id;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={(updatedProject) => {
          onUpdateProject(updatedProject);
          setIsEditModalOpen(false);
        }}
      />

      <DeleteConfirmationModal
         isOpen={!!personaToDelete}
         onClose={() => setPersonaToDelete(null)}
         personaName={personaToDelete?.name}
         onConfirm={() => {
             onDeletePersona(personaToDelete.id);
             setPersonaToDelete(null);
         }}
      />

      <div className="flex justify-between items-end mb-8">
        <div>
           {isProjectView && (
             <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
               <span>Projects</span>
               <ChevronRight size={14} />
               <span>{project.name}</span>
             </div>
           )}

           <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isProjectView ? project.name : "Global Persona Library"}
            </h1>
            {isProjectView && (
              <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors p-1.5 hover:bg-indigo-50 rounded-lg"
                  title="Edit Project Details"
              >
                  <Pencil size={18} />
              </button>
            )}
           </div>

           {!isProjectView && (
             <p className="text-slate-500 mt-2">Browse and manage all personas across all projects.</p>
           )}
        </div>
        <Button onClick={onCreateNew} icon={Plus}>Create Persona</Button>
      </div>

      {isProjectView ? (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card noPadding className="p-4 flex flex-col gap-1 bg-slate-50 border-dashed">
              <span className="text-xs font-bold text-slate-400 uppercase">Fiscal Period</span>
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <CalendarDays size={16} className="text-indigo-500" />
                <div className="flex flex-col leading-tight">
                   <span>{getFiscalQuarter(project.startDate)}</span>
                   <span className="text-[10px] text-slate-400 font-normal">Started {project.startDate || "N/A"}</span>
                </div>
              </div>
           </Card>
           <Card noPadding className="p-4 flex flex-col gap-1 bg-slate-50 border-dashed">
              <span className="text-xs font-bold text-slate-400 uppercase">Context</span>
              <div className="flex items-center gap-2 font-medium text-slate-700">
                <FileText size={16} className="text-indigo-500" />
                <span className="truncate">{project.background || "No background info"}</span>
              </div>
           </Card>
           <Card noPadding className="p-4 flex flex-col gap-1 bg-slate-50 border-dashed max-h-40 overflow-y-auto">
              <span className="text-xs font-bold text-slate-400 uppercase">Resources</span>
              <div className="flex flex-col gap-2 mt-1">
                 {project.resources && project.resources.length > 0 ? (
                   project.resources.map((res, i) => (
                      <div key={i} className="flex items-center gap-2 font-medium text-slate-700">
                        <LinkIcon size={14} className="text-indigo-500 flex-shrink-0" />
                        <a href={res.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate text-sm">
                          {res.name || res.url}
                        </a>
                      </div>
                   ))
                 ) : (
                   <span className="text-sm text-slate-400">No resources linked</span>
                 )}
              </div>
           </Card>
        </div>
      ) : (
        <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search personas by name, role, or traits..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
               />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  <Filter size={16} />
                  Filters
               </button>
               <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-300 outline-none cursor-pointer">
                  <option>Sort by Newest</option>
                  <option>Sort by Name</option>
                  <option>Sort by Project</option>
               </select>
            </div>
        </div>
      )}

      {personas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
           <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
              <Users size={32} />
           </div>
           <h3 className="text-lg font-bold text-slate-700 mb-1">No Personas Yet</h3>
           <p className="text-slate-400 mb-6 text-center max-w-sm">Create your first persona for this project to get started.</p>
           <Button onClick={onCreateNew} icon={Plus}>Create Persona</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            onClick={onCreateNew}
            className="group border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 mb-4 transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-semibold text-slate-600 group-hover:text-indigo-700">Add New Persona</span>
          </div>

          {personas.map((persona) => (
            <div key={persona.id} className="group relative">
              <div className="h-full">
                  <PersonaCard data={persona} compact />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => onEdit(persona)}
                    className="bg-white/90 backdrop-blur text-slate-700 p-2 rounded-lg shadow-sm hover:text-indigo-600 hover:shadow-md border border-slate-200"
                    title="Edit"
                  >
                    <Settings size={16} />
                  </button>
                  <button
                    onClick={() => setPersonaToDelete(persona)}
                    className="bg-white/90 backdrop-blur text-rose-600 p-2 rounded-lg shadow-sm hover:bg-rose-50 hover:shadow-md border border-slate-200"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonaLibrary;
