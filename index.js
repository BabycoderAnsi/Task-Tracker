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

function isTaskUnique(tasks, description, Author) {
  // Check if a task with the same description and author already exists
  return !tasks.some(
    (task) => task.description === description && task.Author === Author
  );
}

function addTasks(description, Author) {
  try {
    // Debugging inputs
    console.log(
      "Inside addTasks function. Description:",
      description,
      "Author:",
      Author
    );

    // Validation for description and Author
    if (!description || description.trim().length === 0) {
      console.error("Error: Description is required and cannot be empty.");
      return;
    }
    if (!Author || Author.trim().length === 0 || typeof Author !== "string") {
      console.error(
        "Error: Author is required, cannot be empty, and must be a string."
      );
      return;
    }
    const tasks = loadTasks();
    if (!isTaskUnique(tasks, description, Author)) {
      console.error(
        "Error: A task with the same description and author already exists."
      );
      return;
    }
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
      description,
      status: "todo",
      Author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Debugging the newTask object
    console.log("New Task object:", newTask);

    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
  } catch (error) {
    console.error("Error in addTasks:", error.message);
  }
}

function saveTasks(tasks) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 4));
  } catch (error) {
    console.error("Error in saveTasks:", error.message);
  }
}

function listTasks(status) {
  try {
    const tasks = loadTasks();
    console.log("Loaded tasks:", tasks);
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
    const updatedTasks = tasks.filter((task) => task.id !== id);

    if (updatedTasks.length === initialLength) {
      console.error(`Task with ID:${id} not found`);
      return;
    }

    saveTasks(updatedTasks);
    console.log(`Delete task with ID: ${id}.`);
  } catch (error) {
    console.error("Error in deleteTask:", error.message);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  console.log("Command:", command, "Args:", args);

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
  }
}

if (require.main === module) {
  main();
}
