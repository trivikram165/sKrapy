import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useOrders, Order } from "src/_state/orders";
import { authAtom } from "src/_state/auth";
import s from "/styles/ViewOrders.module.scss";
import { notification } from "antd";

import { useAccount, useSendTransaction, useDisconnect } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectKitButton } from "connectkit";

interface OrderWithUser extends Order {
    User?: {
        evmAddress?: string;
        solanaAddress?: string;
    }
}

const PaymentModal = ({ order, onPay, onClose, isProcessing }: {
    order: OrderWithUser,
    onPay: () => void,
    onClose: () => void,
    isProcessing: boolean,
}) => {
    const userEvmAddress = order.User?.evmAddress || 'Not Provided';
    return (
        <div className={s.popupBackdrop}>
            <div className={s.popup}>
                <h3>Pay for Order #{order.id}</h3>
                <p>You are about to pay <strong>{order.totalPrice} Test ETH</strong> to user {order.username}.</p>
                <div className={s.addressInfo}>
                    <span>Recipient Address (EVM):</span>
                    <code>{userEvmAddress}</code>
                </div>
                <div className={s.popupButtons}>
                    <button onClick={onClose} className={s.popupCancelButton} disabled={isProcessing}>Cancel</button>
                    <button onClick={onPay} className={s.popupConfirmButton} disabled={isProcessing || !order.User?.evmAddress}>
                        {isProcessing ? 'Check Wallet...' : 'Confirm & Pay'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const VendorDashboard: FC = () => {
    const router = useRouter();
    const auth = useRecoilValue(authAtom);
    const setAuth = useSetRecoilState(authAtom);
    const { orders, loading, error, fetchOrders } = useOrders();
    
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const { sendTransaction } = useSendTransaction();

    const [selectedOrder, setSelectedOrder] = useState<OrderWithUser | null>(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

    useEffect(() => {
        if (!auth || auth.type !== "vendor") {
            router.push("/login");
        } else {
            fetchOrders();
        }
    }, [auth, router, fetchOrders]);
    
    const handleLogout = () => {
        disconnect();
        setAuth(null);
        localStorage.removeItem("auth-storage");
        router.push("/login");
    };

    const executePayment = () => {
        if (!selectedOrder || !selectedOrder.User?.evmAddress) {
            notification.error({ message: "Cannot proceed: User has not provided an EVM wallet address." });
            return;
        }
        
        const recipientAddress = selectedOrder.User.evmAddress as `0x${string}`;
        setIsPaymentProcessing(true);

        sendTransaction({
            to: recipientAddress,
            value: parseEther(selectedOrder.totalPrice.toString()),
        }, 
        {
            onSuccess: (hash) => {
                notification.success({ message: "Transaction Successful!", description: `Tx hash: ${hash}` });
                fetchOrders();
                setSelectedOrder(null);
                setIsPaymentProcessing(false);
            },
            onError: (err) => {
                notification.error({ message: "Payment Failed", description: "The transaction was rejected or failed." });
                setIsPaymentProcessing(false);
            }
        });
    };

    return (
        <div className={s.container}>
            {selectedOrder && (
                <PaymentModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onPay={executePayment}
                    isProcessing={isPaymentProcessing}
                />
            )}

            <div className={s.header}>
                <h1 className={s.heading}>Vendor Dashboard</h1>
                <div className={s.headerButtons}>
                    <ConnectKitButton />
                    <button className={s.logoutButton} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {loading && <p className={s.loading}>Loading orders...</p>}
            {error && <p className={s.error}>{error}</p>}

            <div className={s.ordersList}>
                {(orders as OrderWithUser[]).map((order) => (
                    <div key={order.id} className={s.orderItem}>
                        <div className={s.orderHeader}>
                            <h2 className={s.orderId}>Order #{order.id} from {order.username}</h2>
                        </div>
                        <div className={s.orderSummary}>
                            <h4>Total: {order.totalPrice} ETH</h4>
                            <button
                                className={s.buyButton}
                                onClick={() => setSelectedOrder(order)}
                                disabled={order.status !== "pending" || !isConnected || !order.User?.evmAddress}
                                title={!order.User?.evmAddress ? "User has not provided an EVM wallet address" : "Pay this order"}
                            >
                                {!order.User?.evmAddress ? "Awaiting Address" : "Accept & Pay"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorDashboard;