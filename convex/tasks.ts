import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTasks = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tasks").collect();
    }
});

export const createTasks = mutation({
    args: { title: v.string() },
    handler: async (ctx, args) => {
        const taskID = await ctx.db.insert("tasks", { text: args.title, status: 'NEW' });
    }
})

export const updateTasks = mutation({
    args: { id: v.id("tasks"), taskStatus: v.string() },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args.id);
        await ctx.db.patch(args.id, {status: args.taskStatus});
    }
})