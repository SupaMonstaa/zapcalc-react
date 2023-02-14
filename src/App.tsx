import ZapCalcView from './views/ZapCalcView'
import miniFont from './assets/fonts/TinyUnicode.ttf'
import maxiFont from './assets/fonts/VCR_OSD_MONO_1.001.ttf'
import './App.css'
import { useEffect, useState } from 'react'

function App() {

  const [font1loaded, setFont1loaded] = useState(false)
  const [font2loaded, setFont2loaded] = useState(false)

  function fontLoaded(ft:FontFace, callback: (b:boolean)=> void) {
    document.fonts.add(ft);
    callback(true)
  }

  useEffect(() => {
    console.log('useEffect')
    if (!font1loaded) {
      const font1 = new FontFace("zapmini", `url(${miniFont})`)
      font1.load().then(() => fontLoaded(font1, setFont1loaded))
    }
    if (!font2loaded) {
      const font2 = new FontFace("zapmaxi", `url(${maxiFont})`)
      font2.load().then(() => fontLoaded(font2, setFont2loaded))
    }
  }, [])

  return (
    <div className="App">
      {font1loaded && font2loaded ? <ZapCalcView/> : null}
    </div>
  );
}

export default App;
