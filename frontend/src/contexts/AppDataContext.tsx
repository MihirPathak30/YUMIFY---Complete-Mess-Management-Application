import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* ===================== TYPES ===================== */

export interface OrderItem {
  id: string;
  user_id: string;
  mess_id: string;
  meals: string[];
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  payment_method: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  messId: string;
  messName: string;
  messAvatar: string;
  type: "announcement" | "menu_update" | "offer" | "holiday";
  title: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  isRead: boolean;
}

interface AppDataContextType {
  orders: OrderItem[];
  loadingOrders: boolean;

  createOrder: (order: {
    messId: string;
    meals: string[];
    amount: number;
    paymentMethod: string;
  }) => Promise<void>;

  communityPosts: CommunityPost[];
  addCommunityPost: (
    post: Omit<CommunityPost, "id" | "likes" | "comments" | "date" | "isRead">
  ) => void;

  unreadNotifications: number;
  markNotificationsRead: () => void;
}

/* ===================== CONTEXT ===================== */

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  /* ===================== CREATE ORDER ===================== */

  const createOrder: AppDataContextType["createOrder"] = async ({
    messId,
    meals,
    amount,
    paymentMethod,
  }) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        mess_id: messId,
        meals,
        amount,
        status: "pending",
        payment_method: paymentMethod,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error("Failed to place order");
      return;
    }

    setOrders((prev) => [data, ...prev]);
    toast.success("Order placed successfully");
  };

  /* ===================== COMMUNITY ===================== */

  const addCommunityPost = (
    post: Omit<CommunityPost, "id" | "likes" | "comments" | "date" | "isRead">
  ) => {
    const newPost: CommunityPost = {
      id: crypto.randomUUID(),
      likes: 0,
      comments: 0,
      date: new Date().toISOString().split("T")[0],
      isRead: false,
      ...post,
    };

    setCommunityPosts((prev) => [newPost, ...prev]);
    toast.success("Post added");
  };

  const markNotificationsRead = () => {
    setCommunityPosts((prev) =>
      prev.map((p) => ({ ...p, isRead: true }))
    );
  };

  const unreadNotifications = communityPosts.filter(
    (p) => !p.isRead
  ).length;

  return (
    <AppDataContext.Provider
      value={{
        orders,
        loadingOrders,
        createOrder,
        communityPosts,
        addCommunityPost,
        unreadNotifications,
        markNotificationsRead,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

/* ===================== HOOK ===================== */

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return ctx;
};
