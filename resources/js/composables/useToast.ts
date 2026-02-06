// Simple toast composable stub
import { ref } from 'vue';

export function useToast() {
    const addToast = (
        message: string,
        type: 'success' | 'error' | 'info' = 'success',
        actionLabel?: string,
        actionCallback?: () => void
    ) => {
        console.log(`[Toast ${type}]:`, message);
        if (actionLabel && actionCallback) {
            console.log(`  Action available: ${actionLabel}`);
        }
        // In a real implementation, this would show a toast notification with action button
    };

    return {
        addToast
    };
}
