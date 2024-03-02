import { ROUTES_LINKS } from '../constants/index';
import { getClearLastRoutePath } from './common';

describe('getClearLastRoutePath', () => {
    test('with empty Router', () => {
        expect(getClearLastRoutePath([])).toBe('');
    });

    test('with one location', () => {
        expect(
            getClearLastRoutePath([
                {
                    location: {
                        pathname: ROUTES_LINKS.auth,
                    },
                },
            ]),
        ).toBe(ROUTES_LINKS.auth);
    });

    test('with several locations', () => {
        expect(
            getClearLastRoutePath([
                {
                    location: {
                        pathname: ROUTES_LINKS.registration,
                    },
                },
                {
                    location: {
                        pathname: ROUTES_LINKS.auth,
                    },
                },
                {
                    location: {
                        pathname: ROUTES_LINKS.changePassword,
                    },
                },
            ]),
        ).toBe(ROUTES_LINKS.changePassword);
    });
});
