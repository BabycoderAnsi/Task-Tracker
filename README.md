# Task Tracker CLI

A simple command line interface (CLI) to track and manage your tasks.


### Install Dependencies

```sh
npm install
```

## Features

- Add, Update, and Delete tasks
- Mark tasks as in-progress or done
- List all tasks
- List tasks by status (todo, in-progress, done)

## Usage

### Adding a new task

```sh
node index add "Buy groceries" "test-01"
```

### List all tasks or list tasks by status

```sh
node index list ("list all the tasks")
node index list done
node index list todo
node index list in-progress
```

### Update a tasks 

```sh
node index update 1 "Buy groceries and cook dinner"
```

### Mark in progress

```sh
node index mark-in-progress 1
```

### Mark done

```sh
node index mark-done 1
```

### Delete a task

```sh
node index delete 1
```
