var SurveyLoader = function() {
	this.surveys = <%= this.surveyData %>;
};

SurveyLoader.prototype.get() = function() {
	return surveys;
}