import { useEffect, useState } from 'react'
import { Routes, Route} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { ZapCalcView } from './views/ZapCalcView'
import miniFont from './assets/fonts/TinyUnicode.ttf'
import maxiFont from './assets/fonts/VCR_OSD_MONO_1.001.ttf'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'


function App() {

  console.log('v=1.4')
  const [font1loaded, setFont1loaded] = useState(false)
  const [font2loaded, setFont2loaded] = useState(false)

  function fontLoaded(ft:FontFace, callback: (b:boolean)=> void) {
    document.fonts.add(ft);
    callback(true)
  }

  useEffect( () => {
    const config = {
      onUpdate : (registration: ServiceWorkerRegistration) => {
        console.log('UPDATE !!')
        const waitingWorker = registration.waiting;
        waitingWorker?.postMessage({ type: "SKIP_WAITING" })
        toast.warn('Update available! To update, close all windows and reopen.',
          {
            toastId: "appUpdateAvailable", // Prevent duplicate toasts
            onClick: () => {
              console.log("onClick")
              window.location.reload() // Reload
            },
            autoClose: false // Prevents toast from auto closing
          }
        )
      }
    }
    serviceWorkerRegistration.register(config)
  }, [])

  useEffect(() => {
    if (!font1loaded) {
      const font1 = new FontFace("zapmini", `url(${miniFont})`)
      font1.load().then(() => fontLoaded(font1, setFont1loaded))
    }
    if (!font2loaded) {
      const font2 = new FontFace("zapmaxi", `url(${maxiFont})`)
      font2.load().then(() => fontLoaded(font2, setFont2loaded))
    }
  }, [font1loaded, font2loaded])

  return (
    <div className="App">
      <span style={{'position':'absolute',top:'5px',left:'5px'}}>1.5</span>
      {font1loaded && font2loaded && (
          <Routes>
            <Route path="*"
              element={<ZapCalcView />}/>
          </Routes>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
