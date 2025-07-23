"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = void 0;
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PARTIAL"] = "PARTIAL";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["OVERDUE"] = "OVERDUE";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["COMPLETED"] = "COMPLETED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
