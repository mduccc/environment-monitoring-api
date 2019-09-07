module.exports = function todayWithHour() {
    let date = new Date()
    let d = date.getDate()
    let m = (parseInt(date.getMonth()) + 1)
    let y = date.getFullYear()
    let h = date.getHours()
    let mi = date.getMinutes()

    if (d < 10)
        d = '0' + d

    if (m < 10)
        m = '0' + m

    if (h < 10)
        h = '0' + h

    if (mi < 10)
        mi = '0' + mi

    let today = d + '-' + m + '-' + y + ' ' + h + ':' + mi

    return today
}