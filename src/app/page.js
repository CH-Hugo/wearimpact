import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-fond">
      <Navbar />

      <main>
      {/* HERO */}
      <section className="px-6 py-16 flex flex-col gap-6 items-center text-center w-full max-w-3xl mx-auto">
        <span className="text-lagune text-xs font-semibold tracking-widest uppercase">Éco-responsable</span>
        <h1 className="font-nunito font-black text-5xl text-bleu leading-none tracking-tight">
          Ton vêtement<br/>a une <span className="text-menthe">histoire.</span><br/>Découvre-la.
        </h1>
        <p className="text-lagune text-sm leading-relaxed max-w-sm">
          Scanne l'étiquette, vois l'impact réel. Pas de jugement — juste la vérité pour faire mieux, à ton rythme.
        </p>
        <Link href="/scan" className="bg-bleu text-white font-nunito font-black text-base px-8 py-4 rounded-full w-fit shadow-lg">
          Scanner mon vêtement →
        </Link>
      </section>

      {/* STATS */}
      <section className="bg-bleu px-6 py-8 flex justify-around w-full">
        <div className="max-w-3xl mx-auto flex justify-around w-full">
          <div className="text-center text-white">
            <span className="font-nunito font-black text-2xl block">12kg</span>
            <span className="text-xs uppercase tracking-wide">CO₂ moyen</span>
          </div>
          <div className="text-center text-white border-x border-white/20 px-6">
            <span className="font-nunito font-black text-2xl block">15 000km</span>
            <span className="text-xs uppercase tracking-wide">Parcourus en moyenne</span>
          </div>
          <div className="text-center text-white">
            <span className="font-nunito font-black text-2xl block">80%</span>
            <span className="text-xs uppercase tracking-wide">produits hors Europe</span>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="px-6 py-12 flex flex-col gap-4 items-center w-full max-w-3xl mx-auto">
        <span className="text-lagune text-xs font-semibold tracking-widest uppercase">Le processus</span>
        <h2 className="font-nunito font-black text-3xl text-bleu leading-tight text-center">3 secondes.<br/>Tout savoir.</h2>

        <div className="flex flex-col gap-3 mt-4 w-full">
          {[
            { n: '01', title: 'Scanne l\'étiquette', desc: 'Pointe ta caméra sur la composition du vêtement' },
            { n: '02', title: 'Découvre l\'impact', desc: 'CO₂, kilomètres, conditions de fabrication' },
            { n: '03', title: 'Progresse', desc: 'Suis ton score et améliore ta garde-robe' },
          ].map(step => (
            <div key={step.n} className="flex gap-4 p-5 bg-white rounded-2xl border border-black/5">
              <span className="font-nunito font-black text-3xl text-menthe/40 leading-none w-10" aria-hidden="true">{step.n}</span>
              <div className="text-left">
                <h3 className="font-nunito font-black text-base text-bleu">{step.title}</h3>
                <p className="text-sm text-lagune mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 mb-12 w-full max-w-3xl mx-auto">
        <div className="bg-menthe rounded-3xl p-8 text-center flex flex-col gap-4">
          <h2 className="font-nunito font-black text-2xl text-white leading-tight">Prêt à consommer autrement ?</h2>
          <p className="text-white/80 text-sm">Rejoins les premiers utilisateurs WearImpact.</p>
          <Link href="/inscription" className="bg-bleu text-white font-nunito font-black px-6 py-3 rounded-full w-fit mx-auto">
            Je me lance →
          </Link>
        </div>
      </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-lagune px-6 py-8 text-center w-full">
        <p className="font-nunito font-black text-white text-lg mb-3">WearImpact</p>
        <div className="flex justify-center gap-6">
          <Link href="/inscription" className="text-white/70 text-sm">Inscription</Link>
          <Link href="/connexion" className="text-white/70 text-sm">Connexion</Link>
        </div>
        <p className="text-white/40 text-xs mt-4">© 2026 WearImpact</p>
      </footer>
    </div>
  )
}
