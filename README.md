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
