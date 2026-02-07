const db = require('../config/db');

/**
 * @desc    CEO Dashboard - Office-wide summary
 * @route   GET /api/dashboard/ceo
 * @access  Private/CEO
 */
const getCEODashboard = async (req, res) => {
    const { office_id: officeId } = req.user;

    try {
        // 1. Overall Totals
        const totalsRes = await db.query(
            `SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE itr_filed = true) as total_filed,
        COUNT(*) FILTER (WHERE itr_filed = false) as total_pending,
        COUNT(*) FILTER (WHERE everified = true) as total_everified
       FROM clients 
       WHERE office_id = $1`,
            [officeId]
        );

        const totals = totalsRes.rows[0];
        const totalClients = parseInt(totals.total_clients) || 0;
        const completionPercentage = totalClients > 0
            ? ((parseInt(totals.total_filed) / totalClients) * 100).toFixed(2)
            : 0;

        // 2. Per Range Summary
        const rangeSummaryRes = await db.query(
            `SELECT 
        r.id, 
        r.name, 
        COUNT(c.id) as total,
        COUNT(c.id) FILTER (WHERE c.itr_filed = true) as status_completed,
        COUNT(c.id) FILTER (WHERE c.itr_filed = false) as status_pending
       FROM ranges r
       LEFT JOIN clients c ON r.id = c.range_id
       WHERE r.office_id = $1
       GROUP BY r.id, r.name
       ORDER BY r.name`,
            [officeId]
        );

        // 3. OA Productivity (Today)
        const oaProductivityRes = await db.query(
            `SELECT 
        u.id, 
        u.full_name, 
        COUNT(c.id) FILTER (WHERE c.itr_filed_date = CURRENT_DATE) as filed_today,
        COUNT(c.id) FILTER (WHERE c.everified_date = CURRENT_DATE) as e_verified_today
       FROM users u
       LEFT JOIN clients c ON u.id = c.assigned_to
       WHERE u.office_id = $1 AND u.user_role = 'OA'
       GROUP BY u.id, u.full_name
       ORDER BY filed_today DESC`,
            [officeId]
        );

        res.status(200).json({
            status: 'success',
            data: {
                overall: {
                    ...totals,
                    completion_percentage: parseFloat(completionPercentage)
                },
                range_summary: rangeSummaryRes.rows,
                oa_productivity: oaProductivityRes.rows
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching CEO dashboard data' });
    }
};

/**
 * @desc    AO Dashboard - Range-specific summary
 * @route   GET /api/dashboard/ao
 * @access  Private/AO,CEO
 */
const getAODashboard = async (req, res) => {
    const { office_id: officeId } = req.user;
    const { range_id } = req.query;

    if (!range_id) {
        return res.status(400).json({ message: 'Please provide range_id' });
    }

    try {
        // 1. Range Totals
        const rangeTotalsRes = await db.query(
            `SELECT 
        COUNT(*) as total_clients,
        COUNT(*) FILTER (WHERE itr_filed = true) as filed,
        COUNT(*) FILTER (WHERE itr_filed = false) as pending
       FROM clients 
       WHERE office_id = $1 AND range_id = $2`,
            [officeId, range_id]
        );

        // 2. District Pending Counts
        const districtPendingRes = await db.query(
            `SELECT 
        d.id, 
        d.name, 
        COUNT(c.id) FILTER (WHERE c.itr_filed = false) as pending_count
       FROM districts d
       LEFT JOIN clients c ON d.id = c.district_id
       WHERE d.office_id = $1 AND d.range_id = $2
       GROUP BY d.id, d.name
       ORDER BY pending_count DESC`,
            [officeId, range_id]
        );

        // 3. OA Productivity (In this range)
        // Assuming OAs are linked to ranges via the clients they are assigned to
        const oaProductivityRes = await db.query(
            `SELECT 
        u.id, 
        u.full_name, 
        COUNT(c.id) as total_assigned,
        COUNT(c.id) FILTER (WHERE c.itr_filed = true) as filed
       FROM users u
       JOIN clients c ON u.id = c.assigned_to
       WHERE u.office_id = $1 AND c.range_id = $2
       GROUP BY u.id, u.full_name`,
            [officeId, range_id]
        );

        res.status(200).json({
            status: 'success',
            data: {
                range_totals: rangeTotalsRes.rows[0],
                districts_pending: districtPendingRes.rows,
                oa_productivity: oaProductivityRes.rows
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching AO dashboard data' });
    }
};

/**
 * @desc    OA Dashboard - Individual performance
 * @route   GET /api/dashboard/oa
 * @access  Private/Any Staff
 */
const getOADashboard = async (req, res) => {
    const { id: userId, office_id: officeId } = req.user;

    try {
        const statsRes = await db.query(
            `SELECT 
        COUNT(*) as assigned_count,
        COUNT(*) FILTER (WHERE itr_filed = true AND itr_filed_date = CURRENT_DATE) as filed_today,
        COUNT(*) FILTER (WHERE everified = true AND everified_date = CURRENT_DATE) as everified_today,
        COUNT(*) FILTER (WHERE itr_filed = false) as pending_assigned
       FROM clients 
       WHERE office_id = $1 AND assigned_to = $2`,
            [officeId, userId]
        );

        res.status(200).json({
            status: 'success',
            data: statsRes.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching OA dashboard data' });
    }
};

module.exports = {
    getCEODashboard,
    getAODashboard,
    getOADashboard
};
