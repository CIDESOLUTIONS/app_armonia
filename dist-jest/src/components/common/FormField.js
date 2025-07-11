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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
export const FormField = (_a) => {
    var { label, id, name, error, type = 'text', placeholder, value, onChange } = _a, props = __rest(_a, ["label", "id", "name", "error", "type", "placeholder", "value", "onChange"]);
    return (_jsxs("div", { children: [_jsx(Label, { htmlFor: id, children: label }), _jsx(Input, Object.assign({ id: id, name: name, type: type, placeholder: placeholder, value: value, onChange: onChange, className: error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '' }, props)), error && _jsx("p", { className: "mt-1 text-sm text-red-600", children: error })] }));
};
