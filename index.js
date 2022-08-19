const { creatShadow, selectElement, init, bind_function} = require('./locals/init');


class Seule {
     constructor(app) {

        const params = new URL(window.location).searchParams.entries();

        for (let element of params) {
            if (app.parameters) {
                app.data = app.data || {};
                app.data[element[0]] = String(element[1]);
            }
        }

        const
            element = selectElement(app.el),
            parent = creatShadow({
                e: element.e,
                el: element.el,
                style: app.style,
                data: app.data || {}
            }),
            handler = {
            set: (obj, prop, value) => {
                init(parent.el, obj, prop, value);
                return true;
            }
        };

        if (app.data) this.data = new Proxy(app.data, handler);
        this.RootElement = parent.el;

        (async()=>{
            if(app.css){
                const {_Css} = require("./model");
                const obj = Object.keys(app.css);
                for (const o of obj) _Css(app.css[o]);
            }
            if(app.routes) {
                const {Root} = require('./view');
                await new Root(app.routes.el, app.routes);
                if(app.routes.directives){
                    const {_Directives} =  require("./model");
                    _Directives(this, app.routes);
                }

            }
            if(app.modules) await bind_function(app.modules, this);
            if(app.handlers) await app.handlers(this);
            if(app.views) await bind_function(app.views, this);
            if(app.components) await bind_function(app.components, this);
        })()

    }
}

if(document){
    (function() {
        Element.prototype._addEventListener = Element.prototype.addEventListener;
        Element.prototype._removeEventListener = Element.prototype.removeEventListener;
        Element.prototype.addEventListener = function(type, listener, useCapture = false) {
            this._addEventListener(type, listener, useCapture);
            if (!this.eventListenerList) this.eventListenerList = {};
            if (!this.eventListenerList[type]) this.eventListenerList[type] = [];
            this.eventListenerList[type].push({
                type,
                listener,
                useCapture
            });
        };
        Element.prototype.removeEventListener = function(type, listener, useCapture = false) {
            this._removeEventListener(type, listener, useCapture);
            if (!this.eventListenerList) this.eventListenerList = {};
            if (!this.eventListenerList[type]) this.eventListenerList[type] = [];
            for (let i = 0; i < this.eventListenerList[type].length; i++) {
                if (this.eventListenerList[type][i].listener === listener && this.eventListenerList[type][i].useCapture === useCapture) {
                    this.eventListenerList[type].splice(i, 1);
                    break;
                }
            }
            if (this.eventListenerList[type].length === 0) delete this.eventListenerList[type];
        };
        Element.prototype.getEventListeners = function(type) {
            if (!this.eventListenerList) this.eventListenerList = {};
            if (type === undefined) return this.eventListenerList;
            return this.eventListenerList[type];
        };
    }());
}




module.exports = {
    Instance: Seule
};

