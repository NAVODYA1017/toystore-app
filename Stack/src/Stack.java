public class Stack {

    int StackSize;
    int top;
    int StackArray[];


    Stack(int StackSize){
        this.StackSize=StackSize;

        StackArray=new int[StackSize];
        top=-1;


    }

    public boolean isFull(){ //check the stack is full
        return  StackSize==top+1;
    }

    public boolean isEmpty(){ //check stack is Empty

        return top<0;

    }



    public void push(int data){

        if(isFull()){
            System.out.println("Stack is full");
        }else{

            StackArray[++top]=data;


        }

    }

    public int pop(){

        if(isEmpty())
        {
            System.out.println("Stack is empty");
            return -1;
        }else{


            return StackArray[top--];

        }


    }

    public void display(){

        for(int i=0; i<=top; i++){
            System.out.print(StackArray[i]+" ");
        }


    }



}