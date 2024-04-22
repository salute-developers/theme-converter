import { readFileSync } from 'fs';
import path from 'path';
import axios from 'axios';

const getDefaultTokens = (type: string, fileName = 'standard') => {
    const defaultTokens = readFileSync(path.resolve(__dirname, '..', `defaultValues/${type}/${fileName}.json`), {
        encoding: 'utf-8',
    });

    return JSON.parse(defaultTokens);
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
        const specialFile = themeName.includes('sbermarket') ? 'sbermarket' : undefined;
        theme.typography = getDefaultTokens('typography', specialFile);
    }

    // TODO: Удалить, когда появится обработка токенов "Отступы"
    if (theme.spacing) {
        theme.spacing = {};
    }

    console.log(`✓ Загрузка темы завершена`);

    return theme;
};
