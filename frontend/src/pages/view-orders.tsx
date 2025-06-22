import { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useOrders, Order } from "src/_state/orders";
import { authAtom } from "src/_state/auth";
import s from "/styles/ViewOrders.module.scss";
import Link from "next/link";

const ViewOrders: FC = () => {
    const router = useRouter();
    const auth = useRecoilValue(authAtom);
    const setAuth = useSetRecoilState(authAtom);
    const { orders, loading, error, fetchOrders } = useOrders();

    useEffect(() => {
        if (auth === undefined) return;
        if (!auth || auth.type !== "user") {
            router.push("/login");
        }
    }, [auth, router]);

    useEffect(() => {
        if (auth && auth.type === "user") {
            fetchOrders();
        }
    }, [auth, fetchOrders]);


    const handleLogout = () => {
        setAuth(null);
        localStorage.removeItem("auth-storage");
        router.push("/login");
    };

    if (auth === undefined || !auth) {
        return <div className={s.loading}>Loading...</div>;
    }

    return (
        <div className={s.container}>
            <div className={s.header}>
                <h1 className={s.heading}>Your Orders</h1>
                <div className={s.headerButtons}>
                    <Link href="/sell-scrap">
                        <button className={s.sellScrapButton}>Sell More</button>
                    </Link>
                    <button onClick={handleLogout} className={s.logoutButton}>Logout</button>
                </div>
            </div>

            {loading && <p className={s.loading}>Loading orders...</p>}
            
            {error && <p className={s.error}>{error}</p>}
            
            {!loading && !error && orders.length === 0 && (
                <p className={s.noOrders}>You havent placed any orders yet.</p>
            )}

            {!loading && !error && orders.length > 0 && (
                <div className={s.ordersList}>
                    {orders.map((order: Order) => (
                        <div key={order.id} className={s.orderItem}>
                            <div className={s.orderHeader}>
                                <h2 className={s.orderId}>Order #{order.id}</h2>
                                <p className={s.orderTimestamp}>
                                    {new Date(order.createdAt).toLocaleString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className={s.orderItems}>
                                {order.items.map((item, index) => (
                                    <div key={index} className={s.orderItemDetail}>
                                        <p className={s.itemName}>{item.scrap.name}</p>
                                        <p className={s.itemInfo}>
                                            {item.quantity} kg x ₹{item.scrap.pricePerKg}/kg
                                        </p>
                                        <p className={s.itemInfo}>
                                            Subtotal: ₹{(item.quantity * item.scrap.pricePerKg).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className={s.orderSummary}>
                                <p className={s.totalPrice}>Total: ₹{order.totalPrice.toFixed(2)}</p>
                                <span className={s.status}>Status: {order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewOrders;