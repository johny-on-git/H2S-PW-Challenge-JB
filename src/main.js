import './style.css'

const button = document.querySelector('#cta-button')
const title = document.querySelector('#title')

const colors = [
  'linear-gradient(to right, #818cf8, #c084fc, #f472b6)',
  'linear-gradient(to right, #34d399, #3b82f6, #818cf8)',
  'linear-gradient(to right, #fbbf24, #f87171, #ec4899)'
]

let colorIndex = 0

button.addEventListener('click', () => {
  colorIndex = (colorIndex + 1) % colors.length
  title.style.background = colors[colorIndex]
  title.style.webkitBackgroundClip = 'text'
  title.style.webkitTextFillColor = 'transparent'
  
  // Subtle animation on click
  button.style.transform = 'scale(0.9)'
  setTimeout(() => {
    button.style.transform = 'scale(1)'
  }, 100)
})

console.log('Hello World App Initialized 🚀')
