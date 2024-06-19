const marked = require('marked');

module.exports = {
    /**
  * Job to send emails
  */
    sendEmails: {
        task: async ({ strapi }) => {
            console.log('Cron job for sending emails running');
            try {
                let emails = await strapi.service('api::email-template.email-template').find();
                if (!emails || !emails.results || emails.results.length === 0) {
                    console.log('No emails found');
                    return;
                }

                emails = emails.results.reverse();
                console.log('Emails fetched successfully');

                const subscribers = await strapi.service('api::p-r-velo.p-r-velo').find();
                if (!subscribers || !subscribers.results || subscribers.results.length === 0) {
                    console.log('No subscribers found');
                    return;
                }
                console.log('Subscribers fetched successfully');

                let emailContent = emails[0].Content;
                if (Array.isArray(emailContent)) {
                    // Transform the array to a string if necessary
                    emailContent = emailContent.map(block => {
                        if (block.type === 'paragraph') {
                            return block.children.map(child => child.text).join('');
                        }
                        // Add more conditions for other types if needed
                        return '';
                    }).join('\n');
                }

                const content = marked.parse(emailContent)

                if (!content) {
                    console.log('No content found in the latest email template');
                    return;
                }
                console.log('Email content:', content);

                await Promise.all(subscribers.results.map(async (el) => {
                    return await strapi
                        .plugin('email')
                        .service('email')
                        .send({
                            to: el.email,
                            subject: 'Test mail',
                            html: content,
                        });
                }));

                console.log('Emails sent successfully');
            } catch (error) {
                console.error('Error in sendEmailsJob:', error);
            }
        },
        options: {
            rule: "*/1 * * * *", // Schedule as per your requirement
            tz: 'Europe/Paris',
        },
    },
    /**
     * Job to delete form data every 1 minute for testing
     */
    deleteFormData: {
        task: async ({ strapi }) => {
            try {
                // Find all form entries older than 5 minutes
                const oneMinute = 60 * 1000;
                const fiveMinutes = 5 * oneMinute;

                const oldEntries = await strapi.entityService.findMany('api::p-r-velo.p-r-velo', {
                    populate: ['fichier', 'fichiers'],
                    filters: {
                        createdAt: {
                            $lt: new Date(new Date().getTime() - oneMinute),
                        },
                    },
                });

                console.log(`Found ${oldEntries.length} old form entries.`);

                // Initialization of file IDs to delete
                const fileIdsToDelete = [];

                // Store trace of deleted entries and collect file IDs
                for (const entry of oldEntries) {

                    // Collect the file IDs from the entry
                    if (entry.fichier && entry.fichier.id) {
                        fileIdsToDelete.push(entry.fichier.id);
                    }
                    if (entry.fichiers && entry.fichiers.length > 0) {
                        entry.fichiers.forEach(file => {
                            fileIdsToDelete.push(file.id);
                        });
                    }

                    // Store trace of deleted entry in Form-deletion-trace collection
                    await strapi.entityService.create('api::form-deletion-trace.form-deletion-trace', {
                        data: {
                            originalId: entry.id,
                            originalCreated: entry.createdAt,
                        },
                    });
                }

                if (oldEntries.length > 0) {
                    // Extract IDs of old entries
                    const oldEntryIds = oldEntries.map(entry => entry.id);

                    // Delete old form entries by their IDs
                    await strapi.entityService.deleteMany('api::p-r-velo.p-r-velo', {
                        filters: {
                            id: {
                                $in: oldEntryIds,
                            },
                        },
                    });

                    // Delete files in the media library by their IDs
                    for (const fileId of fileIdsToDelete) {
                        const deletedFile = await strapi.plugins.upload.services.upload.remove({ id: fileId });
                        // Delete corresponding file in the upload folder
                        strapi.plugins.upload.services.upload.remove(deletedFile);
                    }

                    console.log('Old form entries and associated files deleted, and traces created.');

                } else {
                    console.log('No old form entries to delete.' + new Date(new Date().getTime()));
                }
            } catch (error) {
                console.error('Error in deleteFormDataJob:', error);
            }
        },
        options: {
            rule: "*/1 * * * *", // Runs every 1 minute
            tz: 'Europe/Paris',
        },
    },
};
