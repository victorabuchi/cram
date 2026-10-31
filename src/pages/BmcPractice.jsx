import { Card } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import PaperQuestion from '../components/PaperQuestion.jsx'
import { practiceSet } from '../data/bmc/practiceSet'
import { useProgress } from '../hooks/useProgress'

// Basic Models of Computation: the exercise topics again with other values, one section per topic.
// Solve on paper, then compare with the answer. Solved marks are saved, but these questions are not in the progress totals.
function BmcPractice() {
  const { week } = useParams()
  const { record } = useProgress()
  const groups = [...new Set(practiceSet.map((p) => p.group))]

  return (
    <>
      <Crumbs subjectId="bmc" week={week} current="Practice" />
      <h1 className="h3">Practice</h1>
      <p className="text-body-secondary">The exercise topics again with other values: other numbers, other letters, other grammars, other problems. Solve each one on paper, then compare with the answer.</p>
      {groups.map((group, n) => (
        <section key={group} className="mb-4" aria-label={group}>
          <h2 className="h5 mb-3">{n + 1}. {group}</h2>
          {practiceSet.filter((p) => p.group === group).map((item) => (
            <Card body key={item.id} className="mb-3" as="article" aria-label={item.title}>
              <PaperQuestion item={item} level={3} onScore={(correct) => record(item.id, correct)} />
            </Card>
          ))}
        </section>
      ))}
    </>
  )
}

export default BmcPractice
