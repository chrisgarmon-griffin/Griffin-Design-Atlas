import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import fs from 'node:fs';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
const {catalog}=await server.ssrLoadModule('/src/catalog.tsx');
const {TooltipProvider}=await server.ssrLoadModule('/src/registry/new-york-v4/ui/tooltip.tsx');
let errors=[],rendered=0;
for(const item of catalog){try{renderToString(React.createElement(TooltipProvider,null,React.createElement(item.Component)));rendered++;}catch(e){errors.push({id:item.id,message:e.message});}}
const sources=JSON.parse(fs.readFileSync('src/source-files.json','utf8'));
let missing=[];for(const i of catalog)for(const f of i.files)if(!(f in sources))missing.push({id:i.id,file:f});
const report={entries:catalog.length,rendered,errors,missingSourceFiles:missing};fs.writeFileSync('validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await server.close();process.exit(errors.length||missing.length?1:0);
