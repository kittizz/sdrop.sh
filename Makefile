build-frontend:
	docker buildx build --platform linux/amd64 -t registry.xver.cloud/sdrop.sh/sdrop-frontend -f frontend/Dockerfile ./frontend
	