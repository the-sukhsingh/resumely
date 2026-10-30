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

// ── 2D Rotation ──────────────────────────────────────────────
mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

// ── Hash & Grain for physical film texture ───────────────────
float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.51);
    return fract(p.x * p.y);
}

// ── True Optical Prism Spectral Dispersion ───────────────────
// Wavelength parameter lambda in [0.0, 1.0]
vec3 spectrum(float lambda) {
    lambda = clamp(lambda, 0.0, 1.0);
    // Refractive wavelength spectrum: Violet -> Azure -> Cyan -> Emerald -> Gold -> Coral
    vec3 c0 = vec3(0.58, 0.22, 0.96); // 400nm Violet
    vec3 c1 = vec3(0.15, 0.52, 0.98); // 450nm Electric Blue
    vec3 c2 = vec3(0.05, 0.82, 0.76); // 500nm Cyan
    vec3 c3 = vec3(0.18, 0.88, 0.38); // 540nm Emerald
    vec3 c4 = vec3(0.98, 0.78, 0.12); // 590nm Radiant Gold
    vec3 c5 = vec3(0.96, 0.32, 0.28); // 650nm Vivid Coral

    float b0 = smoothstep(0.00, 0.20, lambda);
    float b1 = smoothstep(0.20, 0.40, lambda);
    float b2 = smoothstep(0.40, 0.60, lambda);
    float b3 = smoothstep(0.60, 0.80, lambda);
    float b4 = smoothstep(0.80, 1.00, lambda);

    vec3 col = mix(c0, c1, b0);
    col = mix(col, c2, b1);
    col = mix(col, c3, b2);
    col = mix(col, c4, b3);
    col = mix(col, c5, b4);
    return col;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);

    float t = iTime * 0.38;

    // Interactive pointer parallax (smooth normalized mouse offset)
    vec2 mouseOffset = (iMouse.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    uv -= mouseOffset * 0.12;

    // Base background tone depending on light / dark mode
    vec3 bg;
    if (uDarkMode > 0.5) {
        // Dark Mode: deep obsidian with subtle graphite warmth
        bg = vec3(0.045, 0.045, 0.055);
    } else {
        // Light Mode: clean, crisp, airy titanium white
        bg = vec3(0.985, 0.985, 0.992);
    }

    vec3 accumCol = vec3(0.0);
    float totalWeight = 0.0;

    // Multi-pass chromatic wavelength dispersion (8 distinct spectral rays)
    const int PASSES = 8;
    for (int i = 0; i < PASSES; i++) {
        float fi = float(i);
        float lambda = fi / float(PASSES - 1);
        
        // Cauchy-like angular chromatic offset
        float dispersionAngle = (lambda - 0.5) * 0.26;
        
        vec2 p = uv;
        // Rotate into optical axis with gentle breathing
        p *= rot(0.42 + dispersionAngle + sin(t * 0.4) * 0.06);

        // Sinusoidal dispersive wavefronts
        float waveA = sin(p.x * 2.8 + p.y * 1.8 + t * 1.1 + dispersionAngle * 3.5);
        float waveB = cos(p.y * 3.2 - p.x * 2.2 - t * 0.85);
        float waveC = sin((p.x - p.y) * 4.4 + waveA * 1.6 + t * 0.65);

        // Intense, luminous caustic focal line
        float causticField = abs(p.y + waveA * 0.28 + waveB * 0.18 + waveC * 0.12);
        float causticLine = 0.024 / (causticField + 0.016);
        
        // Secondary softer prism flare
        float causticField2 = abs(p.x * 0.75 - p.y * 1.1 + waveB * 0.32);
        float causticLine2 = 0.014 / (causticField2 + 0.022);

        // Soft volumetric aura around the caustic beam
        float aura = exp(-length(p * vec2(0.85, 1.3)) * 2.4) * 0.45;

        float intensity = causticLine * 1.15 + causticLine2 * 0.65 + aura;
        vec3 spectralColor = spectrum(lambda);

        accumCol += spectralColor * intensity;
        totalWeight += 1.0;
    }

    accumCol /= float(PASSES);

    // Subtle floating prismatic caustic sparks
    for (int j = 0; j < 4; j++) {
        float fj = float(j);
        vec2 sparkPos = vec2(
            sin(t * 0.8 + fj * 1.8) * 0.55,
            cos(t * 0.6 + fj * 2.2) * 0.40
        );
        float sparkDist = length(uv - sparkPos);
        float sparkIntensity = 0.0035 / (sparkDist * sparkDist + 0.006);
        accumCol += spectrum(fract(fj * 0.28 + t * 0.1)) * sparkIntensity * 0.4;
    }

    // Smooth soft vignette around the canvas perimeter
    float r = length(uv);
    float vignette = smoothstep(1.35, 0.4, r);
    accumCol *= vignette;

    vec3 finalColor;
    if (uDarkMode > 0.5) {
        // Dark Mode: glowing, radiant spectral caustics over obsidian
        finalColor = bg + accumCol * 2.6;
    } else {
        // Light Mode: pure white ground with luminous spectral refraction ribbons
        vec3 invertedDispersion = vec3(1.0) - accumCol * 1.35;
        finalColor = bg * clamp(invertedDispersion, 0.0, 1.0) + accumCol * 0.75;
    }

    // High-resolution physical 35mm grain to eliminate color banding
    float grainVal = (hash(fragCoord + floor(iTime * 12.0)) - 0.5) * 0.022;
    finalColor += grainVal;

    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}
`;

export default function HeroShader({ className, speed = 1.0 }: HeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

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

    // Quad geometry
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
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      mouse.targetX = canvas.width * 0.5;
      mouse.targetY = canvas.height * 0.5;
      mouse.x = mouse.targetX;
      mouse.y = mouse.targetY;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    let animId = 0;
    const start = performance.now();

    const isDark = () => {
      return document.documentElement.classList.contains("dark") ? 1.0 : 0.0;
    };

    const render = (now: number) => {
      if (isVisible) {
        // Smooth mouse lerping
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

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
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[480px] sm:h-[560px] lg:h-[640px] rounded-3xl sm:rounded-[44px] lg:rounded-tl-[56px] overflow-hidden select-none",
        "border border-neutral-200/80 dark:border-white/10 shadow-2xl shadow-neutral-900/10 dark:shadow-black/50 bg-neutral-100 dark:bg-neutral-950",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
      {/* Subtle glass reflection highlight along top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent pointer-events-none" />
    </div>
  );
}
