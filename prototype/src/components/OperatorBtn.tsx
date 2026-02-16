import React from 'react';
import { motion } from 'framer-motion';

interface OperatorBtnProps {
  op: string;
  isSelected: boolean;
  onClick: () => void;
}

export const OperatorBtn: React.FC<OperatorBtnProps> = ({ op, isSelected, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-mono border transition-all ${
        isSelected
          ? 'bg-orange-500 text-zinc-900 border-orange-400'
          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
      }`}
    >
      {op}
    </motion.button>
  );
};
