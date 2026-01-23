import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: false // Change to true for local dev / self-signed certs
    }
};

export async function getPool() {
    try {
        return await sql.connect(config);
    } catch (err) {
        console.error('Database connection failed: ', err);
        throw err;
    }
}
