# Welcome to CDK TypeScript project

This is a project for CDK development with TypeScript.

### Project Description:
- **Responsive web UI (use ReactJS)** with a text input and a file input
  - Text input: `[InputText]` // [] means the string is changeable
  - File input: `[InputFile].txt`
    - `[InputFile].txt` content: `[File Content]`
  - Submit button
- **Upload the input file to S3** from the browser directly (do not send the file content directly to Lambda, do not get credentials from Cognito)
  - S3 path: `[BucketName]/[InputFile].txt`
- **Save the inputs and S3 path in DynamoDB FileTable via API gateway and Lambda Function**
  - id: `[1]` // auto-generated id via `nanoid`
  - input_text: `[InputText]`
  - input_file_path: `[BucketName]/[InputFile].txt`
- **After the file is uploaded in S3 and added to DynamoDB**, trigger a script run in a VM instance (EC2) via the DynamoDB Event.
  1. Create a new VM automatically
  2. Download the script from S3 to the VM (Upload the scripts to S3 via CDK or programmatically as the `InputFile`)
  3. Run the script in the VM
     - Get the inputs from DynamoDB FileTable by id
     - Download the input file from S3 `[BucketName]/[InputFile].txt` to the VM
     - Append the retrieved input text to the downloaded input file and save it as `[OutputFile].txt`
       - `[OutputFile].txt` content: `[File Content] : [InputText]`
     - Upload the output file to S3
       - S3 path: `[BucketName]/[OutputFile].out.txt`
     - Save the outputs and S3 path in DynamoDB FileTable
       - id : `[1]`
       - output_file_path: `[BucketName]/[OutputFile].out.txt`
  4. Terminate the VM automatically

### Requirements:
- Use **AWS CDK** to manage all AWS infrastructure (latest version, TypeScript)
- Use **AWS SDK JavaScript V3 for Lambda** (latest version, not V2)
- Do not put any AWS access key / credentials in your code. (not in config, not in environment, no hard code, no place holder, follow AWS best practices)
- No SSH and no hard-coded parameters.
- Your parameter/variable names, file names and folder names are reader-friendly and professional.
- Your txt file in S3 is not public. One user one folder. No shared folder.
- Do not use any AWS Amplify frontend or backend resources.
- Follow the **AWS Best Practices**.
- After saving the inputs and S3 path in DynamoDB FileTable, your system will create a new VM based on the event (not a pre-provisioned VM) and trigger the script to run automatically with error handling (no sleep).
- Professional code and reader-friendly README file.
- If you cannot finish ALL Basic Requirements, do not submit. Your submission will be ignored.

Please let me know if you need any additional information or help with this setup!

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd path-to-repository

2. Run the backend:
   ```bash
   cdk configure
   cdk bootstrap
   cdk deploy

3. Run the frontend:
   Change AWS_API_URL in App.js to API URL: from `cdk deploy`.
   ```bash
   npm start
