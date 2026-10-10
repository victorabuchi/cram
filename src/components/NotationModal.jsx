import { Modal, Table } from 'react-bootstrap'

// The formal DFA notation in plain words, with the Exercise 1 task 1 automaton as the example.
function NotationModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" aria-labelledby="notation-title">
      <Modal.Header closeButton>
        <Modal.Title id="notation-title" as="h2" className="h5">Notation cheat sheet: Q, Σ, s, F, δ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>A DFA is a machine that reads a word one symbol at a time and, at the end, says <strong>accept</strong> or <strong>reject</strong>. The formal block is just five facts about the machine:</p>
        <Table size="sm" bordered responsive>
          <thead><tr><th scope="col">Symbol</th><th scope="col">Means</th><th scope="col">In the example</th></tr></thead>
          <tbody>
            <tr><td>Q</td><td>the set of <strong>states</strong>: the situations the machine can be in (drawn as circles)</td><td>{'{q0, q1, q2, q3, q4, q5}'}: six states</td></tr>
            <tr><td>Σ (sigma)</td><td>the <strong>alphabet</strong>: the symbols the machine can read</td><td>{'{1, 2, 3}'}</td></tr>
            <tr><td>s</td><td>the <strong>start state</strong> (the triangle arrow)</td><td>q0</td></tr>
            <tr><td>F</td><td>the <strong>accepting states</strong> (double circles): ending here means accepted</td><td>{'{q0}'}</td></tr>
            <tr><td>δ (delta)</td><td>the <strong>transition rules</strong>: δ(state, symbol) = next state</td><td>the long list in the braces</td></tr>
          </tbody>
        </Table>
        <p><strong>Reading one rule.</strong> δ(q4, 3) = q1 says: "if you are in q4 and read the symbol 3, go to q1." It is just one arrow. The long block is every arrow written as a list: one row per state, one column per symbol.</p>
        <p><strong>The same example as a table</strong> (state qi, reading k, goes to q(i + k mod 6)):</p>
        <Table size="sm" bordered responsive className="w-auto">
          <thead><tr><th scope="col">state</th><th scope="col">on 1</th><th scope="col">on 2</th><th scope="col">on 3</th></tr></thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <tr key={i}><th scope="row">q{i}</th>{[1, 2, 3].map((k) => <td key={k}>q{(i + k) % 6}</td>)}</tr>
            ))}
          </tbody>
        </Table>
        <p><strong>Running it.</strong> Input 1 2 3: start in q0; read 1 → q1; read 2 → q3; read 3 → q0. The input is used up and q0 is in F, so the word is <strong>accepted</strong>. (Their sum 1 + 2 + 3 = 6 leaves remainder 0 when divided by 6, which is why q0 accepts.)</p>
        <p className="mb-0"><strong>Words to know.</strong> <em>word / string</em>: a sequence of symbols. <em>mod 6</em>: the remainder after dividing by 6 (7 mod 6 = 1). <em>chain</em>: writing the states you pass through, q0 → q1 → q3 → q0.</p>
      </Modal.Body>
    </Modal>
  )
}

export default NotationModal
