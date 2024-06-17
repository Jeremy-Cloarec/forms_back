'use strict';

/**
 * `medias` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {

    ctx.query.populate = {

      fichier: {
        fields: ['name', 'url']
      },
      
      fichiers: {
        fields: ['name', 'url']
      }
    };
    await next();
  };
};
