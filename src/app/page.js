import Link from 'next/link'

export default function Home() {
  return (
<div className="flex flex-col items-center">
  <h1 className="text-3xl font-bold">WearImpact</h1>
  <Link href="/scan" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
    Scan
  </Link>
</div>
  )
}