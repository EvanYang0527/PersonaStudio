import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Image as ImageIcon, 
  Video, 
  Save, 
  MoreHorizontal, 
  Search,
  Download,
  Copy,
  Trash2,
  Wand2,
  PlayCircle,
  X,
  Calendar,
  Link as LinkIcon,
  FileText,
  Pencil,
  CalendarDays,
  Filter,
  AlertTriangle
} from 'lucide-react';

/**
 * UTILS
 */
const getFiscalQuarter = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";

  const month = date.getMonth(); // 0-11
  const year = date.getFullYear();

  // User logic: FY starts July 1st.
  let fyYear = year;
  let quarter = 0;

  if (month >= 6) { // July (6) to Dec (11)
    fyYear = year;
    quarter = Math.floor((month - 6) / 3) + 1;
  } else { // Jan (0) to June (5)
    fyYear = year - 1; 
    quarter = Math.floor((month + 6) / 3) + 1;
  }

  const shortYear = fyYear.toString().slice(-2);
  return `FY${shortYear} Q${quarter}`;
};

const getRandomColor = () => {
  const colors = [
    'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-500', 
    'bg-orange-500', 'bg-purple-500', 'bg-cyan-500', 'bg-pink-500',
    'bg-teal-500', 'bg-violet-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * MOCK DATA & ASSETS
 */
const INITIAL_PROJECTS = [
  { 
    id: 1, 
    name: "FinTech Mobile App 2.0", 
    personas: 2, 
    updated: "2h ago", 
    color: getRandomColor(),
    startDate: "2024-07-15",
    background: "Redesigning the core banking experience for gen-z users.",
    resources: [
      { name: "Figma Designs", url: "https://figma.com/file/..." },
      { name: "PRD Document", url: "https://notion.so/..." }
    ]
  },
  { 
    id: 2, 
    name: "Healthcare Portal", 
    personas: 1, 
    updated: "1d ago", 
    color: getRandomColor(),
    startDate: "2024-01-10",
    background: "Patient intake optimization project.",
    resources: [
      { name: "Jira Board", url: "https://atlassian.net/..." }
    ]
  },
  { 
    id: 3, 
    name: "E-Commerce Rebrand", 
    personas: 0, 
    updated: "3d ago", 
    color: getRandomColor(),
    startDate: "2024-04-01",
    background: "Summer collection launch campaign.",
    resources: []
  },
];

const INITIAL_PERSONA_STATE = {
  id: null,
  projectId: null,
  name: "",
  age: "",
  sex: "",
  nationality: "",
  role: "",
  occupation: "",
  goals: ["", "", ""],
  frustrations: ["", "", ""],
  motivation: "",
  bio: "",
  narrative: "",
  quote: "",
  avatarStyle: "Photorealistic",
  avatarUrl: null,
  videoUrl: null,
};

const MOCK_INITIAL_PERSONAS = [
  {
    ...INITIAL_PERSONA_STATE,
    id: 101,
    projectId: 1,
    name: "Sarah Chen",
    role: "Lead Engineer",
    age: "28",
    nationality: "San Francisco, CA",
    occupation: "Software Architect",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    goals: ["Scale backend systems", "Reduce tech debt", "Mentoring juniors"]
  },
  {
    ...INITIAL_PERSONA_STATE,
    id: 102,
    projectId: 1,
    name: "Marcus Johnson",
    role: "End User",
    age: "35",
    nationality: "London, UK",
    occupation: "Marketing Manager",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    goals: ["Easy reporting", "Mobile access", "Data visualization"]
  },
  {
    ...INITIAL_PERSONA_STATE,
    id: 103,
    projectId: 2,
    name: "Dr. Emily Wong",
    role: "Admin",
    age: "42",
    nationality: "New York, NY",
    occupation: "Clinic Administrator",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
    goals: ["Reduce wait times", "Streamline billing", "Patient satisfaction"]
  }
];

const AVATAR_STYLES = [
  { id: 'photorealistic', label: 'Photorealistic' },
  { id: 'disney', label: 'Disney/Pixar 3D' },
  { id: 'flat', label: 'Flat Illustration' },
  { id: 'airbnb', label: 'Airbnb 3D' },
];

/**
 * UI PRIMITIVES
 * Reusable components for the "Notion x Airbnb" look
 */
const Button = ({ children, variant = 'primary', className = '', icon: Icon, loading, onClick, ...props }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 hover:border-rose-300",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const Input = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>}
    <input 
      className={`px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 ${className}`}
      {...props} 
    />
  </div>
);

const TextArea = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>}
    <textarea 
      className={`px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 resize-none ${className}`}
      {...props} 
    />
  </div>
);

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

/**
 * MODAL: DELETE CONFIRMATION
 */
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

/**
 * MODAL: CREATE PROJECT
 */
const CreateProjectModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    background: "",
    resources: [{ name: "", url: "" }]
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.name) return; // Basic validation
    
    // Filter out empty resources
    const validResources = formData.resources.filter(r => r.name || r.url);

    onSave({
      ...formData,
      resources: validResources,
      createDate: new Date().toLocaleDateString(),
      startDate: new Date().toISOString().split('T')[0], // Default to today for demo
      updated: "Just now",
      personas: 0,
    });
    setFormData({ name: "", background: "", resources: [{ name: "", url: "" }] });
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
          <h2 className="text-xl font-bold text-slate-800">Create New Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <Input 
            label="Project Name" 
            placeholder="e.g. Q4 Marketing Campaign" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            autoFocus
          />
          
          <div className="flex flex-col gap-1.5 w-full">
               <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Start Date</label>
               <div className="px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm">
                 {new Date().toLocaleDateString()}
               </div>
          </div>

          <TextArea 
            label="Background & Context" 
            placeholder="Brief description of the project goals..." 
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
                       placeholder="Resource Name (e.g. Figma)"
                       value={resource.name}
                       onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                    />
                    <input 
                       className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none text-sm"
                       placeholder="URL (https://...)"
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
               Add Another Resource
            </Button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} icon={Plus}>Create Project</Button>
        </div>
      </div>
    </div>
  );
};

/**
 * MODAL: EDIT PROJECT
 */
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

  // Reuse handlers
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
               Add Another Resource
            </Button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} icon={Save}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

/**
 * CORE COMPONENT: PERSONA CARD (Preview)
 */
const PersonaCard = ({ data, compact = false }) => {
  const hasAvatar = !!data.avatarUrl;

  return (
    <div className={`bg-white overflow-hidden flex flex-col h-full ${compact ? 'rounded-lg border border-slate-200' : 'rounded-2xl shadow-xl border border-slate-100'}`}>
      {/* Header Image Area */}
      <div className={`relative ${compact ? 'h-32' : 'h-64'} bg-slate-100 group`}>
        {hasAvatar ? (
          <img 
            src={data.avatarUrl} 
            alt={data.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 pattern-grid-lg">
            <Users size={compact ? 24 : 48} className="mb-2 opacity-20" />
            <span className="text-xs font-medium uppercase tracking-widest opacity-40">No Portrait</span>
          </div>
        )}
        
        {/* Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12 text-white">
          <h3 className={`font-bold ${compact ? 'text-lg leading-tight' : 'text-3xl'}`}>
            {data.name || "Persona Name"}
          </h3>
          <p className={`opacity-90 ${compact ? 'text-xs' : 'text-sm font-medium'}`}>
            {data.role || "Role"} • {data.age ? `${data.age} yrs` : "Age"}
          </p>
        </div>
      </div>

      {/* Body Content */}
      <div className={`flex-1 flex flex-col ${compact ? 'p-3 gap-2' : 'p-6 gap-6'}`}>
        {/* Quote - Only on full card */}
        {!compact && data.quote && (
          <blockquote className="relative italic text-lg text-slate-600 border-l-4 border-indigo-500 pl-4 py-1">
            "{data.quote}"
          </blockquote>
        )}

        {/* Demographics Grid */}
        <div className={`grid grid-cols-2 ${compact ? 'gap-2 text-xs' : 'gap-4 text-sm'}`}>
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            <span className="block text-slate-400 text-[10px] uppercase font-bold">Location</span>
            <span className="font-medium text-slate-700">{data.nationality || "-"}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
             <span className="block text-slate-400 text-[10px] uppercase font-bold">Occupation</span>
             <span className="font-medium text-slate-700">{data.occupation || "-"}</span>
          </div>
        </div>

        {/* Narrative */}
        {!compact && data.bio && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Background</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{data.bio}</p>
          </div>
        )}

        {/* Goals & Frustrations */}
        {!compact && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
            <div>
              <h4 className="text-xs font-bold uppercase text-emerald-600 mb-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Goals
              </h4>
              <ul className="space-y-1">
                {data.goals.filter(g => g).map((g, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></span>
                    {g}
                  </li>
                ))}
                {data.goals.every(g => !g) && <span className="text-xs text-slate-300 italic">No goals listed</span>}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-rose-600 mb-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> Pain Points
              </h4>
              <ul className="space-y-1">
                {data.frustrations.filter(f => f).map((f, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                     <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></span>
                    {f}
                  </li>
                ))}
                 {data.frustrations.every(f => !f) && <span className="text-xs text-slate-300 italic">No pain points listed</span>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * SUB-VIEW: PROJECT DASHBOARD
 */
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
            
            {/* Extended Project Info */}
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

/**
 * SUB-VIEW: PERSONA LIBRARY
 */
const PersonaLibrary = ({ project, personas, onEdit, onCreateNew, onUpdateProject, onDeletePersona }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const isProjectView = !!project.id; // If project has ID, it's a specific project, otherwise global library
  
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
           {/* Breadcrumb only for specific projects */}
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
      
      {/* CONDITIONAL RENDER: Project Meta OR Library Search */}
      {isProjectView ? (
        /* Project Meta Display - Only specific projects */
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
        /* Library Search Bar - Global View Only */
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
          {/* Create New Card */}
          <div 
            onClick={onCreateNew}
            className="group border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all min-h-[300px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 mb-4 transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-semibold text-slate-600 group-hover:text-indigo-700">Add New Persona</span>
          </div>

          {/* Existing Personas */}
          {personas.map((persona) => (
            <div key={persona.id} className="group relative">
              <div className="h-full">
                  <PersonaCard data={persona} compact />
              </div>
              {/* Hover Actions */}
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

/**
 * SUB-VIEW: PERSONA BUILDER
 */
const PersonaBuilder = ({ initialData, onSave, onBack }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData || INITIAL_PERSONA_STATE);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);

  // Helper to update state
  const update = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateArray = (field, index, value) => {
    const newArr = [...data[field]];
    newArr[index] = value;
    setData(prev => ({ ...prev, [field]: newArr }));
  };

  // Mock API calls
  const generateImage = async () => {
    setIsGeneratingImg(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    // Select random image based on sex if possible, else generic
    const images = [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format&fit=crop&q=60",
    ];
    const randomImg = images[Math.floor(Math.random() * images.length)];
    
    update('avatarUrl', randomImg);
    setIsGeneratingImg(false);
  };

  const generateVideo = async () => {
    setIsGeneratingVid(true);
    await new Promise(r => setTimeout(r, 2500));
    update('videoUrl', "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"); // Dummy video
    setIsGeneratingVid(false);
  };

  // Steps Configuration
  const steps = [
    { id: 1, label: "Profile", icon: Users },
    { id: 2, label: "Drivers", icon: TargetIcon }, // TargetIcon is actually lucide's Crosshair or similar, defining custom below or finding substitute
    { id: 3, label: "Context", icon: Copy },
    { id: 4, label: "Media", icon: Wand2 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* LEFT: FORM SCROLLABLE */}
      <div className="w-full lg:w-[55%] flex flex-col h-full border-r border-slate-200 bg-white">
        
        {/* Builder Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="font-bold text-slate-800">New Persona</h2>
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" onClick={onBack}>Cancel</Button>
             <Button onClick={() => onSave(data)} icon={Save}>Save Draft</Button>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-8 py-6">
          <div className="flex justify-between relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 transform -translate-y-1/2 rounded-full"></div>
             {steps.map((s, idx) => {
               const isActive = s.id === step;
               const isCompleted = s.id < step;
               return (
                 <div key={s.id} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(s.id)}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : isCompleted ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-white border border-slate-200 text-slate-400'}`}>
                      {isCompleted ? <ChevronRight size={14} /> : s.id}
                   </div>
                   <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{s.label}</span>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* STEP 1: BASIC PROFILE */}
            {step === 1 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800">Basic Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Persona Name" placeholder="e.g. Sarah Chen" value={data.name} onChange={(e) => update('name', e.target.value)} />
                    <Input label="Age" type="number" placeholder="28" value={data.age} onChange={(e) => update('age', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Sex" placeholder="Female" value={data.sex} onChange={(e) => update('sex', e.target.value)} />
                    <Input label="Nationality/Location" placeholder="San Francisco, CA" value={data.nationality} onChange={(e) => update('nationality', e.target.value)} />
                  </div>
                  <Input label="Project Role" placeholder="e.g. Lead User, Admin, Buyer" value={data.role} onChange={(e) => update('role', e.target.value)} />
                  <Input label="Occupation" placeholder="e.g. Senior Software Architect" value={data.occupation} onChange={(e) => update('occupation', e.target.value)} />
                </div>
              </>
            )}

            {/* STEP 2: GOALS & PAIN POINTS */}
            {step === 2 && (
              <>
                 <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800">Drivers & Motivation</h3>
                  
                  {/* Goals */}
                  <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                     <label className="text-xs font-bold uppercase text-emerald-700 mb-2 block">Key Goals</label>
                     <div className="space-y-3">
                       {data.goals.map((g, i) => (
                         <Input 
                            key={`goal-${i}`} 
                            placeholder={`Goal #${i+1}`} 
                            value={g} 
                            onChange={(e) => updateArray('goals', i, e.target.value)}
                            className="bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-100"
                          />
                       ))}
                     </div>
                  </div>

                  {/* Frustrations */}
                  <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100">
                     <label className="text-xs font-bold uppercase text-rose-700 mb-2 block">Frustrations & Pain Points</label>
                     <div className="space-y-3">
                       {data.frustrations.map((f, i) => (
                         <Input 
                            key={`frust-${i}`} 
                            placeholder={`Frustration #${i+1}`} 
                            value={f} 
                            onChange={(e) => updateArray('frustrations', i, e.target.value)}
                            className="bg-white border-rose-200 focus:border-rose-500 focus:ring-rose-100"
                          />
                       ))}
                     </div>
                  </div>

                  <TextArea label="Motivation Statement" placeholder="What drives them to use this product?" value={data.motivation} onChange={(e) => update('motivation', e.target.value)} />
                </div>
              </>
            )}

            {/* STEP 3: CONTEXT & NARRATIVE */}
            {step === 3 && (
              <>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800">Context & Narrative</h3>
                  <TextArea label="Background Story" rows={5} placeholder="Write a short paragraph about their history..." value={data.bio} onChange={(e) => update('bio', e.target.value)} />
                  <TextArea label="Key Quote" placeholder="Something they would typically say..." value={data.quote} onChange={(e) => update('quote', e.target.value)} />
                  <div className="h-px bg-slate-200 my-4" />
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-800">
                      <Video size={18} />
                      <span className="font-semibold text-sm">Video Script (Narrative)</span>
                    </div>
                    <p className="text-xs text-indigo-600 mb-3">This text will be spoken by the AI avatar in the generated video.</p>
                    <TextArea 
                      rows={6} 
                      className="bg-white" 
                      placeholder="Hi, I'm Sarah. I've been working in tech for 10 years and..." 
                      value={data.narrative} 
                      onChange={(e) => update('narrative', e.target.value)} 
                    />
                  </div>
                </div>
              </>
            )}

            {/* STEP 4: MEDIA GENERATION */}
            {step === 4 && (
              <>
                 <div className="space-y-6">
                   <h3 className="text-xl font-bold text-slate-800">Media Generation</h3>
                   
                   {/* Image Gen Section */}
                   <Card>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                          <ImageIcon size={18} className="text-indigo-500" />
                          Portrait Generation
                        </h4>
                        {data.avatarUrl && <Badge color="emerald">Generated</Badge>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {AVATAR_STYLES.map(style => (
                          <div 
                            key={style.id}
                            onClick={() => update('avatarStyle', style.label)}
                            className={`p-3 rounded-lg border text-center cursor-pointer text-sm font-medium transition-all ${data.avatarStyle === style.label ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                          >
                            {style.label}
                          </div>
                        ))}
                      </div>

                      <Button 
                        onClick={generateImage} 
                        loading={isGeneratingImg} 
                        className="w-full"
                        icon={Wand2}
                      >
                        {data.avatarUrl ? "Regenerate Portrait" : "Generate AI Portrait"}
                      </Button>
                   </Card>

                   {/* Video Gen Section */}
                   <Card className={!data.avatarUrl ? "opacity-50 pointer-events-none grayscale" : ""}>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                          <Video size={18} className="text-rose-500" />
                          Talking Head Video
                        </h4>
                        {data.videoUrl && <Badge color="emerald">Ready</Badge>}
                      </div>
                      <p className="text-sm text-slate-500 mb-4">
                        Generates a video using the portrait above and the script from the Context step.
                      </p>
                      
                      {data.videoUrl ? (
                         <div className="mb-4 bg-slate-900 rounded-lg aspect-video flex items-center justify-center relative group cursor-pointer overflow-hidden">
                            <video src={data.videoUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                            <PlayCircle size={48} className="text-white absolute z-10 drop-shadow-lg" />
                         </div>
                      ) : null}

                      <Button 
                        onClick={generateVideo} 
                        loading={isGeneratingVid} 
                        className="w-full"
                        variant="secondary"
                        icon={Video}
                      >
                        {data.videoUrl ? "Regenerate Video" : "Generate Video"}
                      </Button>
                   </Card>
                 </div>
              </>
            )}

            {/* Form Footer Navigation */}
            <div className="pt-8 flex justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button 
                onClick={() => {
                  if (step < 4) setStep(step + 1);
                  else onSave(data);
                }}
              >
                {step === 4 ? "Finish & Save" : "Next Step"}
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT: PREVIEW PANEL (Sticky) */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-100 flex-col border-l border-slate-200">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-slate-50">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Preview</span>
          <div className="flex gap-2">
             <button title="Download PDF" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-md transition-all">
                <Download size={16} />
             </button>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-md h-[80vh] transition-all duration-500 ease-out transform">
             <PersonaCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN APP CONTAINER
 */
export default function App() {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, library, builder
  const [selectedProject, setSelectedProject] = useState(null);
  const [editPersona, setEditPersona] = useState(null);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [allPersonas, setAllPersonas] = useState(MOCK_INITIAL_PERSONAS);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Handlers
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
    // Update local projects list
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    // Update currently selected project
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

    // 1. Remove from all personas list
    setAllPersonas(prev => prev.filter(p => p.id !== personaId));

    // 2. If it belongs to a project, update that project's count
    if (persona.projectId) {
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === persona.projectId) {
                return { ...p, personas: Math.max(0, p.personas - 1) };
            }
            return p;
        }));

        // 3. If the deleted persona was in the currently viewed project, update the selectedProject state
        if (selectedProject?.id === persona.projectId) {
            setSelectedProject(prev => ({ ...prev, personas: Math.max(0, prev.personas - 1) }));
        }
    }
  };

  const handleSavePersona = (data) => {
    // Determine if it's new or existing
    if (data.id) {
        // Update existing
        const updatedPersonas = allPersonas.map(p => p.id === data.id ? data : p);
        setAllPersonas(updatedPersonas);
    } else {
        // Create new
        const newPersona = {
            ...data,
            id: Math.floor(Math.random() * 100000), // Random ID
            projectId: selectedProject ? selectedProject.id : null, // Link to project if selected
        };
        setAllPersonas([...allPersonas, newPersona]);

        // If created within a project, update project count
        if (selectedProject) {
            const updatedProjects = projects.map(p => {
                if (p.id === selectedProject.id) {
                    return { ...p, personas: p.personas + 1 };
                }
                return p;
            });
            setProjects(updatedProjects);
            // Also update selectedProject so the UI updates
            const updatedCurrentProject = updatedProjects.find(p => p.id === selectedProject.id);
            setSelectedProject(updatedCurrentProject);
        }
    }
    setActiveView('library');
  };

  const SidebarItem = ({ id, icon: Icon, label, onClick }) => {
     // Active state logic:
     // - Dashboard: Active only when view is 'dashboard'
     // - Library (All Personas): Active only when view is 'library' AND no specific project is selected (projects have IDs)
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

  // Get personas filtered by view
  const getFilteredPersonas = () => {
      if (activeView === 'library' && selectedProject?.id) {
          return allPersonas.filter(p => p.projectId === selectedProject.id);
      }
      return allPersonas;
  };

  // Full Screen Builder Mode (Hides Sidebar)
  if (activeView === 'builder') {
    return (
      <PersonaBuilder 
        initialData={editPersona} 
        onSave={handleSavePersona} 
        onBack={() => setActiveView('library')} 
      />
    );
  }

  // Dashboard / Library Layout
  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      <CreateProjectModal 
         isOpen={isProjectModalOpen} 
         onClose={() => setIsProjectModalOpen(false)}
         onSave={handleCreateProject}
      />
      
      {/* Sidebar */}
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-white relative">
        {/* Watermark */}
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

// Icon for target since lucide might not export 'TargetIcon' directly by that name sometimes
const TargetIcon = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);