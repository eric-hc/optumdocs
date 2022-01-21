---
title: Copying data between AWS and Azure
author: Bill Schneider
author_title: Sr. Principal Engineer
author_url: https://github.com/wrschneider
author_image_url: https://github.com/wrschneider.png
tags: [AWS Azure S3 Cloud, engineering]
hide_table_of_contents: false
---
### Copying data between AWS and Azure

<!--truncate-->
Many Optum teams are working in Azure, although some are also working in AWS.  So sometimes we have to transfer files between
AWS and Azure, for batch-processing pipelines that have components in both clouds.

The easiest way to move files between clouds is through their respective object storage APIs: Azure Blob Storage or 
AWS S3.  Transfers are over port 443 with public-facing endpoints, and authentication/authorization is handled like
all other native cloud services.

There are good open-source tools for AWS/Azure file transfers, including
[`azcopy`](https://github.com/Azure/azure-storage-azcopy) and 
[`rclone`](https://github.com/rclone/rclone).  Both are command-line tools that can be executed from automated 
processes.  `azcopy` is specialized to work with Azure, but lacks the ability to move data from Azure to 
AWS S3.  `rclone` is general purpose any-to-any transfers, but may not be as optimized for uploads to Azure.

These tools can easily be installed in Docker containers.  If you are running on AWS, you might want to execute
a transfer to/from Azure as a serverless ECS Fargate task.  When you run the task, you would pass the specific
command line parameters in the `containerOverrides`.  This is all standard; the only tricky piece is 
how to manage credentials for both AWS and Azure.  Secrets that can be passed through environment variables can be
[stored in AWS Parameter Store or Secrets Manager and retrieved with `secrets` in the container definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html).  Others require wrapper scripts to perform
additional tasks before running azcopy or rclone.

* azcopy 
  * AWS credentials: for some reason, [azcopy doesn't use native AWS profiles](https://github.com/Azure/azure-storage-azcopy/issues/1341) and only takes AWS credentials from environment variables.  So you need a wrapper script to set these up.
  * Azure SAS tokens: azcopy expects these on the command line, so it's a good idea for a wrapper script to append this to the URL
  * Azure service principal: secret can be passed through `AZCOPY_SPA_CLIENT_SECRET` environment variable.

* Rclone 
  * AWS credentials: uses the AWS SDK and will pick up AWS credentials from the container's execution role.
  * Azure SAS tokens: SAS URL can be passed via `RCLONE_AZUREBLOB_SAS_URL` environment variable as container secret.
  * Azure service principal: needs to be stored as JSON in a file.  Your container needs a wrapper script that takes 
  the actual secret from the injected environment variable, and writes it to a file.

Examples of wrapper script for `azcopy` to set up AWS credentials from the ECS metadata endpoint:

```sh
response=$(wget -O - 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)
export AWS_ACCESS_KEY_ID=$(echo "$response" | jq -r '.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo "$response" | jq -r '.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo "$response" | jq -r '.Token')
azcopy $@
```

If you are copying to Azure and need to keep the SAS token secret, you can append modify the above script to
append it to the URL and then omit the SAS token from the Azure blob storage URL passed in `containerOverrides`:

```sh
azcopy $@$AZURE_SECRET
```

Note that this only works because azcopy can only be used to copy *from* S3 *to* Azure, not the other way around, so
we know the Azure URL will always be the final argument on the command line.

For rclone, this is a wrapper script to handle the service principal JSON:

```sh
# assume AZURE_SECRET is configured with secret in container definition
echo "$AZURE_SECRET" > /tmp/secret.json
export RCLONE_AZUREBLOB_SERVICE_PRINCIPAL_FILE=/tmp/secret.json
rclone $@
```

All of the above will allow you to do your Azure/AWS file transfers in a serverless Fargate task, that can be
integrated with whatever other pipeline workflow you have.
