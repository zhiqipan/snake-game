const SnakeGame = require('./SnakeGame')

let game

describe('3-block snake', () => {
  beforeEach(() => {
    game = new SnakeGame()
    game.reset()
    game.snake.push({ x: 4, y: 2 })
    game.snake.push({ x: 3, y: 2 })
    game.snake.push({ x: 2, y: 2 })
    game.bonus = { x: 1, y: 1 }
  })

  it('initializes', () => {
    expect(game.snake).toEqual([{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }])
  })

  it('moves forward', () => {
    game.move()
    expect(game.snake).toEqual([{ x: 5, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 2 }])
  })

  it('moves left', () => {
    game.move('left')
    expect(game.snake).toEqual([{ x: 4, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 2 }])
  })

  it('moves right', () => {
    game.move('right')
    expect(game.snake).toEqual([{ x: 4, y: 3 }, { x: 4, y: 2 }, { x: 3, y: 2 }])
  })

  it('gets out', () => {
    game.move('left')
    game.move()
    expect(game.snake).toEqual([{ x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }])
    expect(game.hasLost()).toBeFalsy()
    game.move()
    expect(game.snake).toEqual([{ x: 4, y: -1 }, { x: 4, y: 0 }, { x: 4, y: 1 }])
    expect(game.hasLost()).toBeTruthy()
  })

  it('gets bonus and has new bonus regenerated', () => {
    game.move('left')
    game.move('left')
    game.move()
    game.move()
    expect(game.snake).toEqual([{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }])
    expect(game.bonus).toBeTruthy()
    expect(game.snake.includes({ x: game.bonus.x, y: game.bonus.y })).toBeFalsy()
  })
})

describe('4-block snake', () => {
  beforeEach(() => {
    game = new SnakeGame()
    game.reset()
    game.snake.push({ x: 4, y: 2 })
    game.snake.push({ x: 3, y: 2 })
    game.snake.push({ x: 2, y: 2 })
    game.snake.push({ x: 1, y: 2 })
    game.bonus = { x: 10, y: 10 }
  })

  it('does not bite the tail', () => {
    game.move('left')
    game.move('left')
    expect(game.snake).toEqual([{ x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 2 }])
    expect(game.hasLost()).toBeFalsy()
    game.move('left')
    expect(game.snake).toEqual([{ x: 3, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }])
    expect(game.hasLost()).toBeFalsy()
  })
})

describe('5-block snake', () => {
  beforeEach(() => {
    game = new SnakeGame()
    game.reset()
    game.snake.push({ x: 4, y: 2 })
    game.snake.push({ x: 3, y: 2 })
    game.snake.push({ x: 2, y: 2 })
    game.snake.push({ x: 1, y: 2 })
    game.snake.push({ x: 0, y: 2 })
    game.bonus = { x: 10, y: 10 }
  })

  it('crashes into itself', () => {
    game.move('left')
    game.move('left')
    expect(game.snake).toEqual([{ x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }])
    expect(game.hasLost()).toBeFalsy()
    game.move('left')
    expect(game.snake).toEqual([{ x: 3, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 3, y: 2 }])
    expect(game.hasLost()).toBeTruthy()
  })
})
