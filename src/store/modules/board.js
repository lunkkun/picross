import Vue from 'vue'

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

    // returns the color for empty tiles
    defaultColor: state => {
      return state.colorScheme[0]
    },

    // checks whether the entire board is completed
    isCompleted: (state, getters) => {
      for (let rownum = 0; rownum < state.height; rownum++) {
        if (!getters.rowIsCompleted(rownum)) {
          return false
        }
      }

      for (let colnum = 0; colnum < state.height; colnum++) {
        if (!getters.columnIsCompleted(colnum)) {
          return false
        }
      }

      return true
    },

    // checks whether the row at the rownum is completed
    rowIsCompleted: (state, getters) => rownum => {
      let clues = getters.cluesForRow(rownum)
      let colored = getters.colorCountsForRowOrColumn(state.colored[rownum])

      if (colored.length !== clues.length) {
        return false
      }

      return clues.reduce((completed, clue, index) => {
        return completed && clue.color === colored[index].color && clue.count === colored[index].count
      }, true)
    },

    // checks whether the column at the colnum is completed
    columnIsCompleted: (state, getters) => colnum => {
      let clues = getters.cluesForColumn(colnum)
      let colored = getters.colorCountsForRowOrColumn(state.colored.map(row => row[colnum]))

      if (colored.length !== clues.length) {
        return false
      }

      return clues.reduce((completed, clue, index) => {
        return completed && clue.color === colored[index].color && clue.count === colored[index].count
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
      return getters.colorCountsForRowOrColumn(state.solution[rownum])
    },

    // returns the clues to display for a column
    cluesForColumn: (state, getters) => (colnum) => {
      return getters.colorCountsForRowOrColumn(state.solution.map(row => row[colnum]))
    },

    // helper function to return the color counts for a row or column
    colorCountsForRowOrColumn: state => rowOrColumn => {
      // We create a copy and push an extra 0 at the end to ensure the last clue will be added correctly
      let rowOrColumnCopy = rowOrColumn.slice()
      rowOrColumnCopy.push(0)
      return rowOrColumnCopy.reduce(({previous, count, clues}, color) => {
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
      let row = state.colored[rownum].slice() // create a copy
      let color = row[colnum]

      if (color === -1) {
        color = 1
      } else if (color === state.colorScheme.length - 1) {
        color = 0
      } else {
        color++
      }

      row[colnum] = color
      Vue.set(state.colored, rownum, row)
    },

    // marks a tile as explicitly set to empty by the user,
    // or sets the tile color to 0 if it was marked as empty before
    toggleTileMarkedAsEmpty: (state, {rownum, colnum}) => {
      let row = state.colored[rownum].slice() // create a copy
      row[colnum] = row[colnum] === -1 ? 0 : -1
      Vue.set(state.colored, rownum, row)
    },

    // clears all user-input
    clearColored: state => {
      state.colored = Array(state.height).fill(Array(state.width).fill(0))
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
