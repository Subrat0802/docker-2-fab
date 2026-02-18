## push images to docker hub

```bash 
    docker login
```

```bash 
    docker tag todo-backend yourusername/todo-backend:latest
    docker tag todo-frontend yourusername/todo-frontend:latest  
```

```bash 
    docker push yourusername/todo-backend:latest
    docker push yourusername/todo-frontend:latest
```

```bash 
    docker pull yourusername/todo-backend:latest
    docker pull yourusername/todo-frontend:latest
```