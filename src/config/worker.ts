import { Job, Worker } from "bullmq";
import { ProcessCustomersJob } from "../jobs/process_customers.job";
import AppDataSource from "./database";
import { Job as JobModel } from "../api/models/job";
import dotenv from "dotenv";

dotenv.config();

const initialize = async () => {
    await AppDataSource.initialize();

    const repo = AppDataSource.getRepository(JobModel)

    async function Process(job: Job) {

        const job_ref = await repo.findOneBy({ job_id: Number(job.id) })
        if (job_ref) {
            job_ref.status = 'processing';
            repo.save(job_ref);
        }

        await ProcessCustomersJob(job)
    }

    const worker = new Worker(
        "default",
        Process,
        {
            connection: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT || 6379)
            },
            concurrency: 5
        },
    );

    worker.on("completed", async (job) => {
        const job_ref = await repo.findOneBy({ job_id: Number(job.id) })
        if (job_ref) {
            job_ref.status = 'completed';
            repo.save(job_ref);
        }
    });

    worker.on("failed", async (job, error) => {
        if (!job) return;

        const job_ref = await repo.findOneBy({ job_id: Number(job.id) })
        if (job_ref) {
            job_ref.status = 'failed';
            job_ref.error = error.message;
            repo.save(job_ref);
        }
    });

    console.log("[server]: Worker inicializado.");
}
initialize();