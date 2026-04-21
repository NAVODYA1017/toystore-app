
package que;
public class Queue {

    int QueueSize;
    int front;
    int rear;
    int QueueArray[];

    Queue(int QueueSize){
        this.QueueSize = QueueSize;
        QueueArray = new int[QueueSize];
        front = -1;
        rear = -1;
    }

    public boolean isFull(){   // check queue is full
        return rear == QueueSize - 1;
    }

    public boolean isEmpty(){  // check queue is empty
        return front == -1 || front > rear;
    }

    public void enqueue(int data){

        if(isFull()){
            System.out.println("Queue is full");
        }else{
            if(front == -1){
                front = 0;
            }
            QueueArray[++rear] = data;
        }

    }

    public int dequeue(){

        if(isEmpty()){
            System.out.println("Queue is empty");
            return -1;
        }else{
            return QueueArray[front++];
        }

    }

    public void display(){

        if(isEmpty()){
            System.out.println("Queue is empty");
        }else{
            for(int i = front; i <= rear; i++){
                System.out.print(QueueArray[i] + " ");
            }
        }

    }

}