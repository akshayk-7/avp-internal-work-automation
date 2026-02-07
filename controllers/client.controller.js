const db = require('../config/db');

/**
 * @desc    Log activity helper
 */
const logActivity = async (client, userId, officeId, action, entityName, entityId, oldData = null, newData = null) => {
    try {
        await client.query(
            `INSERT INTO activity_logs (office_id, user_id, action, entity_name, entity_id, old_data, new_data) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [officeId, userId, action, entityName, entityId, oldData, newData]
        );
    } catch (error) {
        console.error('Activity Log Error:', error);
        // We don't throw here to avoid failing the main transaction if logging fails
        // However, in a strict audit system, you might want to throw
    }
};

/**
 * @desc    Create Client
 * @route   POST /api/clients
 * @access  Private
 */
const createClient = async (req, res) => {
    const {
        pan, full_name, district_id, range_id, assigned_to,
        annexure_received, itr_filed, itr_filed_date, everified, everified_date
    } = req.body;
    const { id: userId, office_id: officeId } = req.user;

    if (!pan || !full_name) {
        return res.status(400).json({ message: 'PAN and Name are required' });
    }

    const pgClient = await db.pool.connect();

    try {
        await pgClient.query('BEGIN');

        const result = await pgClient.query(
            `INSERT INTO clients (
        office_id, pan, full_name, district_id, range_id, assigned_to, 
        annexure_received, itr_filed, itr_filed_date, everified, everified_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                officeId, pan.toUpperCase(), full_name, district_id, range_id, assigned_to,
                annexure_received, itr_filed, itr_filed_date, everified, everified_date
            ]
        );

        const newClient = result.rows[0];

        // Log Activity
        await logActivity(pgClient, userId, officeId, 'CREATE', 'clients', newClient.id, null, newClient);

        await pgClient.query('COMMIT');

        res.status(201).json({ status: 'success', data: newClient });
    } catch (error) {
        await pgClient.query('ROLLBACK');
        console.error(error);
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Client with this PAN already exists in your office' });
        }
        res.status(500).json({ message: 'Error creating client' });
    } finally {
        pgClient.release();
    }
};

/**
 * @desc    Get Clients with filters
 * @route   GET /api/clients
 * @access  Private
 */
const getClients = async (req, res) => {
    const { office_id: officeId } = req.user;
    const { range_id, district_id, assigned_to, status } = req.query;

    let query = 'SELECT * FROM clients WHERE office_id = $1';
    const params = [officeId];
    let paramCount = 1;

    if (range_id) {
        paramCount++;
        query += ` AND range_id = $${paramCount}`;
        params.push(range_id);
    }
    if (district_id) {
        paramCount++;
        query += ` AND district_id = $${paramCount}`;
        params.push(district_id);
    }
    if (assigned_to) {
        paramCount++;
        query += ` AND assigned_to = $${paramCount}`;
        params.push(assigned_to);
    }
    if (status) {
        paramCount++;
        query += ` AND status = $${paramCount}`;
        params.push(status);
    }

    query += ' ORDER BY full_name ASC';

    try {
        const result = await db.query(query, params);
        res.status(200).json({ status: 'success', results: result.rows.length, data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
};

/**
 * @desc    Get Single Client
 * @route   GET /api/clients/:id
 * @access  Private
 */
const getClientById = async (req, res) => {
    const { id } = req.params;
    const { office_id: officeId } = req.user;

    try {
        const result = await db.query('SELECT * FROM clients WHERE id = $1 AND office_id = $2', [id, officeId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({ status: 'success', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching client' });
    }
};

/**
 * @desc    Update Client
 * @route   PATCH /api/clients/:id
 * @access  Private
 */
const updateClient = async (req, res) => {
    const { id } = req.params;
    const { id: userId, office_id: officeId } = req.user;
    const updates = req.body;

    const pgClient = await db.pool.connect();

    try {
        await pgClient.query('BEGIN');

        // Get old data for audit log
        const oldRes = await pgClient.query('SELECT * FROM clients WHERE id = $1 AND office_id = $2', [id, officeId]);
        if (oldRes.rows.length === 0) {
            await pgClient.query('ROLLBACK');
            return res.status(404).json({ message: 'Client not found' });
        }
        const oldData = oldRes.rows[0];

        // Build dynamic update query
        const keys = Object.keys(updates).filter(k => !['id', 'office_id', 'created_at', 'updated_at'].includes(k));
        if (keys.length === 0) {
            return res.status(400).json({ message: 'No valid fields provided for update' });
        }

        const setClause = keys.map((key, index) => `${key} = $${index + 3}`).join(', ');
        const values = keys.map(key => key === 'pan' ? updates[key].toUpperCase() : updates[key]);

        const updateQuery = `UPDATE clients SET ${setClause} WHERE id = $1 AND office_id = $2 RETURNING *`;
        const result = await pgClient.query(updateQuery, [id, officeId, ...values]);
        const newData = result.rows[0];

        // Log Activity
        await logActivity(pgClient, userId, officeId, 'UPDATE', 'clients', id, oldData, newData);

        await pgClient.query('COMMIT');
        res.status(200).json({ status: 'success', data: newData });
    } catch (error) {
        await pgClient.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error updating client' });
    } finally {
        pgClient.release();
    }
};

/**
 * @desc    Delete Client
 * @route   DELETE /api/clients/:id
 * @access  Private
 */
const deleteClient = async (req, res) => {
    const { id } = req.params;
    const { id: userId, office_id: officeId } = req.user;

    const pgClient = await db.pool.connect();

    try {
        await pgClient.query('BEGIN');

        const oldRes = await pgClient.query('SELECT * FROM clients WHERE id = $1 AND office_id = $2', [id, officeId]);
        if (oldRes.rows.length === 0) {
            await pgClient.query('ROLLBACK');
            return res.status(404).json({ message: 'Client not found' });
        }
        const oldData = oldRes.rows[0];

        await pgClient.query('DELETE FROM clients WHERE id = $1 AND office_id = $2', [id, officeId]);

        // Log Activity
        await logActivity(pgClient, userId, officeId, 'DELETE', 'clients', id, oldData, null);

        await pgClient.query('COMMIT');
        res.status(200).json({ status: 'success', message: 'Client deleted successfully' });
    } catch (error) {
        await pgClient.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error deleting client' });
    } finally {
        pgClient.release();
    }
};

/**
 * @desc    Bulk Assign Clients to OA
 * @route   PATCH /api/clients/bulk-assign
 * @access  Private
 */
const bulkAssignClients = async (req, res) => {
    const { client_ids, oa_id } = req.body;
    const { id: userId, office_id: officeId } = req.user;

    if (!client_ids || !Array.isArray(client_ids) || client_ids.length === 0 || !oa_id) {
        return res.status(400).json({ message: 'Please provide client_ids (array) and oa_id' });
    }

    const pgClient = await db.pool.connect();

    try {
        await pgClient.query('BEGIN');

        // 1. Validate OA belongs to the same office
        const oaRes = await pgClient.query(
            'SELECT id, full_name FROM users WHERE id = $1 AND office_id = $2 AND is_active = true',
            [oa_id, officeId]
        );

        if (oaRes.rows.length === 0) {
            await pgClient.query('ROLLBACK');
            return res.status(404).json({ message: 'OA not found or does not belong to your office' });
        }

        const oa = oaRes.rows[0];

        // 2. Perform bulk update - restricted by office_id
        const updateResult = await pgClient.query(
            `UPDATE clients 
       SET assigned_to = $1 
       WHERE id = ANY($2) AND office_id = $3 
       RETURNING id, full_name, pan`,
            [oa_id, client_ids, officeId]
        );

        const updatedClients = updateResult.rows;

        // 3. Log activity for each updated client
        for (const client of updatedClients) {
            await logActivity(
                pgClient,
                userId,
                officeId,
                'BULK_ASSIGN',
                'clients',
                client.id,
                null, // Could fetch old assignment if needed, but for bulk we omit to save performance
                { assigned_to: oa_id, oa_name: oa.full_name }
            );
        }

        await pgClient.query('COMMIT');

        res.status(200).json({
            status: 'success',
            message: `Successfully assigned ${updatedClients.length} clients to ${oa.full_name}`,
            count: updatedClients.length
        });

    } catch (error) {
        await pgClient.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error performing bulk assignment' });
    } finally {
        pgClient.release();
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
    bulkAssignClients
};
