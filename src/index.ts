import { convertTheme, convertAllThemes, getParams } from './services';

const { theme, version, branch, all } = getParams();

if (all === 'true') {
    convertAllThemes(branch, version);
}

if (all === 'false') {
    convertTheme(theme, version, branch);
}
