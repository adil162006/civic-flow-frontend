import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'

const active = ({ isActive }) => `border-b-2 pb-1 ${isActive ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-slate-600 hover:text-emerald-700'}`

export default function SiteHeader() {
  const { admin, signOut } = useAdminAuth(); const navigate = useNavigate()
  return <header className="sticky top-0 z-30 border-b border-slate-300 bg-white/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 sm:px-8">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-800"><Sparkles size={20}/> CivicFlow AI</Link>
      <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
        <NavLink to="/report" className={active}>Report an Issue</NavLink>
        <NavLink to="/track" className={active}>Track Complaint</NavLink>
        <NavLink to="/categories" className={active}>Categories</NavLink>
        {admin && <NavLink to="/admin" className={active}>Dashboard</NavLink>}
      </nav>
      <div className="flex items-center gap-3">
        {admin ? (
          <button onClick={() => { signOut(); navigate('/') }} className="flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
            <LogOut size={15}/> Sign out
          </button>
        ) : (
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
            <ShieldCheck size={19}/> Admin
          </Link>
        )}
        <Link to="/report" className="inline-flex items-center gap-2 rounded-sm bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-900">
          <Plus size={17}/> <span className="hidden sm:inline">New Report</span>
        </Link>
      </div>
    </div>
  </header>
}
