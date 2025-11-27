import{_ as t}from"./iframe-BA8GijKe.js";import{C as f}from"./vue3-flipbook-CGYVIHIC.js";import"./vue.esm-bundler-Dms8Sh9j.js";const b={title:"FlipPerf",component:f,tags:["autodocs"],args:{zoomDuration:500,flipDuration:800,zooms:[1,2,4],ambient:.4,gloss:.6,perspective:2400,nPolygons:10,singlePage:!1,forwardDirection:"right",centering:!0,startPage:1,swipeMin:3,clickToZoom:!1,dragToFlip:!0,wheel:"scroll"}},n={render:(a,{loaded:{pages:p,pagesHiRes:l}})=>({components:{Flipbook:f},setup(){const e=[];let s=0,o=0,i=!1;return{args:a,pages:p,pagesHiRes:l,onFlipStart:()=>{if(i)return;s=0,o=performance.now(),i=!0;const r=()=>{i&&(s++,requestAnimationFrame(r))};requestAnimationFrame(r)},onFlipEnd:()=>{const r=performance.now();i=!1,e.push(r-o)},summary:()=>{if(!e.length)return"No data";const r=e.reduce((m,g)=>m+g,0)/e.length,u=[...e].sort((m,g)=>m-g),E=u[Math.floor(u.length*.95)];return`count=${e.length}, avg=${r.toFixed(1)}ms, p95=${E.toFixed(1)}ms, raf=${s}`}}},template:`<div>
      <Flipbook class="flipbook"
        :pages="pages"
        :pagesHiRes="pagesHiRes"
        v-on="{
          'flip-left-start': onFlipStart,
          'flip-right-start': onFlipStart,
          'flip-left-end': onFlipEnd,
          'flip-right-end': onFlipEnd
        }"
        v-bind="args" />
      <div style="color:#ccc;margin-top:12px">{{ summary() }}</div>
    </div>`}),loaders:[async()=>{const a=async e=>{const s=[];for(const o in e)s.push((await e[o]()).default);return s},p=Object.assign({"/src/assets/images/1.jpg":()=>t(()=>import("./1-Bgi0i4Zz.js"),[],import.meta.url),"/src/assets/images/2.jpg":()=>t(()=>import("./2-CLzOewIQ.js"),[],import.meta.url),"/src/assets/images/3.jpg":()=>t(()=>import("./3-wTWJb6Jk.js"),[],import.meta.url),"/src/assets/images/4.jpg":()=>t(()=>import("./4-BjN6Tc8B.js"),[],import.meta.url),"/src/assets/images/5.jpg":()=>t(()=>import("./5-CevZqbpO.js"),[],import.meta.url),"/src/assets/images/6.jpg":()=>t(()=>import("./6-B6kf9PH3.js"),[],import.meta.url)}),l=Object.assign({"/src/assets/images-large/1.jpg":()=>t(()=>import("./1--CZMAChM.js"),[],import.meta.url),"/src/assets/images-large/2.jpg":()=>t(()=>import("./2-GU1eBDK0.js"),[],import.meta.url),"/src/assets/images-large/3.jpg":()=>t(()=>import("./3-DDAe4Ips.js"),[],import.meta.url),"/src/assets/images-large/4.jpg":()=>t(()=>import("./4-DUAOoVNt.js"),[],import.meta.url),"/src/assets/images-large/5.jpg":()=>t(()=>import("./5-PExnMHKy.js"),[],import.meta.url),"/src/assets/images-large/6.jpg":()=>t(()=>import("./6-aJB2eRiP.js"),[],import.meta.url)});return{pages:[null,...await a(p)],pagesHiRes:[null,...await a(l)]}}]};var c,d,_;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: (args: any, {
    loaded: {
      pages,
      pagesHiRes
    }
  }: any) => ({
    components: {
      Flipbook
    },
    setup() {
      const samples: number[] = [];
      let rafCount = 0;
      let start = 0;
      let running = false;
      const onFlipStart = () => {
        if (running) return;
        rafCount = 0;
        start = performance.now();
        running = true;
        const tick = () => {
          if (!running) return;
          rafCount++;
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const onFlipEnd = () => {
        const end = performance.now();
        running = false;
        samples.push(end - start);
      };
      const summary = () => {
        if (!samples.length) return 'No data';
        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const sorted = [...samples].sort((a, b) => a - b);
        const p95 = sorted[Math.floor(sorted.length * 0.95)];
        return \`count=\${samples.length}, avg=\${avg.toFixed(1)}ms, p95=\${p95.toFixed(1)}ms, raf=\${rafCount}\`;
      };
      return {
        args,
        pages,
        pagesHiRes,
        onFlipStart,
        onFlipEnd,
        summary
      };
    },
    template: \`<div>
      <Flipbook class="flipbook"
        :pages="pages"
        :pagesHiRes="pagesHiRes"
        v-on="{
          'flip-left-start': onFlipStart,
          'flip-right-start': onFlipStart,
          'flip-left-end': onFlipEnd,
          'flip-right-end': onFlipEnd
        }"
        v-bind="args" />
      <div style="color:#ccc;margin-top:12px">{{ summary() }}</div>
    </div>\`
  }),
  loaders: [async () => {
    const importAll = async (r: Record<string, () => Promise<{
      default: string;
    }>>) => {
      const images: string[] = [];
      for (const path in r) images.push((await r[path]()).default);
      return images;
    };
    const images = import.meta.glob('@/assets/images/*.jpg') as Record<string, () => Promise<{
      default: string;
    }>>;
    const imagesLarge = import.meta.glob('@/assets/images-large/*.jpg') as Record<string, () => Promise<{
      default: string;
    }>>;
    return {
      pages: [null, ...(await importAll(images))],
      pagesHiRes: [null, ...(await importAll(imagesLarge))]
    };
  }]
}`,...(_=(d=n.parameters)==null?void 0:d.docs)==null?void 0:_.source}}};const j=["MeasureFlip"];export{n as MeasureFlip,j as __namedExportsOrder,b as default};
