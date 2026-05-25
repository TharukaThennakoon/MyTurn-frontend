/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        'blue-700': '#2563eb',
        'blue-600': '#2563eb',
        'blue-500': '#3b82f6',
        'blue-300': '#93c5fd',
        'green-100': '#dcfce7',
        'green-500': '#22c55e',
        'green-600': '#16a34a',
        'green-700': '#15803d',
        'red-100': '#fee2e2',
        'red-600': '#dc2626',
        'orange-100': '#ffedd5',
        'orange-500': '#f97316',
        'gray-50': '#f7f8fc',
        'gray-100': '#f3f4f6',
        'gray-200': '#e5e7eb',
        'gray-300': '#d1d5db',
        'gray-400': '#9ca3af',
        'gray-500': '#6b7280',
        'gray-600': '#4b5563',
        'gray-700': '#374151',
        'gray-900': '#0f172a',
      },
    },
  },
  plugins: [],
};
