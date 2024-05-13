import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class AssignmentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'FileUploadBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });

    const table = new dynamodb.Table(this, 'FileTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const handler = new lambda.Function(this, 'FileHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('resources/lambda'),
      handler: 'handle.ts',
      environment: {
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName
      }
    });

    bucket.grantReadWrite(handler);
    table.grantFullAccess(handler);

    const api = new apigateway.RestApi(this, 'FileApi', {
      restApiName: 'File Service',
      description: 'FileUploadService.'
    });

    const integration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' }
    });

    api.root.addMethod('POST', integration);

    new cdk.CfnOutput(this, 'API URL', { value: api.url });
  }
}