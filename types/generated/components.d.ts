import type { Schema, Attribute } from '@strapi/strapi';

export interface InputEmailEmail extends Schema.Component {
  collectionName: 'components_input_email_emails';
  info: {
    displayName: 'email';
  };
  attributes: {
    email: Attribute.Email;
  };
}

export interface InputNumberPhone extends Schema.Component {
  collectionName: 'components_input_number_phones';
  info: {
    displayName: 'phone';
    description: '';
  };
  attributes: {
    number: Attribute.Integer;
  };
}

export interface InputTextName extends Schema.Component {
  collectionName: 'components_input_name';
  info: {
    displayName: 'name';
    description: '';
  };
  attributes: {
    name: Attribute.String;
  };
}

export interface InputTextSurname extends Schema.Component {
  collectionName: 'components_input_surnames';
  info: {
    displayName: 'surname';
    description: '';
  };
  attributes: {
    surname: Attribute.String;
  };
}

export interface InputTextareaTextarea extends Schema.Component {
  collectionName: 'components_input_textarea_message';
  info: {
    displayName: 'message';
    description: '';
  };
  attributes: {
    message: Attribute.Text;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'input-email.email': InputEmailEmail;
      'input-number.phone': InputNumberPhone;
      'input-text.name': InputTextName;
      'input-text.surname': InputTextSurname;
      'input-textarea.textarea': InputTextareaTextarea;
    }
  }
}
