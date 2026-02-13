module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        orbitron: ["Orbitron", "monospace"],
      },
      colors: {
        slate: {
          850: "#1e1b2f",
          900: "#151520",
          950: "#0a0a14",
        },
        cyber: {
          cyan: "rgba(0, 221, 235, 0.8)",
          purple: "rgba(139, 92, 246, 0.7)",
        },
      },
      boxShadow: {
        cyber:
          "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 221, 235, 0.15)",
        "cyber-hover":
          "0 35px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 221, 235, 0.25)",
      },
      animation: {
        "cyber-glow": "glowPulse 0.8s ease-out",
      },
    },
  },
  plugins: [],
};
