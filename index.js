
var APP_ID = "amzn1.ask.skill.d8f81c20-032c-4ded-bfb4-8a76572fa99b"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var AlexaSkill = require('./AlexaSkill');
var hosts = require("./hosts");
var isSiteUp = require("./api");

var StatusChecker = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
StatusChecker.prototype = Object.create(AlexaSkill.prototype);
StatusChecker.prototype.constructor = StatusChecker;

StatusChecker.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("StatusChecker onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

StatusChecker.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("StatusChecker onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Willkommen zum Website Status Checker. ";
    speechOutput += "Um den Status einer Seite zu überprüfen, kannst du z.B. die folgende Frage für Facebook verwenden:  ist Facebook down?";
    
    var repromptText = "Für genauere Infos, benutze bitte das Hilfe Kommando";

    response.ask(speechOutput, repromptText);
};

StatusChecker.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("StatusChecker onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

StatusChecker.prototype.intentHandlers = {

    "CheckIfUp": function (intent, session, response) {

        var hostName = intent.slots.host.value.toLowerCase();

        var foundHosts = hosts.filter(x => x.name.toLowerCase() === hostName);

        if (foundHosts.length > 0) {
            isSiteUp(foundHosts[0].url).then(isup => {
                console.log(isup);

                var msg = foundHosts[0].name + " ist ";

                if(isup) {
                    msg += "online";
                } else {
                    msg += "offline";
                }

                response.tell(msg);
            }).catch(() => {
                response.tell(foundHosts[0].name + " ist offline");
            });
        }
    },
    "AMAZON.HelpIntent": function(intent, session, response) {
        var text = "Um den Status einer Seite zu überprüfen kannst du z.B. folgende Phrasen verwenden: ";
        text += "frage Status Checker ob Facebook funktioniert,";
        text += "frage Status Checker nach dem Status von Youtube,";
        text += "frage Status Checker wie der Status von Google ist. ";

        text += "Die möglichen Webseiten die mittels Status Checker überprüft werden können, findest du in der Skill-Beschreibung.";

        var repromptText = "Welche Seite würdest du gerne überprüfen?";
        response.ask(text, repromptText);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var sc = new StatusChecker();
    sc.execute(event, context);
};

