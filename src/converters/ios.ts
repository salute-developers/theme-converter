import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

import { TokenVariations } from '../types';
import { calculateAngle, roundTo } from '../utils';

const fontWeightMap: Record<string, string> = {
    100: 'ultraLight',
    200: 'thin',
    300: 'semibold',
    400: 'regular',
    500: 'medium',
    600: 'light',
    700: 'heavy',
    800: 'bold',
    900: 'black',
};

const defaultFontSize = 16;

export const getIOSColorToken = (key: string, value: string) => {
    let newValue = value;

    const alfa = (value.match(/(-0\..\d)/gm) || [])[0];
    if (alfa) {
        const normalizeAlfa = roundTo(1 + Number(alfa));
        newValue = value.replace(/\[(-0\..*)\]/gm, `[${normalizeAlfa}]`);
    }

    newValue = getHEXAColor(newValue);

    return { [key]: newValue };
};

export const getIOSGradientToken = (key: string, value: any) => {
    if (typeof value === 'string') {
        if (value.includes('linear')) {
            return {
                [key]: [
                    {
                        kind: 'linear',
                        locations: [0, 1],
                        colors: ['#FFFFFF', '#000000'],
                        angle: 90,
                    },
                ],
            };
        }

        if (value.includes('radial')) {
            return {
                [key]: [
                    {
                        kind: 'radial',
                        locations: [0, 1],
                        colors: ['#FFFFFF', '#000000'],
                        startPointX: 0,
                        startPointY: 0,
                        endPointX: 1,
                        endPointY: 1,
                    },
                ],
            };
        }

        return {
            [key]: [
                {
                    kind: 'linear',
                    locations: [0, 1],
                    colors: ['#FFFFFF', '#000000'],
                    angle: 90,
                },
            ],
        };
    }

    if (Array.isArray(value)) {
        const values = value.map((v) => {
            if (v.swift && v.swift.type === '.linear') {
                const startPoint = v.swift.startPoint;
                const endPoint = v.swift.endPoint;

                const angle = calculateAngle(startPoint, endPoint);
                const colors = v.swift.colors.map(getHEXAColor);

                return {
                    kind: 'linear',
                    locations: v.swift.locations,
                    colors,
                    angle,
                };
            }

            if (v.swift && v.swift.type === '.radial') {
                const colors = v.swift.colors.map(getHEXAColor);

                return {
                    kind: 'radial',
                    locations: v.swift.locations,
                    colors,
                    startPointX: v.swift.startPoint.x,
                    startPointY: v.swift.startPoint.y,
                    endPointX: v.swift.endPoint.x,
                    endPointY: v.swift.endPoint.y,
                };
            }

            if (v.backgroundColor) {
                const background = getHEXAColor(v.backgroundColor);

                return {
                    kind: 'color',
                    background,
                };
            }
        });

        return { [key]: values };
    }

    if (!Array.isArray(value) && typeof value === 'object') {
        if (value.swift) {
            const startPoint = value.swift.startPoint;
            const endPoint = value.swift.endPoint;

            const angle = calculateAngle(startPoint, endPoint);
            const colors = value.swift.colors.map(getHEXAColor);

            return {
                [key]: [
                    {
                        kind: 'linear',
                        locations: value.swift.locations,
                        colors,
                        angle,
                    },
                ],
            };
        }

        if (value.linearGradient) {
            const colors = getHEXAColor(value.linearGradient.colors);

            return {
                [key]: [
                    {
                        kind: 'linear',
                        locations: [0, 1],
                        colors,
                        angle: value.linearGradient.angle,
                    },
                ],
            };
        }
    }
};

export const getIOSShadowToken = (key: string, value: any) => {
    if (Array.isArray(value)) {
        if (!value[0].ios) {
            return {
                [key]: {
                    color: '#000000',
                    offset: {
                        width: 0,
                        height: 5,
                    },
                    opacity: 0.5,
                    radius: 1.5,
                },
            };
        }

        const values = value[0].ios;

        return {
            [key]: {
                color: values.color,
                offset: {
                    width: values.offset.width,
                    height: values.offset.height,
                },
                opacity: values.opacity,
                radius: values.radius,
            },
        };
    }
};

export const getIOSShapeToken = (key: string, value: any) => {
    return {
        [key]: {
            kind: 'round',
            cornerRadius: Number(value.replace('px', '')),
        },
    };
};

export const getIOSTypographyToken = (key: string, value: any) => {
    const fonts: Record<string, string> = {
        'SB Sans Display': 'display',
        'SB Sans Text': 'text',
    };

    const size = Number(value['font-size'].replace(/r?em/gi, '')) * defaultFontSize;
    const lineHeight = Number(value['line-height'].replace(/r?em/gi, '')) * defaultFontSize;
    const weight = fontWeightMap[value['font-weight']];
    const style = value['font-style'];
    const kerning = value['letter-spacing'] === 'normal' ? 0 : Number(value['letter-spacing'].replace(/r?em/gi, ''));

    return {
        [key]: {
            fontFamilyRef: `font-family.${fonts[value['font-family']]}`,
            weight,
            style,
            size,
            lineHeight,
            kerning,
        },
    };
};

export const getIOSFontFamily = (key: string, value: any) => {
    const fonts = value['fonts'].map((font: any) => {
        const link = font.src[0].match(/https:.*\.woff2?/gim)[0]?.replace('woff2', 'otf');

        return {
            link,
            fontWeight: Number(font.fontWeight) || 400,
            fontStyle: font.fontStyle,
        };
    });

    return {
        [key]: {
            name: value['name'],
            fonts: fonts,
        },
    };
};

export const getIOSToken = (type: keyof TokenVariations, name: string, value: any) => {
    if (type === 'color') {
        return getIOSColorToken(name, value);
    }

    if (type === 'gradient') {
        return getIOSGradientToken(name, value);
    }

    if (type === 'shadow') {
        return getIOSShadowToken(name, value);
    }

    if (type === 'shape') {
        return getIOSShapeToken(name, value);
    }

    if (type === 'typography') {
        return getIOSTypographyToken(name, value);
    }

    if (type === 'fontFamily') {
        return getIOSFontFamily(name, value);
    }
};
