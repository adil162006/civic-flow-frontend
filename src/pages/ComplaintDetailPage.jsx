import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  Activity,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Flame,
  Layers,
  Loader2,
  LoaderCircle,
  MapPin,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
  Zap,
} from 'lucide-react'
import { api, imageUrl } from '../lib/api'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

const LIFECYCLE_STAGES = [
  { key: 'Submitted', label: 'Submitted', desc: 'Issue registered' },
  { key: 'AI Verified', label: 'AI Verified', desc: 'Classified & validated' },
  { key: 'Assigned', label: 'Assigned', desc: 'Routed to department' },
  { key: 'In Progress', label: 'In Progress', desc: 'Work underway' },
  { key: 'Resolved', label: 'Resolved', desc: 'Issue resolved' },
]

function getStageIndex(status = '') {
  const s = status.toLowerCase()
  if (s.includes('resolved') || s.includes('closed')) return 4
  if (s.includes('progress')) return 3
  if (s.includes('assigned')) return 2
  if (s.includes('verified') || s.includes('ai')) return 1
  return 0
}

const statusConfig = {
  submitted: {
    icon: Send,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    dotBg: 'bg-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800',
  },
  'ai verified': {
    icon: Sparkles,
    color: 'text-violet-700 bg-violet-50 border-violet-200',
    dotBg: 'bg-violet-600',
    badge: 'bg-violet-100 text-violet-800',
  },
  assigned: {
    icon: Shield,
    color: 'text-sky-700 bg-sky-50 border-sky-200',
    dotBg: 'bg-sky-600',
    badge: 'bg-sky-100 text-sky-800',
  },
  'in progress': {
    icon: Wrench,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    dotBg: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-800',
  },
  resolved: {
    icon: CheckCircle2,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    dotBg: 'bg-emerald-600',
    badge: 'bg-emerald-600 text-white',
  },
}

function getStatusStyle(status = '') {
  const key = Object.keys(statusConfig).find((k) => status.toLowerCase().includes(k))
  return statusConfig[key] || statusConfig.submitted
}

export default function ComplaintDetailPage() {
  const { id } = useParams()
  const complaint = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => api(`/complaints/${encodeURIComponent(id)}`),
    enabled: Boolean(id),
  })

  if (!id) return <Message text="Complaint ID is required to track a complaint." />
  if (complaint.isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fbff]">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="animate-spin text-emerald-700" size={36} />
          <p className="text-sm font-semibold text-slate-600">Retrieving complaint history…</p>
        </div>
      </div>
    )
  }

  if (complaint.isError) {
    return <Message text={complaint.error.message || 'Complaint not found. Please check the Complaint ID.'} />
  }

  const data = complaint.data
  const currentStageIndex = getStageIndex(data.status)
  const historyList = [...(data.history || [])].reverse()

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fbff]">
      <SiteHeader />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb & Navigation */}
          <div className="mb-4 flex items-center justify-between">
            <Link
              to="/track"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
            >
              <ArrowLeft size={16} /> Track another complaint
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-800 border border-emerald-200">
              <Activity size={13} /> Live Tracking
            </span>
          </div>

          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    Complaint <span className="font-mono text-emerald-800">#{data.complaintId}</span>
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      data.status?.toLowerCase().includes('resolved')
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : data.status?.toLowerCase().includes('progress')
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
                    </span>
                    {data.status}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={15} /> Submitted on {new Date(data.createdAt).toLocaleDateString(undefined, { dateStyle: 'full' })} at {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">
                  Category: <b className="text-slate-900 font-bold">{data.category}</b>
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">
                  Priority: <b className={`font-bold capitalize ${data.priority === 'critical' || data.priority === 'high' ? 'text-rose-600' : 'text-amber-600'}`}>{data.priority}</b>
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Resolution Progress</p>
              <div className="relative">
                {/* Connecting Track Line */}
                <div className="absolute top-5 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 sm:left-8 sm:right-8" />
                <div
                  className="absolute top-5 left-4 h-1 bg-emerald-600 -translate-y-1/2 transition-all duration-500 sm:left-8"
                  style={{
                    width: `${Math.min(100, Math.max(0, (currentStageIndex / (LIFECYCLE_STAGES.length - 1)) * 100))}%`,
                  }}
                />

                {/* Steps Icons */}
                <div className="relative z-10 grid grid-cols-5 gap-1">
                  {LIFECYCLE_STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex
                    const isCurrent = idx === currentStageIndex
                    const isUpcoming = idx > currentStageIndex

                    return (
                      <div key={stage.key} className="flex flex-col items-center text-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            isDone
                              ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                              : isCurrent
                              ? 'border-emerald-600 bg-white text-emerald-700 ring-4 ring-emerald-100 shadow-md scale-110'
                              : 'border-slate-300 bg-white text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            <Check size={18} strokeWidth={2.5} />
                          ) : isCurrent ? (
                            <span className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-75"></span>
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-600"></span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`mt-2 hidden text-xs font-bold sm:block ${
                            isCurrent ? 'text-emerald-900 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </span>
                        <span className="hidden text-[11px] text-slate-400 sm:block">{stage.desc}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid: Left Media & AI, Right Location & Resolution Timeline */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Media Card */}
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="flex items-center gap-2 font-bold text-slate-900">
                    <FileCheck2 className="text-emerald-700" size={18} /> Submitted Evidence
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">Citizen Image</span>
                </div>
                {data.imageUrl ? (
                  <div className="relative bg-slate-900">
                    <img
                      src={imageUrl(data.imageUrl)}
                      className="max-h-[420px] w-full object-contain"
                      alt="Submitted complaint"
                    />
                  </div>
                ) : (
                  <div className="grid h-64 place-items-center bg-slate-50 text-slate-400">
                    <p className="text-sm font-medium">No photo submitted with this report</p>
                  </div>
                )}
              </section>

              {/* AI Action Engine Card */}
              <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-50 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Sparkles className="text-emerald-700" size={20} /> AI Action Engine Insights
                  </h2>
                  {data.aiConfidence && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      {data.aiConfidence}% AI Confidence
                    </span>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Info label="Classified Category" value={data.category} highlight />
                  <Info label="Priority Level" value={data.priority?.toUpperCase()} />
                </div>
                <div className="mt-3">
                  <Info label="Assigned Department" value={data.department} />
                </div>
                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Summary & Reasoning</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                    {data.aiReason || data.aiSummary || data.description || 'Verified and structured by CivicFlow AI Action Engine.'}
                  </p>
                </div>
              </section>
            </div>

            {/* Right Column: Location & Enhanced Timeline */}
            <div className="space-y-6">
              {/* Location Card */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MapPin className="text-emerald-700" size={19} /> Location Details
                </h2>
                <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    {data.address || (typeof data.location === 'object' ? data.location?.address : data.location) || 'Location specified by reporter'}
                  </p>
                  {(data.latitude || (typeof data.location === 'object' && data.location?.latitude)) && (
                    <p className="mt-1 text-xs font-mono text-slate-400">
                      GPS: {Number(data.latitude || data.location?.latitude).toFixed(4)}° N, {Number(data.longitude || data.location?.longitude).toFixed(4)}° E
                    </p>
                  )}
                </div>
              </section>

              {/* Gorgeous Resolution Timeline */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                      <Activity className="text-emerald-700" size={20} /> Resolution Timeline
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">Audit trail of all actions and status updates</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {historyList.length} {historyList.length === 1 ? 'event' : 'events'}
                  </span>
                </div>

                {/* Timeline Events List */}
                <div className="relative mt-6 pl-2 sm:pl-3">
                  {/* Vertical continuous stem line */}
                  <div className="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-200 to-slate-200" />

                  <div className="space-y-6">
                    {historyList.map((entry, index) => {
                      const isLatest = index === 0
                      const style = getStatusStyle(entry.status)
                      const IconComp = style.icon

                      return (
                        <div key={index} className="relative flex items-start gap-4">
                          {/* Node Icon Avatar */}
                          <div
                            className={`relative z-10 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-xs transition-transform ${
                              isLatest
                                ? 'border-emerald-600 ring-4 ring-emerald-50 scale-105'
                                : 'border-slate-200 text-slate-500'
                            }`}
                          >
                            <IconComp
                              size={18}
                              className={isLatest ? 'text-emerald-700' : 'text-slate-600'}
                            />
                            {isLatest && (
                              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
                              </span>
                            )}
                          </div>

                          {/* Event Card Content */}
                          <div
                            className={`flex-1 rounded-xl p-4 transition-all ${
                              isLatest
                                ? 'border border-emerald-200 bg-emerald-50/40 shadow-xs'
                                : 'border border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{entry.status}</span>
                                {isLatest && (
                                  <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                                    Latest Update
                                  </span>
                                )}
                              </div>
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <Clock size={12} />
                                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <p className="mt-2 text-sm text-slate-700 leading-relaxed font-normal">
                              {entry.message}
                            </p>

                            <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <User size={13} className="text-slate-400" />
                                Action by: <b className="text-slate-700 font-semibold">{entry.updatedBy || 'System'}</b>
                              </span>
                              <span>
                                {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <PageFooter />
    </div>
  )
}

function Info({ label, value, highlight }) {
  return (
    <div className={`rounded-xl border p-3.5 ${highlight ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100 bg-slate-50'}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900 text-sm">{value || '—'}</p>
    </div>
  )
}

function Message({ text }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f8fbff] px-5 text-center">
      <div className="max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <FileCheck2 size={24} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Complaint Not Found</h2>
        <p className="mt-2 text-sm text-slate-600">{text}</p>
        <Link
          className="mt-6 inline-flex w-full justify-center rounded-lg bg-emerald-800 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-900"
          to="/track"
        >
          Return to Tracking Page
        </Link>
      </div>
    </div>
  )
}
