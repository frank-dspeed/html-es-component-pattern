import {html, change} from './module.mjs' 
import {html as f } from './module.mjs?hoho' 
import {html as o } from './module.mjs'

change('OK')
console.log(html+f+o)

import('./module.mjs').then(({ render })=>console.log(render()))
import('./module.mjs?hoho').then(({ render })=>console.log(render()))
