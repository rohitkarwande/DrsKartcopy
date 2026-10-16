const db = require('../../config/db');

// List of recognized valid international country dial codes
const VALID_COUNTRY_CODES = [
    '+91',  // India (Default)
    '+1',   // US / Canada
    '+44',  // UK
    '+971', // UAE
    '+966', // Saudi Arabia
    '+65',  // Singapore
    '+61',  // Australia
    '+49',  // Germany
    '+33',  // France
    '+81',  // Japan
    '+880', // Bangladesh
    '+92',  // Pakistan
    '+977', // Nepal
    '+94',  // Sri Lanka
    '+974', // Qatar
    '+968', // Oman
    '+965', // Kuwait
    '+973', // Bahrain
    '+60',  // Malaysia
    '+63',  // Philippines
    '+27',  // South Africa
    '+55',  // Brazil
    '+82',  // South Korea
    '+7'    // Russia
];

// Helper to mask email for UI display
const maskEmail = (em) => {
    if (!em) return '';
    const [name, domain] = em.split('@');
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name[0]}${'*'.repeat(Math.max(1, name.length - 2))}${name.slice(-1)}@${domain}`;
};

// Helper to mask phone for UI display
const maskPhone = (ph) => {
    if (!ph) return '';
    if (ph.length <= 4) return ph;
    return ph.slice(0, 3) + ' ' + '*'.repeat(Math.max(2, ph.length - 7)) + ' ' + ph.slice(-4);
};

// Validates email format
const isEmail = (str) => {
    if (!str || typeof str !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
};

// Sanitizes phone number: appends +91 by default if country code missing
const sanitizePhone = (rawPhone, defaultCode = '+91') => {
    if (!rawPhone || typeof rawPhone !== 'string') return null;
    let cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, '');
    if (!cleaned) return null;

    if (cleaned.startsWith('00')) {
        cleaned = '+' + cleaned.slice(2);
    }

    if (cleaned.startsWith('+')) {
        const matchingCode = VALID_COUNTRY_CODES.find(code => cleaned.startsWith(code));
        if (matchingCode) {
            const subscriber = cleaned.slice(matchingCode.length);
            if (/^\d{6,14}$/.test(subscriber)) {
                return cleaned;
            }
        }
        if (/^\+\d{8,15}$/.test(cleaned)) {
            return cleaned;
        }
    }

    cleaned = cleaned.replace(/^0+/, '');

    for (const code of VALID_COUNTRY_CODES) {
        const plainCode = code.slice(1);
        if (cleaned.startsWith(plainCode) && cleaned.length === (plainCode.length + 10)) {
            return '+' + cleaned;
        }
    }

    return `${defaultCode}${cleaned}`;
};

// Formats and standardizes user identifier (email or phone)
const sanitizeIdentifier = (rawIdentifier) => {
    if (!rawIdentifier || typeof rawIdentifier !== 'string') return null;
    let identifier = rawIdentifier.trim();
    const isMail = isEmail(identifier);
    const type = isMail ? 'email' : 'phone';

    if (type === 'email') {
        identifier = identifier.toLowerCase();
    } else if (type === 'phone') {
        identifier = sanitizePhone(identifier);
    }

    return { identifier, type };
};

// Fetches user from DB by ID for auth checks
const getUserById = async (userId) => {
    const result = await db.query(
        'SELECT id, email, phone, role, is_verified, status FROM users WHERE id = $1',
        [userId]
    );
    return result.rows[0] || null;
};

// Fetches full user record with joined user_profiles
const getUserWithProfile = async (userId) => {
    const result = await db.query(
        `SELECT u.id, u.email, u.phone, u.role, u.is_verified, u.status,
                p.first_name, p.last_name, p.profession, p.location
         FROM users u 
         LEFT JOIN user_profiles p ON u.id = p.user_id 
         WHERE u.id = $1`,
        [userId]
    );
    return result.rows[0] || null;
};

module.exports = {
    VALID_COUNTRY_CODES,
    maskEmail,
    maskPhone,
    isEmail,
    sanitizePhone,
    sanitizeIdentifier,
    getUserById,
    getUserWithProfile
};
