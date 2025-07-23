"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Features = void 0;
var common_1 = require("@nestjs/common");
var Features = function () {
    var features = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        features[_i] = arguments[_i];
    }
    return (0, common_1.SetMetadata)('features', features);
};
exports.Features = Features;
