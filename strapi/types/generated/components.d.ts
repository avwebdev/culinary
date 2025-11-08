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

export interface PageSeo extends Struct.ComponentSchema {
  collectionName: 'components_page_seos';
  info: {
    displayName: 'seo';
  };
  attributes: {
    meta_description: Schema.Attribute.Text;
    meta_image: Schema.Attribute.Media<'images'>;
    meta_title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blocks.404': Blocks404;
      'page.seo': PageSeo;
    }
  }
}
