import { readFileSync } from 'fs';
import path from 'path';
import axios from 'axios';

const getDefaultTokens = (type: string, fileName = 'standard') => {
    const defaultTokens = readFileSync(path.resolve(__dirname, '..', `defaultValues/${type}/${fileName}.json`), {
        encoding: 'utf-8',
    });

    return JSON.parse(defaultTokens);
};

const addSkeletonGradients = (theme: any, gradient: any) => {
    theme.dark.surface = {
        ...theme.dark.surface,
        default: {
            ...theme.dark.surface.default,
            ...gradient.dark.surface.default,
        },
        onDark: {
            ...theme.dark.surface.onDark,
            ...gradient.dark.surface.onDark,
        },
        onLight: {
            ...theme.dark.surface.onLight,
            ...gradient.dark.surface.onLight,
        },
        inverse: {
            ...theme.dark.surface.inverse,
            ...gradient.dark.surface.inverse,
        },
    };

    theme.light.surface = {
        ...theme.light.surface,
        default: {
            ...theme.light.surface.default,
            ...gradient.light.surface.default,
        },
        onDark: {
            ...theme.light.surface.onDark,
            ...gradient.light.surface.onDark,
        },
        onLight: {
            ...theme.light.surface.onLight,
            ...gradient.light.surface.onLight,
        },
        inverse: {
            ...theme.light.surface.inverse,
            ...gradient.light.surface.inverse,
        },
    };
};

const compatibleTypography: Record<string, string> = {
    sbermarket: 'sbermarket',
    sbermarket_business: 'sbermarket',
    sbermarket_metro: 'sbermarket',
    sbermarket_selgros: 'sbermarket',
    sbermarket_wlbusiness: 'sbermarket',
    sdds_cs: 'sdds_cs',
    plasma_giga: 'plasma_giga',
    plasma_giga_app: 'plasma_giga',
    plasma_stards: 'plasma_stards',
    sdds_insol: 'sdds_insol',
    sdds_insol_next: 'sdds_insol_next',
    plasma_web_ACTUAL_TYPOGRAPHY: 'plasma_ACTUAL_TYPOGRAPHY',
    plasma_b2c_ACTUAL_TYPOGRAPHY: 'plasma_ACTUAL_TYPOGRAPHY',
    plasma_homeds: 'plasma_ACTUAL_TYPOGRAPHY',
};

const compatibleShape: Record<string, string> = {
    plasma_b2c: 'stylesSalute',
    plasma_web: 'stylesSalute',
    plasma_infra: 'stylesSalute',
    plasma_b2c_ACTUAL_TYPOGRAPHY: 'stylesSalute',
    stylesSalute: 'stylesSalute',
    plasma_stards: 'stylesSalute',
    plasma_homeds: 'stylesSalute',
    sdds_serv: 'sdds_serv',
    plasma_giga: 'stylesSalute',
    plasma_giga_app: 'stylesSalute',
    sdds_bizcom: 'sdds_bizcom',
    sdds_procom: 'sdds_bizcom',
    sdds_bcp: 'sdds_bizcom',
};

const compatibleShadow: Record<string, string> = {
    sdds_serv: 'sdds_serv',
};

const compatibleSpacing: Record<string, string> = {
    sdds_serv: 'sdds_serv',
};

const compatibleFontFamily: Record<string, string> = {
    sbermarket: 'sbermarket',
    plasma_giga_app: 'plasma_giga_app',
    plasma_homeds: 'plasma_homeds',
};

export const getLegacyTheme = async (themeName: string, branchName: string) => {
    console.log(`• Загрузка темы '${themeName}' из ветки '${branchName}' в репозитории Plasma`);

    const response = await axios({
        method: 'GET',
        url: encodeURI(
            `https://raw.githubusercontent.com/salute-developers/plasma/${branchName}/packages/plasma-tokens/data/themes/${themeName}.json`,
        ),
        headers: {
            accept: 'application/json',
        },
    });
    const theme = response.data;

    if (!theme.fontFamily) {
        const specialFileName = compatibleFontFamily[themeName];
        theme.fontFamily = getDefaultTokens('fontFamily', specialFileName);
    }

    if (!theme.shadow) {
        const specialFileName = compatibleShadow[themeName];
        theme.shadow = getDefaultTokens('shadow', specialFileName);
    }

    if (!theme.borderRadius) {
        const specialFileName = compatibleShape[themeName];
        theme.borderRadius = getDefaultTokens('shape', specialFileName);
    }

    if (!theme.typography) {
        const specialFileName = compatibleTypography[themeName];
        theme.typography = getDefaultTokens('typography', specialFileName);
    }

    const gradient = getDefaultTokens('gradient');
    addSkeletonGradients(theme, gradient);

    if (!theme.spacing) {
        const specialFileName = compatibleSpacing[themeName];
        theme.spacing = getDefaultTokens('spacing', specialFileName);
    }

    console.log(`✓ Загрузка темы завершена`);

    return theme;
};
