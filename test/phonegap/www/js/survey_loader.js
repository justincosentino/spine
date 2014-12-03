if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

var SurveyLoader = function() {

	var reader = new FileReader();
	reader.readAsText('phonegap/www/surveys.json', encoding);
	this.surveys = [];


};

SurveyLoader.prototype.get()