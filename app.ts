export class Queue<T> {
    taskQueue: {
        p: () => Promise<T>,
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
    }[];
    taskRunning: boolean;
    constructor() {
        this.taskQueue = [];
        this.taskRunning = false;
    }

    async add<P extends T>(p: () => Promise<P>): Promise<P> {
        return new Promise(async (resolve, reject) => {
            this.taskQueue.push({ p, resolve, reject });
            await this.processQueue();
        });
    }

    async processQueue() {
        if (this.taskRunning) {
            return;
        }

        if (this.taskQueue.length === 0) {
            return;
        }

        const { p, resolve, reject } = this.taskQueue.shift();
        this.taskRunning = true;

        try {
            const result = await p();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.taskRunning = false;
            this.processQueue();
        }
    }
}