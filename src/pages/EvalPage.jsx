// this page is to help me test the accuracy of the ai model, by letting me run it on a folder of brand new photos that the model has not seen, and compare its predictions to the true labels (the folder names). It is not part of the actual app.
import { useState } from 'react'
import * as tmImage from '@teachablemachine/image'
import {
  MODEL_URL,
  METADATA_URL,
  BASELINE_MODEL_URL,
  BASELINE_METADATA_URL,
  CONFIDENCE_THRESHOLD,
} from '../constants'
import { readImage } from '../utils/readImage'
import './EvalPage.css'

const CLASSES = ['Plastic', 'Paper', 'Glass', 'Metal', 'General Waste']
const COLUMNS = [...CLASSES, 'Other']

const FOLDER_TO_CLASS = {
  plastic: 'Plastic',
  paper: 'Paper',
  glass: 'Glass',
  metal: 'Metal',
  'general waste': 'General Waste',
  general: 'General Waste',
}

const IMAGE_FILE = /\.(jpe?g|png|webp|heic|heif)$/i

// The folder a photo sits in is its true label: "/Plastic/IMG_01.jpg" means the item is Plastic.
function labelFromPath(path) {
  const parts = path.split('/')
  const folder = (parts[parts.length - 2] ?? '').toLowerCase().replace(/[-_]+/g, ' ').trim()
  return FOLDER_TO_CLASS[folder] ?? null
}

// This allows the file picker choose a whole folder
function allowFolders(input) {
  if (input) input.setAttribute('webkitdirectory', '')
}

async function loadAndWarmUp(modelUrl, metadataUrl) {
  const model = await tmImage.load(modelUrl, metadataUrl)

  const blank = document.createElement('canvas')
  blank.width = 224
  blank.height = 224
  await model.predict(blank)
  return model
}

async function classify(model, img) {
  const start = performance.now()
  const predictions = await model.predict(img)
  const ms = performance.now() - start
  const top = predictions.reduce((a, b) => (a.probability > b.probability ? a : b))
  return { predicted: top.className, confidence: top.probability, ms }
}

const percent = (part, whole) => (whole === 0 ? '-' : `${Math.round((part / whole) * 100)}%`)

function summarise(rows, key) {
  const perClass = {}
  const matrix = {}
  CLASSES.forEach((name) => {
    perClass[name] = { total: 0, correct: 0 }
    matrix[name] = Object.fromEntries(COLUMNS.map((column) => [column, 0]))
  })

  let correct = 0
  let confident = 0
  let confidentCorrect = 0
  let totalMs = 0

  rows.forEach((row) => {
    const result = row[key]
    const isCorrect = result.predicted === row.label
    const column = CLASSES.includes(result.predicted) ? result.predicted : 'Other'

    perClass[row.label].total += 1
    matrix[row.label][column] += 1
    totalMs += result.ms

    if (isCorrect) {
      correct += 1
      perClass[row.label].correct += 1
    }
    if (result.confidence >= CONFIDENCE_THRESHOLD) {
      confident += 1
      if (isCorrect) confidentCorrect += 1
    }
  })

  return {
    total: rows.length,
    correct,
    confident,
    confidentCorrect,
    averageMs: rows.length > 0 ? totalMs / rows.length : 0,
    perClass,
    matrix,
  }
}

const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`

function downloadCsv(rows) {
  const lines = [
    ['file', 'true label', 'baseline prediction', 'baseline confidence', 'current prediction', 'current confidence'],
    ...rows.map((row) => [
      row.file,
      row.label,
      row.baseline.predicted,
      row.baseline.confidence.toFixed(3),
      row.current.predicted,
      row.current.confidence.toFixed(3),
    ]),
  ]
  const csv = lines.map((line) => line.map(csvCell).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'snapsort-accuracy-results.csv'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function ModelResults({ title, summary }) {
  return (
    <section className="eval__model">
      <h2>{title}</h2>
      <ul className="eval__summary">
        <li>
          Top-1 accuracy: <strong>{percent(summary.correct, summary.total)}</strong> ({summary.correct} of {summary.total})
        </li>
        <li>
          Answers at least {Math.round(CONFIDENCE_THRESHOLD * 100)}% sure: {summary.confident} of {summary.total}.
          Of those, {summary.confidentCorrect} were right ({percent(summary.confidentCorrect, summary.confident)}).
        </li>
        <li>Average prediction time on this device: {Math.round(summary.averageMs)} ms</li>
      </ul>

      <h3>Per category</h3>
      <table className="eval__table">
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Right</th>
            <th scope="col">Photos</th>
            <th scope="col">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {CLASSES.map((name) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>{summary.perClass[name].correct}</td>
              <td>{summary.perClass[name].total}</td>
              <td>{percent(summary.perClass[name].correct, summary.perClass[name].total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>What each category was mistaken for</h3>
      <p>Rows are the true category. Columns are what the model said.</p>
      <div className="eval__scroll">
        <table className="eval__table">
          <thead>
            <tr>
              <th scope="col">True / Said</th>
              {COLUMNS.map((column) => (
                <th key={column} scope="col">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES.map((name) => (
              <tr key={name}>
                <th scope="row">{name}</th>
                {COLUMNS.map((column) => (
                  <td key={column}>{summary.matrix[name][column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EvalPage() {
  const [selected, setSelected] = useState([])
  const [skipped, setSkipped] = useState([])
  const [phase, setPhase] = useState('idle') 
  const [progress, setProgress] = useState(0)
  const [rows, setRows] = useState([])
  const [unreadable, setUnreadable] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  function handleFolder(event) {
    const files = Array.from(event.target.files).filter(
      (file) => file.type.startsWith('image/') || IMAGE_FILE.test(file.name)
    )
    const labelled = []
    const unknown = []

    files.forEach((file) => {
      const path = file.webkitRelativePath || file.name
      const label = labelFromPath(path)
      if (label) {
        labelled.push({ file, path, label })
      } else {
        unknown.push(path)
      }
    })

    setSelected(labelled)
    setSkipped(unknown)
    setRows([])
    setPhase('idle')
  }

  async function handleRun() {
    setErrorMessage(null)
    setRows([])
    setUnreadable([])
    setProgress(0)
    setPhase('loading')

    let baseline
    let current

    try {
      baseline = await loadAndWarmUp(BASELINE_MODEL_URL, BASELINE_METADATA_URL)
    } catch (err) {
      console.error(err)
      setErrorMessage('The baseline model could not be loaded. Check BASELINE_MODEL_URL in constants.js.')
      setPhase('error')
      return
    }

    try {
      current = await loadAndWarmUp(MODEL_URL, METADATA_URL)
    } catch (err) {
      console.error(err)
      setErrorMessage('The current model could not be loaded. Check MODEL_URL in constants.js.')
      setPhase('error')
      return
    }

    setPhase('running')
    const results = []
    const failed = []

    // One photo at a time, so big photos don't pile up in the memory
    for (const [index, item] of selected.entries()) {
      const img = await readImage(item.file)
      if (img) {
        results.push({
          file: item.path,
          label: item.label,
          baseline: await classify(baseline, img),
          current: await classify(current, img),
        })
      } else {
        failed.push(item.path)
      }
      setProgress(index + 1)
    }

    setRows(results)
    setUnreadable(failed)
    setPhase('done')
  }

  const baselineSummary = rows.length > 0 ? summarise(rows, 'baseline') : null
  const currentSummary = rows.length > 0 ? summarise(rows, 'current') : null
  const busy = phase === 'loading' || phase === 'running'

  return (
    <main className="eval">
      <h1>SnapSort accuracy test</h1>
      <p>
        Developer tool. Choose the folder that holds your held out photos. Inside it there should be one
        folder per category: Plastic, Paper, Glass, Metal and General Waste. The folder a photo is in is
        its true label. Nothing is uploaded: the photos are classified in this browser.
      </p>

      <label className="eval__field">
        Held out photo folder
        <input type="file" multiple ref={allowFolders} onChange={handleFolder} />
      </label>

      {selected.length > 0 && (
        <p>
          Found {selected.length} photos:{' '}
          {CLASSES.map(
            (name) => `${name} ${selected.filter((item) => item.label === name).length}`
          ).join(', ')}
          .
        </p>
      )}

      {skipped.length > 0 && (
        <p role="alert">
          {skipped.length} photos were skipped because the folder they are in is not named Plastic, Paper,
          Glass, Metal or General Waste (or the image could not be read)
        </p>
      )}

      <button className="eval__btn" onClick={handleRun} disabled={selected.length === 0 || busy}>
        Run the test
      </button>

      <p role="status">
        {phase === 'loading' && 'Loading both models...'}
        {phase === 'running' && `Classifying photo ${progress} of ${selected.length}...`}
        {phase === 'done' && `Done: ${rows.length} photos classified.`}
      </p>

      {errorMessage && (
        <p role="alert" className="eval__error">
          {errorMessage}
        </p>
      )}

      {phase === 'done' && baselineSummary && currentSummary && (
        <>
          <button className="eval__btn" onClick={() => downloadCsv(rows)}>
            Download results (CSV)
          </button>
          <p>
            With {rows.length} photos, one photo is about {(100 / rows.length).toFixed(1)} percentage
            points, so treat small differences as noise.
          </p>
          <ModelResults title="Baseline model (alpha, mostly TrashNet)" summary={baselineSummary} />
          <ModelResults title="Current model (retrained)" summary={currentSummary} />
        </>
      )}

      {phase === 'done' && unreadable.length > 0 && (
        <section className="eval__model">
          <h2>Photos that could not be opened</h2>
          <p>These were not counted. If they are .heic files, convert them to JPEG and run again.</p>
          <ul>
            {unreadable.map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}

export default EvalPage