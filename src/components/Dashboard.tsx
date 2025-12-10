import React from 'react';
import { ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from './shared/Primitives';

const Dashboard = ({ projects, onSelectProject, onCreateProject }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Projects</h1>
          <p className="text-slate-500">Manage your persona campaigns and productions.</p>
        </div>
        <Button onClick={onCreateProject} icon={Plus}>New Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${project.color}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg ${project.color} bg-opacity-10 flex items-center justify-center text-lg font-bold ${project.color.replace('bg-', 'text-')}`}>
                {project.name.charAt(0)}
              </div>
              <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">{project.name}</h3>
            <p className="text-sm text-slate-500 mb-6">Last updated {project.updated}</p>

            <div className="space-y-2 mb-6">
               {project.background && (
                 <p className="text-xs text-slate-400 line-clamp-2">{project.background}</p>
               )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{project.personas} Personas</span>
              <span className="text-indigo-600 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                Open Project <ChevronRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
