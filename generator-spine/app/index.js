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
		    checked: false
		}, 
		{
		    name: 'WP8',
		    value: 'wp8',
		    checked: false
		}
	    ]
	}
    ];
    
    this.prompt(prompts, function (answers) {
	var features = answers.features;
	
	this.projectName = answers.projectName;
	this.appPackage = answers.appPackage;
	
	function hasFeature(feat) { return features.indexOf(feat) !== -1; }
	
	var builds = []
	if(hasFeature('ios')) builds.push('\'ios\'');
	if(hasFeature('android')) builds.push('\'android\'');
	if(hasFeature('wp8')) builds.push('\'wp8\'');
  		this.buildForPlatforms = "[" + builds.join(", ") + "]"; 
	
	done();
    }.bind(this));
};

SpineGenerator.prototype.gruntfile = function gruntfile() {
    this.template('Gruntfile.js');
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

SpineGenerator.prototype.mainStylesheet = function mainStylesheet() {
    this.copy('main.css', 'app/styles/main.css');
};

SpineGenerator.prototype.writeIndex = function writeIndex() {
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/index.js', [
	'scripts/index.js'
    ]);
};

SpineGenerator.prototype.app = function app() {
    this.write('app/index.html', this.indexFile);
  	this.copy('index.js', 'app/scripts/index.js');
};

SpineGenerator.prototype.phonegapSetup = function phonegapSetup() {
    var self = this;
    phonegap.create({path:path.resolve('phonegap'), name: this.projectName, id: this.appPackage}, function(e) { self.log.create('Initialized PhoneGap project'); });
    this.mkdir('app/res');
    this.mkdir('app/images');
    extfs.copyDirSync(path.resolve('phonegap/.cordova'), path.resolve('.cordova'), function(e) {self.log.create("Copied .cordova configuration") });
    this.template('_config.xml', 'config.xml');
};

