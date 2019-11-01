const ANY = 'any'

class Agent {
  constructor(snakeGame) {
    this.game = snakeGame
    this.values = {}
    this.counters = {}
    this.epsilon = 0.6
    this.discount = 1
  }

  pickGreedyAction() {
    const state = this.game.getCurrState()
    const left = this.getValue(state, 'left')
    const right = this.getValue(state, 'right')
    const up = this.getValue(state, 'up')
    const down = this.getValue(state, 'down')
    const actions = { left, right, up, down }
    const actionValues = Object.values(actions)
    const greedyIndex = actionValues.indexOf(Math.max(...actionValues))
    return Object.keys(actions)[greedyIndex]
  }

  pickRandomAction() {
    const actions = ['left', 'right', 'up', 'down']
    return actions[Math.floor(Math.random() * actions.length)]
  }

  getValue({ x0, y0, x1, y1 }, action) {
    if (!action) action = ANY
    if (!this.values[x0]) return 0
    if (!this.values[x0][y0]) return 0
    if (!this.values[x0][y0][x1]) return 0
    if (!this.values[x0][y0][x1][y1]) return 0
    if (!this.values[x0][y0][x1][y1][action]) return 0

    return this.values[x0][y0][x1][y1][action]
  }

  updateValue({ x0, y0, x1, y1 }, action, value) {
    if (!action) action = ANY
    if (!this.values[x0]) this.values[x0] = {}
    if (!this.values[x0][y0]) this.values[x0][y0] = {}
    if (!this.values[x0][y0][x1]) this.values[x0][y0][x1] = {}
    if (!this.values[x0][y0][x1][y1]) this.values[x0][y0][x1][y1] = {}

    if (!this.counters[x0]) this.counters[x0] = {}
    if (!this.counters[x0][y0]) this.counters[x0][y0] = {}
    if (!this.counters[x0][y0][x1]) this.counters[x0][y0][x1] = {}
    if (!this.counters[x0][y0][x1][y1]) this.counters[x0][y0][x1][y1] = {}
    if (!this.counters[x0][y0][x1][y1][action]) this.counters[x0][y0][x1][y1][action] = 0
    this.counters[x0][y0][x1][y1][action] += 1

    // Vn = (n-1/n) * Vn-1 + (1/n) * value
    const n = this.counters[x0][y0][x1][y1][action]
    const V = this.getValue({ x0, y0, x1, y1 }, action)
    const newV = (n - 1) / n * V + 1 / n * value
    this.values[x0][y0][x1][y1][action] = newV
  }

  start() {
    this.game.reset()
    this.game.start()
  }

  move(keystroke) {
    this.game.moveByKeystroke(keystroke)
  }

  startTrajectory() {
    this.start()
    const trajectory = []
    const state = this.game.getCurrState()
    const reward = this.game.getCurrReward()
    trajectory.push({ state, reward, action: null })

    while (true) {
      const greedy = Math.random() < this.epsilon
      const action = greedy ? this.pickGreedyAction() : this.pickRandomAction()
      this.move(action)

      if (this.game.hasLost()) break

      trajectory[trajectory.length - 1].action = action
      const state = this.game.getCurrState()
      const reward = this.game.getCurrReward()
      trajectory.push({ state, reward, action: null })
    }

    this.performBackup(trajectory)
  }

  performBackup(trajectory) {
    for (let i = trajectory.length - 1; i >= 0; i--) {
      const currStep = trajectory[i]
      const nextStep = trajectory[i + 1]
      let newValue = currStep.reward
      if (nextStep) {
        newValue += this.getValue(nextStep.state, nextStep.action) * this.discount
      }
      this.updateValue(currStep.state, currStep.action, newValue)
    }
  }
}

module.exports = Agent
