import { useState, useRef } from 'react';
import { 
  Mic, 
  Square, 
  FileText, 
  Brain, 
  Activity, 
  AlertCircle,
  Save,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { AppData } from '../types';

interface VoiceNotesProps {
  data: AppData;
  onRefresh: () => void;
}

// System instruction for Gemini
const SYSTEM_PROMPT = `
You are a precision medical scribe. 
Convert the provided unstructured medical dictation into a structured patient note in JSON format.
Include:
1. Chief Complaint
2. Vital Signs (if mentioned)
3. Diagnosis/Findings
4. Prescribed Medication
5. Follow-up Plan

Format the output clearly and professionally.
`;

export default function VoiceNotes({ data }: VoiceNotesProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      if (currentTranscript) {
        setTranscript(prev => prev + ' ' + currentTranscript);
      }
    };

    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const analyzeNotes = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: transcript,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json"
        }
      });
      
      const analysis = JSON.parse(response.text || '{}');
      setAiAnalysis(analysis);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clear = () => {
    setTranscript('');
    setAiAnalysis(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">AI Medical Scribe</h1>
        <p className="text-slate-500">Dictate clinical notes and let AI structure them for patient records.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recording Pane */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Mic className="text-teal-600" />
                Live Dictation
              </h3>
              <div className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isRecording ? 'Recording...' : 'Idle'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 min-h-[300px] border border-slate-100 flex flex-col">
              <div className="flex-1 text-slate-700 leading-relaxed italic">
                {transcript || 'Select a patient and click "Start Recording" to begin dictating notes...'}
              </div>
              
              <AnimatePresence>
                {isRecording && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-1.5 mt-4 h-4 items-end"
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                        className="w-1.5 bg-teal-500 rounded-full"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Target Patient</label>
               <select 
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 mb-6"
                 value={selectedPatientId}
                 onChange={e => setSelectedPatientId(e.target.value)}
               >
                 <option value="">Select Patient Context</option>
                 {data.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
               </select>

               <div className="flex gap-4">
                 {!isRecording ? (
                   <button 
                     onClick={startRecording}
                     className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all"
                   >
                     <Mic size={20} />
                     Start Recording
                   </button>
                 ) : (
                   <button 
                     onClick={stopRecording}
                     className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 animate-pulse"
                   >
                     <Square size={20} />
                     Stop Recording
                   </button>
                 )}
                 <button 
                   onClick={clear}
                   className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-colors"
                   title="Clear Transcript"
                 >
                   <Trash2 size={24} />
                 </button>
               </div>
            </div>
          </div>

          <button 
            disabled={!transcript || isProcessing}
            onClick={analyzeNotes}
            className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
              !transcript || isProcessing
                ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50 shadow-lg shadow-indigo-100'
            }`}
          >
            {isProcessing ? (
              <>
                <Activity className="animate-spin" size={20} />
                AI Scribe is Thinking...
              </>
            ) : (
              <>
                <Brain size={20} />
                Generate Structured Patient Note
              </>
            )}
          </button>
        </div>

        {/* AI Result Pane */}
        <div className="space-y-6">
           <AnimatePresence mode="wait">
             {!aiAnalysis ? (
               <motion.div 
                 key="placeholder"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center"
               >
                 <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                   <FileText size={48} className="text-slate-200" />
                 </div>
                 <h4 className="text-slate-800 font-bold mb-2">Structured Output Preview</h4>
                 <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed underline-offset-4">
                    Once you record a dictation, click <strong>"Generate Structured note"</strong> to see AI-processed findings here.
                 </p>
                 <div className="mt-8 grid grid-cols-2 gap-3 w-full opacity-30 select-none pointer-events-none">
                    <div className="h-4 bg-slate-300 rounded overflow-hidden relative">
                       <motion.div animate={{x: ['0%','100%']}} transition={{repeat:Infinity, duration: 1}} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></motion.div>
                    </div>
                    <div className="h-4 bg-slate-300 rounded overflow-hidden relative">
                       <motion.div animate={{x: ['0%','100%']}} transition={{repeat:Infinity, duration: 1.2}} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></motion.div>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div 
                 key="result"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full"
               >
                 <div className="bg-indigo-600 p-6 text-white">
                   <div className="flex items-center justify-between mb-2">
                     <h3 className="font-bold text-lg flex items-center gap-2">
                       <Brain size={20} className="text-indigo-200" />
                       Clinical Note Summary
                     </h3>
                     <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded border border-white/10 tracking-widest">GEMINI PRO</span>
                   </div>
                   <p className="text-indigo-100 text-xs">Derived from voice input. Please verify medical accuracy.</p>
                 </div>

                 <div className="p-6 flex-1 overflow-y-auto space-y-6">
                   {/* Fields */}
                   <div className="space-y-4">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Chief Complaint</p>
                       <p className="text-slate-800 font-semibold">{aiAnalysis["Chief Complaint"] || 'Not specified'}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vital Signs</p>
                          <p className="text-slate-800 font-bold text-sm leading-relaxed">{aiAnalysis["Vital Signs"] || 'WNL'}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                          <p className="text-indigo-700 font-bold text-sm leading-relaxed">{aiAnalysis["Diagnosis/Findings"] || 'Pending verification'}</p>
                        </div>
                     </div>

                     <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                       <div className="flex items-center gap-2 mb-2">
                         <Activity size={16} className="text-indigo-600" />
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Prescribed Medication</p>
                       </div>
                       <p className="text-indigo-900 font-bold">{aiAnalysis["Prescribed Medication"] || 'None'}</p>
                     </div>

                     <div className="p-4 bg-slate-900 rounded-2xl text-white">
                        <div className="flex items-center gap-2 mb-2">
                         <AlertCircle size={16} className="text-teal-400" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow-up Plan</p>
                       </div>
                       <p className="text-teal-50 font-medium text-sm leading-relaxed">{aiAnalysis["Follow-up Plan"] || 'Monitor symptoms'}</p>
                     </div>
                   </div>
                 </div>

                 <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                   <button className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all">
                     <Save size={18} />
                     Save to EMR
                   </button>
                   <button 
                    onClick={() => setAiAnalysis(null)}
                    className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                   >
                     Discard
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
