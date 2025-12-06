import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

/**
 * Hook to listen for real-time order updates
 * @param {function} onOrderStatusUpdated - Callback when order status changes
 * @param {function} onOrderCreated - Callback when new order is created
 */
export const useOrderUpdates = (onOrderStatusUpdated, onOrderCreated) => {
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Listen for order status updates
        if (onOrderStatusUpdated) {
            socket.on('order:status_updated', onOrderStatusUpdated);
        }

        // Listen for new order notifications
        if (onOrderCreated) {
            socket.on('order:created', onOrderCreated);
        }

        // Cleanup listeners on unmount
        return () => {
            if (onOrderStatusUpdated) {
                socket.off('order:status_updated', onOrderStatusUpdated);
            }
            if (onOrderCreated) {
                socket.off('order:created', onOrderCreated);
            }
        };
    }, [socket, isConnected, onOrderStatusUpdated, onOrderCreated]);

    return { isConnected };
};
