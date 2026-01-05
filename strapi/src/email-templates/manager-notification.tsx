import * as React from 'react';
import { Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './BaseLayout';
import { getEmailColors, formatDate, SchoolBranding, OrderData } from './utils';

interface ManagerNotificationProps {
  school: SchoolBranding;
  order: OrderData;
  adminPanelUrl?: string;
  strapiUrl?: string;
}

export function ManagerNotification({ school, order, adminPanelUrl, strapiUrl }: ManagerNotificationProps) {
  const colors = getEmailColors(school);
  const itemCount = order.lines?.length || 0;
  const reviewUrl = adminPanelUrl || 'http://localhost:1337/admin';

  return (
    <BaseLayout
      school={school}
      preview={`New order #${order.id} requires approval`}
      strapiUrl={strapiUrl}
    >
      <Text style={headingStyle}>New Order Received</Text>
      
      <Text style={paragraphStyle}>
        A new order has been placed and requires your review.
      </Text>

      <Section style={orderBoxStyle}>
        <Text style={orderLabelStyle}>Order Number</Text>
        <Text style={orderValueStyle}>#{order.id}</Text>
        
        <Text style={orderLabelStyle}>Customer Email</Text>
        <Text style={orderValueStyle}>{order.userEmail}</Text>
        
        <Text style={orderLabelStyle}>Delivery Date</Text>
        <Text style={orderValueStyle}>{formatDate(order.deliveryDate)}</Text>
        
        <Text style={orderLabelStyle}>Items</Text>
        <Text style={orderValueStyle}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
        
        <Text style={orderLabelStyle}>Submitted</Text>
        <Text style={orderValueStyle}>
          {order.createdAt ? formatDate(order.createdAt) : 'Just now'}
        </Text>
      </Section>

      <Section style={buttonContainerStyle}>
        <Button
          href={reviewUrl}
          style={{ ...buttonStyle, backgroundColor: colors.primary }}
        >
          Review Order
        </Button>
      </Section>

      <Text style={paragraphStyle}>
        Please review and approve or reject this order at your earliest convenience.
      </Text>
    </BaseLayout>
  );
}

const headingStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: '0 0 16px',
  fontFamily: "'Bubblegum Sans', sans-serif",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#444444',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const orderBoxStyle: React.CSSProperties = {
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const orderLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#666666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '12px 0 4px',
};

const orderValueStyle: React.CSSProperties = {
  fontSize: '18px',
  color: '#1a1a1a',
  fontWeight: 'bold',
  margin: '0',
};

const buttonContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
};

const buttonStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 32px',
  borderRadius: '8px',
  display: 'inline-block',
};

export default ManagerNotification;
