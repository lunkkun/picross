import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    width: 0,
    height: 0,
    solution: [],
    colored: [],
    colorScheme: [],
    hoveredRownum: undefined,
    hoveredColnum: undefined,
    editing: false,
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

    // returns the colorScheme
    colorScheme: state => {
      return state.colorScheme
    },

    // returns whether we are in editing mode
    editing: state => {
      return state.editing
    },

    // checks whether the entire board is completed
    isCompleted: (state, getters) => {
      if (state.editing) {
        return false
      }

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
      if (state.editing) {
        return false
      }

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
      if (state.editing) {
        return false
      }

      let clues = getters.cluesForColumn(colnum)
      let colored = getters.colorCountsForRowOrColumn(state.colored.map(row => row[colnum]))

      if (colored.length !== clues.length) {
        return false
      }

      return clues.reduce((completed, clue, index) => {
        return completed && clue.color === colored[index].color && clue.count === colored[index].count
      }, true)
    },

    // returns whether a tile in this row is currently being hovered
    rowIsHovered: state => rownum => {
      return state.hoveredRownum === rownum
    },

    // returns whether a tile in this column is currently being hovered
    columnIsHovered: state => colnum => {
      return state.hoveredColnum === colnum
    },

    // returns the clues to display for a row
    cluesForRow: (state, getters) => rownum => {
      return getters.colorCountsForRowOrColumn(state.solution[rownum])
    },

    // returns the clues to display for a column
    cluesForColumn: (state, getters) => colnum => {
      return getters.colorCountsForRowOrColumn(state.solution.map(row => row[colnum]))
    },

    // helper function to return the color counts for a row or column
    colorCountsForRowOrColumn: state => rowOrColumn => {
      // We create a copy and push an extra 0 at the end to ensure the last clue will be added correctly
      let rowOrColumnCopy = rowOrColumn.slice()
      rowOrColumnCopy.push(0)
      return rowOrColumnCopy.reduce(({previous, count, clues}, value) => {
        if (value !== previous) {
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

        return {previous: value, count: ++count, clues: clues}
      }, {previous: 0, count: 0, clues: []}).clues
    },
  },
  mutations: {
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

    // sets a tile to the next color, if any
    setTileColorValue: ({state}, {rownum, colnum, value}) => {
      let board = state.editing
        ? state.solution
        : state.colored
      let row = board[rownum].slice() // create a copy
      row[colnum] = value
      Vue.set(board, rownum, row)
    },

    // marks the tile as currently being hovered
    setHovered: ({state}, {rownum, colnum}) => {
      state.hoveredRownum = rownum
      state.hoveredColnum = colnum
    },

    // unsets any tile from being hovered
    unsetHovered: ({state}) => {
      state.hoveredRownum = state.hoveredColnum = undefined
    },
  },
}
