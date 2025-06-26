import { FC, useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useCartActions, CartItem, Scrap } from "src/_state/cart";
import { useOrders } from "src/_state/orders";
import { authAtom } from "src/_state/auth";
import Link from "next/link";
import { notification } from "antd";
import s from "./SellScrap.module.scss";
import { useFetchWrapper } from "src/_helpers";

const SellScrap: FC = () => {
    const router = useRouter();
    const auth = useRecoilValue(authAtom);
    const { cart, fetchCart, addToCart, removeFromCart, clearCart } = useCartActions();
    const { createOrder } = useOrders();
    const fetchWrapper = useFetchWrapper();

    // State for checkout modal
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [evmAddress, setEvmAddress] = useState('');
    const [solanaAddress, setSolanaAddress] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // State for main page and cart UI
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});

    const scraps: Scrap[] = [
        { id: 1, name: "Metal", pricePerKg: 200, image: "/images/scraps/metal.jpg" },
        { id: 2, name: "Plastic", pricePerKg: 50, image: "/images/scraps/plastic.jpg" },
        { id: 3, name: "Paper", pricePerKg: 20, image: "/images/scraps/paper.jpg" },
        { id: 4, name: "Glass", pricePerKg: 30, image: "/images/scraps/glass.jpg" },
        { id: 5, name: "Cardboard", pricePerKg: 15, image: "/images/scraps/cardboard.jpg" },
        { id: 6, name: "Aluminum", pricePerKg: 150, image: "/images/scraps/aluminum.jpg" },
        { id: 7, name: "Copper", pricePerKg: 500, image: "/images/scraps/copper.jpg" },
        { id: 8, name: "Steel", pricePerKg: 100, image: "/images/scraps/steel.jpg" },
        { id: 9, name: "Rubber", pricePerKg: 40, image: "/images/scraps/rubber.jpg" },
        { id: 10, name: "Electronics", pricePerKg: 200, image: "/images/scraps/electronics.jpg" },
        { id: 11, name: "Wood", pricePerKg: 30, image: "/images/scraps/wood.jpg" },
        { id: 12, name: "Textiles", pricePerKg: 25, image: "/images/scraps/textiles.jpg" },
    ];

    const fetchUserAddresses = useCallback(async () => {
        try {
            const user = await fetchWrapper.get<{ evmAddress?: string, solanaAddress?: string }>('/api/user/me');
            if (user.evmAddress) setEvmAddress(user.evmAddress);
            if (user.solanaAddress) setSolanaAddress(user.solanaAddress);
        } catch (error) {
            console.error("Could not fetch user addresses.");
        }
    }, [fetchWrapper]);

    useEffect(() => {
        if (auth && auth.type === 'user') {
            fetchCart();
            fetchUserAddresses();
        } else if (auth === null) {
            router.push('/login');
        }
    }, [auth, fetchCart, fetchUserAddresses, router]);

    useEffect(() => {
        if (isCartOpen || isCheckoutModalOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isCartOpen, isCheckoutModalOpen]);

    const totalQuantity = useMemo(() => cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0, [cart]);
    const totalPrice = useMemo(() => cart?.items.reduce((sum, item) => sum + item.scrap.pricePerKg * item.quantity, 0) ?? 0, [cart]);

    const handleProceedToSell = () => {
        if (!cart?.items || cart.items.length === 0) {
            notification.warning({ message: "Your cart is empty." });
            return;
        }
        setIsCartOpen(false);
        setIsCheckoutModalOpen(true);
    };

    const handleConfirmAndPlaceOrder = async () => {
        if (!evmAddress && !solanaAddress) {
            notification.error({ message: "Please enter at least one wallet address." });
            return;
        }
        setIsSaving(true);
        try {
            await fetchWrapper.put('/api/user/me', { evmAddress, solanaAddress });
            await createOrder();
            notification.success({ message: "Order placed successfully!", description: "Your address has been saved." });
            await fetchCart();
            setIsCheckoutModalOpen(false);
        } catch (error: any) {
            notification.error({ message: "Failed to place order", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuantityChange = (scrapId: number, delta: number) => {
        setQuantities(prev => ({ ...prev, [scrapId]: Math.max(1, (prev[scrapId] || 1) + delta) }));
    };

    const handleAddToCart = async (scrap: Scrap) => {
        setAddingToCart(prev => ({ ...prev, [scrap.id]: true }));
        const quantity = quantities[scrap.id] || 1;
        try {
            await addToCart({ scrap, quantity });
            notification.success({ message: `${scrap.name} added to cart!` });
        } catch (error: any) {
            notification.error({ message: error.message || "Failed to add item." });
        } finally {
            setAddingToCart(prev => ({ ...prev, [scrap.id]: false }));
        }
    };

    if (auth === undefined) {
        return <div className={s.loading}>Loading...</div>;
    }

    return (
        <div className={s.container}>
            <div className={s.welcomeMessage}>Welcome, {auth?.username || 'Guest'}!</div>
            <div className={s.header}>
                <h1 className={s.heading}>Sell Your Scrap</h1>
                <div className={s.headerButtons}>
                    <Link href="/view-orders"><button className={s.viewOrdersButton}>My Orders</button></Link>
                    <div className={s.cartButton} onClick={() => setIsCartOpen(true)}>
                        <span className={s.cartIcon}>🛒</span>
                        {totalQuantity > 0 && (<span className={s.quantityBadge}>{totalQuantity}</span>)}
                    </div>
                </div>
            </div>

            <div className={s.scrapList}>
                {scraps.map((scrap) => (
                    <div key={scrap.id} className={s.scrapItem}>
                        <div className={s.scrapImageWrapper}>
                            <Image src={scrap.image} alt={scrap.name} width={150} height={150} style={{objectFit: "cover"}} />
                        </div>
                        <div className={s.scrapDetails}>
                            <h3 className={s.scrapName}>{scrap.name}</h3>
                            <p className={s.scrapPrice}>₹{scrap.pricePerKg}/kg</p>
                            <div className={s.quantitySelector}>
                                <label className={s.quantityLabel}>Quantity (kg)</label>
                                <div className={s.quantityControl}>
                                    <button onClick={() => handleQuantityChange(scrap.id, -1)} className={s.quantityButton}>−</button>
                                    <span className={s.quantityValue}>{quantities[scrap.id] || 1}</span>
                                    <button onClick={() => handleQuantityChange(scrap.id, 1)} className={s.quantityButton}>+</button>
                                </div>
                            </div>
                            <button onClick={() => handleAddToCart(scrap)} className={s.addButton} disabled={addingToCart[scrap.id]}>
                                {addingToCart[scrap.id] ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isCartOpen && (
                <>
                    <div className={s.cartBackdrop} onClick={() => setIsCartOpen(false)} />
                    <div className={`${s.cartSidebar} ${s.open}`} onClick={(e) => e.stopPropagation()}>
                        <div className={s.cartHeader}><h2 className={s.cartHeading}>Your Cart</h2><button onClick={() => setIsCartOpen(false)} className={s.closeButton}>×</button></div>
                        <div className={s.cartBody}>{(!cart || cart.items.length === 0) ? (<p className={s.emptyCart}>Your cart is empty.</p>) : (<div className={s.cartItemsList}>{cart.items.map((item: CartItem) => (<div key={item.scrap.id} className={s.cartItem}><div className={s.cartItemImage}><Image src={item.scrap.image} alt={item.scrap.name} width={60} height={60} style={{objectFit: "cover"}} /></div><div className={s.cartItemDetails}><span className={s.cartItemName}>{item.scrap.name}</span><span className={s.cartItemSubtext}>{item.quantity} kg @ ₹{item.scrap.pricePerKg}/kg</span></div><div className={s.cartItemPrice}>₹{(item.scrap.pricePerKg * item.quantity).toFixed(2)}</div><button onClick={() => removeFromCart(item.scrap.id)} className={s.removeItemButton}>×</button></div>))}</div>)}</div>
                        <div className={s.cartFooter}><div className={s.cartTotal}><span>Total</span><span>₹{totalPrice.toFixed(2)}</span></div><button onClick={handleProceedToSell} className={s.proceedButton} disabled={totalQuantity === 0}>Proceed to Sell</button><button onClick={clearCart} className={s.clearCartButton} disabled={totalQuantity === 0}>Clear Cart</button></div>
                    </div>
                </>
            )}

            {/* --- UPDATED CHECKOUT MODAL JSX --- */}
            {isCheckoutModalOpen && (
                <div className={s.popupBackdrop}>
                    <div className={`${s.popup} ${s.checkoutModal}`}>
                        <h3 className={s.modalTitle}>Confirm Order & Payment Address</h3>
                        <p className={s.modalDescription}>
                            Provide at least one wallet address to receive payment. This will be saved to your profile for future use.
                        </p>
                        <div className={s.addressForm}>
                            <div className={s.addressInputGroup}>
                                <label>EVM Address (MetaMask)</label>
                                <input type="text" value={evmAddress} onChange={e => setEvmAddress(e.target.value)} placeholder="0x..." />
                            </div>
                            <div className={s.addressInputGroup}>
                                <label>Solana Address (Phantom)</label>
                                <input type="text" value={solanaAddress} onChange={e => setSolanaAddress(e.target.value)} placeholder="5Zt..." />
                            </div>
                        </div>
                        <div className={s.popupButtons}>
                            <button onClick={() => setIsCheckoutModalOpen(false)} className={s.popupCancelButton} disabled={isSaving}>Cancel</button>
                            <button onClick={handleConfirmAndPlaceOrder} className={s.popupConfirmButton} disabled={isSaving}>
                                {isSaving ? 'Placing Order...' : 'Place Order & Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellScrap;