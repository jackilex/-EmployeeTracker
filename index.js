let mysql = require("mysql");
let inquirer = require("inquirer");
let roles=[]
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "654321",
  database: "employee_tracker"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected')
    FindRoles();
    addEmployee();
  });
  
  function runProgram(){
      let query="SELECT * FROM role"

      connection.query(query,function (error, results,){
        if (error) throw error;
        console.table(results);
        
      })
  }

  function FindRoles(){
    let query="SELECT id,title FROM role"
   
    connection.query(query,function (error, res,){
        if (error) throw error;
        
        for (let i = 0; i < res.length; i++){
            roles.push(`${res[i].title}`)    
            // 
            
        }
      })

  };
//adding empployees
  function addEmployee(){
        inquirer.prompt([
            {
                name: 'firstName',
                message: `What is the First Name of the new Employee?`,
                default: 'John',
              },
              {
                name: 'lastName',
                message: `What is the Last Name of thisEmployee?`,
                default: 'Doe',
              },
              {
                type: 'list',
                name: 'roleId',
                message: `What is the ID of this employee role?`,
                choices: roles,
              },
              {
                name: `manager`,
                message: `what is the managers' id enter nothing this employee doesn't report to no one or if it is unknown`,
                default:false
              }
    
        ]).then(answers =>{
        let sql;
        let idRole= roles.indexOf(answers.roleId) + 1;
        let idManager=parseInt(answers.manager)
        if(answers.manager){
        sql= `INSERT INTO employee (first_name,last_name, role_id,manager_id)
        VALUE ("${answers.firstName}","${answers.lastName}",${idRole},"${idManager}")`
        }
        else{
        sql= `INSERT INTO employee (first_name,last_name, role_id)
            VALUE ("${answers.firstName}","${answers.lastName}",${idRole})`
        };
        
        connection.query(sql,function (error, res){
            if (error) throw error;
          })

          }
          )
  }

//addign departments
  function addDepartment(){
    inquirer.prompt([
        {
            name: 'department',
            message: `What is the name of the department`
          }
        ]).then(answers=>{
            let sql= `INSERT INTO department(name)
            VALUE ("${answers.department}")`

            connection.query(sql,function (error, res){
                if (error) throw error;
              })
        })

  }

  function addRole(){
    inquirer.prompt([
        {
            name: 'title',
            message: `What is the title of the new role`
          },
          {
            name: 'salary',
            message: `What is the salary of the new role`
          },
          {
            name: 'department',
            message: `What department does this new role belongs to`
          }
        ]).then(answers=>{
            let sql= `INSERT INTO department(name)
            VALUE ("${answers.department}")`

            connection.query(sql,function (error, res){
                if (error) throw error;
              })
        })

  }