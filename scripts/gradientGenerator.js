const preview        = document.getElementById('gradient-preview');
const gradientType   = document.getElementById('gradientType');
const linearControls = document.getElementById('linearControls');
const radialControls = document.getElementById('radialControls');
const conicControls  = document.getElementById('conicControls');
const angle          = document.getElementById('angle');
const radialShape    = document.getElementById('radialShape');
const radialSize     = document.getElementById('radialSize');
const radialPosition = document.getElementById('radialPosition');
const conicPosition  = document.getElementById('conicPosition');
const colorStops     = document.getElementById('colorStops');
const addStop        = document.getElementById('addStop');
const cssCode        = document.getElementById('css-code');
const copyCode       = document.getElementById('copyCode');
const body           = document.body;
const lightModeBtn   = document.getElementById('light-mode');
const darkModeBtn    = document.getElementById('dark-mode');
const randomBtn      = document.getElementById('randomDesign');

function generateGradient() {
  let g = `${gradientType.value}(`;
  const stops = Array.from(colorStops.querySelectorAll('.color-stop'))
    .map(s => {
      const c = s.querySelector('input[type="color"]').value;
      const p = s.querySelector('.stop-position').value;
      return p ? `${c} ${p}%` : c;
    });
  if (gradientType.value.includes('linear')) {
    g += `${angle.value}deg, ${stops.join(', ')}`;
  } else if (gradientType.value.includes('radial')) {
    g += `${radialShape.value} ${radialSize.value} at ${radialPosition.value}, ${stops.join(', ')}`;
  } else {
    g += `at ${conicPosition.value}, ${stops.join(', ')}`;
  }
  g += ')';
  preview.style.backgroundImage = g;
  cssCode.value = `background-image: ${g};`;
}

function updateControls() {
  linearControls.style.display = gradientType.value.includes('linear') ? 'block' : 'none';
  radialControls.style.display = gradientType.value.includes('radial') ? 'block' : 'none';
  conicControls.style.display  = gradientType.value.includes('conic') ? 'block' : 'none';
  generateGradient();
}

gradientType.addEventListener('change', updateControls);

addStop.addEventListener('click', () => {
  const d = document.createElement('div');
  d.className = 'color-stop';
  d.innerHTML = `
    <input type="color" value="#ffffff">
    <input type="number" class="stop-position" placeholder="%">
    <button class="remove-stop" type="button">Remove</button>
  `;
  colorStops.appendChild(d);
  d.querySelector('.remove-stop').addEventListener('click', () => {
    d.remove(); generateGradient();
  });
  d.querySelectorAll('input').forEach(i => i.addEventListener('input', generateGradient));
});

copyCode.addEventListener('click', () => {
  cssCode.select();
  document.execCommand('copy');
  alert('CSS copied!');
});

function setDark() {
  body.classList.add('dark-mode');
  lightModeBtn.classList.remove('dark-mode-button');
  darkModeBtn.classList.add('dark-mode-button');
  localStorage.setItem('theme', 'dark');
}
function setLight() {
  body.classList.remove('dark-mode');
  darkModeBtn.classList.remove('dark-mode-button');
  lightModeBtn.classList.add('dark-mode-button');
  localStorage.setItem('theme', 'light');
}
lightModeBtn.addEventListener('click', setLight);
darkModeBtn.addEventListener('click', setDark);
localStorage.getItem('theme') === 'dark' ? setDark() : setLight();

updateControls();

function generateRandomGradient() {
  const types = [
    'linear-gradient','radial-gradient','conic-gradient',
    'repeating-linear-gradient','repeating-radial-gradient','repeating-conic-gradient'
  ];
  gradientType.value = types[Math.floor(Math.random() * types.length)];
  colorStops.innerHTML = '';
  const n = Math.floor(Math.random() * 5) + 2;
  for (let i = 0; i < n; i++) {
    const color = '#'+Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0');
    const pos   = Math.floor(Math.random() * 101);
    const el    = document.createElement('div');
    el.className = 'color-stop';
    el.innerHTML = `
      <input type="color" value="${color}">
      <input type="number" class="stop-position" value="${pos}">
      <button class="remove-stop" type="button">Remove</button>
    `;
    colorStops.appendChild(el);
    el.querySelector('.remove-stop').addEventListener('click', () => {
      el.remove(); generateGradient();
    });
    el.querySelectorAll('input').forEach(i => i.addEventListener('input', generateGradient));
  }
  angle.value = Math.floor(Math.random() * 361);
  radialShape.value = ['circle','ellipse'][Math.floor(Math.random()*2)];
  radialSize.value = ['farthest-corner','closest-side','closest-corner','farthest-side','contain','cover']
    [Math.floor(Math.random()*6)];
  radialPosition.value = `${Math.floor(Math.random()*101)}% ${Math.floor(Math.random()*101)}%`;
  conicPosition.value  = `${Math.floor(Math.random()*101)}% ${Math.floor(Math.random()*101)}%`;
  updateControls();
}

randomBtn.addEventListener('click', generateRandomGradient);
