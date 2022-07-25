const {el} = require('../locals/el')

const HtmlMethods = ()=>{
    el.prototype.Attr = function(attribute) {
        const elements = this;

        return {
            get get(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(el.getAttribute(attribute))

                if(arr.length === 1) return arr[0]
                return arr
            },
            get has(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(el.hasAttribute(attribute))

                if(arr.length === 1) return arr[0]
                return arr
            },
            set set(val){
                for (const el of elements.el) el.setAttribute(attribute, val);
            },
            remove(){
                for (const el of elements.el) el.removeAttribute(attribute);
                return elements
            }
        }
    };

    el.prototype.Text = function() {
        return content("Text", this);
    };

    el.prototype.Html = function() {
        return content("HTML", this)
    };

    el.prototype.Val = function() {
        const elements = this;
        return {
            set set(val){
                for (const el of elements.el) el.value = val;
            },
            get get(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(el.value)

                if(arr.length === 1) return arr[0]
                return arr
            },
            clear(){
                for (const el of elements.el) el.value = "";
                return elements
            }
        };
    }
}

function content(fun, element) {
    return {
        set set(val){
            for (const el of element.el) el["inner" + fun] = val;
        },
        get get(){
            const arr = [];
            for (let el of element.el)
                arr.push(el["inner" + fun])

            if(arr.length === 1) return arr[0]
            return arr
        },
        clear(){
            for (let el of element.el) el["inner" + fun] = "";
            return element;
        },
        append(val, position = "beforeend"){

            for (let el of element.el)
                el["insertAdjacent" + fun](position, val);

            return element;
        }
    };
}

module.exports = {
    HtmlMethods: HtmlMethods
};