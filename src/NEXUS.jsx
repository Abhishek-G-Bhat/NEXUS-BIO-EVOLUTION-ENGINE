import React, { useState, useEffect, useRef } from "react";
import { Zap, RotateCcw, Sparkles, Dna, Brain } from "lucide-react";

const NEXUS = () => {
  /* ---------------- STATE ---------------- */

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  const [bestFitness, setBestFitness] = useState(0);
  const [avgFitness, setAvgFitness] = useState(0);

  const [analysis, setAnalysis] = useState("");

  const intervalRef = useRef(null);
  const historyRef = useRef([]);

  /* ---------------- EVOLUTION ENGINE ---------------- */

  const initPopulation = () =>
    Array(50)
      .fill(0)
      .map(() => ({
        genes: Array(20)
          .fill(0)
          .map(() => Math.random()),
        fitness: 0,
      }));

  const [population, setPopulation] = useState(initPopulation);

  const evolve = () => {
    setPopulation((pop) => {
      const scored = pop
        .map((p) => ({
          ...p,
          fitness: p.genes.reduce((a, b) => a + b, 0),
        }))
        .sort((a, b) => b.fitness - a.fitness);

      const best = scored[0].fitness;
      const avg = scored.reduce((s, p) => s + p.fitness, 0) / scored.length;

      setBestFitness(best);
      setAvgFitness(avg);
      setGeneration((g) => g + 1);

      const next = scored.slice(0, 10);

      while (next.length < 50) {
        const parent = scored[Math.floor(Math.random() * 5)].genes;

        next.push({
          genes: parent.map((g) => (Math.random() < 0.1 ? Math.random() : g)),
          fitness: 0,
        });
      }

      return next;
    });
  };

  /* ✅ FIX: only run when running === true */
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(evolve, 700);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  /* ---------------- DNA MODULE ---------------- */

  const runDNA = () => {
    const bases = ["A", "T", "C", "G"];
    const dna = Array(80)
      .fill(0)
      .map(() => bases[Math.floor(Math.random() * 4)])
      .join("");

    const gc = (((dna.match(/[GC]/g) || []).length / dna.length) * 100).toFixed(
      2
    );

    setAnalysis(
      "🧬 DNA ANALYSIS\n\n" +
        "Sequence:\n" +
        dna +
        "\n\nGC Content: " +
        gc +
        "%"
    );
  };

  /* ---------------- NEURON MODULE ---------------- */

  const runNeuron = () => {
    const weights = Array(6)
      .fill(0)
      .map(() => Math.random() * 2);
    const inputs = Array(6)
      .fill(0)
      .map(() => Math.random());

    const output = weights.reduce((s, w, i) => s + w * inputs[i], 0);

    setAnalysis(
      "🧠 NEURON FIRING\n\nInputs:\n" +
        inputs.map((n) => n.toFixed(2)).join(" , ") +
        "\n\nWeights:\n" +
        weights.map((n) => n.toFixed(2)).join(" , ") +
        "\n\nActivation:\n" +
        output.toFixed(3)
    );
  };

  /* ---------------- SMART LOCAL AI ---------------- */

  /* ---------------- ADVANCED LOCAL AI ---------------- */

  const runAI = () => {
    /* ===== STORE HISTORY ===== */
    historyRef.current.push(bestFitness);
    if (historyRef.current.length > 10) historyRef.current.shift();

    const hist = historyRef.current;

    /* ===== TREND ANALYSIS ===== */
    let trend = "stable";

    if (hist.length >= 2) {
      const diff = hist[hist.length - 1] - hist[0];

      if (diff > 1.5) trend = "improving";
      else if (diff < -1.5) trend = "declining";
    }

    /* ===== DIVERSITY ANALYSIS ===== */
    const diversity =
      Math.max(...population.map((p) => p.fitness)) -
      Math.min(...population.map((p) => p.fitness));

    let diversityState = "moderate";

    if (diversity < 2) diversityState = "low";
    else if (diversity > 8) diversityState = "high";

    /* ===== STABILITY (variance of history) ===== */
    const mean = hist.reduce((s, n) => s + n, 0) / hist.length;

    const variance =
      hist.reduce((s, n) => s + (n - mean) ** 2, 0) / hist.length;

    let stability = variance < 1 ? "stable" : "oscillating";

    /* ===== INTELLIGENT INSIGHT ===== */

    let advice = "";

    if (trend === "improving" && diversityState === "moderate")
      advice = "System learning efficiently. Keep evolving.";
    else if (diversityState === "low")
      advice = "Population converged. Increase mutation rate.";
    else if (trend === "declining")
      advice = "Performance dropping. Reset or adjust genes.";
    else if (stability === "oscillating")
      advice = "Search unstable. Reduce randomness.";
    else advice = "Exploration phase active.";

    /* ===== AI STYLE REPORT ===== */

    setAnalysis(
      "🤖 NEXUS LOCAL AI INTELLIGENCE REPORT\n\n" +
        "Generation: " +
        generation +
        "\n\n" +
        "Best Fitness: " +
        bestFitness.toFixed(2) +
        "\n" +
        "Average Fitness: " +
        avgFitness.toFixed(2) +
        "\n\n" +
        "Trend: " +
        trend.toUpperCase() +
        "\n" +
        "Diversity: " +
        diversityState.toUpperCase() +
        "\n" +
        "Stability: " +
        stability.toUpperCase() +
        "\n\n" +
        "🧠 Insight:\n" +
        advice +
        "\n\n" +
        "System behaving like an adaptive biological intelligence."
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* MAIN AREA */}
      <div className="flex-1 p-10 space-y-8">
        <h1 className="text-5xl font-bold text-center">
          ⚡ NEXUS Evolution Engine
        </h1>

        {/* Buttons */}
        <div className="flex gap-6 justify-center flex-wrap text-lg">
          <button
            onClick={() => setRunning(!running)}
            className="bg-purple-600 px-6 py-3 rounded-xl"
          >
            <Zap /> EVOLVE
          </button>

          <button
            onClick={runDNA}
            className="bg-green-600 px-6 py-3 rounded-xl"
          >
            <Dna /> DNA
          </button>

          <button
            onClick={runNeuron}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Brain /> NEURON
          </button>

          <button
            onClick={runAI}
            className="bg-yellow-600 px-6 py-3 rounded-xl"
          >
            <Sparkles /> AI
          </button>

          <button
            onClick={() => {
              setPopulation(initPopulation());
              setGeneration(0);
              setAnalysis("");
              setRunning(false);
            }}
            className="bg-red-600 px-6 py-3 rounded-xl"
          >
            <RotateCcw /> RESET
          </button>
        </div>

        {/* Stats */}
        <div className="text-center text-2xl space-y-2">
          <div>Generation: {generation}</div>
          <div>Best Fitness: {bestFitness.toFixed(2)}</div>
          <div>Average Fitness: {avgFitness.toFixed(2)}</div>
        </div>

        {/* Output */}
        {analysis && (
          <pre className="bg-black text-green-300 p-12 rounded-2xl text-3xl whitespace-pre-wrap shadow-xl">
            {analysis}
          </pre>
        )}
      </div>

      {/* RIGHT SIDE SYSTEM GUIDE */}
      <div className="w-80 p-6 bg-slate-800 border-l border-slate-700 text-sm leading-relaxed">
        <b className="text-lg">System Guide</b>
        <br />
        <br />
        <b>EVOLVE</b> → Run genetic optimization
        <br />
        <b>DNA</b> → Generate DNA sequence analysis
        <br />
        <b>NEURON</b> → Simulate neuron firing
        <br />
        <b>AI</b> → Intelligent system reasoning
        <br />
        <b>RESET</b> → Restart simulation
        <br />
        <br />
        Observe how biological-style computation transforms into intelligent
        behaviour.
      </div>
    </div>
  );
};

export default NEXUS;
