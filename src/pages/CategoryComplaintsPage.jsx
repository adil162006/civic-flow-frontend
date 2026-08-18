import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, ChevronRight, LoaderCircle, MapPin, Plus } from 'lucide-react'
import { api } from '../lib/api'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

const priorityClass = (value = '') => ({
  critical: 'bg-rose-50 text-rose-700', high: 'bg-amber-50 text-amber-700', medium: 'bg-sky-50 text-sky-700', low: 'bg-slate-100 text-slate-600',
}[value.toLowerCase()] || 'bg-slate-100 text-slate-600')

const statusClass = (value = '') => value.toLowerCase().includes('resolved')
  ? 'bg-emerald-50 text-emerald-700'
  : value.toLowerCase().includes('progress')
    ? 'bg-sky-50 text-sky-700'
    : 'bg-amber-50 text-amber-700'

export default function CategoryComplaintsPage() {
  const { category } = useParams()
  const decodedCategory = decodeURIComponent(category)
  const reports = useQuery({
    queryKey: ['categoryComplaints', decodedCategory],
    queryFn: () => api(`/complaints?category=${encodeURIComponent(decodedCategory)}`),
  })

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-[#f5fbf5] px-5 py-9">
      <div className="mx-auto max-w-7xl">
        <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800"><ArrowLeft size={16}/> All categories</Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-xs font-bold tracking-[.18em] text-emerald-700">CATEGORY REPORTS</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">{decodedCategory}</h1><p className="mt-2 text-slate-600">Open and historical complaints classified in this category.</p></div>
          <Link to="/report" className="inline-flex items-center gap-2 rounded-sm bg-emerald-800 px-5 py-3 font-bold text-white"><Plus size={18}/> Report an issue</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reports.isLoading && <div className="col-span-full flex items-center justify-center gap-2 py-20 text-slate-500"><LoaderCircle className="animate-spin" size={19}/> Loading reports…</div>}
          {reports.isError && <div className="col-span-full rounded-lg bg-rose-50 p-5 text-rose-700">{reports.error.message}</div>}
          {reports.data?.complaints?.map((complaint) => <article key={complaint._id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3"><span className="font-mono text-xs font-bold text-emerald-800">{complaint.complaintId}</span><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${priorityClass(complaint.priority)}`}>{complaint.priority} priority</span></div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">{complaint.category}</h2>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{complaint.description}</p>
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="text-emerald-700"/>{complaint.location}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16}/>{new Date(complaint.createdAt).toLocaleDateString()}</p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(complaint.status)}`}>{complaint.status}</span><Link to={`/complaints/${complaint.complaintId}`} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800">Details <ChevronRight size={16}/></Link></div>
          </article>)}
          {!reports.isLoading && !reports.isError && reports.data?.complaints?.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-bold text-slate-800">No {decodedCategory.toLowerCase()} reports yet</h2><p className="mt-2 text-slate-600">Be the first to report an issue in this category.</p><Link to="/report" className="mt-5 inline-block rounded-sm bg-emerald-800 px-4 py-2 font-bold text-white">Create report</Link></div>}
        </div>
      </div>
    </main>
    <PageFooter />
  </div>
}
