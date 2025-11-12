const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = 'http://localhost:1337/api';

async function seedContent() {
  try {
    // Create homepage
    const pageResponse = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: 'Home',
          path: '/',
          publishedAt: new Date(),
          blocks: [
            {
              __component: 'blocks.hero',
              title: 'Welcome to PUSD Culinary Excellence',
              subtitle: 'Discover the art and science of professional cooking',
              description: 'Join our state-of-the-art culinary program designed to cultivate the next generation of chefs and food industry professionals.',
              cta: {
                label: 'Learn More',
                href: '/programs',
                theme: 'primary'
              },
              backgroundImage: null,
              alignment: 'center'
            },
            {
              __component: 'blocks.card',
              title: 'Hands-On Learning',
              description: 'Experience real-world cooking techniques with our industry-standard kitchen facilities and expert instructors.',
              icon: '🍳'
            },
            {
              __component: 'blocks.card',
              title: 'Career Ready',
              description: 'Graduate with the skills and certification needed to succeed in the culinary industry.',
              icon: '👨‍🍳'
            },
            {
              __component: 'blocks.card',
              title: 'Community Focused',
              description: 'Collaborate with peers and showcase your creations at our regular community events.',
              icon: '👥'
            }
          ]
        }
      })
    });

    const pageData = await pageResponse.json();
    console.log('✓ Homepage created:', pageData);

    // Create programs page
    const programsResponse = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          title: 'Programs',
          path: '/programs',
          publishedAt: new Date(),
          blocks: [
            {
              __component: 'blocks.hero',
              title: 'Our Programs',
              subtitle: 'Comprehensive culinary education pathways',
              description: 'Choose from our diverse program offerings designed to meet various interests and career goals.',
              alignment: 'left'
            },
            {
              __component: 'blocks.card',
              title: 'Professional Chef Training',
              description: 'A comprehensive 2-year program covering all aspects of professional cooking, kitchen management, and food safety.'
            },
            {
              __component: 'blocks.card',
              title: 'Pastry & Baking',
              description: 'Specialize in the art of pastries, breads, and desserts with hands-on training from master bakers.'
            },
            {
              __component: 'blocks.card',
              title: 'Hospitality Management',
              description: 'Learn to manage restaurants and food service operations with business and customer service focus.'
            }
          ]
        }
      })
    });

    const programsData = await programsResponse.json();
    console.log('✓ Programs page created:', programsData);

  } catch (error) {
    console.error('Error seeding content:', error.message);
    if (error.response) {
      const errorData = await error.response.json();
      console.error('Response:', errorData);
    }
  }
}

seedContent();
