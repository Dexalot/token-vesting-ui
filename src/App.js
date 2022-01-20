import React from 'react'
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom'
import { ethers } from 'ethers'
import TokenVestingApp from './views/TokenVestingApp'

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/:address/:token" element={<Main />}/>
      <Route children={ MissingAddress } />
    </Routes>
  </Router>
)}

function Main() {
  let { address, token } = useParams();

  // TODO validate TokenVesting address
  return ethers.utils.isAddress(address)
    ? <TokenVestingApp address={ address } token={ token } />
    : <MissingAddress />
}

const MissingAddress = () => (
  <p>This is not a TokenVesting address :(</p>
)

export default App
