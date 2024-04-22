import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import archiver from 'archiver';

export const createThemeZip = async (dir: string, themeName: string, version: string) => {
    console.log(`• Создание архива с темой '${themeName}' версии '${version}'`);

    const rootDir = path.resolve(dir, '../', themeName);
    existsSync(rootDir) || mkdirSync(rootDir);

    const output = createWriteStream(path.join(rootDir, `${version}.zip`));

    const archive = archiver('zip', {
        zlib: { level: 9 },
    });

    archive.pipe(output);
    archive.directory(path.join(dir), false);
    await archive.finalize();

    console.log(`✓ Создание архива завершено`);
};
