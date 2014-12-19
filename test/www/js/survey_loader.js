'use strict';

var SurveyLoader = function() {

	this.surveys = [
        { 
          title: 'Food Survey',
          desc: 'Please answer the below questions about your most recent meal.',
          label: '[Health Food]',
          questions: [ 
                      {
                        type: 'radio',
                        question: 'What meal did you just eat?',
                        options: ['Breakfast','Lunch','Dinner','Snack','Other']
                      }, 
                      {
                        type: 'text',
                        question: 'Please describe the food that you consumed during this meal:'

                      },
                      {
                        type: 'range',
                        question: 'How did you feel after this meal?'
                      }
          ],
          trigger: {
              type: 'time',
              interval: 'daily',
              hour: 21,
              minute: 14,
              second: 0,
              occurrences: 1
          }
        }
    ];
};

SurveyLoader.prototype.get = function get() {
	return this.surveys;
};
