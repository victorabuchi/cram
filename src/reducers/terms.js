// state: array of { key, title, note }
export function termsReducer(state, action) {
  switch (action.type) {
    case 'save':
      return state.some((t) => t.key === action.term.key) ? state : [...state, { note: '', ...action.term }]
    case 'remove':
      return state.filter((t) => t.key !== action.key)
    case 'note':
      return state.map((t) => (t.key === action.key ? { ...t, note: action.note } : t))
    default:
      return state
  }
}
