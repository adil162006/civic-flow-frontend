import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, FileUp, LoaderCircle, Mail, MapPin, RefreshCw, Send, Sparkles } from 'lucide-react'
import { api } from '../lib/api'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function CitizenReportPage() {
  const [form, setForm] = useState({ description: '', userName: '', userEmail: '' })
  const [location, setLocation] = useState({ address: '', latitude: null, longitude: null })
  const [locationState, setLocationState] = useState('initial') // 'initial' | 'detecting' | 'success' | 'permission_denied' | 'unavailable' | 'timeout' | 'error'
  const [locationErrorMsg, setLocationErrorMsg] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [manualAddressInput, setManualAddressInput] = useState('')
  const [file, setFile] = useState(null)
  
  const navigate = useNavigate()
  const setField = (field) => (event) => setForm({ ...form, [field]: event.target.value })

  const handleDetectLocation = () => {
    setValidationError('')

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationState('error')
      setLocationErrorMsg('Geolocation is not supported by your browser.')
      return
    }

    setLocationState('detecting')
    setLocationErrorMsg('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        try {
          const res = await api(`/reverse-geocode?lat=${latitude}&lon=${longitude}`)
          const address = res?.address || `Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`

          setLocation({ address, latitude, longitude })
          setLocationState('success')
          setIsEditingLocation(false)
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          const fallbackAddr = `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
          setLocation({ address: fallbackAddr, latitude, longitude })
          setLocationState('success')
          setIsEditingLocation(false)
        }
      },
      (error) => {
        setLocation({ address: '', latitude: null, longitude: null })
        if (error.code === 1) { // PERMISSION_DENIED
          setLocationState('permission_denied')
        } else if (error.code === 2) { // POSITION_UNAVAILABLE
          setLocationState('unavailable')
        } else if (error.code === 3) { // TIMEOUT
          setLocationState('timeout')
        } else {
          setLocationState('error')
          setLocationErrorMsg(error.message || 'Unable to determine location.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const handleOpenChangeLocation = () => {
    setManualAddressInput(location.address || '')
    setIsEditingLocation(true)
  }

  const handleSaveManualLocation = () => {
    const trimmed = manualAddressInput.trim()
    if (!trimmed) {
      setValidationError('Please enter a valid address in the textbox.')
      return
    }
    setValidationError('')
    setLocation((prev) => ({
      address: trimmed,
      latitude: prev.latitude || 19.0760,
      longitude: prev.longitude || 72.8777,
    }))
    setLocationState('success')
    setIsEditingLocation(false)
  }

  const upload = useMutation({
    mutationFn: () => {
      const payload = new FormData()
      payload.append('description', form.description)
      payload.append('userEmail', form.userEmail)
      payload.append('userName', form.userName)
      payload.append('location', JSON.stringify({
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      }))
      payload.append('address', location.address)
      payload.append('latitude', location.latitude)
      payload.append('longitude', location.longitude)
      if (file) payload.append('image', file)

      return api('/upload', { method: 'POST', body: payload })
    },
    onSuccess: (data) => navigate(`/complaints/${data.complaintId}?email=${encodeURIComponent(form.userEmail)}`),
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    setValidationError('')

    if (locationState !== 'success' || !location.latitude || !location.longitude || !location.address) {
      setValidationError('Please detect your current location before submitting the complaint.')
      return
    }

    upload.mutate()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-[#f5fbf5] px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-slate-950">Report an issue</h1>
          <p className="mt-2 text-slate-700">Describe the situation, add your email for notifications, and attach a photo if available.</p>
          <div className="mt-8 grid gap-7 lg:grid-cols-[1.55fr_.75fr]">
            <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm sm:p-10">
              <fieldset>
                <legend className="font-bold text-slate-900">1. Description</legend>
                <p className="mt-1 text-sm text-slate-600">Provide clear details about the problem.</p>
                <textarea required value={form.description} onChange={setField('description')} rows="5" className="input mt-4 resize-none" placeholder="Describe the problem…" />
              </fieldset>

              <fieldset className="mt-8 border-t border-slate-200 pt-8">
                <legend className="font-bold text-slate-900">2. Email for updates</legend>
                <p className="mt-1 text-sm text-slate-600">Required. We send status updates to this address.</p>
                <div className="relative mt-4">
                  <Mail className="absolute left-3 top-3 text-emerald-700" size={18}/>
                  <input required type="email" className="input pl-10" value={form.userEmail} onChange={setField('userEmail')} placeholder="you@example.com" />
                </div>
              </fieldset>

              <fieldset className="mt-8 border-t border-slate-200 pt-8">
                <legend className="font-bold text-slate-900">3. Photographic evidence</legend>
                <label className="mt-4 grid cursor-pointer place-items-center rounded border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-11 text-center hover:border-emerald-600">
                  <FileUp className="text-slate-500"/>
                  <span className="mt-2 font-semibold text-slate-700">{file ? file.name : 'Choose an image'}</span>
                  <span className="mt-1 text-sm text-slate-500">JPG, PNG up to 10 MB</span>
                  <input className="sr-only" type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0])}/>
                </label>
              </fieldset>

              <fieldset className="mt-8 border-t border-slate-200 pt-8">
                <legend className="font-bold text-slate-900">4. Location</legend>
                <div className="mt-4">
                  {isEditingLocation ? (
                    <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-900">
                        Enter Desired Location Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-emerald-700" size={18} />
                        <input
                          type="text"
                          className="input pl-10"
                          value={manualAddressInput}
                          onChange={(e) => setManualAddressInput(e.target.value)}
                          placeholder="Type desired address or landmark…"
                          autoFocus
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleSaveManualLocation}
                          className="rounded-md bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                        >
                          Set Location
                        </button>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <RefreshCw size={13} />
                          Detect GPS again
                        </button>
                        {location.address && (
                          <button
                            type="button"
                            onClick={() => setIsEditingLocation(false)}
                            className="px-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      {locationState === 'initial' && (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={handleDetectLocation}
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                          >
                            <MapPin size={18} />
                            Use My Current Location
                          </button>
                          <p className="text-sm text-slate-500">Location not detected</p>
                        </div>
                      )}

                      {locationState === 'detecting' && (
                        <div className="space-y-2">
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-700/70 px-4 py-2.5 text-sm font-semibold text-white cursor-not-allowed"
                          >
                            <LoaderCircle size={18} className="animate-spin" />
                            ⏳ Detecting your location...
                          </button>
                        </div>
                      )}

                      {locationState === 'success' && (
                        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                          <div className="flex items-center gap-2 font-semibold text-emerald-800">
                            <CheckCircle2 size={18} />
                            Location detected
                          </div>
                          <p className="text-sm font-medium text-slate-900 flex items-start gap-1.5">
                            <MapPin size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                            <span>{location.address}</span>
                          </p>
                          <div>
                            <button
                              type="button"
                              onClick={handleOpenChangeLocation}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                            >
                              <RefreshCw size={13} />
                              Change Location
                            </button>
                          </div>
                        </div>
                      )}

                      {locationState === 'permission_denied' && (
                        <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-4">
                          <p className="text-sm text-rose-800">
                            Location permission was denied.<br />
                            Please allow location access in your browser and try again.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-800"
                            >
                              Try Again
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenChangeLocation}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                            >
                              Enter Location Manually
                            </button>
                          </div>
                        </div>
                      )}

                      {locationState === 'unavailable' && (
                        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm text-amber-800">
                            Unable to determine your current location.<br />
                            Please try again.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-800"
                            >
                              Try Again
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenChangeLocation}
                              className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                            >
                              Enter Location Manually
                            </button>
                          </div>
                        </div>
                      )}

                      {locationState === 'timeout' && (
                        <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm text-amber-800">
                            Location request timed out.<br />
                            Please try again.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-800"
                            >
                              Try Again
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenChangeLocation}
                              className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                            >
                              Enter Location Manually
                            </button>
                          </div>
                        </div>
                      )}

                      {locationState === 'error' && (
                        <div className="space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-4">
                          <p className="text-sm text-rose-800">
                            {locationErrorMsg || 'Unable to determine location. Please try again.'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              className="inline-flex items-center gap-2 rounded-md bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-800"
                            >
                              Try Again
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenChangeLocation}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                            >
                              Enter Location Manually
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </fieldset>

              {validationError && (
                <div className="mt-4 rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700 border border-rose-200">
                  {validationError}
                </div>
              )}

              <input className="input mt-6" value={form.userName} onChange={setField('userName')} placeholder="Your name (optional)" />
              {upload.isError && <p className="mt-5 rounded bg-rose-50 p-3 text-sm text-rose-700">{upload.error.message}</p>}
              <button disabled={upload.isPending} className="mt-8 ml-auto flex items-center gap-2 rounded-sm bg-emerald-800 px-6 py-3 font-bold text-white disabled:opacity-60">
                {upload.isPending ? <LoaderCircle className="animate-spin"/> : <Send size={18}/>}
                {upload.isPending ? 'Analysing…' : 'Analyse & submit complaint'}
              </button>
            </form>
            <aside className="h-fit rounded-lg border border-emerald-100 bg-gradient-to-b from-white to-emerald-50 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
                <Sparkles className="text-emerald-700"/> AI analysis result
              </h2>
              <p className="mt-5 text-sm leading-6 text-slate-600">
                The report is analysed and routed to the correct department. When an admin updates its status, an email notification is sent to the required email address.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  )
}

