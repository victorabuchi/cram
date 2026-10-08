// How to really run each Java exercise (with the Java runner, `npm run java`): the files to compile around the student's code,
// and the exact output a correct answer prints. index.test.js runs every reference solution through this, so the harness and the
// expected output are checked against real Java.
//   template: the file whose /*STUDENT*/ marker is replaced by the student's code (the code goes inside a class body, or is a whole class file)
//   studentFile: instead of a template, the student's code is a file of its own (classes with that name, plus the imports below)
//   main: the class to run.  files: the other files (the harness and the classes the exercise gives).
const imports = 'import java.util.*;\n'
const lines = (...l) => l.join('\n')
const ls = (n, text) => Array(n).fill(text)

const Vehicle = `abstract class Vehicle {
    protected String color;
    public Vehicle(String col) { this.color = col; }
    public abstract String getColor();
}
`
const hasEngine = `interface hasEngine {
    String getEngineType();
    void setEngineType(String s);
}
`
const Bank = `class BankAccount {
    private int balance;
    private boolean blocked;
    public BankAccount(int balance, boolean blocked) { this.balance = balance; this.blocked = blocked; }
    public int getBalance() { return balance; }
/*STUDENT*/
}
`

export const runs = {
  'j-1': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {\n/*STUDENT*/\n}\n` },
    expect: lines('5', '5.5', 'Luis', 'false', '55.0', '6') },
  'j-2': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {
/*STUDENT*/
    public static void main(String[] args) {
        Main m = new Main();
        m.sameOrNot1(new String("hi"), new String("hi"));
        m.sameOrNot1("a", "b");
        m.sameOrNot2(3, 3);
        m.sameOrNot2(3, 4);
    }
}
` },
    expect: lines('Same', 'Not same', 'Same', 'Not same') },
  'j-3': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {\n/*STUDENT*/\n}\n` },
    note: 'Your own main is run. It must print the sum 35 and then the average 5.2.',
    expect: lines('35', '5.2') },
  'j-4': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {
/*STUDENT*/
    public static void main(String[] args) {
        findScore(4, 6, 0);
        findScore(10, 10, 10);
        findScore(2, 2, 2);
        findScore(1, 1, 1);
        findScore(20, 0, 0);
        findScore(21, 0, 0);
        findScore(5, 0, 0);
        findScore(4, 0, 0);
    }
}
` },
    expect: lines('High', 'Out of bounds', 'Moderate', 'Low', 'High', 'Out of bounds', 'Moderate', 'Low') },
  'j-5': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {
/*STUDENT*/
    public static void main(String[] args) {
        int[][] points = { {1, 1}, {-1, 1}, {-1, -1}, {1, -1}, {0, 5}, {3, 0}, {0, 0} };
        for (int[] p : points) System.out.println(Quadrant(p[0], p[1]));
    }
}
` },
    expect: lines('1', '2', '3', '4', '0', '0', '0') },
  'j-6': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {
/*STUDENT*/
    public static void main(String[] args) {
        greetings(2);
        greetings(0);
        greet("Hello", 3);
    }
}
` },
    expect: lines('Greetings!', 'Greetings!', 'Hello', 'Hello', 'Hello') },
  'j-7': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {
/*STUDENT*/
    public static void main(String[] args) {
        Main m = new Main();
        int[] tests = {-1, 0, 4, 5, 9, 10, 19, 20, 30, 31};
        for (int t : tests) System.out.println(m.getGrade(t));
        System.out.println(m.maxGrade(new int[]{0, 5, 12}));
        System.out.println(m.maxGrade(new int[]{-1, 31}));
        System.out.println(m.maxGrade(new int[]{25, 3}));
    }
}
` },
    expect: lines('-1', '0', '0', '1', '1', '2', '2', '3', '3', '-1', '2', '-1', '3') },
  'j-8': { main: 'Main', studentFile: 'Country.java',
    files: { 'Main.java': `public class Main {
    public static void main(String[] args) {
        System.out.println(new Country().getDescription());
        System.out.println(new Country("Finland", "Euro", 5500000).getDescription());
        boolean allPrivate = true;
        for (java.lang.reflect.Field f : Country.class.getDeclaredFields()) {
            if (!java.lang.reflect.Modifier.isPrivate(f.getModifiers())) allPrivate = false;
        }
        System.out.println("fields private: " + allPrivate);
        System.out.println("fields: " + Country.class.getDeclaredFields().length);
    }
}
` },
    expect: lines("None's currency is None and population is 0", "Finland's currency is Euro and population is 5500000", 'fields private: true', 'fields: 3') },
  'j-9': { main: 'Testing', studentFile: 'Testing.java',
    files: { 'Color.java': `class Color {
    private String name;
    private String feelings;
    public Color(String name, String feelings) { this.name = name; this.feelings = feelings; }
    public Color() { this("Unknown", "none"); }
    public void printInformation() { System.out.println(name + " - " + feelings); }
}
` },
    expect: lines('Green - Happy,Cheerful,Proud', 'Unknown - none', 'Blue - Stunned,Confused,Amazed,Speechless') },
  'j-10': { main: 'Main', studentFile: 'Student.java',
    files: { 'Vehicle.java': Vehicle, 'hasEngine.java': hasEngine, 'Main.java': `public class Main {
    public static void main(String[] args) {
        Bicycle b = new Bicycle("red", 21);
        System.out.println(b.getColor() + " " + b.getGears());
        Helicopter h = new Helicopter("blue", "turbine");
        System.out.println(h.getColor() + " " + h.getEngineType());
        h.setEngineType("piston");
        System.out.println(h.getEngineType());
        Vehicle v = h;
        System.out.println((v instanceof hasEngine) + " " + (b instanceof Vehicle));
    }
}
` },
    expect: lines('red 21', 'blue turbine', 'piston', 'true true') },
  'j-11': { main: 'Main', studentFile: 'MyApp.java',
    files: { 'Vehicle.java': Vehicle, 'hasEngine.java': hasEngine, 'Fleet.java': `class Bicycle extends Vehicle {
    public Bicycle(String col) { super(col); }
    public String getColor() { return color; }
}
class Helicopter extends Vehicle implements hasEngine {
    private String engine = "turbine";
    public Helicopter(String col) { super(col); }
    public String getColor() { return color; }
    public String getEngineType() { return engine; }
    public void setEngineType(String s) { engine = s; }
}
`, 'Main.java': `import java.util.ArrayList;
public class Main {
    public static void main(String[] args) {
        ArrayList<Vehicle> list = new ArrayList<>();
        list.add(new Bicycle("a"));
        list.add(new Helicopter("b"));
        list.add(new Bicycle("c"));
        new MyApp().vehicleIterator(list);
    }
}
` },
    expect: lines('Vehicles:3', 'Bicycles:2', 'Helicopters:1', 'Having engines:1') },
  'j-12': { main: 'Main', template: 'Main.java',
    files: { 'Main.java': `public class Main {
/*STUDENT*/
}
` },
    expect: lines(...ls(10, 'Each chance is a possibility'), ...ls(10, 'Tomorrow is always part of the future'), ...ls(10, 'Undone things cannot be undone')) },
  'j-13': { main: 'Main', template: 'BankAccount.java',
    files: { 'BankAccount.java': Bank, 'Main.java': `public class Main {
    public static void main(String[] args) {
        BankAccount a = new BankAccount(100, false);
        BankAccount b = new BankAccount(50, false);
        BankAccount c = new BankAccount(70, true);
        System.out.println(a.transfer(b) + " " + a.getBalance() + " " + b.getBalance());
        System.out.println(a.transfer(c) + " " + a.getBalance() + " " + c.getBalance());
        System.out.println(c.transfer(a) + " " + c.getBalance() + " " + a.getBalance());
    }
}
` },
    expect: lines('true 150 0', 'false 150 70', 'false 70 150') },
  'j-14': { main: 'Main', template: 'BankAccount.java',
    files: { 'BankAccount.java': Bank, 'Main.java': `public class Main {
    public static void main(String[] args) throws Exception {
        BankAccount fund = new BankAccount(0, false);
        Runnable collect = () -> { for (int i = 0; i < 10000; i++) fund.transfer(new BankAccount(1, false)); };
        Thread t1 = new Thread(collect);
        Thread t2 = new Thread(collect);
        t1.start(); t2.start();
        t1.join(); t2.join();
        boolean sync = java.lang.reflect.Modifier.isSynchronized(BankAccount.class.getMethod("transfer", BankAccount.class).getModifiers());
        System.out.println("synchronized: " + sync);
        System.out.println("balance: " + fund.getBalance());
    }
}
` },
    expect: lines('synchronized: true', 'balance: 20000') },
}

// The files to compile for one exercise and the student's code.
export function buildFiles(run, code) {
  const files = { ...run.files }
  if (run.studentFile) files[run.studentFile] = imports + code
  else files[run.template] = imports + files[run.template].replace('/*STUDENT*/', () => code)
  return files
}
