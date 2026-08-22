import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
// resources/js/app.tsx
import { ThemeProvider } from "@plunr/Components/theme-provider";

const appName = import.meta.env.VITE_APP_NAME || 'PLUNR';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const page = pages[`./Pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }

        return page();
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider defaultTheme="light">
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        color: 'hsl(165 56% 31%)',
    },
});
