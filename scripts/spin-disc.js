const fs = require("fs");

const readmePath = "README.md";
const songsPath = "data/sptexp.csv";
const widgetPath = "scripts/spin_it.md";

const readme = fs.readFileSync(readmePath, "utf8");
const csv = fs.readFileSync(songsPath, "utf8").trim();
const widgetTemplate = fs.readFileSync(widgetPath, "utf8");

const songs = parseSongsCsv(csv);
const song = songs[Math.floor(Math.random() * songs.length)];

const widget = widgetTemplate
  .replaceAll("{{Song}}", escapeHtml(song.song))
  .replaceAll("{{Artist}}", escapeHtml(song.artist));

const newBlock = `<!-- disc-s -->
${widget}
<!-- disc-e -->`;

const updatedReadme = readme.replace(
  /<!-- disc-s -->[\s\S]*?<!-- disc-e -->/,
  newBlock
);

fs.writeFileSync(readmePath, updatedReadme);

console.log(`Updated README with: ${song.song} by ${song.artist}`);

function parseSongsCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(Boolean);

  return lines.slice(1).map((line) => {
    const columns = parseCsvLine(line);

    return {
      song: columns[0].trim(),
      artist: columns[1].trim()
    };
  });
}

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
