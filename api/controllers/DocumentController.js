/**
 * DocumentController
 *
 * @description :: Server-side logic for managing documents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var uuid = require('node-uuid'),
    path = require('path');

module.exports = {

  upload: function(req, res) {

    var results = [],
        streamOptions = {
          dirname: sails.config.appPath + "/public/files/",
          saveAs: function(file) {
            var filename = file.filename,
                newName = uuid.v4() + path.extname(filename);
            return newName;
          },
          completed: function(fileData, next) {
            Document.create(fileData).exec(function(err, savedFile){
              if (err) {
                next(err);
              } else {
                results.push({
                  id: savedFile.id,
                  url: '/files/' + savedFile.localName
                });
                next();
              }
            });
          }
        };

    req.file('docs').upload(Uploader.documentReceiverStream(streamOptions),
      function (err, files) {
        if (err) return res.serverError(err);

        res.json({
          message: files.length + ' file(s) uploaded successfully!',
          files: results
        });
      }
    );
  },

  _config: {}
};
