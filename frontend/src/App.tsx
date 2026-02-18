import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage /> }/>

        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App


