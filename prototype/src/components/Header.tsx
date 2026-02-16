import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  progress: number; // 0 to 100
  streak: number;
}

export const Header: React.FC<HeaderProps> = ({ progress, streak }) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Win Streak</span>
          <div className="text-zinc-100 font-mono text-xl flex items-center gap-2">
            <span className="text-orange-500">STREAK:</span> {streak}
          </div>
        </div>
        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Target: 24
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange-500"
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>
    </div>
  );
};
