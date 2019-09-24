/* Q & a
	Q: Why are there @type comments?
	A: To let my editor know what type variables are 
	(since this project doesn't use typescrpt this was my only way of achiving that)
*/

// @ts-check
/** @type { HTMLCanvasElement } */
// @ts-ignore
const canvas = document.getElementById('img_container')

/** @type { CanvasRenderingContext2D } */
const context = canvas.getContext('2d')
const image = new Image()

const userTexts = []
const canvasRectangle = canvas.getBoundingClientRect()
const offsetX = canvasRectangle.left
const offsetY = canvasRectangle.top

let current_opacity = 1
let selectedText = -1
let startX = 0
let startY = 0
let imageInserted = false

/**
 * Function for loading image into canvas.
 */
const loadImage = () => {
  canvas.style.opacity = String(current_opacity)
  imageInserted = true

  /** @type { HTMLInputElement } */
  // @ts-ignore
  const upoladContainer = document.getElementById('image_file')
  const file = upoladContainer.files[0]

  const reader = new FileReader()

  reader.onload = event => {
    if (!event) {
      throw new Error(`Reader onload event is undefined`)
    }

    const loadedImage = new Image()

    loadedImage.onload = async () => {
      context.drawImage(loadedImage, 0, 0, canvas.width, canvas.height)

      console.log('loaded')
    }

    if (typeof reader.result === 'string') {
      loadedImage.src = reader.result

      // ? Why is this here
      context.drawImage(loadedImage, 100, 100)
    } else {
      throw new Error(`Image src is not a string`)
    }
  }

  try {
    reader.readAsDataURL(file)
  } catch {
    console.warn('No image uploaded!')
  }
}

const increaseOpacity = (step = 0.1) => {
  if (current_opacity < 1.0) {
    current_opacity += step

    setOpacity(current_opacity)
    drawPicture()
  } else {
    // TODO: get rid of alerts
    alert('Deja poza are opacitate maxima')
  }
}

const decreaseOpacity = (step = 0.1) => {
  if (current_opacity > 0.1) {
    current_opacity -= step

    setOpacity(current_opacity)
    drawPicture()
  } else {
    // TODO: get rid of alerts
    alert('Deja poza are opacitate minima')
  }
}

/**
 * Sets the opacity of the canvas
 * @param {number} opacity The opacity
 */
const setOpacity = opacity => {
  canvas.style.opacity = String(opacity)
  context.globalAlpha = opacity
}

const refreshImageContainer = () => {
  if (!imageInserted) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  } else {
    drawPicture()
  }
}

const drawPicture = () => {
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
}

const createText = () => {
  /** @type { HTMLInputElement } */
  // @ts-ignore
  const { value: text } = document.getElementById('text')

  /** @type { HTMLInputElement } */
  // @ts-ignore
  const { value: font } = document.getElementById('font_number_text')

  /** @type { HTMLInputElement } */
  // @ts-ignore
  const { value: fill } = document.getElementById('color')

  context.fillStyle = fill
  context.font = font

  const { width } = context.measureText(text)

  context.fillText(text, 10, 10)
  userTexts.push({ text, x: 10, y: 10, width, height: font })
}

/**
 * @type { (e:MouseEvent) => void }
 */
const handleMouseDown = e => {
  e.preventDefault()
  startX = e.clientX - offsetX
  startY = e.clientY - offsetY

  for (let i = 0; i < userTexts.length; i++) {
    if (checkTextCollision(startX, startY, i)) {
      selectedText = i
    }
  }
}

/**
 *
 * @param {number} x The x position of the text
 * @param {number} y The y position of the text
 * @param {number} textIndex The index of the text
 */
const checkTextCollision = (x, y, textIndex) => {
  const text = userTexts[textIndex]

  return (
    x >= text.x &&
    x <= text.x + text.width &&
    y >= text.y &&
    y <= text.y + text.height
  )
}

/**
 * @param {MouseEvent} e The MouseEvent instance
 */
const handleMouseMove = e => {
  //if there is not a text selected
  if (selectedText < 0) {
    return
  }

  e.preventDefault()
  //get the position of the mouse
  const mouseX = e.clientX - offsetX
  const mouseY = e.clientY - offsetY

  // Put your mousemove stuff here
  const dx = mouseX - startX
  const dy = mouseY - startY
  startX = mouseX
  startY = mouseY

  const text = userTexts[selectedText]
  text.x += dx
  text.y += dy
  drawText()
}

/**
 * @param {MouseEvent} e The MouseEvent instance
 */
const handleMouseUp = e => {
  e.preventDefault()
  selectedText = -1
}

/**
 * @param {MouseEvent} e The MouseEvent instance
 */
const handleMouseOut = e => {
  e.preventDefault()
  selectedText = -1
}

const drawText = () => {
  refreshImageContainer()

  for (const text of userTexts) {
    context.fillText(text.txt, text.x, text.y)
  }
}

canvas.addEventListener('mousedown', handleMouseDown)
canvas.addEventListener('mouseup', handleMouseUp)
canvas.addEventListener('mousemove', handleMouseMove)

const exportImage = () => {
  const image = canvas.toDataURL('image/png')
  document.write('Right click + save image as')
  document.write('<img src="' + image + '"/>')
}
