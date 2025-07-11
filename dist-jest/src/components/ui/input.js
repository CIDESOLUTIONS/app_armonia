// C:\Users\meciz\Documents\armonia\frontend\src\components\ui\input.tsx
"use client";
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
import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
export const Input = forwardRef((_a, ref) => {
    var { className, type } = _a, props = __rest(_a, ["className", "type"]);
    return (_jsx("input", Object.assign({ ref: ref, type: type, className: cn('w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent', 'border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white', className), autoComplete: "off" }, props)));
});
Input.displayName = 'Input';
