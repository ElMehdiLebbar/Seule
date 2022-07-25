const {el} = require('../locals/el')
const {getScrollbarWidth} = require('../locals/getScrollbarWidth')

const easeOutCubic = (currentIteration, startValue, changeInValue, totalIterations) => {
    return (
        changeInValue *
        (Math.pow(currentIteration / totalIterations - 1, 3) + 1) +
        startValue
    );
};

const Scroll = ()=>{
    el.prototype.Scroll = function(to = 0, context = document) {
        const elements = this,
            scrollToItemId = (scrollContainer, srollToId) => {

            const
                animIterations = Math.round(60 * 0.5);

            let from = scrollContainer.scrollTop,
                scroll = scrollContainer.scrollTop,
                offset = srollToId.offsetTop,
                dimension = scrollContainer.scrollHeight,
                client = scrollContainer.clientHeight,
                currentIteration = 0,
                by;


            by = offset - scroll;

            if (from < offset) {
                if (offset > dimension - client)
                    by = dimension - client - scroll;
            }

            (function scroll() {
                scrollContainer.scrollTop = easeOutCubic(
                    currentIteration,
                    from - to,
                    by,
                    animIterations
                );

                currentIteration++;

                if (currentIteration < animIterations) {
                    requestAnimationFrame(scroll);
                }
            })();
            return this
        };

        return {
            get size(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(getScrollbarWidth(el))

                if(arr.length === 1) return arr[0]
                return arr
            },
            parent(el){
                let p = elements.el[0].parentElement;
                if (el) p = el.el[0];
                scrollToItemId(p, elements.el[0]);
                return elements
            },
            run(){
                scrollToItemId(context.documentElement || context.body, elements.el[0]);
                return elements
            },
            get left(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(el.pageXOffset || el.scrollLeft)

                if(arr.length === 1) return arr[0]
                return arr
            },
            get top(){
                const arr = [];
                for (let el of elements.el)
                    arr.push(el.pageYOffset || el.scrollTop)

                if(arr.length === 1) return arr[0]
                return arr
            },
            to : (event = "top", duration = 0) => {
                let start = elements.scrollLeft,
                    change = to - start,
                    currentTime = 0,
                    increment = 20;

                event = Capitalize(event);

                const animateScroll = () => {
                    currentTime += increment;
                    elements["scroll" + event] = easeOutCubic(currentTime, start, change, duration);
                    if (currentTime < duration)
                        setTimeout(animateScroll, increment);
                };
                animateScroll();
                return this;
            }
        }
    }
}

function Capitalize(string) {
    return string
        .charAt(0)
        .toUpperCase() + string.slice(1);
}

module.exports = {
    Scroll: Scroll
};