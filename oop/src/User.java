public class User {

    private int accNumber;
    private String name;
    private double salery;

    User(int accNumber,String name,double salery){
        this.accNumber=accNumber;
        this.name=name;
        this.salery=salery;
    }

    public void setAccNumber(int accNumber) {
        this.accNumber = accNumber;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setSalery(double salery) {
        this.salery = salery;
    }

    public int getAccNumber() {
        return accNumber;
    }
    public String getName(){
        return name;
    }
    public double getSalery (){
        return salery;
    }

    void Display() {
        System.out.println("Account Number: " + accNumber);
        System.out.println("Name: " + name);
        System.out.println("Salery: " + salery);
    }
}
