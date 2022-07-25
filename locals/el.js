class el {
    constructor(select, app) {
        if (!select && app) return new el(app.RootElement);

        if (typeof select === "object") {
            select.length ? this.el = select :
                this.el = [select];
        } else if (app) this.el = app.RootElement.querySelectorAll(select);

    }

    Select(selector) {
        let elements = [];
        this.Each(function() {
            for (const e of this.querySelectorAll(selector)) {
                elements.push(e)
            }

        });
        return new el(elements);
    }
    Each(callback) {
        if (!isIterable(this.el))
            this.el = [this.el]

        for (const element of this.el)
            callback.call(element, new el(element));

        return this;
    }
    Dom(index) {
        if (index || index === 0) return this.el[index];
        return this.el;
    }
    Native(handler){
        return this.Each(function() {
            handler(this)
        });
    }
    Element(index) {
        return new el(this.el[index]);
    }
    Parent(element) {
        if (!element) return new el(this.el[0].parentElement);

        const es = new el(element.el ? element.Dom(0) : parent.querySelector(element));

        es.Append(this)
    }
    Child() {
        let obj = {};
        obj.first = () => new el(this.el[0].children[0]);
        obj.last = () => new el(this.el[0].children[this.el[0].children.length - 1]);
        obj.number = index => new el(this.el[0].children[index]);
        obj.all = () => new el(this.el[0].children);
        return obj;
    }
    Move() {
        let op = {};

        op.after = (element) => {
            const es = new el(element.el ? element.Dom() : element);
            es.Parent().Dom(0).insertBefore(this.el[0], es.Dom(0).nextSibling);
            return this;
        };

        op.before = (element) => {
            const es = new el(element.el ? element.Dom() : element);
            es.Parent().Dom(0).insertBefore(this.el[0], es.Dom(0));
            return this;
        };

        return op;
    }
    Append(element) {
        const es = new el(element.el ? element.Dom() : element);

        return this.Each(function() {
            for (const e of es.Dom())
                this.appendChild(e);
        })
    }
    Remove() {
        return this.Each(function() {
            this.parentNode.removeChild(this);
        })
    }
    Duplicate() {
        let newEls = [],
            element,
            clone,
            event;
        this.Each(function() {
            element = new el(this);
            event = element.GetEvents();
            clone = this.cloneNode(true);
            for (const ev of event) {
                clone.addEventListener(ev.type, ev.listener)
            }
            newEls.push(clone)
        });

        return new el(newEls)
    }
    GetEvents(event) {
        let events = [];
        for (const ev of Object.values(this.el[0].getEventListeners(event)))
            event ? events.push(ev) : events.push(ev[0]);
        return events
    }
    Replace(element) {
        const es = new el(element.el ? element.Dom() : element);

        for (const e of es.Dom()) {
            let el = this.el[0].cloneNode(true);
            e.parentNode.replaceChild(el, e);
        }

        return this;
    }
    Create(tagName) {
        return new el(document.createElement(tagName));
    }
    Load(handler, timeOut = 0) {
        return this.Each(function(e) {
            setTimeout(() => {
                handler(new el(this));
            }, timeOut);
        });
    }
    Loop(handler, timeOut = 1000) {
        setTimeout(() => {
            return this.Each(function(e) {
                let loop = {
                        stop: (handler) => stop(handler),
                        counter: 0,
                        el: new el(this)
                    },
                    repeat = setInterval(() => {
                        handler(loop);
                        loop.counter++;
                    }, timeOut);

                function stop(handler) {
                    clearInterval(repeat);
                    handler && handler(loop.el);
                }
            });
        }, 100)
    }
    Data(property) {
        if (property) return this.Dom(0).dataset[property]
        return this.Dom(0).dataset
    }
    IsEmpty() {
        return Array.isArray(this.el[0])
    }

    Add(event, handler){
        this.Errors("events")
    }
    On(event, handler){
        this.Errors("events")
    }
    Click(handler){
        this.Errors("events")
    }
    Focus(handler){
        this.Errors("events")
    }
    Blur(handler){
        this.Errors("events")
    }
    Hold(handler, delay){
        this.Errors("events")
    }
    Swipe(on, handler){
        this.Errors("events")
    }
    HotKey(query, handler, prevent){
        this.Errors("events")
    }
    Fire(event){
        this.Errors("events")
    }
    Copy(target, events){
        this.Errors("events")
    }
    Toggle(event, methods, prevent){
        this.Errors("events")
    }
    Not(target){
        this.Errors("events")
    }
    NotChild(target, event, methods){
        this.Errors("events")
    }

    Visible(){
        this.Errors("effects")
        return {
            showing:()=> {

            },
            hidden:()=>{

            },
            get status(){

            }
        }
    }
    Opacity(){
        this.Errors("effects")
        return{
            set(){

            },
            get(){

            }
        }
    }
    Show(){
        this.Errors("effects")
    }
    Hide(){
        this.Errors("effects")
    }
    Classes(){
        this.Errors("effects")
        return {
            set add(className){

            },
            remove(className){

            },
            toggle(className){

            },
            get list(){

            },
            contains(className){

            }
        }
    }
    Css(declaration){
        this.Errors("effects")
        return{
            get get(){

            },
            set set(val){

            },
            style(css = {}){

            }
        }
    }
    Width(){
        this.Errors("effects")
    }
    Height(){
        this.Errors("effects")
    }
    Property(name){
        this.Errors("effects")
        return{
            get get(){

            },
            set set(val){

            }
        }
    }
    Attr(attribute){
        this.Errors("effects");
        return {
            get get() {},
            get has() {},
            remove:()=>{},
            set set(val){}
        }
    }
    Text(){
        this.Errors("effects");
        return {
            get get() {},
            set set(text) {},
            clear:()=>{},
            append(text, position = "beforeend"){}
        }
    }
    Html(){
        this.Errors("effects");
        return {
            get get() {},
            set set(html) {},
            clear:()=>{},
            append(html, position = "beforeend"){}
        }
    }
    Val(){
        this.Errors("effects");
        return {
            get get() {},
            clear:()=>{},
            set set(val){},
        }
    }

    Scroll(){
        return {
            get size(){},
            get left(){},
            get top(){},
            parent(el){},
            run(){},
            to(event = "top", duration = 0){}
        }
    }

    Errors(module){
        if(module === "events")
            console.error('')
        if(module === "effects")
            console.error("")
        if(module === "scroll")
            console.error("")
        if(module === "events")
            console.error("")
    }
}

function Find(app, context = document) {
    return new el(app.selector, app);
}

function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

module.exports = {
    el: el,
    find: Find
};