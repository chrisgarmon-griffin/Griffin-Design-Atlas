import React from 'react'
export default function Image({fill,priority,quality,loader,placeholder,blurDataURL,alt='',...props}:any){return <img {...props} alt={alt} style={{...props.style,...(fill?{width:'100%',height:'100%',objectFit:'cover'}:{})}} />}
