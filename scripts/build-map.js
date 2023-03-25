import { readdir, stat, writeFile } from 'fs/promises';
import path from 'path';

const getAudioFiles = async (dir) => {
  try {
    const files = await readdir(dir);
    const audioFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.mp3' || ext === '.wav' || ext === '.ogg'; // Add more audio file extensions as needed
    });
    return audioFiles;
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err}`);
    return [];
  }
};

const getAudioFilesBySubdirectory = async (rootDir) => {
  try {
    const subdirs = await readdir(rootDir);
    const subdirPromises = subdirs.map(async (subdir) => {
      const subdirPath = path.join(rootDir, subdir);
      const subDirStat = await stat(subdirPath);
      if (subDirStat.isDirectory()) {
        const audioFiles = await getAudioFiles(subdirPath);
        return [subdir, audioFiles];
      } else {
        return [subdir, []];
      }
    });
    const audioFilesBySubdir = Object.fromEntries(
      await Promise.all(subdirPromises)
    );
    return JSON.stringify(audioFilesBySubdir, null); // the last argument is for pretty-printing the JSON output
  } catch (err) {
    console.error(`Error reading directory ${rootDir}: ${err}`);
    return '';
  }
};

const rootDir = path.join('docs', 'files'); // change this to the root directory you want to search in
try {
  const result = await getAudioFilesBySubdirectory(rootDir);
  await writeFile('src/map.json', result.toString());
} catch (err) {
  console.error(err);
}
