import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

export default function Difficulty() {
  const difficulties = [
    { id: 'easy', label: 'EASY', time: '30s', desc: 'Relaxed focus' },
    { id: 'medium', label: 'MEDIUM', time: '20s', desc: 'Standard flow' },
    { id: 'hard', label: 'HARD', time: '10s', desc: 'Peak performance' },
  ];

  const selectDifficulty = (diff: string) => {
    window.App.transitionTo('game', { level: diff });
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6 flex flex-col">
      <button 
        onClick={() => window.App.goBack()}
        className="mb-12 text-zinc-500 hover:text-zinc-100 transition-colors flex items-center gap-2 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back</span>
      </button>

      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <h2 className="text-zinc-100 text-3xl font-bold font-mono">CHOOSE</h2>
          <p className="text-zinc-500 text-sm">Select your tempo for this session.</p>
        </div>

        <div className="grid gap-4">
          {difficulties.map((diff) => (
            <motion.button
              key={diff.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectDifficulty(diff.id)}
              className="w-full p-6 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-between group hover:border-orange-500/50 transition-colors"
            >
              <div className="text-left">
                <div className="text-orange-500 font-mono text-xl font-bold">{diff.label}</div>
                <div className="text-zinc-500 text-xs mt-1 uppercase tracking-tight">{diff.desc}</div>
              </div>
              <div className="text-zinc-100 font-mono text-2xl">
                {diff.time}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
