import { Accordion, Button, Card, Col, Row } from 'react-bootstrap'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import Meter from '../components/Meter.jsx'
import { SUBJECTS } from '../data/subjects'
import { ITEMS, scopedItems } from '../data/content'
import { useProgress } from '../hooks/useProgress'
import { isMastered, streak, todayKey } from '../storage'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const DAY = 86400000
const lastSevenDays = () => Array.from({ length: 7 }, (_, i) => new Date(Date.now() - (6 - i) * DAY))

function Progress() {
  const { progress, days, reset: resetAll } = useProgress()
  const weeks = SUBJECTS.flatMap((s) => s.weeks.map((w) => ({ ...w, subject: s })))
  const stats = weeks.map((w) => {
    const items = scopedItems(w.subject.id, w.n)
    const mastered = items.filter((i) => isMastered(progress, i.id)).length
    return { ...w, items, mastered, attempted: items.filter((i) => progress[i.id]).length }
  })
  const totalMastered = stats.reduce((n, s) => n + s.mastered, 0)

  const reset = () => {
    if (!window.confirm('Erase all progress?')) return
    resetAll()
    toast.info('Progress reset')
  }

  return (
    <div>
      <h1 className="h3 mb-3">Progress</h1>
      <Row xs={1} md={3} className="g-3 mb-4">
        <Col><Card body><div className="fs-3 fw-bold">{totalMastered}/{ITEMS.length}</div><div className="text-body-secondary small">questions mastered</div></Card></Col>
        <Col><Card body><div className="fs-3 fw-bold">{streak(days)}</div><div className="text-body-secondary small">day streak</div></Card></Col>
        <Col><Card body><div className="fs-3 fw-bold">{days[todayKey()] || 0}</div><div className="text-body-secondary small">answered today</div></Card></Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card body>
            <h2 className="h6">Mastered by week (%)</h2>
            <Bar
              role="img"
              aria-label={`Percent mastered by week: ${stats.map((s) => `week ${s.n} ${s.items.length ? Math.round((s.mastered / s.items.length) * 100) : 0}%`).join(', ')}`}
              options={{ scales: { y: { min: 0, max: 100 } }, plugins: { legend: { display: false } } }}
              data={{
                labels: stats.map((s) => `Week ${s.n}`),
                datasets: [{ data: stats.map((s) => (s.items.length ? Math.round((s.mastered / s.items.length) * 100) : 0)), backgroundColor: '#3b5bdb' }],
              }}
            />
          </Card>
        </Col>
        <Col md={6}>
          <Card body>
            <h2 className="h6">Questions answered, last 7 days</h2>
            <Bar
              role="img"
              aria-label={`Questions answered in the last 7 days: ${lastSevenDays().map((d) => `${d.toLocaleDateString(undefined, { weekday: 'long' })} ${days[todayKey(d)] || 0}`).join(', ')}`}
              options={{ scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }, plugins: { legend: { display: false } } }}
              data={{
                labels: lastSevenDays().map((d) => d.toLocaleDateString(undefined, { weekday: 'short' })),
                datasets: [{ data: lastSevenDays().map((d) => days[todayKey(d)] || 0), backgroundColor: '#51cf8a' }],
              }}
            />
          </Card>
        </Col>
      </Row>

      {SUBJECTS.map((s) => (
        <section key={s.id}>
          <h2 className="h5">{s.title}</h2>
          {stats.filter((w) => w.subject === s && w.items.length).map((w) => {
            const weak = w.items.filter((d) => progress[d.id] && progress[d.id].box < 2).map((d) => d.q || d.title)
            return (
              <div key={w.n} className="mb-3">
                <div className="d-flex justify-content-between">
                  <strong>Week {w.n}: {w.title}</strong>
                  <span className="text-body-secondary small">{w.mastered} mastered · {w.attempted} attempted · {w.items.length} total</span>
                </div>
                <Meter now={(w.mastered / w.items.length) * 100} height={10} label={`Week ${w.n} mastered`} />
                {weak.length > 0 && (
                  <Accordion className="mt-2">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Needs work ({weak.length})</Accordion.Header>
                      <Accordion.Body><ul className="mb-0">{weak.map((x) => <li key={x}>{x}</li>)}</ul></Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                )}
              </div>
            )
          })}
        </section>
      ))}
      <hr />
      <Button variant="outline-danger" onClick={reset}>Reset all progress</Button>
    </div>
  )
}

export default Progress
