# How to run

If you are afraid of running magic3t locally, you can use the Dockerfile to build an image and run the container:

```shell
docker build -t magic3t-frontend .
docker run -p 3000:3000 magic3t-frontend
```