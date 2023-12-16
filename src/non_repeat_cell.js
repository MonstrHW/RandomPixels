export function useNonRepeatCell(w, h, cellWidth, cellHeight) {
    const fieldWidth = Math.ceil(w / cellWidth);
    const fieldHeight = Math.ceil(h / cellHeight);
    const fieldSize = fieldWidth * fieldHeight;
    let availSize = fieldSize;

    let cells = Array(fieldSize);
    for (let i = 0; i < fieldSize; i++) {
        cells[i] = i;
    }

    return {
        get: function () {
            if (availSize === 0) {
                return null;
            }

            const id = Math.floor(Math.random() * availSize);
            const point = cells[id];

            [cells[id], cells[availSize - 1]] = [
                cells[availSize - 1],
                cells[id],
            ];
            availSize--;

            return {
                x: (point % fieldWidth) * cellWidth,
                y: Math.floor(point / fieldWidth) * cellHeight,
            };
        },

        usedCount: function () {
            return fieldSize - availSize;
        },

        remainCount: function () {
            return availSize;
        },

        totalCount: function () {
            return fieldSize;
        },
    };
}
