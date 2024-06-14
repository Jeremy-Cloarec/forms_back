module.exports = {
    /**
     * Job to delete form data every 1 minute for testing
     */
    deleteFormData: {
        task: async ({ strapi }) => {
            try {
                const now = new Date();
                const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);

                // Find all form entries older than 5 minutes
                const oldEntries = await strapi.entityService.findMany('api::p-r-velo.p-r-velo', {
                    filters: {
                        createdAt: {
                            $lt: oneMinuteAgo,
                        },
                    },
                });

                console.log(`Found ${oldEntries.length} old form entries.`);

                // Collect file IDs to delete
                const fileIdsToDelete = [];

                // Store trace of deleted entries and collect file IDs
                for (const entry of oldEntries) {
                    // Collect file IDs from entry URLs
                    if (entry.url) {
                        const urlId = entry.url.split('/').pop();
                        fileIdsToDelete.push(urlId);
                    }
                    if (entry.urlJSON) {
                        entry.urlJSON.forEach(url => {
                            const urlId = url.split('/').pop();
                            fileIdsToDelete.push(urlId);
                        });
                    }

                    // Store trace of deleted entry
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

                    console.log('Old form entries deleted and traces created.');

                    // Delete the collected files from the upload plugin
                    if (fileIdsToDelete.length > 0) {
                        for (const fileId of fileIdsToDelete) {
                            await strapi.plugins.upload.services.upload.remove({ id: fileId });
                        }
                        // console.log(`Deleted ${fileIdsToDelete.length} files from the media library.`);
                    }
                    
                } else {
                    console.log('No old form entries to delete.');
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
