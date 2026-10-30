"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PrismShaderProps {
  className?: string;
  intensity?: number;
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
uniform float uIsDark;

// ── Subtle 35mm grain ──────────────────────────────────────
float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 74.51);
    return fract(p.x * p.y);
}

float grain(vec2 fc, float t) {
    float g = hash(fc + floor(t * 8.0)) - 0.5;
    return g * 0.04;
}

// ── Vibrant Spectral Prism Function ────────────────────────
// Pure optical chromatic dispersion: violet -> cyan -> emerald -> gold -> ruby
vec3 spectralPrism(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 c0 = vec3(0.55, 0.25, 0.95); // Deep violet
    vec3 c1 = vec3(0.12, 0.58, 0.98); // Electric azure
    vec3 c2 = vec3(0.08, 0.82, 0.72); // Vibrant cyan-teal
    vec3 c3 = vec3(0.20, 0.88, 0.42); // Emerald lime
    vec3 c4 = vec3(0.98, 0.76, 0.15); // Radiant gold
    vec3 c5 = vec3(0.95, 0.30, 0.35); // Coral rose

    float b0 = smoothstep(0.00, 0.20, t);
    float b1 = smoothstep(0.20, 0.40, t);
    float b2 = smoothstep(0.40, 0.60, t);
    float b3 = smoothstep(0.60, 0.80, t);
    float b4 = smoothstep(0.80, 1.00, t);

    vec3 col = mix(c0, c1, b0);
    col = mix(col, c2, b1);
    col = mix(col, c3, b2);
    col = mix(col, c4, b3);
    col = mix(col, c5, b4);
    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;
    vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

    float t = iTime * 0.25;

    // Mouse influence (gentle parallax shift)
    vec2 mouseNorm = (iMouse.xy / iResolution.xy - 0.5);
    p += mouseNorm * 0.08;

    // Prism angle (~35 degrees diagonal refraction)
    float angle = 0.62;
    vec2 dir = vec2(cos(angle), sin(angle));
    vec2 perp = vec2(-sin(angle), cos(angle));

    // Project coordinates along prism axis
    float along = dot(p, dir);
    float crossAxis = dot(p, perp);

    // Wave undulation simulating light passing through dispersive optical glass
    float wave1 = sin(along * 3.2 - t * 1.4) * 0.08;
    float wave2 = cos(along * 5.8 + t * 0.9) * 0.04;
    float dispersionOffset = crossAxis + wave1 + wave2;

    // Wide primary prism beam (centered diagonally across right and middle)
    float prismCenter = 0.15 + sin(t * 0.5) * 0.06;
    float dist = dispersionOffset - prismCenter;

    // Spectral mapping across the dispersion band
    float bandWidth = 0.45;
    float specT = clamp((dist + bandWidth * 0.5) / bandWidth, 0.0, 1.0);
    vec3 prismCol = spectralPrism(specT);

    // Gaussian beam intensity envelope
    float sigma = 0.22;
    float beamIntensity = exp(- (dist * dist) / (2.0 * sigma * sigma));

    // Secondary subtle caustics ribbon
    float dist2 = dispersionOffset - (prismCenter - 0.32);
    float beamIntensity2 = exp(- (dist2 * dist2) / (2.0 * 0.09 * 0.09)) * 0.45;
    vec3 secondaryCol = spectralPrism(clamp(specT + 0.3, 0.0, 1.0));

    // Axial fade to soften the edges across the viewport
    float axialMask = smoothstep(-1.2 * aspect, -0.1, along) * smoothstep(1.4 * aspect, 0.2, along);

    // Composite the prism beams
    vec3 totalPrism = prismCol * beamIntensity + secondaryCol * beamIntensity2;
    totalPrism *= axialMask;

    // Background base depending on dark/light mode
    vec3 bg;
    float prismStrength;

    if (uIsDark > 0.5) {
        // Dark Mode: deep subtle neutral with luminous prism glow
        bg = vec3(0.04, 0.04, 0.05);
        prismStrength = 0.55;
    } else {
        // Light Mode: clean crisp airy white/warm paper with pastel-vibrant refraction
        bg = vec3(0.99, 0.99, 1.0);
        prismStrength = 0.32;
    }

    vec3 finalCol = mix(bg, bg + totalPrism * (uIsDark > 0.5 ? 1.4 : 1.0), prismStrength * axialMask);

    // Micro film grain texture for tangible depth
    finalCol += grain(gl_FragCoord.xy, iTime);

    gl_FragColor = vec4(finalCol, 1.0);
}
`;

export default function PrismShader({
  className,
  intensity = 1.0,
  speed = 1.0,
}: PrismShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    // Helper to compile shader
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile failed:", gl.getShaderInfoLog(s));
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
      console.error("Program link failed:", gl.getProgramInfoLog(program));
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

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const iResolution = gl.getUniformLocation(program, "iResolution");
    const iTime = gl.getUniformLocation(program, "iTime");
    const iMouse = gl.getUniformLocation(program, "iMouse");
    const uIsDark = gl.getUniformLocation(program, "uIsDark");

    let mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouse.y =
        canvas.height - (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    let animationFrameId = 0;
    const startTime = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const checkDarkMode = () => {
      return document.documentElement.classList.contains("dark") ? 1.0 : 0.0;
    };

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = (now: number) => {
      if (isVisible) {
        const elapsed = ((now - startTime) / 1000) * speed;
        gl.uniform2f(iResolution, canvas.width, canvas.height);
        gl.uniform1f(iTime, elapsed);
        gl.uniform4f(iMouse, mouse.x, mouse.y, mouse.prevX, mouse.prevY);
        gl.uniform1f(uIsDark, checkDarkMode());

        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full h-full block pointer-events-none", className)}
    />
  );
}
