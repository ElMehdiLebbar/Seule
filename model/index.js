const {SceneHandler} = require('../locals/sceneHandler');
const {getScrollbarWidth} = require('../locals/getScrollbarWidth');
const {find} = require('../locals/el');
const {Scope} = require('../selectors');

function _Directives(app, routing) {
    const models = app.RootElement.querySelectorAll('[data-model]');

    for (const model of models) {
        const
            listItems = "input textarea option",
            type = model.getAttribute("type");

        if (listItems.includes(model.localName) && type !== 'file')
            if (model.dataset.val !== "false")
                model.value = app.data[model.dataset.model];

        model.oninput = function() {
            if (type === 'file') getData(model);
            else app.data[model.dataset.model] = this.value;
        }
    }

    routing && map(app, routing);

    function getData(file) {
        const files = file.files[0];
        if (files) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(files);
            fileReader.onload = function() {
                app.data[file.dataset.model] = this.result;
            }
        }
    }
    function map (app, routing){
        app.map = {...routing};

        const routers = app.RootElement.querySelectorAll('[data-router]');

        for (const router of routers)
            router.onclick = function() {

                if(this.dataset.params){
                    const
                        params = this.dataset.params.split(","),
                        pass = {};

                    for (const param of params){
                        const entry = param.split(":");
                        const key = entry[0].trimStart();
                        pass[key] = entry[1];
                    }

                    routing[this.dataset.router].params = pass;
                }

                Window.navigate(routing[this.dataset.router]);
            }

        return routing
    }
}

function _Change(query, options){
    if (!query.includes("(")) query = "(" + query + ")";
    let x = window.matchMedia(query),
        myFunction = (x) => {
            if (x.matches) options.handler && options.handler();
            else options.callback && options.callback();
            return x;
        },
        resultMatch = myFunction(x);

       try {
           x.addEventListener("change", myFunction);
           return resultMatch;
       }catch (e){
           return 'Your browser does not support Seule Model Change!';
       }
}

function _Orientation() {
    const orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    if (!orientation) return "The orientation API isn't supported in this browser :(";
    if (orientation === 90) return "Horizontally";
    return "Vertically";
}

class _Scroll {
    constructor(app, context= document) {
        this.app = app;
        this.context = context;
    }

    top (){
        if(this){
            const c = this.context.documentElement.scrollTop || this.context.body.scrollTop;

            if (c > 0) {
                window.requestAnimationFrame(this.top);
                window.scrollTo(0, c - c / 8);
            }
            return this;
        }
    }
    bottom() {
        const
            c = this.context.documentElement.scrollTop || this.context.body.scrollTop,
            h = this.context.body.scrollHeight;

        if (window.innerHeight + window.scrollY >= this.context.body.offsetHeight) {
            window.scrollTo(0, c + h / 40);
            return;
        }

        window.requestAnimationFrame(this.bottom);
        window.scrollTo(0, c + h / 40);
        return this;
    }
    onBottom(handler, before = 0) {
        window.addEventListener('scroll', (ev) => {
            if (
                window.innerHeight + window.scrollY >=
                this.context.body.offsetHeight - before
            )
                handler(this);
        })
        return this;
    }
    onTop(handler){
        window.addEventListener('scroll', (ev) => {
            if (window.scrollY <= 0) handler(this);
        })
        return this;
    }
    position (left){
        if (left) return window.screenLeft;
        return window.screenTop;
    }
    scene (options){
            let i = 0;
            new SceneHandler(this.app, {
                selector: options.el,
                floating: options.floating,
                trackers: options.trackers,
                distance: options.distance || 0,
                unit: options.unit || "percent",
                handler: () => {
                    if (i === 0) {
                        options.handler(Scope(this.app).Select(options.el));
                        i = 1;
                    }
                },
                callback: () => {
                if (i === 1) {
                    if (options.callback) {
                        options.callback(Scope(this.app).Select(options.el));
                        i = 0;
                    }
                }
            }
            });
        return this;
    }
    get size() {
        return getScrollbarWidth(window)
    }
}

function _Data() {
    const
        param = new URL(window.location).searchParams.entries(),
        data = {};

    for (const p of param) data[p[0]] = p[1]

    return data
}

function _Print(options, context = document) {
    let title = options.title || "",
        body = context.querySelector("body");

    body.insertAdjacentHTML(
        "beforeend",
        '<iframe class="seule--frame" name="sframe" style="position: fixed; bottom: -100%"></iframe>'
    );
    const iframeEl = context.getElementsByClassName("seule--frame")[0];
    let frameDoc = iframeEl.contentWindow ?
        iframeEl.contentWindow :
        iframeEl.contentDocument.document ?
            iframeEl.contentDocument.document :
            iframeEl.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write("<html lang='en'><head><title>" + title + "</title>");
    frameDoc.document.write("</head><body>");
    options.style &&
    frameDoc.document.write(`<style>${options.style}</style>`);
    frameDoc.document.write(options.template);
    frameDoc.document.write("</body></html>");
    frameDoc.document.close();
    setTimeout(function() {
        window.frames["sframe"].focus();
        window.frames["sframe"].print();
    }, 500);
}

class _Store {
    constructor(name) {
        this.name = name
    }
    set switch(name){
        this.name = name;
    }
    set set(data){
        window.localStorage.setItem(this.name, JSON.stringify(data));
    }
    get get(){
        return JSON.parse(window.localStorage.getItem(this.name))
    }
    delete(){
        window.localStorage.removeItem(this.name);
    }
}

class _Media {
    constructor(src) {
        this.src = src
    }
    audio() {
        media(true, this.src)
    }
    video() {
        media(false, this.src)
    }
}

class _Http{
    constructor(app) {
        this.app = app
    }
    set application(newApp){
        this.app = newApp
    }
    async post(url, options) {
        options.method = "post";
        return await this.get(url, options);
    }
    async get(url, options, context = document) {
        if (!options) options = {};
        let parent = document,
            formData = new FormData();

        if(this.app.RootElement) parent = this.app.RootElement;

        options.param = {
            method: options.method || "get"
        };

        if (options.form) {
            let newForm;
            if (typeof options.form === "object") newForm = options.form;
            else newForm = parent.querySelector(options.form);

            formData = new FormData(newForm);

            newForm.onsubmit = async (e) => e.preventDefault();
        }

        if (options.file) {
            if (typeof options.file === "object") {
                for (const item of options.file) {
                    let file;
                    if (typeof item === "object") file = item;
                    else file = parent.querySelector(item);
                    formData.append(file.name, file.files[0]);
                }
            } else {
                options.file = parent.querySelector(options.file);
                formData.append(options.file.name, options.file.files[0]);
            }
        }

        options.data &&
        Object.keys(options.data).forEach((k) =>
            formData.append(k, options.data[k])
        );
        if (options.method === "post") options.param.body = formData;
        let response = await fetch(url, options.param);

        if (response.ok) {
            if (options.blob) return await response.blob();
            if (options.json) return await response.json();
            return await response.text();
        } else return "HTTP-Error: " + response.status;
    };
}

class _Clipboard{
    constructor(el) {
        this.el = el.el[0] || null;
        this.text = "";
    }
    set element(el){
        this.el = el.el[0]
    }
    get read() {
        return (async()=>{
            try{
                const permission = await navigator.permissions.query({ name: 'clipboard-read' });
                if (permission.state === 'denied') {
                    console.error('Not allowed to read clipboard.');
                    return
                }

                await navigator.clipboard.readText().then(
                    clipText => this.text = clipText);

                return this.text
            }catch (e){
                console.error('Your browser doesn\'t allow clipboard access, the permission was denied.')
            }
        })
    }
    write(options){
        const formEl = readEl(this.el);

        if(this.el){
            this.el.select && this.el.select();
            this.el.setSelectionRange && this.el.setSelectionRange(0, 99999);
            this.text = formEl
        }

        if(options.text) this.text = options.text;

        navigator.clipboard.writeText(this.text).then(()=>
            options.callback && options.callback(this.el, this.text)
        ).catch(e=>
            console.error('Your browser doesn\'t allow clipboard access, the permission was denied.')
        )
    }
    past(target) {
        target.el[0].value = this.text;
        target.el[0].innerText = this.text;
    }
}

function _Css(stylesheet, context = document) {
    const
        link = context.RootElement || context.querySelector("head"),
        l = document.createElement("style");

    l.textContent = stylesheet

    if (context.RootElement)
        link.insertBefore(l, link.childNodes[0]);
    else link.appendChild(l);
}

function readEl(el) {
    return 'value' in el ? el.value : el.textContent || false;
}

function media(el, src) {
    const media = {};
    media.Delay = 0;

    if (el)
        media.Element = new Audio(src);
    else {
        media.Element = document.createElement("video");
        media.Element.setAttribute("src", src);
    }

    media.Src = src;

    media.El = find({
        selector: media.Element,
    });

    media.Play = function(handler, timeOut) {
        media.Delay = timeOut;
        setTimeout(function() {
            media.Element.pause();
            media.Element.play().then(() => handler && handler(media));
        }, media.Delay);
        return this;
    };

    media.Stop = function(handler, timeOut) {
        setTimeout(function() {
            media.Element.pause();
            media.Element.currentTime = 0;
            handler && handler(media)
        }, timeOut);
        return this;
    };

    media.Pause = function(handler, timeOut) {
        setTimeout(function() {
            media.Element.pause();
            handler && handler(media)
        }, timeOut);
        return this;
    };

    return media;
}

module.exports = {
    _Directives: _Directives,
    _Change: _Change,
    _Store: _Store,
    _Http: _Http,
    _Media: _Media,
    _Print: _Print,
    _Data: _Data,
    _Orientation: _Orientation,
    _Scroll: _Scroll,
    _Clipboard: _Clipboard,
    _Css: _Css
};