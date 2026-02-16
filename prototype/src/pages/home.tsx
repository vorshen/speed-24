import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const transitionTo = (stateId: string, params = {}) => {
    window.App.transitionTo(stateId, params);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-6 space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h1 className="text-6xl font-mono font-bold text-zinc-100 tracking-tighter">
          FLOW <span className="text-orange-500">24</span>
        </h1>
        <p className="text-zinc-500 font-sans tracking-widest uppercase text-xs">
          Minimalist Brain Fitness
        </p>
      </motion.div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => transitionTo('difficulty')}
          className="w-full py-4 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl font-bold text-lg hover:bg-zinc-750 transition-colors"
        >
          SINGLE PLAYER
        </motion.button>

        <motion.button
          disabled
          className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-700 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
        >
          MULTIPLAYER
          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500 font-normal">SOON</span>
        </motion.button>
      </div>

      <div className="absolute bottom-8 text-zinc-600 font-mono text-[10px] tracking-widest uppercase">
        Aneway Design v1.0
      </div>
    </div>
  );
}
