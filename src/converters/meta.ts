import { TokenMetaType, TokenVariation } from '../types';
import { kebabToCamel } from '../utils';
import { getName, getTags, getType } from './general';

export const getDisplayName = (paths: string[], type: TokenVariation): string => {
    if (type === 'color' || type === 'gradient') {
        //@ts-ignore
        const [, , subcategory, name] = paths;

        return subcategory === 'default' ? name : kebabToCamel([subcategory, name].join('-'));
    }

    if (type === 'shadow') {
        const name = paths.join('-');
        return kebabToCamel(name);
    }

    if (type === 'shape') {
        //@ts-ignore
        const [, size] = paths;
        const name = `round-${size}`;

        return kebabToCamel(name);
    }

    if (type === 'spacing') {
        //@ts-ignore
        const [, size] = paths;
        const name = `spacing-${size}`;

        return kebabToCamel(name);
    }

    if (type === 'typography') {
        //@ts-ignore
        const [, ...rest] = paths;
        const name = `screen-${rest.join('-')}`;

        return kebabToCamel(name);
    }

    if (type === 'fontFamily') {
        //@ts-ignore
        const [, ...rest] = paths;
        const name = `font-family-${rest.join('-')}`;

        return kebabToCamel(name);
    }

    return '';
};

export const getEnabled = (enabled?: boolean) => {
    return enabled === undefined || enabled === true ? true : false;
};

export const getDescription = (paths: string[], comment?: string) => {
    return comment || paths.join(' ');
};

export const getTokenMeta = (paths: string[], key: string, oldToken: any): TokenMetaType => {
    const newPaths = [...paths, key];

    const type = getType(newPaths, oldToken.value);
    const tags = getTags(newPaths, type);
    const name = getName(tags);
    const displayName = getDisplayName(newPaths, type);
    const description = getDescription(newPaths, oldToken.comment);
    const enabled = getEnabled(oldToken.enabled);

    return {
        type,
        name,
        tags,
        displayName,
        description,
        enabled,
    };
};
