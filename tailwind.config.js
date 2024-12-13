const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./component/**/*.{js,ts,jsx,tsx,mdx}",

		// Flowbite Content
		flowbite.content(),
	],
	theme: {
		extend: {},
	},
	plugins: [flowbite.plugin()],
};
