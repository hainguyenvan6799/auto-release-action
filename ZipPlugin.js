const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

class ZipPlugin {
  constructor(options) {
    this.options = options || {};
  }

  apply(compiler) {
    const {outputFilePath, zipFilePath, fileName} = this.options;

    compiler.hooks.afterEmit.tap('ZipPlugin', () => {
      const output = fs.createWriteStream(path.join(zipFilePath, fileName));
      const archive = archiver('zip', {zlib: {level: 9}});

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        console.log('Zip file created successfully.');
      });

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn(err);
        } else {
          throw err;
        }
      });

      archive.on('error', (err) => {
        throw err;
      });
      
      archive.pipe(output);
      archive.directory(outputFilePath, false);

      archive.finalize();
    });
  }
}

module.exports = ZipPlugin;
