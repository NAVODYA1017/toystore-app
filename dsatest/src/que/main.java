package que;
import java.util.Scanner;

public class main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println("enter size of  queue");
        int n = input.nextInt();

        Queue q1 = new Queue(n);
        Queue q2 = new Queue(n);
        System.out.print("Enter a queue eliments :");

        for(int i = 0 ; i<n; i++){
            int element = input.nextInt();
            q1.enqueue(element);
        }

        while(!q1.isEmpty()){
            int temp = q1.dequeue();
            int cube = (int)Math.pow(temp,3);

            System.out.println(cube);
        }


    }
}
