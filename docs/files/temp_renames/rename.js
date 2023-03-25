import { readdir, rename } from 'fs/promises';

try {
  // Get the list of files in the current directory
  const files = await readdir('./');

  // Filter the list of files to only include mp3 files
  const mp3Files = files.filter(file => file.endsWith('.mp3'));

  // Rename each mp3 file with a new name based on the current date
  for (const file of mp3Files) {
    const timestamp = Date.now();
    const newName = `${timestamp}.mp3`;
    await rename(file, newName);
    console.log(`Renamed ${file} to ${newName}`);
  }
} catch (err) {
  console.error(err);
}
