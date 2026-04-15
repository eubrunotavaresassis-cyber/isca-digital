import React from 'react'

export default function Loader({size=48}){
  const s = {width:size,height:size,borderRadius:12,display:'inline-block'}
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={s} className="loader" aria-hidden></div>
    </div>
  )
}
