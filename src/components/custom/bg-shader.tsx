"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const FRAGMENT_SOURCE = `float hash21(vec2 p)
{
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

const bool ENABLE_REVEAL_ANIMATION = true;
const float REVEAL_DURATION = 2.0;
const float START_HEIGHT = 0.6;

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalized screen uvs [0, 1]
    vec2 uv = fragCoord / iResolution.xy;
    
    // 1. Create the Bar Columns
    float numBars = uNumBars; 
    float barIndex = floor(uv.x * numBars);
    float barID = barIndex / numBars;
    
    // 2. Stepped Height Logic:
    // If uDecreaseFromLeft > 0.5:
    //   Left bar (index = 0) has slope = 1.0 (highest)
    //   Right bar (index = numBars - 1) has slope = 0.0 (lowest)
    //   Heights decrease moving from left to right.
    // Else:
    //   Right bar (index = numBars - 1) has slope = 1.0 (highest)
    //   Left bar (index = 0) has slope = 0.0 (lowest)
    //   Heights decrease moving from right to left.
    float normalizedBar = barIndex / max(numBars - 1.0, 1.0);
    float barProgress = (uDecreaseFromLeft > 0.5)
        ? (1.0 - normalizedBar)
        : normalizedBar;
    barProgress = clamp(barProgress, 0.0, 1.0);
    
    // 3. Define the Stepped Height
    float minHeight = 0.18;
    float maxHeight = 0.82;
    float threshold = minHeight + barProgress * (maxHeight - minHeight);

    // Optional one-time height animation from a shared start height
    float animationProgress = ENABLE_REVEAL_ANIMATION
        ? clamp(iTime / REVEAL_DURATION, 0.0, 1.0)
        : 1.0;
    float easedProgress = animationProgress * animationProgress * (3.0 - 2.0 * animationProgress);
    float animatedHeight = mix(START_HEIGHT, threshold, easedProgress);
    float safeHeight = max(animatedHeight, 0.0001);

    // 4. Create the Gradient and Mask
    float localY = uv.y;
    float mask = step(localY, animatedHeight);
    
    // Vertical gradient (darker at top of bar, lighter at bottom)
    // We normalize the y-coordinate relative to the bar's specific height
    float verticalGrad = 1.0 - (localY / safeHeight);

    // Add fine grain for a richer finish 
    float coarseGrain = hash21(floor(fragCoord * 0.85));
    float fineGrain = hash21(fragCoord * 1.73 + vec2(barID * 91.7, localY * 37.2));
    float grain = ((coarseGrain * 0.65 + fineGrain * 0.35) - 0.5) * 0.15;
    float grainWeight = 0.02 + 0.80 * smoothstep(0.0, 1.0, verticalGrad);
    verticalGrad = clamp(verticalGrad + grain * grainWeight, 0.0, 1.0);
    
    // Combine mask with gradient and a base brightness
    vec3 color = vec3(verticalGrad * 0.6) * mask;

    // Output
    fragColor = vec4(color, 1.0);
}`

const VERTEX_SHADER = `attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`

function buildFragmentShader(source: string) {
    return `precision highp float;
uniform vec2 iResolution;
uniform float uNumBars;
uniform float iTime;
uniform vec4 iMouse;
uniform float uDecreaseFromLeft;

${source}

void main() {
  vec4 shaderColor = vec4(0.0);
  mainImage(shaderColor, gl_FragCoord.xy);
  gl_FragColor = vec4(clamp(shaderColor.rgb, 0.0, 1.0), 1.0);
}`
}

export interface BarsPreviewProps {
    /**
     * When true (default), bar heights decrease from left to right.
     * When false, bar heights decrease from right to left.
     */
    decreaseFromLeft?: boolean;
    className?: string;
    numBars?: number;
}

export function BarsPreview({
    decreaseFromLeft = true,
    className = "",
    numBars,
}: BarsPreviewProps = {}) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const decreaseFromLeftRef = React.useRef(decreaseFromLeft)
    decreaseFromLeftRef.current = decreaseFromLeft
    
    const numBarsRef = React.useRef(numBars)
    numBarsRef.current = numBars
    
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
        const uNumBars = gl.getUniformLocation(program, "uNumBars")
        const uDecreaseFromLeft = gl.getUniformLocation(program, "uDecreaseFromLeft")

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

        window.addEventListener("pointermove", onPointerMove, { passive: true })

        let frameId = 0
        let resizeObserver: ResizeObserver | null = null
        const start = performance.now()

        const resize = () => {
            const rect = canvas.getBoundingClientRect()
            const ratio = window.devicePixelRatio || 1
            canvas.width = Math.max(1, Math.floor(rect.width * ratio))
            canvas.height = Math.max(1, Math.floor(rect.height * ratio))
            gl.viewport(0, 0, canvas.width, canvas.height)
            if (iResolution) {
                gl.uniform2f(iResolution, canvas.width, canvas.height)
            }
            if (uNumBars) {
                const bars = numBarsRef.current ?? (window.innerWidth < 768 ? 12.0 : 22.0)
                gl.uniform1f(uNumBars, bars)
            }
            if (uDecreaseFromLeft) {
                gl.uniform1f(uDecreaseFromLeft, decreaseFromLeftRef.current ? 1.0 : 0.0)
            }
        }
        resize()

        window.addEventListener("resize", resize)
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                resize()
            })
            resizeObserver.observe(canvas)
        }

        const render = (now: number) => {
            gl.uniform2f(iResolution, canvas.width, canvas.height)
            gl.uniform1f(iTime, (now - start) / 1000)
            if (uDecreaseFromLeft) {
                gl.uniform1f(uDecreaseFromLeft, decreaseFromLeftRef.current ? 1.0 : 0.0)
            }
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
            window.removeEventListener("pointermove", onPointerMove)
            window.removeEventListener("resize", resize)
            if (resizeObserver) {
                resizeObserver.disconnect()
            }
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
        }
    }, [])

    return (
        <canvas 
            ref={canvasRef} 
            className={cn(
                "h-full w-full rounded-2xl absolute inset-0 pointer-events-none invert-100 contrast-100 dark:invert-0 transition-opacity ease-linear duration-300 z-0",
                className
            )} 
        />
    )
}

