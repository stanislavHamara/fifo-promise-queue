import { Queue } from "./app";

function mockPromise(value, timeout = 0, fail = false) {
    return () =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                fail ? reject(new Error('Task failed')) : resolve(value);
            }, timeout);
        });
}

describe('Queue', () => {
    it('correctly processes tasks following FIFO', async () => {
        const logSpy = jest.spyOn(console, 'log');

        const testQueue = new Queue()
        const testPromise1 = mockPromise("Task 1 completed", 1000);
        const testPromise2 = mockPromise("Task 2 completed", 1500);
        const testPromise3 = mockPromise("Task 3 completed", 500, true);
        const testPromise4 = mockPromise("Task 4 completed", 500);


        console.log(await testQueue.add(testPromise1))
        console.log(await testQueue.add(testPromise2))
        await testQueue.add(testPromise3).catch(e => console.log(e.message))
        console.log(await testQueue.add(testPromise4))
      
        expect(logSpy).toHaveBeenNthCalledWith(1, "Task 1 completed");
        expect(logSpy).toHaveBeenNthCalledWith(2, "Task 2 completed");
        expect(logSpy).toHaveBeenNthCalledWith(3, "Task failed");
        expect(logSpy).toHaveBeenNthCalledWith(4, "Task 4 completed");

    })
})