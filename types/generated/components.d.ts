import type { Schema, Attribute } from '@strapi/strapi';

export interface InputNumberPhone extends Schema.Component {
  collectionName: 'components_input_number_phones';
  info: {
    displayName: 'Phone';
  };
  attributes: {
    Number: Attribute.Integer;
  };
}

export interface InputTextEmail extends Schema.Component {
  collectionName: 'components_input_text_emails';
  info: {
    displayName: 'Email';
  };
  attributes: {
    Email: Attribute.String;
  };
}

export interface InputTextInputText extends Schema.Component {
  collectionName: 'components_input_input_texts';
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
    displayName: 'Surname';
    description: '';
  };
  attributes: {
    Surname: Attribute.String;
  };
}

export interface InputTextareaTextarea extends Schema.Component {
  collectionName: 'components_input_textarea_textareas';
  info: {
    displayName: 'Textarea';
  };
  attributes: {
    Textarea: Attribute.Text;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'input-number.phone': InputNumberPhone;
      'input-text.email': InputTextEmail;
      'input-text.input-text': InputTextInputText;
      'input-text.surname': InputTextSurname;
      'input-textarea.textarea': InputTextareaTextarea;
    }
  }
}
