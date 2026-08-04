const clientDatePattern = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s(\d{2}):(\d{2}))?$/;

const mysqlDatePattern = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;

const pad = (value) => String(value).padStart(2, "0");

const parseClientDate = (date) => {

    if (!date)
        return null;

    const match = date.trim().match(clientDatePattern);

    if (!match)
        return null;

    const [, day, month, year, hours, minutes] = match;

    return {
        year,
        month,
        day,
        hours,
        minutes,
        hasTime: Boolean(hours && minutes)
    };

};

const parseMysqlDate = (date) => {

    if (!date)
        return null;

    if (date instanceof Date) {

        return {
            year: date.getFullYear(),
            month: pad(date.getMonth() + 1),
            day: pad(date.getDate()),
            hours: pad(date.getHours()),
            minutes: pad(date.getMinutes()),
            hasTime: true
        };

    }

    const match = String(date).trim().match(mysqlDatePattern);

    if (!match)
        return null;

    const [, year, month, day, hours, minutes] = match;

    return {
        year,
        month,
        day,
        hours,
        minutes,
        hasTime: Boolean(hours && minutes)
    };

};

const formatDateForDatabase = (date) => {

    const parsedDate = parseClientDate(date);

    if (!parsedDate)
        return null;

    if (parsedDate.hasTime)
        return `${parsedDate.year}-${parsedDate.month}-${parsedDate.day} ${parsedDate.hours}:${parsedDate.minutes}:00`;

    return `${parsedDate.year}-${parsedDate.month}-${parsedDate.day}`;

};

const formatDateForResponse = (date) => {

    const parsedDate = parseMysqlDate(date);

    if (!parsedDate)
        return null;

    if (parsedDate.hasTime)
        return `${parsedDate.day}/${parsedDate.month}/${parsedDate.year} ${parsedDate.hours}:${parsedDate.minutes}`;

    return `${parsedDate.day}/${parsedDate.month}/${parsedDate.year}`;

};

const isFutureDate = (date) => {

    const databaseDate = formatDateForDatabase(date);

    if (!databaseDate)
        return false;

    return new Date(databaseDate) > new Date();

};

const isValidClientDate = (date) => Boolean(parseClientDate(date));

module.exports = {
    formatDateForDatabase,
    formatDateForResponse,
    isFutureDate,
    isValidClientDate
};