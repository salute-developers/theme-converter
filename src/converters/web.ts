import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

import { TokenVariations } from '../types';

const getGradientParts = (value: string) => {
    if (!value.includes('gradient')) {
        return undefined;
    }

    const gradient = value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
    const type = value.substring(0, value.indexOf('('));
    const parts = gradient.split(/,\s(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/gm);

    return [type, ...parts];
};

export const getNormalizeGradient = (gradient: string) => {
    const gradients = getGradientParts(gradient);

    if (!gradients) {
        return gradient;
    }

    const [type, ...parts] = gradients;
    const [angle, ...layers] = parts;
    const newLayers = layers.map((layer) => {
        const [color, angle] = layer.split(/ (\d*\.?\d+%)/gim);

        return `${getHEXAColor(color)} ${angle}`;
    });

    return `${type}(${[angle, ...newLayers].join(', ')})`;
};

export const getWebColorToken = (key: string, value: string) => {
    let newValue = value;

    const alfa = (value.match(/(-0\..\d)/gm) || [])[0];
    if (alfa) {
        const normalizeAlfa = Math.round((1 + Number(alfa)) * 100) / 100;
        newValue = value.replace(/\[(-0\..*)\]/gm, `[${normalizeAlfa}]`);
    }

    newValue = getHEXAColor(newValue);

    return { [key]: newValue };
};

export const getWebGradientToken = (key: string, value: any) => {
    if (typeof value === 'string') {
        const regex = /((rgba?|hsla?)\([\d.%\s,()#\w]*\))|(#\w{6,8})|(linear|radial)-gradient\([\d.%\s,()#\w]+?\)(?=,*\s*(linear|radial|$|rgb|hsl|#))/g;
        const gradientArray = value.match(regex);

        const result = gradientArray?.map(getNormalizeGradient);

        return { [key]: result };
    }

    if (Array.isArray(value)) {
        const values = value.map((v) => {
            return getNormalizeGradient(v.origin);
        });

        return { [key]: values };
    }

    if (!Array.isArray(value) && typeof value === 'object') {
        return { [key]: [getNormalizeGradient(value.origin)] };
    }
};

export const getWebShadowToken = (key: string, value: any) => {
    if (Array.isArray(value)) {
        const values = value.map((v) => v.origin);

        return { [key]: values };
    }
};

export const getWebShapeToken = (key: string, value: any) => {
    return { [key]: value };
};

export const getWebTypographyToken = (key: string, value: any) => {
    const fonts: Record<string, string> = {
        'SB Sans Display': 'display',
        'SB Sans Text': 'text',
    };

    return {
        [key]: {
            fontFamilyRef: `font-family.${fonts[value['font-family']]}`,
            fontWeight: value['font-weight'],
            fontStyle: value['font-style'],
            fontSize: value['font-size'],
            lineHeight: value['line-height'],
            letterSpacing: value['letter-spacing'],
        },
    };
};

export const getWebFontFamily = (key: string, value: any) => {
    return {
        [key]: {
            name: value['name'],
            fonts: value['fonts'],
        },
    };
};

export const getWebToken = (type: keyof TokenVariations, name: string, value: any) => {
    if (type === 'color') {
        return getWebColorToken(name, value);
    }

    if (type === 'gradient') {
        return getWebGradientToken(name, value);
    }

    if (type === 'shadow') {
        return getWebShadowToken(name, value);
    }

    if (type === 'shape') {
        return getWebShapeToken(name, value);
    }

    if (type === 'typography') {
        return getWebTypographyToken(name, value);
    }

    if (type === 'fontFamily') {
        return getWebFontFamily(name, value);
    }
};
