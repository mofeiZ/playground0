!function(){"use strict";var e,t,n,r,o,i,u,c,a,f,s,l={},d={};function p(e){var t=d[e];if(void 0!==t)return t.exports;var n=d[e]={id:e,loaded:!1,exports:{}},r=!0;try{l[e].call(n.exports,n,n.exports,p),r=!1}finally{r&&delete d[e]}return n.loaded=!0,n.exports}p.m=l,e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",n="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=function(e){e&&!e.d&&(e.d=1,e.forEach(function(e){e.r--}),e.forEach(function(e){e.r--?e.r++:e()}))},p.a=function(o,i,u){u&&((c=[]).d=1);var c,a,f,s,l=new Set,d=o.exports,p=new Promise(function(e,t){s=t,f=e});p[t]=d,p[e]=function(e){c&&e(c),l.forEach(e),p.catch(function(){})},o.exports=p,i(function(o){a=o.map(function(o){if(null!==o&&"object"==typeof o){if(o[e])return o;if(o.then){var i=[];i.d=0,o.then(function(e){u[t]=e,r(i)},function(e){u[n]=e,r(i)});var u={};return u[e]=function(e){e(i)},u}}var c={};return c[e]=function(){},c[t]=o,c});var i,u=function(){return a.map(function(e){if(e[n])throw e[n];return e[t]})},f=new Promise(function(t){(i=function(){t(u)}).r=0;var n=function(e){e===c||l.has(e)||(l.add(e),e&&!e.d&&(i.r++,e.push(i)))};a.map(function(t){t[e](n)})});return i.r?f:u()},function(e){e?s(p[n]=e):f(d),r(c)}),c&&(c.d=0)},o=[],p.O=function(e,t,n,r){if(t){r=r||0;for(var i=o.length;i>0&&o[i-1][2]>r;i--)o[i]=o[i-1];o[i]=[t,n,r];return}for(var u=1/0,i=0;i<o.length;i++){for(var t=o[i][0],n=o[i][1],r=o[i][2],c=!0,a=0;a<t.length;a++)u>=r&&Object.keys(p.O).every(function(e){return p.O[e](t[a])})?t.splice(a--,1):(c=!1,r<u&&(u=r));if(c){o.splice(i--,1);var f=n();void 0!==f&&(e=f)}}return e},p.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return p.d(t,{a:t}),t},p.d=function(e,t){for(var n in t)p.o(t,n)&&!p.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},p.f={},p.e=function(e){return Promise.all(Object.keys(p.f).reduce(function(t,n){return p.f[n](e,t),t},[]))},p.u=function(e){return"static/chunks/"+e+".b1ff5d9c42c8e149.js"},p.miniCssF=function(e){return"static/css/40231bb6ec8c040a.css"},p.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),p.hmd=function(e){return(e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:function(){throw Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e},p.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i={},u="_N_E:",p.l=function(e,t,n,r){if(i[e]){i[e].push(t);return}if(void 0!==n)for(var o,c,a=document.getElementsByTagName("script"),f=0;f<a.length;f++){var s=a[f];if(s.getAttribute("src")==e||s.getAttribute("data-webpack")==u+n){o=s;break}}o||(c=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,p.nc&&o.setAttribute("nonce",p.nc),o.setAttribute("data-webpack",u+n),o.src=p.tu(e)),i[e]=[t];var l=function(t,n){o.onerror=o.onload=null,clearTimeout(d);var r=i[e];if(delete i[e],o.parentNode&&o.parentNode.removeChild(o),r&&r.forEach(function(e){return e(n)}),t)return t(n)},d=setTimeout(l.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=l.bind(null,o.onerror),o.onload=l.bind(null,o.onload),c&&document.head.appendChild(o)},p.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},p.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},p.tt=function(){return void 0===c&&(c={createScriptURL:function(e){return e}},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(c=trustedTypes.createPolicy("nextjs#bundler",c))),c},p.tu=function(e){return p.tt().createScriptURL(e)},p.v=function(e,t,n,r){var o=fetch(p.p+"static/wasm/"+(t+"").replace(/(^[.-]|[^a-zA-Z0-9_-])+/g,"_")+".wasm");return"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(o,r).then(function(t){return Object.assign(e,t.instance.exports)}):o.then(function(e){return e.arrayBuffer()}).then(function(e){return WebAssembly.instantiate(e,r)}).then(function(t){return Object.assign(e,t.instance.exports)})},p.p="/_next/",a={272:0},p.f.j=function(e,t){var n=p.o(a,e)?a[e]:void 0;if(0!==n){if(n)t.push(n[2]);else if(272!=e){var r=new Promise(function(t,r){n=a[e]=[t,r]});t.push(n[2]=r);var o=p.p+p.u(e),i=Error();p.l(o,function(t){if(p.o(a,e)&&(0!==(n=a[e])&&(a[e]=void 0),n)){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;i.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",i.name="ChunkLoadError",i.type=r,i.request=o,n[1](i)}},"chunk-"+e,e)}else a[e]=0}},p.O.j=function(e){return 0===a[e]},f=function(e,t){var n,r,o=t[0],i=t[1],u=t[2],c=0;if(o.some(function(e){return 0!==a[e]})){for(n in i)p.o(i,n)&&(p.m[n]=i[n]);if(u)var f=u(p)}for(e&&e(t);c<o.length;c++)r=o[c],p.o(a,r)&&a[r]&&a[r][0](),a[r]=0;return p.O(f)},(s=self.webpackChunk_N_E=self.webpackChunk_N_E||[]).forEach(f.bind(null,0)),s.push=f.bind(null,s.push.bind(s))}();