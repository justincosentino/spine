'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var phonegap = require('phonegap');
var path = require('path');
var fs = require('fs');
var extfs = require('extended-fs');

var SpineGenerator = module.exports = function SpineGenerator (args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
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
		name: "surveyPath",
		message: "Where is your survey file?", 
        default: '/Users/callen/surveys.json'
	}
    ];
    
    this.prompt(prompts, function (answers) {
	var features = answers.features;
	
	this.projectName = answers.projectName;
	this.appPackage = answers.appPackage;
	this.surveyPath = answers.surveyPath;
	
	function hasFeature(feat) { return features.indexOf(feat) !== -1; }
	
	var builds = []
	if(hasFeature('ios')) builds.push('\'ios\'');
	if(hasFeature('android')) builds.push('\'android\'');
	if(hasFeature('wp8')) builds.push('\'wp8\'');
  		this.buildForPlatforms = "[" + builds.join(", ") + "]"; 
	
	done();
    }.bind(this));
};

SpineGenerator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'package.json');
};

SpineGenerator.prototype.git = function git() {
    this.copy('gitignore', '.gitignore');
};

SpineGenerator.prototype.bower = function bower() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
};

SpineGenerator.prototype.phonegapSetup = function phonegapSetup() {
    var self = this;
    self.log.create("Initialized Cordova project")
    extfs.copyDirSync(
        path.resolve(this.sourceRoot() + '/.cordova'), 
        path.resolve('.cordova'), 
        function(e) {
            self.log.create("Copied .cordova configuration") 
        });
    this.template('_config.xml', 'www/config.xml');
};

SpineGenerator.prototype.gulp = function gulp() {
	this.copy('gulpfile.js', 'gulpfile.js');
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
	extfs.copyDirSync(path.resolve(this.sourceRoot() +'/lib/'), path.resolve('www/lib/'));
}

SpineGenerator.prototype.surveyFile = function surveyFile() {
	var surveyPath = this.surveyPath;
	this.surveyData = this.readFileAsString(this.surveyPath);
	this.template('survey_loader.js');
	this.copy('survey_loader.js', 'www/js/survey_loader.js');
}

SpineGenerator.prototype.app = function app() {
    this.write('www/index.html', this.indexFile);
  	this.copy('app.js', 'www/js/app.js');
};


