// Programming II (Java), from the "Programming II — Test Prep" notes (Moodle practice tasks + last test and practice set).
// kind "code" with lang "java": the student types Java and Check looks for the parts a correct answer needs
// (`checks`: { label, re }; see src/code/java.js). `solution` is shown on request and is verified by index.test.js.
const c = (label, re) => ({ label, re })
const week1 = { subject: 'prog2', week: 1, topic: 'j-basics', kind: 'code', lang: 'java' }
const week2 = { subject: 'prog2', week: 2, topic: 'j-test', kind: 'code', lang: 'java' }
const mc = { subject: 'prog2', kind: 'mcq' }

export const topics = { 'j-basics': 'Java foundations', 'j-test': 'Java test-level tasks', 'j-concepts': 'Java concepts' }

export const learn = [
  { subject: 'prog2', week: 1, topic: 'j-basics', title: '== vs .equals()',
    text: '== on Strings compares memory addresses (references), not content, because String is a reference type. It compiles fine but can be false even when the text is the same. For primitives (int, double, boolean, char) == compares the values. Use s1.equals(s2) for Strings.',
    code: 'if (s1.equals(s2)) { System.out.println("Same"); }   // Strings\nif (i1 == i2)      { System.out.println("Same"); }   // ints' },
  { subject: 'prog2', week: 1, topic: 'j-basics', title: 'Method signature and conditional order',
    text: 'public static int sumTwo(int x, int y): visibility, static, return type, name, parameter list. void returns nothing; return sends a value back and leaves the method. In an if / else if chain, check the error or widest case first, then go from the highest threshold down, so branches do not swallow each other.',
    code: 'if (points < 0 || points > 30) return -1;\nelse if (points >= 20) return 3;\nelse if (points >= 10) return 2;\nelse if (points >= 5)  return 1;\nelse return 0;' },
  { subject: 'prog2', week: 2, topic: 'j-test', title: 'Abstract class, interface, instanceof',
    text: 'An abstract class cannot be instantiated; it can have constructors, fields and both implemented and abstract methods. An interface is a pure contract. A class extends one class but implements many interfaces. super(...) must be the first line of a constructor. To use instanceof against unrelated types, first widen the element to Object.',
    code: 'Object o = vList.get(i);\nif (o instanceof Bicycle) bicycleCount++;\nif (o instanceof hasEngine) hasEngineCount++;' },
  { subject: 'prog2', week: 2, topic: 'j-test', title: 'Threads: join() and synchronized',
    text: 'join() blocks the calling thread until the target thread finishes, so start() then join() runs threads one after another. A race condition is shared mutable state plus a concurrent read-modify-write (balance += x is not atomic). Make the method synchronized so only one thread at a time can run it on that object.',
    code: 'thread1.start();\nthread1.join();      // main waits here\n\npublic synchronized boolean transfer(BankAccount ba) { ... }' },
]

export const questions = [
  // ---------- Week 1: foundations ----------
  { ...week1, id: 'j-1', title: 'Variables and data types',
    prompt: ['Inside main, declare: int years = 5, double val = 5.5, String name = "Luis", boolean boiling = false.', 'Then declare double temperature as val * 10 and int age as years + 1, and print all six variables with System.out.println.'],
    starter: 'public static void main(String[] args) {\n    // TODO\n\n}',
    checks: [c('int years = 5;', /int years\s*=\s*5\s*;/), c('double val = 5.5;', /double val\s*=\s*5\.5\s*;/), c('String name = "Luis";', /String name\s*=\s*"Luis"\s*;/), c('boolean boiling = false;', /boolean boiling\s*=\s*false\s*;/),
      c('double temperature = val * 10;', /double temperature\s*=\s*val\s*\*\s*10\s*;/), c('int age = years + 1;', /int age\s*=\s*years\s*\+\s*1\s*;/),
      c('Six System.out.println calls', /(System\.out\.println\([^;]*\)\s*;.*){6}/)],
    solution: `public static void main(String[] args) {
    int years = 5;
    double val = 5.5;
    String name = "Luis";
    boolean boiling = false;
    double temperature = val * 10;
    int age = years + 1;

    System.out.println(years);
    System.out.println(val);
    System.out.println(name);
    System.out.println(boiling);
    System.out.println(temperature);
    System.out.println(age);
}` },
  { ...week1, id: 'j-2', title: 'sameOrNot: == vs .equals()',
    prompt: ['Write two methods. sameOrNot1(String s1, String s2) prints "Same" if the Strings have the same content and "Not same" otherwise. sameOrNot2(int i1, int i2) does the same for ints.', 'Both are public void and not static.'],
    starter: 'public void sameOrNot1(String s1, String s2) {\n    // TODO\n}\n\npublic void sameOrNot2(int i1, int i2) {\n    // TODO\n}',
    checks: [c('sameOrNot1 takes two Strings', /public void sameOrNot1\(\s*String s1\s*,\s*String s2\s*\)/), c('sameOrNot1 compares with .equals()', /s1\.equals\(\s*s2\s*\)/), c('sameOrNot2 takes two ints', /public void sameOrNot2\(\s*int i1\s*,\s*int i2\s*\)/), c('sameOrNot2 compares with ==', /i1\s*==\s*i2/),
      c('Prints "Same"', /println\(\s*"Same"\s*\)/), c('Prints "Not same"', /println\(\s*"Not same"\s*\)/), c('Does not compare Strings with ==', /^(?!.*s1\s*==\s*s2)/)],
    solution: `public void sameOrNot1(String s1, String s2) {
    if (s1.equals(s2)) {
        System.out.println("Same");
    } else {
        System.out.println("Not same");
    }
}

public void sameOrNot2(int i1, int i2) {
    if (i1 == i2) {
        System.out.println("Same");
    } else {
        System.out.println("Not same");
    }
}` },
  { ...week1, id: 'j-3', title: 'sumThree and average',
    prompt: ['Write public static int sumThree(int a, int b, int c) that returns the sum, and public static double average(double a, double b, double c) that returns the average.', 'In main, call both (5, 10, 20 and 5.1, 5.2, 5.3) and print the results.'],
    starter: 'public static int sumThree(int a, int b, int c) {\n    // TODO\n}\n\npublic static double average(double a, double b, double c) {\n    // TODO\n}\n\npublic static void main(String[] args) {\n    // TODO\n}',
    checks: [c('sumThree returns a + b + c', /return\s*a\s*\+\s*b\s*\+\s*c\s*;/), c('average divides the sum by 3', /return\s*\(\s*a\s*\+\s*b\s*\+\s*c\s*\)\s*\/\s*3(\.0)?\s*;/), c('main calls sumThree(5, 10, 20)', /sumThree\(\s*5\s*,\s*10\s*,\s*20\s*\)/), c('main calls average(5.1, 5.2, 5.3)', /average\(\s*5\.1\s*,\s*5\.2\s*,\s*5\.3\s*\)/), c('Prints the results', /System\.out\.println\(/)],
    solution: `public static int sumThree(int a, int b, int c) {
    return a + b + c;
}

public static double average(double a, double b, double c) {
    return (a + b + c) / 3;
}

public static void main(String[] args) {
    int sum3 = sumThree(5, 10, 20);
    System.out.println(sum3);

    double avg = average(5.1, 5.2, 5.3);
    System.out.println(avg);
}` },
  { ...week1, id: 'j-4', title: 'findScore',
    prompt: ['Write public static void findScore(int a, int b, int c). Add the three numbers, then print:', 'sum > 20: "Out of bounds"\n10 to 20: "High"\n5 to 9: "Moderate"\nbelow 5: "Low"', 'findScore(4, 6, 0) prints High, findScore(10, 10, 10) prints Out of bounds.'],
    starter: 'public static void findScore(int a, int b, int c) {\n    // TODO\n}',
    checks: [c('Adds the three numbers', /a\s*\+\s*b\s*\+\s*c/), c('Checks sum > 20 first', /if\s*\(\s*\w+\s*>\s*20\s*\)/), c('Uses else if', /else if/), c('Checks >= 10 and >= 5', />=\s*10[\s\S]*>=\s*5/), c('Prints all four messages', /"Out of bounds"[\s\S]*"High"[\s\S]*"Moderate"[\s\S]*"Low"/)],
    solution: `public static void findScore(int a, int b, int c) {
    int sum = a + b + c;
    if (sum > 20) {
        System.out.println("Out of bounds");
    } else if (sum >= 10) {
        System.out.println("High");
    } else if (sum >= 5) {
        System.out.println("Moderate");
    } else {
        System.out.println("Low");
    }
}` },
  { ...week1, id: 'j-5', title: 'Quadrant',
    prompt: ['Write public static int Quadrant(int x, int y). Return 0 if x or y is 0 (on an axis), otherwise the quadrant 1 to 4:', '1: x > 0, y > 0\n2: x < 0, y > 0\n3: x < 0, y < 0\n4: x > 0, y < 0'],
    starter: 'public static int Quadrant(int x, int y) {\n    // TODO\n}',
    checks: [c('Checks x == 0 || y == 0 first', /x\s*==\s*0\s*\|\|\s*y\s*==\s*0/), c('Combines two conditions with &&', /&&/), c('Returns 0, 1, 2, 3 and 4', /return\s*0[\s\S]*return\s*1[\s\S]*return\s*2[\s\S]*return\s*3[\s\S]*return\s*4/), c('Uses else if', /else if/)],
    solution: `public static int Quadrant(int x, int y) {
    if (x == 0 || y == 0) {
        return 0;
    } else if (x > 0 && y > 0) {
        return 1;
    } else if (x < 0 && y > 0) {
        return 2;
    } else if (x < 0 && y < 0) {
        return 3;
    } else { // x > 0 && y < 0
        return 4;
    }
}` },
  { ...week1, id: 'j-6', title: 'Repetitions: while and for',
    prompt: ['Write greetings(int howmany) with a while loop that prints "Greetings!" howmany times, and greet(String greeting, int howmany) with a for loop that prints greeting howmany times. Both are public static void.'],
    starter: 'public static void greetings(int howmany) {\n    // TODO (while)\n}\n\npublic static void greet(String greeting, int howmany) {\n    // TODO (for)\n}',
    checks: [c('greetings uses a while loop', /greetings\(\s*int howmany\s*\)[^}]*while\s*\(/), c('The while loop starts a counter at 0', /int i\s*=\s*0\s*;[^}]*while/), c('The while loop increments the counter', /while[^}]*i\+\+|while[^}]*i\s*\+=\s*1|while[^}]*i\s*=\s*i\s*\+\s*1/), c('Prints "Greetings!"', /println\(\s*"Greetings!"\s*\)/), c('greet uses a for loop', /greet\(\s*String greeting\s*,\s*int howmany\s*\)[^}]*for\s*\(/), c('The for loop prints greeting', /println\(\s*greeting\s*\)/)],
    solution: `public static void greetings(int howmany) {
    int i = 0;
    while (i < howmany) {
        System.out.println("Greetings!");
        i++;
    }
}

public static void greet(String greeting, int howmany) {
    for (int i = 0; i < howmany; i++) {
        System.out.println(greeting);
    }
}` },

  // ---------- Week 2: test level ----------
  { ...week2, id: 'j-7', title: 'getGrade and maxGrade',
    prompt: ['Write public int getGrade(int points): below 0 or above 30 returns -1 (error); 0 to 4 returns 0; 5 to 9 returns 1; 10 to 19 returns 2; 20 to 30 returns 3.', 'Then write public int maxGrade(int[] points) that returns the highest grade of all the points, using getGrade.'],
    starter: 'public int getGrade(int points) {\n    // TODO\n}\n\npublic int maxGrade(int[] points) {\n    // TODO\n}',
    checks: [c('Error case first: points < 0 || points > 30 returns -1', /points\s*<\s*0\s*\|\|\s*points\s*>\s*30\)\s*\{\s*return\s*-1/), c('Thresholds from the highest down (>= 20, >= 10, >= 5)', />=\s*20[\s\S]*>=\s*10[\s\S]*>=\s*5/), c('Returns 3, 2, 1 and 0', /return\s*3[\s\S]*return\s*2[\s\S]*return\s*1[\s\S]*return\s*0/), c('maxGrade loops over the array', /maxGrade\(\s*int\[\]\s*points\s*\)[\s\S]*for\s*\(/), c('maxGrade calls getGrade', /maxGrade[\s\S]*getGrade\(\s*points\[\s*i\s*\]\s*\)/), c('Keeps the highest in a variable and returns it', /grade\s*>\s*max|max\s*<\s*grade|Math\.max/), c('Starts max low (Integer.MIN_VALUE or -1)', /int max\s*=\s*(Integer\.MIN_VALUE|-1)/), c('Returns max', /return\s*max\s*;/)],
    solution: `public int getGrade(int points) {
    if (points < 0 || points > 30) {
        return -1;
    } else if (points >= 20) {
        return 3;
    } else if (points >= 10) {
        return 2;
    } else if (points >= 5) {
        return 1;
    } else {
        return 0;
    }
}

public int maxGrade(int[] points) {
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < points.length; i++) {
        int grade = getGrade(points[i]);
        if (grade > max) {
            max = grade;
        }
    }
    return max;
}` },
  { ...week2, id: 'j-8', title: 'Class Country',
    prompt: ['Write the class Country with three fields: name (String), currency (String) and population (int), with the correct visibility.', 'Two constructors: one without arguments that sets "None", "None" and 0, and one that takes all three values.', 'And a method getDescription() that returns, for example: Finland\'s currency is Euro and population is 5500000'],
    starter: 'public class Country {\n    // TODO\n}',
    checks: [c('Private fields name, currency, population', /private String name\s*;[\s\S]*private String currency\s*;[\s\S]*private int population\s*;/), c('No-argument constructor', /public Country\(\s*\)/), c('Defaults "None", "None" and 0', /"None"[\s\S]*"None"[\s\S]*=\s*0\s*;/), c('Constructor with String, String, int', /public Country\(\s*String \w+\s*,\s*String \w+\s*,\s*int \w+\s*\)/), c('Uses this. to set the fields', /this\.name\s*=[\s\S]*this\.currency\s*=[\s\S]*this\.population\s*=/), c('getDescription returns a String', /public String getDescription\(\s*\)/), c('Builds the text with + and the text parts', /return\s*name\s*\+\s*"'s currency is "\s*\+\s*currency\s*\+\s*" and population is "\s*\+\s*population\s*;/)],
    solution: `public class Country {
    private String name;
    private String currency;
    private int population;

    public Country() {
        this.name = "None";
        this.currency = "None";
        this.population = 0;
    }

    public Country(String n, String c, int p) {
        this.name = n;
        this.currency = c;
        this.population = p;
    }

    public String getDescription() {
        return name + "'s currency is " + currency + " and population is " + population;
    }
}` },
  { ...week2, id: 'j-9', title: 'Client code for a given class',
    prompt: ['You may not change the class Color. It has a constructor Color(String name, String feelings), a constructor Color() and a method printInformation().', 'In main of class Testing, create c1 as ("Green", "Happy,Cheerful,Proud"), c2 with no arguments and c3 as ("Blue", "Stunned,Confused,Amazed,Speechless"). Then call printInformation() on each.'],
    starter: 'public class Testing {\n    public static void main(String[] args) {\n        // TODO\n    }\n}',
    checks: [c('c1 = new Color("Green", "Happy,Cheerful,Proud")', /Color c1\s*=\s*new Color\(\s*"Green"\s*,\s*"Happy,Cheerful,Proud"\s*\)\s*;/), c('c2 = new Color()', /Color c2\s*=\s*new Color\(\s*\)\s*;/), c('c3 = new Color("Blue", "Stunned,Confused,Amazed,Speechless")', /Color c3\s*=\s*new Color\(\s*"Blue"\s*,\s*"Stunned,Confused,Amazed,Speechless"\s*\)\s*;/), c('c1.printInformation()', /c1\.printInformation\(\s*\)\s*;/), c('c2.printInformation()', /c2\.printInformation\(\s*\)\s*;/), c('c3.printInformation()', /c3\.printInformation\(\s*\)\s*;/)],
    solution: `public class Testing {
    public static void main(String[] args) {
        Color c1 = new Color("Green", "Happy,Cheerful,Proud");
        Color c2 = new Color();
        Color c3 = new Color("Blue", "Stunned,Confused,Amazed,Speechless");

        c1.printInformation();
        c2.printInformation();
        c3.printInformation();
    }
}` },
  { ...week2, id: 'j-10', title: 'Bicycle and Helicopter',
    prompt: ['The abstract class Vehicle has a protected field color, a constructor Vehicle(String col) and the abstract method getColor(). The interface hasEngine has getEngineType() and setEngineType(String s).', 'Write Bicycle (extends Vehicle, private int gears, constructor (String col, int g), getGears(), getColor()) and Helicopter (extends Vehicle, implements hasEngine, private String engineType, constructor (String col, String engine), and all the methods it must override).'],
    starter: 'class Bicycle extends Vehicle {\n    // TODO\n}\n\nclass Helicopter extends Vehicle implements hasEngine {\n    // TODO\n}',
    checks: [c('Bicycle has a private int gears', /private int gears\s*;/), c('Bicycle constructor calls super(col)', /public Bicycle\(\s*String col\s*,\s*int g\s*\)\s*\{\s*super\(\s*col\s*\)\s*;/), c('Bicycle has getGears()', /public int getGears\(\s*\)\s*\{\s*return gears\s*;/), c('Helicopter has a private String engineType', /private String engineType\s*;/), c('Helicopter constructor calls super(col) first', /public Helicopter\(\s*String col\s*,\s*String engine\s*\)\s*\{\s*super\(\s*col\s*\)\s*;/), c('Helicopter overrides getEngineType()', /public String getEngineType\(\s*\)\s*\{\s*return engineType\s*;/), c('Helicopter overrides setEngineType(String)', /public void setEngineType\(\s*String s\s*\)\s*\{\s*this\.engineType\s*=\s*s\s*;/), c('Both override getColor()', /public String getColor\(\s*\)[\s\S]*public String getColor\(\s*\)/)],
    solution: `class Bicycle extends Vehicle {
    private int gears;

    public Bicycle(String col, int g) {
        super(col);
        this.gears = g;
    }

    public int getGears() {
        return gears;
    }

    @Override
    public String getColor() {
        return color;
    }
}

class Helicopter extends Vehicle implements hasEngine {
    private String engineType;

    public Helicopter(String col, String engine) {
        super(col);
        this.engineType = engine;
    }

    @Override
    public String getColor() {
        return color;
    }

    @Override
    public String getEngineType() {
        return engineType;
    }

    @Override
    public void setEngineType(String s) {
        this.engineType = s;
    }
}` },
  { ...week2, id: 'j-11', title: 'vehicleIterator (instanceof)',
    prompt: ['In class MyApp write public void vehicleIterator(ArrayList<Vehicle> vList). Count how many elements are Vehicle, Bicycle, Helicopter and hasEngine, then print "Vehicles:n", "Bicycles:n", "Helicopters:n" and "Having engines:n" with the helper sop(String s).', 'Hint: assign each element to an Object variable first.'],
    starter: 'class MyApp {\n    public void vehicleIterator(ArrayList<Vehicle> vList) {\n        // TODO\n    }\n\n    public void sop(String s) { System.out.println(s); }\n}',
    checks: [c('Loops over vList with vList.size()', /for\s*\([^)]*vList\.size\(\s*\)/), c('Widens each element: Object o = vList.get(i)', /Object \w+\s*=\s*vList\.get\(\s*i\s*\)/), c('instanceof Vehicle', /instanceof Vehicle/), c('instanceof Bicycle', /instanceof Bicycle/), c('instanceof Helicopter', /instanceof Helicopter/), c('instanceof hasEngine', /instanceof hasEngine/), c('Prints "Vehicles:" and "Bicycles:"', /sop\(\s*"Vehicles:"[\s\S]*sop\(\s*"Bicycles:"/), c('Prints "Helicopters:" and "Having engines:"', /sop\(\s*"Helicopters:"[\s\S]*sop\(\s*"Having engines:"/)],
    solution: `class MyApp {
    public void vehicleIterator(ArrayList<Vehicle> vList) {
        int vehicleCount = 0;
        int bicycleCount = 0;
        int heliCount = 0;
        int hasEngineCount = 0;

        for (int i = 0; i < vList.size(); i++) {
            Object o = vList.get(i);   // widen to Object first

            if (o instanceof Vehicle) vehicleCount++;
            if (o instanceof Bicycle) bicycleCount++;
            if (o instanceof Helicopter) heliCount++;
            if (o instanceof hasEngine) hasEngineCount++;
        }

        sop("Vehicles:" + vehicleCount);
        sop("Bicycles:" + bicycleCount);
        sop("Helicopters:" + heliCount);
        sop("Having engines:" + hasEngineCount);
    }

    public void sop(String s) { System.out.println(s); }
}` },
  { ...week2, id: 'j-12', title: 'Threads in order with join()',
    prompt: ['main creates thread1, thread2 and thread3, each printing its own aphorism 10 times. Write the part that starts them so the output is thread1 first, then thread2, then thread3. Do not use a while(true) loop with isAlive().', 'main may declare throws InterruptedException.'],
    starter: 'public static void main(String[] args) throws InterruptedException {\n    Thread thread1 = new Thread(() -> {\n        for (int i = 0; i < 10; i++) System.out.println("Each chance is a possibility");\n    });\n    Thread thread2 = new Thread(() -> {\n        for (int i = 0; i < 10; i++) System.out.println("Tomorrow is always part of the future");\n    });\n    Thread thread3 = new Thread(() -> {\n        for (int i = 0; i < 10; i++) System.out.println("Undone things cannot be undone");\n    });\n\n    // TODO\n}',
    checks: [c('Starts and joins thread1', /thread1\.start\(\s*\)\s*;\s*thread1\.join\(\s*\)\s*;/), c('Starts and joins thread2', /thread2\.start\(\s*\)\s*;\s*thread2\.join\(\s*\)\s*;/), c('Starts and joins thread3', /thread3\.start\(\s*\)\s*;\s*thread3\.join\(\s*\)\s*;/), c('In the order 1, 2, 3', /thread1\.start[\s\S]*thread2\.start[\s\S]*thread3\.start/), c('Handles InterruptedException (throws or try/catch)', /throws InterruptedException|catch\s*\(\s*InterruptedException/), c('No busy-wait loop', /^(?!.*isAlive)/)],
    solution: `public static void main(String[] args) throws InterruptedException {
    Thread thread1 = new Thread(() -> {
        for (int i = 0; i < 10; i++) System.out.println("Each chance is a possibility");
    });
    Thread thread2 = new Thread(() -> {
        for (int i = 0; i < 10; i++) System.out.println("Tomorrow is always part of the future");
    });
    Thread thread3 = new Thread(() -> {
        for (int i = 0; i < 10; i++) System.out.println("Undone things cannot be undone");
    });

    thread1.start();
    thread1.join();   // main waits here until thread1 finishes

    thread2.start();
    thread2.join();

    thread3.start();
    thread3.join();
}` },
  { ...week2, id: 'j-13', title: 'BankAccount.transfer',
    prompt: ['BankAccount has the private fields int balance and boolean blocked. Write public boolean transfer(BankAccount ba): if this account or ba is blocked, do nothing and return false. Otherwise move all of ba\'s balance to this account (ba ends with 0) and return true.'],
    starter: 'public boolean transfer(BankAccount ba) {\n    // TODO\n}',
    checks: [c('Returns boolean and takes a BankAccount', /public boolean transfer\(\s*BankAccount ba\s*\)/), c('Checks both accounts are blocked with ||', /this\.blocked\s*\|\|\s*ba\.blocked|blocked\s*\|\|\s*ba\.blocked/), c('Returns false when blocked', /return\s*false\s*;/), c('Adds ba\'s balance to this balance', /this\.balance\s*\+=\s*ba\.balance|balance\s*\+=\s*ba\.balance|balance\s*=\s*(this\.)?balance\s*\+\s*ba\.balance/), c('Sets ba.balance to 0', /ba\.balance\s*=\s*0\s*;/), c('Returns true', /return\s*true\s*;/)],
    solution: `public boolean transfer(BankAccount ba) {
    if (this.blocked || ba.blocked) {
        return false;
    }
    this.balance += ba.balance;
    ba.balance = 0;
    return true;
}` },
  { ...week2, id: 'j-14', title: 'FundRaiser: fix the race condition',
    prompt: ['Two threads each call fundRaising.transfer(tempAcc) 10,000 times on the same BankAccount object, and the final balance is sometimes less than 20,000.', 'Write the transfer method again so the race condition cannot happen (same behaviour as before: false if either account is blocked, otherwise move the balance and return true).'],
    starter: 'public boolean transfer(BankAccount ba) {\n    if (this.blocked || ba.blocked) {\n        return false;\n    }\n    this.balance += ba.balance;\n    ba.balance = 0;\n    return true;\n}',
    checks: [c('Declared synchronized', /public synchronized boolean transfer\(\s*BankAccount ba\s*\)/), c('Still returns false when blocked', /blocked[\s\S]*return\s*false\s*;/), c('Still adds the balance and zeroes ba', /\+=\s*ba\.balance[\s\S]*ba\.balance\s*=\s*0\s*;/), c('Still returns true', /return\s*true\s*;/)],
    solution: `public synchronized boolean transfer(BankAccount ba) {
    if (this.blocked || ba.blocked) {
        return false;
    }
    this.balance += ba.balance;
    ba.balance = 0;
    return true;
}` },

  // ---------- Concept questions (also in Practice and the practice test) ----------
  { ...mc, week: 1, topic: 'j-concepts', id: 'j-q1', q: 'Two Strings s1 and s2 contain the same text. What does s1 == s2 do in Java?',
    options: ['Compares the references (memory addresses), so it can be false', 'Compares the text, so it is always true', 'Does not compile for Strings', 'Compares only the length of the Strings'],
    why: 'String is a reference type: == compares references. Use s1.equals(s2) to compare the content.' },
  { ...mc, week: 2, topic: 'j-concepts', id: 'j-q2', q: 'Why does instanceof Fruit on an ArrayList<Vehicle> element not compile, and how is it fixed?',
    options: ['Vehicle and Fruit are unrelated types; assign the element to an Object variable first', 'instanceof only works on interfaces; make Fruit an interface', 'ArrayList cannot hold objects; use an array instead', 'instanceof needs a cast to String first'],
    why: 'The compiler rejects instanceof between unrelated types ("inconvertible types"). Anything can be an Object, so the check against an Object variable compiles.' },
  { ...mc, week: 2, topic: 'j-concepts', id: 'j-q3', q: 'Two threads call transfer on the same BankAccount 10,000 times each and the final balance is wrong. What is the problem and the fix?',
    options: ['A race condition on balance += x (not atomic); make the method synchronized', 'The threads run too slowly; call join() on both before start()', 'balance must be static', 'The method must be private'],
    why: 'Shared mutable state plus a concurrent read-modify-write loses updates. synchronized lets one thread at a time run the method on that object.' },
  { subject: 'prog2', week: 2, topic: 'j-concepts', kind: 'predict', id: 'j-q4', title: 'JavaFX trace: the length of the previous output',
    code: 'tArea2.setOnKeyTyped(e -> {\n    int i1 = tfOne.getText().length();\n    int i2 = tArea2.getText().length();\n    tfOne.setText("" + (Math.pow((i1+i2), 2)));\n});\n\n// tfOne starts empty. Typing a 3-letter last name into tArea2,\n// one key at a time. Math.pow returns a double.\n// What is in tfOne at the end? Type the text you would see.',
    answers: ['49.0'],
    note: 'Math.pow returns a double, so the text is "1.0", then "25.0", then "49.0". Keystroke 1: i1=0, i2=1 gives 1.0 (length 3). Keystroke 2: i1=3, i2=2 gives 25.0 (length 4). Keystroke 3: i1=4, i2=3 gives 49.0. (The test notes show "16": they left out the ".0".)' },
]
