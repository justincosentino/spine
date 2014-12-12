'use strict';

var SurveyLoader = function() {

	this.surveys = [
        { 
            title: 'Survey I (Acceleration, Max, 9, 1)',
            desc: 'This could be the coolest, most relevant survey ever.',
            label: '[Mental Health]',
            questions: [ 
                        {
                          type: 'radio',
                          question: 'What is you favourite CS course?',
                          options: ['CS91','CS21','CS97']
                        }, 
                        {
                          type: 'text',
                          question: 'Is this a super cool project?'

                        },
                        {
                          type: 'range',
                          question: 'Drag the thing to do the stuff based on your feelings:',
                          max: 100,
                          min: 0
                        }
            ],
            trigger: {
              type: 'acceleration',
              thresholdType: 'max',
              threshold: 9,
              occurrences: 1
            }
        },
        { 
            title: 'Survey II (Acceleration, Min, 0, 1)',
            desc: 'This could be the second coolest, most relevant survey ever.',
            label: '[Physical Health]',
            questions: [ 
                        {
                          type: 'radio',
                          question: 'What is you favourite CS course?',
                          options: ['CS91','CS21','CS97']
                        }, 
                        {
                          type: 'text',
                          question: 'Is this a super cool project?'

                        },
                        {
                          type: 'range',
                          question: 'Drag the thing to do the stuff based on your feelings:',
                        },
                        {
                          type: 'range',
                          question: 'Drag the thing to do the stuff based on your feelings:',
                        }
            ],
            trigger: {
              type: 'acceleration',
              thresholdType: 'min',
              threshold: 0,
              occurrences: 1
            }
        },
        { 
          title: 'Survey III (Acceleration, Min, 12, Unlimited)',
          desc: 'Triggered by shaking the device.',
          label: '[Health Food]',
          questions: [ 
                      {
                        type: 'radio',
                        question: 'What is you favourite CS course?',
                        options: ['CS91','CS21','CS97']
                      }, 
                      {
                        type: 'text',
                        question: 'Is this a super cool project?'

                      },
                      {
                        type: 'range',
                        question: 'Drag the thing to do the stuff based on your feelings:'
                      }
          ],
          trigger: {
              type: 'acceleration',
              thresholdType: 'min',
              threshold: 12,
              occurrences: 'unlimited'
          }
        },
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
              type: 'interval',
              interval: 10000,
              occurrences: 3
          }
        },
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
              hour: 14,
              minute: 48,
              second: 0,
              occurrences: 3
          }
        }
      ];
};

SurveyLoader.prototype.get = function get() {
	return this.surveys;
};
