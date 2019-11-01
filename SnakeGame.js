class SnakeGame {
  constructor(width = 18, height = 18) {
    this.snake = []
    this.bonus = null
    this.MIN_X = 0
    this.MIN_Y = 0
    this.MAX_X = width - 1
    this.MAX_Y = height - 1
  }

  reset() {
    this.snake.length = 0
    this.bonus = null
  }

  start() {
    this.snake.push({ x: 4, y: 2 })
    this.snake.push({ x: 3, y: 2 })
    this.snake.push({ x: 2, y: 2 })
    this.bonus = { x: 1, y: 1 }
  }

  generateRandomBonus() {
    const generate = () => {
      const x = Math.floor(Math.random() * (this.MAX_X + 1))
      const y = Math.floor(Math.random() * (this.MAX_Y + 1))
      return { x, y }
    }

    while (true) {
      const { x, y } = generate()
      if (!this.snake.includes({ x, y })) {
        this.bonus = { x, y }
        break
      }
    }
  }

  getDefaultMove() {
    const head = this.snake[0]
    const second = this.snake[1]

    return { delX: head.x - second.x, delY: head.y - second.y }
  }

  getLeftMove() {
    const { delX, delY } = this.getDefaultMove()
    if (delX === 1) return { delX: 0, delY: -1 }
    if (delX === -1) return { delX: 0, delY: 1 }
    if (delY === 1) return { delX: 1, delY: 0 }
    if (delY === -1) return { delX: -1, delY: 0 }
  }

  getRightMove() {
    const { delX, delY } = this.getLeftMove()
    return { delX: -delX, delY: -delY }
  }

  moveByKeystroke(key) {
    const getKeystrokeDirectionMap = () => {
      const { delX, delY } = this.getDefaultMove()
      if (delX === 1) return { up: 'left', down: 'right' }
      if (delX === -1) return { up: 'right', down: 'left' }
      if (delY === 1) return { left: 'right', right: 'left' }
      if (delY === -1) return { left: 'left', right: 'right' }
    }

    const action = getKeystrokeDirectionMap()[key]
    this.move(action)
  }

  getCurrReward() {
    return this.snake.length
  }

  getCurrState() {
    const head = this.snake[0]
    const second = this.snake[1]
    return { x0: head.x, y0: head.y, x1: second.x, y1: second.y }
  }

  move(direction) {
    if (this.hasLost()) return

    const tail = this.snake.pop()
    const head = this.snake[0]
    let delX, delY
    switch (direction) {
    case 'left':
      const leftMove = this.getLeftMove()
      delX = leftMove.delX
      delY = leftMove.delY
      break
    case 'right':
      const rightMove = this.getRightMove()
      delX = rightMove.delX
      delY = rightMove.delY
      break
    default:
      const defaultMove = this.getDefaultMove()
      delX = defaultMove.delX
      delY = defaultMove.delY
      break
    }
    const newHead = { x: head.x + delX, y: head.y + delY }
    this.snake.unshift(newHead)
    if (newHead.x === this.bonus.x && newHead.y === this.bonus.y) {
      this.snake.push(tail)
      this.generateRandomBonus()
    }
  }

  hasLost() {
    const head = this.snake[0]
    const crash = this.snake.filter(({ x, y }) => x === head.x && y === head.y).length > 1
    const out = head.x < this.MIN_X || head.x > this.MAX_X || head.y < this.MIN_Y || head.y > this.MAX_Y
    return crash || out
  }
}

module.exports = SnakeGame
