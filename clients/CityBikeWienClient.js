
'use strict';

var Client = require('node-rest-client').Client;
var apiUrl = "http://dynamisch.citybikewien.at/citybike_xml.php?json";

module.exports.run = function (context,requestedStation,onSuccess) {
    var client = new Client();
    console.log("requestedStation: "+requestedStation);
    client.get(apiUrl, function (data, httpResponse) {
        var foundStation = data.find(function(station) {
            return station.name.toLowerCase().startsWith(requestedStation.toLowerCase());
        });
        if(foundStation) {
            onSuccess(foundStation);
            return;
        }else{
            context.emit(':tell', context.t("CANT_FIND_STATION_MESSAGE",requestedStation));
            return;
        }
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
        context.emit(':tell', context.t("CITYBIKE_API_ERROR_MESSAGE"));
    });
}