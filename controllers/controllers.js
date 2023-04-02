const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_ADDRESS, // replace with your email address
        pass: process.env.APP_PASSWORD // replace with your email password
    }
});


exports.postUserMessage = async (req, res) => {
    const {name, email, message} = req.body;
    console.log(`Received message:${message} from user:${name} with email:${email}`);

    // define email options
    let mailOptions = {
        from: email, // replace with your email address
        to: process.env.EMAIL_ADDRESS, // replace with your personal email address
        subject: `New message submitted on V12 website`,
        text: `${email} wrote: \n\n${message}` // you can customize the email message here
    };

    // send email
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json('Error! unable to send message at this time')
        } else {
            console.log('Email sent: ' + info.response);
            res.status(201).json('Message sent. We will get back to you soon!');
        }
    });
}


const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX
})


exports.postEmailSignup = async (req, res) =>
    {
        const { email } = req.body;
        console.log('req.body.email:', email);
        //res.status(201).json({message: "Thank you for signing up!"});
        try{
            const response = await mailchimp.lists.setListMember( //subscribe user to email list on mailchimp
                    process.env.MAILCHIMP_AUDIENCE_ID,
                    email,
                    {
                        email_address: email,
                        status: 'subscribed',
                        status_if_new: 'subscribed'
                    });
            console.log('response: ', response);
            res.status(201).json('Thank you! Check your inbox for your first email from us.');
        }catch(e){
            console.log('Error on server (mailchimp): ', e);
            res.status(500).json('Error! unable to subscribe!')
        }
    }


// const run = async () => {
//     const response = await mailchimp.lists.setListMember(
//       process.env.MAILCHIMP_AUDIENCE_ID,
//       '5c0c668744dc3a334a64fec1bc4bb5d8',
//       {status: "subscribed"}
//     );
//     //console.log(response);
//   };

// const run = async () => {
//     const response = await mailchimp.lists.getListMembersInfo(process.env.MAILCHIMP_AUDIENCE_ID);
//     console.log(response);
//   };
  

// const run = async () => {
//     const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
//       email_address: "msawada@alumni.ncsu.edu",
//       status: "subscribed",
//     });
//     console.log(response);
//   };
  
//   run();