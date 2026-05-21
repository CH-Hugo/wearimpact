'use client'
import { useRef, useEffect } from 'react'
import Tesseract from 'tesseract.js'

export default function Scan() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(function(stream) {
        videoRef.current.srcObject = stream
      })
      .catch(function(err) {
        console.error(err)
      })
  }, [])

  const screen = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    Tesseract.recognize(canvas, 'fra')
      .then(function(data) {
        const texte = data.data.text
        console.log(texte)
        const etiquette = parseEtiquette(texte)
        console.log(etiquette)

        fetch('/api/impact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pays: etiquette.pays, matieres: etiquette.matieres })
        })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            localStorage.setItem('impact', JSON.stringify(data))
            window.location.href = '/resultat'
          })
      })
  }

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline></video>
      <canvas ref={canvasRef}></canvas>
      <button onClick={screen}>Scanner</button>
    </div>
  )
}

function parseEtiquette(texte) {
  const matchPays = texte.match(/[Ff]abriqu[ée] en (\w+)|[Mm]ade in (\w+)/)
  const pays = matchPays ? (matchPays[1] || matchPays[2]) : null
  const matieres = [...texte.matchAll(/(\d+)\s*%\s*(\w+)/g)]
    .map(match => ({ pourcentage: parseInt(match[1]), matiere: match[2] }))
  return { pays, matieres }
}
