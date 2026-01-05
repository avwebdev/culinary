import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { BaseLayout } from './BaseLayout';
import { getEmailColors, formatDate, SchoolBranding, OrderData } from './utils';

interface OrderRejectedProps {
  school: SchoolBranding;
  order: OrderData;
  strapiUrl?: string;
}

export function OrderRejected({ school, order, strapiUrl }: OrderRejectedProps) {
  const colors = getEmailColors(school);
  const itemCount = order.lines?.length || 0;

  return (
    <BaseLayout
      school={school}
      preview={`Update regarding your order #${order.id}`}
      strapiUrl={strapiUrl}
    >
      <Text style={headingStyle}>Order Update</Text>
      
      <Text style={paragraphStyle}>
        We're sorry, but your order could not be approved at this time.
      </Text>

      <Section style={orderBoxStyle}>
        <Text style={orderLabelStyle}>Order Number</Text>
        <Text style={orderValueStyle}>#{order.id}</Text>
        
        <Text style={orderLabelStyle}>Delivery Date</Text>
        <Text style={orderValueStyle}>{formatDate(order.deliveryDate)}</Text>
        
        <Text style={orderLabelStyle}>Items</Text>
        <Text style={orderValueStyle}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
        
        <Text style={orderLabelStyle}>Status</Text>
        <Text style={{ ...statusStyle, backgroundColor: '#FEE2E2', color: '#991B1B' }}>
          Not Approved
        </Text>
      </Section>

      {order.rejectionReason && (
        <Section style={reasonBoxStyle}>
          <Text style={reasonLabelStyle}>Reason</Text>
          <Text style={reasonTextStyle}>{order.rejectionReason}</Text>
        </Section>
      )}

      <Text style={paragraphStyle}>
        If you have any questions, please contact us at {school.email || 'our school office'}.
      </Text>

      <Text style={paragraphStyle}>
        You're welcome to place a new order for a different date.
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
  color: '#991B1B',
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

const reasonBoxStyle: React.CSSProperties = {
  backgroundColor: '#FEF2F2',
  borderLeft: '4px solid #991B1B',
  borderRadius: '4px',
  padding: '16px',
  margin: '24px 0',
};

const reasonLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#991B1B',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
  fontWeight: 'bold',
};

const reasonTextStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#7F1D1D',
  margin: '0',
  lineHeight: '24px',
};

const signatureStyle: React.CSSProperties = {
  fontSize: '16px',
  color: '#444444',
  lineHeight: '24px',
  marginTop: '32px',
};

export default OrderRejected;
