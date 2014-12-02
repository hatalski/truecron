/**
 * Created by estet on 11/16/14.
 */
var task = require('./task'),
    fs = require('fs'),
    archiver = require('archiver'),
    p = require('path'),
    util = require('util');

var ArchiveTask = function(files, outputName, type)
{
    var self = this;

    self.settings =
    {
        files: files,
        outputName: outputName,
        type:type
    };

    self.run = function(callback) {
        var output = fs.createWriteStream(self.settings.outputName);

        archive = archiver(self.settings.type ? self.settings.type : 'zip');

        output.on('close', function () {
            self.onMessage(archive.pointer() + ' total bytes');
            self.complete();
        });

        archive.on('error', function (err) {
            self.onError(err);
            throw err;
        });

        archive.pipe(output);

        if (!Array.isArray(self.settings.files)) {
            self.settings.files = [self.settings.files];
        }

        for (var i in self.settings.files) {
            archive.append(fs.createReadStream(self.settings.files[i]), {name: p.basename(self.settings.files[i])});
        }

        archive.finalize();

        self.onComplete(callback);
    };

    self.init();
};

ArchiveTask.prototype.init = function()
{
    ArchiveTask.super_.prototype.init();
};

util.inherits(ArchiveTask, task);

module.exports = ArchiveTask;