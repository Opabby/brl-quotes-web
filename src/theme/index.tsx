import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e3f2fd" },
          100: { value: "#bbdefb" },
          200: { value: "#90caf9" },
          300: { value: "#64b5f6" },
          400: { value: "#42a5f5" },
          500: { value: "#2196f3" },
          600: { value: "#1e88e5" },
          700: { value: "#1976d2" },
          800: { value: "#1565c0" },
          900: { value: "#0d47a1" },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Background colors
        "bg.canvas": {
          value: {
            base: "{colors.white}",
            _dark: "{colors.gray.900}",
          },
        },
        "bg.subtle": {
          value: {
            base: "{colors.gray.50}",
            _dark: "{colors.gray.800}",
          },
        },
        "bg.muted": {
          value: {
            base: "{colors.gray.100}",
            _dark: "{colors.gray.700}",
          },
        },
        
        // Text colors
        "text.primary": {
          value: {
            base: "{colors.gray.900}",
            _dark: "{colors.gray.50}",
          },
        },
        "text.secondary": {
          value: {
            base: "{colors.gray.600}",
            _dark: "{colors.gray.400}",
          },
        },
        "text.muted": {
          value: {
            base: "{colors.gray.500}",
            _dark: "{colors.gray.500}",
          },
        },
        
        // Border colors
        "border.default": {
          value: {
            base: "{colors.gray.200}",
            _dark: "{colors.gray.700}",
          },
        },
        "border.emphasized": {
          value: {
            base: "{colors.gray.300}",
            _dark: "{colors.gray.600}",
          },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)