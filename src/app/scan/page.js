'use client'
import { useRef, useEffect, useState } from 'react'
import Tesseract from 'tesseract.js'
import Link from 'next/link'

export default function Scan() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [erreurCamera, setErreurCamera] = useState(false)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(function(stream) {
        videoRef.current.srcObject = stream
      })
      .catch(function(err) {
        console.error(err)
        setErreurCamera(true)
      })
  }, [])

const screen = () => {
  setLoading(true)
  const video = videoRef.current
  const canvas = canvasRef.current
  const context = canvas.getContext('2d')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // capturer
  context.filter = 'contrast(2) grayscale(1)'
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  context.filter = 'none'

  // couper le stream
  const stream = videoRef.current.srcObject
  stream.getTracks().forEach(track => track.stop())
  videoRef.current.srcObject = null

  // Tesseract

    Tesseract.recognize(canvas, 'fra', {
  tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789% ',
})
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
    <div className="min-h-screen bg-fond flex flex-col">

      {/* HEADER */}
      <header className="px-6 py-4 flex items-center justify-between bg-fond sticky top-0 z-10">
        <Link href="/" className="text-bleu font-poppins font-bold text-xl">
          WearImpact
        </Link>
        <span className="text-lagune text-sm font-poppins font-medium">Scanner</span>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-4 gap-6 w-full max-w-3xl mx-auto">

        {/* INSTRUCTIONS */}
        <p className="text-lagune text-sm text-center leading-relaxed">
          Pointe ta caméra sur l'étiquette de composition du vêtement
        </p>

        {/* CAMERA */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-black aspect-[3/4]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* CADRE DE CAM */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-2/5 border-2 border-white/70 rounded-2xl" />
          </div>

          {/* LABEL DANS LA CAM */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full font-poppins">
              Cadre l'étiquette ici
            </span>
          </div>
        </div>

        {/* ERREUR CAMERA */}
        {erreurCamera && (
          <div className="bg-white border border-black/10 rounded-2xl p-4 text-center w-full">
            <p className="text-bleu font-poppins text-sm">
              Caméra inaccessible — vérifie les permissions dans ton navigateur.
            </p>
          </div>
        )}

        {/* PETIT BOUTON SCANNER EN ESPERANT QUIL SOIT ACCESSIBLE */}
        <button
          onClick={screen}
          disabled={loading || erreurCamera}
          aria-label="Lancer la reconnaissance de l'étiquette"
          className="bg-bleu text-white font-nunito font-black text-base px-10 py-4 rounded-full shadow-lg w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyse en cours…' : 'Scanner mon vêtement →'}
        </button>

        {loading && (
          <p className="text-lagune text-xs text-center font-poppins">
            Lecture de l'étiquette, ça peut prendre quelques secondes…
          </p>
        )}

        {/* Canvas caché — sert à capturer l'image */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      </main>
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
