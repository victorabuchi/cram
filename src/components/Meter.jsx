import { ProgressBar } from 'react-bootstrap'

// A progress bar with an accessible name. react-bootstrap puts aria attributes on the outer
// wrapper, but the progressbar role (and so the name) must be on the bar itself, hence the nesting.
function Meter({ now, label, height = 8, className }) {
  return (
    <ProgressBar className={className} style={{ height }}>
      <ProgressBar now={now} aria-label={label} />
    </ProgressBar>
  )
}

export default Meter
