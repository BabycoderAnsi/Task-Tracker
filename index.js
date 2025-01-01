const fs = require("fs");
const filePath = "./tasks.json";

function loadTasks() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const fileContent = fs.readFileSync(filePath, "utf-8").trim();
    if (!fileContent) {
      fs.writeFileSync(filePath, JSON.stringify([]));
      return [];
    }
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error in loadTasks:", error.message);
    return [];
  }
}

function isTaskUnique(tasks, description, author) {
  // Check if a task with the same description and author already exists
  return !tasks.some(
    (task) => task.description === description && task.author === author
  );
}

function addTasks(description, author) {
  try {
    // Validation for description and author
    if (!description || description.trim().length === 0) {
      console.error("Error: Description is required and cannot be empty.");
      return;
    }
    if (!author || author.trim().length === 0 || typeof author !== "string") {
      console.error(
        "Error: author is required, cannot be empty, and must be a string."
      );
      return;
    }
    const tasks = loadTasks();
    if (!isTaskUnique(tasks, description, author)) {
      console.error(
        "Error: A task with the same description and author already exists."
      );
      return;
    }
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
      description,
      status: "todo",
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
  } catch (error) {
    console.error("Error in addTasks:", error.message);
  }
}

function saveTasks(tasks) {
  try {
    // Validate that `tasks` is an array
    if (!Array.isArray(tasks)) {
      console.error("Invalid data type: tasks must be an array.");
    }

    // Validate that each task is an object and has the required keys
    const requiredKeys = ["id", "description", "status", "author", "createdAt", "updatedAt"];
    tasks.forEach((task, index) => {
      if (typeof task !== "object" || task === null) {
        console.error(`Invalid task at index ${index}: Task must be a non-null object.`);
      }

      requiredKeys.forEach((key) => {
        if (!(key in task)) {
          console.error(`Invalid task at index ${index}: Missing required key "${key}".`);
        }
      });
    });

    // If all validations pass, save tasks to file
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 4));
  } catch (error) {
    console.error("Error in saveTasks:", error.message);
  }
}

function listTasks(status) {
  try {
    const tasks = loadTasks();
    const taskFilterByStatus = status
      ? tasks.filter((task) => task.status === status)
      : tasks;
    taskFilterByStatus.forEach((task) => {
      console.log(
        `ID: ${task.id} | Description: ${task.description} | Status: ${task.status} | CreatedAt: ${task.createdAt} | UpdatedAt: ${task.updatedAt}`
      );
    });
  } catch (error) {
    console.error("Error in listTasks:", error.message);
  }
}

function deleteTask(id) {
  try {
    const tasks = loadTasks();

    const initialLength = tasks.length;
    const taskFound = tasks.filter((task) => task.id !== id);

    if (taskFound.length === initialLength) {
      console.error(`Task with ID:${id} not found`);
      return;
    }

    saveTasks(taskFound);
    console.log(`Delete task with ID: ${id}.`);
  } catch (error) {
    console.error("Error in deleteTask:", error.message);
  }
}

function updateTask(taskId, newDescription) {
  try {
    const tasks = loadTasks();
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          description: newDescription,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });
    if (JSON.stringify(tasks) === JSON.stringify(updatedTasks)) {
      console.error(`Task with ID:${taskId} not found`);
      return;
    }
    saveTasks(updatedTasks);
    console.log(`Task with ID:${taskId} updated successfully`);
  } catch (error) {
    console.error("Error in updateTask:", error.message);
  }
}

function markInDone(taskId) {
  try {
    const tasks = loadTasks();
    const changeStatus = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "done",
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });
    if (JSON.stringify(tasks) === JSON.stringify(changeStatus)) {
      console.error(`Task with ID:${taskId} not found`);
    }
    saveTasks(changeStatus);
    console.log(`Task with ID:${taskId} status updated successfully`);
  } catch (error) {
    console.error("Error in markInDone", error.message);
  }
}

function markInProgress(taskId) {
  try {
    const tasks = loadTasks();
    const changeStatus = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "in-progress",
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });
    if (JSON.stringify(tasks) === JSON.stringify(changeStatus)) {
      console.error(`Task with ID:${taskId} not found`);
      return
    }
    saveTasks(changeStatus);
    console.log(`Task with ID:${taskId} status updated successfully`);
  } catch (error) {
    console.error("Error in markInProgress", error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "add":
      if (args.length !== 3) {
        console.log("Usage: node index add <description> <author>");
        return;
      }
      const description = args[1];
      const author = args[2];
      addTasks(description, author);
      break;
    case "list":
      if (args.length === 1) {
        listTasks();
      } else if (args.length === 2) {
        listTasks(args[1]);
      } else {
        console.log("Usage: index list [<status>]");
        return;
      }
      break;
    default:
      console.log(`Unknown command: ${command}`);
      return;
    case "delete":
      if (args.length !== 2) {
        console.log("Usage: index delete <id>");
        return;
      }
      deleteTask(parseInt(args[1]));
      break;
    case "update":
      if (args.length !== 3) {
        console.log("Usage: index update <id> <newDescription>");
        return;
      }
      const id = parseInt(args[1]);
      const newDescription = args[2];
      updateTask(id, newDescription);
      break;
    case "mark-in-progress":
      if (args.length !== 2) {
        console.log("Usage: index mark-in-progress <id>");
        return;
      }
      const taskId = parseInt(args[1]);
      markInProgress(taskId);
      break;
    case "mark-done":
      if (args.length !== 2) {
        console.log("Usage: index mark-in-progress <id>");
        return;
      }
      const markId = parseInt(args[1]);
      markInDone(markId);
      break;
  }
}

if (require.main === module) {
  main();
}
