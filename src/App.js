import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Code, Network, Lock } from 'lucide-react';
import './App.css';

const GlitchText = ({ text }) => {
  return (
    <div className="glitch" data-text={text}>
      {text}
    </div>
  );
};

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const oranges = ['#FF9900', '#FFA500', '#FFB700'];
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(Math.random() * 128);
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = oranges[Math.floor(Math.random() * oranges.length)];
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

const CommandConsole = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (input.toLowerCase() === 'trust nothing') {
      setMessage('Access granted. Initializing Native Network...');
      setTimeout(() => {
        onUnlock();
      }, 2000);
    }
  }, [input, onUnlock]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-black bg-opacity-75 border-2 border-orange-500 p-4 font-mono text-orange-500 glitch-container">
      <div className="mb-4">
        <GlitchText text="Enter access code:" />
      </div>
      <div className="flex items-center">
        <span className="mr-2">&gt;</span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="bg-transparent border-none outline-none flex-grow text-orange-500"
          autoFocus
        />
        <span className={showCursor ? 'opacity-100' : 'opacity-0'}>|</span>
      </div>
      {message && <div className="mt-4 text-sm glitch" data-text={message}>{message}</div>}
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, content }) => (
  <div className="bg-black bg-opacity-75 p-6 rounded-lg shadow-neon border border-orange-500 mb-6 transition-all duration-300 hover:scale-105 glitch-container">
    <div className="flex items-center mb-4">
      <Icon className="text-orange-500 mr-4" size={24} />
      <h3 className="text-xl font-bold">
        <GlitchText text={title} />
      </h3>
    </div>
    <p className="text-orange-400">{content}</p>
  </div>
);

const MainContent = () => {
  const [infoIndex, setInfoIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const projectInfo = [
    {
      icon: Shield,
      title: "Zero Trust Architecture",
      content: "Native Network implements a revolutionary Zero Trust Architecture, ensuring unparalleled security for all transactions and smart contracts on the Bitcoin network."
    },
    {
      icon: Lock,
      title: "Native BTC Programmability",
      content: "Unlock the full potential of Bitcoin with native programmability. Create complex smart contracts and decentralized applications (dApps) directly on the Bitcoin blockchain."
    },
    {
      icon: Zap,
      title: "Lightning-Fast Transactions",
      content: "Experience near-instantaneous transaction finality with Native Network's innovative consensus mechanism, built on top of Bitcoin's robust security model."
    },
    {
      icon: Code,
      title: "Developer-Friendly Environment",
      content: "Build the next generation of Bitcoin applications with our comprehensive SDK and developer tools. Native Network supports popular programming languages and frameworks."
    },
    {
      icon: Network,
      title: "Seamless Interoperability",
      content: "Connect with existing Bitcoin infrastructure and other blockchain networks effortlessly. Native Network acts as a bridge, enabling cross-chain communication and asset transfers."
    }
  ];

  useEffect(() => {
  const timer = setInterval(() => {
    setDirection(infoIndex === projectInfo.length - 1 ? 'left' : 'right');
    setInfoIndex((prevIndex) => (prevIndex + 1) % projectInfo.length);
  }, 4000); // Change info every 4 seconds
  return () => clearInterval(timer);
}, [infoIndex, projectInfo.length]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 text-orange-500 font-mono p-8 flex flex-col justify-center items-center overflow-hidden">
      <h1 className="text-4xl font-bold mb-8 text-center glitch" data-text="Native Network: Revolutionizing Bitcoin">
        Native Network: Revolutionizing Bitcoin
      </h1>
      <div className="max-w-2xl w-full relative h-64">
        <div
          key={infoIndex}
          className={`absolute w-full transition-all duration-500 ease-in-out ${
            direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          <InfoCard {...projectInfo[infoIndex]} />
        </div>
      </div>
      <div className="text-sm mt-8 animate-pulse">
        <GlitchText text="Press any key to return to the Matrix..." />
      </div>
    </div>
  );
};

const App = () => {
  const [stage, setStage] = useState('matrix');

  useEffect(() => {
    if (stage === 'matrix') {
      const timer = setTimeout(() => {
        setStage('console');
      }, 3000); // Show console after 3 seconds
      return () => clearTimeout(timer);
    }

    if (stage === 'content') {
      const handleKeyPress = () => setStage('matrix');
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [stage]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <MatrixRain />
      {stage === 'console' && <CommandConsole onUnlock={() => setStage('content')} />}
      {stage === 'content' && <MainContent />}
    </div>
  );
};

export default App;
