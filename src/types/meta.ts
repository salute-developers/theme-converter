export interface ColorMeta {
    mode: Array<string>;
    category: Array<string>;
    subcategory: Array<string>;
}

export interface GradientMeta {
    mode: Array<string>;
    category: Array<string>;
    subcategory: Array<string>;
}

export interface ShadowMeta {
    direction: Array<string>;
    kind: Array<string>;
    size: Array<string>;
}

export interface ShapeMeta {
    kind: Array<string>;
    size: Array<string>;
}

export interface TypographyMeta {
    screen: Array<string>;
    kind: Array<string>;
    size: Array<string>;
    weight: Array<string>;
}

export interface FontFamilyMeta {
    kind: Array<string>;
}

export interface TokenVariations {
    color: ColorMeta;
    gradient: GradientMeta;
    shadow: ShadowMeta;
    shape: ShapeMeta;
    typography: TypographyMeta;
    fontFamily: FontFamilyMeta;
}

export type TokenVariation = keyof TokenVariations;

export type TokenVariationValues<T extends TokenVariation> = TokenVariations[T];

export type TokenVariationTuples<T extends TokenVariation> = Array<keyof TokenVariationValues<T>>;

export interface TokenMetaType {
    type: TokenVariation;
    name: string;
    tags: Array<string>;
    displayName: string;
    description?: string;
    enabled: boolean;
}

export interface ThemeMetaType extends Partial<TokenVariations> {
    name: string;
    version: string;
    tokens: Array<TokenMetaType>;
}
