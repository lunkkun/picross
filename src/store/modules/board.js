export default {
  namespaced: true,
  state: {
    width: 0,
    height: 0,
    solution: [],
    colored: [],
    colorScheme: [],
  },
  getters: {
    // returns the width of the board
    width: state => {
      return state.width
    },

    // returns the height of the board
    height: state => {
      return state.height
    },

    // returns the default color of the board to use in case the user hasn't clicked on a tile yet
    defaultColor: state => {
      return state.colorScheme[0]
    },

    // checks whether the entire board is completed
    isCompleted: (state, getters) => {
      return state.colored.reduce((previousCompleted, row, rownum) => {
        return previousCompleted && getters.rowIsCompleted(rownum)
      }, true)
    },

    // checks whether the row at the rownum is completed
    rowIsCompleted: state => rownum => {
      return state.colored[rownum].reduce((previousCompleted, color, colnum) => {
        return previousCompleted && state.solution[rownum][colnum] === Math.max(color, 0) // treat -1 as 0
      }, true)
    },

    // checks whether the column at the colnum is completed
    columnIsCompleted: state => colnum => {
      return state.colored.reduce((previousCompleted, row, rownum) => {
        return previousCompleted && state.solution[rownum][colnum] === Math.max(row[colnum], 0) // treat -1 as 0
      }, true)
    },

    // returns the way the requested tile was colored
    tileColor: state => (rownum, colnum) => {
      let color = Math.max(state.colored[rownum][colnum], 0) // treat -1 as 0
      return state.colorScheme[color]
    },

    // checks whether the user has explicitly marked the tile as empty
    tileMarkedAsEmpty: state => (rownum, colnum) => {
      return state.colored[rownum][colnum] === -1
    },

    // returns the clues to display for a row
    cluesForRow: (state, getters) => (rownum) => {
      return getters.cluesForRowOrColumn(state.solution[rownum])
    },

    // returns the clues to display for a row
    cluesForColumn: (state, getters) => (colnum) => {
      return getters.cluesForRowOrColumn(state.solution.map(row => row[colnum]))
    },

    // helper function to return the clues for a row or column
    cluesForRowOrColumn: state => rowOrColumn => {
      // We're pushing an extra 0 at the end to ensure the last clue will be added correctly
      return rowOrColumn.push(0).reduce(({previous, count, clues}, color) => {
        if (color !== previous) {
          if (previous > 0) {
            // A block of colored tiles has ended; add a clue for it
            clues.push({
              color: state.colorScheme[previous],
              count: count,
            })
          }

          // reset the count for the current color
          count = 0
        }

        return {previous: color, count: ++count, clues: clues}
      }, {previous: 0, count: 0, clues: []}).clues
    },
  },
  mutations: {
    // sets a tile to the next color, if any
    incrementTileColor: (state, {rownum, colnum}) => {
      let color = state.colored[rownum][colnum]

      if (color === -1) {
        color = 1
      } else if (color === state.colorScheme.length - 1) {
        color = 0
      } else {
        color++
      }

      state.colored[rownum][colnum] = color
    },

    // marks a tile as explicitly set to empty by the user
    markTileAsEmpty: (state, {rownum, colnum}) => {
      state.colored[rownum][colnum] = -1
    },

    // clears all user-input
    clearColored: state => {
      state.colored.fill([].fill(0, 0, state.width), 0, state.height)
    },
  },
  actions: {
    load: ({commit, state}, {solution, colorScheme}) => {
      state.solution = solution
      state.height = solution.length
      state.width = solution.length > 0 ? solution[0].length : 0
      state.colorScheme = colorScheme
      commit('clearColored')
    },
  },
}
