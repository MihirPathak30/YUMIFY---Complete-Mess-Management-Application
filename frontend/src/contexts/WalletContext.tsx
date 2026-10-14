import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

/* ===================== TYPES ===================== */

export interface Transaction {
  id: string;
  type: "payment" | "add" | "refund" | "withdraw";
  description: string;
  amount: number;
  date: string;
  time: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  addMoney: (amount: number) => Promise<boolean>;
  withdrawMoney: (amount: number) => Promise<boolean>;
  makePayment: (amount: number, description: string) => Promise<boolean>;
  refreshWallet: () => Promise<void>;
}

/* ===================== CONTEXT ===================== */

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading] = useState(false);

  const addMoney = async (amount: number) => {
    setBalance((b) => b + amount);
    toast.success(`₹${amount} added`);
    return true;
  };

  const withdrawMoney = async (amount: number) => {
    setBalance((b) => Math.max(0, b - amount));
    toast.success(`₹${amount} withdrawn`);
    return true;
  };

  const makePayment = async (amount: number, description: string) => {
    setBalance((b) => Math.max(0, b - amount));
    setTransactions((t) => [
      {
        id: crypto.randomUUID(),
        type: "payment",
        description,
        amount,
        date: new Date().toLocaleDateString("en-IN"),
        time: new Date().toLocaleTimeString("en-IN"),
      },
      ...t,
    ]);
    return true;
  };

  const refreshWallet = async () => {};

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        addMoney,
        withdrawMoney,
        makePayment,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

/* ===================== HOOK ===================== */

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
};
