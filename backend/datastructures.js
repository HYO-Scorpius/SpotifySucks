module.exports = {

    Queue: class Queue {
        data = [];

        
        set enqueue(element) {
            this.data.append(element);
        }

        get dequeue() {
            if (this.data.length > 0) { return this.data.shift; }
            else { return undefined; }
        }

    }
};