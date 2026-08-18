import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FileUp, LoaderCircle, Mail, MapPin, Send, Sparkles } from 'lucide-react'
import { api } from '../lib/api'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function CitizenReportPage() {
  const [form, setForm] = useState({ description: '', location: '', userName: '', userEmail: '', latitude: '', longitude: '', accuracy: '' })
  const [file, setFile] = useState(null)
  const [locationStatus, setLocationStatus] = useState(() => typeof navigator !== 'undefined' && navigator.geolocation
    ? 'Requesting your location…'
    : 'Location is not supported by this browser. You can still enter a location manually.')
  const locationRequested = useRef(false)
  const navigate = useNavigate()
  const setField = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  useEffect(() => {
    if (locationRequested.current) return
    locationRequested.current = true

    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude, accuracy } = coords
        setForm((current) => ({ ...current, latitude, longitude, accuracy }))

        try {
          await api('/save-location', {
            method: 'POST',
            body: JSON.stringify({ latitude, longitude, accuracy }),
          })
          setLocationStatus('Current coordinates captured and saved.')
        } catch (error) {
          console.error('Error saving location:', error)
          setLocationStatus('Coordinates were captured and will be included with your report.')
        }
      },
      (error) => {
        console.warn('Location access rejected or unavailable:', error.message)
        setLocationStatus('Location permission was not granted. Enter a location manually.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }, [])
  const upload = useMutation({
    mutationFn: () => {
      const payload = new FormData()
      Object.entries(form).forEach(([field, value]) => payload.append(field, value))
      if (file) payload.append('image', file)
      return api('/upload', { method: 'POST', body: payload })
    },
    onSuccess: (data) => navigate(`/complaints/${data.complaintId}?email=${encodeURIComponent(form.userEmail)}`),
  })

  return <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-[#f5fbf5] px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-950">Report an issue</h1>
        <p className="mt-2 text-slate-700">Describe the situation, add your email for notifications, and attach a photo if available.</p>
        <div className="mt-8 grid gap-7 lg:grid-cols-[1.55fr_.75fr]">
          <form onSubmit={(event) => { event.preventDefault(); upload.mutate() }} className="rounded-lg bg-white p-6 shadow-sm sm:p-10">
            <fieldset><legend className="font-bold text-slate-900">1. Description</legend><p className="mt-1 text-sm text-slate-600">Provide clear details about the problem.</p><textarea required value={form.description} onChange={setField('description')} rows="5" className="input mt-4 resize-none" placeholder="Describe the problem…" /></fieldset>
            <fieldset className="mt-8 border-t border-slate-200 pt-8"><legend className="font-bold text-slate-900">2. Email for updates</legend><p className="mt-1 text-sm text-slate-600">Required. We send status updates to this address.</p><div className="relative mt-4"><Mail className="absolute left-3 top-3 text-emerald-700" size={18}/><input required type="email" className="input pl-10" value={form.userEmail} onChange={setField('userEmail')} placeholder="you@example.com" /></div></fieldset>
            <fieldset className="mt-8 border-t border-slate-200 pt-8"><legend className="font-bold text-slate-900">3. Photographic evidence</legend><label className="mt-4 grid cursor-pointer place-items-center rounded border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-11 text-center hover:border-emerald-600"><FileUp className="text-slate-500"/><span className="mt-2 font-semibold text-slate-700">{file ? file.name : 'Choose an image'}</span><span className="mt-1 text-sm text-slate-500">JPG, PNG up to 10 MB</span><input className="sr-only" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0])}/></label></fieldset>
            <fieldset className="mt-8 border-t border-slate-200 pt-8"><legend className="font-bold text-slate-900">4. Location</legend><div className="relative mt-4"><MapPin className="absolute left-3 top-3 text-emerald-700" size={18}/><input required className="input pl-10" value={form.location} onChange={setField('location')} placeholder="Type an address or landmark…" /></div></fieldset>
            <p className="mt-2 text-sm text-slate-500" aria-live="polite">{locationStatus}</p>
            <input className="input mt-6" value={form.userName} onChange={setField('userName')} placeholder="Your name (optional)" />
            {upload.isError && <p className="mt-5 rounded bg-rose-50 p-3 text-sm text-rose-700">{upload.error.message}</p>}
            <button disabled={upload.isPending} className="mt-8 ml-auto flex items-center gap-2 rounded-sm bg-emerald-800 px-6 py-3 font-bold text-white disabled:opacity-60">{upload.isPending ? <LoaderCircle className="animate-spin"/> : <Send size={18}/>} {upload.isPending ? 'Analysing…' : 'Analyse & submit complaint'}</button>
          </form>
          <aside className="h-fit rounded-lg border border-emerald-100 bg-gradient-to-b from-white to-emerald-50 p-6"><h2 className="flex items-center gap-2 text-xl font-bold text-slate-950"><Sparkles className="text-emerald-700"/> AI analysis result</h2><p className="mt-5 text-sm leading-6 text-slate-600">The report is analysed and routed to the correct department. When an admin updates its status, an email notification is sent to the required email address.</p></aside>
        </div>
      </div>
    </main>
    <PageFooter />
  </div>
}
