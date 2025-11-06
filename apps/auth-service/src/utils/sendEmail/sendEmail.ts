import nodeMailer from 'nodemailer'
import { config } from 'dotenv'
import ejs from 'ejs'
import path from 'path'

config()

const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS|| ''
    }                                              
})

//Render an ejs template
const renderEmailTemplate = async (templateName: String, data: Record<string, any>): Promise<string> => {
const templatePath=path.join(
    process.cwd(),
    'apps',
    'auth-service',                   
    'src',                   
    'utils',                   
    'email-templates',                   
    `${templateName}.ejs`                   
)
return ejs.renderFile(templatePath,data)
}

export const sendEmail=async (to:string,subject:string,templateName:string,data:Record<string,any>)=>{
try {
    const html=await renderEmailTemplate(templateName,data)
    await transporter.sendMail({
        from:process.env.SMTP_USER,
        to,
        subject,
        html
    })
    return true
} catch (error) {
    console.log(`Error sending email : `,error)
    return false
}
}