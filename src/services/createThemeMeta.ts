import path from 'path';

import { getTokensMetaData } from '../converters';
import {
    ThemeMetaType,
    ColorMeta,
    GradientMeta,
    ShadowMeta,
    ShapeMeta,
    TokenMetaType,
    TypographyMeta,
    FontFamilyMeta,
    TokenVariations,
    TokenVariation,
    TokenVariationTuples,
} from '../types';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

class ThemeMeta implements ThemeMetaType {
    name: string;
    version: string;

    color?: ColorMeta;
    gradient?: GradientMeta;
    shadow?: ShadowMeta;
    shape?: ShapeMeta;
    typography?: TypographyMeta;
    fontFamily?: FontFamilyMeta;

    tokens: TokenMetaType[];

    constructor(name: string, version: string, tokens: TokenMetaType[]) {
        this.name = name;
        this.version = version;
        this.tokens = tokens;

        this.color = this.getMeta('color', ['mode', 'category', 'subcategory']);
        this.gradient = this.getMeta('gradient', ['mode', 'category', 'subcategory']);
        this.shadow = this.getMeta('shadow', ['direction', 'kind', 'size']);
        this.shape = this.getMeta('shape', ['kind', 'size']);
        this.typography = this.getMeta('typography', ['screen', 'kind', 'size', 'weight']);
        this.fontFamily = this.getMeta('fontFamily', ['kind']);
    }

    private getMeta<K extends TokenVariation, T extends TokenVariationTuples<K>>(
        type: K,
        fields: T,
    ): TokenVariations[K] | undefined {
        const tokens = this.tokens?.filter((token) => token.type === type);

        if (!tokens?.length) {
            return undefined;
        }

        const sets = fields.map(() => new Set<string>());

        tokens.forEach((token) => {
            fields.forEach((_, index) => {
                const tag = token.tags[index];
                sets[index].add(tag);
            });
        });

        return fields.reduce(
            (acc, field, index) => ({
                ...acc,
                [field]: Array.from(sets[index]),
            }),
            {} as TokenVariations[K],
        );
    }

    public convertToJSON() {
        return JSON.stringify(this, null, 4);
    }
}

export const createThemeMeta = (dir: string, themeName: string, version: string, theme: any) => {
    console.log(`• Создание файла токенов в формате json с мета информацией`);

    const tokens = getTokensMetaData(theme);

    const rootDir = path.join(dir);
    const themeMeta = new ThemeMeta(themeName, version, tokens);

    existsSync(rootDir) || mkdirSync(rootDir);
    writeFileSync(path.join(rootDir, `./meta.json`), themeMeta.convertToJSON());

    console.log(`✓ Создание файла завершено`);
};
