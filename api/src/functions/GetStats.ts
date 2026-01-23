import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool } from "../db";

export async function GetStats(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const userId = request.query.get('userId');

    if (!userId) {
        return { status: 400, body: "Please pass a userId on the query string" };
    }

    try {
        const pool = await getPool();

        // Ensure table exists (just in case GetStats is called before any submit)
        await pool.request().query(`
             IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='QuizResults' and xtype='U')
            CREATE TABLE QuizResults (
                Id INT IDENTITY(1,1) PRIMARY KEY,
                UserId NVARCHAR(255) NOT NULL,
                Topic NVARCHAR(255) NOT NULL,
                IsCorrect BIT NOT NULL,
                Timestamp DATETIME DEFAULT GETDATE()
            )
        `);

        const result = await pool.request()
            .input('userId', userId)
            .query(`
                SELECT 
                    Topic, 
                    COUNT(*) as TotalAttempts,
                    SUM(CASE WHEN IsCorrect = 1 THEN 1 ELSE 0 END) as CorrectCount
                FROM QuizResults 
                WHERE UserId = @userId 
                GROUP BY Topic
            `);

        const stats = result.recordset.map(row => ({
            topic: row.Topic,
            totalAttempts: row.TotalAttempts,
            correctCount: row.CorrectCount,
            percentage: (row.CorrectCount / row.TotalAttempts) * 100
        }));

        return { status: 200, jsonBody: stats };
    } catch (error) {
        context.log('Error getting stats:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('GetStats', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetStats
});
