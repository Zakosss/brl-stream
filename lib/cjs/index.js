"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express_1 = tslib_1.__importDefault(require("express"));
var dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
app.use(express_1.default.static('public'));
app.listen(port);
//# sourceMappingURL=index.js.map