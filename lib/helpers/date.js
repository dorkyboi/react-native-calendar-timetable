export const minDiff = (a, b) => Math.floor(Math.abs(b - a) / 1000 / 60);
export const daysDiff = (a, b) => Math.floor(Math.abs(b - a) / 1000 / 60 / 60 / 24) || 0;
export const getDayMinutes = (date) => (date.getHours() * 60) + date.getMinutes();
export const dateRangesOverlap = (aStart, aEnd, bStart, bEnd) => {
    if (aStart <= bStart && bStart <= aEnd)
        return true; // b starts in a
    if (aStart <= bEnd && bEnd <= aEnd)
        return true; // b ends in a
    if (bStart <= aStart && aEnd <= bEnd)
        return true; // a in b
    return false;
};
export const normalizeTime = (date, hours = 0, min = 0, sec = 0, ms = 0) => {
    let copy = new Date(date);
    copy.setHours(hours, min, sec, ms);
    return +copy;
};
//# sourceMappingURL=date.js.map