import mysql from 'serverless-mysql';
const db = mysql({
    config: {
        host: process.env.NEXT_PUBLIC_MYSQL_HOST,
        database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
        user: process.env.NEXT_PUBLIC_MYSQL_USER,
        password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD
    }
});
export default async function excuteQuery({ query, values }) {
    try {
        const results = await db.query(query, values);
        await db.end();
        return results;
    } catch (error) {
        return { error };
    }
}