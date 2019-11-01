const SnakeGame = require('./SnakeGame')
const Agent = require('./Agent')

const game = new SnakeGame(6, 6)
game.reset()

game.snake.push({ x: 4, y: 2 })
game.snake.push({ x: 3, y: 2 })
game.snake.push({ x: 2, y: 2 })
game.snake.push({ x: 1, y: 2 })
game.bonus = { x: 2, y: 3 }

const agent = new Agent(game)

agent.startTrajectory()

console.log(JSON.stringify(agent.values, null, 2))
