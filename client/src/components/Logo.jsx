import React from 'react'

export default function Logo(){
  return (
    <div style={{display:'flex',alignItems:'center',gap:12}} aria-hidden>
      <svg width="48" height="40" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plan Invest logo">
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FFA64D" />
          </linearGradient>
        </defs>
        <rect x="6" y="10" width="56" height="56" rx="8" fill="url(#g1)" />
        <g transform="translate(14,20)">
          <rect x="0" y="20" width="8" height="28" rx="2" fill="#0B0B0B" />
          <rect x="14" y="8" width="8" height="40" rx="2" fill="#0B0B0B" />
          <rect x="28" y="28" width="8" height="20" rx="2" fill="#0B0B0B" />
        </g>
        <path d="M74 58 L94 34" stroke="#00ff7a" strokeWidth="3" strokeLinecap="round" opacity="0.0" />
      </svg>
      <div style={{display:'flex',flexDirection:'column',lineHeight:0.9}}>
        <div style={{color:'#FF7A00',fontWeight:800,fontSize:16,letterSpacing:0.6}}>PLAN</div>
        <div style={{color:'#FFFFFF',fontWeight:700,fontSize:18,letterSpacing:0.6}}>INVEST</div>
      </div>
    </div>
  )
}
