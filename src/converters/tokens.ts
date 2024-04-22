import { TokenMetaType, TokenVariations } from '../types';
import { getName, getTags, getType } from './general';
import { getTokenMeta } from './meta';

export const getTokensData = (func: (type: keyof TokenVariations, name: string, value: any) => any, theme: any) => {
    const getTokens = (obj: any, way: any[] = [], results: any = {}) => {
        for (let key in obj) {
            if (typeof obj[key] !== 'object') {
                return results;
            }

            results = { ...results, ...getTokens(obj[key], [...way, key], results) };

            if (obj[key].value) {
                const newPaths = [...way, key];

                const value = obj[key].value;
                const type = getType(newPaths, value);
                const tags = getTags(newPaths, type);
                const name = getName(tags);

                const token = func(type, name, value) || {};

                results = {
                    ...results,
                    [type]: {
                        ...results[type],
                        ...token,
                    },
                };
            }
        }

        return results;
    };

    return getTokens(theme);
};

export const getTokensMetaData = (obj: any, way: any[] = []): TokenMetaType[] => {
    let results: any = [];

    for (let key in obj) {
        if (typeof obj[key] !== 'object') {
            return results;
        }

        results = results.concat(getTokensMetaData(obj[key], [...way, key]));

        if (obj[key].value) {
            const data = getTokenMeta(way, key, obj[key]);

            results.push(data);
        }
    }

    return results;
};
