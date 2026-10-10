// Parse trees as text, for the answers. A tree is { sym, kids } (leaves have no kids). Drawn like the `tree` command.
export const node = (sym, ...kids) => ({ sym, kids })

export function treeText(tree) {
  const lines = [tree.sym]
  const walk = (kids, prefix) => {
    kids.forEach((kid, i) => {
      const last = i === kids.length - 1
      lines.push(`${prefix}${last ? '└─ ' : '├─ '}${kid.sym}`)
      walk(kid.kids ?? [], prefix + (last ? '   ' : '│  '))
    })
  }
  walk(tree.kids ?? [], '')
  return lines.join('\n')
}

// The grammar of arithmetic expressions (exercise 4 task 6):  S -> E,  E -> E + T | T,  T -> T * F | F,  F -> n | ( E )
// A recursive-descent parser that builds the parse tree of a string made of n + * ( ).
export function expressionTree(input) {
  const chars = [...input]
  let pos = 0
  const peek = () => chars[pos]
  const eat = (c) => {
    if (chars[pos] !== c) throw new Error(`expected ${c} at ${pos} in ${input}`)
    pos++
    return node(c)
  }
  const factor = () => {
    if (peek() === 'n') return node('F', eat('n'))
    return node('F', eat('('), expr(), eat(')'))
  }
  const term = () => {
    let t = node('T', factor())
    while (peek() === '*') {
      const star = eat('*')
      t = node('T', t, star, factor())
    }
    return t
  }
  const expr = () => {
    let e = node('E', term())
    while (peek() === '+') {
      const plus = eat('+')
      e = node('E', e, plus, term())
    }
    return e
  }
  const tree = node('S', expr())
  if (pos !== chars.length) throw new Error(`not an expression: ${input}`)
  return tree
}

export const leaves = (tree) => (tree.kids?.length ? tree.kids.flatMap(leaves) : [tree.sym]).join('')
