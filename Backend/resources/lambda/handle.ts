import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const BUCKET_NAME = process.env.BUCKET_NAME!;
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const body = JSON.parse(event.body!);
        const text = body.text;
        const encodedFile = body.file;

        const fileBuffer = Buffer.from(encodedFile, 'base64');

        const fileId = uuidv4();
        const s3Key = `${fileId}.txt`;

        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileBuffer
        }).promise();

        await dynamoDB.put({
            TableName: TABLE_NAME,
            Item: {
                id: fileId,
                text: text,
                filePath: s3Key
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'File saved successfully',
                fileId: fileId,
                s3Key: s3Key
            })
        };
    } catch (error) {

        console.error('Error saving file:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to save file'
            })
        };
    }
};