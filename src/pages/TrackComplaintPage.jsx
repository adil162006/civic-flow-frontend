import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Search } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(`/complaints/${encodeURIComponent(complaintId)}?email=${encodeURIComponent(email)}`)
  }

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex flex-1 items-center justify-center bg-[#f5fbf5] px-5">
      <section className="w-full max-w-xl rounded-lg bg-white p-8 text-center shadow-sm">
        <Search className="mx-auto text-emerald-700" size={35} />
        <h1 className="mt-5 text-3xl font-bold">Track your complaint</h1>
        <p className="mt-2 text-slate-600">Enter the complaint ID and email used when you reported the issue.</p>
        <form className="mt-7 space-y-3 text-left" onSubmit={handleSubmit}>
          <label><span className="label">Complaint ID</span><input required className="input" value={complaintId} onChange={(event) => setComplaintId(event.target.value)} placeholder="CF-2026-0001" /></label>
          <label><span className="label">Email address</span><div className="relative"><Mail className="absolute left-3 top-3 text-emerald-700" size={18} /><input required type="email" className="input pl-10" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div></label>
          <button className="mt-3 w-full rounded-sm bg-emerald-800 py-3 font-bold text-white">Track complaint</button>
        </form>
      </section>
    </main>
    <PageFooter />
  </div>
}
