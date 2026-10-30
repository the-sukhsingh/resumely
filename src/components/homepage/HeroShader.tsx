"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HeroShaderProps {
  className?: string;
  speed?: number;
}

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform float uDarkMode;

// ── Physical 35mm film grain hash ────────────────────────────
float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

// ── Physical Prism Spectrum (Vibrant CIE Optical Dispersion) ─
vec3 spectralColor(float lambda) {
    lambda = clamp(lambda, 0.0, 1.0);
    // Highly saturated optical wavelength spectrum:
    // Violet (400nm) -> Sapphire (450nm) -> Cyan (495nm) -> Emerald (540nm) -> Gold (585nm) -> Crimson (650nm)
    vec3 c0 = vec3(0.48, 0.12, 0.88); // Saturated Violet
    vec3 c1 = vec3(0.08, 0.42, 0.98); // Electric Cobalt
    vec3 c2 = vec3(0.02, 0.82, 0.85); // Pure Cyan
    vec3 c3 = vec3(0.12, 0.88, 0.32); // Vivid Emerald
    vec3 c4 = vec3(0.98, 0.72, 0.08); // Deep Radiant Gold
    vec3 c5 = vec3(0.95, 0.22, 0.18); // Saturated Crimson

    float b0 = smoothstep(0.00, 0.20, lambda);
    float b1 = smoothstep(0.20, 0.40, lambda);
    float b2 = smoothstep(0.40, 0.58, lambda);
    float b3 = smoothstep(0.58, 0.78, lambda);
    float b4 = smoothstep(0.78, 1.00, lambda);

    vec3 col = mix(c0, c1, b0);
    col = mix(col, c2, b1);
    col = mix(col, c3, b2);
    col = mix(col, c4, b3);
    col = mix(col, c5, b4);
    return col;
}

// Gaussian beam envelope
float gbeam(float x, float center, float sigma) {
    float d = (x - center) / max(sigma, 0.001);
    return exp(-0.5 * d * d);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;

    float t = iTime * 0.22;

    // Pointer parallax response (smooth normalized mouse offset)
    vec2 mouseNorm = (iMouse.xy / iResolution.xy - 0.5);
    vec2 apex = vec2(0.68 + mouseNorm.x * 0.06, 1.12 + mouseNorm.y * 0.04);

    // Vector from apex in aspect-corrected coordinates
    vec2 d = vec2((uv.x - apex.x) * aspect, uv.y - apex.y);
    float dist = length(d);

    // Polar angle fanning downward (0 = straight down)
    float baseAngle = atan(d.x, -d.y);

    // Subtle silky wave undulation along propagation path
    float wave1 = sin(dist * 3.6 - t * 0.65) * 0.024;
    float wave2 = cos(dist * 7.2 + t * 0.45 + baseAngle * 2.0) * 0.014;
    float warpedAngle = baseAngle + wave1 + wave2;

    // 7 distinct radiating light shafts matching reference image
    const int NUM_BEAMS = 7;
    float beamCenters[NUM_BEAMS];
    float beamWidths[NUM_BEAMS];
    float beamGains[NUM_BEAMS];

    beamCenters[0] = -0.56; beamWidths[0] = 0.090; beamGains[0] = 0.50; // Left faint beam
    beamCenters[1] = -0.36; beamWidths[1] = 0.068; beamGains[1] = 0.90; // Left medium ray
    beamCenters[2] = -0.16; beamWidths[2] = 0.058; beamGains[2] = 1.35; // Left prominent beam
    beamCenters[3] =  0.03; beamWidths[3] = 0.076; beamGains[3] = 1.85; // Central hero beam
    beamCenters[4] =  0.20; beamWidths[4] = 0.050; beamGains[4] = 1.20; // Right narrow ray
    beamCenters[5] =  0.38; beamWidths[5] = 0.064; beamGains[5] = 1.05; // Right secondary ray
    beamCenters[6] =  0.60; beamWidths[6] = 0.098; beamGains[6] = 0.65; // Far right wide fan

    // Multi-pass optical dispersion (12 spectral samples for rich separation)
    const int PASSES = 12;
    float dispersionScale = 0.048;

    vec3 totalLight = vec3(0.0);

    for (int p = 0; p < PASSES; p++) {
        float fp = float(p);
        float lambda = fp / float(PASSES - 1);

        float lambdaOffset = (lambda - 0.5) * dispersionScale;
        float evalAngle = warpedAngle + lambdaOffset;

        float waveIntensity = 0.0;
        for (int b = 0; b < NUM_BEAMS; b++) {
            float bw = beamWidths[b] * (0.85 + lambda * 0.30);
            float profile = gbeam(evalAngle, beamCenters[b], bw);
            waveIntensity += profile * beamGains[b];
        }

        vec3 color = spectralColor(lambda);
        totalLight += color * waveIntensity;
    }

    totalLight /= float(PASSES);

    // Central core brilliance where all wavelengths converge into champagne/white light
    float coreWhiteMask = gbeam(warpedAngle, 0.03, 0.044) * 1.5 + gbeam(warpedAngle, -0.16, 0.036) * 0.9;
    vec3 coreColor = vec3(0.98, 0.96, 0.92) * coreWhiteMask;

    // Distance attenuation across full viewport: bright near top-right, soft fade across bottom & left
    float distFade = smoothstep(2.5, 0.15, dist) * smoothstep(0.01, 0.15, dist);

    // Subtle atmospheric scatter haze
    float ambientHaze = 0.11 / (dist * 1.5 + 0.42);

    vec3 finalScene;

    if (uDarkMode > 0.5) {
        // ==========================================
        // DARK MODE: Luminous glowing rays on obsidian
        // ==========================================
        vec3 darkBg = vec3(0.038, 0.040, 0.048);
        vec3 darkHaze = vec3(0.12, 0.22, 0.38) * ambientHaze;
        vec3 beamComp = (totalLight * 2.3 + coreColor * 1.7 + darkHaze) * distFade;
        finalScene = darkBg + beamComp;
    } else {
        // ==========================================
        // LIGHT MODE: VIBRANT, HIGH-CONTRAST PRISM
        // ==========================================
        // Crisp warm paper background
        vec3 lightBg = vec3(0.975, 0.978, 0.985);
        
        // Saturated, rich chromatic dispersion that is clearly visible
        vec3 prismRays = totalLight * 2.2 * distFade;
        
        // Optical refractive depth: subtle caustics darkening along ray margins gives rays crisp physical pop
        float rayDensity = (totalLight.r * 0.3 + totalLight.g * 0.5 + totalLight.b * 0.2);
        vec3 opticalShadow = vec3(0.16, 0.19, 0.28) * smoothstep(0.05, 0.65, rayDensity) * (1.0 - smoothstep(0.65, 1.2, rayDensity)) * distFade * 0.45;
        
        // Ambient soft atmospheric tinting from the rays
        vec3 softHaze = vec3(0.94, 0.95, 0.98);

        finalScene = mix(lightBg, softHaze, ambientHaze * 0.3) - opticalShadow + prismRays * 0.65;
    }

    // Authentic physical 35mm film grain (jittered at 10fps for tangible texture)
    float grain = (hash(fragCoord + floor(iTime * 10.0) * 19.3) - 0.5) * 0.024;
    finalScene += grain;

    gl_FragColor = vec4(clamp(finalScene, 0.0, 1.0), 1.0);
}
`;

export default function HeroShader({ className, speed = 1.0 }: HeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const iResLoc = gl.getUniformLocation(program, "iResolution");
    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iMouseLoc = gl.getUniformLocation(program, "iMouse");
    const uDarkLoc = gl.getUniformLocation(program, "uDarkMode");

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = canvas.height - (e.clientY - rect.top) * (canvas.height / rect.height);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouse.targetX = canvas.width * 0.68;
      mouse.targetY = canvas.height * 0.90;
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    let animId = 0;
    const start = performance.now();

    const isDark = () => {
      return document.documentElement.classList.contains("dark") ? 1.0 : 0.0;
    };

    const render = (now: number) => {
      if (isVisible) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        const elapsed = ((now - start) / 1000) * speed;
        gl.uniform2f(iResLoc, canvas.width, canvas.height);
        gl.uniform1f(iTimeLoc, elapsed);
        gl.uniform4f(iMouseLoc, mouse.x, mouse.y, 0, 0);
        gl.uniform1f(uDarkLoc, isDark());

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none block", className)}
    />
  );
}
