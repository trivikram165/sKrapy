import { atom, useRecoilState } from 'recoil';
import { useFetchWrapper } from 'src/_helpers';
import { useCallback } from 'react'; 

export interface Scrap {
  id: number;
  name: string;
  pricePerKg: number;
  image: string;
}
export interface CartItem {
  scrap: Scrap;
  quantity: number;
  photo?: string;
}
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export const cartAtom = atom<Cart | null>({
  key: 'cart',
  default: null,
});

export function useCartActions() {
  const fetchWrapper = useFetchWrapper();
  const [cart, setCart] = useRecoilState(cartAtom);

  const fetchCart = useCallback(async () => {
    try {
      const cartData = await fetchWrapper.get<Cart>('/api/cart');
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  }, [fetchWrapper, setCart]);

  const addToCart = useCallback(async (item: CartItem) => {
    try {
      const updatedCart = await fetchWrapper.post<Cart>('/api/cart', { item });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  }, [fetchWrapper, setCart]);

  const removeFromCart = useCallback(async (scrapId: number) => {
    try {
      const updatedCart = await fetchWrapper.post<Cart>('/api/cart/remove', { scrapId });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove from cart", error);
      throw error;
    }
  }, [fetchWrapper, setCart]);

  const clearCart = useCallback(async () => {
    try {
      await fetchWrapper.post('/api/cart/clear');
      setCart(prev => prev ? { ...prev, items: [] } : null);
    } catch (error) {
      console.error("Failed to clear cart", error);
      throw error;
    }
  }, [fetchWrapper, setCart]);

  return { cart, fetchCart, addToCart, removeFromCart, clearCart };
}