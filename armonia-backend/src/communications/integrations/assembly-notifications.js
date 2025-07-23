"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAssemblyConvocation = notifyAssemblyConvocation;
function notifyAssemblyConvocation(assemblyId, title, scheduledDate, location) {
    console.log("Assembly Convocation: ".concat(title, " on ").concat(scheduledDate, " at ").concat(location, " (ID: ").concat(assemblyId, ")"));
}
