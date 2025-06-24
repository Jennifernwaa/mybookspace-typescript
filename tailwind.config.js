export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // add other folders if needed
];
export const theme = {
    extend: {
        colors: {
            'space-brown': 'oklch(23.5% 0.07 29)',
            'space-red': 'oklch(48.5% 0.19 7.5)',
            'cream-light': 'oklch(96.5% 0.015 98)',
            'cream-medium': 'oklch(92.5% 0.018 98)',
            'ivory': 'oklch(95% 0.013 98)',
            'salmon': 'oklch(70% 0.11 35)',
            'rose-red': 'oklch(49% 0.17 10)',
            'peach': 'oklch(85% 0.08 55)',
            'warm-brown': 'oklch(36% 0.13 29)',
        },
    },
};
export const plugins = [];