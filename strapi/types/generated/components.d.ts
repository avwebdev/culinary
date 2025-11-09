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
      'blocks.hero': BlocksHero;
      'page.header': PageHeader;
      'page.seo': PageSeo;
      'primitives.button': PrimitivesButton;
      'primitives.link': PrimitivesLink;
    }
  }
}
