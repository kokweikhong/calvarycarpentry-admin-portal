# Application Setup

1. Setup up environment variables

```
DB_HOST=172.17.0.2 # database docker ip address
DB_PORT=5432
DB_USER=calvarycarpentry@admin
DB_PASSWORD=calvary@admin
DB_NAME=calvarycarpentry
GIN_MODE=release # production mode
PORT=8000
```

> how to find database docker ip address

```
docker inspect \
  -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name_or_id
```

2. Build docker image

```
docker build -t <image name> .
```

3. Run Docker Image

```
docker run -d -p <port> -v ./uploads:/app/uploads --env-file ./.env --restart always --name <container_name> <image>
```
