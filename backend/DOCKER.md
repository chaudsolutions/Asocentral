# Backend Docker Deployment

This backend image is designed for AWS ECS/Fargate. It builds the TypeScript app, installs only production dependencies in the final image, and runs:

```sh
node dist/src/index.js
```

## Build Locally

From the repo root:

```sh
docker build -t trojan-news-backend ./backend
```

Run locally:

```sh
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e NEWS_DATA_API_KEY=your_key \
  -e JWT_SECRET=your_secret \
  -e DB_URI=your_mongodb_uri \
  -e AWS_REGION=your_region \
  -e AWS_BUCKET_NAME=your_bucket \
  -e AWS_ACCESS_KEY_ID=your_access_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret_key \
  trojan-news-backend
```

## Required ECS Environment Variables

Set these in your ECS task definition. Prefer AWS Secrets Manager or SSM Parameter Store for sensitive values.

```txt
NODE_ENV=production
PORT=3000
NEWS_DATA_API_KEY=
JWT_SECRET=
DB_URI=
AWS_REGION=
AWS_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## ECS Container Settings

- Container port: `3000`
- Health check path for an Application Load Balancer: `/`
- Docker healthcheck is already included in the image.

## Push To ECR

Example:

```sh
aws ecr create-repository --repository-name trojan-news-backend
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com
docker build -t trojan-news-backend ./backend
docker tag trojan-news-backend:latest your-account-id.dkr.ecr.your-region.amazonaws.com/trojan-news-backend:latest
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/trojan-news-backend:latest
```
