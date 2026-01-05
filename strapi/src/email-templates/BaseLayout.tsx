import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import { getEmailColors, getImageUrl, SchoolBranding } from './utils';

interface BaseLayoutProps {
  school: SchoolBranding;
  preview: string;
  children: React.ReactNode;
  strapiUrl?: string;
}

export function BaseLayout({ school, preview, children, strapiUrl }: BaseLayoutProps) {
  const colors = getEmailColors(school);
  const logoUrl = getImageUrl(school.culinaryLogo, strapiUrl);

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&display=swap');
          `}
        </style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={{ ...headerStyle, backgroundColor: colors.primary }}>
            {logoUrl && (
              <Img
                src={logoUrl}
                alt={school.name}
                width="120"
                height="60"
                style={logoStyle}
              />
            )}
            <Text style={schoolNameStyle}>{school.name}</Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={dividerStyle} />
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              {school.name}
            </Text>
            {school.email && (
              <Text style={footerTextStyle}>
                Email: {school.email}
              </Text>
            )}
            {school.phone && (
              <Text style={footerTextStyle}>
                Phone: {school.phone}
              </Text>
            )}
            <Text style={copyrightStyle}>
              © {new Date().getFullYear()} {school.name}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#f6f6f6',
  fontFamily: "'Bubblegum Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle: React.CSSProperties = {
  padding: '24px',
  textAlign: 'center',
};

const logoStyle: React.CSSProperties = {
  margin: '0 auto 12px',
  objectFit: 'contain',
};

const schoolNameStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: 0,
  fontFamily: "'Bubblegum Sans', sans-serif",
};

const contentStyle: React.CSSProperties = {
  padding: '32px 24px',
};

const dividerStyle: React.CSSProperties = {
  borderColor: '#e5e5e5',
  margin: '0',
};

const footerStyle: React.CSSProperties = {
  padding: '24px',
  backgroundColor: '#f9f9f9',
  textAlign: 'center',
};

const footerTextStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0',
};

const copyrightStyle: React.CSSProperties = {
  color: '#999999',
  fontSize: '12px',
  marginTop: '16px',
};

export default BaseLayout;
