import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getPool } from "../db";

export async function SubmitResult(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        const body: any = await request.json();
        const { userId, topic, isCorrect } = body;

        if (!userId || !topic || isCorrect === undefined) {
            return { status: 400, body: "Missing required fields: userId, topic, isCorrect" };
        }

        const pool = await getPool();

        // Ensure table exists (simple migration)
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

        await pool.request()
            .input('userId', userId)
            .input('topic', topic)
            .input('isCorrect', isCorrect ? 1 : 0)
            .query(`INSERT INTO QuizResults (UserId, Topic, IsCorrect) VALUES (@userId, @topic, @isCorrect)`);

        return { status: 200, body: "Result submitted successfully" };
    } catch (error) {
        context.log('Error submitting result:', error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('SubmitResult', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: SubmitResult
});
