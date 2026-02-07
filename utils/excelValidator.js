const xlsx = require('xlsx');
const fs = require('fs');
const csv = require('csv-parser');

/**
 * @desc    Validate PAN format (10 characters, specific pattern)
 */
const isValidPAN = (pan) => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    return pan && pan.length === 10 && panRegex.test(pan.toUpperCase());
};

/**
 * @desc    Parse and Validate Excel/CSV data
 */
const validateExcelData = async (filePath, ext) => {
    let jsonData = [];

    // 1. Convert to JSON
    if (ext === '.csv') {
        jsonData = await new Promise((resolve, reject) => {
            const rows = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => rows.push(data))
                .on('end', () => resolve(rows))
                .on('error', (err) => reject(err));
        });
    } else {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = xlsx.utils.sheet_to_json(worksheet);
    }

    const validRows = [];
    const invalidRows = [];
    const panSet = new Set(); // To detect duplicates inside file

    // 2. Iterate and Validate
    jsonData.forEach((row, index) => {
        const rowNumber = index + 2; // +1 for 0-indexing, +1 for header
        const errors = [];

        // Required columns
        if (!row.pan) {
            errors.push('Missing PAN');
        }
        if (!row.full_name && !row.name) { // Adapt to different header naming
            errors.push('Missing Full Name');
        }

        // PAN Format
        if (row.pan && !isValidPAN(row.pan)) {
            errors.push(`Invalid PAN format: ${row.pan}`);
        }

        // Duplicate Check inside file
        if (row.pan) {
            const upperPan = row.pan.toUpperCase();
            if (panSet.has(upperPan)) {
                errors.push(`Duplicate PAN in file: ${upperPan}`);
            } else {
                panSet.add(upperPan);
            }
        }

        if (errors.length > 0) {
            invalidRows.push({
                row: rowNumber,
                data: row,
                errors
            });
        } else {
            validRows.push({
                ...row,
                pan: row.pan.toUpperCase(),
                full_name: row.full_name || row.name // Standardize
            });
        }
    });

    return {
        validRows,
        invalidRows,
        summary: {
            total: jsonData.length,
            valid: validRows.length,
            invalid: invalidRows.length
        }
    };
};

module.exports = {
    validateExcelData,
    isValidPAN
};
