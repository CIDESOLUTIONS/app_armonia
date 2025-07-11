'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = (_a) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (_jsx(DialogPrimitive.Portal, Object.assign({ className: cn(className) }, props, { children: _jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center sm:items-center", children: children }) })));
};
DialogPortal.displayName = DialogPrimitive.Portal.displayName;
const DialogOverlay = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(DialogPrimitive.Overlay, Object.assign({ ref: ref, className: cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in', className) }, props)));
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef((_a, ref) => {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    return (_jsxs(DialogPortal, { children: [_jsx(DialogOverlay, {}), _jsxs(DialogPrimitive.Content, Object.assign({ ref: ref, className: cn('fixed z-50 grid w-full gap-4 rounded-b-lg bg-white p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0', className) }, props, { children: [children, _jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), _jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })] }), _jsx("span", { className: "sr-only", children: "Cerrar" })] })] }))] }));
});
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = (_a) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("div", Object.assign({ className: cn('flex flex-col space-y-1.5 text-center sm:text-left', className) }, props)));
};
DialogHeader.displayName = 'DialogHeader';
const DialogFooter = (_a) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx("div", Object.assign({ className: cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className) }, props)));
};
DialogFooter.displayName = 'DialogFooter';
const DialogTitle = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(DialogPrimitive.Title, Object.assign({ ref: ref, className: cn('text-lg font-semibold leading-none tracking-tight', className) }, props)));
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef((_a, ref) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    return (_jsx(DialogPrimitive.Description, Object.assign({ ref: ref, className: cn('text-sm text-muted-foreground', className) }, props)));
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, };
