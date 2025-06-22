import { useState, useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useFetchWrapper } from "src/_helpers";
import { authAtom } from "src/_state/auth";
import { CartItem } from "./cart";

// ... (Order interface is the same) ...
export interface Order {
  id: number;
  userId: number;
  username: string;
  items: CartItem[];
  totalPrice: number;
  timestamp: string;
  status: string;
  createdAt: string; 
  updatedAt: string;
}

export function useOrders() {
    const fetchWrapper = useFetchWrapper();
    const auth = useRecoilValue(authAtom);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        if (!auth?.token) return;
        
        setLoading(true);
        setError(null);
        const endpoint = auth.type === "vendor" ? "/api/orders" : "/api/orders/user";

        try {
            const fetchedOrders = await fetchWrapper.get<Order[]>(endpoint);
            setOrders(fetchedOrders);
        } catch (err: any) {
            setError(err.message || "Failed to fetch orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    // --- THIS IS THE FIX FOR THE WARNING ---
    // The linter wants to know that this function depends on these values.
    }, [auth, fetchWrapper]); 

    const createOrder = useCallback(async () => {
        if (auth?.type !== 'user') throw new Error("Only users can create orders.");

        setLoading(true);
        setError(null);
        try {
            const newOrder = await fetchWrapper.post<Order>("/api/orders");
            setOrders(prev => [newOrder, ...prev]);
            return newOrder;
        } catch (err: any) {
            setError(err.message || "Failed to create order");
            throw err;
        } finally {
            setLoading(false);
        }

    }, [auth, fetchWrapper]);

    return { orders, loading, error, fetchOrders, createOrder };
}