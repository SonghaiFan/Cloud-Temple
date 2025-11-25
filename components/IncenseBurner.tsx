import React from 'react';

interface IncenseBurnerProps {
  lit: boolean;
  onLight: () => void;
}

const IncenseBurner: React.FC<IncenseBurnerProps> = ({ lit, onLight }) => {
  return (
    <div className="relative flex flex-col items-center justify-end h-64 w-40">
      {/* Smoke Particles */}
      {lit && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute left-1/2 bottom-0 w-2 h-2 bg-gray-400 rounded-full blur-sm animate-smoke opacity-50" style={{ animationDelay: '0s' }}></div>
          <div className="absolute left-1/2 bottom-4 w-3 h-3 bg-gray-300 rounded-full blur-md animate-smoke opacity-40" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute left-1/2 bottom-0 w-2 h-2 bg-gray-400 rounded-full blur-sm animate-smoke opacity-50" style={{ animationDelay: '2.8s' }}></div>
        </div>
      )}

      {/* Incense Sticks */}
      <div 
        className={`transition-all duration-1000 ${lit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} flex gap-2 mb-2`}
      >
        <div className="w-1 h-24 bg-red-800 relative">
          {lit && <div className="absolute -top-1 left-0 w-full h-1 bg-orange-500 animate-pulse rounded-full shadow-[0_0_10px_orange]"></div>}
        </div>
        <div className="w-1 h-28 bg-red-800 relative -mt-2">
           {lit && <div className="absolute -top-1 left-0 w-full h-1 bg-orange-500 animate-pulse rounded-full shadow-[0_0_10px_orange]"></div>}
        </div>
        <div className="w-1 h-24 bg-red-800 relative">
           {lit && <div className="absolute -top-1 left-0 w-full h-1 bg-orange-500 animate-pulse rounded-full shadow-[0_0_10px_orange]"></div>}
        </div>
      </div>

      {/* Burner Pot */}
      <button 
        onClick={onLight}
        disabled={lit}
        className={`
          relative w-32 h-24 bg-gradient-to-b from-yellow-700 to-yellow-900 rounded-b-[3rem] rounded-t-lg shadow-2xl border-t-4 border-yellow-600
          flex items-center justify-center group cursor-pointer transition-transform
          ${!lit ? 'hover:scale-105 active:scale-95' : ''}
        `}
      >
        {/* Decorative details */}
        <div className="absolute top-4 w-24 h-1 bg-yellow-900/50"></div>
        <div className="text-4xl text-yellow-500/80 font-serif opacity-80">
            禅
        </div>
        
        {!lit && (
          <div className="absolute -bottom-10 text-white/70 text-sm font-serif opacity-0 group-hover:opacity-100 transition-opacity">
            点击上香
          </div>
        )}
      </button>
      
      {/* Ash bed */}
      <div className="absolute bottom-20 w-28 h-4 bg-gray-300/30 rounded-full blur-sm"></div>
    </div>
  );
};

export default IncenseBurner;
