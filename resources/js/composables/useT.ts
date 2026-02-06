import { usePage } from '@inertiajs/vue3';
import axios from 'axios';

const reportedKeys = new Set<string>();

function reportMissingKey(key: string, locale: string) {
    if (reportedKeys.has(key)) return;
    reportedKeys.add(key);

    console.warn(`[i18n] Missing translation: "${key}" (${locale})`);

    // Report to backend (debounced/throttled conceptually by Set check)
    axios.post('/api/i18n/missing', { key, locale }).catch(() => {
        // Ignore reporting errors
    });
}

export function useT() {
    const page = usePage();

    const t = (key: string) => {
        const translations = (page.props.translations as Record<string, string>) || {};
        const locale = (page.props.locale as string) || 'en';

        if (translations[key]) {
            return translations[key];
        }

        // Key missing
        reportMissingKey(key, locale);
        return key;
    };

    return { t };
}
