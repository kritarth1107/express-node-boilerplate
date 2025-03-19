import dotenv from 'dotenv';
dotenv.config();

const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        apiVersion: 'v1',
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    },

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        validity: process.env.JWT_VALIDITY || '24h',
    },

    // Database Configuration
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_db',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },

    // Hashicrop Vault Configuration
    vault: {
        address: process.env.VAULT_ADDR,
        token: process.env.VAULT_TOKEN,
        secretPath: process.env.VAULT_SECRET_PATH,
    },
    

    // Security Configuration
    security: {
        bcryptSaltRounds: 10,
        rateLimiting: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        },
    },

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        filename: 'app.log',
    },

    // SSH Configuration
    ssh: {
        defaultTimeout: 30000, // 30 seconds
        retryAttempts: 3,
    },

    // AES Configuration
    encryption: {
        secretKey: process.env.AES_SECRET,
        ivLength: 16,
    }
};

// Validation function to ensure required environment variables are set
const validateConfig = () => {
    const requiredEnvVars = [
        'JWT_SECRET',
        'MONGODB_URI',
        'AES_SECRET',
        'PORT',
        'NODE_ENV',
        'CORS_ORIGINS',
        'LOG_LEVEL'
    ];

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
};

// Validate configuration on startup
validateConfig();

// Freeze the configuration object to prevent modifications
export default Object.freeze(config);