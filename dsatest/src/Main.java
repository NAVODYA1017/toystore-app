import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        //System.out.printl("Hello and welcome!");

        Scanner in  = new Scanner(System.in);
        System.out.println("Enter Stack size ");
        int stackSize = in.nextInt();

        Stack stack = new Stack(stackSize);
        Stack stack2 = new Stack(stackSize);
        System.out.println("Enter Element ");


        for(int i = 1; i <= stackSize; i++){
            int ele = in.nextInt();

            stack.push(ele);

        }

        System.out.println("Enter Element you want to remove ");
        int remove = in.nextInt();

        while(!stack.isEmpty()){
            int temp = stack.pop();
            if(remove!=temp){
                stack2.push(temp);
            }


        }
        System.out.println("output");
        while(!stack2.isEmpty()){
            System.out.println(stack2.pop());
        }





    }
}