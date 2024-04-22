import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

import { getAndroidToken, getIOSToken, getTokensData, getWebToken } from '../converters';

const createThemeWithData = (dir: string, tokens: any, platform: string) => {
    const rootDir = path.join(dir, platform);
    existsSync(rootDir) || mkdirSync(rootDir);

    Object.entries(tokens).forEach(([type, data]) => {
        writeFileSync(path.join(rootDir, `./${platform}_${type}.json`), JSON.stringify(data, null, 4));
    });
};

export const createThemeData = (dir: string, theme: any) => {
    const data = [
        { tokens: getTokensData(getWebToken, theme), platform: 'web' },
        { tokens: getTokensData(getAndroidToken, theme), platform: 'android' },
        { tokens: getTokensData(getIOSToken, theme), platform: 'ios' },
    ];

    data.forEach(({ tokens, platform }) => {
        console.log(`• Создание файла токенов в формате json со значениями для платформы '${platform}'`);
        createThemeWithData(dir, tokens, platform);
    });

    console.log(`✓ Создание файлов завершено`);
};
