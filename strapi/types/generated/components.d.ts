import type { Schema, Struct } from '@strapi/strapi';

export interface Blocks404 extends Struct.ComponentSchema {
  collectionName: 'components_blocks_404s';
  info: {
    displayName: '404';
  };
  attributes: {
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksBanner extends Struct.ComponentSchema {
  collectionName: 'components_blocks_banners';
  info: {
    displayName: 'banner';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    backgroundColor: Schema.Attribute.Enumeration<
      [
        'bg-green-600',
        'bg-blue-600',
        'bg-purple-600',
        'bg-orange-600',
        'bg-gray-800',
      ]
    > &
      Schema.Attribute.DefaultTo<'bg-green-600'>;
    backgroundImage: Schema.Attribute.Media<'images', true>;
    buttonHref: Schema.Attribute.String & Schema.Attribute.Required;
    buttonText: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCard extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cards';
  info: {
    displayName: 'card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface BlocksContact extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contacts';
  info: {
    displayName: 'contact';
  };
  attributes: {
    schools: Schema.Attribute.Relation<'oneToMany', 'api::school.school'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    background: Schema.Attribute.Media<'images', true> &
      Schema.Attribute.Required;
    buttons: Schema.Attribute.Component<'primitives.button', true>;
    size: Schema.Attribute.Enumeration<['large', 'small']> &
      Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlocksStepItem extends Struct.ComponentSchema {
  collectionName: 'components_blocks_step_items';
  info: {
    displayName: 'step-item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images', true>;
    number: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksSteps extends Struct.ComponentSchema {
  collectionName: 'components_blocks_steps';
  info: {
    displayName: 'steps';
  };
  attributes: {
    steps: Schema.Attribute.Component<'blocks.step-item', true> &
      Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageFooter extends Struct.ComponentSchema {
  collectionName: 'components_page_footers';
  info: {
    displayName: 'footer';
  };
  attributes: {
    columns: Schema.Attribute.Component<'page.footer-column', true>;
    companyName: Schema.Attribute.String;
    copyright: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    socialLinks: Schema.Attribute.Component<'page.social-link', true>;
  };
}

export interface PageFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_page_footer_columns';
  info: {
    displayName: 'footer-column';
  };
  attributes: {
    links: Schema.Attribute.Component<'primitives.link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageHeader extends Struct.ComponentSchema {
  collectionName: 'components_page_headers';
  info: {
    displayName: 'header';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    logoText: Schema.Attribute.Component<'primitives.link', false> &
      Schema.Attribute.Required;
    navItems: Schema.Attribute.Component<'primitives.link', true> &
      Schema.Attribute.Required;
  };
}

export interface PageSeo extends Struct.ComponentSchema {
  collectionName: 'components_page_seos';
  info: {
    displayName: 'seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaImage: Schema.Attribute.Media<'images'>;
    metaTitle: Schema.Attribute.String;
  };
}

export interface PageSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_page_social_links';
  info: {
    displayName: 'social-link';
  };
  attributes: {
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PrimitivesButton extends Struct.ComponentSchema {
  collectionName: 'components_primitives_buttons';
  info: {
    displayName: 'button';
  };
  attributes: {
    link: Schema.Attribute.Component<'primitives.link', false>;
    size: Schema.Attribute.Enumeration<['sm', 'md', 'lg', 'xl']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'lg'>;
    theme: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'destructive', 'outline', 'ghost']
    > &
      Schema.Attribute.Required;
  };
}

export interface PrimitivesLink extends Struct.ComponentSchema {
  collectionName: 'components_primitives_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.404': Blocks404;
      'blocks.banner': BlocksBanner;
      'blocks.card': BlocksCard;
      'blocks.contact': BlocksContact;
      'blocks.hero': BlocksHero;
      'blocks.step-item': BlocksStepItem;
      'blocks.steps': BlocksSteps;
      'page.footer': PageFooter;
      'page.footer-column': PageFooterColumn;
      'page.header': PageHeader;
      'page.seo': PageSeo;
      'page.social-link': PageSocialLink;
      'primitives.button': PrimitivesButton;
      'primitives.link': PrimitivesLink;
    }
  }
}
