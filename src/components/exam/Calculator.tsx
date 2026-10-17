"use client";

import { useState, useCallback } from "react";

// Safe BODMAS calculator — no eval(), no Function(), pure state machine
type CalcOp = "+" | "-" | "×" | "÷" | null;

interface CalcState {
  display: string;
  operand1: number | null;
  operator: CalcOp;
  waitingForOperand2: boolean;
}

const initialCalcState: CalcState = {
  display: "0",
  operand1: null,
  operator: null,
  waitingForOperand2: false,
};

interface CalculatorProps {
  onClose: () => void;
}

export default function Calculator({ onClose }: CalculatorProps) {
  const [calc, setCalc] = useState<CalcState>(initialCalcState);

  const inputDigit = useCallback((digit: string) => {
    setCalc((prev) => {
      if (prev.waitingForOperand2) {
        return { ...prev, display: digit, waitingForOperand2: false };
      }
      return {
        ...prev,
        display: prev.display === "0" ? digit : prev.display.length < 15 ? prev.display + digit : prev.display,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setCalc((prev) => {
      if (prev.waitingForOperand2) {
        return { ...prev, display: "0.", waitingForOperand2: false };
      }
      if (!prev.display.includes(".")) {
        return { ...prev, display: prev.display + "." };
      }
      return prev;
    });
  }, []);

  const inputOperator = useCallback((op: CalcOp) => {
    setCalc((prev) => {
      const val = parseFloat(prev.display);
      if (prev.operand1 !== null && !prev.waitingForOperand2 && prev.operator) {
        // Chain operations
        const result = computeResult(prev.operand1, val, prev.operator);
        return {
          display: formatResult(result),
          operand1: result,
          operator: op,
          waitingForOperand2: true,
        };
      }
      return {
        ...prev,
        operand1: val,
        operator: op,
        waitingForOperand2: true,
      };
    });
  }, []);

  const computeResult = (a: number, b: number, op: CalcOp): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };

  const formatResult = (n: number): string => {
    if (isNaN(n)) return "Error";
    if (!isFinite(n)) return "Error";
    const str = Number.isInteger(n) ? n.toString() : n.toPrecision(10).replace(/\.?0+$/, "");
    return str.length > 15 ? n.toExponential(6) : str;
  };

  const handleEquals = useCallback(() => {
    setCalc((prev) => {
      if (prev.operand1 === null || !prev.operator) return prev;
      const result = computeResult(prev.operand1, parseFloat(prev.display), prev.operator);
      return {
        display: formatResult(result),
        operand1: null,
        operator: null,
        waitingForOperand2: false,
      };
    });
  }, []);

  const handleClear = useCallback(() => setCalc(initialCalcState), []);

  const handleBackspace = useCallback(() => {
    setCalc((prev) => {
      if (prev.waitingForOperand2 || prev.display === "0") return prev;
      const next = prev.display.length > 1 ? prev.display.slice(0, -1) : "0";
      return { ...prev, display: next };
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setCalc((prev) => ({
      ...prev,
      display: prev.display.startsWith("-")
        ? prev.display.slice(1)
        : prev.display === "0"
        ? "0"
        : "-" + prev.display,
    }));
  }, []);

  const handlePercent = useCallback(() => {
    setCalc((prev) => ({
      ...prev,
      display: formatResult(parseFloat(prev.display) / 100),
    }));
  }, []);

  const btnBase =
    "flex items-center justify-center rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer select-none h-11";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-foreground">Calculator</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              BODMAS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Display */}
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <div className="text-[10px] text-muted-foreground h-4 tabular-nums text-right">
            {calc.operand1 !== null ? `${calc.operand1} ${calc.operator}` : ""}
          </div>
          <div className="text-right text-2xl font-black text-foreground tabular-nums truncate">
            {calc.display}
          </div>
        </div>

        {/* Buttons */}
        <div className="p-3 grid grid-cols-4 gap-2">
          {/* Row 1 */}
          <button type="button" onClick={handleClear} className={`${btnBase} col-span-2 bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25`}>AC</button>
          <button type="button" onClick={handleToggleSign} className={`${btnBase} bg-muted text-foreground hover:bg-muted/70`}>+/-</button>
          <button type="button" onClick={handlePercent} className={`${btnBase} bg-muted text-foreground hover:bg-muted/70`}>%</button>

          {/* Row 2 */}
          {["7","8","9"].map((d) => (
            <button key={d} type="button" onClick={() => inputDigit(d)} className={`${btnBase} bg-muted/60 text-foreground hover:bg-muted`}>{d}</button>
          ))}
          <button type="button" onClick={() => inputOperator("÷")} className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}>÷</button>

          {/* Row 3 */}
          {["4","5","6"].map((d) => (
            <button key={d} type="button" onClick={() => inputDigit(d)} className={`${btnBase} bg-muted/60 text-foreground hover:bg-muted`}>{d}</button>
          ))}
          <button type="button" onClick={() => inputOperator("×")} className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}>×</button>

          {/* Row 4 */}
          {["1","2","3"].map((d) => (
            <button key={d} type="button" onClick={() => inputDigit(d)} className={`${btnBase} bg-muted/60 text-foreground hover:bg-muted`}>{d}</button>
          ))}
          <button type="button" onClick={() => inputOperator("-")} className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}>−</button>

          {/* Row 5 */}
          <button type="button" onClick={() => inputDigit("0")} className={`${btnBase} col-span-2 bg-muted/60 text-foreground hover:bg-muted`}>0</button>
          <button type="button" onClick={inputDecimal} className={`${btnBase} bg-muted/60 text-foreground hover:bg-muted`}>.</button>
          <button type="button" onClick={() => inputOperator("+")} className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}>+</button>

          {/* Row 6 */}
          <button type="button" onClick={handleBackspace} className={`${btnBase} col-span-2 bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25`}>⌫ DEL</button>
          <button type="button" onClick={handleEquals} className={`${btnBase} col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white`}>=</button>
        </div>
      </div>
    </div>
  );
}
