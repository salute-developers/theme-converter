import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'path';

import { getLegacyTheme } from './getLegacyTheme';
import { createThemeData } from './createThemeData';
import { createThemeMeta } from './createThemeMeta';
import { createThemeZip } from './createThemeZip';

const themeList = [
    'default',
    'plasma_b2c',
    'plasma_web',
    'sberHealth',
    'sbermarket_business',
    'sbermarket_metro',
    'sbermarket_selgros',
    'sbermarket_wlbusiness',
    'sbermarket',
    'sberonline',
    'sberprime',
    'sdds_serv',
    'sdds_dfa',
    'sdds_cs',
    'sdds_finportal',
    'sdds_os',
    'sdds_insol',
    'stylesSalute',
];

export const convertTheme = async (theme: string, version = '0.1.0', branchName: string) => {
    const themeNameList = theme.split(',');

    for (const themeName of themeNameList) {
        const theme = await getLegacyTheme(themeName, branchName);

        const dir = path.resolve(__dirname, '../../', 'themes', 'temp');
        existsSync(dir) || mkdirSync(dir, { recursive: true });

        createThemeMeta(dir, themeName, version, theme);

        if (themeName !== 'default') {
            createThemeData(dir, theme);
        }

        await createThemeZip(dir, themeName, version);

        await createThemeZip(dir, themeName, 'latest');

        rmSync(dir, { recursive: true, force: true });
    }
};

export const convertAllThemes = async (branchName = 'dev', version = '0.1.0') => {
    await convertTheme(themeList.join(','), version, branchName);
};

export { getParams } from './getParams';
