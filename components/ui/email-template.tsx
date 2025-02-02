import * as React from 'react';

interface EmailTemplateProps {
  message: string;
  email: string;
  firstName: string;
  lastName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message, email, firstName, lastName
}) => (
  <div>
    <p>You have received the following message from {firstName} {lastName} ({email}). Replying directly to this email thread will not email them. </p>
    <p>{message}</p>
  </div>
);
