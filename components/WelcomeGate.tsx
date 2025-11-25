import React from 'react';
import { audioService } from '../services/audioService';
import { SoundType } from '../types';

interface WelcomeGateProps {
  onEnter: () => void;
}

const WelcomeGate: React.FC<WelcomeGateProps> = ({ onEnter }) => {
  const handleEnter = () => {
    // Attempt to start audio context on user interaction
    audioService.play(SoundType.BOWL);
    onEnter();
  };

  return (
    <div className="h-screen w-full bg-[#050505] relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900/20 rounded-full blur-[100px] animate-pulse-slow"></div>
         <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[80px]"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 text-center px-4 animate-fade-in flex flex-col items-center">
        
        {/* Logo Mark */}
        <div className="mb-12 relative">
           <div className="w-16 h-16 border border-amber-700/50 rotate-45 flex items-center justify-center mx-auto relative overflow-hidden">
             <div className="absolute inset-0 bg-amber-500/10 blur-sm"></div>
             <span className="text-amber-500 font-serif text-xl -rotate-45">Zen</span>
           </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-900 mb-8 tracking-wider">
          CLOUD TEMPLE
        </h1>
        
        <p className="text-stone-500 font-serif text-sm tracking-[0.4em] mb-20 uppercase">
          Digital Sanctuary & Mindfulness
        </p>

        <button 
          onClick={handleEnter}
          className="group relative px-10 py-3 overflow-hidden transition-all duration-500"
        >
          <div className="absolute inset-0 border border-stone-800 group-hover:border-amber-700/50 transition-colors"></div>
          <span className="relative text-stone-400 group-hover:text-amber-100 font-serif text-xs tracking-[0.3em] uppercase transition-colors">
            Enter
          </span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeGate;