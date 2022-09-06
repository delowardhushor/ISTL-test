const moment = require('moment')

exports.Weekdays = () => {
    return moment.weekdays()
}

exports.dateBetweenTwoDate = (startDate, endDate) => {
    var now = startDate.clone(), dates = [];

    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
    }
    return dates;
};
