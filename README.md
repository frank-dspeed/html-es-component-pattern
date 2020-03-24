# html-es-component-pattern
Patterns to use native ECMAScript modules for WebComponents. including SSR Support



## Most Basic Pattern Small Component
```js
import uuid from 'uuid'
export const model = { id: `el-${uuid.v4()}`, color: 'blue'}
export const render = ()=>`<${model.id} style="color: ${model.color}">I am ${model.color}</${model.id}>`
```

Generate a index.html via ssr
```
import {render} from './simple-module.mjs'
console.log(render())
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
