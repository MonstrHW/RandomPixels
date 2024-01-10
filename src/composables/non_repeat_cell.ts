import { computed, ref } from 'vue'

export default function useNonRepeatCell(
    w: number,
    h: number,
    cellWidth: number,
    cellHeight: number
) {
    const fieldWidth = Math.ceil(w / cellWidth)
    const fieldHeight = Math.ceil(h / cellHeight)
    const fieldSize = fieldWidth * fieldHeight
    const availSize = ref(fieldSize)

    const cells = Array<number>(fieldSize)
    for (let i = 0; i < fieldSize; i++) {
        cells[i] = i
    }

    return {
        get: () => {
            if (availSize.value === 0) {
                return null
            }

            const id = Math.floor(Math.random() * availSize.value)
            const point = cells[id]

            cells[id] = cells[availSize.value - 1]
            cells[availSize.value - 1] = point

            availSize.value--

            return {
                x: (point % fieldWidth) * cellWidth,
                y: Math.floor(point / fieldWidth) * cellHeight
            }
        },

        usedCount: computed(() => {
            return fieldSize - availSize.value
        }),

        remainCount: availSize,

        totalCount: fieldSize
    }
}
