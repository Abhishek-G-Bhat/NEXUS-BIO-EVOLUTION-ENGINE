import React, { useState, useEffect, useRef } from "react";
import { Zap, RotateCcw, Sparkles, Dna, Brain } from "lucide-react";

const NEXUS = () => {
  /* ---------------- STATE ---------------- */
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [bestFitness, setBestFitness] = useState(0);
  const [avgFitness, setAvgFitness] = useState(0);
  const [analysis, setAnalysis] = useState("");
  const [mutationRate, setMutationRate] = useState(0.1);
  const [activationFn, setActivationFn] = useState("sigmoid"); // neuron activation

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
          genes: parent.map((g) =>
            Math.random() < mutationRate ? Math.random() : g
          ),
          fitness: 0,
        });
      }

      return next;
    });
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(evolve, 700);
    return () => clearInterval(intervalRef.current);
  }, [running, mutationRate]);

  /* ---------------- DNA MODULE ---------------- */
  const codonTable = {
    TTT: "F",
    TTC: "F",
    TTA: "L",
    TTG: "L",
    CTT: "L",
    CTC: "L",
    CTA: "L",
    CTG: "L",
    ATT: "I",
    ATC: "I",
    ATA: "I",
    ATG: "M",
    GTT: "V",
    GTC: "V",
    GTA: "V",
    GTG: "V",
    // (shortened, can add full codon table)
  };

  const runDNA = () => {
    const bases = ["A", "T", "C", "G"];
    const dna = Array(90)
      .fill(0)
      .map(() => bases[Math.floor(Math.random() * 4)])
      .join("");

    const gc = (((dna.match(/[GC]/g) || []).length / dna.length) * 100).toFixed(
      2
    );

    // Translate to codons
    const codons = [];
    for (let i = 0; i < dna.length; i += 3) codons.push(dna.slice(i, i + 3));

    const protein = codons.map((c) => codonTable[c] || "-").join("");

    setAnalysis(
      "🧬 DNA & PROTEIN SIMULATION\n\n" +
        "DNA Sequence:\n" +
        dna +
        "\n\nGC Content: " +
        gc +
        "%" +
        "\n\nCodons:\n" +
        codons.join(" ") +
        "\n\nProtein Sequence:\n" +
        protein
    );
  };

  /* ---------------- NEURON MODULE ---------------- */
  const activate = (x, fn) => {
    switch (fn) {
      case "sigmoid":
        return 1 / (1 + Math.exp(-x));
      case "relu":
        return Math.max(0, x);
      case "tanh":
        return Math.tanh(x);
      default:
        return x;
    }
  };

  const runNeuron = () => {
    const neurons = 6;
    const weights = Array(neurons)
      .fill(0)
      .map(() => Math.random() * 2);
    const inputs = Array(neurons)
      .fill(0)
      .map(() => Math.random());
    const outputs = weights.map((w, i) =>
      activate(w * inputs[i], activationFn)
    );
    const sum = outputs.reduce((a, b) => a + b, 0);

    setAnalysis(
      `🧠 NEURON SIMULATION (${activationFn.toUpperCase()})\n\n` +
        "Inputs: " +
        inputs.map((n) => n.toFixed(2)).join(" , ") +
        "\nWeights: " +
        weights.map((n) => n.toFixed(2)).join(" , ") +
        "\nActivation Outputs: " +
        outputs.map((n) => n.toFixed(2)).join(" , ") +
        "\n\nSummed Output: " +
        sum.toFixed(3)
    );
  };

  /* ---------------- LOCAL AI ---------------- */
  const runAI = () => {
    historyRef.current.push(bestFitness);
    if (historyRef.current.length > 10) historyRef.current.shift();
    const hist = historyRef.current;

    let trend = "stable";
    if (hist.length >= 2) {
      const diff = hist[hist.length - 1] - hist[0];
      if (diff > 1.5) trend = "improving";
      else if (diff < -1.5) trend = "declining";
    }

    const diversity =
      Math.max(...population.map((p) => p.fitness)) -
      Math.min(...population.map((p) => p.fitness));
    let diversityState =
      diversity < 2 ? "low" : diversity > 8 ? "high" : "moderate";

    const mean = hist.reduce((s, n) => s + n, 0) / hist.length;
    const variance =
      hist.reduce((s, n) => s + (n - mean) ** 2, 0) / hist.length;
    let stability = variance < 1 ? "stable" : "oscillating";

    let advice = "";
    if (trend === "improving" && diversityState === "moderate")
      advice = "System learning efficiently.";
    else if (diversityState === "low")
      advice = "Population converged. Increase mutation.";
    else if (trend === "declining")
      advice = "Performance dropping. Reset or adjust genes.";
    else if (stability === "oscillating")
      advice = "Search unstable. Reduce randomness.";
    else advice = "Exploration phase active.";

    setAnalysis(
      `🤖 NEXUS LOCAL AI REPORT\n\nGeneration: ${generation}\nBest Fitness: ${bestFitness.toFixed(
        2
      )}\nAverage Fitness: ${avgFitness.toFixed(
        2
      )}\n\nTrend: ${trend.toUpperCase()}\nDiversity: ${diversityState.toUpperCase()}\nStability: ${stability.toUpperCase()}\n\n🧠 Insight: ${advice}`
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
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

          <select
            value={activationFn}
            onChange={(e) => setActivationFn(e.target.value)}
            className="bg-gray-700 px-3 py-2 rounded-xl text-white"
          >
            <option value="sigmoid">Sigmoid</option>
            <option value="relu">ReLU</option>
            <option value="tanh">Tanh</option>
          </select>

          <label className="flex items-center gap-2">
            Mutation Rate
            <input
              type="range"
              min={0.01}
              max={0.5}
              step={0.01}
              value={mutationRate}
              onChange={(e) => setMutationRate(parseFloat(e.target.value))}
              className="accent-yellow-400"
            />
            {mutationRate.toFixed(2)}
          </label>

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

      {/* SYSTEM GUIDE */}
      <div className="w-80 p-6 bg-slate-800 border-l border-slate-700 text-sm leading-relaxed">
        <b className="text-lg">System Guide</b>
        <br />
        <br />
        <b>EVOLVE</b> → Run genetic optimization
        <br />
        <b>DNA</b> → Generate DNA & Protein analysis
        <br />
        <b>NEURON</b> → Simulate neuron firing
        <br />
        <b>Activation</b> → Select neuron activation function
        <br />
        <b>Mutation Rate</b> → Adjust evolutionary randomness
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
