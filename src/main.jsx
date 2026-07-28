import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './styles/form-pages.css'
import './styles/header.css'
import './styles/confirm-modal.css'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <App />,
)
