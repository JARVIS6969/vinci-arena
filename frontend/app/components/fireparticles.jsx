"use client"
import { useEffect, useRef } from "react"

export default function FireParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const TAU = Math.PI * 2
    const PHI = 1.618033988749895
    const GA  = 2.399963229 // golden angle

    // ── GAMER PSYCHOLOGY PAIRS (high contrast, dopamine) ──
    const PAIRS = [
      [{ r:0,   g:255, b:255 }, { r:255, g:0,   b:180 }], // cyan    + magenta
      [{ r:255, g:200, b:0   }, { r:140, g:0,   b:255 }], // gold    + purple
      [{ r:50,  g:255, b:50  }, { r:0,   g:150, b:255 }], // lime    + blue
      [{ r:255, g:40,  b:40  }, { r:0,   g:220, b:255 }], // red     + cyan
      [{ r:255, g:0,   b:160 }, { r:255, g:220, b:0   }], // pink    + yellow
      [{ r:100, g:0,   b:255 }, { r:0,   g:255, b:200 }], // violet  + mint
      [{ r:255, g:80,  b:0   }, { r:0,   g:180, b:255 }], // orange  + sky
    ]

    // ── 15 GOLDEN RATIO PATTERNS ──
    const P = {

      // 1. Golden logarithmic spiral
      spiral: (cx, cy, S, t) => {
        const pts = [], b = Math.log(PHI) / (Math.PI / 2)
        for (let i = 0; i < 160; i++) {
          const a = i * 0.1 + t
          const r = S * 0.01 * Math.exp(b * a)
          if (r > S) break
          pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
        }
        return pts
      },

      // 2. Fibonacci sunflower
      sunflower: (cx, cy, S, t) => {
        const pts = []
        for (let i = 0; i < 144; i++) {
          const r = Math.sqrt(i / 144) * S * 0.95
          const a = i * GA + t * 0.08
          pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
        }
        return pts
      },

      // 3. Pentagram — phi inner/outer
      pentagram: (cx, cy, S, t) => {
        const pts = []
        for (let layer = 0; layer < 5; layer++) {
          const Ro = S * (0.15 + layer * 0.17)
          const Ri = Ro / PHI
          for (let i = 0; i <= 20; i++) {
            const a = (i / 20) * TAU - Math.PI / 2 + t * 0.018 * (layer % 2 ? 1 : -1)
            pts.push({ x: cx + Math.cos(a) * (i % 2 === 0 ? Ro : Ri), y: cy + Math.sin(a) * (i % 2 === 0 ? Ro : Ri) })
          }
        }
        return pts
      },

      // 4. Hexagonal lattice — phi² spacing
      hexLattice: (cx, cy, S, t) => {
        const pts = []
        for (let ring = 1; ring <= 7; ring++) {
          const R = ring * S / (PHI * PHI)
          const n = ring * 6
          for (let i = 0; i <= n; i++) {
            const a = (i / n) * TAU + t * 0.02 * (ring % 2 ? 1 : -1)
            pts.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R })
          }
        }
        return pts
      },

      // 5. Lissajous 8:13 (Fibonacci pair)
      lissajous: (cx, cy, S, t) => {
        const pts = []
        for (let i = 0; i < 200; i++) {
          const u = (i / 200) * TAU
          pts.push({
            x: cx + Math.sin(8 * u + t * 0.01) * S * 0.9,
            y: cy + Math.sin(13 * u + t * 0.007 + Math.PI / PHI) * S * 0.9,
          })
        }
        return pts
      },

      // 6. Metatron's Cube
      metatron: (cx, cy, S, t) => {
        const pts = [], r0 = S * 0.3
        const cs = [{ x: cx, y: cy }]
        for (let i = 0; i < 6; i++) cs.push({ x: cx + Math.cos((i / 6) * TAU) * r0, y: cy + Math.sin((i / 6) * TAU) * r0 })
        for (let i = 0; i < 6; i++) cs.push({ x: cx + Math.cos((i / 6) * TAU + Math.PI / 6) * r0 * 2, y: cy + Math.sin((i / 6) * TAU + Math.PI / 6) * r0 * 2 })
        cs.forEach((c, ci) => {
          for (let i = 0; i < 24; i++) {
            const a = (i / 24) * TAU + t * 0.012 * (ci % 2 ? 1 : -1)
            pts.push({ x: c.x + Math.cos(a) * r0 * 0.9, y: c.y + Math.sin(a) * r0 * 0.9 })
          }
        })
        return pts
      },

      // 7. Rose curve r = cos(phi*3*theta)
      rose: (cx, cy, S, t) => {
        const pts = [], k = PHI * 3
        for (let i = 0; i < 220; i++) {
          const a = (i / 220) * TAU * 6 + t * 0.01
          const r = S * 0.9 * Math.abs(Math.cos(k * a))
          pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
        }
        return pts
      },

      // 8. Torus knot (3,2)
      torusKnot: (cx, cy, S, t) => {
        const pts = [], R = S * 0.6, r = S * 0.26
        for (let i = 0; i < 180; i++) {
          const u = (i / 180) * TAU * 3 + t * 0.008
          const x3 = (R + r * Math.cos(2 * u / 3)) * Math.cos(u)
          const y3 = (R + r * Math.cos(2 * u / 3)) * Math.sin(u)
          const z3 = r * Math.sin(2 * u / 3)
          const pz  = (S * 2.5) / (S * 2.5 + z3 * 0.4)
          pts.push({ x: cx + x3 * pz * 0.8, y: cy + y3 * pz * 0.8 })
        }
        return pts
      },

      // 9. Flower of Life
      flowerOfLife: (cx, cy, S, t) => {
        const pts = [], r = S * 0.26
        const cs = [{ x: cx, y: cy }]
        for (let i = 0; i < 6; i++) cs.push({ x: cx + Math.cos((i / 6) * TAU) * r * 2, y: cy + Math.sin((i / 6) * TAU) * r * 2 })
        for (let i = 0; i < 12; i++) cs.push({ x: cx + Math.cos((i / 12) * TAU + Math.PI / 12) * r * 4, y: cy + Math.sin((i / 12) * TAU + Math.PI / 12) * r * 4 })
        cs.forEach((c, ci) => {
          for (let i = 0; i < 28; i++) {
            const a = (i / 28) * TAU + t * 0.014 * (ci % 2 ? 1 : -1)
            pts.push({ x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r })
          }
        })
        return pts
      },

      // 10. Epicycloid R/r = phi
      epicycloid: (cx, cy, S, t) => {
        const pts = [], R = S * 0.52, r = R / PHI, k = Math.round(R / r)
        for (let i = 0; i < 150; i++) {
          const a = (i / 150) * TAU * k + t * 0.009
          pts.push({
            x: cx + ((R + r) * Math.cos(a) - r * Math.cos(((R + r) / r) * a)) * 0.48,
            y: cy + ((R + r) * Math.sin(a) - r * Math.sin(((R + r) / r) * a)) * 0.48,
          })
        }
        return pts
      },

      // 11. Hypocycloid r/R = 1/phi²
      hypocycloid: (cx, cy, S, t) => {
        const pts = [], R = S * 0.9, r = R / (PHI * PHI)
        for (let i = 0; i < 180; i++) {
          const a = (i / 180) * TAU * 8 + t * 0.011
          pts.push({
            x: cx + ((R - r) * Math.cos(a) + r * Math.cos(((R - r) / r) * a)) * 0.88,
            y: cy + ((R - r) * Math.sin(a) - r * Math.sin(((R - r) / r) * a)) * 0.88,
          })
        }
        return pts
      },

      // 12. Harmonograph (phi frequencies)
      harmonograph: (cx, cy, S, t) => {
        const pts = []
        for (let i = 0; i < 200; i++) {
          const u = (i / 200) * TAU * 12
          const d = Math.exp(-0.0001 * i)
          pts.push({
            x: cx + (Math.sin(u + t * 0.008) * 0.45 + Math.sin(PHI * u + 1.2 + t * 0.006) * 0.38) * S * d,
            y: cy + (Math.sin(PHI * PHI * u + 0.4 + t * 0.01) * 0.45 + Math.sin(PHI * PHI * PHI * u + 2.0 + t * 0.007) * 0.36) * S * d,
          })
        }
        return pts
      },

      // 13. Vesica Piscis
      vesica: (cx, cy, S, t) => {
        const pts = [], off = S * 0.38, r = S * 0.72
        for (let c = 0; c < 2; c++) {
          const ox = c === 0 ? -off : off
          for (let i = 0; i < 120; i++) {
            const a = (i / 120) * TAU + t * 0.016 * (c ? 1 : -1)
            pts.push({ x: cx + ox + Math.cos(a) * r, y: cy + Math.sin(a) * r })
          }
        }
        return pts
      },

      // 14. Golden rectangle spiral
      goldenRect: (cx, cy, S, t) => {
        const pts = []
        let w = S * 1.8, h = S * 1.8 / PHI
        let ox = -S * 0.9, oy = -S * 0.9 / PHI
        const rot = t * 0.012
        for (let d = 0; d < 8; d++) {
          const steps = 40
          if (w > h) {
            const sq = h
            for (let i = 0; i < steps; i++) {
              const a = Math.PI + (i / steps) * (Math.PI / 2) + rot
              pts.push({ x: cx + ox + sq + Math.cos(a) * sq * 0.92, y: cy + oy + sq + Math.sin(a) * sq * 0.92 })
            }
            ox += sq; w -= sq
          } else {
            const sq = w
            for (let i = 0; i < steps; i++) {
              const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2) + rot
              pts.push({ x: cx + ox + sq + Math.cos(a) * sq * 0.92, y: cy + oy + sq + Math.sin(a) * sq * 0.92 })
            }
            oy += sq; h -= sq
          }
          w /= PHI; h /= PHI
        }
        return pts
      },

      // 15. Concentric rings (phi-spaced radii)
      rings: (cx, cy, S, t) => {
        const pts = []
        for (let ring = 1; ring <= 9; ring++) {
          const R = ring * S * 0.108  // ~S/phi² spacing
          const n = Math.floor(ring * PHI * 7)
          for (let i = 0; i < n; i++) {
            const a = (i / n) * TAU + t * 0.025 * (ring % 2 ? 1 : -1)
            pts.push({ x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R })
          }
        }
        return pts
      },
    }

    const PATTERN_FNS = Object.values(P)

    // ── HALLUCINATION LAYER ──
    // Two shapes simultaneously — same center, different patterns, offset phases
    // Creates visual depth and interference = hallucination effect
    let shapeA = { idx: 0,  phase: 0, alpha: 0, pair: PAIRS[0], state: 'fadein', hold: 0 }
    let shapeB = { idx: 7,  phase: Math.PI, alpha: 0, pair: PAIRS[3], state: 'fadein', hold: 100 }

    const HOLD_MAX  = 200
    const FADE_IN   = 0.007
    const FADE_OUT  = 0.006

    const nextShape = (shape, delayedStart = 0) => {
      shape.idx   = Math.floor(Math.random() * PATTERN_FNS.length)
      shape.pair  = PAIRS[Math.floor(Math.random() * PAIRS.length)]
      shape.phase = Math.random() * TAU
      shape.alpha = 0
      shape.state = 'fadein'
      shape.hold  = -delayedStart  // negative hold = delayed start
    }

    // ── AMBIENT DOTS — minimal, small, slow ──
    // Only 60 — just enough to fill space without clutter
    const DOTS = Array.from({ length: 15 }, () => {
      const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)]
      const col  = Math.random() < 0.5 ? pair[0] : pair[1]
      const tier = Math.floor(Math.random() * 3)
      return {
        x:  Math.random() * (canvas.width  || 600),
        y:  Math.random() * (canvas.height || 800),
        vx: (Math.random() - 0.5) * (tier === 0 ? 0.06 : tier === 1 ? 0.20 : 0.55),
        vy: -(tier === 0 ? 0.05 + Math.random() * 0.10 : tier === 1 ? 0.14 + Math.random() * 0.28 : 0.40 + Math.random() * 0.70),
        col,
        bp:  Math.random() * TAU,
        br:  0.006 + Math.random() * 0.025,
        fcd: 40 + Math.floor(Math.random() * 140),
        fl:  false, fd: 0,
      }
    })

    // ── DRAW ONE PARTICLE — minimalist neon dot ──
    // Same size everywhere — no huge flash bubbles
    const dot = (x, y, col, op) => {
      if (op < 0.008) return
      const { r, g, b } = col
      const BASE = 0.8

      // Soft glow — subtle, not overpowering
      const glow = ctx.createRadialGradient(x, y, 0, x, y, BASE * 5)
      glow.addColorStop(0, `rgba(${r},${g},${b},${(op * 0.35).toFixed(3)})`)
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath(); ctx.arc(x, y, BASE * 5, 0, TAU)
      ctx.fillStyle = glow; ctx.fill()

      // Tight corona
      const corona = ctx.createRadialGradient(x, y, 0, x, y, BASE * 2.2)
      corona.addColorStop(0, `rgba(${r},${g},${b},${(op * 0.75).toFixed(3)})`)
      corona.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.beginPath(); ctx.arc(x, y, BASE * 2.2, 0, TAU)
      ctx.fillStyle = corona; ctx.fill()

      // Core dot — pure color (NOT white — as requested)
      ctx.beginPath(); ctx.arc(x, y, BASE, 0, TAU)
      ctx.fillStyle = `rgba(${r},${g},${b},${(op * 0.98).toFixed(3)})`
      ctx.fill()
    }

    // ── DRAW ONE SHAPE ──
    const drawShape = (shape, frame) => {
      if (shape.alpha < 0.005) return
      const cx = canvas.width  * 0.5
      const cy = canvas.height * 0.5
      const S  = Math.min(canvas.width, canvas.height) * 0.44

      const pts = PATTERN_FNS[shape.idx](cx, cy, S, shape.phase)
      const [c1, c2] = shape.pair
      const total = pts.length

      pts.forEach((pt, pi) => {
        const { x, y } = pt
        if (x < -10 || x > canvas.width + 10 || y < -10 || y > canvas.height + 10) return

        // Smooth color lerp across pattern
        const t = pi / total
        const ic = {
          r: Math.round(c1.r + (c2.r - c1.r) * t),
          g: Math.round(c1.g + (c2.g - c1.g) * t),
          b: Math.round(c1.b + (c2.b - c1.b) * t),
        }

        // Hallucination twinkle — slow sine, different per point
        // Prime multipliers prevent sync between all points
        const tw = 0.45 + 0.55 * Math.sin(frame * 0.038 + pi * 0.23 + shape.phase * 1.3)
        const op = shape.alpha * tw * 0.88
        dot(x, y, ic, op)
      })
    }

    // ── LIFECYCLE ──
    const tick = (shape) => {
      shape.phase += 0.005
      if (shape.state === 'fadein') {
        if (shape.hold < 0) { shape.hold++; return }  // delayed start
        shape.alpha += FADE_IN
        if (shape.alpha >= 0.75) { shape.alpha = 0.75; shape.state = 'hold'; shape.hold = 0 }
      } else if (shape.state === 'hold') {
        shape.hold++
        if (shape.hold >= HOLD_MAX) shape.state = 'fadeout'
      } else if (shape.state === 'fadeout') {
        shape.alpha -= FADE_OUT
        if (shape.alpha <= 0) { shape.alpha = 0; nextShape(shape) }
      }
    }

    let frame = 0, animId

    const loop = () => {
      animId = requestAnimationFrame(loop)
      frame++

      // ── HALLUCINATION TRAIL — very subtle persistence ──
      // NOT full clear — 8% persistence creates ghosting/depth
      ctx.fillStyle = 'rgba(0,0,0,0.92)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // ── AMBIENT DOTS ──
      DOTS.forEach(d => {
        d.x += d.vx; d.y += d.vy
        if (d.y < -6) { d.y = canvas.height + 6; d.x = Math.random() * canvas.width }
        if (d.x < -4) d.x = canvas.width + 4
        if (d.x > canvas.width + 4) d.x = -4
        d.fcd--
        if (d.fcd <= 0 && !d.fl) {
          d.fl = true; d.fd = 4 + Math.floor(Math.random() * 4)
          d.fcd = 80 + Math.floor(Math.random() * 130)
        }
        if (d.fl) { d.fd--; if (d.fd <= 0) d.fl = false }
        const breathe = 0.5 + 0.5 * Math.sin(frame * d.br + d.bp)
        dot(d.x, d.y, d.col, d.fl ? 0.90 : 0.06 + breathe * 0.16)
      })

      // ── TWO SHAPES — hallucination interference ──
      tick(shapeA); tick(shapeB)
      drawShape(shapeA, frame)
      drawShape(shapeB, frame)
    }

    loop()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:3, pointerEvents:'none' }}
    />
  )
}