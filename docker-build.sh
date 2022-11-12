docker-compose build
docker save -o ./docker_build/db.tar bibimbap/noldaga-db
docker save -o ./docker_build/server.tar bibimbap/noldaga-server
docker save -o ./docker_build/client.tar bibimbap/noldaga-client