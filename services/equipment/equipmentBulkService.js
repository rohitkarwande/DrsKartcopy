const fs = require('fs');
const csv = require('csv-parser');
const db = require('../../config/db');
const { CATEGORIES, CONDITIONS } = require('./equipmentConstants');

class EquipmentBulkService {
    /**
     * Bulk upload equipment posts from CSV file
     */
    async bulkUploadEquipment({ sellerId, filePath }) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    let successCount = 0;
                    let failCount = 0;
                    const errors = [];

                    for (let i = 0; i < results.length; i++) {
                        const row = results[i];
                        try {
                            const title = row.title || row.Title;
                            const category = row.category || row.Category;
                            const brand = row.brand || row.Brand;
                            const model = row.model || row.Model;
                            const condition = row.condition || row.Condition;
                            const price = row.price || row.Price || null;
                            const city = row.city || row.City;
                            const state = row.state || row.State || null;
                            const description = row.description || row.Description || '';
                            const year = row.manufacturing_year || row.Manufacturing_Year || null;

                            if (!title || !category || !brand || !model || !condition || !city) {
                                failCount++;
                                errors.push(`Row ${i + 2}: Missing required fields (title, category, brand, model, condition, city)`);
                                continue;
                            }

                            if (!CATEGORIES.includes(category) || !CONDITIONS.includes(condition)) {
                                failCount++;
                                errors.push(`Row ${i + 2}: Invalid category or condition`);
                                continue;
                            }

                            const insertQuery = `
                                INSERT INTO equipment_posts (
                                    seller_id, title, description, category, brand, model, 
                                    manufacturing_year, condition, price, city, state, status
                                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'Draft')
                            `;
                            const values = [sellerId, title, description, category, brand, model, year, condition, price, city, state];
                            await db.query(insertQuery, values);
                            successCount++;
                        } catch (err) {
                            failCount++;
                            errors.push(`Row ${i + 2}: Database error - ${err.message}`);
                        }
                    }

                    try {
                        fs.unlinkSync(filePath);
                    } catch (unlinkErr) {
                        console.error('Failed to unlink bulk upload file:', unlinkErr.message);
                    }

                    resolve({ message: 'Bulk upload completed', successCount, failCount, errors });
                })
                .on('error', (err) => {
                    try {
                        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    } catch (e) {}
                    reject(err);
                });
        });
    }
}

module.exports = new EquipmentBulkService();
