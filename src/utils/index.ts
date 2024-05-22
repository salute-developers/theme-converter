import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

export const roundTo = (value: number, precision = 2) =>
    Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

export const camelToKebab = (str: string) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const kebabToCamel = (str: string) => {
    return str.replace(/-([a-z])/g, function (_, group) {
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
