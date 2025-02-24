import { Job } from "bullmq";
import { ProcessCustomerService } from "../api/services/customer.service";

async function ProcessCustomersJob(job: Job) {
    if (!job.data)
        throw new Error('Job data inexistente.')

    const filepath = job.data;
    await ProcessCustomerService(filepath)
}

export { ProcessCustomersJob };