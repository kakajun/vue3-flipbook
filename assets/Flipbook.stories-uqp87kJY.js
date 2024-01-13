import{_ as e}from"./iframe-5CdMDQnA.js";import{A as m}from"./style-hDM63egO.js";import"../sb-preview/runtime.js";import"./vue.esm-bundler-DgLHvA7G.js";const d=`
vue3-flipbook  is a Vue component that displays images in 3D page flip effect

Demo page is [here](https://github.com/kakajun/vue3-flipbook).

\`\`\`html
<template>
  <flipbook class="flipbook" :pages="['array', 'of', 'image', 'URLs']"></flipbook>
</template>

<style>
.flipbook {
  width: 90vw;
  height: 90vh;
}
</style>

\`\`\`
## Installation

Install as a module:

npm i -S vue3-flipbook


`,s=async a=>{const o=async n=>{const r=[];for(const c in n){const u=await n[c]();r.push(u.default)}return r};return a?[null,...await o(Object.assign({"/src/assets/images/1.jpg":()=>e(()=>import("./1-G8vowAl9.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images/2.jpg":()=>e(()=>import("./2-0c-F58vL.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images/3.jpg":()=>e(()=>import("./3-nePBJM5q.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images/4.jpg":()=>e(()=>import("./4-_UdVcEdD.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images/5.jpg":()=>e(()=>import("./5-8E8c7eB3.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images/6.jpg":()=>e(()=>import("./6-4NPMXd18.js"),__vite__mapDeps([]),import.meta.url)}))]:[null,...await o(Object.assign({"/src/assets/images-large/1.jpg":()=>e(()=>import("./1-_cTvr_8q.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images-large/2.jpg":()=>e(()=>import("./2-xOxI6dzB.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images-large/3.jpg":()=>e(()=>import("./3-B4s7Ev3m.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images-large/4.jpg":()=>e(()=>import("./4-XOmCUSEy.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images-large/5.jpg":()=>e(()=>import("./5-lG-qnNPa.js"),__vite__mapDeps([]),import.meta.url),"/src/assets/images-large/6.jpg":()=>e(()=>import("./6-LvKYjtjH.js"),__vite__mapDeps([]),import.meta.url)}))]},v={title:"flipDuration",parameters:{docs:{description:{component:d}}},component:m,tags:["autodocs"],args:{zoomDuration:2500,flipDuration:1e3,zooms:[1,2,4],ambient:.4,gloss:.6,perspective:2400,nPolygons:10,singlePage:!1,forwardDirection:"right",centering:!0,startPage:1,swipeMin:3,clickToZoom:!0,dragToFlip:!0,wheel:"scroll"},argTypes:{pages:{description:`Array of image URLs. Required.
       All images should have the same aspect ratio.
       If the first element is null, the next element is displayed alone (as the cover page).
       All other props are optional.`,control:"none"},pagesHiRes:{description:`Array of high resolution versions of image URLs.
      They are used when zoomed.`,control:"none"},flipDuration:{description:"Duration of page flipping animation in milliseconds",control:"number",default:1e3},zoomDuration:{description:"Duration of zoom in/out animation in milliseconds",control:"number",default:500},zooms:{description:"Array of possible magnifications",control:{type:"select"},default:"[1, 2, 4]",options:[[1,2],[1,2,4]]},ambient:{description:`Intensity of ambient light in 0 to 1.
      Smaller value gives more shades`,control:{type:"range",min:0,max:1,step:.1},defaultValue:.4},gloss:{description:"Intensity of specular light in 0 to 1. Higher value gives more gloss.",control:{type:"range",min:0,max:1,step:.1},defaultValue:.6},perspective:{description:"Z-axis distance in pixels between the screen and the viewer. Higher value gives less effect",control:"number",defaultValue:2400},nPolygons:{description:"How many rectangles a single page is horizontally split into. Higher value gives higher quality rendering in exchange for performance",control:"number",defaultValue:10},singlePage:{description:"Force single page mode regardless of viewport size. ",control:"boolean",defaultValue:!1},forwardDirection:{description:'Reading direction. If your document is right-to-left, set this "left".',control:{type:"select"},options:["left","right"],defaultValue:"right"},centering:{description:"Enable centering of the cover pages.",control:"boolean",defaultValue:!0},startPage:{description:"Page number (>= 1) to open.",control:"number",defaultValue:1},loadingImage:{description:"URL of an image that is displayed while page is loading. By default internal animated SVG is used.",control:"text"},clickToZoom:{description:"Zoom in or out on click or tap.",control:"boolean",defaultValue:!0},dragToFlip:{description:"Flip page by dragging/swiping. ",control:"boolean",defaultValue:!0},wheel:{description:"When set to 'zoom', mouse wheel events zoom in/out the page. Default is 'scroll', wheel events and touch pad scroll gestures scroll the zoomed page.",control:{type:"select"},defaultValue:"scroll",options:["zoom","scroll"]},"flip-left-start":{name:"@flip-left-start",description:"Fired when flip to left animation starts. Argument is page number before flip.",control:"none",table:{category:"Emits",type:{summary:"function"}}},"flip-left-end":{name:"@flip-left-end",description:"Fired when flip to left animation ends. Argument is page number after flip.",control:"none",table:{category:"Emits",type:{summary:"function"}}},"flip-right-start":{name:"@flip-right-start",description:"Fired when flip to right animation starts. Argument is page number before flip.",control:"none",table:{category:"Emits",type:{summary:"function"}}},"flip-right-end":{name:"@flip-right-end",description:"Fired when flip to right animation ends. Argument is page number after flip.",control:"none",table:{category:"Emits",type:{summary:"function"}}},"zoom-start":{name:"@zoom-start",description:"Fired when zoom-in/out animation starts. Argument is magnification after zoom.",control:"none",table:{category:"Emits",type:{summary:"function"}}},"zoom-end":{name:"@zoom-end",description:"Fired when zoom-in/out animation ends. Argument is magnification after zoom.",control:"none",table:{category:"Emits",type:{summary:"function"}}},default:{description:"This component exposes some properties and methods as slot properties.",control:"none"},canFlipLeft:{description:"True if it can flip to previous page. NOTE: Can return false if currently being animated.",control:"none",table:{category:"Slots",type:{summary:"boolean"}}},canFlipRight:{description:"True if it can flip to next page. NOTE: Can return false if currently being animated.",control:"none",table:{category:"Slots",type:{summary:"boolean"}}},canZoomIn:{description:"True if it can zoom in.",control:"none",table:{category:"Slots",type:{summary:"boolean"}}},canZoomOut:{description:"True if it can zoom out.",control:"none",table:{category:"Slots",type:{summary:"boolean"}}},page:{description:"Current page number (1 to numPages).",control:"none",table:{category:"Slots",type:{summary:"number"}}},numPages:{description:"Total number of pages.",control:"none",table:{category:"Slots",type:{summary:"number"}}},flipLeft:{description:"Method to flip to previous page.",control:"none",table:{category:"Slots",type:{summary:"function"}}},flipRight:{description:"Method to flip to next page.",control:"none",table:{category:"Slots",type:{summary:"function"}}},zoomIn:{description:"Method to zoom in.",control:"none",table:{category:"Slots",type:{summary:"function"}}},zoomOut:{description:"Method to zoom out.",control:"none",table:{category:"Slots",type:{summary:"function"}}}}},t={render:(a,{loaded:{pages:o,pagesHiRes:i}})=>({components:{Flipbook:m},setup(){return{args:a,pages:o,pagesHiRes:i}},template:`<Flipbook class="flipbook"
       :pages="pages"
       :flipDuration="args.flipDuration"
       :pagesHiRes="pagesHiRes"
       :zoomDuration="args.zoomDuration"
       :zooms="args.zooms"
       :ambient="args.ambient"
        :gloss="args.gloss"
        :perspective="args.perspective"
        :nPolygons="args.nPolygons"
        :singlePage="args.singlePage"
        :forwardDirection="args.forwardDirection"
        :centering="args.centering"
        :startPage="args.startPage"
        :loadingImage="args.loadingImage"
        :clickToZoom="args.clickToZoom"
        :dragToFlip="args.dragToFlip"
        :wheel="args.wheel"
       />`}),loaders:[async()=>({pages:await s(!1),pagesHiRes:await s(!0)})],args:{}};var l,p,g;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
      return {
        args,
        pages,
        pagesHiRes
      };
    },
    template: \`<Flipbook class="flipbook"
       :pages="pages"
       :flipDuration="args.flipDuration"
       :pagesHiRes="pagesHiRes"
       :zoomDuration="args.zoomDuration"
       :zooms="args.zooms"
       :ambient="args.ambient"
        :gloss="args.gloss"
        :perspective="args.perspective"
        :nPolygons="args.nPolygons"
        :singlePage="args.singlePage"
        :forwardDirection="args.forwardDirection"
        :centering="args.centering"
        :startPage="args.startPage"
        :loadingImage="args.loadingImage"
        :clickToZoom="args.clickToZoom"
        :dragToFlip="args.dragToFlip"
        :wheel="args.wheel"
       />\`
  }),
  loaders: [async () => ({
    pages: await getPages(false),
    pagesHiRes: await getPages(true)
  })],
  args: {
    // flipDuration: 3000
  }
}`,...(g=(p=t.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const w=["SlowOne"];export{t as SlowOne,w as __namedExportsOrder,v as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
