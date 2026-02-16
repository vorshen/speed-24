import React from 'react';
import { motion } from 'framer-motion';

interface GameCardProps {
  value: number | string;
  rank: string;
  suit: string;
  isSelected: boolean;
  isUsed: boolean;
  onClick: () => void;
}

const suitIcons: Record<string, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

const suitColors: Record<string, string> = {
  spades: 'text-zinc-100',
  hearts: 'text-orange-500',
  diamonds: 'text-orange-500',
  clubs: 'text-zinc-100',
};

export const GameCard: React.FC<GameCardProps> = ({ value, rank, suit, isSelected, isUsed, onClick }) => {
  if (isUsed) return <div className="w-full aspect-[3/4] opacity-0" />;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative w-full aspect-[3/4] rounded-xl flex flex-col items-center justify-center border transition-all duration-200 ${
        isSelected
          ? 'bg-zinc-700 border-orange-500 ring-2 ring-orange-500/50 -translate-y-2'
          : 'bg-zinc-800 border-zinc-700/50 hover:bg-zinc-700/80'
      }`}
    >
      <div className={`absolute top-2 left-2 font-mono text-sm ${suitColors[suit]}`}>
        {rank}
      </div>
      <div className={`absolute bottom-2 right-2 font-mono text-sm ${suitColors[suit]}`}>
        {suitIcons[suit]}
      </div>
      <div className="font-mono text-3xl font-bold text-zinc-100">
        {value}
      </div>
    </motion.button>
  );
};
