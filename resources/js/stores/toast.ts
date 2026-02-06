import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<Toast[]>([]);

    function add(message: string, type: ToastType = 'success', duration = 3000) {
        const id = Date.now().toString() + Math.random();
        toasts.value.push({ id, message, type });

        if (duration > 0) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    }

    function remove(id: string) {
        const index = toasts.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    }

    return { toasts, add, remove };
});
