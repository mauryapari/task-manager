"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { FormEvent, useState } from "react";

const taskStatues = ["NEW", "IN PROGRESS", "COMPLETED", "CANCELLED"];

type categorizedTasksType = {
  [taskStatus: string]: Doc<"tasks">[];
};
export default function Home() {
  const [task, setTask] = useState<string>("");
  const tasks = useQuery(api.tasks.getTasks);
  const createTasks = useMutation(api.tasks.createTasks);
  const updateTasks = useMutation(api.tasks.updateTasks);

  const categorizeTask = (tasks: Doc<"tasks">[] | undefined) => {
    let categorizedTasks = {} as categorizedTasksType;

    taskStatues.forEach((status: string) => {
      categorizedTasks[status] = [];
    });

    tasks?.forEach((task) => {
      const status = task.status;
      if (categorizedTasks.hasOwnProperty(status)) {
        categorizedTasks[status].push(task);
      }
    });
    return categorizedTasks;
  };

  const categorizedTasks = categorizeTask(tasks);

  const submitTaskForm = (e: FormEvent) => {
    e.preventDefault();
    createTasks({ title: task });
    setTask("");
  };

  const captureTask = (e: React.DragEvent<HTMLDivElement>, id: Id<"tasks">) => {
    e.dataTransfer?.setData("id", id);
  };

  const dropTask = (e: React.DragEvent<HTMLDivElement>, taskStatus: string) => {
    const id = e.dataTransfer?.getData("id") as Id<"tasks">;
    updateTasks({ id, taskStatus });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="flex flex-col gap-2" onSubmit={submitTaskForm}>
        <input
          className="py-2 px-4"
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        ></input>
        <button type="submit" className="bg-blue-500 py-2 text-white text-bold">
          Create Task
        </button>
      </form>
      <div className="w-[100%] flex justify-between my-4">
        {taskStatues.map((taskStatus: string, index) => (
          <div
            key={index}
            className="min-h-[250px] basis-[25%] bg-white border-2 rounded-2xl text-center py-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => dropTask(e, taskStatus)}
          >
            <p className="text-bold text-xl">{taskStatus}</p>
            {categorizedTasks[taskStatus]?.map(({ _id, text }) => (
              <div
                key={_id.toString()}
                draggable
                className="p-5 m-4 border-2"
                onDragStart={(e) => captureTask(e, _id)}
              >
                {text}
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
