export function getRemainTime(remainCount: number, rate: number): string {
    const remainTime = remainCount / rate

    try {
        return new Date(remainTime * 1000).toISOString().slice(11, 19)
    } catch (e) {
        return new Date(0).toISOString().slice(11, 19)
    }
}
