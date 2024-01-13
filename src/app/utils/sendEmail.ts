import nodemailer from "nodemailer"
import config from "../config/config";

const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === "production",
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "mustaqimkhanbd@gmail.com",
            pass: "fxfj hyvh tmhe olih", // App passwords of google account
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: '"mustaqimkhanbd@gmail.com', // sender address
        to, // list of receivers
        subject: "Reset Password", // Subject line
        text: "Please, Reset your password", // plain text body
        html, // html body
    });

}

export default sendEmail
