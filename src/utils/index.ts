import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

export const roundTo = (value: number, precision = 2) =>
    Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

export const camelToKebab = (str: string) => {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
};

export const kebabToCamel = (str: string) => {
    return str.replace(/-([a-z])/g, (_, group) => {
        return group.toUpperCase();
    });
};

export const getNormalizeValueWithAlpha = (value: string) => {
    let newValue = value;

    const alfa = (value.match(/(-0\..*\d)/gm) || [])[0];
    if (alfa) {
        const normalizeAlfa = Math.round((1 + Number(alfa)) * 100) / 100;
        newValue = value.replace(/\[(-0\..*)\]/gm, `[${normalizeAlfa}]`);
    }

    newValue = newValue === '#F' ? '#FFFFFF' : newValue;

    return getHEXAColor(newValue);
};

export const calculateAngle = (pointA: { x: number; y: number }, pointB: { x: number; y: number }) => {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;

    const angleInRadians = Math.atan2(dy, dx);
    const angleInDegrees = angleInRadians * (180 / Math.PI);

    const angle = angleInDegrees < 0 ? angleInDegrees + 360 : angleInDegrees;

    return roundTo(angle);
};

export const parseGradientsByLayer = (value: string) => {
    const regex =
        /((rgba?|hsla?)\([\d.%\s,()#\w]*\))|(#\w{6,8})|(linear|radial)-gradient\([\d.%\s,()#\w]+?\)(?=,*\s*(linear|radial|$|rgb|hsl|#))/g;
    return value.match(regex);
};

export const getGradientParts = (value: string) => {
    if (!value.includes('gradient')) {
        return undefined;
    }

    const gradient = value.substring(value.indexOf('(') + 1, value.lastIndexOf(')'));
    const type = value.substring(0, value.indexOf('('));
    const parts = gradient.split(/,\s(?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/gm);

    return [type, ...parts];
};

export const getNativeLinearGradients = (gradient?: string[]) => {
    if (!gradient) {
        return null;
    }

    const [, ...parts] = gradient;
    const [angle, ...layers] = parts;
    const newLayers = layers.reduce(
        (acc, layer) => {
            const [color, location] = layer.split(/ (\d*\.?\d+%)/gim);

            acc.locations = acc.locations || [];
            acc.colors = acc.colors || [];

            acc.locations.push(roundTo(parseFloat(location) / 100, 4));
            acc.colors.push(getHEXAColor(color));

            return acc;
        },
        {} as {
            locations: number[];
            colors: string[];
        },
    );

    return {
        kind: 'linear',
        ...newLayers,
        angle: parseFloat(angle),
    };
};
