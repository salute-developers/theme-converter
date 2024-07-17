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
        const specialFile = themeName.includes('sbermarket') ? 'sbermarket' : undefined;
        theme.fontFamily = getDefaultTokens('fontFamily', specialFile);
    }

    if (!theme.shadow) {
        theme.shadow = getDefaultTokens('shadow');
    }

    if (!theme.borderRadius) {
        theme.borderRadius = getDefaultTokens('shape');
    }

    if (!theme.typography) {
        const specialFileName = compatibleTypography[themeName];
        theme.typography = getDefaultTokens('typography', specialFileName);
    }

    const gradient = getDefaultTokens('gradient');
    addSkeletonGradients(theme, gradient);

    // TODO: Удалить, когда появится обработка токенов "Отступы"
    if (theme.spacing) {
        theme.spacing = {};
    }

    console.log(`✓ Загрузка темы завершена`);

    return theme;
};
