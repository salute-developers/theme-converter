import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

import { TokenVariations } from '../types';
import {
    calculateAngle,
    getGradientParts,
    getNativeLinearGradients,
    getNormalizeValueWithAlpha,
    parseGradientsByLayer,
} from '../utils';

const defaultFontSize = 16;

const fontWeightMap: Record<string, number> = {
    normal: 400,
    bold: 700,
};

export const getAndroidColorToken = (key: string, value: string) => {
    return { [key]: getNormalizeValueWithAlpha(value) };
};

export const getAndroidGradientToken = (key: string, value: any) => {
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
                        centerX: 0.5,
                        centerY: 0.5,
                        radius: 1,
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
            if (v.xml && v.xml.type === '.linear') {
                const colors = v.xml.colors.map(getHEXAColor);

                // INFO: Договорились с командой натива брать значения угла из веба как есть
                const gradientArray = parseGradientsByLayer(v.origin);
                const gradients = gradientArray?.map(getGradientParts);
                const angle = gradients?.map(getNativeLinearGradients)[0]?.angle;

                return {
                    kind: 'linear',
                    locations: v.xml.locations,
                    colors,
                    angle,
                };
            }

            if (v.xml && v.xml.type === '.radial') {
                const colors = v.xml.colors.map(getHEXAColor);

                return {
                    kind: 'radial',
                    locations: v.xml.locations,
                    colors,
                    centerX: v.xml.center.x,
                    centerY: v.xml.center.y,
                    radius: v.xml.radius.x,
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
        if (value.xml) {
            const colors = value.xml.colors.map(getHEXAColor);

            // INFO: Договорились с командой натива брать значения угла из веба как есть
            const gradientArray = parseGradientsByLayer(value.origin);
            const gradients = gradientArray?.map(getGradientParts);
            const angle = gradients?.map(getNativeLinearGradients)[0]?.angle;

            return {
                [key]: [
                    {
                        kind: 'linear',
                        locations: value.xml.locations,
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

export const getAndroidShadowToken = (key: string, values: any) => {
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
                        fallbackElevation: 4.0,
                    },
                ],
            };
        }

        return {
            [key]: values.map(({ android }) => ({
                color: getHEXAColor(android.color),
                offsetX: android.offsetX || 0,
                offsetY: android.offsetY || 4.0,
                spreadRadius: android.spreadRadius || -4.0,
                blurRadius: android.blurRadius || 14.0,
                fallbackElevation: Number(android.elevation) || android.fallbackElevation || 0,
            })),
        };
    }
};

export const getAndroidShapeToken = (key: string, value: any) => {
    const newValue = value.match(/px/gim)?.[0] ? Number(value.replace('px', '')) : parseFloat(value) * 16;

    return {
        [key]: {
            kind: 'round',
            cornerRadius: newValue,
        },
    };
};

export const getAndroidSpacingToken = (key: string, value: any) => {
    const newValue = value.match(/px/gim)?.[0] ? Number(value.replace('px', '')) : parseFloat(value) * 16;

    return {
        [key]: {
            value: newValue,
        },
    };
};

export const getAndroidTypographyToken = (key: string, value: any) => {
    const kind = key.split('.')[1];

    const textSize = Number(value['font-size'].replace(/r?em/gi, '')) * defaultFontSize;
    const lineHeight = Number(value['line-height'].replace(/r?em/gi, '')) * defaultFontSize;
    const fontWeight = fontWeightMap[value['font-weight']] || Number(value['font-weight']);
    const fontStyle = value['font-style'];
    const letterSpacing =
        value['letter-spacing'] === 'normal' ? 0 : Number(value['letter-spacing'].replace(/r?em/gi, ''));

    return {
        [key]: {
            fontFamilyRef: `fontFamily.${kind}`,
            fontWeight,
            fontStyle,
            textSize,
            lineHeight,
            letterSpacing,
        },
    };
};

export const getAndroidFontFamilyToken = (key: string, value: any) => {
    const fonts = value['fonts'].map((font: any) => {
        const link = font.src[0].match(/https:.*\.(woff2|ttf)?/gim)?.[0].replace('woff2', 'otf');

        return {
            link,
            fontWeight: fontWeightMap[font.fontWeight] || Number(font.fontWeight),
            fontStyle: font.fontStyle,
        };
    });

    return {
        [key]: {
            name: value['name'],
            fonts,
        },
    };
};

export const getAndroidToken = (type: keyof TokenVariations, name: string, value: any) => {
    if (type === 'color') {
        return getAndroidColorToken(name, value);
    }

    if (type === 'gradient') {
        return getAndroidGradientToken(name, value);
    }

    if (type === 'shadow') {
        return getAndroidShadowToken(name, value);
    }

    if (type === 'shape') {
        return getAndroidShapeToken(name, value);
    }

    if (type === 'spacing') {
        return getAndroidSpacingToken(name, value);
    }

    if (type === 'typography') {
        return getAndroidTypographyToken(name, value);
    }

    if (type === 'fontFamily') {
        return getAndroidFontFamilyToken(name, value);
    }
};
