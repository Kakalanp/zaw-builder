import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom'
import './index.css'
import 'typeface-roboto'
import strikes from './modules/strike'
import grips from './modules/grip'
import links from './modules/link'

function ZawBuilderWithParams () {
  const { strike, grip, link } = useParams()
  const normalize = s => s?.toLowerCase().replace(/[-_ ]/g, '')
  const findByName = (arr, name) => arr.find(obj => normalize(obj.name) === normalize(name)) || {}
  const initialZawParts = {
    strike: findByName(strikes, strike),
    grip: findByName(grips, grip),
    link: findByName(links, link)
  }
  const isValid = strike && grip && link && initialZawParts.strike.name && initialZawParts.grip.name && initialZawParts.link.name
  return <App initialZawParts={isValid ? initialZawParts : undefined} />
}

const router = createBrowserRouter([
  {
    path: '/zaw-builder/:strike?/:grip?/:link?',
    element: <ZawBuilderWithParams />,
    errorElement: <div>Unvalid URL!</div>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
