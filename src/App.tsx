import React, { useState } from "react";
import { Form } from "./components/Form";
import { Dashboard } from "./components/Dashboard";
import { SimulationResult, UserInput } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [lastInput, setLastInput] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setLastInput(data);
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate simulation. Please try again.");
      }

      const resData = await response.json();
      setResult(resData);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 selection:bg-cyan-500/30 font-sans flex flex-col border-8 border-zinc-900 box-border">
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-center p-6 md:p-12 lg:p-16">
        {error && (
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl max-w-2xl mx-auto w-full text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Form onSubmit={handleSimulate} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Dashboard data={result} input={lastInput} onReset={() => setResult(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {result && (
        <footer className="px-10 py-4 flex flex-col sm:flex-row justify-between items-center border-t border-zinc-800 bg-[#080808] text-[10px] text-zinc-600 w-full mt-auto">
          <div className="flex gap-4 mb-2 sm:mb-0">
            <span>ESTIMATION ENGINE V2.4</span>
            <span className="text-zinc-800">|</span>
            <span>DATA SOURCE: COMPOUND LOGIC ALGORITHM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="tracking-[0.2em] uppercase">Lifeline Synced</span>
          </div>
        </footer>
      )}
    </div>
  );
}
