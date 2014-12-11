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
              times: 1
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
              times: 1
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
              times: 'unlimited'
          }
        },
        { 
          title: 'Survey IV (Interval, 10000 ms, 10)',
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
              type: 'interval',
              interval: 10000,
              times: 10
          }
        }
      ];
};

SurveyLoader.prototype.get = function get() {
	return this.surveys;
};
