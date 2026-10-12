import React from 'react'
export default function Link({href,children,prefetch,replace,scroll,...props}:any){return <a {...props} href={typeof href==='string'?href:'#'} onClick={e=>{e.preventDefault();props.onClick?.(e)}}>{children}</a>}
