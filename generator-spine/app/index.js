'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var extfs = require('extended-fs');

var SpineGenerator = module.exports = function SpineGenerator (args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

    this.on('end', function () {
      this.installDependencies({
        skipInstall: this.options['skip-install'],
        callback: function () {
            for (var i = 0; i < this.buildForPlatforms.length; i++) {
                this.spawnCommand('cordova', ['platform', 'add', this.buildForPlatforms[i]]);
            }
            for (var i = 0; i < this.requiredPlugins.length; i++) {
                this.spawnCommand('cordova', ['plugin', 'add', this.requiredPlugins[i]]);
            }
        }.bind(this) // bind the callback to the parent scope
      });
    });
};

util.inherits(SpineGenerator, yeoman.generators.Base);

SpineGenerator.prototype.askFor = function askFor() {
    var done = this.async();
    
    var prompts = [
	{
	    name: 'projectName',
	    message: 'What is the name of your Spine project?',
	    default: 'Hello World'
	},
	{ 
	    name: 'appPackage',
	    message: 'What is your application package',
	    default: 'com.spine.helloworld'
	},
	{
	    type: 'checkbox',
	    name: 'features',
	    message: 'What platform builds would you like?',
	    choices: [
		{
		    name: 'Android',
		    value: 'android',
		    checked: true
		}, 
		{
		    name: 'iOS',
		    value: 'ios',
		    checked: true
		}, 
		{
		    name: 'WP8',
		    value: 'wp8',
		    checked: false
		}
	    ]
	}, 
    {
        type: 'checkbox',
        name: 'plugins',
        message: 'What plugins do you need for your application?',
        choices: [
        {
            name: 'Geolocation',
            value: 'geolocation',
            checked: true
        }, 
        {
            name: 'Accelerometer',
            value: 'accelerometer',
            checked: true
        }, 
        {
            name: 'BluetoothLE',
            value: 'bluetoothle',
            checked: false
        }
        ]
    },
	{
		name: "surveyPath",
		message: "Where is your survey file?", 
        default: '~/survey.json'
	}
    ];
    
    this.prompt(prompts, function (answers) {
    	var features = answers.features;
    	
    	this.projectName = answers.projectName;
    	this.appPackage = answers.appPackage;
    	this.surveyPath = answers.surveyPath;
        this.plugins = answers.plugins;

    	
    	function findElem(lst, item) { return lst.indexOf(item) !== -1; }
    	
    	var builds = []
    	if(findElem(features, 'ios')) builds.push('ios');
    	if(findElem(features, 'android')) builds.push('android');
    	if(findElem(features, 'wp8')) builds.push('wp8');
      	this.buildForPlatforms = builds; 

        var plugins = ['org.apache.cordova.dialogs']
        if(findElem(features, 'geolocation')) {
            plugins.push('org.apache.cordova.geolocation');
            plugins.push('org.transistorsoft.cordova.background-geolocation');
        }
        if(findElem(features, 'accelerometer')) {
            plugins.push('org.apache.cordova.device-motion');
        }
        if(findElem(features, 'bluetoothle')) {
            plugins.push('com.randdusing.bluetoothle');
        }
    	this.requiredPlugins = plugins;

    	done();
    }.bind(this));
};

SpineGenerator.prototype.packageJSON = function packageJSON() {
    this.log.create("Writing npm package file...");
    this.template('_package.json', 'package.json');
};

SpineGenerator.prototype.git = function git() {
    this.copy('gitignore', '.gitignore');
};

SpineGenerator.prototype.cordova = function cordova() {
    var self = this;
    self.log.create("Initialized Cordova project")
    extfs.copyDirSync(
        path.resolve(this.sourceRoot() + '/.cordova'), 
        path.resolve('.cordova'), 
        function(e) {
            self.log.create("Copied .cordova configuration") 
        }
    );
    extfs.copyDirSync(
        path.resolve(this.sourceRoot() + '/plugins'), 
        path.resolve('plugins'), 
        function(e) {}
    );
    extfs.copyDirSync(
        path.resolve(this.sourceRoot() + '/platforms'), 
        path.resolve('platforms'), 
        function(e) {}
    );
    this.template('_config.xml', 'www/config.xml');
};

SpineGenerator.prototype.gulp = function gulp() {
	this.copy('gulpfile.js', 'gulpfile.js');
}	

SpineGenerator.prototype.readme = function readme() {
    this.copy('README.md', 'README.md');
}   

SpineGenerator.prototype.mainStylesheet = function mainStylesheet() {
    this.copy('styles/app.css', 'www/styles/app.css');
	this.copy('styles/onsen-css-components-default.css', 'www/styles/onsen-css-components-default.css');
	this.copy('styles/onsen-css-components.css', 'www/styles/onsen-css-components.css');
	this.copy('styles/onsenui.css', 'www/styles/onsenui.css');
	this.copy('styles/onsen-css-components-blue-basic-theme.css', 'www/styles/onsen-css-components-blue-basic-theme.css');
};

SpineGenerator.prototype.writeIndex = function writeIndex() {
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);
    this.indexFile = this.appendScripts(this.indexFile, 'js/app.js', ['js/app.js']);
    this.indexFile = this.appendScripts(this.indexFile, 'js/survey_loader.js', ['js/survey_loader.js']);
};

SpineGenerator.prototype.jsLibs = function jsLibs() {
    this.log.create("Copying JavaScript libraries...");
	extfs.copyDirSync(path.resolve(this.sourceRoot() +'/lib/'), path.resolve('www/lib/'));
}

SpineGenerator.prototype.surveyFile = function surveyFile() {
    this.log.create("Copying survey file...");
	var surveyPath = this.surveyPath;
	this.surveyData = this.readFileAsString(this.surveyPath);
	this.template('survey_loader.js');
	this.copy('survey_loader.js', 'www/js/survey_loader.js');
}

SpineGenerator.prototype.app = function app() {
    this.log.create("Writing application files...");
    this.write('www/index.html', this.indexFile);
  	this.copy('app.js', 'www/js/app.js');
};


