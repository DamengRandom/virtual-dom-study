console.log('Journey begins now ..');
import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
// diff now
import diff from './vdom/diff';

const childElementExample = () => createElement('p', {attrs: {id: 'greeting', text: 'aloha ..'}});

const imageChildElement = createElement('img', {attrs: {id: 'img', src:'https://media.giphy.com/media/3o6ZsXTIwhihRp1lXW/giphy.gif'}});

const createVApp = (count) => createElement( // virtual dom plain object
  'div',
  {
    attrs: {
      id: 'app',
      dataCount: count,
    },
    children: [
      createElement('input'),
      String(count),
      ...Array.from({ length: count }, () => createElement('img', {
        attrs: {
          src: 'https://media.giphy.com/media/3o6ZsXTIwhihRp1lXW/giphy.gif',
        },
      })),
      childElementExample(),
      imageChildElement,
    ],
  },
);

// console.log('Simple virtual dom object representation: ', vApp);
// next step is to render virtual DOM in real DOM
let count = 0;
let vApp = createVApp(count);
const $app = render(vApp); // using $ to represent the DOM is real dom which shows in browser

// next step: render the virtual in browser and show up now,
const $target = document.getElementById('root');
let $rootEl = mount($app, $target);

setInterval(() => {
  count++;
  // $rootEl = mount(render(createVApp(count)), $rootEl); ?? think more
  const vNewApp = createVApp(count);
  const patch = diff(vApp, vNewApp);
  $rootEl = patch($rootEl);
  vApp = vNewApp;
}, 1000);

console.log($app);