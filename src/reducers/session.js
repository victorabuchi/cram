// State machine shared by Practice sessions and Practice tests.
// state: { items, index, right, wrong[], results{}, drafts{} }  (null before a session starts)
//   results: what was scored for each question; drafts: what the student had entered (so Back shows it as it was left)
export function startSession(items) {
  return { items, index: 0, right: 0, wrong: [], results: {}, drafts: {} }
}

export function sessionReducer(state, action) {
  switch (action.type) {
    case 'start':
      return startSession(action.items)
    case 'answer': {
      // practice: count right/wrong; mock: also keep the details for the results page
      const { item, score, detail } = action
      const ok = score !== null && score >= 0.7
      return {
        ...state,
        right: state.right + (ok ? 1 : 0),
        wrong: ok || score === null ? state.wrong : [...state.wrong, item],
        results: { ...state.results, [item.id]: { score, ...detail } },
      }
    }
    case 'draft':
      return { ...state, drafts: { ...state.drafts, [action.id]: action.draft } }
    case 'next':
      return { ...state, index: state.index + 1 }
    case 'back':
      return { ...state, index: Math.max(0, state.index - 1) }
    case 'end':
      return null
    default:
      return state
  }
}

export const isFinished = (s) => s.index >= s.items.length
