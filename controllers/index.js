function _JsonArray(data) {
    let obj = {};
    obj.res = [...data];

    const
        filter = (data, query) => data.filter((el, index) => {
            if (query) return query(el, index);
            return el === el
        }),
        update = (item) => {
            const items = Object.keys(item) || {};
            obj.res.forEach((f) => {
                data.findIndex((e) => {
                    if (e === f)
                        for (const element of items) {
                            e[element] = item[element];
                        }
                })
            })
            return data;
        },
        del = (first) => {
            if(first) {
                obj.res.forEach((f) => data.splice(data.findIndex((e) => e === f), 1))
            }
            else {
                obj.res.forEach((f) => data.splice(data.findIndex((e) => e === f), 1))
            }
            return data
        },
        sum = () => {
            return obj.res.reduce(
                (sums, obj) =>
                    Object.keys(obj).reduce((s, k) => {
                        s[k] = (s[k] || 0) + +obj[k];
                        return s;
                    }, sums),
                {}
            );
        },
        groupBy = (key) => {
            return obj.res.reduce((result, currentValue) => {
                (result[currentValue[key]] = result[currentValue[key]] || []).push(
                    currentValue
                );

                return result;
            }, {});
        },
        removeDpl = (column) => {
            if (column) {
                let lookup = new Set();
                return obj.res.filter(
                    (item) => !lookup.has(item[column]) && lookup.add(item[column])
                );
            }
        };

    obj.delete = () => {
        obj.res = del();
        return obj
    };
    obj.where = (query) => {
        obj.res = filter(obj.res, query);
        return obj
    }
    obj.update = (item) => {
        obj.res = update(item);
        return obj
    }
    obj.removeDuplicate = (column) => {
        obj.res = removeDpl(column)
        return obj
    }
    obj.groupBy = (column, array) => {
        obj.res = groupBy(column)
        if(array){
            const arr = []

            for (const item of Object.keys(obj.res)){
                arr.push(obj.res[item])
            }
            obj.res = [...arr]
        }
        return obj
    }
    obj.sum = () => {
        obj.res = sum();
        return obj
    };
    obj.insert = (item) => {
        obj.res.push(item)
        return obj;
    }
    obj.isEqual = (newArray, handler) => {
        const eq = isEqual(obj.res, newArray)
        if (eq && handler) handler()
        return eq
    }
    obj.isIterable = () => {
        if (obj.res == null) return false;
        return typeof obj.res[Symbol.iterator] === 'function';
    };
    obj.sort = (column) => {
        const sortBy = () => (a, b) => {
            if (a[column] > b[column]) return 1;
            else if (a[column] < b[column]) return -1;
            return 0;
        };
        return obj.res.sort(sortBy(column));
    };
    obj.fetch = async (options)=>{
        if(options.style){
            const style = document.createElement('style');
            style.textContent = options.style;
            options.el.Append(style);
        }
        for await (const item of obj.res) {
            options.el.Html().append(options.template(item));
        }
        if(options.failed) {
            !obj.res.length && options.failed(options.el)
        }

        options.el.data = obj.res;

        return options.el;
    };
    obj.shuffle = () => obj.res.sort(() => 0.5 - Math.random());
    obj.average = () => obj.res.reduce((a, b) => a + b) / obj.res.length;

    return obj;
}

function isEqual(value, other) {

    let type = Object.prototype.toString.call(value);

    if (type !== Object.prototype.toString.call(other)) return false;

    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    let valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    let otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    const compare = function(item1, item2) {

        let itemType = Object.prototype.toString.call(item1);

        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        } else {

            if (itemType !== Object.prototype.toString.call(item2)) return false;

            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    if (type === '[object Array]') {
        for (let i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    return true;
}

const Random = {
    randomNumberInRange : (min = 0, max = 100) =>
        Math.floor(Math.random() * (max - min + 1)) + min,
    randomHex : () =>
        `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0")}`,
}

const Convert = {
    rgb_Hex : (r, g, b) =>
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
    celsius_fahrenheit : (celsius) => celsius * 9/5 + 32,
    fahrenheit_celsius : (fahrenheit) => (fahrenheit - 32) * 5/9,
    bytes_Size(bytes) {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes.toString() === "0") return "0 Byte";
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
    object_style(obj){
        let s = Object.keys(obj)
            .map((key) => key + ": " + obj[key])
            .join(";");
        return ("'" + s + "'").slice(1).slice(0, -1);
    },
    seconds_time(seconds){
        const date = new Date(seconds * 1000);
        const hours = "0" + date.getHours();
        const minutes = "0" + date.getMinutes();
        const second = "0" + date.getSeconds();
        return  hours.substr(-2) + ':' + minutes.substr(-2) + ':' + second.substr(-2);
    },
    seconds_hour(seconds){
        return this
            .seconds_time(seconds)
            .slice(0, -3)
            .replace(":", "h");
    }
}

class String {
    constructor(text) {
        this.text = text
    }
    set update(newText){
        this.text = newText
    }
    get capitalize() {
        return this.text.charAt(0).toUpperCase() + this.text.slice(1);
    }
    get htmlEscape(){
        const tagsToReplace = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&#34;",
                "'": "&#39;",
                "`": "&#180;"
            },
            replaceTag = (tag) => tagsToReplace[tag] || tag,
            safe_tags_replace = (s) => s.replace(/[&<>"'`]/g, replaceTag);

        return safe_tags_replace(this.text);
    }
    get htmlStrip(){
        return (new DOMParser().parseFromString(this.text, 'text/html')).body.textContent || ''
    }
    get markup(){
        let save_str = this.htmlEscape(this.text)
        const arr = [
            [/#!bold/g, '<b>'],
            [/#bold!/g, '</b>'],
            [/#!underline/g, '<text style="text-decoration: underline">'],
            [/#underline!/g, '</text>'],
            [/#!overline/g, '<text style="text-decoration: overline">'],
            [/#overline!/g, '</text>'],
            [/#!line-through/g, '<text style="text-decoration: line-through">'],
            [/#line-through!/g, '</text>'],
            [/#!small/g, '<small>'],
            [/#small!/g, '</small>'],
            [/#!sub/g, '<sub>'],
            [/#sub!/g, '</sub>'],
            [/#!sup/g, '<sup>'],
            [/#sup!/g, '</sup>'],
            [/#!italic/g, '<i>'],
            [/#italic!/g, '</i>'],
            [/#!mark/g, '<mark>'],
            [/#mark!/g, '</mark>'],
            [/#!title/g, '<h3 style="font-size: larger">'],
            [/#title!/g, '</h3>'],
            [/#!mediumtitle/g, '<h5 style="font-size: larger">'],
            [/#mediumtitle!/g, '</h5>'],
            [/#!subtitle/g, '<h6 style="font-size: larger">'],
            [/#subtitle!/g, '</h6>'],
            [/#!break/g, '<br>'],
            [/#!list/g, '<ul>'],
            [/#list!/g, '</ul>'],
            [/#!item/g, '<li>'],
            [/#item!/g, '</li>'],
        ]

        for(const a of arr)
            save_str = save_str.replace(a[0], a[1])

        return save_str
    }
    get reverse(){
        return this.text.split("").reverse().join("");
    }
}

class _Date{
    constructor(date) {
        this.date = date
    }
    daysBetween(from, to){
        return Math.ceil(Math.abs(from.getTime() - to.getTime()) / 86400000)
    }
    get isWeekday(){
        return this.date.getDay() % 6 !== 0
    }
    get getTime(){
        return this.date.toTimeString().slice(0, 8);
    }
}

module.exports = {
    _Random: Random,
    _String: String,
    _Convert: Convert,
    _Date : _Date,
    _JsonArray: _JsonArray,
};