function SceneHandler(app, options, context = document) {
    let parent = app.RootElement || app.Dom(0);
    if(options.floating){
        app.Dom(0).addEventListener(
            "scroll",
            function() {
                elementFromTop(options);
            },
            false
        )
    } else {
        window.addEventListener(
            "scroll",
            function() {
                elementFromTop(options);
            },
            false
        )
    }


    function elementFromTop(options) {
        let elem;

        if (typeof options.selector === 'object') elem = options.selector.Dom(0);
        else elem = parent.querySelector(options.selector);

        if(elem){
            let winY;

            try {
                winY = app.Height().get
            }catch (e) {
                winY  = window.innerHeight || context.documentElement.clientHeight;
            }

            let unit = options.unit || "percent",
                distanceFromTop = options.distance,
                distTop = elem.getBoundingClientRect().top,
                distPercent = Math.round((distTop / winY) * 100),
                distPixels = Math.round(distTop),
                distUnit;

            distUnit = unit === "percent" ? distPercent : distPixels;

            if (distUnit <= distanceFromTop) options.handler();
            else if (options.callback) options.callback();
            options.trackers && options.trackers(distUnit <= distanceFromTop, distUnit);
        }
    }

    return this;
}

module.exports = {
    SceneHandler: SceneHandler,
};