const db = require('../../config/db');

class UserKycService {
    /**
     * Submit KYC documents and update company name
     */
    async submitKyc({ userId, data, file, io, userContact }) {
        const { document_type, company_name } = data;
        const document_file_url = file ? `/uploads/kyc/${file.filename}` : null;
        const document_url = (data.document_url && data.document_url.trim()) ? data.document_url.trim() : (document_file_url || null);

        if (!document_type) {
            const err = new Error('document_type is required');
            err.statusCode = 400;
            throw err;
        }
        if (!document_url && !document_file_url) {
            const err = new Error('Either a document number or a document file upload is required');
            err.statusCode = 400;
            throw err;
        }

        const result = await db.query(
            `INSERT INTO kyc_documents (user_id, document_type, document_url, document_file_url)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id) DO UPDATE
             SET document_type = EXCLUDED.document_type,
                 document_url = COALESCE(EXCLUDED.document_url, kyc_documents.document_url),
                 document_file_url = COALESCE(EXCLUDED.document_file_url, kyc_documents.document_file_url),
                 status = 'Pending',
                 rejection_reason = NULL,
                 submitted_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, document_type, document_url, document_file_url]
        );

        if (company_name && company_name.trim()) {
            await db.query(
                `INSERT INTO user_profiles (user_id, company_name)
                 VALUES ($1, $2)
                 ON CONFLICT (user_id) DO UPDATE SET company_name = EXCLUDED.company_name, updated_at = CURRENT_TIMESTAMP`,
                [userId, company_name.trim()]
            );
        }

        return result.rows[0];
    }

    /**
     * Get KYC status
     */
    async getKycStatus(userId) {
        const result = await db.query(
            `SELECT id, document_type, document_url, document_file_url, status, rejection_reason, submitted_at, reviewed_at
             FROM kyc_documents
             WHERE user_id = $1
             ORDER BY submitted_at DESC
             LIMIT 1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return { status: 'not_submitted' };
        }
        return result.rows[0];
    }
}

module.exports = {
    UserKycService,
    userKycService: new UserKycService()
};
