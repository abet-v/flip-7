import { BrowserRouter, Routes, Route } from 'react-router'
import SetupPage from '@/pages/SetupPage'
import RoundPage from '@/pages/RoundPage'
import RoundSummaryPage from '@/pages/RoundSummaryPage'
import GameOverPage from '@/pages/GameOverPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="/round" element={<RoundPage />} />
        <Route path="/round-summary" element={<RoundSummaryPage />} />
        <Route path="/game-over" element={<GameOverPage />} />
      </Routes>
    </BrowserRouter>
  )
}
