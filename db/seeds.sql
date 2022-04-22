INSERT INTO department(department_name)
VALUES ("Accounting"),
       ("Engineer"),
       ("HR"),
       ("Legal"),
       ("Sales"),
       ("Service");

INSERT INTO employee_role(title, salary, department_id)
VALUES ("Accountant", 90000, 1),
       ("Lead Engineer", 130000, 2),
       ("Web Developer", 80000, 2),
       ("Legal Lead", 120000, 4),
       ("Legal Advisor", 100000, 4),
       ("Sales Manager", 80000, 5),
       ("Sales Associate", 50000, 5),
       ("Customer Representative", 40000, 6);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Liam", "Byrne", 5, 5),
       ("Sabine", "Callas", 6, null),
       ("Sunwoo", "Han", 7, 2),
       ("Vincent", "Fabron", 2, null),
       ("Ryo", "Kiritani", 4, null),
       ("Sasha", "Novikov", 5, 5),
       ("Ling Ying", "Wei", 3, 4);