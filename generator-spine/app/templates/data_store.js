'use strict';

// define datastore prototype
var DataStore = function() {};

// accepts a json object that needs to be written
// writes a file with the filename as the current date
DataStore.prototype.write = function write(file) {

    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem) {
        console.log("Reached main data directory:", fileSystem);
        var now = Date();
        var filename = now.toJSON();

        fileSystem.getFile(filename, {create:true}, function(file) {
            console.log("Created the file:", file);
            writeFile(file);           
        });
    });

    function writeFile(file) {
        if(!file) return;
        file.createWriter(function(fileWriter) {
            fileWriter.seek(fileWriter.length);
            var blob = new Blob(file, {type:'text/plain'});
            fileWriter.write(blob);
            console.log("Successfully wrote file");
        }, writeError);
    }

    function writeError() {
        console.log("Failed to write file");
    }
};


