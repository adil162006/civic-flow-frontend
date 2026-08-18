import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'
export default function TrackComplaintPage(){const [id,setId]=useState('');const navigate=useNavigate();return <div className="flex min-h-screen flex-col"><SiteHeader/><main className="flex flex-1 items-center justify-center bg-[#f5fbf5] px-5"><section className="w-full max-w-xl rounded-lg bg-white p-8 text-center shadow-sm"><Search className="mx-auto text-emerald-700" size={35}/><h1 className="mt-5 text-3xl font-bold">Track your complaint</h1><p className="mt-2 text-slate-600">Enter the complaint ID received after submitting your report.</p><form className="mt-7 flex gap-2" onSubmit={e=>{e.preventDefault();navigate(`/complaints/${id}`)}}><input required className="input" value={id} onChange={e=>setId(e.target.value)} placeholder="CF-2026-0001"/><button className="rounded-sm bg-emerald-800 px-5 font-bold text-white">Track</button></form></section></main><PageFooter/></div>}
