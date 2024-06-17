'use strict';

/**
 * p-r-velo router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::p-r-velo.p-r-velo', {
    config: {
        find: {
            middlewares: ['api::p-r-velo.medias'],
        },
    },
});
