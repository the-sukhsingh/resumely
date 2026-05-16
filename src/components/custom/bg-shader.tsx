"use client"

import * as React from "react"

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
    
    // 1. Create the Bar Columns, Give Even numbers
    float numBars = 20.0; 
    // Multiply by bar count and floor to get a constant value for each bar width
    float barID = floor(uv.x * numBars) / numBars;
    
    // 2. Create the V-Shape Logic
    // Shift center to 0.0 so we can use abs() for symmetry
    float centeredX = (barID - 0.5) * 2.0; 
    float vShape = abs(centeredX); 
    
    // 3. Define the Stepped Height
    // The height of each bar increases as we move away from the center
    float threshold = 0.2 + vShape * 0.6;

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
uniform float iTime;
uniform vec4 iMouse;

${source}

void main() {
  vec4 shaderColor = vec4(0.0);
  mainImage(shaderColor, gl_FragCoord.xy);
  gl_FragColor = vec4(clamp(shaderColor.rgb, 0.0, 1.0), 1.0);
}`
}

export function BarsPreview() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

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

    return <canvas ref={canvasRef} className="h-full w-full rounded-2xl absolute inset-0 invert-100 contrast-100 dark:invert-0 transition-all ease-linear duration-50 z-10" />
}
