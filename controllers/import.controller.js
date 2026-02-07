const fs = require('fs-extra');
const path = require('path');
const supabase = require('../config/supabase');
const db = require('../config/db');
const { validateExcelData } = require('../utils/excelValidator');

/**
 * @desc    Upload file to Supabase Storage and provide preview with validation
 * @route   POST /api/imports/upload
 * @access  Private
 */
const uploadAndPreview = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { id: userId, office_id: officeId } = req.user;
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'imports';

    try {
        // 1. Full Data Validation
        const validationResult = await validateExcelData(filePath, ext);

        // 2. Upload to Supabase Storage
        const fileBuffer = await fs.readFile(filePath);
        const fileName = `office_${officeId}/${Date.now()}-${req.file.originalname}`;

        const { data: storageData, error: storageError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileBuffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (storageError) {
            throw storageError;
        }

        // 3. Create Import Job record
        const jobRes = await db.query(
            `INSERT INTO import_jobs (office_id, created_by, job_type, status, total_rows, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                officeId,
                userId,
                'client_import',
                'pending',
                validationResult.summary.total,
                JSON.stringify({
                    file_name: req.file.originalname,
                    storage_path: storageData.path,
                    mime_type: req.file.mimetype,
                    validation_summary: validationResult.summary
                })
            ]
        );

        const job = jobRes.rows[0];

        // 4. Cleanup temp file
        await fs.remove(filePath);

        res.status(200).json({
            status: 'success',
            data: {
                job,
                validation: {
                    summary: validationResult.summary,
                    errors: validationResult.invalidRows.slice(0, 50), // Cap errors for response size
                    preview: validationResult.validRows.slice(0, 10) // Preview valid data
                }
            }
        });

    } catch (error) {
        console.error('Import Error:', error);
        // Cleanup on error
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
        }
        res.status(500).json({ message: 'Error processing file upload', error: error.message });
    }
};

/**
 * @desc    Confirm and execute the import
 * @route   POST /api/imports/confirm
 * @access  Private
 */
const confirmImport = async (req, res) => {
    const { import_job_id, import_mode } = req.body;
    const { id: userId, office_id: officeId } = req.user;

    const allowedModes = ['create-only', 'overwrite', 'upsert'];
    if (!import_job_id || !allowedModes.includes(import_mode)) {
        return res.status(400).json({ message: 'Please provide valid import_job_id and import_mode' });
    }

    const pgClient = await db.pool.connect();

    try {
        // 1. Get Job Details and storage path
        const jobRes = await pgClient.query('SELECT * FROM import_jobs WHERE id = $1 AND office_id = $2', [import_job_id, officeId]);
        if (jobRes.rows.length === 0) {
            return res.status(404).json({ message: 'Import job not found' });
        }
        const job = jobRes.rows[0];
        const storagePath = job.metadata.storage_path;
        const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'imports';

        // 2. Download File from Supabase Storage
        const { data: fileData, error: downloadError } = await supabase.storage
            .from(bucketName)
            .download(storagePath);

        if (downloadError) {
            throw new Error(`Failed to download file: ${downloadError.message}`);
        }

        const tempFilePath = path.join('uploads/tmp', `confirm_${import_job_id}${path.extname(storagePath)}`);
        const buffer = Buffer.from(await fileData.arrayBuffer());
        await fs.writeFile(tempFilePath, buffer);

        // 3. Parse and Validate
        const validationResult = await validateExcelData(tempFilePath, path.extname(storagePath));
        const clientsToImport = validationResult.validRows;

        // 4. Execute Transactional Import
        await pgClient.query('BEGIN');

        let created_rows = 0;
        let updated_rows = 0;
        let failed_rows = 0;

        for (const clientData of clientsToImport) {
            const { pan, full_name, district_id, range_id, assigned_to } = clientData;

            // Check existence
            const existRes = await pgClient.query(
                'SELECT id, full_name FROM clients WHERE pan = $1 AND office_id = $2',
                [pan, officeId]
            );
            const exists = existRes.rows.length > 0;
            const existingClient = exists ? existRes.rows[0] : null;

            let actionTaken = null;

            if (import_mode === 'create-only') {
                if (!exists) {
                    await pgClient.query(
                        'INSERT INTO clients (office_id, pan, full_name, district_id, range_id, assigned_to) VALUES ($1, $2, $3, $4, $5, $6)',
                        [officeId, pan, full_name, district_id, range_id, assigned_to]
                    );
                    created_rows++;
                    actionTaken = 'CREATE';
                } else {
                    failed_rows++; // Skipped
                }
            } else if (import_mode === 'overwrite') {
                if (exists) {
                    await pgClient.query(
                        'UPDATE clients SET full_name = $1, district_id = $2, range_id = $3, assigned_to = $4 WHERE id = $5',
                        [full_name, district_id, range_id, assigned_to, existingClient.id]
                    );
                    updated_rows++;
                    actionTaken = 'UPDATE';
                } else {
                    failed_rows++; // Skipped
                }
            } else if (import_mode === 'upsert') {
                if (exists) {
                    await pgClient.query(
                        'UPDATE clients SET full_name = $1, district_id = $2, range_id = $3, assigned_to = $4 WHERE id = $5',
                        [full_name, district_id, range_id, assigned_to, existingClient.id]
                    );
                    updated_rows++;
                    actionTaken = 'UPDATE';
                } else {
                    await pgClient.query(
                        'INSERT INTO clients (office_id, pan, full_name, district_id, range_id, assigned_to) VALUES ($1, $2, $3, $4, $5, $6)',
                        [officeId, pan, full_name, district_id, range_id, assigned_to]
                    );
                    created_rows++;
                    actionTaken = 'CREATE';
                }
            }

            // Log activity if action taken
            if (actionTaken) {
                // For performance in bulk, we might want to batch this, but following requirements for now
                await pgClient.query(
                    `INSERT INTO activity_logs (office_id, user_id, action, entity_name, entity_id, metadata) 
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [officeId, userId, `IMPORT_${actionTaken}`, 'clients', existingClient?.id, JSON.stringify(clientData)]
                );
            }
        }

        // 5. Update Job Status
        await pgClient.query(
            "UPDATE import_jobs SET status = 'completed', processed_rows = $1, metadata = metadata || $2 WHERE id = $3",
            [created_rows + updated_rows, JSON.stringify({ created_rows, updated_rows, failed_rows }), import_job_id]
        );

        await pgClient.query('COMMIT');

        // Cleanup
        await fs.remove(tempFilePath);

        res.status(200).json({
            status: 'success',
            data: { created_rows, updated_rows, failed_rows }
        });

    } catch (error) {
        await pgClient.query('ROLLBACK');
        console.error('Confirm Import Error:', error);
        res.status(500).json({ message: 'Error confirming import', error: error.message });
    } finally {
        pgClient.release();
    }
};

module.exports = {
    uploadAndPreview,
    confirmImport
};
