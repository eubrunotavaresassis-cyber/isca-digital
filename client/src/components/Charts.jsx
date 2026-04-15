import React, { useEffect, useRef, useState } from 'react'

// Dynamically import Chart.js to avoid build/SSR issues and improve stability.
export default function Charts({spendingByCategory = [], monthlyEvolution = []}){
  const pieRef = useRef()
  const barRef = useRef()
  const [loaded, setLoaded] = useState(false)

  useEffect(()=>{
    let pie, bar
    let Chart
    let registered = false
    let mounted = true

    async function init(){
      try{
        const mod = await import('chart.js')
        Chart = mod.Chart || mod.default || mod
        const { ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } = mod
        if (Chart && !registered){
          Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)
          registered = true
        }

        if (!mounted) return

        if (pieRef.current){
          const ctx = pieRef.current.getContext('2d')
          const labels = spendingByCategory.map(s=>s.category)
          const data = spendingByCategory.map(s=>s.spent)
          const colors = ['#FF7A00','#FFA64D','#FFB874','#FF8F3B','#FF6E00']
          pie = new Chart(ctx, {
            type: 'pie',
            data: { labels, datasets: [{ data, backgroundColor: colors, hoverOffset:6 }] },
            options: { plugins:{legend:{position:'bottom',labels:{color:'#fff'}}} }
          })
        }

        if (barRef.current){
          const ctx2 = barRef.current.getContext('2d')
          const labels = monthlyEvolution.map(m=>m.month)
          const data2 = monthlyEvolution.map(m=>m.value)
          bar = new Chart(ctx2, {
            type: 'bar',
            data: { labels, datasets: [{ label:'Saldo', data: data2, backgroundColor:'#FF7A00' }] },
            options: { scales:{y:{ticks:{color:'#fff'},beginAtZero:true}, x:{ticks:{color:'#fff'}}}, plugins:{legend:{display:false}} }
          })
        }

        setLoaded(true)
      }catch(err){
        console.error('Charts load error', err)
      }
    }

    init()

    return ()=>{
      mounted = false
      try{ if (pie) pie.destroy() }catch(e){}
      try{ if (bar) bar.destroy() }catch(e){}
    }
  }, [spendingByCategory, monthlyEvolution])

  return (
    <div className="charts-grid">
      <div className="chart-card card">
        <h4 className="small">Distribuição por categoria</h4>
        <canvas ref={pieRef} width="300" height="200" />
        {!loaded && <div className="small">Carregando...</div>}
      </div>
      <div className="chart-card card">
        <h4 className="small">Evolução mensal</h4>
        <canvas ref={barRef} width="300" height="200" />
        {!loaded && <div className="small">Carregando...</div>}
      </div>
    </div>
  )
}
