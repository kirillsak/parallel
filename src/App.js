import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import { SubstrateContextProvider } from './substrate-lib'
import { UserProvider } from './components/UserContext'
import CommunityProfile from './pages/CommunityProfile'

export default function App() {
  return (
    <UserProvider>
      <SubstrateContextProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/community/:communityId" element={<CommunityProfile />} />
          </Routes>
        </div>
      </SubstrateContextProvider >
    </UserProvider >
  )
}
