

module.exports = {
    
    async afterCreate(event) { 
        const { result } = event;

        console.log('After create hook triggered');
        console.log('Result:', result);

        try {
            await strapi.plugins['email'].services.email.send({
                to: 'adella.farrell@ethereal.email',
                from: 'adella.farrell@ethereal.email',
                cc: 'valid email address',
                bcc: 'valid email address',
                replyTo: 'adella.farrell@ethereal.email',
                subject: 'The Strapi Email plugin worked successfully',
                text: '${fieldName}', // Replace with a valid field ID
                html: 'Hello world!',
            })
        } catch (err) {
            console.log(err);
        }
    }
}