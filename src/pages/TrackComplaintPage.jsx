import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = complaintId.trim()
    if (trimmed) {
      navigate(`/complaints/${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-[#f5fbf5] px-5 py-12">
        <section className="w-full max-w-xl rounded-lg bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Search size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">Track your complaint</h1>
          <p className="mt-2 text-slate-600">Enter your complaint ID to view real-time status, department assignment, and updates.</p>
          <form className="mt-7 space-y-4 text-left" onSubmit={handleSubmit}>
            <label className="block">
              <span className="label font-semibold text-slate-800">Complaint ID</span>
              <input
                required
                className="input mt-1.5 font-mono"
                value={complaintId}
                onChange={(event) => setComplaintId(event.target.value)}
                placeholder="e.g. CF-2026-0001"
                autoFocus
              />
            </label>
            <button
              type="submit"
              className="mt-2 w-full rounded-sm bg-emerald-800 py-3.5 font-bold text-white transition hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700"
            >
              Track complaint
            </button>
          </form>
        </section>
      </main>
      <PageFooter />
    </div>
  )
}
