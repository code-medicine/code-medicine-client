export const Ucfirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const shift_timezone_to_pakistan = (date) => {
    // console.log('DATE raw object', date)
    const temp = new Date(date);
    // -300 is the value in gmt +5:00 which is the local timezone for pakistan
    // 60000 is multiplied to convert hours into seconds
    //  getTime() returns seconds
    // if (temp.getTimezoneOffset() !== -300) {
    //     console.log('date change')
    return new Date(temp.getTime() - (-300 * 60000));
    // console.log('date',updated_date)
    // return updated_date;
}

export const get_utc_date = (input_date) => {

    var date = new Date(input_date);
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    return new Date(now_utc);
}

export const convert_object_array_to_string = (array, key_to_select) => {
    return array.map((item) => {
        return item[key_to_select]
    }).toString();
}