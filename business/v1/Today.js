module.exports = function today() {
    let date = new Date()
    let d = date.getDate()
    let m = (parseInt(date.getMonth()) + 1)
    let y = date.getFullYear()

    if (d < 10)
        d = '0' + d

    if (m < 10)
        m = '0' + m

    let today = d + '-' + m + '-' + y

    return today
}