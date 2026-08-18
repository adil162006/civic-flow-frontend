import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Droplets, Lightbulb, LoaderCircle, MapPinned, MoreHorizontal, Trash2, TriangleAlert, Wrench } from 'lucide-react'
import { api } from '../lib/api'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

const categories = [
  { name: 'Pothole', description: 'Damaged roads, potholes, and unsafe road surfaces.', icon: TriangleAlert, color: 'bg-amber-50 text-amber-700' },
  { name: 'Garbage', description: 'Waste collection, overflowing bins, and litter.', icon: Trash2, color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Streetlight', description: 'Broken, flickering, or missing street lighting.', icon: Lightbulb, color: 'bg-yellow-50 text-yellow-700' },
  { name: 'Water Leakage', description: 'Leaking pipes, water loss, and supply issues.', icon: Droplets, color: 'bg-sky-50 text-sky-700' },
  { name: 'Drainage', description: 'Blocked drains, flooding, and sewage concerns.', icon: MapPinned, color: 'bg-cyan-50 text-cyan-700' },
  { name: 'Road Damage', description: 'Cracks, broken curbs, signs, and road assets.', icon: Wrench, color: 'bg-orange-50 text-orange-700' },
  { name: 'Other', description: 'Other civic issues handled by available departments.', icon: MoreHorizontal, color: 'bg-slate-100 text-slate-700' },
]

export default function CategoriesPage() {
  const stats = useQuery({ queryKey: ['adminStats'], queryFn: () => api('/admin/stats') })
  const counts = stats.data?.stats?.categoryDistribution || {}

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-[#f5fbf5] px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[.18em] text-emerald-700">CIVIC ISSUE DIRECTORY</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Explore issues by category</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Browse reports by the categories supported by the CivicFlow backend. Each category screen displays current complaints and their action status.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ name, description, icon: Icon, color }) => <Link key={name} to={`/categories/${encodeURIComponent(name)}`} className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-sm">
            <div className={`grid size-12 place-items-center rounded-lg ${color}`}><Icon size={23}/></div>
            <div className="mt-5 flex items-start justify-between gap-3"><h2 className="text-xl font-bold text-slate-900">{name}</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{stats.isLoading ? '…' : counts[name] ?? 0}</span></div>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">View reports <ArrowRight className="transition group-hover:translate-x-1" size={16}/></span>
          </Link>)}
        </div>
        {stats.isLoading && <p className="mt-6 flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={16}/> Loading category totals…</p>}
      </div>
    </main>
    <PageFooter />
  </div>
}
