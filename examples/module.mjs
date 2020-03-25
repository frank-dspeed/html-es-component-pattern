import uuid from 'uuid'


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
