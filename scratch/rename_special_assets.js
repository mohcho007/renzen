const fs = require('fs');
const path = require('path');

const renames = [
  { from: 'privat-rengøring.png', to: 'privat-rengoring.png' },
  { from: 'flytterengøring-2.png', to: 'flytterengoring-2.png' },
  { from: 'før-renzen.png', to: 'foer-renzen.png' },
  { from: 'før-renzen-1.png', to: 'foer-renzen-1.png' },
  { from: 'før-renzen-2.png', to: 'foer-renzen-2.png' }
];

const publicDir = path.join(__dirname, '..', 'public');

// 1. Rename files in public/
renames.forEach(({ from, to }) => {
  const oldPath = path.join(publicDir, from);
  const newPath = path.join(publicDir, to);
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${from} -> ${to}`);
    } catch (e) {
      console.error(`Error renaming ${from}:`, e.message);
    }
  } else {
    console.log(`Already renamed or missing: ${from}`);
  }
});

// Also handle tæpperens.png (delete if taepperens.png exists)
const oldTaeppe = path.join(publicDir, 'tæpperens.png');
const newTaeppe = path.join(publicDir, 'taepperens.png');
if (fs.existsSync(oldTaeppe)) {
  if (fs.existsSync(newTaeppe)) {
    fs.unlinkSync(oldTaeppe);
    console.log(`Deleted duplicate: tæpperens.png (taepperens.png exists)`);
  } else {
    fs.renameSync(oldTaeppe, newTaeppe);
    console.log(`Renamed: tæpperens.png -> taepperens.png`);
  }
}

// 2. Scan and replace references in codebase
const filesToReplace = [
  path.join(__dirname, '..', 'components', 'dealside', 'DealsideLandingPage.tsx'),
  path.join(__dirname, '..', 'components', 'home', 'HomePageClient.tsx'),
  path.join(__dirname, '..', 'components', 'dynamic', 'DynamicStaticSections.tsx'),
  path.join(__dirname, '..', 'components', 'dynamic', 'DynamicPageClient.tsx')
];

const replacements = [
  { search: '/privat-rengøring.png', replace: '/privat-rengoring.png' },
  { search: '/flytterengøring-2.png', replace: '/flytterengoring-2.png' },
  { search: '/før-renzen.png', replace: '/foer-renzen.png' },
  { search: '/før-renzen-1.png', replace: '/foer-renzen-1.png' },
  { search: '/før-renzen-2.png', replace: '/foer-renzen-2.png' },
  { search: '/tæpperens.png', replace: '/taepperens.png' }
];

filesToReplace.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let replaced = false;
    replacements.forEach(({ search, replace }) => {
      if (content.includes(search)) {
        content = content.split(search).join(replace);
        console.log(`Replacing reference in ${path.basename(file)}: ${search} -> ${replace}`);
        replaced = true;
      }
    });
    if (replaced) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated file: ${path.basename(file)}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Renaming and replacement process completed.');
