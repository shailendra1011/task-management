const nodemailer = require('nodemailer');

//function for sending Task Reminder mail
function ReminderMail(email) {

    //i am using sandbox mail credential for email testing
    var transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: '25',
        auth: {
            user: '383cd5e52a69b8',
            pass: '336e6b7f9f9c56'
        }
    });

    const mailOptions = {
        from: 'test@gmail.com',
        to: email,
        subject: 'Task Reminder Mail!',
        text: 'Task Reminder Mail',
        html: `
            <p>Dear User,</p>
            <p>This is task reminder mail.</p>
            <p>Thanks</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Reminder Email sent: ' + info.response);
        }
    });
}

module.exports = ReminderMail;
