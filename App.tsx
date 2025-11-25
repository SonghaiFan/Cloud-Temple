import React, { useState } from "react";
import WelcomeGate from "./components/WelcomeGate";
import MainHall from "./components/MainHall";

const App: React.FC = () => {
  const [inTemple, setInTemple] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (inTemple && audioRef.current) {
      audioRef.current.play().catch(() => {});
    } else if (!inTemple && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [inTemple]);

  return (
    <div className="antialiased text-stone-200">
      {/* 背景音乐 */}
      <audio
        ref={audioRef}
        src={import.meta.env.BASE_URL + "celestial-buddha-light.mp3"}
        loop
        autoPlay={false}
        preload="auto"
        style={{ display: "none" }}
      />
      {inTemple ? (
        <MainHall onBack={() => setInTemple(false)} />
      ) : (
        <WelcomeGate onEnter={() => setInTemple(true)} />
      )}
    </div>
  );
};

export default App;
