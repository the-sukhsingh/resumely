"use client"

import { cn } from "@/lib/utils"
import * as React from "react"
import { useTheme } from "next-themes"

const FRAGMENT_SOURCE = `void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    // 1. Setup Base Colors
    vec3 baseBlue = vec3(0.1, 0.45, 0.85); // The vibrant mid-blue
    vec3 deepBlue = vec3(0.02, 0.1, 0.4);   // The darker bottom fade
    vec3 black = mix(vec3(1.0), vec3(0.0), uDarkMode); // 0.0 for dark mode and 1.0 for light mode

    // 2. Create "Soft" Waves using sine layers and time
    // We use different frequencies to make the movement look organic
    float wave1 = sin(uv.x * 3.0 + iTime * 0.5) * 0.05;
    float wave2 = sin(uv.x * 7.0 - iTime * 0.8) * 0.05;
    float combinedWave = wave1 + wave2;

    // 3. Define the "Horizon" with a very wide blur
    // Instead of 0.49 to 0.51, we use 0.3 to 0.7 to create a massive gradient spread
    float horizonBlur = smoothstep(0.3 + combinedWave, 0.7 + combinedWave, uv.y);
    
    // 4. Create the bottom-to-mid gradient
    // This ensures the blue itself isn't flat
    float bottomFade = smoothstep(-0.2, 0.5, uv.y);
    vec3 blueGradient = mix(deepBlue, baseBlue, bottomFade);

    // 5. Final Composition
    // We mix the blue gradient into black based on our wide horizon blur
    // Using (1.0 - horizonBlur) because the blue is on the bottom
    vec3 finalColor = mix(blueGradient, black, horizonBlur);

    // 6. Optional: Add a tiny bit of "Dither" noise to prevent color banding
    float dither = (fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453) - 0.8) * 0.07;
    finalColor += dither;

    fragColor = vec4(finalColor, 1.0);
}`

const VERTEX_SHADER = `attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`

function buildFragmentShader(source: string) {
    return `precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float uDarkMode;

${source}

void main() {
  vec4 shaderColor = vec4(0.0);
  mainImage(shaderColor, gl_FragCoord.xy);
  gl_FragColor = vec4(clamp(shaderColor.rgb, 0.0, 1.0), 1.0);
}`
}

export function WaveBackgroundPreview({ className = "" }: { className?: string }) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === "dark"
    const isDarkRef = React.useRef(isDark)

    React.useEffect(() => {
        isDarkRef.current = isDark
    }, [isDark])

    React.useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext("webgl")
        if (!gl) return

        const fragmentShader = buildFragmentShader(FRAGMENT_SOURCE)
        const program = gl.createProgram()
        const vs = gl.createShader(gl.VERTEX_SHADER)
        const fs = gl.createShader(gl.FRAGMENT_SHADER)
        if (!program || !vs || !fs) return

        gl.shaderSource(vs, VERTEX_SHADER)
        gl.compileShader(vs)
        gl.shaderSource(fs, fragmentShader)
        gl.compileShader(fs)
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        gl.useProgram(program)

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)

        const position = gl.getAttribLocation(program, "position")
        gl.enableVertexAttribArray(position)
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

        const iResolution = gl.getUniformLocation(program, "iResolution")
        const iTime = gl.getUniformLocation(program, "iTime")
        const iMouse = gl.getUniformLocation(program, "iMouse")
        const uDarkMode = gl.getUniformLocation(program, "uDarkMode")

        const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, initialized: false }

        const updateMouse = (event: PointerEvent) => {
            const rect = canvas.getBoundingClientRect()
            const x = (event.clientX - rect.left) * (canvas.width / Math.max(rect.width, 1))
            const y = canvas.height - (event.clientY - rect.top) * (canvas.height / Math.max(rect.height, 1))

            if (!mouse.initialized) {
                mouse.prevX = x
                mouse.prevY = y
                mouse.initialized = true
            }

            mouse.x = x
            mouse.y = y
        }

        const onPointerMove = (event: PointerEvent) => {
            updateMouse(event)
        }

        canvas.addEventListener("pointermove", onPointerMove)

        let frameId = 0
        const start = performance.now()

        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            const ratio = window.devicePixelRatio || 1
            canvas.width = Math.max(1, Math.floor(rect.width * ratio))
            canvas.height = Math.max(1, Math.floor(rect.height * ratio))
            gl.viewport(0, 0, canvas.width, canvas.height)
        }
        resize()

        const render = (now: number) => {
            gl.uniform2f(iResolution, canvas.width, canvas.height)
            gl.uniform1f(iTime, (now - start) / 1000)
            gl.uniform1f(uDarkMode, isDarkRef.current ? 1.0 : 0.0)
            if (iMouse) {
                gl.uniform4f(iMouse, mouse.x, mouse.y, mouse.prevX, mouse.prevY)
            }
            mouse.prevX = mouse.x
            mouse.prevY = mouse.y
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            frameId = requestAnimationFrame(render)
        }

        frameId = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(frameId)
            canvas.removeEventListener("pointermove", onPointerMove)
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
        }
    }, [])

    return <canvas ref={canvasRef} className={cn("h-full w-full", className)} />
}
