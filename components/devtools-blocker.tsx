"use client"

import { useEffect } from "react"

export function DevtoolsBlocker() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault()
        return false
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault()
        return false
      }
      return true
    }

    // Multiple devtools detection methods
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        window.location.href = "about:blank"
      }
    }

    // Console detection
    const consoleDetection = () => {
      const element = new Image()
      Object.defineProperty(element, "id", {
        get: () => {
          window.location.href = "about:blank"
          throw new Error("DevTools detected")
        },
      })
      console.log(element)
    }

    // Debugger detection
    const debuggerDetection = () => {
      const start = performance.now()
      debugger
      const end = performance.now()
      if (end - start > 100) {
        window.location.href = "about:blank"
      }
    }

    // toString detection
    const element = document.createElement("div")
    Object.defineProperty(element, "id", {
      get: () => {
        window.location.href = "about:blank"
        throw new Error("DevTools detected")
      },
    })

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    // Run detection checks periodically
    const detectionInterval = setInterval(() => {
      detectDevTools()
      try {
        debuggerDetection()
      } catch (e) {
        // Ignore errors
      }
    }, 1000)

    // Run console detection once
    try {
      consoleDetection()
    } catch (e) {
      // Ignore errors
    }

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      clearInterval(detectionInterval)
    }
  }, [])

  return null
}
