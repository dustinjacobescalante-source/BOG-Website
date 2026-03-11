import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'], theme: { extend: { colors: { bog: { red: '#dc2626', black: '#090909', zinc: '#18181b' } }, boxShadow: { glow: '0 30px 80px rgba(0,0,0,0.55)' } } }, plugins: [] };
export default config;
