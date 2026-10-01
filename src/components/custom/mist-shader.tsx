"use client"

import { cn } from "cn"
import * as React from "react"

const FRAGMENT_SOURCE = `float hash21(vec2 p) {
	p = fract(p * vec2(123.34, 456.21));
	p += dot(p, p + 45.32);
	return fract(p.x * p.y);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);

	float a = hash21(i);
	float b = hash21(i + vec2(1.0, 0.0));
	float c = hash21(i + vec2(0.0, 1.0));
	float d = hash21(i + vec2(1.0, 1.0));

	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
	float value = 0.0;
	float amplitude = 0.5;
	for (int i = 0; i < 5; i++) {
		value += amplitude * noise(p);
		p *= 2.02;
		amplitude *= 0.5;
	}
	return value;
}

float paperFiber(vec2 uv) {
	float fine = noise(uv * vec2(760.0, 140.0));
	float mid = noise(uv * vec2(380.0, 82.0) + vec2(13.2, 4.7));
	float coarse = noise(uv * vec2(120.0, 36.0) + vec2(3.0, 9.0));
	return fine * 0.50 + mid * 0.35 + coarse * 0.15;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord / max(iResolution.xy, vec2(1.0));
	vec2 p = uv - 0.5;
	p.x *= iResolution.x / max(iResolution.y, 1.0);

	float t = iTime * 0.6;

	vec3 base = vec3(0.12, 0.15, 0.23);
	vec3 color = base;

	vec2 q = p;
	q += vec2(0.012 * sin(t * 2.8), 0.008 * cos(t * 2.1));

	vec2 warmCenter = vec2(-0.78, 0.34) + vec2(0.015 * sin(t * 1.3), 0.010 * cos(t * 1.1));
	vec2 coolCenter = vec2(-0.02, 0.02) + vec2(0.010 * cos(t * 1.5 + 0.7), 0.008 * sin(t * 1.2));
	vec2 lightCenter = vec2(0.86, -0.28) + vec2(0.012 * sin(t * 1.0 + 1.1), 0.009 * cos(t * 1.4));
	vec2 oliveCenter = vec2(0.84, 0.56) + vec2(0.008 * sin(t * 0.9), 0.006 * cos(t * 1.0 + 0.3));

	float warm = exp(-dot(q - warmCenter, q - warmCenter) * 2.6);
	float cool = exp(-dot(q - coolCenter, q - coolCenter) * 2.2);
	float light = exp(-dot(q - lightCenter, q - lightCenter) * 3.0);
	float olive = exp(-dot(q - oliveCenter, q - oliveCenter) * 6.5);

	color += vec3(0.78, 0.34, 0.14) * warm * 1.00;
	color += vec3(0.14, 0.22, 0.38) * cool * 1.15;
	color += vec3(0.86, 0.70, 0.64) * light * 1.08;
	color += vec3(0.48, 0.53, 0.42) * olive * 0.35;

	float fogShift = 0.018 * sin(iTime * 0.28);
	float diagonalFog = smoothstep(-0.56 + fogShift, 0.52 + fogShift, q.x - q.y * 0.62);
	color = mix(color, color * 0.80 + vec3(0.025, 0.035, 0.055), diagonalFog * 0.33);

	float cloud = fbm(q * 1.8 + vec2(0.0, t * 0.85));
	color += (cloud - 0.5) * 0.06;
	float breathing = 0.5 + 0.5 * sin(iTime * 0.42 + q.x * 1.8 - q.y * 1.3);
	color += vec3(0.012, 0.010, 0.008) * (breathing - 0.5);

	vec3 vintage = vec3(
		dot(color, vec3(0.36, 0.70, 0.18)),
		dot(color, vec3(0.33, 0.64, 0.16)),
		dot(color, vec3(0.24, 0.48, 0.12))
	);
	color = mix(color, vintage, 0.10);
	color *= vec3(1.02, 0.99, 0.95);

	vec2 texUv = uv;
	texUv += vec2(0.0038 * sin(t * 2.0 + uv.y * 3.0), 0.0030 * cos(t * 1.7 + uv.x * 2.6));
	texUv += (uv - 0.5) * (0.0052 * sin(t * 1.3));

	float fiber = paperFiber(texUv);
	float pores = noise(texUv * 1100.0 + vec2(19.1, 7.3) + vec2(t * 0.12, -t * 0.09));
	float blotch = fbm(texUv * vec2(8.0, 6.0) + vec2(1.7, 2.4) + vec2(t * 0.03, t * 0.04));

	float texture = (fiber - 0.5) * 0.05 + (pores - 0.5) * 0.03;
	color += texture;
	color *= 0.96 + 0.08 * blotch;

	float edgeWear = smoothstep(0.0, 0.13, uv.x) * smoothstep(1.0, 0.87, uv.x);
	edgeWear *= smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
	color *= 0.94 + 0.06 * edgeWear;

	float vignette = smoothstep(1.05, 0.20, length(p));
	color *= 0.83 + 0.17 * vignette;

	fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
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

export function SarvamMistPreview({className}:{className?:string}) {
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

    return <canvas ref={canvasRef} className={cn("h-full w-full", className)} />
}
