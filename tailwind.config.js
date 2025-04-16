/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundColor: {
                'dark': '#1A1A1A',
                'primary': '#FFB800',
            },
            colors: {
                'primary': '#FFB800',
            },
        },
    },
    plugins: [],
} 