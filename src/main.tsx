import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import App from './app/App.tsx'
import './styles/index.scss'
import './utils/i18next'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
