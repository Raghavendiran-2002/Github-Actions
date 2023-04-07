# cicd-aws-docker

In this project we use Github Action to build container and push it to Docker Hub and deploy container on EC2 instance.

## Getting Started

###### Add Deploy Key

```
ssh-keygen
cat .ssh/id_rsa.pub
```

###### Copy the key to Deploy keys:

Repo -> Settings -> Security -> Deploy Keys -> Add deploy key ->

```
Title = "deploy_key"
Key = "COPY KEY"
Allow write access (True)
```

###### Set Secrets Environment variable:

Repo -> Settings -> Security -> Secrets and variables -> Actions -> New repository secret ->

```
Name = "AWS_PRIVATE_KEY"
Secret = "<content> sshKey.pem"

Name = "DOCKER_PASSWORD"
Secret = "<password>"

Name = "DOCKER_USERNAME"
Secret = "<username>"

Name = "HOSTNAME"
Secret = "ec2-3-110-114-93.ap-south-1.compute.amazonaws.com"

Name = "USER_NAME"
Secret = "ubuntu"
```

###### Create Actions on Github

create file :
.github/workflows/deploy-main.yml

```
# TO RUN DOCKER IMAGE LOCALLY
# docker pull raghavendiran2002/cicd:main
# docker run -p 127.0.0.1:3000:3000 docker.io/raghavendiran2002/cicd:main
name: Dockerize Node.js Application
on: push
jobs:
  build-container:
    name: Push Docker image to Docker Hub
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@f054a8b539a109f9f41c372932f1ae047eff08c9
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38
        with:
          images: raghavendiran2002/cicd

      - name: Build and push Docker image
        uses: docker/build-push-action@ad44023a93711e3deb337508980b4b5e9bcdc5dc
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  Deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Deploy in EC2
        env:
          PRIVATE_KEY: ${{ secrets.AWS_PRIVATE_KEY  }}
          HOSTNAME: ${{ secrets.HOSTNAME  }}
          USER_NAME: ${{ secrets.USER_NAME  }}

        run: |
          echo "$PRIVATE_KEY" > private_key && chmod 600 private_key
          ssh -o StrictHostKeyChecking=no -i private_key ${USER_NAME}@${HOSTNAME} '

            #Now we have got the access of EC2 and we will start the deploy .
            sudo su &&
            #git clone git@github.com:Raghavendiran-2002/cicd-aws-docker
            cd /home/ubuntu/cicd-aws-docker/ &&
            git checkout main &&
            git fetch --all &&
            git reset --hard origin/main &&
            git pull origin main &&
            sudo docker system prune -a -f &&
            sudo docker-compose up
          '

```

###### Deploy Docker image from Docker Hub

```
docker pull raghavendiran2002/cicd:main
docker run -p 127.0.0.1:3000:3000 docker.io/raghavendiran2002/cicd:main
```
