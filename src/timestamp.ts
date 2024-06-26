export const getISOTimestamp = ({ date, withMillisecond }: { date?: Date, withMillisecond?: boolean } = {}) => {
    if (!date) {
        date = new Date();
    }
    const year = date.getFullYear();
    const month = ((num) => num.toString().padStart(2, '0'))(date.getMonth() + 1);
    const day = ((num) => num.toString().padStart(2, '0'))(date.getDate());
    const hours = ((num) => num.toString().padStart(2, '0'))(date.getHours());
    const minutes = ((num) => num.toString().padStart(2, '0'))(date.getMinutes());
    const seconds = ((num) => num.toString().padStart(2, '0'))(date.getSeconds());
    
    let milliseconds = '';
    if (withMillisecond) {
        milliseconds = ((num) => '.'+num.toString().padStart(3, '0'))(date.getMilliseconds());
    }

    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const offsetHours = ((num) => num.toString().padStart(2, '0'))(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = ((num) => num.toString().padStart(2, '0'))(Math.abs(offset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;
};