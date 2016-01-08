var login = require("facebook-chat-api");

var config = require("./config");

var Cleverbot = require('cleverbot-node');

cleverbot = new Cleverbot;

var cummies  = "IM DELETING YOU, DADDY!😭👋 ██]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] 10% complete..." +
    ".. ████]]]]]]]]]]]]]]]]]]]]]]]]]]] 35% complete.... ███████]]]]]]]]]]]]]]]] 60% complete.... ████" +
    "███████] 99% complete..... 🚫ERROR!🚫 💯True💯 Daddies are irreplaceable 💖I could never delete you Dadd" +
    "y!💖 Send this to ten other 👪Daddies👪 who give you 💦cummies💦 Or never get called ☁️squishy☁️ again❌❌😬😬" +
    "❌❌ If you get 0 Back: no cummies for you 🚫🚫👿 3 back: you're squishy☁️💦 5 back: you're daddy's kitten😽👼💦";

var request = require("request");
var willRespond = false;

login(config.login, function callback(err, api) {
    if (err) return console.error(err);
    api.listen(function callback(err, message) {
        api.markAsRead(message.threadID);
        var msg = message.body.toString();
        process.stdout.write(msg + "\n");
        var isCommand = (msg.substring(0, config.char.length) === config.char);
        var split = msg.split(/\s+/);
        var command = split[0].substring(config.char.length);
        var params = "";
        if(split.length > 1){
            for(var k = 1; k < split.length; k++){
                params += (" " + split[k])
            }
            params = params.substring(1)
        }

        process.stdout.write(params + "\n");
        if (isCommand) {
            if(command === "respond"){
                if(willRespond){
                    willRespond = false;
                    api.sendMessage("Responses are now turned off", message.threadID);
                }
                else{
                    willRespond = true;
                    api.sendMessage("Responses are now turned on", message.threadID);
                }
            }
            if(command === "cummies"){
                api.sendMessage(cummies, message.threadID)
            }
            if (command === "yt") {
                var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + config.youtubeapi + "&q=" + params.replace(/\s+/, "%20");
                request({
                    url: url,
                    headers: {
                        "User-Agent": "Mozilla"
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode === 200) {
                        var jsondata = JSON.parse(body);
                        var results = jsondata.items;
                        for (var i in results) {
                            var videoId = results[i].id.videoId;
                            if (typeof videoId != 'undefined') {
                                var videoUrl = "https://youtu.be/" + videoId;
                                var msgResponse = {
                                    "body": "Results for \"" + params + "\":\n" + videoUrl,
                                    "url": videoUrl
                                };
                                api.sendMessage(msgResponse, message.threadID);
                                break;
                            }
                        }

                    }
                })
            }
        }
        else if(willRespond) {
            Cleverbot.prepare(function () {
                cleverbot.write(msg, function (response) {
                    api.sendMessage(response.message, message.threadID);
                });
            });
        }
    });

});
