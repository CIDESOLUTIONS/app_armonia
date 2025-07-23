"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanicType = exports.PanicStatus = void 0;
var PanicStatus;
(function (PanicStatus) {
    PanicStatus["ACTIVE"] = "ACTIVE";
    PanicStatus["RESOLVED"] = "RESOLVED";
    PanicStatus["CANCELLED"] = "CANCELLED";
})(PanicStatus || (exports.PanicStatus = PanicStatus = {}));
var PanicType;
(function (PanicType) {
    PanicType["MEDICAL"] = "MEDICAL";
    PanicType["SECURITY"] = "SECURITY";
    PanicType["FIRE"] = "FIRE";
    PanicType["OTHER"] = "OTHER";
})(PanicType || (exports.PanicType = PanicType = {}));
