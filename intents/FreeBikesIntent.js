/**
 * Created by alperkal on 28/01/2017.
 */

'use strict';

const cityBikeClient = require('./../clients/CityBikeWienClient.js');

//const stationImageUrlBase = "http://dynamisch.citybikewien.at/include/r4_get_data.php?url=terminal/cont/img/station_"
const stationImageUrlBase = "https://s3-eu-west-1.amazonaws.com/citybikestationimages/";

const stationImageUrlExtension = ".jpg";

module.exports.run = function (context) {
    var slots = context.event.request.intent.slots;

    if (slots.station && slots.station.value) {
        var requestedStation = slots.station.value;
        cityBikeClient.run(context, requestedStation, function (foundStation) {
            var imageObj = {
                smallImageUrl: stationImageUrlBase + foundStation.internal_id + stationImageUrlExtension,
                largeImageUrl: stationImageUrlBase + "big_" + foundStation.internal_id + stationImageUrlExtension
            };
            var freeBikes = foundStation.free_bikes;
            context.attributes['lastStation'] = foundStation.name;
            console.log("foundStation: " + foundStation.name + ", freeBikes: " + freeBikes);
            context.emit(':tellWithCard',
                context.t("STATION_STATE_MESSAGE", freeBikes, foundStation.name),
                foundStation.name,
                context.t("STATION_STATE_MESSAGE", freeBikes, foundStation.name),
                imageObj);
        });
    } else if (context.event.session.attributes.lastStation) {
        cityBikeClient.run(context, context.event.session.attributes.lastStation, function (foundStation) {
            var imageObj = {
                smallImageUrl: stationImageUrlBase + foundStation.internal_id + stationImageUrlExtension,
                largeImageUrl: stationImageUrlBase + "big_" + foundStation.internal_id + stationImageUrlExtension
            };
            var freeBikes = foundStation.free_bikes;
            console.log("foundStation: " + foundStation.name + ", freeBikes: " + freeBikes);
            context.emit(':tellWithCard',
                context.t("STATION_STATE_MESSAGE", freeBikes, foundStation.name),
                foundStation.name,
                context.t("STATION_STATE_MESSAGE", freeBikes, foundStation.name),
                imageObj);
        });
    } else {
        context.emit(':ask', context.t("MISSING_STATION_MESSAGE"));
    }
};
