import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				gaming: {
					purple: 'hsl(var(--gaming-purple))',
					blue: 'hsl(var(--gaming-blue))',
					cyan: 'hsl(var(--gaming-cyan))',
					green: 'hsl(var(--gaming-green))',
					orange: 'hsl(var(--gaming-orange))',
					red: 'hsl(var(--gaming-red))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'glow-blue': 'var(--shadow-glow-blue)',
				'glow-green': 'var(--shadow-glow-green)'
			},
			fontFamily: {
				'gaming': ['Orbitron', 'monospace'],
				'accent': ['Audiowide', 'cursive']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'floatRandom1': {
					'0%, 100%': {
						transform: 'translate(0px, 0px) rotate(0deg)'
					},
					'33%': {
						transform: 'translate(30px, -30px) rotate(5deg)'
					},
					'66%': {
						transform: 'translate(-20px, 20px) rotate(-5deg)'
					}
				},
				'floatRandom2': {
					'0%, 100%': {
						transform: 'translate(0px, 0px) rotate(0deg)'
					},
					'25%': {
						transform: 'translate(-25px, -15px) rotate(-3deg)'
					},
					'50%': {
						transform: 'translate(20px, -25px) rotate(7deg)'
					},
					'75%': {
						transform: 'translate(-15px, 10px) rotate(-2deg)'
					}
				},
				'floatRandom3': {
					'0%, 100%': {
						transform: 'translate(0px, 0px) rotate(0deg)'
					},
					'20%': {
						transform: 'translate(15px, -20px) rotate(4deg)'
					},
					'40%': {
						transform: 'translate(-30px, -10px) rotate(-6deg)'
					},
					'60%': {
						transform: 'translate(25px, 15px) rotate(3deg)'
					},
					'80%': {
						transform: 'translate(-10px, -25px) rotate(-4deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
