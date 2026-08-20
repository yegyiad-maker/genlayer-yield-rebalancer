'use client';
import { useState } from 'react';
import { createClient } from 'genlayer-js';
import { testnetBradbury } from 'genlayer-js/chains';
import { custom } from 'viem';

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('Not connected to wallet');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x2c612D6C0A8aA52866d67FB5E62AA5df9fFc834e";

  async function connectWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask!');
        return;
      }
      const [address] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(address);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchStatus() {
    try {
      setLoading(true);
      setStatusText('Fetching latest protocol status...');
      const client = createClient({ chain: testnetBradbury });
      const result = await client.readContract({
        address: contractAddress,
        functionName: 'get_current_status',
        args: [],
      });
      setStatusText(String(result));
    } catch (error) {
      console.error(error);
      setStatusText('Error fetching status');
    } finally {
      setLoading(false);
    }
  }

  async function triggerRebalance() {
    try {
      if (!account) {
        alert('Please connect your wallet first!');
        return;
      }
      setLoading(true);
      setTxHash(null);
      setStatusText('🤖 AI validators evaluating yields & reaching consensus...');

      const client = createClient({
        account: account as `0x${string}`,
        chain: testnetBradbury,
        transport: custom(window.ethereum),
      });

      const hash = await client.writeContract({
        address: contractAddress,
        functionName: 'rebalance',
        args: [],
        value: 0n,
      });

      setTxHash(hash);
      setStatusText('⏳ Transaction sent. Waiting for validators consensus...');

      await client.waitForTransactionReceipt({
        hash: hash,
        retries: 500,
      });

      setStatusText('✨ Rebalance finished successfully!');
      await fetchStatus();
    } catch (error) {
      console.error(error);
      setStatusText('❌ Error during rebalancing');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              🚀 GenLayer Rebalancer
            </h1>
            <p className="text-xs text-slate-400">AI-Powered DeFi Yield Optimization</p>
          </div>
          <button
            onClick={connectWallet}
            className="text-xs bg-purple-600/80 hover:bg-purple-500 transition px-3.5 py-2 rounded-xl font-medium shadow-md border border-purple-500/30"
          >
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect'}
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl mb-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Active Strategy Status</p>
          <p className="text-emerald-400 font-mono text-base font-medium break-all">{statusText}</p>
        </div>

        {/* Transaction Explorer Link if available */}
        {txHash && (
          <div className="mb-6 p-3 bg-blue-950/40 border border-blue-900/50 rounded-xl text-xs text-blue-300 break-all">
            <span className="font-semibold">Tx Hash:</span> {txHash.substring(0, 16)}...
            <div className="mt-1 text-slate-400">GenLayer Bradbury Testnet Execution</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700/80 transition font-medium py-3 rounded-xl text-sm disabled:opacity-50 shadow border border-slate-700/50 flex items-center justify-center gap-2"
          >
            {loading && statusText.includes('Fetching') ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>📡</span>
            )}
            Get Current Status
          </button>

          <button
            onClick={triggerRebalance}
            disabled={loading || !account}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 transition font-medium py-3 rounded-xl text-sm disabled:opacity-50 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2"
          >
            {loading && !statusText.includes('Fetching') ? (
              <span className="animate-spin">⚙️</span>
            ) : (
              <span>⚡</span>
            )}
            Trigger AI Rebalance
          </button>
        </div>

      </div>
    </main>
  );
}