import React, { useState } from 'react';
import { LayoutDashboard, Settings, Users } from 'lucide-react';
import CreateProjectModal from './src/components/modals/CreateProjectModal';
import Dashboard from './src/components/Dashboard';
import PersonaBuilder from './src/components/PersonaBuilder';
import PersonaLibrary from './src/components/PersonaLibrary';
import { INITIAL_PROJECTS, MOCK_INITIAL_PERSONAS } from './src/data/mockData';
import { getRandomColor } from './src/utils';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [editPersona, setEditPersona] = useState(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [allPersonas, setAllPersonas] = useState(MOCK_INITIAL_PERSONAS);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveView('library');
  };

  const handleCreateProject = (newProject) => {
    const project = {
        ...newProject,
        id: projects.length + 1,
        color: getRandomColor(),
    };
    setProjects([project, ...projects]);
    setIsProjectModalOpen(false);
  };

  const handleUpdateProject = (updatedProject) => {
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    setSelectedProject(updatedProject);
  };

  const handleCreatePersona = () => {
    setEditPersona(null);
    setActiveView('builder');
  };

  const handleEditPersona = (persona) => {
    setEditPersona(persona);
    setActiveView('builder');
  };

  const handleDeletePersona = (personaId) => {
    const persona = allPersonas.find(p => p.id === personaId);
    if (!persona) return;

    setAllPersonas(prev => prev.filter(p => p.id !== personaId));

    if (persona.projectId) {
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === persona.projectId) {
                return { ...p, personas: Math.max(0, p.personas - 1) };
            }
            return p;
        }));

        if (selectedProject?.id === persona.projectId) {
            setSelectedProject(prev => ({ ...prev, personas: Math.max(0, prev.personas - 1) }));
        }
    }
  };

  const handleSavePersona = (data) => {
    if (data.id) {
        const updatedPersonas = allPersonas.map(p => p.id === data.id ? data : p);
        setAllPersonas(updatedPersonas);
    } else {
        const newPersona = {
            ...data,
            id: Math.floor(Math.random() * 100000),
            projectId: selectedProject ? selectedProject.id : null,
        };
        setAllPersonas([...allPersonas, newPersona]);

        if (selectedProject) {
            const updatedProjects = projects.map(p => {
                if (p.id === selectedProject.id) {
                    return { ...p, personas: p.personas + 1 };
                }
                return p;
            });
            setProjects(updatedProjects);
            const updatedCurrentProject = updatedProjects.find(p => p.id === selectedProject.id);
            setSelectedProject(updatedCurrentProject);
        }
    }
    setActiveView('library');
  };

  const SidebarItem = ({ id, icon: Icon, label, onClick }) => {
     const isActive = id === 'dashboard'
        ? activeView === 'dashboard'
        : id === 'library'
            ? activeView === 'library' && !selectedProject?.id
            : false;

     return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
        {label}
      </button>
     );
  };

  const getFilteredPersonas = () => {
      if (activeView === 'library' && selectedProject?.id) {
          return allPersonas.filter(p => p.projectId === selectedProject.id);
      }
      return allPersonas;
  };

  if (activeView === 'builder') {
    return (
      <PersonaBuilder
        initialData={editPersona}
        onSave={handleSavePersona}
        onBack={() => setActiveView('library')}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      <CreateProjectModal
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
         onSave={handleCreateProject}
      />

      <aside className="w-64 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
        <div className="p-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight">
            <Users className="fill-current" />
            <span>Persona<span className="text-slate-900">Studio</span></span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-4">Platform</div>
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => { setActiveView('dashboard'); setSelectedProject(null); }} />
          <SidebarItem id="library" icon={Users} label="All Personas" onClick={() => { setActiveView('library'); setSelectedProject({name: "All Projects"}); }} />

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-8">Recent Projects</div>
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => handleProjectSelect(p)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${selectedProject?.id === p.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <div className={`w-2 h-2 rounded-full ${p.color}`} />
              <div className="truncate text-left flex-1">{p.name}</div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 w-full transition-colors">
            <Settings size={18} />
            Settings
          </button>
          <div className="mt-4 flex items-center gap-3 px-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-bold">
               JD
             </div>
             <div className="text-sm">
               <p className="font-medium text-slate-700">John Doe</p>
               <p className="text-xs text-slate-400">Pro Plan</p>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white relative">
        <div className="fixed top-6 right-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest z-40 pointer-events-none select-none">
           Powered by ITS Technology Innovation Office
        </div>

        {activeView === 'dashboard' && (
          <Dashboard
            projects={projects}
            onSelectProject={handleProjectSelect}
            onCreateProject={() => setIsProjectModalOpen(true)}
          />
        )}
        {activeView === 'library' && selectedProject && (
          <PersonaLibrary
            project={selectedProject}
            personas={getFilteredPersonas()}
            onEdit={handleEditPersona}
            onCreateNew={handleCreatePersona}
            onUpdateProject={handleUpdateProject}
            onDeletePersona={handleDeletePersona}
          />
        )}
      </main>
    </div>
  );
}
