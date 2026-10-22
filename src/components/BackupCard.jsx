import { useRef, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { backupCode, backupJson, collectData, restoreData } from '../storage'

// Progress is saved in this browser only. This moves it to another browser or phone (a file or a code you paste), and takes it back.
function BackupCard() {
  const [code, setCode] = useState('')
  const fileRef = useRef(null)

  const download = () => {
    const blob = new Blob([backupJson(collectData())], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `cram-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('Backup file saved')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(backupCode(collectData()))
      toast.success('Backup code copied. Paste it into a message to yourself.')
    } catch {
      toast.error('Could not copy. Use the backup file instead.')
    }
  }

  const restore = (text) => {
    try {
      const n = restoreData(text)
      toast.success(`Restored (${n} answered questions in the backup). Reloading…`)
      setTimeout(() => window.location.reload(), 900)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const chooseFile = async (e) => {
    const file = e.target.files?.[0]
    if (file) restore(await file.text())
    e.target.value = ''
  }

  return (
    <Card body className="mb-4">
      <h2 className="h6">Move your progress to another browser or phone</h2>
      <p className="small text-body-secondary">
        Your progress is saved in this browser only. If you use another browser, a phone or clear your browser data, it starts empty. Make a backup here and restore it there. Restoring never deletes what is already there: for each question the one with more answers is kept.
      </p>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Button onClick={download}>Download backup file</Button>
        <Button variant="secondary" onClick={copy}>Copy backup code</Button>
      </div>
      <Form onSubmit={(e) => { e.preventDefault(); restore(code) }}>
        <Form.Group controlId="backup-code" className="mb-2">
          <Form.Label className="small fw-semibold">Restore: paste a backup code, or choose a backup file</Form.Label>
          <Form.Control as="textarea" rows={2} className="font-monospace" value={code} onChange={(e) => setCode(e.target.value)} placeholder="cram1:…" spellCheck={false} />
        </Form.Group>
        <div className="d-flex flex-wrap gap-2">
          <Button type="submit" variant="success" disabled={!code.trim()}>Restore from code</Button>
          <Button type="button" variant="dark" onClick={() => fileRef.current?.click()}>Choose backup file…</Button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={chooseFile} aria-label="Backup file" />
        </div>
      </Form>
    </Card>
  )
}

export default BackupCard
