"use client"

import { useEffect, useState } from "react"
import Particles from "@tsparticles/react"
import { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export default function FireParticles() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      style={{ position: "absolute", inset: 0, zIndex: 3 }}
      options={{
        fullScreen: { enable: false },
        particles: {
          number: {
            value: 180,
            density: { enable: true },
          },
          color: {
            value: ["#ff4500", "#ff6a00", "#ffaa00", "#ff2200", "#ff8800"],
          },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.2, max: 0.85 },
            animation: {
              enable: true,
              speed: 1,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 3.5 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
          },
          move: {
            enable: true,
            direction: "top",
            speed: { min: 0.8, max: 2.5 },
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          twinkle: {
            particles: { enable: true, frequency: 0.04, opacity: 1 },
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { quantity: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  )
}