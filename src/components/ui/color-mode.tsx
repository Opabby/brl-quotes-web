"use client"

import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react"
import { ThemeProvider, useTheme, type ThemeProviderProps } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme()
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }
  return {
    colorMode: resolvedTheme,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "light" ? light : dark
}

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode()
  return colorMode === "light" ? <LuSun /> : <LuMoon />
}

interface ColorModeButtonProps {
  variant?: "solid" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        onClick={toggleColorMode}
        variant={props.variant || "ghost"}
        aria-label="Toggle color mode"
        size={props.size || "sm"}
        ref={ref}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})