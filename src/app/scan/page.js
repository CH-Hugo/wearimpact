'use client'
import { useRef, useEffect, useState } from 'react'
import Tesseract from 'tesseract.js'
import Link from 'next/link'

export default function Scan() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [focusing, setFocusing] = useState(false)
  const [erreurCamera, setErreurCamera] = useState(false)

  useEffect(() => {
    const isInAppBrowser = () => /TikTok|FBAN|FBAV/i.test(navigator.userAgent || '')

    if (isInAppBrowser() || !navigator.mediaDevices?.getUserMedia) {
      window.location.href = '/saisie-manuelle'
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then(function(stream) {
        videoRef.current.srcObject = stream
      })
      .catch(function(err) {
        console.error('[scan] Caméra inaccessible:', err.name)
        setErreurCamera(true)
      })
  }, [])

  const capturerEtiquette = () => {
    setFocusing(true)
    setTimeout(capturer, 800)
  }

  const capturer = () => {
    setFocusing(false)
    setLoading(true)

    let video, canvas, context
    try {
      video = videoRef.current
      canvas = canvasRef.current
      context = canvas.getContext('2d')

      const cropX = video.videoWidth * 0.1
      const cropY = video.videoHeight * 0.3
      const cropW = video.videoWidth * 0.8
      const cropH = video.videoHeight * 0.4
      canvas.width = cropW * 2
      canvas.height = cropH * 2

      context.filter = 'grayscale(1) contrast(1.8) brightness(1.1)'
      context.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height)
      context.filter = 'none'

      const stream = videoRef.current.srcObject
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
    } catch (e) {
      console.error('Erreur capture:', e)
      localStorage.setItem('etiquetteDetectee', JSON.stringify({ pays: null, matieres: [] }))
      window.location.href = '/saisie-manuelle'
      return
    }

    Tesseract.recognize(canvas, 'fra', {
      tessedit_pageseg_mode: '6',
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzàâäéèêëîïôùûüç0123456789% ',
      preserve_interword_spaces: '1',
    })
      .then(function(data) {
        const etiquette = parseEtiquette(data.data.text)
        localStorage.setItem('etiquetteDetectee', JSON.stringify(etiquette))
        window.location.href = '/saisie-manuelle'
      })
      .catch(() => {
        localStorage.setItem('etiquetteDetectee', JSON.stringify({ pays: null, matieres: [] }))
        window.location.href = '/saisie-manuelle'
      })
  }

  return (
    <div className="min-h-screen bg-fond flex flex-col">

      <main id="contenu-principal" className="flex-1 flex flex-col items-center px-6 py-4 gap-6 w-full max-w-3xl mx-auto">

        <p className="text-lagune text-sm text-center leading-relaxed">
          Pointe ta caméra sur l&apos;étiquette de composition du vêtement
        </p>

        <div className="relative w-full rounded-3xl overflow-hidden bg-black aspect-[3/4]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4/5 h-2/5 border-2 border-white/70 rounded-2xl" />
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full font-poppins">
              Cadre l&apos;étiquette ici
            </span>
          </div>
        </div>

        {erreurCamera && (
          <div className="bg-white border border-black/10 rounded-2xl p-4 text-center w-full">
            <p className="text-bleu font-poppins text-sm">
              Caméra inaccessible — vérifie les permissions dans ton navigateur.
            </p>
          </div>
        )}

        <button
          onClick={capturerEtiquette}
          disabled={loading || focusing || erreurCamera}
          aria-label="Lancer la reconnaissance de l'étiquette"
          className="bg-bleu text-white font-nunito font-black text-base px-10 py-4 rounded-full shadow-lg w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {focusing ? 'Mise au point…' : loading ? 'Analyse en cours…' : 'Scanner mon vêtement →'}
        </button>

        <Link
          href="/saisie-manuelle"
          className="text-lagune text-sm font-poppins text-center underline"
        >
          Saisir manuellement →
        </Link>

        {loading && (
          <p className="text-lagune text-xs text-center font-poppins">
            Lecture de l&apos;étiquette, ça peut prendre quelques secondes…
          </p>
        )}

        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      </main>
    </div>
  )
}

function parseEtiquette(texte) {
  const matchPays = texte.match(/[Ff]abriqu[ée] en (\w+)|[Mm]ade in (\w+)/)
  const pays = matchPays ? (matchPays[1] || matchPays[2]) : null
  const matieres = [...texte.matchAll(/(\d+)\s{0,5}%\s{0,5}(\w+)/g)]
    .map(match => ({ pourcentage: parseInt(match[1]), matiere: match[2] }))
  return { pays, matieres }
}