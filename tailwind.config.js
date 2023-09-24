/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            container: {
                center: true,
                padding: '1rem',
                screens: ['1200px']
            },
            colors: {
                red: '#FF0000',
                purple: {
                    700: '#5D689B',
                },
                blue: {
                    300: '#62b7c7',
                    400: '#E0E7FF',
                    700: "#28293D",
                },
                gray: {
                    100: '#F5F5F7',
                    700: '#3F4254',
                },
                black: {
                    100: '#1D1D1F',
                }
            },
            backgroundColor: {
                modal: "rgba(9, 14, 20, 0.60)",
            },
        },
    },
    plugins: [],
}