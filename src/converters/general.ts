import { TokenVariation } from '../types';
import { camelToKebab } from '../utils';

export const getType = (paths: string[], value: any): TokenVariation => {
    if (
        paths.find((path) => path.toLowerCase().includes('gradient')) ||
        value?.xml ||
        value?.swift ||
        (value?.length && value[0].xml) ||
        (value?.length && value[0].swift)
    ) {
        return 'gradient';
    }

    if (paths.find((path) => path.includes('shadow'))) {
        return 'shadow';
    }

    if (paths.find((path) => path.includes('border'))) {
        return 'shape';
    }

    if (paths.find((path) => path.includes('spacing'))) {
        return 'spacing';
    }

    if (paths.find((path) => path.includes('typography'))) {
        return 'typography';
    }

    if (paths.find((path) => path.includes('fontFamily'))) {
        return 'fontFamily';
    }

    return 'color';
};

export const getTags = (paths: string[], type: TokenVariation): string[] => {
    if (type === 'shadow') {
        const [, ...rest] = paths;
        return rest.map(camelToKebab);
    }

    if (type === 'shape') {
        const [, ...rest] = paths;

        rest.unshift('round');
        return rest.map(camelToKebab);
    }

    if (type === 'spacing') {
        return paths.map(camelToKebab);
    }

    if (type === 'color' || type === 'gradient') {
        const [mode, category, subcategory, name] = paths;
        const newName = name.replace(category, '');

        return [mode, category, subcategory, newName].map(camelToKebab);
    }

    if (type === 'typography') {
        const [, screenSize, name] = paths;
        const [kind, size, weight = 'normal'] = name.split('-');

        return [`screen-${screenSize}`, kind, size, weight].map(camelToKebab);
    }

    if (type === 'fontFamily') {
        const [, ...rest] = paths;
        return rest.map(camelToKebab);
    }

    return paths.map(camelToKebab);
};

export const getName = (tags: string[]): string => {
    return tags.join('.');
};
