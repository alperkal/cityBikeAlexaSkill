var Alexa = require("alexa-sdk");
var freeBikesIntent= require('./intents/FreeBikesIntent.js');
var languageResource = require('./intents/LanguageStrings.js');

exports.handler = function(event, context) {
    var AWS = require('aws-sdk');
    AWS.config.update({region:'eu-west-1'});

    var alexa = Alexa.handler(event, context);
    const APP_ID = process.env.APP_ID;
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.resources = languageResource.messages;
    alexa.dynamoDBTableName = 'CityBikeSession';
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', this.t("LAUNCH_REQUEST_MESSAGE"));
    },
    "freeBikesIntent": function () {
        freeBikesIntent.run(this);
    },
    "AMAZON.HelpIntent": function () {
        this.emit(':ask', this.t("HELP_MESSAGE"));
    },
    "AMAZON.StopIntent": function () {
        this.emit(':tell', this.t("EXIT_MESSAGE"));
    },
    "AMAZON.CancelIntent": function () {
        this.emit(':tell', this.t("EXIT_MESSAGE"));
    },
    "SessionEndedRequest": function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },
};


module.exports.alexaRequest = (event, context) => {
    exports.handler(event, context);
};
