"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Flipbook_vue_1 = require("./Flipbook.vue");
Flipbook_vue_1.default.install = function (app) {
    app.component(Flipbook_vue_1.default.name, Flipbook_vue_1.default);
    return app;
};
exports.default = Flipbook_vue_1.default;
