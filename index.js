let mysql = require("mysql");
let inquirer = require("inquirer");


let roles=[];
let employeeIds=[];
let allDepartments=[];


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
    findRoles();
    findEmployeeId();
    findDepartments();
    runProgram();
  });
  
  function runProgram(){
    inquirer.prompt([
        {
            type:'list',
            name: 'whattodo',
            message: `What would you like to do`,
            choices:['view tables','Add employees, roles or departments','Remove emplyee department or role','update']
          }
    ]).then(answers=>{
    if(answers.whattodo=='view tables'){
    views()
    };
    if(answers.whattodo=='Add employees, roles or departments'){
        addDatas()
    };
    if(answers.whattodo=='Remove emplyee department or role'){
        deleteData()
    };
    if(answers.whattodo=='update'){
        updateData()
    }    
    })

  }
//finding and pushing information to array for selections
  function findRoles(){
    let query="SELECT id,title FROM role"
   
    connection.query(query,function (error, res,){
        if (error) throw error;
        for (let i = 0; i < res.length; i++){
            roles.push(`${res[i].title}`)    
        }
      })

  };

  function findEmployeeId(){
    let query="SELECT id FROM employee"
   
    connection.query(query,function (error, res,){
        if (error) throw error;
        for (let i = 0; i < res.length; i++){
            employeeIds.push(`${res[i].id}`)    

        }
      })

}

function findDepartments(){
    let query="SELECT name FROM department"
   
    connection.query(query,function (error, res,){
        if (error) throw error;
        for (let i = 0; i < res.length; i++){
            allDepartments.push(`${res[i].name}`)    
        
        }
      })

}

//adding datas
function addDatas(){
    inquirer.prompt([
        {
            type:'list',
            name: 'whattoadd',
            message: `What would you like to do`,
            choices:['add employee','add department','add role']
          }
    ]).then(answers=>{
    if(answers.whattoadd=='add employee'){
    addEmployee()
    };
    if(answers.whattoadd=='add department'){
        addDepartment()
        };
    if(answers.whattoadd=='add role'){
        addRole()
    };
    })
}
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
            runProgram()
          })

          })
          
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
                runProgram()
              })
        })
        
  }
//add roles
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
            let idDepartment=parseInt(answers.department);
            let salary= parseInt(answers.salary);
            let sql= `INSERT INTO role(title,salary,department_id)
            VALUE ("${answers.title}","${salary}","${idDepartment}")`

            connection.query(sql,function (error, res){
                if (error) throw error;
                runProgram()
              })
            
        })
        

  }
  //view dat
  //view all managers
  function views(){
    inquirer.prompt([
        {
            type:'list',
            name: 'whattodo',
            message: `What would you like to do`,
            choices:['view managers','view employees','view roles','view department']
          }
    ]).then(answers=>{
    if(answers.whattodo=='view managers'){
    viewManagers()
    };
    if(answers.whattodo=='view employees'){
        viewAllEmployee()
    };
    if(answers.whattodo=='view roles'){
        viewAllRoles()
    };
    if(answers.whattodo=='view department'){
        viewDepartment()
    };

    })
  }

  function viewManagers(){

    let sql= `SELECT e.id,e.first_name,e.last_name,r.title
    FROM employee e
    JOIN role r 
        ON e.role_id= r.id
    WHERE title LIKE '%Lead%'`
    connection.query(sql,function (error, res){
        if (error) throw error;
        console.table(res)
        runProgram()
      })
      
  }

  //view all employess
function viewAllEmployee(){
    let sql= `SELECT e.id,e.first_name,e.last_name,r.title AS role,m.first_name AS Manager
    FROM employee e
    JOIN role r
        ON e.role_id= r.id
    LEFT JOIN employee m
        on m.id=e.manager_id  
        `
    connection.query(sql,function (error, res){
        if (error) throw error;
        console.table(res)
        runProgram()
      })
     
};

//view all employes
function viewAllRoles(){
    let sql=  `SELECT r.id,title,salary,department_id,d.name AS Department
    FROM role r
    JOIN department d
        ON r.department_id= d.id`
    connection.query(sql,function (error, res){
        if (error) throw error;
        console.table(res)
        runProgram()
      })
      
};


function viewDepartment(){
    let sql=  `SELECT *
    FROM department`
    connection.query(sql,function (error, res){
        if (error) throw error;
        console.table(res)
        runProgram()
      })
      
};
//------------------//
//deleting data


function deleteData(){
    inquirer.prompt([
        {
            type:'list',
            name: 'whattodelete',
            message: `What would you like to do`,
            choices:['remove employee','remove a department','remove a role']
          }
    ]).then(answers=>{
    if(answers.whattodelete=='remove employee'){
        removeEmployee()
    };
    if(answers.whattodelete=='remove a department'){
        removeDepartment()
    };
    if(answers.whattodelete=='remove a role'){
        removeRole()
    };
    
    
    })
}


//delete employee
function removeEmployee(){
    inquirer.prompt([
        {
            type:'list',
            name: 'id',
            message: `What is the of the ID of the employe you want to delete`,
            choices: employeeIds
          },
        ]).then(answers=>{
            let sql=`DELETE FROM employee WHERE id="${answers.id}"`;
            connection.query(sql,function (error, res){
                if (error) throw error;
                console.log(`deleted this employeed with id : "${answers.id}" `)
                runProgram();
              })
        })

}

function removeDepartment(){

    inquirer.prompt([
        {
            type:'list',
            name: 'department',
            message: `What is the name of the department you want to delete`,
            choices: allDepartments
          },
        ]).then(answers=>{
        let sql=`DELETE FROM department WHERE name="${answers.department}"`;
        connection.query(sql,function (error, res){
            if (error) throw error;
            console.log(`deleted "${answers.department}"`)
            runProgram()
          })

        })
    };

    function removeRole(){
        inquirer.prompt([
        {
            type:'list',
            name: 'role',
            message: `What is the tilte of the role you want to remove from the company`,
            choices: roles
          }
        ]).then(answers=>{
            let sql=`DELETE FROM role WHERE title="${answers.role}"`;
            connection.query(sql,function (error, res){
                if (error) throw error;
                console.log(`deleted "${answers.role}"`)
                runProgram()
              })
        })
        
    }

//updating
function updateData(){
    inquirer.prompt([
        {
            type:'list',
            name: 'department',
            message: `What would you like to update`,
            choices: ['department']
          }
        ]).then(answers=>{
        if (answers.department=='department'){
        updateDepartment()
        }
        })

}

function updateDepartment(){
    inquirer.prompt([
        {
            type:'list',
            name: 'name',
            message: `What is the name of the department you want to delete`,
            choices: allDepartments
          },
          {
            name: 'newname',
            message: `What is the new name `
          }
        ]).then(answers=>{
        let sql=`UPDATE department
        SET name="${answers.newname}"
        WHERE name="${answers.name}"
        `
        connection.query(sql,function (error, res){
            if (error) throw error;
            console.log(`updated "${answers.name}" to "${answers.Newname}"`)
            runProgram();
        })

        })

}

