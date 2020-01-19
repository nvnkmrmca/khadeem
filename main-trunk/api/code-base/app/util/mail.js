const nodeMailer = require('nodemailer');
const config = require('../config/mail');

exports.send = (subject, body, to, isHtml) => {
    try{
        if(config.isSend){
            if(!to || to.length < 1 ){
                to = config.to;
            }
            let transporter = nodeMailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.isSecure,
                auth: {
                    user: config.userName,
                    pass: config.password
                }
            });
            let mailOptions = {
                from: config.from, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: !isHtml ? body : '', // plain text body
                html: isHtml ? body: '' // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                transporter.close();
                if (error) {
                    console.log('Email not sent: ', error);
                    return false;
                }
                // console.log('Message %s sent: %s', info.messageId, info.response);
                return true;
            });
        }
    } catch(err) {
        console.log(err);
        return false;
    }
};