import React, { useState } from 'react';
import WelcomeGate from './components/WelcomeGate';
import MainHall from './components/MainHall';

const App: React.FC = () => {
  const [inTemple, setInTemple] = useState(false);

  return (
    <div className="antialiased text-stone-200">
      {inTemple ? (
        <MainHall onBack={() => setInTemple(false)} />
      ) : (
        <WelcomeGate onEnter={() => setInTemple(true)} />
      )}
    </div>
  );
};

export default App;
