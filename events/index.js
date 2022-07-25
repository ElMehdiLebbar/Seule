const {el} = require('../locals/el')

const Events = () =>{
    el.prototype.Add = function(event, handler, prevent) {
        return this.Each(function() {
            if (handler && !Array.isArray(this)) this.addEventListener(
                event,
                (event) => {
                    prevent && event.preventDefault();
                    handler(new el(this), this);
                },
                false
            );
        });
    };

    el.prototype.On = function(event, handler, prevent) {
        return this.Each(function() {
            if (handler && !Array.isArray(this)) {
                this["on"+event] = (event) => {
                    prevent && event.preventDefault();
                    handler(new el(this), this);
                }
            }
        });
    };

    el.prototype.Hold = function(handler, until = 1500) {
        return this.Each(function() {
            let mouseIsDown = false,
                isTouch =
                    "ontouchstart" in window ||
                    navigator.MaxTouchPoints > 0 ||
                    navigator.msMaxTouchPoints > 0,
                mouseDown = isTouch ? "touchstart" : "mousedown",
                mouseUp = isTouch ? "touchend" : "mouseup";
            this.addEventListener(mouseDown, (e) => {
                mouseIsDown = true;
                setTimeout(function() {
                    mouseIsDown && handler(new el(e), e);
                }, until);
            });
            this.addEventListener(mouseUp, () => (mouseIsDown = false));
        });
    };

    el.prototype.Swipe = function(on, handler) {
        let elem = this.el,
            xDown,
            yDown;

        for (let e of elem) {
            e.addEventListener("touchstart", handleTouchStart, false);
            e.addEventListener("touchmove", handleTouchMove, false);
        }

        function handleTouchStart(evt) {
            xDown = evt.touches[0].clientX;
            yDown = evt.touches[0].clientY;
        }

        function handleTouchMove(evt) {
            if (!xDown || !yDown) return;
            let xUp = evt.touches[0].clientX,
                yUp = evt.touches[0].clientY,
                xDiff = xDown - xUp,
                yDiff = yDown - yUp;

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 10 && on === "left") handler(new el(this));
                if (xDiff < -10 && on === "right") handler(new el(this));
            } else {
                if (yDiff > 10 && on === "top") handler(new el(this));
                if (yDiff < -10 && on === "bottom") handler(new el(this));
            }

            xDown = null;
            yDown = null;
        }

        return this;
    };

    el.prototype.HotKey = function(query, handler, prevent) {
        let key = "",
            start,
            mapObj = {
                Arrow: "",
                Control: "ctrl"
            },
            queries = query.replace(/\s/g, "");
        return this.Each(function() {
            this.addEventListener(
                "keydown",
                function(event) {
                    prevent && event.preventDefault();

                    key += event.key;

                    key = key.replace(/Arrow|Control/gi, function(matched) {
                        return mapObj[matched];
                    });

                    key = key.replace(/ /g, "space");

                    start = key.toLowerCase().indexOf(queries.toLowerCase());

                    if (start > -1) {
                        handler && handler(new el(this));
                        this.focus();
                        key = "";
                    }
                },
                true
            );
        });
    };

    el.prototype.Fire = function(event) {
        return this.Each(function() {
            event && this[event]()
        });
    };

    el.prototype.Copy = function(target, events) {
        let ons = events.split(":");

        for (let on of ons) {
            this.Add(on.trimStart().trimEnd(), function() {
                let eventFired = new MouseEvent(on.trimStart().trimEnd(), {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                target.el[0].dispatchEvent(eventFired);
            });
        }

        return this;
    };

    el.prototype.Toggle = function(event, methods, prevent) {
        this.check = true;
        this.Add(event, (el)=> {
            if (this.check) {
                methods.handler && methods.handler(el);
                this.check = false;
                return;
            }
            methods.callback && methods.callback(el);
            this.check = true;
        }, prevent);
        return this;
    };

    el.prototype.Not = function(target) {
        let e = new el(this.el);
        return e.Select(`:not(${target})`)
    };

    el.prototype.NotChild = function (target, event, methods){
        let e = new el(this.el);
        return this.Each(function() {
            this.addEventListener(event, (evt) => {
                const flyoutElement = e.Select(target).Dom();
                let targetElement = evt.target;

                do {
                    if (flyoutElement.includes(targetElement)) {
                        methods.callback && methods.callback();
                        return;
                    }

                    targetElement = targetElement.parentNode;
                } while (targetElement);

                methods.handler && methods.handler(e.Select(target))
            });
        })
    }

    el.prototype.Click = function(handler) {
        handler
            ?
            this.Add('click', (el) => handler(el)) :
            this.Fire('click');
        return this;
    };

    el.prototype.Focus = function(handler) {
        handler
            ?
            this.Add('focus', (el) => handler(el)) :
            this.el[0].focus();
        return this;
    };

    el.prototype.Blur = function(handler) {
        handler
            ?
            this.Add('blur', (el) => handler(el)) :
            this.el[0].blur();
        return this;
    };
}

module.exports = {
    Events: Events
};