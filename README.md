# html-es-component-pattern for Browsers
Patterns to use native ECMAScript modules for WebComponents. including SSR Support
you should be already familar with HTML Parsing inside the browser and it's diffrent queues and eventbus systems.
if you are searching for patterns that work with diffrent implamentations like [webview go here](#)

https://dev.to/frankdspeed/the-html-component-pattern-hcp-3pkp

## Conventions Rules.
```js
export const render = function(data) {} //=> returns string
export const html = render();
export const customElement = customElementDefinition
// A function that takes a el as argument for manual element or component upgrades.
export const connectedCallback = connectedCallbackFrom = el =>customelement.prototype,connectedCallback.apply(el)

/* sideEffect global only once per import url can be instanciated via ?hash applyed to import url */
```

connectedCallback includes all functionality like bindings that you want to apply to the el when it got rendered
can be used if you do not use customElementDefinition. can also be used for polyfill usecases if customElements is not possible

render
```js
// reference outer model and merge it with data to supply defaults
```

you need to implament not all Conventions you can also choose to go in any combination we have 2 view layers the html property and render function and then 4 places to apply logic customElementDefinition and connectedCallback as also side Effects and rendered script tags.


## Most Basic Pattern Small Component
```js
import uuid from 'uuid'
export const model = { id: `el-${uuid.v4()}`, color: 'blue'}
export const render = function() {
  return `<${this.id} style="color: ${this.color}">I am ${this.color}</${this.id}>`;
}
export const html = render.apply(model)
```
jo

```js
import uuid from 'uuid'
export const model = { id: `el-${uuid.v4()}`, color: 'red'}
export const render = ()=>`<${model.id} style="color: ${model.color}">I am ${model.color}</${model.id}>`
export const html = render();
```
// Show options merge
```js
import uuid from 'uuid'
export const model = { id: `el-${uuid.v4()}`, color: 'red'}
export const render = ()=>`<${model.id} style="color: ${model.color}">I am ${model.color}</${model.id}>`
export const html = render();
```

Generate a index.html via ssr
```js
import {render} from './simple-module.mjs'
console.log(render())
``` 

A Flexible render function most time you will never need this api but it shows what is possible
```js
import uuid from 'uuid'
export const model = { id: `el-${uuid.v4()}`, color: 'blue'}
export const render = function(data) {
  const current = this;
  Object.assign(this,model,current,data);
  return `<${this.id} style="color: ${this.color}">I am ${this.color}</${this.id}>`
}
export const html = render.apply(model,model) //or render(model)
```


## Most Basic Pattern Small Component with a static export

```js
import uuid from 'uuid'
export const model = { id: `el-${uuid.v4()}`, color: 'blue'}
export const render = ()=>`<${model.id} style="color: ${model.color}">I am ${model.color}</${model.id}>`
export const html = render();
```


Generate a index.html via ssr
```
import {html} from './simple-module.mjs'
console.log(html)
``` 



## append raw html to a existing element

```js
import {render} from './simple-module.mjs'

const onDom = (html,node)=>{
  const template = document.createElement('template');
  template.innerHTML = html();
  node.appendChild(document.importNode(template.content, true));
}
onDom(render(),document.querySelector('body'))
```

If you use this you can append also Logic to the new inserted element or component

## Get existing and new Elements and apply your defintion
get elements by document.querySelectorAll()
```js
const elementsArray = document.querySelectorAll('module-tag')
//elementsArray
```
self referencing script include render
```html
<script type="module">
//This Template References the module that generate the template dynamic
//It uses {'/script'} hack to convinence html parsers when used inside a single page html app
let html = `<script>${import.meta.url}<${'/script'}>`
console.log(html)
</script>
```

use dynamic import inside a cjs script
```html
<p>My <span>component</span></p>
<script defer>{
    const customElement = document.currentScript.previousElementSibling;
    document.addEventListener('DOMContentLoaded', () => {
      customElement.querySelector('span').innerText = 'Component'
      customElement.innerHTML += ' Works after DOMContentLoaded!';
    });  
}</script>
```

use dynamic import for esm use with document.currentScript

```js
<el-3123421-214213-21413213>My <span>component</span></el-3123421-214213-21413213>
<script defer>{
    const customElement = document.currentScript.previousElementSibling;
    // As we remember we would apply bindings also to our render()
    import('./simple-module.mjs').then(({render})=>render({ id: customElement.tagName }));
    // we can use the existing node via customElement or its tagName to apply custom logic,
}</script>
``` 

### Big example
used with node index.mjs > index.html
./module.mjs
```js
mport uuid from 'uuid'


export const model = { id: `el-${uuid.v4()}`, changeMe: 'changeMe', color: 'blue'}

// Logic to change the model based on events
// This is possible but leads to bad application design
// usefull places for this could be application routing under some circumstances
export const change = (val) => model.changeMe = val;

// When dynamic instantiated it can parse the string after ?
// a render function as export
// It is better to also change the model in the render function if needed
export const render = userModel=> {
let m = {...model,...userModel}
return `
  <${m.id} style="color: ${m.color}">${m.id} - ${m.changeMe}</${m.id}>
  <script>${import.meta.url}<${'/script'}>`
}

//Directly use able export
export const html = render();

//register the model id as customElement
//use document.querySelector(model.id) and apply your logic
// export that as a call able function so that a user who imports
// this can recall the logic like bindings
const onDom = (r,t)=>{
const template = document.createElement('template');
  template.innerHTML = r();
  t.appendChild(document.importNode(template.content, true));
}


// you could want to nest components simply import the render or html
// export from them and use it inside the template of a other component.

```

./index.mjs
```js
import {html, change} from './module.mjs' 
import {html as f } from './module.mjs?hoho' 
import {html as o } from './module.mjs'

change('OK')
console.log(html+f+o)

import('./module.mjs').then(({ render })=>console.log(render()))
import('./module.mjs?hoho').then(({ render })=>console.log(render({ color: 'red'})))

```

node index.mjs > index.htm
```html
<el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73 style="color: blue">el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73 - changeMe</el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73>
  <script>file:///home/frank/kartevonmorgen/html-component-pattern/module.mjs</script>
  <el-8f52a87f-071f-4b84-87bf-9065877ec22d style="color: blue">el-8f52a87f-071f-4b84-87bf-9065877ec22d - changeMe</el-8f52a87f-071f-4b84-87bf-9065877ec22d>
  <script>file:///home/frank/kartevonmorgen/html-component-pattern/module.mjs?hoho</script>
  <el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73 style="color: blue">el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73 - changeMe</el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73>
  <script>file:///home/frank/kartevonmorgen/html-component-pattern/module.mjs</script>

  <el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73 style="color: blue">el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73 - OK</el-d4b60ea8-5ab5-4282-87a5-d6d717fdde73>
  <script>file:///home/frank/kartevonmorgen/html-component-pattern/module.mjs</script>

  <el-8f52a87f-071f-4b84-87bf-9065877ec22d style="color: red">el-8f52a87f-071f-4b84-87bf-9065877ec22d - changeMe</el-8f52a87f-071f-4b84-87bf-9065877ec22d>
  <script>file:///home/frank/kartevonmorgen/html-component-pattern/module.mjs?hoho</script>
```
