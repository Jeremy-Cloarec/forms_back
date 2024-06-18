module.exports = {
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
                            $lt: new Date(new Date().getTime() - oneMinute), // Example: files older than 5 minutes
                        },
                    },
                });

                console.log(`Found ${oldEntries.length} old form entries.`);

                // Initialization of file IDs to delete
                const fileIdsToDelete = [];

                // Store trace of deleted entries and collect file IDs
                for (const entry of oldEntries) {
                    console.log(entry);

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
