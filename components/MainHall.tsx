import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { audioService } from "../services/audioService";
import { generateBlessing } from "../services/blessingService";
import { SoundType } from "../types";
import FloatingText from "./FloatingText";

// Modular imports
import SacredHalo from "./SacredHalo";
import ParallaxBuddha from "./ParallaxBuddha";
import Burner from "./Burner";
import Woodfish from "./Woodfish";
import Bell from "./Bell";
import Floor from "./Floor";
import ParallaxCamera from "./ParallaxCamera";

// --- Scene Configuration ---

const Scene = ({
  incenseLit,
  onLightIncense,
  onWoodfish,
  onBell,
}: {
  incenseLit: boolean;
  onLightIncense: () => void;
  onWoodfish: (e: any) => void;
  onBell: (e: any) => void;
}) => {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 5, 15]} />

      <ParallaxCamera />

      {/* Lights */}
      <ambientLight intensity={0.2} />
      <spotLight
        position={[0, 12, 1.5]}
        angle={0.35}
        penumbra={0.6}
        intensity={3}
        color="#ffddaa"
        castShadow
        distance={20}
        decay={2}
      />
      <spotLight
        position={[0, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#ffccaa"
        castShadow
      />
      <pointLight
        position={[-5, 2, 0]}
        intensity={1}
        color="#0044ff"
        distance={10}
      />

      {/* --- Parallax Layers --- */}
      <SacredHalo />

      <ParallaxBuddha />

      {/* Layer 3: Particles (Mid-Front) */}
      <Sparkles
        count={50}
        scale={3}
        size={20}
        speed={0.4}
        opacity={0.05}
        color="#ffd700"
        position={[0, 0, 0]}
      />

      {/* Layer 4: Interactive Items (Foreground) */}
      <Burner lit={incenseLit} onClick={onLightIncense} />
      <Woodfish onClick={onWoodfish} />
      <Bell onClick={onBell} />

      <Floor />
    </>
  );
};

// --- Main Layout ---

interface MainHallProps {
  onBack: () => void;
}

const MainHall: React.FC<MainHallProps> = ({ onBack }) => {
  const [incenseLit, setIncenseLit] = useState(false);
  const [merit, setMerit] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: number; x: number; y: number; text: string }[]
  >([]);
  const [viewState, setViewState] = useState<"idle" | "praying" | "result">(
    "idle"
  );
  const [wish, setWish] = useState("");
  const [blessing, setBlessing] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerFloatingText = (text: string, x?: number, y?: number) => {
    const newText = {
      id: Date.now() + Math.random(),
      x: x || window.innerWidth / 2,
      y: y || window.innerHeight / 2 - 100,
      text,
    };
    setFloatingTexts((prev) => [...prev, newText]);
  };

  const handleLightIncense = () => {
    if (!incenseLit) {
      setIncenseLit(true);
      audioService.play(SoundType.BOWL);
      triggerFloatingText("心生欢喜");
    }
  };

  const handleWoodfish = (e: any) => {
    audioService.play(SoundType.WOODFISH);
    setMerit((prev) => prev + 1);
    triggerFloatingText("功德 +1", e.clientX, e.clientY);
  };

  const handleBell = (e: any) => {
    audioService.play(SoundType.BELL);
    triggerFloatingText("烦恼轻 智慧长", e.clientX, e.clientY);
  };

  const handlePraySubmit = async () => {
    if (!wish.trim()) return;
    setLoading(true);
    const response = await generateBlessing(wish);
    setBlessing(response);
    setLoading(false);
    setViewState("result");
    audioService.play(SoundType.BOWL);
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden select-none font-serif">
      {/* 3D Viewport */}
      <div
        className={`w-full h-full transition-all duration-1000 ${
          viewState !== "idle" ? "opacity-30 blur-sm" : "opacity-100"
        }`}
      >
        <Canvas
          shadows
          camera={{ position: [0, 1.5, 5], fov: 40 }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <Scene
              incenseLit={incenseLit}
              onLightIncense={handleLightIncense}
              onWoodfish={handleWoodfish}
              onBell={handleBell}
            />
          </Suspense>

          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.2}
              radius={0.5}
            />
            <Vignette offset={0.3} darkness={1.0} />
            <Noise opacity={0.05} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between z-10 pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto text-stone-500 hover:text-white transition-colors flex items-center gap-3 group"
        >
          <span className="text-2xl font-light group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="text-xs tracking-[0.3em] uppercase">Exit</span>
        </button>

        <div className="flex flex-col items-end pointer-events-auto">
          <div className="text-[10px] text-amber-500/50 uppercase tracking-widest mb-1">
            Merit
          </div>
          <div className="text-3xl font-light text-amber-500 font-serif">
            {merit}
          </div>
        </div>
      </div>

      {/* Floating Texts */}
      {floatingTexts.map((ft) => (
        <FloatingText
          key={ft.id}
          x={ft.x}
          y={ft.y}
          text={ft.text}
          onComplete={() =>
            setFloatingTexts((prev) => prev.filter((item) => item.id !== ft.id))
          }
        />
      ))}

      {/* Prayer Trigger */}
      {viewState === "idle" && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => setViewState("praying")}
            className="text-amber-100/80 border border-amber-500/30 bg-black/40 backdrop-blur-md px-12 py-3 rounded-full hover:bg-amber-900/20 hover:border-amber-500/60 transition-all duration-500 tracking-[0.5em] font-serif text-sm uppercase group shadow-[0_0_30px_rgba(217,119,6,0.2)]"
          >
            <span className="group-hover:text-white transition-colors">
              Make a Wish
            </span>
          </button>
        </div>
      )}

      {/* Prayer Modal */}
      {viewState === "praying" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-6">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-stone-800 p-10 relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>

            <h2 className="text-center text-amber-500 font-serif text-2xl tracking-[0.5em] mb-10">
              祈愿
            </h2>

            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="所求皆如愿，所行化坦途..."
              className="w-full h-32 bg-stone-900/50 border border-stone-800 text-stone-300 p-4 font-serif text-lg focus:outline-none focus:border-amber-900/50 resize-none text-center placeholder:text-stone-700/50 mb-8"
              autoFocus
            />

            <div className="flex justify-center gap-8">
              <button
                onClick={() => setViewState("idle")}
                className="text-stone-600 hover:text-stone-400 text-xs tracking-widest uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handlePraySubmit}
                disabled={loading || !wish.trim()}
                className="text-amber-500 hover:text-amber-200 text-xs tracking-widest uppercase border-b border-amber-900 hover:border-amber-500 pb-1 disabled:opacity-50 transition-colors"
              >
                {loading ? "Consulting..." : "Offer Prayer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {viewState === "result" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl animate-fade-in p-6">
          <div className="max-w-xl text-center">
            <div className="text-amber-500/20 text-6xl mb-8 font-thin animate-pulse-slow">
              ❖
            </div>
            <p className="text-stone-300 font-serif text-lg leading-loose tracking-wide mb-12">
              {blessing}
            </p>
            <button
              onClick={() => {
                setViewState("idle");
                setWish("");
              }}
              className="text-stone-500 hover:text-white text-xs tracking-[0.3em] uppercase transition-colors"
            >
              Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainHall;
