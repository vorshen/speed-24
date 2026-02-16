import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Undo2, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { GameCard } from '../components/GameCard';
import { OperatorBtn } from '../components/OperatorBtn';
import { ActionBtn } from '../components/ActionBtn';

// Solver Logic
const solve24 = (numbers: number[]): string | null => {
  const backtrack = (nums: { val: number; expr: string }[]): string | null => {
    if (nums.length === 1) {
      if (Math.abs(nums[0].val - 24) < 0.001) return nums[0].expr;
      return null;
    }
    for (let i = 0; i < nums.length; i++) {
      for (let j = 0; j < nums.length; j++) {
        if (i === j) continue;
        const remaining = nums.filter((_, idx) => idx !== i && idx !== j);
        const a = nums[i];
        const b = nums[j];
        const ops = [
          { val: a.val + b.val, expr: `(${a.expr}+${b.expr})` },
          { val: a.val - b.val, expr: `(${a.expr}-${b.expr})` },
          { val: a.val * b.val, expr: `(${a.expr}*${b.expr})` },
        ];
        if (Math.abs(b.val) > 0.0001) ops.push({ val: a.val / b.val, expr: `(${a.expr}/${b.expr})` });

        for (const op of ops) {
          const res = backtrack([...remaining, op]);
          if (res) return res;
        }
      }
    }
    return null;
  };
  return backtrack(numbers.map(n => ({ val: n, expr: n.toString() })));
};

// Utils
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateSolvableGame = (): any[] => {
  const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const rankValues: Record<string, number> = { A: 1, J: 11, Q: 12, K: 13 };
  ranks.forEach((r, i) => { if (i > 0 && i < 10) rankValues[r] = i + 1; });

  while (true) {
    const cards = Array.from({ length: 4 }, () => {
      const rank = ranks[getRandomInt(0, ranks.length - 1)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        rank,
        value: rankValues[rank],
        suit: suits[getRandomInt(0, suits.length - 1)],
        isUsed: false,
      };
    });
    if (solve24(cards.map(c => c.value))) return cards;
  }
};

export default function Game() {
  const { level } = window.App.currentState.params;
  const timeLimit = level === 'easy' ? 30 : level === 'medium' ? 20 : 10;

  const [cards, setCards] = useState<any[]>([]);
  const [initialCards, setInitialCards] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([]);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [currentExpression, setCurrentExpression] = useState<string>('');
  const [gameState, setGameState] = useState<'playing' | 'win' | 'lose'>('playing');
  const [hint, setHint] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  const initGame = () => {
    const newCards = generateSolvableGame();
    setCards(newCards);
    setInitialCards(newCards);
    setHistory([]);
    setSelectedIndex(null);
    setSelectedOp(null);
    setCurrentExpression('');
    setGameState('playing');
    setTimeLeft(timeLimit);
    setHint(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0) {
            setGameState('lose');
            return 0;
          }
          return t - 0.1;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const onCardClick = (idx: number) => {
    if (gameState !== 'playing') return;
    if (cards[idx].isUsed) return;

    if (selectedIndex === null) {
      setSelectedIndex(idx);
    } else if (selectedIndex === idx) {
      setSelectedIndex(null);
      setSelectedOp(null);
    } else if (selectedOp) {
      // Perform operation
      const val1 = cards[selectedIndex].value;
      const val2 = cards[idx].value;
      let result = 0;
      switch (selectedOp) {
        case '+': result = val1 + val2; break;
        case '-': result = val1 - val2; break;
        case '×': result = val1 * val2; break;
        case '÷': 
          if (val2 === 0) return;
          result = val1 / val2; 
          break;
      }

      setHistory([...history, [...cards]]);
      
      const newCards = [...cards];
      newCards[selectedIndex] = { ...newCards[selectedIndex], isUsed: true };
      newCards[idx] = { 
        ...newCards[idx], 
        value: Number(result.toFixed(2)), 
        rank: result % 1 === 0 ? result.toString() : result.toFixed(1),
        suit: 'neutral' // Result cards lose suit/rank identity usually, but let's keep it simple
      };

      setCurrentExpression(`${val1} ${selectedOp} ${val2} = ${newCards[idx].rank}`);
      setCards(newCards);
      setSelectedIndex(null);
      setSelectedOp(null);

      // Check win condition
      const activeCards = newCards.filter(c => !c.isUsed);
      if (activeCards.length === 1) {
        if (Math.abs(activeCards[0].value - 24) < 0.001) {
          setGameState('win');
          setStreak(s => s + 1);
        } else {
          setGameState('lose');
        }
      }
    } else {
      setSelectedIndex(idx);
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setCards(prev);
    setHistory(history.slice(0, -1));
    setSelectedIndex(null);
    setSelectedOp(null);
    setCurrentExpression('');
  };

  const reset = () => {
    setCards(initialCards);
    setHistory([]);
    setSelectedIndex(null);
    setSelectedOp(null);
    setCurrentExpression('');
  };

  const checkSolution = () => {
    const activeValues = cards.filter(c => !c.isUsed).map(c => c.value);
    const solution = solve24(activeValues);
    if (solution) {
      setHint(solution);
      setGameState('lose');
    } else {
      // If no solution (impossible, as we generated solvable, but user might have made it unsolvable)
      setGameState('win');
      setStreak(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col p-6 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => window.App.goBack()} className="text-zinc-500 hover:text-zinc-100">
          <ChevronLeft size={24} />
        </button>
        <Header progress={(timeLeft / timeLimit) * 100} streak={streak} />
      </div>

      {/* Expression Area */}
      <div className="h-24 flex items-center justify-center border-y border-zinc-800/50 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExpression}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono text-2xl font-bold text-zinc-100 tracking-tight"
          >
            {currentExpression || <span className="text-zinc-700 italic text-lg">Express Flow</span>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cards Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
          {cards.map((card, i) => (
            <GameCard
              key={card.id}
              value={card.value}
              rank={card.rank}
              suit={card.suit}
              isSelected={selectedIndex === i}
              isUsed={card.isUsed}
              onClick={() => onCardClick(i)}
            />
          ))}
        </div>
      </div>

      {/* Operators & Actions */}
      <div className="mt-8 space-y-6">
        <div className="flex justify-between px-2">
          {['+', '-', '×', '÷'].map(op => (
            <OperatorBtn
              key={op}
              op={op}
              isSelected={selectedOp === op}
              onClick={() => {
                if (selectedIndex !== null) setSelectedOp(op);
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ActionBtn label="Check!" variant="primary" onClick={checkSolution} />
          <ActionBtn label="Reset" onClick={reset} />
          <ActionBtn label="Undo" onClick={undo} />
        </div>
      </div>

      {/* Game Over Overlays */}
      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-zinc-800 border border-zinc-700 rounded-3xl p-8 text-center space-y-8"
            >
              <div className="space-y-2">
                {gameState === 'win' ? (
                  <>
                    <div className="flex justify-center text-emerald-500 mb-4">
                      <CheckCircle2 size={64} />
                    </div>
                    <h3 className="text-3xl font-mono font-bold text-zinc-100 uppercase tracking-tighter">Target Reached</h3>
                    <p className="text-zinc-400 text-sm">Flow maintained. Streak: {streak}</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center text-orange-500 mb-4">
                      <XCircle size={64} />
                    </div>
                    <h3 className="text-3xl font-mono font-bold text-zinc-100 uppercase tracking-tighter">Connection Lost</h3>
                    <p className="text-zinc-400 text-sm">The flow was interrupted.</p>
                    {hint && (
                      <div className="mt-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/50">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Solution Found</span>
                        <code className="text-orange-500 font-mono text-xl">{hint}</code>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => {
                    initGame();
                  }}
                  className="w-full py-4 bg-orange-500 text-zinc-900 font-bold rounded-xl active:scale-95 transition-all"
                >
                  NEXT LEVEL
                </button>
                <button
                  onClick={() => window.App.transitionTo('home')}
                  className="w-full py-4 bg-zinc-900 text-zinc-400 font-bold rounded-xl border border-zinc-800"
                >
                  QUIT TO MENU
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
