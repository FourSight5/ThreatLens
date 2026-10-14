const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browserExe = fs.existsSync(chromePath) ? chromePath : edgePath;
const htmlPath = path.resolve(__dirname, 'threatlens_architecture_and_apis.html');
const pdfPath = path.resolve(__dirname, 'ThreatLens_Architecture_and_APIs.pdf');

console.log('Using browser:', browserExe);
console.log('HTML source:', htmlPath);
console.log('PDF destination:', pdfPath);

const args = [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfPath}`,
  `file:///${htmlPath.replace(/\\/g, '/')}`,
];

execFile(browserExe, args, (error, stdout, stderr) => {
  if (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
  console.log('Browser stdout:', stdout);
  console.log('Browser stderr:', stderr);

  if (fs.existsSync(pdfPath)) {
    const stat = fs.statSync(pdfPath);
    console.log(`SUCCESS! Generated PDF: ${pdfPath} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error('PDF file was not created.');
    process.exit(1);
  }
});
