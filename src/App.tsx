import './App.css'
import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './services/toast'

function App() {
  return <>
    <ToastProvider />
    <AppRoutes />
  </>
}

export default App
