function selectElement(el, context = document) {
    let element = {};

    element.context = context;

    try {
        element.el = context.querySelector(el);
        element.e = el.replace("#", "")
    } catch (e) {
        element.el = el;
        element.e = el.getAttribute("id").replace("#", "")
    }

    return element;
}
function selectStyle(name, shadow, context = document) {
    if (name) {
        let l = context.createElement("style");
        l.textContent = name;
        shadow.insertBefore(l, shadow.firstChild);
    }
}
function creatShadow(root) {
    let parent = {};

    class Root extends HTMLElement {
        constructor() {
            super();
            const shadow = this.attachShadow({
                mode: "closed"
            });
            let el;

            el = root.el.cloneNode(true);
            parent.html = Initial(el, root.data)

            if (el.innerHTML) selectStyle(root.style, shadow);

            shadow.appendChild(el);

            parent.el = shadow.children[shadow.children.length - 1];
            shadow.children[shadow.children.length - 1].removeAttribute("id");
        }
    }

    customElements.define("seule-" + root.e, Root)

    root.seule = document.createElement("seule-" + root.e);
    root.el.innerHTML = "";
    root.el.removeAttribute("class");
    root.el.appendChild(root.seule);

    return parent
}
function Initial(el, data= {}, html) {
    let keys = Object.keys(data),
        parent = el.innerHTML,
        content = el.innerHTML;

    if (html) content = html;

    for (let item of keys) {
        let bin = data[item].toString().replace(/<[^>]*>/g, "");

        while (content.includes("{{" + item + "}}"))
            content = content.replace(
                "{{" + item + "}}",
                "<data data-bind='" + item + "'>" + bin + "</data>"
            );
    }
    el.innerHTML = content;

    Bind(el, data);

    return parent
}
function Init(el, obj, prop, value) {
    if (obj[prop] !== value) {
        obj[prop] = value;
        const binds = el.querySelectorAll('data[data-bind="' + prop + '"]');
        for (const bind of binds) bind.innerText = value;
        Bind(el, obj)
    }
}
function Bind(el, obj) {
    const handlers = el.querySelectorAll('[data-attribute]');

    for (const handler of handlers) {
        const attrs = handler.getAttribute('data-attribute').split(';');

        for (const attr of attrs) {
            const a = attr.trim().split(':');
            handler.setAttribute(a[0], obj[a[1]].toString().replace(/<[^>]*>/g, ""))
        }
    }
}
function bind_function(obj, root){
    const comps = Object.entries(obj);
    for(const comp of comps) {
        try {
            comp[1].then(res => res[comp[0]](root));
        }catch (e){
            comp[1](root);
        }

    }
}

module.exports = {
    selectElement: selectElement,
    creatShadow: creatShadow,
    init: Init,
    selectStyle: selectStyle,
    Initial: Initial,
    bind_function: bind_function
};