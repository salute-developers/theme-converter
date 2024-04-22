import { convertTheme, convertAllThemes, getParams } from './services';

const { theme, version, branch, all } = getParams();

if (all) {
    convertAllThemes();
} else {
    convertTheme(theme, version, branch);
}
