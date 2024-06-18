'use strict';

/**
 * email service
 */

module.exports = ({ strapi }) => ({
    emailService: async (ctx) => {
        try {
            const input = ctx.request.body.data?.input;
            const emailTo = ctx.request.body.data?.emailTo;

            // Ajoutez des logs pour le débogage
            console.log("Input:", input);
            console.log("Email To:", emailTo);

            if (!emailTo) {
                throw new Error('No recipients defined.');
            }

            await strapi.plugins["email"].services.email.send({
                from: "aditya93@ethereal.email",
                to: 'aditya93@ethereal.email',
                subject: "Hello World",
                html: `<p>${input}</p>`,
            });

            return {
                message: "Email sent!",
            };
        } catch (err) {
            ctx.body = err;
        }
    },
});
