"use client"

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure that the component is mounted before using the theme
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
}