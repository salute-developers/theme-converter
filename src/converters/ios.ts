import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

import { TokenVariations } from '../types';
import {
    calculateAngle,
    getGradientParts,
    getNativeLinearGradients,
    getNormalizeValueWithAlpha,
    parseGradientsByLayer,
} from '../utils';

const fontWeightMap: Record<string, string> = {
    100: 'ultralight',
    200: 'thin',
    300: 'light',
    400: 'regular',
    500: 'medium',
    600: 'semibold',
    700: 'bold',
    800: 'heavy',
    900: 'black',
    normal: 'regular',
    bold: 'bold',
};

const defaultFontSize = 16;

export const getIOSColorToken = (key: string, value: string) => {
    return { [key]: getNormalizeValueWithAlpha(value) };
};

export const getIOSGradientToken = (key: string, value: any) => {
    if (typeof value === 'string') {
        if (value.includes('linear')) {
            const gradientArray = parseGradientsByLayer(value);
            const gradients = gradientArray?.map(getGradientParts);

            return {
                [key]: gradients
                    ? gradients.map(getNativeLinearGradients)
                    : [
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
                        centerX: 0,
                        centerY: 0,
                        startRadius: 0,
                        endRadius: 1,
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
                    centerX: v.swift.startPoint.x,
                    centerY: v.swift.startPoint.y,
                    startRadius: 0,
                    endRadius: v.swift.endPoint.y || v.swift.endPoint.x, // TODO: Обновить после #PLASMA-3068
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
            const colors = value.linearGradient.colors.map(getHEXAColor);

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

export const getIOSShadowToken = (key: string, values: any) => {
    if (Array.isArray(values)) {
        if (!values[0].android) {
            return {
                [key]: [
                    {
                        color: '#08080814',
                        offsetX: 0,
                        offsetY: 4.0,
                        spreadRadius: -4.0,
                        blurRadius: 14.0,
                    },
                ],
            };
        }

        return {
            // INFO: Временно берутся значения из android
            [key]: values.map(({ android, ios }) => ({
                color: getHEXAColor(android.color || ios?.color),
                offsetX: android.offsetX || ios?.offset.width || 0,
                offsetY: android.offsetY || ios?.offset.height || 4.0,
                spreadRadius: android.spreadRadius || ios?.radius || -4.0,
                blurRadius: android.blurRadius || ios?.radius || 14.0,
            })),
        };
    }
};

export const getIOSShapeToken = (key: string, value: any) => {
    const newValue = value.match(/px/gim)?.[0] ? Number(value.replace('px', '')) : parseFloat(value) * 16;

    return {
        [key]: {
            kind: 'round',
            cornerRadius: newValue,
        },
    };
};

export const getIOSSpacingToken = (key: string, value: any) => {
    const newValue = value.match(/px/gim)?.[0] ? Number(value.replace('px', '')) : parseFloat(value) * 16;

    return {
        [key]: {
            value: newValue,
        },
    };
};

export const getIOSTypographyToken = (key: string, value: any) => {
    const kind = key.split('.')[1];

    const size = Number(value['font-size'].replace(/r?em/gi, '')) * defaultFontSize;
    const lineHeight = Number(value['line-height'].replace(/r?em/gi, '')) * defaultFontSize;
    const weight = fontWeightMap[value['font-weight']] || value['font-weight'];
    const style = value['font-style'];
    const kerning = value['letter-spacing'] === 'normal' ? 0 : Number(value['letter-spacing'].replace(/r?em/gi, ''));

    return {
        [key]: {
            fontFamilyRef: `fontFamily.${kind}`,
            weight,
            style,
            size,
            lineHeight,
            kerning,
        },
    };
};

export const getIOSFontFamilyToken = (key: string, value: any) => {
    const fonts = value['fonts'].map((font: any) => {
        const link = font.src[0].match(/https:.*\.(woff2|ttf)?/gim)?.[0].replace('woff2', 'otf');

        return {
            link,
            weight: fontWeightMap[font.fontWeight] || font.fontWeight,
            style: font.fontStyle,
        };
    });

    return {
        [key]: {
            name: value['name'],
            fonts,
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

    if (type === 'spacing') {
        return getIOSSpacingToken(name, value);
    }

    if (type === 'typography') {
        return getIOSTypographyToken(name, value);
    }

    if (type === 'fontFamily') {
        return getIOSFontFamilyToken(name, value);
    }
};
