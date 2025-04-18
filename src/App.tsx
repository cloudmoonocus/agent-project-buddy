import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes } from 'react-router-dom'
import 'normalize.css'

const root = createRoot(
  document.getElementById('root') as HTMLElement,
)

root.render(
  <BrowserRouter>
    <Routes>
    </Routes>
  </BrowserRouter>,
)
