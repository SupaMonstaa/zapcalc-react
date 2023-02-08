import ZapCalcView from './views/ZapCalcView'
import miniFont from './assets/fonts/TinyUnicode.ttf'
import maxiFont from './assets/fonts/VCR_OSD_MONO_1.001.ttf'
import './App.css'
import { useEffect, useState } from 'react'

function App() {

  const [loadingFontCount, setLoadingFontCount] = useState(2)

  useEffect(() => {
    const font1 = new FontFace("zapmini", `url(${miniFont})`)
    const font2 = new FontFace("zapmaxi", `url(${maxiFont})`)
    // don't wait for the render tree, initiate an immediate fetch!
    font1.load().then(() => fontLoaded(font1))
    font2.load().then(() => fontLoaded(font2))

    function fontLoaded(ft:FontFace) {
      document.fonts.add(ft);
      setTimeout(() => setLoadingFontCount(prev => prev-1), 100)
    }
  }, [])

  return (
    <div className="App" style={loadingFontCount === 0 ? {display:"none"} : {display:"block"}}>
      <p>{loadingFontCount}</p>
      <ZapCalcView></ZapCalcView>
    </div>
  );
}

export default App;
