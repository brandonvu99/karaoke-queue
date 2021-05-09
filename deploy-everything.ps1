# TODO: replace these hardcoded strings in the scripts with the variable names
$s3BucketName = "karaoke-queue-app"
$lightsailServiceName = "flask-service"


$baseDirectory = Get-Location
$ErrorActionPreference = "Stop"
$PSDefaultParameterValues['*:ErrorAction']='Stop'
function CheckLastExitCode {
    param ([int[]]$SuccessCodes = @(0), [scriptblock]$CleanupScript=$null)

    if ($SuccessCodes -notcontains $LastExitCode) {
        if ($CleanupScript) {
            "Executing cleanup script: $CleanupScript"
            &$CleanupScript
        }
        $msg = @"
EXE RETURNED EXIT CODE $LastExitCode
CALLSTACK:$(Get-PSCallStack | Out-String)
"@
        cd $baseDirectory
        throw $msg
    }
}














<############## Deploy the front-end into a public s3 bucket ##############>
<# https://dev.to/svenfrese/how-to-deploy-your-angular-app-to-aws-s3-1341 #>
echo "Deploying the front-end into the public s3 bucket"
echo "Building the app..."
cd frontend
ng build --prod
CheckLastExitCode

echo "Creating a bucket that will house the app"
aws s3 mb s3://karaoke-queue-app
CheckLastExitCode

echo "Configuring the bucket for static web hosting"
aws s3 website s3://karaoke-queue-app --index-document index.html --error-document index.html
CheckLastExitCode

echo "Configuring the bucket for public access"
$bucketPolicyLiteralJson = @'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::<bucket_name>/*"
            ]
        }
    ]
}
'@ -replace '<bucket_name>', "karaoke-queue-app"
Set-Content -Path bucket-policy.json -Value $bucketPolicyLiteralJson
aws s3api put-bucket-policy --bucket=karaoke-queue-app --policy file://bucket-policy.json
CheckLastExitCode
Remove-Item bucket-policy.json

echo "Uploading the built app to the bucket"
aws s3 sync dist/karaoke-queue-app s3://karaoke-queue-app
CheckLastExitCode

echo "Checking that the frontend was deployed correctly through a curl"
$frontendUrl = "http://karaoke-queue-app.s3-website-us-east-1.amazonaws.com/"
$response = Invoke-WebRequest -URI $frontendUrl
if ($response.StatusCode -ne 200) {
    throw "Response from frontend url was not 200 OK"
}
echo "Checked that the frontend was deployed correctly"

cd $baseDirectory














<############## Deploy the back-end using Lightsail ##############>
<# https://aws.amazon.com/getting-started/hands-on/serve-a-flask-app/ #>
echo "Deploying the backend using Lightsail"
echo "Containerizing the back-end flask app"
cd backend
docker build -t flask-container .
CheckLastExitCode
echo "Containerized the back-end flask app"

echo "Creating a container service on Lightsail"
$throwaway = & aws lightsail create-container-service --service-name flask-service --power small --scale 1
CheckLastExitCode

echo "Waiting until the container service is ready"
$serviceState = "PENDING"
DO {
    $json = aws lightsail get-container-services --service-name flask-service | ConvertFrom-Json
    CheckLastExitCode
    $serviceState = $json.containerServices.state
    Start-Sleep -s 1
    echo "Waiting..."
} While ($serviceState -ne "READY")
echo "Container service is ready"

echo "Pushing local container to Lightsail"
$pushContainerOutput = & aws lightsail push-container-image --service-name flask-service --label flask-container --image flask-container
CheckLastExitCode
$deploymentImageRefer = [regex]::Match($pushContainerOutput, 'Refer to this image as "(:flask-service\.flask-container\.\d*)" in deployments\.').Groups[1].Value
echo "Creating json files for configuration for the container deployment"
$containersLiteralJson = @'
{
    "flask": {
        "image": "$deploymentImageRefer",
        "ports": {
            "5000": "HTTP"
        }
    }
}
'@ -replace '\$deploymentImageRefer', $deploymentImageRefer
Set-Content -Path containers.json -Value $containersLiteralJson
$publicEndPointLiteralJson = @'
{
    "containerName": "flask",
    "containerPort": 5000
}
'@
Set-Content -Path public-endpoint.json -Value $publicEndPointLiteralJson
echo "Created json files for configuration for the container deployment"

echo "Deploying the container that is in Lightsail"
$createContainerOutput = & aws lightsail create-container-service-deployment --service-name flask-service --containers file://containers.json --public-endpoint file://public-endpoint.json
CheckLastExitCode
Remove-Item containers.json
Remove-Item public-endpoint.json
echo "Removed json files that were created"

echo "Waiting until the container is ready"
$serviceState = "DEPLOYING"
$backEndUrl = "not a url"
DO {
    $json = aws lightsail get-container-services --service-name flask-service | ConvertFrom-Json
    CheckLastExitCode
    $serviceState = $json.containerServices[0].state
    $backEndUrl = $json.containerServices[0].url
    Start-Sleep -s 1
    echo "Waiting..."
} While ($serviceState -ne "RUNNING")

echo $("Container deployed to: " + $backEndUrl)

echo "Doing a curl to check if the backend is really up and running"
$response = Invoke-WebRequest -URI $backEndUrl
if ($response.StatusCode -ne 200) {
    throw "Response from backend url was not 200 OK"
}
echo "Backend is up and running"

cd $baseDirectory

echo "Sleeping for 10 minutes now... Feel free to Ctrl+C out."
Start-Sleep -s 600
