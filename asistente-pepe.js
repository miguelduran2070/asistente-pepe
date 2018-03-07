var restify = require('restify');
var builder = require('botbuilder');
var dotenv = require('dotenv');

// Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '0c6341c6-8efb-4a64-9f0f-fd0170348378',
    appPassword: 'nhlVCNN71=?=(rkupGBW091'
});

// Ahora utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Para utilizar variables de entorno
dotenv.config(); 

let luisApp = process.env.LUIS_APP;
let luisKey = process.env.LUIS_KEY;

// Crear un procesador LUIS que apunte a nuestro modelo en el root (/)
//var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${luisApp}?subscription-key=${luisKey}&verbose=true&timezoneOffset=-300&q=`;
var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/7cfef6b6-fb43-4075-8ec5-12ef3f3c116c?subscription-key=6a73ff41d3a74d14b469d9ccc32092fc&verbose=true&timezoneOffset=-300&q=`;

var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Esta función se ejecuta cuando el Intent == ordenarTaxi
dialog.matches('obtenercertificado', [
    function (session, args, next) {
        builder.Prompts.text(session, '¿A dónde quieres que lo envíe?');
    },
    function(session, args) {
        session.send(`Enviando certificado a **${args.response}**`)
    }
]);
dialog.matches('Saludar', [
    function (session, args, next) {
        session.send(`Hola, mi nombre es **Pepe** ${luisApp} resolveré las preguntas más frecuentas que usualmente tienen nuestros clientes.`)
    }
]);

//Este es el Default, cuando LUIS no entendió la consulta.
dialog.onDefault(builder.DialogAction.send("No entendí. Me lo dices de nuevo pero de otra manera, por favor?"));