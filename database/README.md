The username, password, and database are typically specified in the environment file (`.env`) that you pass to Docker using the `--env-file` option. Here's an example of what the `.env` file might look like:

```env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
```

In this file, `myuser`, `mypassword`, and `mydatabase` are the username, password, and database name, respectively. You should replace these with your own values.

When you run the Docker container with the `--env-file` option, Docker will set these environment variables in the container. The PostgreSQL Docker image is configured to use these environment variables to create a database and user when the container is started.

Here's the command to run the Docker container with the environment file:

```bash
docker run --name some-postgres -v /path/to/your/init.sql:/docker-entrypoint-initdb.d/init.sql -v /my/own/datadir:/var/lib/postgresql/data --env-file /path/to/your/.env -p 5432:5432 -d postgres:tag
```

In this command, replace `/path/to/your/init.sql`, `/my/own/datadir`, `/path/to/your/.env`, and `postgres:tag` with your own values.
