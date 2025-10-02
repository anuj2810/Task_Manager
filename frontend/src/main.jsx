import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './AppRouter.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TasksProvider } from './context/TasksContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <AppRouter />
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
