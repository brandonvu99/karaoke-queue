$s3BucketName = "karaoke-queue-app"
$lightsailServiceName = "flask-service"

aws s3 rb s3://karaoke-queue-app --force
echo "Deleted frontend's s3 bucket"

aws lightsail delete-container-service --service-name flask-service
echo "Sent delete command to backend's Lightsail"