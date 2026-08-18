import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext'
import IntroPage from './pages/IntroPage'
import CitizenReportPage from './pages/CitizenReportPage'
import TrackComplaintPage from './pages/TrackComplaintPage'
import ComplaintDetailPage from './pages/ComplaintDetailPage'
import CitizenDashboardPage from './pages/CitizenDashboardPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return <BrowserRouter><AdminAuthProvider><Routes>
    <Route path="/" element={<IntroPage/>}/>
    <Route path="/report" element={<CitizenReportPage/>}/>
    <Route path="/track" element={<TrackComplaintPage/>}/>
    <Route path="/complaints/:id" element={<ComplaintDetailPage/>}/>
    <Route path="/citizen" element={<CitizenDashboardPage/>}/>
    <Route path="/admin" element={<AdminPage/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></AdminAuthProvider></BrowserRouter>
}
