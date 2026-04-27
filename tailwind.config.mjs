/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rouge: '#E10600',
        noir: '#111111',
        'noir-deep': '#0A0A0A',
        blanc: '#FFFFFF',
        gris: '#F4F4F4',
        jaune: '#FFB800',
        orange: '#FF6A00',
        vert: '#2E7D32',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
