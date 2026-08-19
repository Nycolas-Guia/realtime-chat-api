/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Paleta inspirada no Discord
                discord: {
                    bg: {
                        primary: "#313338",    // fundo do chat (área central)
                        secondary: "#2b2d31",  // fundo da sidebar de canais
                        tertiary: "#1e1f22",   // fundo da sidebar de servidores
                        floating: "#111214",   // modais, tooltips
                        input: "#383a40",      // fundo dos inputs
                    },
                    blurple: {
                        DEFAULT: "#5865F2",
                        hover: "#4752C4",
                    },
                    green: "#23a55a",
                    red: "#f23f42",
                    text: {
                        normal: "#dbdee1",
                        muted: "#949ba4",
                        link: "#00a8fc",
                    },
                    border: "#26272b",
                },
            },
            fontFamily: {
                sans: ["gg sans", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
            },
        },
    },
    plugins: [],
};