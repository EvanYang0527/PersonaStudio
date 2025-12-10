import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Image as ImageIcon,
  PlayCircle,
  Save,
  Users,
  Video,
  Wand2
} from 'lucide-react';
import { AVATAR_STYLES, INITIAL_PERSONA_STATE } from '../data/mockData';
import PersonaCard from './PersonaCard';
import { Badge, Button, Card, Input, TextArea } from './shared/Primitives';
import TargetIcon from '../icons/TargetIcon';

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

export default PersonaBuilder;
