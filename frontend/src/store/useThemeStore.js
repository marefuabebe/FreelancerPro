import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
    persist(
        (set, get) => ({
            theme: 'light', // 'light', 'dark', 'auto'

            setTheme: (theme) => {
                set({ theme });
                get().applyTheme();
            },

            applyTheme: () => {
                const { theme } = get();
                const root = window.document.documentElement;

                root.classList.remove('light', 'dark');

                if (theme === 'auto') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                    return;
                }

                root.classList.add(theme);
            },

            // Initialize theme on app load
            init: () => {
                get().applyTheme();

                // Listen for system theme changes if in auto mode
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                    if (get().theme === 'auto') {
                        get().applyTheme();
                    }
                });
            }
        }),
        {
            name: 'theme-storage-v2',
        }
    )
);
