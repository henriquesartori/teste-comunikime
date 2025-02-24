import { Queue } from "bullmq";
import redis from "./redis";
import AppDataSource from "./database";
import { Job } from "../api/models/job";

const repo = AppDataSource.getRepository(Job);

const queue = new Queue('default', {
    connection: redis
})

async function addJob(name: string, data: unknown) {
    const job = await queue.add(name, data, {
        delay: 1000,
        removeOnComplete: true,
        removeOnFail: true
    });

    if (job) {
        await repo.save({
            job_id: Number(job.id),
            name,
            status: 'pending'
        })
    }
}

export { addJob }