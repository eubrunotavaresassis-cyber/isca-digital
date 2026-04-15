import React, { useEffect, useState } from 'react'

export default function InstallBar(){
  const [promptEvent, setPromptEvent] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    function handler(e){ e.preventDefault(); setPromptEvent(e); setVisible(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return ()=> window.removeEventListener('beforeinstallprompt', handler)
  },[])

  async function handleInstall(){
    if (!promptEvent) return
    promptEvent.prompt()
    const choice = await promptEvent.userChoice
    setVisible(false)
    setPromptEvent(null)
  }

  if (!visible) return null
  return (
    <div style={{position:'fixed',left:20,bottom:100,background:'linear-gradient(90deg,#111,#171717)',padding:12,borderRadius:10,boxShadow:'0 10px 30px rgba(0,0,0,0.6)'}}>
      <div style={{fontWeight:700}}>Instalar PLAN INVEST</div>
      <div style={{marginTop:8,display:'flex',gap:8}}>
        <button className="btn primary" onClick={handleInstall}>Instalar</button>
        <button className="btn ghost" onClick={()=>setVisible(false)}>Fechar</button>
      </div>
    </div>
  )
}
