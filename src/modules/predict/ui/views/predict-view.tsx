"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Types */
type Ticker = {
  symbol: string;
  name: string;
  price: number;
};

const STOCKS: Ticker[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 183.42 },
  { symbol: "TSLA", name: "Tesla Motors", price: 256.75 },
  { symbol: "GOOGL", name: "Alphabet", price: 136.12 },
  { symbol: "NVDA", name: "NVIDIA", price: 429.31 },
  { symbol: "AMZN", name: "Amazon.com", price: 139.88 },
];

const STORAGE_KEY_PREDICTIONS = "tickertribe.predictions.v1";

/* Utility: next 7 PM IST */
function getNextLockTimeIST(now = new Date()) {
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 13, 30, 0)
  );
  if (todayUTC.getTime() <= now.getTime()) {
    return new Date(todayUTC.getTime() + 24 * 60 * 60 * 1000);
  }
  return todayUTC;
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

/* Component */
export default function PredictView() {
  const [prices, setPrices] = useState(STOCKS);
  const [now, setNow] = useState(new Date());

  const [predictions, setPredictions] = useState<
    Record<string, "UP" | "DOWN" | null>
  >(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_PREDICTIONS) || "");
    } catch {
      const blank: any = {};
      STOCKS.forEach((s) => (blank[s.symbol] = null));
      return blank;
    }
  });

  const lockTime = useMemo(() => getNextLockTimeIST(now), [now]);
  const locked = now.getTime() >= lockTime.getTime();
  const countdownMs = Math.max(0, lockTime.getTime() - now.getTime());

  /* Live price tick */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      setPrices((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.5) * (p.price * 0.002);
          return { ...p, price: Number((p.price + delta).toFixed(2)) };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  /* Save predictions */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREDICTIONS, JSON.stringify(predictions));
  }, [predictions]);

  const togglePick = (symbol: string, pick: "UP" | "DOWN") => {
    if (locked) return;
    setPredictions((prev) => ({
      ...prev,
      [symbol]: prev[symbol] === pick ? null : pick,
    }));
  };

  return (
    <div className="p-4 md:p-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Daily Predictions</h1>
        <p className="text-sm text-neutral-500 max-w-xl">
          Predict whether the 5 tech tickers will close higher or lower.
          Predictions lock at <strong>7:00 PM IST</strong>.
        </p>
      </div>

      {/* Info banner */}
      {!locked ? (
        <div className="mt-4 text-xs md:text-sm p-3 rounded-md bg-blue-50 border border-blue-300 text-blue-700">
          Predictions are hidden from your tribe until lock. You can edit anytime before <strong>7 PM IST</strong>.
        </div>
      ) : (
        <div className="mt-4 text-xs md:text-sm p-3 rounded-md bg-green-50 border border-green-300 text-green-700">
          Predictions are now locked and visible to your tribe.
        </div>
      )}

      {/* Timer */}
      <div className="flex items-center gap-2 mt-4 text-sm px-3 py-2 bg-white border rounded-md w-fit">
        <Clock className="w-4 h-4 text-neutral-500" />
        {locked ? (
          <span className="font-medium text-red-600">Locked</span>
        ) : (
          <span>Locking in {formatCountdown(countdownMs)}</span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
        {prices.map((s) => {
          const pick = predictions[s.symbol];

          return (
            <div
              key={s.symbol}
              className="rounded-xl border border-neutral-200 bg-white shadow-sm p-5 flex flex-col justify-between"
            >
              {/* Title */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-neutral-600 text-sm">
                  <span className="font-semibold">{s.symbol}</span>
                  <span className="text-neutral-400">• {s.name}</span>
                </div>

                {/* Price */}
                <div className="mt-2">
                  <div className="text-2xl font-bold">${s.price.toFixed(2)}</div>
                  <div className="text-xs text-neutral-400">
                    Reference locks at 7 PM IST
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-3">
                {/* HIGHER */}
                <button
                  onClick={() => togglePick(s.symbol, "UP")}
                  disabled={locked}
                  className={`
                    flex-1 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-1
                    ${pick === "UP"
                      ? "bg-green-600 text-white border-green-600"
                      : "border-green-300 text-green-700 hover:bg-green-50"
                    }
                    ${locked ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  <ArrowUp className="w-4 h-4" />
                  HIGHER
                </button>

                {/* LOWER */}
                <button
                  onClick={() => togglePick(s.symbol, "DOWN")}
                  disabled={locked}
                  className={`
                    flex-1 py-2 rounded-lg border text-sm font-medium flex items-center justify-center gap-1
                    ${pick === "DOWN"
                      ? "bg-red-600 text-white border-red-600"
                      : "border-red-300 text-red-700 hover:bg-red-50"
                    }
                    ${locked ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  <ArrowDown className="w-4 h-4" />
                  LOWER
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          Auto-scoring at 2:30 AM IST after US market close.
        </p>

        <Button
          onClick={() => {
            const blank: any = {};
            STOCKS.forEach((s) => (blank[s.symbol] = null));
            setPredictions(blank);
          }}
        >
          Reset My Picks
        </Button>
      </div>
    </div>
  );
}
