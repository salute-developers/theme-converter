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
                const startPoint = v.xml.startPoint;
                const endPoint = v.xml.endPoint;

                const angle = calculateAngle(startPoint, endPoint);
                const colors = v.xml.colors.map(getHEXAColor);

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
            const startPoint = value.xml.startPoint;
            const endPoint = value.xml.endPoint;

            const angle = calculateAngle(startPoint, endPoint);
            const colors = value.xml.colors.map(getHEXAColor);

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

export const getAndroidShadowToken = (key: string, value: any) => {
    if (Array.isArray(value)) {
        if (!value[0].android) {
            return {
                [key]: {
                    color: '#000000',
                    elevation: 4,
                },
            };
        }

        const values = value[0].android;

        return {
            [key]: {
                color: getHEXAColor(values.color),
                elevation: Number(values.elevation),
            },
        };
    }
};

export const getAndroidShapeToken = (key: string, value: any) => {
    return {
        [key]: {
            kind: 'round',
            cornerRadius: Number(value.replace('px', '')),
        },
    };
};

export const getAndroidSpacingToken = (key: string, value: any) => {
    return {
        [key]: {
            value: Number(value.replace('px', '')),
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
        const link = font.src[0].match(/https:.*\.woff2?/gim)[0]?.replace('woff2', 'otf');

        return {
            link,
            fontWeight: fontWeightMap[font.fontWeight] || Number(font.fontWeight),
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
