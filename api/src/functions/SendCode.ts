import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool } from "../db";
import { SmsClient } from "@azure/communication-sms";
import { v4 as uuidv4 } from 'uuid';

// Polyfill for global.crypto in Node environments that lack it (for Azure SDK compatibility)
if (typeof crypto === 'undefined') {
    (global as any).crypto = {
        randomUUID: () => uuidv4()
    };
} else if (!(crypto as any).randomUUID) {
     (crypto as any).randomUUID = () => uuidv4();
}

export async function SendCode(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const body: any = await request.json();
    const phoneNumber = body?.phoneNumber;

    if (!phoneNumber) {
        return { status: 400, body: "Please pass a phoneNumber in the request body" };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(new Date().getTime() + 5 * 60000); // 5 minutes from now

    try {
        const pool = await getPool();

        // Ensure table exists
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='VerificationCodes' and xtype='U')
            CREATE TABLE VerificationCodes (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                PhoneNumber NVARCHAR(50) NOT NULL,
                Code NVARCHAR(10) NOT NULL,
                Expiration DATETIME NOT NULL,
                Used BIT DEFAULT 0
            )
        `);

        // Insert code
        await pool.request()
            .input('phoneNumber', phoneNumber)
            .input('code', code)
            .input('expiration', expiration)
            .query(`
                INSERT INTO VerificationCodes (PhoneNumber, Code, Expiration)
                VALUES (@phoneNumber, @code, @expiration)
            `);

        // Send SMS via Azure Communication Services
        const connectionString = process.env.ACS_CONNECTION_STRING;
        if (connectionString) {
            const smsClient = new SmsClient(connectionString);
            await smsClient.send({
                from: process.env.ACS_SENDER_PHONE_NUMBER || "+18005551234", // Replace with your Azure phone number
                to: [phoneNumber],
                message: `Your Quiz Books verification code is: ${code}`
            });
            context.log(`SMS sent to ${phoneNumber}`);
        } else {
            context.log(`ACS_CONNECTION_STRING not found. Mocking SMS send. Code: ${code}`);
            // For development/demo without ACS, we log the code.
        }

        return { status: 200, jsonBody: { message: "Code sent successfully" } };
    } catch (error) {
        context.log('Error sending code:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('SendCode', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: SendCode
});
