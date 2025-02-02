"use server";
import { EmailTemplate } from '@/components/ui/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFormData(formData: any) {
    try {
      console.log("Received form data:", formData);

      const { data, error } = await resend.emails.send({
        from: `${formData.firstName} ${formData.lastName} <${process.env.RESEND_FROM_EMAIL}>`,
        to: "6speedphoto.multimedia@gmail.com",
        subject: formData.subject,
        react: EmailTemplate({ firstName: formData.firstName, lastName: formData.lastName, message: formData.message, email: formData.email }),
      });

      if(error){
        throw(error);
      }

      return { success: true, message: "Form submitted successfully!" };
    } catch (error) {
      console.error("Error sending form data:", error);
      return { success: false, message: "Failed to process form data." };
    }
  }
  