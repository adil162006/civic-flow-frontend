import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LoaderCircle,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { api } from '../lib/api'
import {
  computeStatsFromComplaints,
  DEPARTMENTS,
  getDepartmentBySlug,
  getDepartmentPath,
} from '../lib/departments'
import { useAdminAuth } from '../context/AdminAuthContext'
import SiteHeader from '../components/SiteHeader'
import PageFooter from '../components/PageFooter'

export default function AdminPage() {
  const { admin } = useAdminAuth()
  const { slug } = useParams()
  const activeDepartment = slug ? getDepartmentBySlug(slug) : null

  if (!admin) return <AdminLogin />
  if (slug && !activeDepartment) return <Navigate to="/admin" replace />

  return <AdminControlCenter activeDepartment={activeDepartment} />
}

function AdminLogin() {
  const { signIn } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      if (result.user.role !== 'admin') throw new Error('This account does not have admin access.')
      return result
    },
    onSuccess: signIn,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="grid flex-1 place-items-center bg-[#f5fbf5] px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm"
        >
          <ShieldCheck className="text-emerald-700" size={31} />
          <h1 className="mt-4 text-2xl font-bold">Admin portal</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage departments and civic reports.</p>
          <label className="mt-6 block">
            <span className="label">Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="mt-4 block">
            <span className="label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {mutation.isError && (
            <p className="mt-4 rounded bg-rose-50 p-3 text-sm text-rose-700">{mutation.error.message}</p>
          )}
          <button
            disabled={mutation.isPending}
            className="mt-6 w-full rounded-sm bg-emerald-800 py-3 font-bold text-white"
          >
            {mutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
      <PageFooter />
    </div>
  )
}

function AdminControlCenter({ activeDepartment }) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
  })
  const queryClient = useQueryClient()
  const departmentValue = activeDepartment?.apiValue
  const viewingLabel = activeDepartment?.label ?? 'All Departments'

  const queryParams = Object.entries(filters)
    .filter(([, value]) => value && value !== 'all')
    .reduce((params, [key, value]) => {
      params.set(key, value)
      return params
    }, new URLSearchParams())

  if (departmentValue) queryParams.set('department', departmentValue)
  const queryString = queryParams.toString()

  const globalStats = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => api('/admin/stats'),
    enabled: !activeDepartment,
  })

  const complaints = useQuery({
    queryKey: ['adminComplaints', queryString],
    queryFn: () => api(`/admin/complaints?${queryString}`),
  })

  const departmentCountQueries = useQueries({
    queries: DEPARTMENTS.map((dept) => ({
      queryKey: ['adminDeptCount', dept.apiValue],
      queryFn: () => api(`/admin/complaints?department=${encodeURIComponent(dept.apiValue)}&limit=500`),
    })),
  })

  const departmentCounts = useMemo(() => {
    const counts = {}
    DEPARTMENTS.forEach((dept, index) => {
      counts[dept.slug] = departmentCountQueries[index]?.data?.complaints?.length ?? null
    })
    return counts
  }, [departmentCountQueries])

  const allDepartmentsCount = useMemo(
    () => Object.values(departmentCounts).reduce((sum, count) => sum + (count ?? 0), 0),
    [departmentCounts],
  )

  const update = useMutation({
    mutationFn: ({ id, status }) =>
      api(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      queryClient.invalidateQueries({ queryKey: ['adminDeptCount'] })
    },
  })

  const s = activeDepartment
    ? computeStatsFromComplaints(complaints.data?.complaints ?? [])
    : globalStats.data?.stats

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-[#f5fbf5] px-5 py-8">
        <div className="mx-auto grid max-w-[1500px] gap-7 xl:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-lg bg-white">
            <h2 className="border-b border-slate-300 p-5 text-2xl font-bold">Departments</h2>
            <nav>
              <DepartmentLink
                to="/admin"
                label="All Departments"
                count={activeDepartment ? allDepartmentsCount : s?.total}
                active={!activeDepartment}
              />
              {DEPARTMENTS.map((dept) => (
                <DepartmentLink
                  key={dept.slug}
                  to={getDepartmentPath(dept.slug)}
                  label={dept.label}
                  count={departmentCounts[dept.slug]}
                  active={activeDepartment?.slug === dept.slug}
                />
              ))}
            </nav>
          </aside>

          <section>
            <h1 className="text-4xl font-bold tracking-tight">Admin control center</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded bg-emerald-700 px-2.5 py-1 text-sm font-semibold text-white">
                Viewing: {viewingLabel}
              </span>
            </div>
            <p className="mt-2 text-lg text-slate-600">
              {activeDepartment
                ? `Manage and monitor civic complaints assigned to ${activeDepartment.label}.`
                : 'Manage and monitor civic complaints across all departments.'}
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ['Total issues', s?.total, ClipboardList, 'text-slate-900'],
                ['Pending', s?.pending, Clock3, 'text-slate-900'],
                ['High priority', s?.highPriority, AlertTriangle, 'text-rose-700'],
                ['In progress', s?.inProgress, LoaderCircle, 'text-emerald-700'],
                ['Resolved', s?.resolved, CheckCircle2, 'text-slate-900'],
              ].map(([label, value, Icon, color]) => (
                <div className="rounded-lg bg-white p-5" key={label}>
                  <Icon className="text-slate-500" size={22} />
                  <p className={`mt-5 text-3xl font-bold ${color}`}>{value ?? '—'}</p>
                  <p className="mt-1 font-semibold text-slate-600">{label}</p>
                </div>
              ))}
            </div>

            <section className="mt-7 overflow-hidden rounded-lg bg-white">
              <div className="flex flex-wrap gap-3 border-b border-slate-200 p-5">
                <div className="relative min-w-48 flex-1">
                  <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    className="input pl-10"
                    placeholder="Search ID or keyword…"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                {[
                  ['category', ['all', 'Pothole', 'Garbage', 'Streetlight', 'Water Leakage', 'Drainage', 'Road Damage', 'Other']],
                  ['status', ['all', 'Submitted', 'AI Verified', 'Assigned', 'In Progress', 'Resolved']],
                  ['priority', ['all', 'critical', 'high', 'medium', 'low']],
                ].map(([key, options]) => (
                  <select
                    key={key}
                    value={filters[key]}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                    className="rounded border border-slate-300 px-3 text-sm"
                  >
                    {options.map((option) => (
                      <option key={option}>{option === 'all' ? `All ${key}` : option}</option>
                    ))}
                  </select>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="p-4">ID</th>
                      <th>Category</th>
                      <th>Location</th>
                      <th>Priority</th>
                      <th>Assigned department</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.isLoading ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center">
                          Loading complaints…
                        </td>
                      </tr>
                    ) : complaints.data?.complaints?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-10 text-center text-slate-500">
                          No complaints found for {viewingLabel}.
                        </td>
                      </tr>
                    ) : (
                      complaints.data?.complaints?.map((c) => (
                        <tr className="border-t border-slate-100" key={c._id}>
                          <td className="p-4 font-mono text-emerald-800">{c.complaintId}</td>
                          <td>{c.category}</td>
                          <td>{c.location}</td>
                          <td className="capitalize">{c.priority}</td>
                          <td>{c.department}</td>
                          <td>
                            <select
                              aria-label={`Set status for ${c.complaintId}`}
                              defaultValue={c.status}
                              onChange={(e) => update.mutate({ id: c.complaintId, status: e.target.value })}
                              className="my-3 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800"
                            >
                              <option>Submitted</option>
                              <option>AI Verified</option>
                              <option>Assigned</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </main>
      <PageFooter />
    </div>
  )
}

function DepartmentLink({ to, label, count, active }) {
  return (
    <Link
      to={to}
      className={`flex w-full justify-between px-5 py-3 text-left font-semibold ${
        active ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span>{label}</span>
      {count != null && <span>{count}</span>}
    </Link>
  )
}
