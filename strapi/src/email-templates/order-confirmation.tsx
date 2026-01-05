import * as React from 'react';
import { Text, Button, Section } from '@react-email/components';
import { BaseLayout } from './BaseLayout';
import { getEmailColors, formatDate, SchoolBranding, OrderData } from './utils';

interface OrderConfirmationProps {
  school: SchoolBranding;
  order: OrderData;
  strapiUrl?: string;
}

export function OrderConfirmation({ school, order, strapiUrl }: OrderConfirmationProps) {
  const colors = getEmailColors(school);
  const itemCount = order.lines?.length || 0;

  return (
    <BaseLayout
      school={school}
      preview={`Your order #${order.id} has been received`}
      strapiUrl={strapiUrl}
    >
      <Text style={headingStyle}>Order Received!</Text>
      
      <Text style={paragraphStyle}>
        Thank you for your order. We've received your request and it's now pending approval.
      </Text>

      <Section style={orderBoxStyle}>
        <Text style={orderLabelStyle}>Order Number</Text>
        <Text style={orderValueStyle}>#{order.id}</Text>
        
        <Text style={orderLabelStyle}>Delivery Date</Text>
        <Text style={orderValueStyle}>{formatDate(order.deliveryDate)}</Text>
        
        <Text style={orderLabelStyle}>Items</Text>
        <Text style={orderValueStyle}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
        
        <Text style={orderLabelStyle}>Status</Text>
        <Text style={{ ...statusStyle, backgroundColor: '#FEF3C7', color: '#92400E' }}>
          Pending Approval
        </Text>
      </Section>

      <Text style={paragraphStyle}>
        You will receive an email notification once your order has been reviewed.
      </Text>

      <Text style={signatureStyle}>
        Best regards,<br />
        {school.name}
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

const statusStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '14px',
  fontWeight: 'bold',
};

const signatureStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#444444',
  lineHeight: '24px',
  marginTop: '32px',
};

export default OrderConfirmation;
