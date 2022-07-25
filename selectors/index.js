const { find } = require('../locals/el');

const Scope = (app) => find(app);
const Hoisting = (selector, context = document) => find({
    selector: selector,
    RootElement: context
});

module.exports = {
    Scope: Scope,
    Hoisting: Hoisting
};

