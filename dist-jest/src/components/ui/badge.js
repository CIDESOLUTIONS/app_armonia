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
// src/components/ui/badge.tsx
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Si no tienes esta utilidad, la definiremos también
const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
            success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
            destructive: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
            secondary: "border-transparent bg-gray-200 text-gray-700 hover:bg-gray-300",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Badge(_a) {
    var { className, variant } = _a, props = __rest(_a, ["className", "variant"]);
    return (_jsx("div", Object.assign({ className: cn(badgeVariants({ variant }), className) }, props)));
}
export { Badge, badgeVariants };
