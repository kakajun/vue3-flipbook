import{d as Bt,b as m,r as Et,e as f,o as qt,f as Wt,w as U,g as le,j as re,k as Zt,n as Ut,l as Vt,u as D,m as B,p as C,q as Ge,F as Gt,s as Jt,t as Je,v as Qt,x as Kt}from"./vue.esm-bundler-B6_80MU5.js";/*! @license Rematrix v0.7.2

	Copyright 2021 Julian Lloyd.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/function Fe(l){if(l&&l.constructor===Array){var e=l.filter(function(s){return typeof s=="number"}).filter(function(s){return!isNaN(s)});if(l.length===6&&e.length===6){var o=V();return o[0]=e[0],o[1]=e[1],o[4]=e[2],o[5]=e[3],o[12]=e[4],o[13]=e[5],o}else if(l.length===16&&e.length===16)return l}throw new TypeError("Expected a `number[]` with length 6 or 16.")}function V(){for(var l=[],e=0;e<16;e++)e%5==0?l.push(1):l.push(0);return l}function ea(l,e){for(var o=Fe(l),s=Fe(e),a=[],u=0;u<4;u++)for(var g=[o[u],o[u+4],o[u+8],o[u+12]],v=0;v<4;v++){var n=v*4,w=[s[n],s[n+1],s[n+2],s[n+3]],x=g[0]*w[0]+g[1]*w[1]+g[2]*w[2]+g[3]*w[3];a[u+n]=x}return a}function ta(l){var e=V();return e[11]=-1/l,e}function aa(l){var e=Math.PI/180*l,o=V();return o[0]=o[10]=Math.cos(e),o[2]=o[8]=Math.sin(e),o[2]*=-1,o}function oa(l){return"matrix3d("+Fe(l).join(", ")+")"}function la(l,e){var o=V();return o[12]=l,e&&(o[13]=e),o}function ra(l,e,o){var s=V();return l!==void 0&&e!==void 0&&o!==void 0&&(s[12]=l,s[13]=e,s[14]=o),s}class Se{constructor(e){e?this.m=[...e]:this.m=V()}clone(){return new Se(this.m)}multiply(e){this.m=ea(this.m,e)}perspective(e){this.multiply(ta(e))}transformX(e){return(e*this.m[0]+this.m[12])/(e*this.m[3]+this.m[15])}translate(e,o){this.multiply(la(e,o))}translate3d(e,o,s){this.multiply(ra(e,o,s))}rotateY(e){this.multiply(aa(e))}toString(){return oa(this.m)}}const sa=(l,e,o)=>{let s=0;return l>.5&&(s=-(l-.5)*2*180),e==="left"&&(s=-s),o==="back"&&(s+=180),s},et=l=>Math.pow(l,2),ua=l=>1-et(1-l),tt=l=>l<.5?et(l*2)/2:.5+ua((l-.5)*2)/2;function na(l,e,o,s){const a=m(1);let u=0;const g=m(!1),v=m(0),n=m(0),w=h=>{M.value&&(u+=1,l.zooms&&$(l.zooms[u],h))},x=h=>{L.value&&(u-=1,l.zooms&&$(l.zooms[u],h))},$=(h,R)=>{const P=o==null?void 0:o.value;if(P){let N,k;if(R){const q=P.getBoundingClientRect();N=R.pageX-q.left,k=R.pageY-q.top}else N=P.clientWidth/2,k=P.clientHeight/2;const c=a.value,S=h,E=P.scrollLeft,W=P.scrollTop,se=N+E,G=k+W,_=se/c*S-N,J=G/c*S-k,ue=Date.now();g.value=!0,e("zoom-start",h);const Q=()=>{requestAnimationFrame(()=>{const q=Date.now()-ue;let j=q/l.zoomDuration;j=j>1?1:j,j=tt(j),a.value=c+(S-c)*j,v.value=E+(_-E)*j,n.value=W+(J-W)*j,q<l.zoomDuration?Q():(e("zoom-end",h),g.value=!1,a.value=h,v.value=_,n.value=J)})};Q(),S>1&&s(!0)}},y=h=>{u=(u+1)%l.zooms.length,$(l.zooms[u],h)},M=f(()=>!g.value&&u<l.zooms.length-1),L=f(()=>!g.value&&u>0);return{zoom:a,zooming:g,canZoomIn:M,canZoomOut:L,zoomIn:w,zoomOut:x,zoomAt:y,onWheel:(h,R)=>{l.wheel==="scroll"&&a.value>1&&!R&&o.value&&(v.value=o.value.scrollLeft+h.deltaX,n.value=o.value.scrollTop+h.deltaY,h.cancelable&&h.preventDefault()),l.wheel==="zoom"&&(h.deltaY>=100?(x(h),h.preventDefault()):h.deltaY<=-100&&(w(h),h.preventDefault()))},scrollLeft:v,scrollTop:n}}function ia(l,e,o,s){const a=m({}),u=m(0),g=m(0),v=m(null),n=m(null),w=m(null),x=(y,M=!1)=>{var L,h;return M&&o.value>1&&!s.value?(y<l.pagesHiRes.length?(L=l.pagesHiRes)==null?void 0:L[y]:"")||"":(y<l.pages.length?(h=l.pages)==null?void 0:h[y]:"")||""},$=y=>{if(n.value===null||a.value[y])return y;{const M=new Image;return M.onload=()=>{a.value[y]=!0},M.src=y,l.loadingImage||""}};return{imageWidth:n,imageHeight:w,pageUrl:x,loadImage:$,pageUrlLoading:(y,M=!1)=>{const L=x(y,M);return M&&o.value>1&&!s.value?L:L&&$(L)},onImageLoad:(y,M)=>{u.value=0,g.value=y,v.value=M},didLoadImage:y=>{n.value===null&&(n.value=(y.target||y.path[0]).naturalWidth,w.value=(y.target||y.path[0]).naturalHeight,e()),v.value&&++u.value>=g.value&&(v.value(),v.value=null)}}}const F={silent:Number.NEGATIVE_INFINITY,fatal:0,error:0,warn:1,log:2,info:3,success:3,fail:3,ready:3,start:3,box:3,debug:4,trace:5,verbose:Number.POSITIVE_INFINITY},Qe={silent:{level:-1},fatal:{level:F.fatal},error:{level:F.error},warn:{level:F.warn},log:{level:F.log},info:{level:F.info},success:{level:F.success},fail:{level:F.fail},ready:{level:F.info},start:{level:F.info},box:{level:F.info},debug:{level:F.debug},trace:{level:F.trace},verbose:{level:F.verbose}};function Te(l){return l!==null&&typeof l=="object"}function $e(l,e,o=".",s){if(!Te(e))return $e(l,{},o,s);const a=Object.assign({},e);for(const u in l){if(u==="__proto__"||u==="constructor")continue;const g=l[u];g!=null&&(s&&s(a,u,g,o)||(Array.isArray(g)&&Array.isArray(a[u])?a[u]=[...g,...a[u]]:Te(g)&&Te(a[u])?a[u]=$e(g,a[u],(o?`${o}.`:"")+u.toString(),s):a[u]=g))}return a}function va(l){return(...e)=>e.reduce((o,s)=>$e(o,s,"",l),{})}const ca=va();function pa(l){return Object.prototype.toString.call(l)==="[object Object]"}function ga(l){return!(!pa(l)||!l.message&&!l.args||l.stack)}let Pe=!1;const Ke=[];class I{constructor(e={}){const o=e.types||Qe;this.options=ca({...e,defaults:{...e.defaults},level:De(e.level,o),reporters:[...e.reporters||[]]},{types:Qe,throttle:1e3,throttleMin:5,formatOptions:{date:!0,colors:!1,compact:!0}});for(const s in o){const a={type:s,...this.options.defaults,...o[s]};this[s]=this._wrapLogFn(a),this[s].raw=this._wrapLogFn(a,!0)}this.options.mockFn&&this.mockTypes(),this._lastLog={}}get level(){return this.options.level}set level(e){this.options.level=De(e,this.options.types,this.options.level)}prompt(e,o){if(!this.options.prompt)throw new Error("prompt is not supported!");return this.options.prompt(e,o)}create(e){const o=new I({...this.options,...e});return this._mockFn&&o.mockTypes(this._mockFn),o}withDefaults(e){return this.create({...this.options,defaults:{...this.options.defaults,...e}})}withTag(e){return this.withDefaults({tag:this.options.defaults.tag?this.options.defaults.tag+":"+e:e})}addReporter(e){return this.options.reporters.push(e),this}removeReporter(e){if(e){const o=this.options.reporters.indexOf(e);if(o>=0)return this.options.reporters.splice(o,1)}else this.options.reporters.splice(0);return this}setReporters(e){return this.options.reporters=Array.isArray(e)?e:[e],this}wrapAll(){this.wrapConsole(),this.wrapStd()}restoreAll(){this.restoreConsole(),this.restoreStd()}wrapConsole(){for(const e in this.options.types)console["__"+e]||(console["__"+e]=console[e]),console[e]=this[e].raw}restoreConsole(){for(const e in this.options.types)console["__"+e]&&(console[e]=console["__"+e],delete console["__"+e])}wrapStd(){this._wrapStream(this.options.stdout,"log"),this._wrapStream(this.options.stderr,"log")}_wrapStream(e,o){e&&(e.__write||(e.__write=e.write),e.write=s=>{this[o].raw(String(s).trim())})}restoreStd(){this._restoreStream(this.options.stdout),this._restoreStream(this.options.stderr)}_restoreStream(e){e&&e.__write&&(e.write=e.__write,delete e.__write)}pauseLogs(){Pe=!0}resumeLogs(){Pe=!1;const e=Ke.splice(0);for(const o of e)o[0]._logFn(o[1],o[2])}mockTypes(e){const o=e||this.options.mockFn;if(this._mockFn=o,typeof o=="function")for(const s in this.options.types)this[s]=o(s,this.options.types[s])||this[s],this[s].raw=this[s]}_wrapLogFn(e,o){return(...s)=>{if(Pe){Ke.push([this,e,s,o]);return}return this._logFn(e,s,o)}}_logFn(e,o,s){if((e.level||0)>this.level)return!1;const a={date:new Date,args:[],...e,level:De(e.level,this.options.types)};!s&&o.length===1&&ga(o[0])?Object.assign(a,o[0]):a.args=[...o],a.message&&(a.args.unshift(a.message),delete a.message),a.additional&&(Array.isArray(a.additional)||(a.additional=a.additional.split(`
`)),a.args.push(`
`+a.additional.join(`
`)),delete a.additional),a.type=typeof a.type=="string"?a.type.toLowerCase():"log",a.tag=typeof a.tag=="string"?a.tag:"";const u=(v=!1)=>{const n=(this._lastLog.count||0)-this.options.throttleMin;if(this._lastLog.object&&n>0){const w=[...this._lastLog.object.args];n>1&&w.push(`(repeated ${n} times)`),this._log({...this._lastLog.object,args:w}),this._lastLog.count=1}v&&(this._lastLog.object=a,this._log(a))};clearTimeout(this._lastLog.timeout);const g=this._lastLog.time&&a.date?a.date.getTime()-this._lastLog.time.getTime():0;if(this._lastLog.time=a.date,g<this.options.throttle)try{const v=JSON.stringify([a.type,a.tag,a.args]),n=this._lastLog.serialized===v;if(this._lastLog.serialized=v,n&&(this._lastLog.count=(this._lastLog.count||0)+1,this._lastLog.count>this.options.throttleMin)){this._lastLog.timeout=setTimeout(u,this.options.throttle);return}}catch{}u(!0)}_log(e){for(const o of this.options.reporters)o.log(e,{options:this.options})}}function De(l,e={},o=3){return l===void 0?o:typeof l=="number"?l:e[l]&&e[l].level!==void 0?e[l].level:o}I.prototype.add=I.prototype.addReporter;I.prototype.remove=I.prototype.removeReporter;I.prototype.clear=I.prototype.removeReporter;I.prototype.withScope=I.prototype.withTag;I.prototype.mock=I.prototype.mockTypes;I.prototype.pause=I.prototype.pauseLogs;I.prototype.resume=I.prototype.resumeLogs;function ha(l={}){return new I(l)}class fa{constructor(e){this.options={...e},this.defaultColor="#7f8c8d",this.levelColorMap={0:"#c0392b",1:"#f39c12",3:"#00BCD4"},this.typeColorMap={success:"#2ecc71"}}_getLogFn(e){return e<1?console.__error||console.error:e===1?console.__warn||console.warn:console.__log||console.log}log(e){const o=this._getLogFn(e.level),s=e.type==="log"?"":e.type,a=e.tag||"",u=`
      background: ${this.typeColorMap[e.type]||this.levelColorMap[e.level]||this.defaultColor};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `,g=`%c${[a,s].filter(Boolean).join(":")}`;typeof e.args[0]=="string"?o(`${g}%c ${e.args[0]}`,u,"",...e.args.slice(1)):o(g,u,...e.args)}}function at(l={}){return ha({reporters:l.reporters||[new fa({})],prompt(e,o={}){return o.type==="confirm"?Promise.resolve(confirm(e)):Promise.resolve(prompt(e))},...l})}at();const ma={pages:{type:Array,required:!0},pagesHiRes:{type:Array,default:()=>[]},flipDuration:{type:Number,default:1e3},zoomDuration:{type:Number,default:500},zooms:{type:Array,default:()=>[1,2,4]},perspective:{type:Number,default:2400},nPolygons:{type:Number,default:10},ambient:{type:Number,default:.4},gloss:{type:Number,default:.6},swipeMin:{type:Number,default:3},singlePage:{type:Boolean,default:!1},forwardDirection:{validator:l=>l==="right"||l==="left",default:"right"},centering:{type:Boolean,default:!0},startPage:{type:Number,default:null},loadingImage:{type:String,default:"spinner"},clickToZoom:{type:Boolean,default:!0},dragToFlip:{type:Boolean,default:!0},wheel:{type:String,default:"scroll"}},da={class:"vue3-flipbook"},ya=["src"],ba=["src"],_a=Bt({__name:"Flipbook",props:ma,emits:["flip-left-start","flip-left-end","flip-right-start","flip-right-end","zoom-start","zoom-end"],setup(l,{emit:e}){const o=at({level:-1});o.info("This will not be logged");const s=e,a=l,u=m(0),g=m(0),v=m(1),n=m(0),w=m(0),x=m(1),$=m(null),y=m(null),M=m(0),L=m(null),h=m(!1),R=m(!1),P=m(1/0),N=m(-1/0),k=m(null),c=Et({progress:0,direction:"right",frontImage:"",backImage:"",auto:!1,opacity:1}),S=m(0),E=m(!1),W=m(0),se=m(0),G=(t=!1)=>{for(let r=n.value-3;r<=n.value+3;r++)de(r,!1);if(t)for(let r=n.value;r<n.value+v.value;r++){const i=a.pagesHiRes[r];i&&typeof i=="string"&&(new Image().src=i)}},{zoom:_,zooming:J,canZoomIn:ue,canZoomOut:Q,zoomIn:q,zoomOut:j,zoomAt:ot,onWheel:lt,scrollLeft:Ae,scrollTop:Ne}=na(a,s,k,G),{imageWidth:K,imageHeight:ne,pageUrl:A,loadImage:rt,pageUrlLoading:de,didLoadImage:ie}=ia(a,G,_,J),st=f(()=>({zoom:J.value||_.value>1,"drag-to-scroll":!h.value})),ut=f(()=>({cursor:je.value=="grabbing"?"grabbing":"auto"})),ve=f(()=>a.forwardDirection==="left"?Ce.value:Re.value),ce=f(()=>a.forwardDirection==="right"?Ce.value:Re.value),nt=f(()=>a.pages[0]===null?a.pages.length-1:a.pages.length),Z=f(()=>a.pages[0]!==null?n.value+1:Math.max(1,n.value)),Ce=f(()=>n.value<a.pages.length-v.value),Re=f(()=>n.value>=v.value&&!(v.value===1&&!A(w.value-1))),ye=f(()=>a.forwardDirection==="right"||v.value===1?w.value:x.value),be=f(()=>a.forwardDirection==="right"||v.value===1?x.value:w.value),it=f(()=>A(ye.value)),vt=f(()=>A(be.value)&&v.value===2),je=f(()=>L.value?L.value:a.clickToZoom&&ue.value?"zoom-in":a.clickToZoom&&Q.value?"zoom-out":a.dragToFlip?"grab":"auto"),O=f(()=>(u.value-T.value*v.value)/2),Y=f(()=>(g.value-X.value)/2),ct=f(()=>{let t=T.value/a.nPolygons;return t=Math.ceil(t+1/_.value),t+"px"}),pt=f(()=>X.value+"px"),gt=f(()=>`${T.value}px ${X.value}px`),ht=f(()=>Be("front").concat(Be("back"))),H=f(()=>{if(v.value===1)return O.value;{let t;return A(ye.value)?t=O.value:t=u.value/2,t<P.value?t:P.value}}),ee=f(()=>{if(v.value===1)return u.value-O.value;{let t=A(be.value)?u.value-O.value:u.value/2;return t>N.value?t:N.value}}),pe=f(()=>{let t=a.centering?Math.round(u.value/2-(H.value+ee.value)/2):0;return S.value===0&&K.value!==null&&(S.value=t),t}),te=f(()=>Math.round(S.value)),ft=f(()=>{let t=(ee.value-H.value)*_.value;return t<u.value?(H.value+(te.value??0))*_.value-(u.value-t)/2:(H.value+(te.value??0))*_.value}),mt=f(()=>{let t=(ee.value-H.value)*_.value;return t<u.value?(H.value+(te.value??0))*_.value-(u.value-t)/2:(ee.value+(te.value??0))*_.value-u.value}),dt=f(()=>{let t=X.value*_.value;return t<g.value?Y.value*_.value-(g.value-t)/2:Y.value*_.value}),yt=f(()=>{let t=X.value*_.value;return t<g.value?Y.value*_.value-(g.value-t)/2:(Y.value+X.value)*_.value-g.value});qt(()=>{we(),window.addEventListener("resize",we,{passive:!0}),_.value=a.zooms[0],Ze(a.startPage)}),Wt(()=>{window.removeEventListener("resize",we)});const Oe=f(()=>{const t=u.value/v.value,r=K.value?t/K.value:1,i=ne.value?g.value/ne.value:1,p=r<i?r:i;return p<1?p:1}),T=f(()=>K.value?Math.round(K.value*Oe.value):1),X=f(()=>ne.value?Math.round(ne.value*Oe.value):1),we=()=>{const t=k.value;t&&(u.value=t.clientWidth,g.value=t.clientHeight,v.value=u.value>g.value&&!a.singlePage?2:1,v.value===2&&(n.value&=-2),Xe(),P.value=1/0,N.value=-1/0)},Xe=()=>{v.value===1&&n.value===0&&a.pages.length&&!A(0)&&n.value++},Ye=()=>{ve.value&&_e("left",!0)},He=()=>{ce.value&&_e("right",!0)},bt=(t,r)=>{let i=O.value,p=!1;return v.value===1?a.forwardDirection==="right"?t==="back"&&(p=!0,i=O.value-T.value):r==="left"?t==="back"?i=T.value-O.value:p=!0:t==="front"?i=T.value-O.value:p=!0:r==="left"?t==="back"?i=u.value/2:p=!0:t==="front"?i=u.value/2:p=!0,{pageX:i,originRight:p}},wt=(t,r,i)=>{const p=new Se;return p.translate(u.value/2),p.perspective(a.perspective),p.translate(-u.value/2),p.translate(t,Y.value),i&&(r&&p.translate(T.value),p.rotateY(i),r&&p.translate(-T.value)),p},_t=t=>{let r;t<.5?r=t*2*Math.PI:r=(1-(t-.5)*2)*Math.PI,r==0&&(r=1e-9);const i=T.value/r;return{theta:r,radius:i}},Mt=(t,r,i,p)=>{let b=Math.sin(t)*r;i&&(b=T.value-b);let d=(1-Math.cos(t))*r;return p==="back"&&(d=-d),{x:b,z:d}},Be=t=>{let r=c.progress,i=c.direction;v.value===1&&i!==a.forwardDirection&&(r=1-r,i=a.forwardDirection),c.opacity=v.value===1&&r>.7?1-(r-.7)/.3:1;let p=t==="front"?c.frontImage:c.backImage;const b=T.value/a.nPolygons,{pageX:d,originRight:z}=bt(t,i),ge=sa(r,i,t),Nt=wt(d,z,ge),{theta:ke,radius:Ct}=_t(r);let ze=0,he=ke/a.nPolygons,ae=z?-ke/Math.PI*180+he/2/Math.PI*180:he/2/Math.PI*180,fe=he/Math.PI*180;t==="back"&&(ae=-ae,fe=-fe),P.value=1/0,N.value=-1/0;const Ue=[],xe=[];for(let me=0;me<a.nPolygons;me++){const Rt=`${me/(a.nPolygons-1)*100}% 0px`,oe=Nt.clone(),jt=z?ke-ze:ze,{x:Ot,z:Ve}=Mt(jt,Ct,z,t);oe.translate3d(Ot,0,Ve),oe.rotateY(-ae);const Xt=oe.transformX(0),Yt=oe.transformX(b);xe.push(Xt,Yt);const Ht=It(ge-ae,fe)||"";ze+=he,ae+=fe,Ue.push([`${t}${me}`,p,Ht,Rt,oe.toString(),Math.abs(Math.round(Ve))])}return N.value=Math.max(...xe),P.value=Math.min(...xe),Ue},It=(t,r)=>{const i=[],p=[-.5,-.25,0,.25,.5];if(a.ambient<1){const b=1-a.ambient,d=p.map(z=>(1-Math.cos((t-r*z)/180*Math.PI))*b);i.push(`linear-gradient(to right, rgba(0, 0, 0, ${d[0]}), rgba(0, 0, 0, ${d[1]}) 25%, rgba(0, 0, 0, ${d[2]}) 50%, rgba(0, 0, 0, ${d[3]}) 75%, rgba(0, 0, 0, ${d[4]}))`)}if(a.gloss>0){const b=p.map(d=>Math.max(Math.cos((t+30-r*d)/180*Math.PI)**200,Math.cos((t-30-r*d)/180*Math.PI)**200));i.push(`linear-gradient(to right, rgba(255, 255, 255, ${b[0]*a.gloss}), rgba(255, 255, 255, ${b[1]*a.gloss}) 25%, rgba(255, 255, 255, ${b[2]*a.gloss}) 50%, rgba(255, 255, 255, ${b[3]*a.gloss}) 75%, rgba(255, 255, 255, ${b[4]*a.gloss}))`)}return i.join(",")},_e=(t,r)=>{if(t!==a.forwardDirection)if(v.value===1){const i=A(n.value-1);i?c.frontImage=i:o.error("flipStart error: url is null"),c.backImage=""}else c.frontImage=A(w.value),c.backImage=A(n.value-v.value+1);else v.value===1?(c.frontImage=A(n.value),c.backImage=""):(c.frontImage=A(x.value),c.backImage=A(n.value+v.value));c.direction=t,c.progress=0,requestAnimationFrame(()=>{requestAnimationFrame(()=>{c.direction!==a.forwardDirection?v.value===2&&(w.value=n.value-v.value):v.value===1?w.value=n.value+v.value:x.value=n.value+1+v.value,r&&Ee(!0)})})},Ee=t=>{const r=Date.now(),i=a.flipDuration*(1-c.progress),p=c.progress;c.auto=!0,c.direction==="left"?s("flip-left-start",Z.value):s("flip-right-start",Z.value);const b=()=>{const d=Date.now()-r;let z=p+d/i;z=z>1?1:z,c.progress=t?tt(z):z,z<1?requestAnimationFrame(b):(c.direction!==a.forwardDirection?n.value-=v.value:n.value+=v.value,c.direction==="left"?s("flip-left-end",Z.value):s("flip-right-end",Z.value),c.auto=!1)};b()},Lt=()=>{const t=Date.now(),r=a.flipDuration*c.progress,i=c.progress;c.auto=!0;const p=()=>{requestAnimationFrame(()=>{const b=Date.now()-t;let d=i-i*b/r;d=d<0?0:d,c.progress=d,d>0?p():(w.value=n.value,x.value=n.value+1,c.auto=!1)})};p()},kt=(t,r)=>{Ae.value=W.value-t,Ne.value=se.value-r},zt=f(()=>Math.min(mt.value,Math.max(ft.value,Ae.value))),xt=f(()=>Math.min(yt.value,Math.max(dt.value,Ne.value)));U(zt,t=>{k.value&&(k.value.scrollLeft=t)}),U(xt,t=>{k.value&&(k.value.scrollTop=t)});const Me=t=>{k.value&&($.value=t.pageX,y.value=t.pageY,M.value=0,_.value<=1?a.dragToFlip&&(L.value="grab"):(W.value=k.value.scrollLeft,se.value=k.value.scrollTop,L.value="all-scroll"))},Ie=t=>{if(!$.value||!y.value)return;const r=t.pageX-$.value,i=t.pageY-y.value;if(M.value=Math.max(M.value,Math.abs(r),Math.abs(i)),_.value>1){kt(r,i);return}if(!a.dragToFlip||Math.abs(i)>Math.abs(r))return;L.value="grabbing";const p=r>0?"left":"right",b=r>0?ve.value:ce.value,d=r>0?a.swipeMin:-a.swipeMin;return b&&r>=d&&_e(p,!1),c.direction===p&&(c.progress=Math.abs(r)/T.value,c.progress>1&&(c.progress=1)),!0},Le=t=>{$.value&&(a.clickToZoom&&M.value<a.swipeMin&&ot(t),c.direction!==null&&!c.auto&&(c.progress>1/4?Ee(!1):Lt()),$.value=null,L.value=null)},Tt=t=>{h.value=!0,Me(t.changedTouches[0])},Pt=t=>{Ie(t.changedTouches[0])&&t.preventDefault()},qe=t=>{Le(t.changedTouches[0])},Dt=t=>{R.value=!0,!h.value&&t.button===0&&(Me(t),t.target&&t.target.setPointerCapture(t.pointerId))},Ft=t=>{h.value||Ie(t)},We=t=>{h.value||(Le(t),t.target&&t.target.releasePointerCapture(t.pointerId))},$t=t=>{h.value||R.value||t.button===0&&Me(t)},St=t=>{(!h.value||!R.value)&&Ie(t)},At=t=>{(!h.value||!R.value)&&Le(t)},Ze=t=>{t===null||t===Z.value||(n.value=a.pages[0]===null&&v.value===2&&t===1?0:t-1,P.value=1/0,N.value=-1/0,S.value=pe.value)};return U(n,()=>{w.value=n.value,x.value=n.value+1,G()}),U(pe,()=>{if(E.value)return;const t=()=>{requestAnimationFrame(()=>{const r=pe.value-S.value;Math.abs(r)<.5?(S.value=pe.value,E.value=!1):(S.value+=r*.1,t())})};E.value=!0,t()}),U(a.pages,(t,r)=>{Xe(),!(r!=null&&r.length)&&t!=null&&t.length&&a.startPage>1&&t[0]==null&&n.value++}),U(()=>a.startPage,t=>{Ze(t)}),(t,r)=>(le(),re("div",da,[Zt(t.$slots,"default",Ut(Vt({canFlipLeft:ve.value,canFlipRight:ce.value,canZoomIn:D(ue),canZoomOut:D(Q),page:Z.value,numPages:nt.value,flipLeft:Ye,flipRight:He,zoomIn:D(q),zoomOut:D(j)}))),B("div",{ref_key:"refViewport",ref:k,class:Je(["viewport",st.value]),style:C(ut.value),onTouchmove:Pt,onPointermove:Ft,onMousemove:St,onTouchend:qe,onTouchcancel:qe,onPointerup:We,onPointercancel:We,onMouseup:At,onWheel:r[2]||(r[2]=i=>D(lt)(i,h.value))},[B("div",{class:"flipbook-container",style:C({transform:`scale(${D(_)})`})},[B("div",{class:"click-to-flip left",style:C({cursor:ve.value?"pointer":"auto"}),onClick:Ye},null,4),B("div",{class:"click-to-flip right",style:C({cursor:ce.value?"pointer":"auto"}),onClick:He},null,4),B("div",{style:C({transform:`translateX(${te.value}px)`})},[it.value?(le(),re("img",{key:0,class:"page fixed",style:C({width:T.value+"px",height:X.value+"px",left:O.value+"px",top:Y.value+"px"}),src:D(de)(ye.value,!0),onLoad:r[0]||(r[0]=(...i)=>D(ie)&&D(ie)(...i))},null,44,ya)):Ge("",!0),vt.value?(le(),re("img",{key:1,class:"page fixed",style:C({width:T.value+"px",height:X.value+"px",left:u.value/2+"px",top:Y.value+"px"}),src:D(de)(be.value,!0),onLoad:r[1]||(r[1]=(...i)=>D(ie)&&D(ie)(...i))},null,44,ba)):Ge("",!0),B("div",{style:C({opacity:c.opacity})},[(le(!0),re(Gt,null,Jt(ht.value,([i,p,b,d,z,ge])=>(le(),re("div",{key:i,class:Je(["polygon",{blank:!p}]),style:C({backgroundImage:p&&`url(${D(rt)(p)})`,backgroundSize:gt.value,backgroundPosition:d,width:ct.value,height:pt.value,transform:z,zIndex:ge})},[Qt(B("div",{class:"lighting",style:C({backgroundImage:b})},null,4),[[Kt,b.length]])],6))),128))],4),B("div",{class:"bounding-box",style:C({left:H.value+"px",top:Y.value+"px",width:ee.value-H.value+"px",height:X.value+"px",cursor:je.value}),onTouchstart:Tt,onPointerdown:Dt,onMousedown:$t},null,36)],4)],4)],38)]))}});export{_a as M};
