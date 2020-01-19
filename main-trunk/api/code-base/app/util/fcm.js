const FCM = require('fcm-node');
const config = require('../config/fcm');

exports.send = (title, body, to) => {
    if(config.isSend && to && to.length > 0){
        let fcm = new FCM(config.serverKey);
        let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            // to: 'registration_token', 
            registration_ids: to,
            // collapse_key: 'your_collapse_key',
            notification: {
                title: title,
                body: body
            },
            data: {  //you can send only notification or only data(or include both)
                title: title,
                body: body
            }
        };
        fcm.send(message, function(err, response){
            if (err) {
                console.log('Something has gone wrong in FCM: ', err);
            } else {
                // console.log('Successfully sent with response: ', response);
            }
        });
    }
};