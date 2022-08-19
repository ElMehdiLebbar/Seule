const {setupShadow} = require('./setting');
const { Initial, init, bind_function} = require('../locals/init');

class rootElement {
    constructor(el, routing) {
        class PageRouter extends HTMLElement {
            #currentPage;
            #defaultPage = routing.Home;
            #app = {
                style: '',
                template: '',
                mode: "open"
            };

            constructor() {
                super();
                setupShadow(this, this.#app);
                Window.navigate = (newPage)=> this.#gotoNewPage(newPage);
                Window.back = () => {
                    if(this.#currentPage.path !== this.#defaultPage.path)
                        history.back();

                };
                Window.forward = () => history.forward();

            };

            connectedCallback() {
                this.#currentPage = this.#getCurrentPageFromUrl();
                this.#renderCorrectPage();

                window.addEventListener("popstate", (event) => {
                    if (event.state)
                        this.#currentPage = event.state;
                    else
                        this.#currentPage = this.#defaultPage;

                    this.#renderCorrectPage();
                });
            }

            #renderCorrectPage() {
                const elementId = "CurrentPage";
                const prevPage = this.shadowRoot.getElementById(elementId);
                if (prevPage)
                    this.shadowRoot.removeChild(prevPage);

                const newPage = document.createElement(this.#currentPage.component);
                newPage.id = elementId;
                newPage.addEventListener("ChangePage", (event) => {
                    this.#gotoNewPage(event.detail);
                    Window.navigate = event.detail;
                });
                this.shadowRoot.appendChild(newPage);

                document.title = this.#currentPage.title;

                Window.currentPage = this.#currentPage
            }

            #gotoNewPage(newPage) {
                this.#currentPage = newPage;
                this.#addCurrentPageToHistory();
                this.#renderCorrectPage();
            }

            #addCurrentPageToHistory() {
                let queryString = "",
                    url;

                if(this.#currentPage.params)
                    queryString = '?' + Object.keys(this.#currentPage.params).map(key => key + '=' + this.#currentPage.params[key]).join('&');

                url = window.location.origin + this.#currentPage.path + queryString;

                if(this.#currentPage.path.includes("#"))
                    url = window.location.origin + window.location.pathname + queryString + this.#currentPage.path;

                history.pushState(
                    this.#currentPage,
                    this.#currentPage.title,
                    url
                );
            }

            #getCurrentPageFromUrl() {
                for (const current in routing) {

                    if(window.location.hash) {
                        const hash = window.location.hash;

                        if (routing[current].path === hash)
                            return routing[current];
                    }
                    if (routing[current].path === window.location.pathname)
                        return routing[current];
                }
                return this.#defaultPage;
            }
        }
        try {
            customElements.define(el, PageRouter);
        }catch (e) {
            console.error('el property must be a <String> with two words and separated with Minus Character for exp: {el:"home-page"}')
        }
    }
}

class View {
    constructor(app) {
        const view = ()=> class View extends HTMLElement {
            #el = {};
            constructor() {
                super();
                const params = new URL(window.location).searchParams.entries();

                for (let element of params) {
                    if (app.parameters) {
                        app.data = app.data || {};
                        app.data[element[0]] = String(element[1]);
                    }
                }

                app.mode = "open";

                setupShadow(this, app);
                this.#el.RootElement = this.shadowRoot;

                Initial(this.shadowRoot, app.data);

                this.gotoPage = (page)=> {
                    const event = new CustomEvent("ChangePage", { detail: page });
                    this.dispatchEvent(event);
                }

                this.#el.navigate = (page)=> this.gotoPage(page);

                const handler = {
                    set: (obj, prop, value) => {
                        init(this.shadowRoot, obj, prop, value);
                        return true;
                    }
                };

                if (app.data) this.#el.data = new Proxy(app.data, handler);

                (async()=>{
                    if(app.handlers) await app.handlers(this.#el);
                    if(app.components) await bind_function(app.components, this.#el);
                })()


            }
        }
       try {
           app.el && customElements.define(app.el, view());
       }catch (e) {
           console.error('el property must be a <String> with two words and separated with Minus Character for exp: {el:"home-page"}')
       }
    }
}



module.exports = {
    View: View,
    Root: rootElement
};
