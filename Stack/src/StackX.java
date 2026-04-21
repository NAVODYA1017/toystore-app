
import java.util.Scanner;

public class StackX {
    public static void main(String[] args){

        Scanner input = new Scanner(System.in);

        System.out.println("Enter the stack size");
        int size = input.nextInt();

        Stack stack1 = new Stack(size);
        Stack stack2 = new Stack(size);
        System.out.println("Enter the top element");
        for(int i = 1; i <= size; i++){
            int ele = input.nextInt();

            stack1.push(ele);

        }
        Stack tempStack = new Stack(size);
        while(!stack1.isEmpty()){
            int temp = stack1.pop();
            int j = temp%2;
            if(j==0 ){
                stack2.push(temp);
            }
            else{
                tempStack.push(temp);
            }
        }

        while(!tempStack.isEmpty()){
            stack1.push(tempStack.pop());
        }

        System.out.println("Stack1 after pushing");
        while(!stack1.isEmpty()){
            System.out.print(stack1.pop()+" ");
        }
        System.out.println("Stack1 after pushing");
        while(!stack2.isEmpty()){
            System.out.print(stack2.pop()+" ");
        }




    }
}