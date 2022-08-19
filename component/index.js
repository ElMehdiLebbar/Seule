const {selectStyle} = require('../locals/init');

class Component{
    constructor(app, context= document) {
        let els = {},
            datas = app.data || [],
            styles= app.style || '',
            extended = app.extend || 'div';

        const Load = (data, shadow) => {
            let parent = context.createElement(extended);
            parent.classList.add("s_parent");

            for (const [i, item] of data.entries()) {
                const e = document.createElement("template");
                item.index = i;
                e.innerHTML = app.template(item, i);
                parent.appendChild(e.content);
            }

            els.RootElement = parent;

            shadow.innerHTML = "";
            shadow.appendChild(parent);
            selectStyle(styles, shadow);
        };
        class common extends HTMLElement {
            constructor() {
                super();
                const shadow = this.attachShadow({
                    mode: "closed"
                });

                els.data = app.data;
                els.Load = (data, handler)=> {
                    Load(data, shadow)
                    handler && handler(els)
                };

                Load(datas, shadow)

                if(app.data.length && app.handlers) app.handlers(els);

            }
        }
        try {
             customElements.define(app.el, common)
        }
        catch (e) {/*console.log('Data has been Reset!')*/}
    }
}

module.exports = {
   Component: Component
};