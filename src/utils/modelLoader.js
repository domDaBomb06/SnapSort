import * as tmImage from '@teachablemachine/image'
import { MODEL_URL, METADATA_URL } from '../constants'

const DOWNLOAD_TIMEOUT_MS = 60000

let modelPromise = null

function withTimeout(promise, ms) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Model took too long to download')), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

async function downloadAndWarmUp() {
  const downloadStart = performance.now()
  const model = await withTimeout(tmImage.load(MODEL_URL, METADATA_URL), DOWNLOAD_TIMEOUT_MS)
  console.info(`[SnapSort] model downloaded in ${Math.round(performance.now() - downloadStart)} ms`)

  // The first prediction is always the slowest (the browser has to set the model up),
  // so run one on a blank image now, before the user taps anything.
  const warmUpStart = performance.now()
  const blank = document.createElement('canvas')
  blank.width = 224
  blank.height = 224
  await model.predict(blank)
  console.info(`[SnapSort] warm-up prediction took ${Math.round(performance.now() - warmUpStart)} ms`)

  return model
}

// Loads the model once and shares it, so opening the scan page again
// doesn't download and set up the model a second time.
export function loadModel() {
  if (!modelPromise) {
    modelPromise = downloadAndWarmUp().catch((err) => {
      modelPromise = null // lets "Try again" start a fresh attempt
      throw err
    })
  }
  return modelPromise
}