export const getISOWithoutMilliseconds = (date: Date) => {
    const year = date.getFullYear();
    const month = ((num) => num.toString().padStart(2, '0'))(date.getMonth() + 1);
    const day = ((num) => num.toString().padStart(2, '0'))(date.getDate());
    const hours = ((num) => num.toString().padStart(2, '0'))(date.getHours());
    const minutes = ((num) => num.toString().padStart(2, '0'))(date.getMinutes());
    const seconds = ((num) => num.toString().padStart(2, '0'))(date.getSeconds());

    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const offsetHours = ((num) => num.toString().padStart(2, '0'))(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = ((num) => num.toString().padStart(2, '0'))(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
};