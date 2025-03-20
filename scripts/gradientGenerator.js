const preview = document.getElementById('gradient-preview');
const gradientType = document.getElementById('gradientType');
const linearControls = document.getElementById('linearControls');
const radialControls = document.getElementById('radialControls');
const conicControls = document.getElementById('conicControls');
const angle = document.getElementById('angle');
const radialShape = document.getElementById('radialShape');
const radialSize = document.getElementById('radialSize');
const radialPosition = document.getElementById('radialPosition');
const conicPosition = document.getElementById('conicPosition');
const colorStops = document.getElementById('colorStops');
const addStop = document.getElementById('addStop');
const cssCode = document.getElementById('css-code');
const copyCode = document.getElementById('copyCode');
const body = document.body;
const lightModeButton = document.getElementById('light-mode');
const darkModeButton = document.getElementById('dark-mode');
const randomDesignButton = document.getElementById('randomDesign');

function generateGradient() {
    let gradientValue = `${gradientType.value}(`;
    let stopStrings = [];

    colorStops.querySelectorAll('.color-stop').forEach((stop) => {
        const color = stop.querySelector('input[type="color"]').value;
        const position = stop.querySelector('.stop-position').value;
        stopStrings.push(position ? `${color} ${position}%` : color);
    });

    if (gradientType.value.startsWith('linear')) {
        gradientValue += `${angle.value}deg, ${stopStrings.join(', ')}`;
    } else if (gradientType.value.startsWith('radial')) {
        gradientValue += `${radialShape.value} ${radialSize.value} at ${radialPosition.value}, ${stopStrings.join(', ')}`;
    } else if (gradientType.value.startsWith('conic')) {
        gradientValue += `at ${conicPosition.value}, ${stopStrings.join(', ')}`;
    }

    gradientValue += ')';
    preview.style.backgroundImage = gradientValue;
    cssCode.value = `background-image: ${gradientValue};`;
}

function updateControls() {
    linearControls.style.display = gradientType.value.startsWith('linear') ? 'block' : 'none';
    radialControls.style.display = gradientType.value.startsWith('radial') ? 'block' : 'none';
    conicControls.style.display = gradientType.value.startsWith('conic') ? 'block' : 'none';
    generateGradient();
}

gradientType.addEventListener('change', updateControls);

addStop.addEventListener('click', () => {
    const newStop = document.createElement('div');
    newStop.className = 'color-stop';
    newStop.innerHTML = `
        <input type="color" value="#ffffff">
        <input type="number" class="stop-position" placeholder="%">
        <button class="remove-stop">Remove</button>
    `;
    colorStops.appendChild(newStop);
    newStop.querySelector('.remove-stop').addEventListener('click', () => {
        newStop.remove();
        generateGradient();
    });
    newStop.querySelectorAll('input').forEach(input => input.addEventListener('input', generateGradient));
});

copyCode.addEventListener('click', () => {
    cssCode.select();
    document.execCommand('copy');
    alert('CSS copied to clipboard!');
});

function setDarkMode() {
    body.classList.add('dark-mode');
    lightModeButton.classList.remove('dark-mode-button');
    darkModeButton.classList.add('dark-mode-button');
    localStorage.setItem('theme', 'dark');
}

function setLightMode() {
    body.classList.remove('dark-mode');
    darkModeButton.classList.remove('dark-mode-button');
    lightModeButton.classList.add('dark-mode-button');
    localStorage.setItem('theme', 'light');
}

lightModeButton.addEventListener('click', setLightMode);
darkModeButton.addEventListener('click', setDarkMode);

// Load theme from local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setDarkMode();
} else {
    setLightMode();
}

updateControls();

function generateRandomGradient() {
    const gradientTypes = ['linear-gradient', 'radial-gradient', 'conic-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient', 'repeating-conic-gradient'];
    const randomGradientType = gradientTypes[Math.floor(Math.random() * gradientTypes.length)];
    gradientType.value = randomGradientType;

    colorStops.innerHTML = '';

    const numberOfStops = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < numberOfStops; i++) {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const randomPosition = Math.floor(Math.random() * 101);
        const newStop = document.createElement('div');
        newStop.className = 'color-stop';
        newStop.innerHTML = `
            <input type="color" value="${randomColor}">
            <input type="number" class="stop-position" value="${randomPosition}">
            <button class="remove-stop">Remove</button>
        `;
        colorStops.appendChild(newStop);
        newStop.querySelector('.remove-stop').addEventListener('click', () => {
            newStop.remove();
            generateGradient();
        });
        newStop.querySelectorAll('input').forEach(input => input.addEventListener('input', generateGradient));
    }

    angle.value = Math.floor(Math.random() * 361);

    const radialShapes = ['circle', 'ellipse'];
    const radialSizes = ['farthest-corner', 'closest-side', 'closest-corner', 'farthest-side', 'contain', 'cover'];
    radialShape.value = radialShapes[Math.floor(Math.random() * radialShapes.length)];
    radialSize.value = radialSizes[Math.floor(Math.random() * radialSizes.length)];
    radialPosition.value = `${Math.floor(Math.random() * 101)}% ${Math.floor(Math.random() * 101)}%`;

    conicPosition.value = `${Math.floor(Math.random() * 101)}% ${Math.floor(Math.random() * 101)}%`;

    generateGradient();
    updateControls();
}

randomDesignButton.addEventListener('click', generateRandomGradient);
