# Magic3T Frontend

[![Audit](https://github.com/King-witcher/Magic3T-Frontend/actions/workflows/audit.yml/badge.svg)](https://github.com/King-witcher/Magic3T-Frontend/actions/workflows/audit.yml)
[![Biome Lint](https://github.com/King-witcher/Magic3T-Frontend/actions/workflows/biome-lint.yml/badge.svg)](https://github.com/King-witcher/Magic3T-Frontend/actions/workflows/biome-lint.yml)

# How to run

If you are afraid of running magic3t locally, you can use the Dockerfile to build an image and run the container:

```shell
docker build -t magic3t-frontend .
docker run -p 3000:3000 magic3t-frontend
```