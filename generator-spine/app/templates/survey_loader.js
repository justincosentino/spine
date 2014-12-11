var SurveyLoader = function() {
	this.surveys = <%= surveyData %>;
};

SurveyLoader.prototype.get = function get() {
	return this.surveys;
}
