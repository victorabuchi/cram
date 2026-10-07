// Programming II (Java): the learn cards, week by week. Each card: a short explanation and a runnable-looking example.
const card = (week, topic) => (title, text, code) => ({ subject: 'prog2', week, topic, title, text, code })

const w1 = card(1, 'j-basics')
const w2 = card(2, 'j-methods')
const w3 = card(3, 'j-oop')
const w4 = card(4, 'j-inherit')
const w5 = card(5, 'j-collect')
const w6 = card(6, 'j-threads')
const w7 = card(7, 'j-fx')

export const topics = {
  'j-basics': 'Java basics',
  'j-methods': 'Methods, strings and arrays',
  'j-oop': 'Classes and objects',
  'j-inherit': 'Inheritance, abstract classes, interfaces',
  'j-collect': 'Exceptions, collections, generics, lambdas',
  'j-threads': 'Threads',
  'j-fx': 'JavaFX',
}

export const learn = [
  // ---------------- Week 1: Java basics ----------------
  w1('A Java program: class and main',
    'Every Java program lives in a class. Execution starts in the method public static void main(String[] args). The file name must match the public class name (Hello.java holds class Hello). Statements end with a semicolon; blocks use curly braces. System.out.println prints and ends the line; System.out.print does not.',
    `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello and welcome");   // prints with a new line
        System.out.print("no new line ");
        System.out.print(42);
    }
}`),
  w1('Variables and data types',
    'Declare with type name = value;. Primitive types hold the value itself: int (whole numbers), long (big whole numbers, 5L), double (decimals), float (5.5f), boolean (true/false), char (one character, single quotes \'a\'), byte, short. String is NOT a primitive: it is a class (reference type) written in double quotes. Derived variables just use already-created variables in an expression. final makes a constant.',
    `int years = 5;
double val = 5.5;
String name = "Luis";
boolean boiling = false;
char grade = 'A';
double temperature = val * 10;   // 55.0
int age = years + 1;              // 6
final double PI = 3.14159;        // cannot be changed`),
  w1('Operators and integer division',
    'Arithmetic: + - * / %. int / int is integer division and drops the decimals (7 / 2 is 3); use a double (7 / 2.0 is 3.5). % is the remainder (7 % 2 is 1). Compound assignment: += -= *= /=. ++ and -- add or subtract 1. Comparison: == != < > <= >=. Logic: && (and), || (or), ! (not). && and || stop early (short-circuit).',
    `int a = 7, b = 2;
System.out.println(a / b);        // 3   (integer division)
System.out.println(a / 2.0);      // 3.5
System.out.println(a % b);        // 1
int i = 0;
i++;  i += 5;                     // i is 6
boolean ok = a > 3 && b < 5;      // true`),
  w1('Type casting and promotion',
    'Widening (small to big type) happens automatically: int to double. Narrowing (big to small) needs an explicit cast and can lose data: (int) 3.9 is 3 (cut off, not rounded). In a mixed expression the result takes the bigger type. A char is a number underneath (\'a\' is 97).',
    `double d = 5;              // 5.0, automatic
int n = (int) 3.9;         // 3, explicit cast
int x = 10 / 4;            // 2
double y = 10 / 4;         // 2.0  (division done first as ints!)
double z = 10 / 4.0;       // 2.5
char c = (char) ('a' + 1); // 'b'`),
  w1('== vs .equals()',
    '== on Strings compares memory addresses (references), not content, because String is a reference type. It compiles fine but can silently be false even when the text matches. For primitives (int, double, boolean, char) == compares the values directly. Use s1.equals(s2) for Strings (equalsIgnoreCase to ignore case). Tests love this trick.',
    `String a = new String("hi");
String b = new String("hi");
System.out.println(a == b);        // false (different objects)
System.out.println(a.equals(b));   // true  (same content)
int i1 = 5, i2 = 5;
System.out.println(i1 == i2);      // true  (primitives)`),
  w1('Conditionals: if / else if / else',
    'Check the error or widest case first, then go from the highest threshold down, with else if so the branches do not overlap. Combine conditions with && and ||. The condition must be a boolean (no 0 or 1 like in C). An else attaches to the closest if; always use braces.',
    `public static int grade(int points) {
    if (points < 0 || points > 30) {
        return -1;                 // error case first
    } else if (points >= 20) {
        return 3;
    } else if (points >= 10) {
        return 2;
    } else if (points >= 5) {
        return 1;
    } else {
        return 0;
    }
}`),
  w1('Combining conditions: the Quadrant pattern',
    'Check the boundary or edge case first (x == 0 || y == 0), then use && to combine two conditions for each region. The last else needs no condition: it is whatever is left.',
    `public static int Quadrant(int x, int y) {
    if (x == 0 || y == 0) return 0;
    else if (x > 0 && y > 0) return 1;
    else if (x < 0 && y > 0) return 2;
    else if (x < 0 && y < 0) return 3;
    else return 4;                 // x > 0 && y < 0
}`),
  w1('switch',
    'switch picks a branch by the value of an int, char, String or enum. Each case ends with break, otherwise it falls through to the next case. default runs when nothing matched. The newer arrow form (case X ->) does not fall through and can give a value.',
    `switch (day) {
    case 1: System.out.println("Mon"); break;
    case 2: System.out.println("Tue"); break;
    default: System.out.println("Other");
}

String name = switch (day) {       // arrow form
    case 1 -> "Mon";
    case 2 -> "Tue";
    default -> "Other";
};`),
  w1('Loops: while, do-while and for',
    'for is natural when the number of repetitions is known: for (init; condition; update). while needs the init before the loop and the update inside it; forgetting either gives an infinite loop or a loop that never runs. do-while runs the body at least once, then checks. break leaves the loop, continue skips to the next round.',
    `int i = 0;
while (i < 3) {                    // init before, update inside
    System.out.println("Greetings!");
    i++;
}

for (int j = 0; j < 3; j++) {      // init; condition; update
    System.out.println(j);
}

do { System.out.println("once"); } while (false);

for (int k = 0; k < 10; k++) {
    if (k == 2) continue;          // skip 2
    if (k == 5) break;             // stop at 5
}`),
  w1('Nested loops and common loop patterns',
    'A loop inside a loop: the inner one runs completely for every round of the outer one. Typical patterns: sum (start at 0, add), count (start at 0, +1 when a condition holds), max/min (start at the first element or Integer.MIN_VALUE / MAX_VALUE).',
    `for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.print("*");
    }
    System.out.println();          // *  **  ***
}

int sum = 0, count = 0;
for (int n = 1; n <= 10; n++) {
    sum += n;
    if (n % 2 == 0) count++;       // sum 55, count 5
}`),
  w1('Reading input with Scanner',
    'Scanner reads from the keyboard (System.in) or a file. nextInt, nextDouble, next (one word), nextLine (whole line). After nextInt the line break is still waiting: call nextLine() once to clear it before reading a line. Close the scanner when done.',
    `import java.util.Scanner;

Scanner in = new Scanner(System.in);
System.out.print("Name: ");
String name = in.nextLine();
System.out.print("Age: ");
int age = in.nextInt();
System.out.println(name + " is " + age);
in.close();`),

  // ---------------- Week 2: methods, strings, arrays ----------------
  w2('Methods: declaring, calling, returning',
    'Signature: visibility, static, return type, name, parameter list. void returns nothing. return sends a value back and leaves the method immediately. Parameters are copies of the arguments (primitives) or copies of the reference (objects). A static method belongs to the class and can be called without an object; a non-static method needs an object.',
    `public static int sumThree(int a, int b, int c) {
    return a + b + c;
}

public static double average(double a, double b, double c) {
    return (a + b + c) / 3;
}

public static void main(String[] args) {
    int sum3 = sumThree(5, 10, 20);        // 35
    double avg = average(5.1, 5.2, 5.3);
    System.out.println(sum3 + " " + avg);
}`),
  w2('Overloading and scope',
    'Overloading: several methods with the same name but different parameter lists (type, number or order). The return type alone does not count. A variable lives only inside the block where it is declared. A local variable and a parameter cannot have the same name in one method.',
    `static int add(int a, int b)          { return a + b; }
static double add(double a, double b) { return a + b; }
static int add(int a, int b, int c)   { return a + b + c; }

add(1, 2);        // 3      first version
add(1.5, 2.5);    // 4.0    second version`),
  w2('Recursion',
    'A method that calls itself. It needs a base case (stops the recursion) and a step that moves toward it. Without a base case you get a StackOverflowError.',
    `static int factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // step
}
// factorial(4) = 4 * 3 * 2 * 1 = 24

static int fib(int n) {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
}`),
  w2('Strings',
    'Strings are immutable: methods return a new String, the original does not change. Common methods: length(), charAt(i), substring(from, to) (to is excluded), indexOf, contains, startsWith, endsWith, toUpperCase, toLowerCase, trim, replace, split, equals, equalsIgnoreCase, compareTo, isEmpty. + joins Strings; an int is converted automatically.',
    `String s = "Hello World";
s.length();                // 11
s.charAt(0);               // 'H'
s.substring(0, 5);         // "Hello"
s.indexOf("World");        // 6
s.toUpperCase();           // "HELLO WORLD"
s.split(" ");              // ["Hello", "World"]
s.replace('l', 'L');       // "HeLLo WorLd"
"Age: " + 5 + 1;           // "Age: 51"  (left to right!)
"x".equals("X");           // false
String.valueOf(42);        // "42"
Integer.parseInt("42");    // 42`),
  w2('StringBuilder, String.format and text blocks',
    'Building a String in a loop with + creates many objects; StringBuilder changes one buffer (append, insert, reverse, toString). String.format and printf use placeholders: %d int, %f / %.2f double, %s String, %n new line.',
    `StringBuilder sb = new StringBuilder();
for (int i = 0; i < 3; i++) sb.append(i).append(",");
System.out.println(sb);                  // 0,1,2,
System.out.printf("%s is %d and %.1f%n", "Ann", 20, 1.756);
// Ann is 20 and 1.8`),
  w2('Arrays',
    'A fixed-size sequence of one type, indexes start at 0, length is a field (no parentheses). Default values: 0, 0.0, false, null. An index outside 0..length-1 throws ArrayIndexOutOfBoundsException. Arrays are objects: assigning copies the reference, not the content.',
    `int[] points = new int[5];            // 0 0 0 0 0
int[] nums = {4, 8, 15, 16};
nums[0] = 9;
System.out.println(nums.length);      // 4

for (int i = 0; i < nums.length; i++) {      // index loop
    System.out.println(nums[i]);
}
for (int n : nums) {                         // for-each
    System.out.println(n);
}

int max = Integer.MIN_VALUE;                 // find the maximum
for (int n : nums) if (n > max) max = n;`),
  w2('Arrays: helpers, copying and 2D arrays',
    'java.util.Arrays: toString, sort, fill, copyOf, equals. int[] b = a only copies the reference; use Arrays.copyOf or clone for a real copy. A 2D array is an array of arrays: grid[row][col].',
    `import java.util.Arrays;

int[] a = {3, 1, 2};
Arrays.sort(a);                        // [1, 2, 3]
System.out.println(Arrays.toString(a));
int[] copy = Arrays.copyOf(a, a.length);

int[][] grid = new int[2][3];          // 2 rows, 3 columns
grid[1][2] = 7;
for (int r = 0; r < grid.length; r++)
    for (int c = 0; c < grid[r].length; c++)
        System.out.print(grid[r][c] + " ");`),
  w2('Passing arguments: primitives vs objects',
    'Java is always pass by value. A primitive argument is copied, so the method cannot change the caller\'s variable. An object argument passes a copy of the reference: the method can change the object it points to (arrays, lists), but reassigning the parameter does not affect the caller.',
    `static void bump(int n)        { n++; }          // caller unchanged
static void fill(int[] a)      { a[0] = 99; }    // caller sees it
static void swapRef(int[] a)   { a = new int[]{1}; }  // caller unchanged

int x = 1;  bump(x);                 // x is 1
int[] arr = {0};  fill(arr);         // arr[0] is 99`),
  w2('Math and random numbers',
    'Math.abs, Math.pow(a, b) (a double!), Math.sqrt, Math.max, Math.min, Math.round, Math.floor, Math.ceil. Math.random() gives a double from 0 up to (not including) 1. java.util.Random gives nextInt(bound): 0 to bound-1.',
    `Math.pow(3, 2);                // 9.0 (a double, so it prints 9.0)
Math.sqrt(16);                 // 4.0
Math.round(2.5);               // 3
int dice = (int) (Math.random() * 6) + 1;       // 1..6
int r = new java.util.Random().nextInt(10);     // 0..9`),

  // ---------------- Week 3: classes and objects ----------------
  w3('Classes, objects and constructors',
    'A class is the blueprint, an object is one thing built from it with new. Fields hold the state, methods the behaviour. Make fields private (encapsulation). A constructor has the class name and no return type. Always write a no-argument constructor that sets sensible defaults, plus one that takes all the values. this refers to the current object. If you write no constructor, Java adds an empty one; as soon as you write one, it does not.',
    `public class Country {
    private String name;
    private String currency;
    private int population;

    public Country() {                       // no-argument: defaults
        this.name = "None";
        this.currency = "None";
        this.population = 0;
    }

    public Country(String n, String c, int p) {   // all values
        this.name = n;
        this.currency = c;
        this.population = p;
    }

    public String getDescription() {
        return name + "'s currency is " + currency + " and population is " + population;
    }
}`),
  w3('Using a class: creating objects and calling methods',
    '"Given class, write client code" tasks test whether you can read a constructor signature and match the arguments (order and type), and whether you remember to call the method afterwards. Variables of a class type hold a reference; two variables can point to the same object. null means no object: calling a method on it throws NullPointerException.',
    `public class Testing {
    public static void main(String[] args) {
        Color c1 = new Color("Green", "Happy,Cheerful,Proud");
        Color c2 = new Color();
        c1.printInformation();
        c2.printInformation();

        Color c3 = c1;        // same object as c1, not a copy
        Color c4 = null;
        // c4.printInformation();   -> NullPointerException
    }
}`),
  w3('Getters, setters and visibility',
    'private: only inside the class. (none): the same package. protected: the same package and subclasses. public: everywhere. Keep fields private and give controlled access with getters (getX) and setters (setX), where the setter can check the value. Private is per class, not per object: a method can read the private fields of another object of the same class.',
    `private int balance;

public int getBalance() { return balance; }

public void setBalance(int balance) {
    if (balance >= 0) this.balance = balance;     // validate
}

public boolean transfer(BankAccount ba) {         // reads ba.balance directly
    if (this.blocked || ba.blocked) return false;
    this.balance += ba.balance;
    ba.balance = 0;
    return true;
}`),
  w3('static members and constants',
    'A static field or method belongs to the class itself, shared by all objects. Use it through the class name (Math.max, Counter.count). A static method cannot use this or non-static fields directly. static final makes a constant.',
    `public class Counter {
    private static int count = 0;            // one copy for all objects
    public static final int MAX = 100;       // constant

    public Counter() { count++; }
    public static int getCount() { return count; }
}
new Counter(); new Counter();
Counter.getCount();                          // 2`),
  w3('toString, equals and hashCode',
    'Every class extends Object. toString() is what println and + use to turn the object into text; override it. The default equals compares references, just like ==; override equals to compare content (and hashCode with it, equal objects must give the same hash). equals takes an Object, so check the type first.',
    `public class Point {
    private int x, y;
    public Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public String toString() { return "(" + x + ", " + y + ")"; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() { return java.util.Objects.hash(x, y); }
}`),
  w3('Enums, wrapper classes and null',
    'An enum is a fixed set of named values. Wrapper classes (Integer, Double, Boolean, Character) turn a primitive into an object, which collections need; boxing and unboxing are automatic. Compare wrappers with equals, not ==. Optional helper methods: Integer.parseInt, Integer.MAX_VALUE, Double.parseDouble.',
    `enum Level { LOW, MEDIUM, HIGH }
Level l = Level.HIGH;
if (l == Level.HIGH) System.out.println(l);     // HIGH
for (Level v : Level.values()) System.out.println(v);

Integer boxed = 5;          // boxing
int back = boxed;           // unboxing
Integer a = 1000, b = 1000;
a.equals(b);                // true   (a == b may be false!)`),

  // ---------------- Week 4: inheritance, abstract classes, interfaces ----------------
  w4('Inheritance: extends and super',
    'A subclass extends one superclass and gets its non-private members. super(...) calls the parent constructor and must be the first line of the subclass constructor. @Override replaces a parent method; super.method() calls the parent version. Java allows only one parent class (single inheritance). final stops a class from being extended or a method from being overridden.',
    `class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public String sound() { return "..."; }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);                  // first line
    }
    @Override
    public String sound() { return "Woof"; }
}`),
  w4('Polymorphism and dynamic dispatch',
    'A variable of the parent type can hold any subclass object. Which version of an overridden method runs is decided by the real object at run time, not by the variable type. You can only call methods that exist in the variable\'s type, unless you cast.',
    `Animal a = new Dog("Rex");        // parent type, child object
System.out.println(a.sound());    // "Woof" (the Dog version runs)

Animal[] zoo = { new Dog("A"), new Animal("B") };
for (Animal z : zoo) System.out.println(z.sound());   // Woof  ...

Dog d = (Dog) a;                  // downcast: needs the cast
// Cat c = (Cat) a;   -> ClassCastException at run time`),
  w4('Abstract classes',
    'An abstract class cannot be instantiated. It can have constructors, fields, and a mix of implemented and abstract methods (no body). A subclass must implement all abstract methods, unless it is abstract too. Use it when subclasses share state and code.',
    `abstract class Vehicle {
    protected String color;
    public Vehicle(String col) { this.color = col; }
    public abstract String getColor();      // no body
}

class Bicycle extends Vehicle {
    private int gears;
    public Bicycle(String col, int g) { super(col); this.gears = g; }
    public int getGears() { return gears; }
    @Override
    public String getColor() { return color; }
}
// new Vehicle("red");   -> compile error`),
  w4('Interfaces',
    'An interface is a pure contract: method signatures (and constants), no constructor, no instance fields. A class uses implements and must implement every method (public). A class can extend ONE class but implement MANY interfaces. Interface methods may have default bodies. An interface type can be used as a variable type just like a class.',
    `interface hasEngine {
    String getEngineType();
    void setEngineType(String s);
}

class Helicopter extends Vehicle implements hasEngine {
    private String engineType;
    public Helicopter(String col, String engine) {
        super(col);
        this.engineType = engine;
    }
    @Override public String getColor() { return color; }
    @Override public String getEngineType() { return engineType; }
    @Override public void setEngineType(String s) { this.engineType = s; }
}`),
  w4('Abstract class vs interface',
    'Abstract class: shared state and code, one parent only, constructors allowed. Interface: a capability a class promises (hasEngine, Comparable, Runnable), many allowed, no fields or constructors. Both: cannot be instantiated directly, and give polymorphism (a hasEngine variable can hold any class that implements it).',
    `hasEngine h = new Helicopter("red", "turbine");   // interface type
Vehicle v = new Bicycle("blue", 21);              // abstract type
// new hasEngine();   -> compile error
// class X extends A, B   -> not allowed
// class X extends A implements I, J   -> allowed`),
  w4('instanceof and the Object-widening trick',
    'instanceof checks the real class of an object (and its parents and interfaces). The compiler refuses an instanceof between unrelated types ("inconvertible types"). Assigning the element to an Object variable first makes any instanceof compile, because everything is an Object. Often used to count types in a mixed list.',
    `public void vehicleIterator(ArrayList<Vehicle> vList) {
    int vehicles = 0, bicycles = 0, helis = 0, engines = 0;
    for (int i = 0; i < vList.size(); i++) {
        Object o = vList.get(i);                 // widen to Object first
        if (o instanceof Vehicle) vehicles++;
        if (o instanceof Bicycle) bicycles++;
        if (o instanceof Helicopter) helis++;
        if (o instanceof hasEngine) engines++;
    }
    sop("Vehicles:" + vehicles);
}`),
  w4('Inner classes, anonymous classes and generics in your own classes',
    'A class can be declared inside another class. An anonymous class implements an interface on the spot; for a single-method interface a lambda is shorter. A class can have a type parameter so one class works for many types.',
    `class Box<T> {
    private T item;
    public void set(T item) { this.item = item; }
    public T get() { return item; }
}
Box<String> b = new Box<>();
b.set("hi");

Runnable r = new Runnable() {            // anonymous class
    @Override public void run() { System.out.println("run"); }
};
Runnable r2 = () -> System.out.println("run");   // same, as a lambda`),

  // ---------------- Week 5: exceptions, collections, generics, lambdas ----------------
  w5('Exceptions: try, catch, finally',
    'An exception is an object thrown when something goes wrong. try holds the risky code, catch handles a type, finally always runs (cleanup). Catch the more specific type first. Checked exceptions (IOException, InterruptedException) must be caught or declared with throws; unchecked ones (RuntimeException: NullPointerException, ArrayIndexOutOfBoundsException, ArithmeticException, NumberFormatException) do not.',
    `try {
    int x = Integer.parseInt("abc");
} catch (NumberFormatException e) {
    System.out.println("Not a number: " + e.getMessage());
} catch (Exception e) {
    System.out.println("Something else");
} finally {
    System.out.println("always runs");
}

int[] a = new int[2];
// a[5] = 1;      -> ArrayIndexOutOfBoundsException
// 5 / 0          -> ArithmeticException`),
  w5('throw, throws and your own exceptions',
    'throw creates and throws an exception object. throws in a method signature says "this method may pass on this checked exception". A custom exception extends Exception (checked) or RuntimeException (unchecked).',
    `class NegativeAmountException extends Exception {
    public NegativeAmountException(String msg) { super(msg); }
}

void deposit(int amount) throws NegativeAmountException {
    if (amount < 0) throw new NegativeAmountException("negative: " + amount);
    balance += amount;
}

try { deposit(-5); }
catch (NegativeAmountException e) { System.out.println(e.getMessage()); }`),
  w5('Reading and writing files',
    'Use try-with-resources so the file is closed automatically. BufferedReader/FileReader read lines, PrintWriter/FileWriter write. Files.readAllLines is the short way for small files. IOException is checked: catch or declare it.',
    `import java.io.*;
import java.nio.file.*;

try (BufferedReader in = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = in.readLine()) != null) System.out.println(line);
} catch (IOException e) {
    System.out.println("Could not read: " + e.getMessage());
}

try (PrintWriter out = new PrintWriter("out.txt")) {
    out.println("hello");
}
java.util.List<String> lines = Files.readAllLines(Path.of("data.txt"));`),
  w5('ArrayList',
    'A resizable list of objects (not primitives: ArrayList<Integer>). add, get(i), set(i, x), remove(i or object), size(), contains, indexOf, isEmpty, clear. Use size() not length. The diamond <> lets Java infer the type on the right. Removing while looping with an index needs care: the indexes shift.',
    `import java.util.ArrayList;

ArrayList<String> names = new ArrayList<>();
names.add("Ann");  names.add("Bob");
names.get(0);                 // "Ann"
names.set(1, "Bea");
names.remove(0);              // removes by index
names.size();                 // 1

for (int i = 0; i < names.size(); i++) System.out.println(names.get(i));
for (String n : names) System.out.println(n);    // for-each`),
  w5('HashMap and HashSet',
    'HashMap stores key to value pairs: put, get (null if absent), containsKey, remove, keySet, values, entrySet, getOrDefault. Keys are unique. HashSet stores unique values without order: add, contains, remove. Both need equals and hashCode on your own key classes. TreeMap and TreeSet keep sorted order; LinkedHashMap keeps insertion order.',
    `import java.util.*;

Map<String, Integer> age = new HashMap<>();
age.put("Ann", 20);
age.put("Bob", 31);
age.get("Ann");                          // 20
age.getOrDefault("Zed", 0);              // 0
for (String k : age.keySet()) System.out.println(k + " " + age.get(k));

Set<Integer> seen = new HashSet<>();
seen.add(3);  seen.add(3);               // still one 3
seen.size();                             // 1

// count words
Map<String, Integer> count = new HashMap<>();
for (String w : "a b a".split(" ")) count.put(w, count.getOrDefault(w, 0) + 1);`),
  w5('Sorting: Comparable, Comparator, Collections',
    'Collections.sort(list) sorts objects that implement Comparable<T> (compareTo returns negative, 0, positive). A Comparator describes another ordering without changing the class. Also: Collections.reverse, max, min, shuffle.',
    `class Student implements Comparable<Student> {
    String name; int points;
    public int compareTo(Student o) { return Integer.compare(points, o.points); }
}
Collections.sort(students);                              // by points
students.sort(Comparator.comparing(s -> s.name));        // by name
students.sort((a, b) -> b.points - a.points);            // descending`),
  w5('Generics',
    'Generics put the element type in angle brackets (List<String>) so the compiler checks types and no casts are needed. You can write generic methods and classes with a type parameter T. Generics only work with objects, so use Integer, not int. A List<Object> is not a List<String>.',
    `List<Integer> nums = new ArrayList<>();
nums.add(5);
int first = nums.get(0);        // no cast needed
// nums.add("x");               // compile error

static <T> T firstOf(List<T> list) { return list.get(0); }`),
  w5('Lambdas and functional interfaces',
    'A lambda is a short anonymous function: (parameters) -> expression, or (parameters) -> { statements }. It can be used wherever an interface with ONE abstract method is expected (Runnable, Comparator, Function, Predicate, Consumer, and the JavaFX event handlers). Local variables used inside a lambda must be effectively final.',
    `Runnable r = () -> System.out.println("hi");
Comparator<String> byLen = (a, b) -> a.length() - b.length();
Function<Integer, Integer> twice = x -> x * 2;
Predicate<String> empty = s -> s.isEmpty();
twice.apply(4);                  // 8
empty.test("");                  // true

list.forEach(x -> System.out.println(x));
list.removeIf(x -> x < 0);`),
  w5('Streams (short tour)',
    'A stream processes a collection in steps: filter, map, sorted, then collect or reduce. It does not change the source list.',
    `List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
List<Integer> evenSquares = nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .collect(Collectors.toList());          // [4, 16, 36]
int sum = nums.stream().mapToInt(Integer::intValue).sum();   // 21`),

  // ---------------- Week 6: threads ----------------
  w6('Threads: creating and starting',
    'A thread is a separate path of execution. Create one with new Thread(runnable) (a lambda works) and start it with start() (NOT run(), which would run in the current thread). Threads run concurrently and their output can interleave in any order. The alternative is extending Thread and overriding run().',
    `Thread t = new Thread(() -> {
    for (int i = 0; i < 3; i++) System.out.println("working " + i);
});
t.start();                 // runs concurrently with main
System.out.println("main continues");

class Worker extends Thread {
    @Override public void run() { System.out.println("worker"); }
}
new Worker().start();`),
  w6('join(): enforcing order',
    'join() blocks the calling thread until the target thread has finished. A busy-wait loop while(true) with isAlive() does NOT guarantee any order. To force sequential order, start a thread and join it before starting the next. join throws InterruptedException: add throws to main or wrap in try/catch. Joining after starting all threads makes main wait for all of them while they still run in parallel.',
    `public static void main(String[] args) throws InterruptedException {
    Thread thread1 = new Thread(() -> { for (int i = 0; i < 10; i++) System.out.println(apho1); });
    Thread thread2 = new Thread(() -> { for (int i = 0; i < 10; i++) System.out.println(apho2); });

    thread1.start();
    thread1.join();     // main waits here until thread1 finishes
    thread2.start();
    thread2.join();
}`),
  w6('Race conditions',
    'Shared mutable state plus concurrent read-modify-write is a race condition. balance += x is three steps (read, add, write), not one: two threads can read the same value, and one update is silently overwritten (a "lost update"). The final result is smaller than expected and different on every run.',
    `// both threads call this on the SAME fundRaising object, 10,000 times each
public boolean transfer(BankAccount ba) {
    if (this.blocked || ba.blocked) return false;
    this.balance += ba.balance;      // read-modify-write: not atomic
    ba.balance = 0;
    return true;
}
// expected 20,000, but the result is sometimes less`),
  w6('synchronized',
    'synchronized lets only one thread at a time run the code that locks on the same object. On an instance method the lock is the object itself (this), so both threads calling it on the same fundRaising object take turns. A synchronized block locks on an object you choose; a static synchronized method locks on the class. Shared mutable state plus synchronized access is the fix to remember.',
    `public synchronized boolean transfer(BankAccount ba) {
    if (this.blocked || ba.blocked) return false;
    this.balance += ba.balance;
    ba.balance = 0;
    return true;
}

synchronized (lockObject) {          // block form
    counter++;
}`),
  w6('Deadlock, volatile, atomic and thread pools',
    'Deadlock: two threads each hold a lock the other needs and wait forever; avoid it by always taking locks in the same order. volatile makes a variable\'s changes visible to other threads (but is not atomic for counter++). AtomicInteger gives atomic increments without synchronized. ExecutorService runs tasks on a pool of threads. wait()/notify() let threads signal each other inside synchronized code.',
    `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();

ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> System.out.println("task"));
pool.shutdown();
pool.awaitTermination(1, TimeUnit.SECONDS);`),
  w6('Thread.sleep and the thread lifecycle',
    'Thread.sleep(ms) pauses the current thread and throws InterruptedException. States: new, runnable (after start), blocked/waiting (sleep, join, waiting for a lock), terminated (run finished). A thread cannot be started twice. The program ends when all non-daemon threads finish.',
    `try {
    Thread.sleep(500);         // half a second
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
t.isAlive();                   // true while it is running`),

  // ---------------- Week 7: JavaFX ----------------
  w7('JavaFX: the structure of an application',
    'A JavaFX program extends Application and overrides start(Stage primaryStage). A Stage is the window, a Scene is its content, and the scene holds a layout (a Pane such as VBox, HBox, BorderPane, GridPane) that contains the controls (Label, Button, TextField, TextArea). launch(args) starts the program. The order you pass to addAll is the order of the elements on screen.',
    `public class App extends Application {
    @Override
    public void start(Stage stage) {
        TextField tfOne = new TextField();
        tfOne.setEditable(false);
        TextArea tArea = new TextArea();
        TextArea tArea2 = new TextArea();

        VBox root = new VBox(10);
        root.getChildren().addAll(tfOne, tArea, tArea2);   // 1, 2, 3 in this order

        stage.setScene(new Scene(root, 400, 300));
        stage.setTitle("Demo");
        stage.show();
    }
    public static void main(String[] args) { launch(args); }
}`),
  w7('JavaFX events and handlers',
    'A control reports user actions as events. Attach a handler (usually a lambda) with setOnAction (button click, Enter in a TextField), setOnKeyTyped, setOnMouseClicked. A handler is only attached to the control you called it on: typing in a different control does not run it. Change the UI by calling setText and similar methods on controls.',
    `Button btn = new Button("Add");
btn.setOnAction(e -> {
    String text = input.getText();
    list.getItems().add(text);
    input.clear();
});

tArea2.setOnKeyTyped(e -> {
    int i1 = tfOne.getText().length();
    int i2 = tArea2.getText().length();
    tfOne.setText("" + Math.pow(i1 + i2, 2));
});`),
  w7('Tracing a JavaFX handler by hand',
    'Test style: no code to write, you simulate the state step by step. Watch for a handler that reads a value it also writes: the second keystroke reads the output of the first. Redo the table with the number of letters the question gives. Remember Math.pow returns a double, so "" + Math.pow(1, 2) is "1.0" (3 characters), not "1".',
    `tArea2.setOnKeyTyped: i1 = length of tfOne, i2 = length of tArea2 (after the key)
tfOne starts empty. Typing a 3-letter last name into tArea2:

key  i1  i2  (i1+i2)^2  tfOne    length
 1    0   1      1       "1.0"     3
 2    3   2     25       "25.0"    4
 3    4   3     49       "49.0"    4

Typing in tArea (element 2) changes nothing: it has no handler.
(If the question ignores the ".0" and treats the text as "1", "9", "16": i1 is
the LENGTH of the previous output, never the typed text. Check the task.)`),
  w7('JavaFX layouts and common controls',
    'VBox stacks vertically, HBox horizontally, BorderPane has top/bottom/left/right/center, GridPane places by column and row, StackPane stacks on top of each other. Common controls: Label, Button, TextField, TextArea, CheckBox, RadioButton (with ToggleGroup), ComboBox, ListView. getText/setText, isSelected, getValue read and set their values.',
    `GridPane grid = new GridPane();
grid.setHgap(10);  grid.setVgap(10);
grid.add(new Label("Name"), 0, 0);       // column 0, row 0
grid.add(new TextField(), 1, 0);

BorderPane pane = new BorderPane();
pane.setTop(new Label("Title"));
pane.setCenter(grid);

CheckBox box = new CheckBox("Agree");
box.isSelected();`),
  w7('Updating JavaFX from another thread',
    'The UI may only be changed on the JavaFX Application Thread. A background thread that wants to change a control must hand the change over with Platform.runLater. Long work (loading, sleeping) belongs in a background thread so the window does not freeze.',
    `new Thread(() -> {
    String result = slowCalculation();            // background thread
    Platform.runLater(() -> label.setText(result)); // UI thread
}).start();`),
]
