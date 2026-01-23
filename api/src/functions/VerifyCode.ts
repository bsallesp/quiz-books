import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool } from "../db";

export async function VerifyCode(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const body: any = await request.json();
    const { phoneNumber, code } = body;

    if (!phoneNumber || !code) {
        return { status: 400, body: "Please pass phoneNumber and code in the request body" };
    }

    try {
        const pool = await getPool();

        const result = await pool.request()
            .input('phoneNumber', phoneNumber)
            .input('code', code)
            .query(`
                SELECT TOP 1 Id FROM VerificationCodes
                WHERE PhoneNumber = @phoneNumber 
                AND Code = @code 
                AND Expiration > GETDATE() 
                AND Used = 0
                ORDER BY Expiration DESC
            `);

        if (result.recordset.length > 0) {
            const id = result.recordset[0].Id;
            // Mark as used
            await pool.request()
                .input('id', id)
                .query(`UPDATE VerificationCodes SET Used = 1 WHERE Id = @id`);

            return { status: 200, jsonBody: { success: true, message: "Verification successful" } };
        } else {
            return { status: 400, jsonBody: { success: false, message: "Invalid or expired code" } };
        }
    } catch (error) {
        context.log('Error verifying code:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('VerifyCode', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: VerifyCode
});
