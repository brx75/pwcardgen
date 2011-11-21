// pad function taken from "http://www.electrictoolbox.com/pad-number-zeroes-javascript/"
function pad(number, length,padding) {
    var str = '' + number;
    while (str.length < length) {
        str = padding + str;
    }
    return str;
}
