import React from 'react';
import { motion } from 'framer-motion';

interface ActionBtnProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
}

export const ActionBtn: React.FC<ActionBtnProps> = ({ label, variant = 'secondary', onClick, disabled }) => {
  const baseClasses = "px-4 py-3 rounded-lg font-bold tracking-wide transition-all active:translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-orange-600 hover:bg-orange-500 text-zinc-100 shadow-lg shadow-orange-900/20",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700/50",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {label}
    </motion.button>
  );
};
