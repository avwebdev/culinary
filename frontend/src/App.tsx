import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Georgia', serif;
  background-color: #ffffff;
  color: #004d00;
  margin: 0;
  padding: 0;
  line-height: 1.7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: #004d00;
  color: #ffffff;
  padding: 2rem 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: normal;
  letter-spacing: 0.05em;
`;

const Main = styled.main`
  flex: 1;
  padding: 3rem 1rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const HeroSection = styled.section`
  margin-bottom: 2rem;
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ContentSection = styled.section`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #004d00;
  font-weight: normal;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #004d00;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
`;

const Footer = styled.footer`
  background-color: #f8f8f8;
  color: #004d00;
  padding: 1.5rem 1rem;
  text-align: center;
  border-top: 1px solid #e0e0e0;
`;

interface HomepageData {
  title: string;
  description: string;
  heroImage?: {
    url: string;
  };
}

const App: React.FC = () => {
  const [data, setData] = useState<HomepageData | null>(null);

  useEffect(() => {
    fetch('/api/homepage')
      .then(response => response.json())
      .then(result => setData(result.data.attributes))
      .catch(error => console.error('Error fetching homepage:', error));
  }, []);

  if (!data) {
    return (
      <Container>
        <Header>
          <HeaderTitle>Culinary Delights</HeaderTitle>
        </Header>
        <Main>
          <ContentSection>
            <Title>Loading...</Title>
          </ContentSection>
        </Main>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Culinary Delights</HeaderTitle>
      </Header>
      <Main>
        {data.heroImage && (
          <HeroSection>
            <HeroImage src={data.heroImage.url} alt="Hero" />
          </HeroSection>
        )}
        <ContentSection>
          <Title>{data.title}</Title>
          <Description>{data.description}</Description>
        </ContentSection>
      </Main>
      <Footer>
        <p>&copy; 2025 Culinary Delights. All rights reserved.</p>
      </Footer>
    </Container>
  );
};

export default App;
