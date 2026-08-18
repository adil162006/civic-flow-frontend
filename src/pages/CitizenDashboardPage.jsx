import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle2, ClipboardList, Clock3, LoaderCircle, Mail } from 'lucide-react'
import { api } from '../lib/api'
import { useAdminAuth } from '../context/AdminAuthContext'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function CitizenDashboardPage() {
  const { admin } = useAdminAuth()
  if (!admin) return <Navigate to="/admin" replace />

  const [email, setEmail] = useState('')
  const query = useQuery({ queryKey: ['citizenComplaints', email], queryFn: () => api(`/complaints?email=${encodeURIComponent(email)}`), enabled: Boolean(email) })
  const complaints = query.data?.complaints || []
  const pending = complaints.filter((item) => !/resolved/i.test(item.status) && !/progress/i.test(item.status)).length
  const inProgress = complaints.filter((item) => /progress/i.test(item.status)).length
  const resolved = complaints.filter((item) => /resolved|closed/i.test(item.status)).length
  const cards = [['Total complaints', complaints.length, ClipboardList], ['Pending review', pending, Clock3], ['In progress', inProgress, LoaderCircle], ['Resolved', resolved, CheckCircle2]]

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-[#f5fbf5] px-5 py-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold">Citizen dashboard</h1><p className="mt-2 text-slate-600">View every complaint submitted with your email address.</p></div><Link to="/report" className="rounded-sm bg-emerald-800 px-5 py-3 font-bold text-white">+ Report new issue</Link></div>
        <div className="relative mt-6 max-w-md"><Mail className="absolute left-3 top-3 text-emerald-700" size={18}/><input required type="email" className="input pl-10" placeholder="Enter your reporting email" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([title, count, Icon]) => <div className="rounded-lg bg-white p-6" key={title}><Icon size={22} className="text-emerald-700"/><p className="mt-6 text-4xl font-bold">{query.isLoading ? '—' : count}</p><p className="mt-1 font-semibold text-slate-600">{title}</p></div>)}</div>
        <h2 className="mt-12 text-2xl font-bold">Your complaints</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{complaints.map((complaint) => <article className="rounded-lg bg-white p-6" key={complaint._id}><div className="flex justify-between gap-3"><b className="font-mono text-sm text-slate-600">#{complaint.complaintId}</b><span className="rounded-full bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">{complaint.priority} priority</span></div><h3 className="mt-5 text-xl font-semibold">{complaint.category}</h3><p className="mt-2 text-sm text-slate-600">{typeof complaint.location === 'object' ? complaint.location?.address : complaint.location}</p><p className="mt-6 text-sm font-semibold">Status: {complaint.status}</p><Link to={`/complaints/${complaint.complaintId}?email=${encodeURIComponent(email)}`} className="mt-6 block rounded-sm border border-slate-300 py-2 text-center font-semibold">View details</Link></article>)}{email && !query.isLoading && !complaints.length && <p className="text-slate-500">No complaints found for this email address.</p>}</div>
      </div>
    </main>
    <PageFooter />
  </div>
}
