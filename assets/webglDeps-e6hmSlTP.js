import{Dm as l}from"./index-ClgX_Jpc.js";import{EY as c,tR as x,Km as y,GA as g,fV as j,mj as v}from"./index-ClgX_Jpc.js";function u(n){let{options:e,value:r}=n;return typeof e[r]=="number"}function m(n){let e="";for(let r in n){let t=n[r];if(typeof t=="boolean")t&&(e+=`#define ${r}
`);else if(typeof t=="number")e+=`#define ${r} ${t.toFixed()}
`;else if(typeof t=="object")if(u(t)){let{value:o,options:f,namespace:a}=t,i=a?`${a}_`:"";for(let s in f)e+=`#define ${i}${s} ${f[s].toFixed()}
`;e+=`#define ${r} ${i}${o}
`}else{let o=t.options,f=0;for(let a in o)e+=`#define ${o[a]} ${(f++).toFixed()}
`;e+=`#define ${r} ${o[t.value]}
`}}return e}function p(n,e,r,t=""){return new l(n,t+e.vertexShader,t+e.fragmentShader,r)}export{c as BufferObject,l as DisposableProgram,x as FramebufferObject,y as ProgramCache,g as Renderbuffer,j as Texture,v as VertexArrayObject,p as createProgram,m as glslifyDefineMap};
