
'use strict';

var Client = require('node-rest-client').Client;
var apiUrl = "http://dynamisch.citybikewien.at/citybike_xml.php?json";

module.exports.run = function (context,requestedStation,onSuccess) {
    var client = new Client();
    console.log("requestedStation: "+requestedStation);
    client.get(apiUrl, function (data, httpResponse) {

        var foundStation = checkStation1(data,requestedStation)
        if(foundStation) {
            console.log("Match found in 1st check:")
            console.log("requestedStation:" + requestedStation)
            console.log("foundStation:" + foundStation )

            onSuccess(foundStation);
            return;
        }

        foundStation = checkStation2(data,requestedStation)
        if(foundStation) {
            console.log("Match found in 2nd check:")
            console.log("requestedStation:" + requestedStation)
            console.log("foundStation:" + foundStation )
            onSuccess(foundStation);
            return;
        }

        foundStation = checkStation3(data,requestedStation)
        if(foundStation) {
            console.log("Match found in 3rd check:")
            console.log("requestedStation:" + requestedStation)
            console.log("foundStation:" + foundStation )
            onSuccess(foundStation);
            return;
        }



        context.emit(':tell', context.t("CANT_FIND_STATION_MESSAGE",requestedStation));
        return;
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
        context.emit(':tell', context.t("CITYBIKE_API_ERROR_MESSAGE"));
    });
};

//direct compare
function checkStation1(allStations, requestedStation){
    return allStations.find(function(station) {
        return station.name.toLowerCase().startsWith(requestedStation.toLowerCase());
    });
}

//try normalized station names
function checkStation2(allStations, requestedStation){
    return allStations.find(function(station) {
        return normalize(station.name).startsWith(normalize(requestedStation));
    });
}

function checkStation3(allStations, requestedStation){
    var levenshtein = require('fast-levenshtein');
    return allStations.find(function(station) {
        return levenshtein.get(normalize(station.name), normalize(requestedStation)) < 3;
    });
}

function normalize(name){
    return name.replace(/\s+/g, '')
               .replace(/-/g, '')
               .replace(/ß/g, 'ss')
               .toLowerCase();
}