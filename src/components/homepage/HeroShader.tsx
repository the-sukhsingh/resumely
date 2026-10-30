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

// ── Film grain hash ──────────────────────────────────────────
float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

// ── Spectral Wavelength to RGB (CIE Color Match) ─────────────
// Maps lambda in [0.0, 1.0] to pure physical prism spectrum
vec3 spectralColor(float lambda) {
    lambda = clamp(lambda, 0.0, 1.0);
    // 0.00: Deep Violet
    // 0.20: Sapphire Blue
    // 0.40: Electric Cyan
    // 0.55: Emerald Lime
    // 0.75: Radiant Gold
    // 1.00: Vivid Crimson / Orange
    vec3 c0 = vec3(0.38, 0.12, 0.72); // Violet
    vec3 c1 = vec3(0.08, 0.32, 0.95); // Deep Azure
    vec3 c2 = vec3(0.02, 0.72, 0.88); // Cyan
    vec3 c3 = vec3(0.12, 0.82, 0.38); // Emerald
    vec3 c4 = vec3(0.98, 0.72, 0.10); // Warm Gold
    vec3 c5 = vec3(0.92, 0.24, 0.18); // Crimson Coral

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

// Gaussian beam helper
float gbeam(float x, float center, float sigma) {
    float d = (x - center) / max(sigma, 0.001);
    return exp(-0.5 * d * d);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;

    float t = iTime * 0.22;

    // Pointer parallax response (gentle shift of the light apex)
    vec2 mouseNorm = (iMouse.xy / iResolution.xy - 0.5);
    vec2 apex = vec2(0.60 + mouseNorm.x * 0.08, 1.08 + mouseNorm.y * 0.05);

    // Vector from light apex to current pixel in aspect-corrected space
    vec2 d = vec2((uv.x - apex.x) * aspect, uv.y - apex.y);
    float dist = length(d);
    
    // Polar angle fanning downward (0 is straight down)
    float baseAngle = atan(d.x, -d.y);

    // Subtle silky wave undulation along the ray propagation path
    float wave1 = sin(dist * 3.8 - t * 0.7) * 0.022;
    float wave2 = cos(dist * 7.2 + t * 0.5 + baseAngle * 2.0) * 0.012;
    float warpedAngle = baseAngle + wave1 + wave2;

    // Background: deep velvety obsidian with subtle photographic warmth
    vec3 bg = vec3(0.038, 0.040, 0.048);

    vec3 totalLight = vec3(0.0);

    // Radiating beam definitions (matching the exact fan structure of the reference image)
    // 7 primary light shafts radiating from the top
    const int NUM_BEAMS = 7;
    float beamCenters[NUM_BEAMS];
    float beamWidths[NUM_BEAMS];
    float beamGains[NUM_BEAMS];

    beamCenters[0] = -0.58; beamWidths[0] = 0.085; beamGains[0] = 0.45; // Far left faint beam
    beamCenters[1] = -0.38; beamWidths[1] = 0.065; beamGains[1] = 0.85; // Left medium beam
    beamCenters[2] = -0.18; beamWidths[2] = 0.055; beamGains[2] = 1.25; // Left prominent beam
    beamCenters[3] =  0.02; beamWidths[3] = 0.075; beamGains[3] = 1.70; // Central brilliant hero beam
    beamCenters[4] =  0.19; beamWidths[4] = 0.048; beamGains[4] = 1.10; // Right narrow ray
    beamCenters[5] =  0.36; beamWidths[5] = 0.060; beamGains[5] = 0.95; // Right secondary ray
    beamCenters[6] =  0.58; beamWidths[6] = 0.095; beamGains[6] = 0.60; // Far right wide fan

    // Multi-pass spectral dispersion (10 wavelength samples)
    const int PASSES = 10;
    float dispersionScale = 0.042; // Optical angular separation factor

    for (int p = 0; p < PASSES; p++) {
        float fp = float(p);
        float lambda = fp / float(PASSES - 1);
        
        // Wavelength-dependent angular refraction offset
        float lambdaOffset = (lambda - 0.5) * dispersionScale;
        float evalAngle = warpedAngle + lambdaOffset;

        // Sum intensity for this wavelength across all beams
        float waveIntensity = 0.0;
        for (int b = 0; b < NUM_BEAMS; b++) {
            // Modulate beam width slightly with wavelength to create chromatic edge feathering
            float bw = beamWidths[b] * (0.85 + lambda * 0.30);
            float beamProfile = gbeam(evalAngle, beamCenters[b], bw);
            waveIntensity += beamProfile * beamGains[b];
        }

        vec3 color = spectralColor(lambda);
        totalLight += color * waveIntensity;
    }

    totalLight /= float(PASSES);

    // Central core brilliance: when all wavelengths converge, boost to luminous champagne/white
    float coreWhiteMask = gbeam(warpedAngle, 0.02, 0.042) * 1.4 + gbeam(warpedAngle, -0.18, 0.035) * 0.8;
    vec3 coreColor = vec3(0.98, 0.96, 0.92) * coreWhiteMask;

    // Distance attenuation: rays emerge bright near apex, stay luminous through mid-body, and softly feather
    float distFade = smoothstep(1.9, 0.2, dist) * smoothstep(0.02, 0.18, dist);
    
    // Ambient volumetric scatter haze around the light source
    float ambientHaze = 0.12 / (dist * 1.5 + 0.4);
    vec3 hazeColor = vec3(0.12, 0.22, 0.38) * ambientHaze;

    // Combine rays, core brilliance, and ambient haze
    vec3 finalLight = (totalLight * 2.2 + coreColor * 1.6 + hazeColor) * distFade;

    // Composite over deep obsidian background
    vec3 sceneColor = bg + finalLight;

    // Soft borderless vignette around the outer canvas edge
    vec2 vigUV = uv * 2.0 - 1.0;
    float edgeVig = 1.0 - dot(vigUV * vec2(0.40, 0.45), vigUV * vec2(0.40, 0.45));
    edgeVig = clamp(edgeVig, 0.0, 1.0);
    sceneColor *= (0.85 + 0.15 * edgeVig);

    // Authentic 35mm film grain (jittered at 10fps for tangible cinematic grain)
    float grain = (hash(fragCoord + floor(iTime * 10.0) * 19.3) - 0.5) * 0.032;
    sceneColor += grain;

    gl_FragColor = vec4(clamp(sceneColor, 0.0, 1.0), 1.0);
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
      mouse.targetX = canvas.width * 0.6;
      mouse.targetY = canvas.height * 0.9;
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
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-[480px] sm:h-[560px] lg:h-[640px] rounded-3xl sm:rounded-[44px] lg:rounded-tl-[56px] overflow-hidden select-none",
        "border border-neutral-800/90 dark:border-white/10 shadow-2xl shadow-neutral-950/40 bg-[#07080b]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
      {/* Precision hairline rim light along top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      {/* Subtle corner specular glint */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />
    </div>
  );
}
