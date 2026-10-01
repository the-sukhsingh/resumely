"use client"

import { cn } from "cn"
import * as React from "react"

const FRAGMENT_SOURCE = `// Velocity Streak — luxurious nostalgia
// Full spectrum visible: champagne → gold → bronze → garnet → verdigris → teal.
// Light warm ground, soft vignette, gentle grain.

// ── 35mm film grain (8fps tick for coarser cinematic texture) ────────────────
float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.51);
    return fract(p.x * p.y);
}

float grain(vec2 fc) {
    float t = floor(iTime * 8.0);
    // two octaves: coarse structure + fine detail
    float g  = hash(fc + t) - 0.5;
    float g2 = hash(fc * 0.5 + 73.1 + t) - 0.5;
    return g * 0.65 + g2 * 0.35;
}

// ── nostalgia spectrum ────────────────────────────────────────────────────────
// t = 0 → deep verdigris teal  (lower-right flank)
// t ≈ 0.42 → dark garnet core  (the glowing dividing line)
// t = 1 → aged champagne/parchment (upper-left glow)
vec3 spectrum(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 s0 = vec3(0.12, 0.52, 0.50);  // vivid verdigris teal
    vec3 s1 = vec3(0.18, 0.60, 0.56);  // bright patina
    vec3 s2 = vec3(0.72, 0.22, 0.08);  // saturated garnet
    vec3 s3 = vec3(0.82, 0.44, 0.10);  // warm antique bronze
    vec3 s4 = vec3(0.90, 0.72, 0.28);  // rich aged gold
    vec3 s5 = vec3(0.94, 0.88, 0.66);  // warm champagne / parchment

    float b0 = smoothstep(0.00, 0.22, t);
    float b1 = smoothstep(0.22, 0.42, t);
    float b2 = smoothstep(0.42, 0.60, t);
    float b3 = smoothstep(0.60, 0.80, t);
    float b4 = smoothstep(0.80, 1.00, t);

    vec3 c = mix(s0, s1, b0);
    c = mix(c, s2, b1);
    c = mix(c, s3, b2);
    c = mix(c, s4, b3);
    c = mix(c, s5, b4);
    return c;
}

// ── gaussian envelope ────────────────────────────────────────────────────────
float gband(float x, float center, float sigma) {
    float d = (x - center) / sigma;
    return exp(-d * d * 0.5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float aspect = iResolution.x / iResolution.y;
    vec2 suv = vec2(uv.x * aspect, uv.y);

    // ── diagonal basis (~28°) ─────────────────────────────────────────────
    const float ANGLE = 0.490;
    vec2 bDir  = vec2( cos(ANGLE), sin(ANGLE));
    vec2 bPerp = vec2(-sin(ANGLE), cos(ANGLE));

    vec2 origin = vec2(0.85 * aspect, 0.4);
    vec2 p      = suv - origin;
    float along = dot(p, bDir);
    float perp  = dot(p, bPerp);

    // imperceptibly slow breath — luxurious stillness
    float offset = perp + 0.006 * sin(iTime * 0.14);

    // ── spectrum map ──────────────────────────────────────────────────────
    // spread the full ramp across a wide perpendicular band
    // teal at offset = -0.30, champagne at offset = +0.30
    float specT = clamp(offset / 0.32 + 0.52, 0.0, 1.0);
    vec3 bandColor = spectrum(specT);

    // ── beam envelope — wide so every color stop is visible ───────────────
    float envMain = gband(offset,  0.04, 0.200);  // broad warm mass
    float envTeal = gband(offset, -0.18, 0.100);  // full verdigris body
    float envCore = gband(offset,  0.00, 0.32);  // crisp garnet seam
    float envelope = clamp(envMain + envTeal * 0.80 + envCore * 0.25, 0.0, 1.0);

    // ── axial fade ────────────────────────────────────────────────────────
        float axialFade = smoothstep(-1.90, -0.02, along)
                        * smoothstep( 1.58,  0.22, along);    // ── warm parchment background ──────────────────────────────────────────
    vec3 bg = vec3(0.88, 0.84, 0.76);  // aged paper / warm linen

    float beamMask = envelope * axialFade;
    vec3 col = mix(bg, bandColor, beamMask);

    // ── soft edge vignette only — no corner crush ─────────────────────────
    vec2 vig = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vig * vec2(0.55, 0.65), vig * vec2(0.55, 0.65));
    vignette = clamp(vignette, 0.0, 1.0);
    vignette = pow(vignette, 0.80);   // very gentle, just kisses the edges
    col *= mix(0.72, 1.0, vignette);

    // ── fine grain ────────────────────────────────────────────────────────
    float g = grain(fragCoord);
    float luminance = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col += g * 0.045;

    // ── warm color grade ─────────────────────────────────────────────────
    col = mix(vec3(0.042, 0.028, 0.018), col, clamp(luminance + 0.92, 0.0, 1.0));

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}

`

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

export function VelocityStreakPreview({ className }: { className?: string }) {
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

    return <canvas ref={canvasRef} className={cn("h-full w-full ", className)} />
}
