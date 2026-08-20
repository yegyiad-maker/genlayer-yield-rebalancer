## 🤖 AI-Powered DeFi Yield Rebalancer Contract

An intelligent GenLayer contract that autonomously fetches real-time APY data from external DeFi protocols, evaluates the yields using AI consensus, and rebalances capital to the most profitable protocol.

## 🌟 Overview
Traditional smart contracts cannot securely or easily fetch off-chain API data without complex centralized oracles. This contract leverages GenLayer's non-deterministic execution (`gl.nondet.exec_prompt`) to allow decentralized AI validators to fetch, verify, and reach consensus on external yields.

## 🧠 How Consensus is Used
1. **Off-Chain Data Fetching:** The contract queries multiple DeFi yield sources.
2. **AI Validation:** Validators independently evaluate the prompt to determine which protocol offers the highest APY.
3. **Consensus Agreement:** Validators compare their findings and reach a cryptographic consensus before updating the on-chain state (e.g., switching between Aave, Compound, etc.).

## 🚀 Key Features
- **Autonomous Yield Optimization:** Automatically selects the best-performing DeFi protocol.
- **AI-Powered Decision Making:** Eliminates manual monitoring and traditional rigid oracle constraints.
- **State Management:** Securely stores and exposes the current active protocol via `get_current_status`.

## 📦 Contract Functions
- `rebalance()`: Triggers the AI consensus to evaluate and switch to the highest-yielding protocol.
- `get_current_status()`: Returns the currently active protocol chosen by the AI.

## 🛠️ Tech Stack
- **Language:** Python (GenLayer Intelligent Contract SDK)
- **Network:** GenLayer Bradbury Testnet
