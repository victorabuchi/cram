import { Form } from 'react-bootstrap'
import { TOPICS } from '../data/content'

// Checkbox list of topics with question counts. `selected` is an array of topic keys.
function TopicPicker({ topics, items, selected, onChange }) {
  const toggle = (k) => onChange(selected.includes(k) ? selected.filter((x) => x !== k) : [...selected, k])
  return (
    <div className="my-3">
      {topics.map((k) => (
        <Form.Check
          key={k}
          id={`topic-${k}`}
          label={`${TOPICS[k]} (${items.filter((i) => i.topic === k).length} questions)`}
          checked={selected.includes(k)}
          onChange={() => toggle(k)}
        />
      ))}
    </div>
  )
}

export default TopicPicker
