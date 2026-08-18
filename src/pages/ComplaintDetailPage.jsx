import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle2, LoaderCircle, MapPin, Sparkles } from 'lucide-react'
import { api, imageUrl } from '../lib/api'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const complaint = useQuery({ queryKey: ['complaint', id, email], queryFn: () => api(`/complaints/${id}?email=${encodeURIComponent(email)}`), enabled: Boolean(email) })

  if (!email) return <Message text="Email is required to track a complaint. Please return to the tracking page." />
  if (complaint.isLoading) return <div className="grid min-h-screen place-items-center"><LoaderCircle className="animate-spin text-emerald-700" /></div>
  if (complaint.isError) return <Message text={complaint.error.message} />
  const data = complaint.data

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-[#f8fbff] px-5 py-9">
      <div className="mx-auto max-w-6xl">
        <Link to="/track" className="text-sm font-semibold text-emerald-800">← Track another complaint</Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5"><div><h1 className="text-3xl font-bold text-slate-950">Complaint #{data.complaintId}</h1><p className="mt-2 text-slate-500">Submitted {new Date(data.createdAt).toLocaleString()}</p></div><span className="rounded bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">{data.status}</span></div>
        <div className="mt-8 grid gap-7 lg:grid-cols-[1.35fr_.95fr]"><div className="space-y-7"><section className="overflow-hidden rounded-lg border border-slate-200 bg-white"><h2 className="border-b border-slate-200 px-5 py-4 font-bold">Submitted media</h2>{data.imageUrl ? <img src={imageUrl(data.imageUrl)} className="h-[380px] w-full object-cover" alt="Submitted complaint"/> : <div className="grid h-64 place-items-center bg-slate-100 text-slate-500">No photo submitted</div>}</section><section className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 text-xl font-bold"><Sparkles className="text-emerald-700"/> AI action engine insights</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Info label="Category" value={data.category}/><Info label="Priority" value={data.priority}/></div><Info label="Routing department" value={data.department}/><Info label="Primary reason" value={data.aiReason || data.aiSummary || 'No AI explanation is available.'}/></section></div><aside className="space-y-6"><section className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 text-xl font-bold"><MapPin className="text-emerald-700"/> Location</h2><p className="mt-4 text-slate-700">{data.address || data.location}</p></section><section className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="text-xl font-bold">Resolution timeline</h2><div className="mt-5 space-y-5">{[...(data.history || [])].reverse().map((entry, index) => <div className="flex gap-3" key={index}><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={18}/><div><p className="font-semibold text-slate-800">{entry.status}</p><p className="text-sm text-slate-500">{entry.message}</p><p className="mt-1 text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString()}</p></div></div>)}</div></section></aside></div>
      </div>
    </main>
    <PageFooter />
  </div>
}

function Info({ label, value }) { return <div className="mt-4 rounded border border-slate-100 bg-slate-50 p-3"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-slate-900">{value}</p></div> }
function Message({ text }) { return <div className="grid min-h-screen place-items-center px-5 text-center text-rose-700"><div><p>{text}</p><Link className="mt-4 inline-block font-bold text-emerald-800" to="/track">Go to tracking</Link></div></div> }
