import { useContext, useEffect, useState, useCallback } from "react";
import { PublicKey, TransactionSignature } from "@solana/web3.js";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { getFeeRecipientString } from "@/app/utils/utils";

interface TransactionInfo {
  signature: TransactionSignature;
  blockTime: number | null;
  methodNames: string[];
  instructionCount: number;
}

export function useTransactionHistory(limit: number = 20) {
  const [history, setHistory] = useState<TransactionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
  var accountAddress = getFeeRecipientString();

  const fetchHistory = useCallback(
    async (beforeSignature?: string, append: boolean = false) => {
      setLoading(true);
      setError(null);
      if (accountAddress == null) {
        setLoading(false);
        return;
      }
      try {
        const connection = claimYourSolsState.connection;
        const pubkey = new PublicKey(accountAddress);

        // Get recent transaction signatures
        const signatures = await connection.getSignaturesForAddress(pubkey, {
          limit,
          before: beforeSignature,
        });

        // If we got fewer signatures than requested, we've reached the end
        setHasMore(signatures.length === limit);

        const txs: TransactionInfo[] = [];

        for (const sigInfo of signatures) {
          const tx = await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx) continue;

          // Get method names from instructions
          const methodNames: string[] = [];
          let instructionCount = 0;

          if (tx.transaction.message.instructions) {
            for (const ix of tx.transaction.message.instructions) {
              instructionCount++;
              if ("parsed" in ix && ix.parsed && ix.program) {
                // Parsed instruction
                methodNames.push(ix.parsed.type || ix.program);
              } else if ("program" in ix) {
                // Raw instruction
                methodNames.push(ix.program);
              }
            }
          }

          txs.push({
            signature: sigInfo.signature,
            blockTime: tx.blockTime ?? null,
            methodNames,
            instructionCount,
          });
        }

        if (append) {
          setHistory((prev) => [...prev, ...txs]);
        } else {
          setHistory(txs);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch transaction history");
      } finally {
        setLoading(false);
      }
    },
    [accountAddress, claimYourSolsState.connection, limit]
  );

  const loadMore = () => {
    if (history.length > 0 && hasMore && !loading) {
      const lastSignature = history[history.length - 1].signature;
      fetchHistory(lastSignature, true);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory, limit, claimYourSolsState.network]);

  return { history, loading, error, hasMore, loadMore };
}
