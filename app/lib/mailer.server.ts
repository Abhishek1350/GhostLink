import { Resend } from "resend";
import { siteConfig } from "~/config/site";

const resend = new Resend(process.env.RESEND_KEY);

type SendEmailParams = {
    name: string;
    email: string;
    message: string;
};

export async function sendMail({ name, email, message }: SendEmailParams) {
    try {
        const { error } = await resend.emails.send({
            from: "ghostlink@imabhishek.site",
            to: [siteConfig.email],
            subject: `${siteConfig.name} contact form`,
            html:
                "<html><body><p><b>Name:</b> " +
                name +
                "</p><p><b>Email:</b> " +
                email +
                "</p><p><b>Message:</b> " +
                message +
                "</p></body></html>",
        });

        if (error) throw new Error(error.message);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
