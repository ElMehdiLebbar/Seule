const { el } = require('../locals/el');

const Effects = ()=> {
    el.prototype.Visible = function() {
        const element = this;
        return {
            showing:()=> {
                for (let el of element.el) el.style.visibility = "visible";
                return element;
            },
            hidden:()=>{
                for (let el of element.el) el.style.visibility = "hidden";
                return element;
            },
            get status(){
                const arr = [];
                for (let el of element.el)
                    arr.push(getComputedStyle(el).visibility !== "hidden")

                if(arr.length === 1) return arr[0]
                return arr
            }
        }
    };
    el.prototype.Show = function() {
        return this.Each(function() {
            let front = this.getAttribute("style");

            if (front) {
                if (front.replace(/\s/g, "").includes("display:none"))
                    this.style.display = "";
            }

            if (getComputedStyle(this).display === "none")
                this.style.display = "initial";
        });
    };
    el.prototype.Hide = function() {
        return this.Each(function() {
            this.style.display = "none";
        });
    };
    el.prototype.Opacity = function() {
        const element = this;
        return{
            set set(val){
                for (let el of element.el) el.style.opacity = val;
            },
            get get(){
                return element.Css('opacity').get
            }
        }
    };
    el.prototype.Classes = function() {
        const elements = this,
            handler = (action, className) => {
                for (const e of this.el) e.classList[action](className);
            };
        return {
            get list(){
                const arr = [];
                for (const e of elements.el){
                    const li = [];
                    for (const element of e.classList)
                        li.push(element);
                    arr.push(li)
                }
                if(arr.length === 1) return arr[0]
                return arr
            },
            set add(className){
                handler("add", className);
            },
            remove(className){
                handler("remove", className);
            },
            toggle(className){
                handler("toggle", className);
            },
            contains(className){
                const arr = [];
                for (let el of elements.el)
                    arr.push(el.classList.contains(className))

                if(arr.length === 1) return arr[0]
                return arr
            }
        };
    };
    el.prototype.Css = function(declaration) {
        const elements = this;
        return {
            get get(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(getComputedStyle(el)[declaration])

                if(arr.length === 1) return arr[0]
                return arr
            },
            set set(val){
                return elements.Each(function() {
                    this.style[declaration] = val;
                });
            },
            style(css = {}){

                    let keys = Object.keys(css),
                        arr = {},
                        newCss = {},
                        max = {},
                        ancient = {},
                        origin = {};

                    for (const element of keys) {
                        let forbidden =
                            "duration property direction loop time delay text effect";

                        if (
                            typeof css[element] !== "object" &&
                            !forbidden.includes(element)
                        ) {
                            css[element] = {
                                value: css[element]
                            };
                        }

                        let delay = css[element].delay,
                            duration =
                                css[element].duration ||
                                css.duration ||
                                0;
                        if (!css[element].delay) delay = 0;

                        if (!forbidden.includes(element)) {
                            let style = getComputedStyle(elements.el[0]);
                            arr[element] = duration + "ms " + delay + "ms";
                            newCss[element] = css[element].value || 0;
                            if (ancient === origin)
                                ancient[element] = style[element] || 0;
                            max[element] = parseFloat(delay) + parseFloat(duration);
                        }
                    }

                    newCss.transition = objectToStyle(arr)
                        .replace(/:/g, " ")
                        .replace(/;/g, ", ");
                    newCss["transition-timing-function"] =
                        css.effect || "ease";
                    if (css.particularly)
                        newCss["transition-property"] =
                            css.particularly.value;

                    if (!css.loop && !css.direction) {
                        if (css.duration)
                            newCss["transition-duration"] =
                                css.duration + "ms";
                        if (css.delay)
                            newCss["transition-delay"] = css.delay + "ms";
                    }

                    ancient.transition = newCss.transition;
                    ancient["transition-timing-function"] =
                        newCss["transition-timing-function"];
                    if (css.property)
                        ancient["transition-property"] =
                            newCss["transition-property"];
                    if (css.duration)
                        ancient["transition-duration"] =
                            newCss["transition-duration"];
                    if (css.delay)
                        ancient["transition-delay"] = newCss["transition-delay"];

                    if (ancient === origin)
                        origin = ancient;


                    let array = Object.values(max);
                    max = Math.max(...array);
                    return elements.Each(function() {
                        let element = this,
                            times = 1,
                            boucle,
                            delay = 100;
                        if (css.loop || css.direction)
                            if (css.delay) delay = css.delay;
                        let interval = parseInt(max + delay) * 2 + 100;

                        if (css.direction || css.loop) {
                            action(max + delay);
                            boucle = setInterval(function() {
                                if (css.time)
                                    action(max + delay, css.time);
                                else action(max + delay);
                            }, interval);
                            css.direction && clearInterval(boucle);
                        } else element.setAttribute("style", objectToStyle(newCss));

                        function action(delay, time) {
                            element.setAttribute("style", objectToStyle(newCss));
                            setTimeout(
                                () =>
                                    element.setAttribute(
                                        "style",
                                        objectToStyle(ancient)
                                    ),
                                parseInt(delay)
                            );

                            if (time) {
                                times++;
                                if (time <= times) clearInterval(boucle);
                            }
                        }
                    });
            }
        };
    };
    el.prototype.Anime = function(options) {
        let an = {};
        this.Each(function() {
            an.animation = this.animate(options.keyframes, {
                delay: options.delay || 0,
                duration: options.duration || 700,
                fill: options.fill || "forwards",
                easing: options.effect || "ease-in-out",
                times: options.iterations || 1
            });
        });

        an.start = () => {
            an.animation.play();
            return this;
        };

        an.freeze = () => {
            an.animation.pause();
            return this;
        };

        an.stop = () => {
            an.animation.finish();
            return this;
        };

        an.cancel = () => {
            an.animation.cancel();
            return this;
        };

        an.animation.addEventListener(
            "finish",
            () => options.onfinish && options.onfinish(this, an)
        );
        an.animation.addEventListener(
            "cancel",
            () => options.oncancel && options.oncancel(this, an)
        );
        return an;
    };
    el.prototype.Width = function() {
        const element = this;
        return{
            set set(val){
                for (let el of element.el) el.style.width = val;
            },
            get get(){
                const arr = [];
                for (let el of element.el)
                    arr.push(el.offsetWidth)

                if(arr.length === 1) return arr[0]
                return arr
            }
        }
    };
    el.prototype.Height = function() {
        const element = this;
        return{
            set set(val){
                for (let el of element.el) el.style.height = val;
            },
            get get(){
                const arr = [];
                for (let el of element.el)
                    arr.push(el.offsetHeight)

                if(arr.length === 1) return arr[0]
                return arr
            }
        }
    };

    el.prototype.Property = function(name) {
        const elements = this;
        return {
            get get(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(getComputedStyle(el).getPropertyValue(name))

                if(arr.length === 1) return arr[0]
                return arr
            },
            set set(val){
                return elements.Each(function() {
                    this.style.setProperty([name], val);
                });
            }
        };
    };

}

function objectToStyle(cssProperties) {
    let s = Object.keys(cssProperties)
        .map((key) => key + ": " + cssProperties[key])
        .join(";");
    return ("'" + s + "'").slice(1).slice(0, -1);
}

module.exports = {
    Effects: Effects
};