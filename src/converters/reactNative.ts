import { getHEXAColor } from '@salutejs/plasma-tokens-utils';

import { TokenVariations } from '../types';
import { calculateAngle, getNormalizeValueWithAlpha } from '../utils';

const defaultFontSize = 16;

const fontWeightMap: Record<string, string> = {
    normal: '400',
    bold: '600',
};

export const getReactNativeColorToken = (key: string, value: string) => {
    return { [key]: getNormalizeValueWithAlpha(value) };
};

export const getReactNativeGradientToken = (key: string, value: any) => {
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

export const getReactNativeShadowToken = (key: string, value: any) => {
    if (Array.isArray(value)) {
        if (!value[0].android || !value[0].ios) {
            return {
                [key]: {
                    color: '#000000',
                    elevation: 4,
                    offsetWidth: 0,
                    offsetHeight: 5,
                    opacity: 0.5,
                    radius: 1.5,
                },
            };
        }

        const androidValues = value[0].android;
        const iosValues = value[0].ios;

        return {
            [key]: {
                color: androidValues.color,
                elevation: Number(androidValues.elevation),
                offsetWidth: iosValues.offset.width,
                offsetHeight: iosValues.offset.height,
                opacity: iosValues.opacity,
                radius: iosValues.radius,
            },
        };
    }
};

export const getReactNativeShapeToken = (key: string, value: any) => {
    return {
        [key]: {
            kind: 'round',
            cornerRadius: Number(value.replace('px', '')),
        },
    };
};

export const getReactNativeTypographyToken = (key: string, value: any) => {
    const fonts: Record<string, string> = {
        'SB Sans Display': 'display',
        'SB Sans Text': 'text',
    };

    const fontSize = Number(value['font-size'].replace(/r?em/gi, '')) * defaultFontSize;
    const lineHeight = Number(value['line-height'].replace(/r?em/gi, '')) * defaultFontSize;
    const fontWeight = fontWeightMap[value['font-weight']] || value['font-weight'];
    const fontStyle = value['font-style'];
    const letterSpacing =
        value['letter-spacing'] === 'normal' ? 0 : Number(value['letter-spacing'].replace(/r?em/gi, ''));

    return {
        [key]: {
            fontFamilyRef: `fontFamily.${fonts[value['font-family']]}`,
            fontWeight,
            fontStyle,
            fontSize,
            lineHeight,
            letterSpacing,
        },
    };
};

export const getReactNativeFontFamilyToken = (key: string, value: any) => {
    const fonts = value['fonts'].map((font: any) => {
        const link = font.src[0].match(/https:.*\.woff2?/gim)[0]?.replace('woff2', 'otf');

        return {
            link,
            fontWeight: fontWeightMap[font.fontWeight] || font.fontWeight,
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

export const getReactNativeToken = (type: keyof TokenVariations, name: string, value: any) => {
    if (type === 'color') {
        return getReactNativeColorToken(name, value);
    }

    if (type === 'gradient') {
        return getReactNativeGradientToken(name, value);
    }

    if (type === 'shadow') {
        return getReactNativeShadowToken(name, value);
    }

    if (type === 'shape') {
        return getReactNativeShapeToken(name, value);
    }

    if (type === 'typography') {
        return getReactNativeTypographyToken(name, value);
    }

    if (type === 'fontFamily') {
        return getReactNativeFontFamilyToken(name, value);
    }
};
