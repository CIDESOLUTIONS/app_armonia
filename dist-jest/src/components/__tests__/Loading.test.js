import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';
describe('Loading component', () => {
    it('renders correctly', () => {
        render(_jsx(Loading, {}));
        const loadingElement = screen.getByTestId('loading-spinner');
        expect(loadingElement).toBeInTheDocument();
    });
});
