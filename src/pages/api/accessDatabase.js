import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";

const DEBUG = true; //Set true to get debug console outputs
const urlStart = "https://native-plants-backend.herokuapp.com";
//const urlStart = "http://127.0.0.1:8080"//my computer didn't like localhost, this is equivalant

/*Function that allows requests to the database using the fetch api
 *This completely replaces the previous accessBackend file
 *GET is replaced by SEARCH in the method type to allow for a request body
 *Expects a body with query_type and table_name fields
 *NOTE: Must escape special characters
 *Allows for optional fields: columns, column_names, and values (all are explained below)
 *Below is an example of how to call
 */

/*
const res = await fetch("/api/accessDatabase",
{
    method: 'SEARCH', //HTTP method: SEARCH, POST, DELETE, PATCH  (NOT GET)
    headers: {
         'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query_type: 'SELECT', //SQL Query type: SELECT, INSERT, UPDATE, DELETE. (Field is required)
        table_name: 'users', //Any table name here (Field is required)
        columns: ['name', 'email', 'user_name'], //array of specific columns to use (Required by INSERT and UPDATE, defaults to * if missing)
        column_names: ['Name', 'Email', 'Username'], //array of column names for SELECT (Not required, uses default names otherwise) (must match order of columns)
        values: ['Ryan Smith', 'smithry9@oregonstate.edu', 'smithry9'],//array of values for INSERT and UPDATE requests (Required by INSERT and UPDATE)
        where: "name iLIKE '%%Ryan%%' OR email = 'smithry9@oregonstate.edu'",//(Should be full WHERE string, excluding the word WHERE, with quotes around values) WHERE clause for the SELECT, UPDATE, and DELETE queries (Eequired by DELETE and UPDATE)
        join_string: "INNER JOIN rev2.plant ON seed_collection.col_species_code = plant.species_code"// should be full join statement. can include multiple joins
    })
}
)
*/
async function accessDatabase(req, res) {
  //const session = await getServerSession(req, res);
  const session = await getSession({req})
  session ? console.log(`==Session Username: ${session.user.username}`) : console.log("no session")
  if (DEBUG) console.log("== Session:", session);

  //Check the session details to determine if a user is logged in and what level of security access their account has
  if (!session) {
    //If no session the user isn't logged in at all
    res.status(401).send({ error: "You are not logged in!" });
    return;
  }
  // } else if (session.user.user_level < 1) {
  //   //logged in but no security
  //   res.status(401).send({
  //     error:
  //       "You do not have permission to access this page!\nAsk an admin to approve your account."
  //   });
  //   return;
  // } else if (
  //   session.user.user_level < 2 &&
  //   req.body.query_type &&
  //   req.body.query_type == "UPDATE" &&
  //   req.body.query_fields &&
  //   req.body.query_fields.length > 0 &&
  //   req.body.query_fields[0] == "user_role_type"
  // ) {
  //   //user is logged in, but does not have admin rights to update
  //   res.status(401).send({
  //     error:
  //       "You do not have permission to access this page!\nAsk an admin to approve your account."
  //   });
  //   return;
  // } else {
  else{
    //user has admin rights
    if (DEBUG)
      console.log(
        "== Logged in with these credentials:",
        session.user.username,
        session.user.user_level
      );
  }

  //function to get data from database, takes a query url that is generated based off the request body
  async function fetchGetRes(url, body) {
    if (DEBUG) console.log("Getting from " + url);

    // body.query = "SELECT * FROM rev2.plant WHERE common_name LIKE '%%Noble fir%%'"
    if (DEBUG) console.log("query: ", body.query);
    const res = await fetch(url, {
      //generated fetch request from url
      method: "POST",
      //mode: "no-cors",
      //cache: "no-cache",
      //redirect: "follow",
      //credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*",
        "Accept-Encoding": "gzip, deflate, br",
        //"Connection": "keep-alive",
        Authentication: process.env.DATABASE_KEY
      },
      body: JSON.stringify(body)
    });
    const resBody = await res.json(); //gets the response and returns the body
    return resBody;
  }

  //function to post to the database, takes a query url and a body
  async function fetchPostRes(url, body) {
    if (DEBUG) console.log("Posting into " + url);
    const res = await fetch(url, {
      //generated post request from url
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*",
        "Accept-Encoding": "gzip, deflate, br",
        //"Connection": "keep-alive",
        Authentication: process.env.DATABASE_KEY
      },
      body: JSON.stringify(body)
    });
    const resBody = await res.json();
    return resBody;
  }

  async function fetchITISConfirmation(url, body) {
    if (DEBUG) console.log("Getting from " + url);
    
    // body.query = "SELECT * FROM rev2.plant WHERE common_name LIKE '%%Noble fir%%'"
    if (DEBUG) console.log("query: ", body.query);
    const res = await fetch(url, {
      //generated fetch request from url
      method: "POST",
      //mode: "no-cors",
      //cache: "no-cache",
      //redirect: "follow",
      //credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
        "Accept-Encoding": "gzip, deflate, br",
        //"Connection": "keep-alive",
        Authentication: process.env.DATABASE_KEY,
      },
      body: JSON.stringify(body),
    });
    const resBody = await res.json(); //gets the response and returns the body
    return resBody;
  }

  //function used to delete from database. takes a query url and a body
  async function fetchDeleteRes(url, body) {
    if (DEBUG) console.log("Deleting: " + body.where);
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*",
        "Accept-Encoding": "gzip, deflate, br",
        //"Connection": "keep-alive",
        Authentication: process.env.DATABASE_KEY
      },
      body: JSON.stringify(body)
    });
    const resBody = await res.json();
    return resBody;
  }

  async function fetchUpdateRes(url, body) {
    if (DEBUG) console.log("Updating: " + body);
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Access-Control-Allow-Origin": "*",
        "Accept-Encoding": "gzip, deflate, br",
        //"Connection": "keep-alive",
        Authentication: process.env.DATABASE_KEY
      },
      body: JSON.stringify(body)
    });
    const resBody = await res.json();
    return resBody;
  }

  

  if (!req || !req.method || !req.body.query_type || !req.body.table_name) {
    //if missing required fields return error
    res
      .status(405)
      .send({ err: "Expecting method, query_type, and table_name fields" });
  } else {
    const required_org = req.body.required_org ? req.body.required_org : null
    const required_level = req.body.required_level ? req.body.required_level : null
    var userOrgID = 0

    //Fetch request to get the data of the logged in user
    const userFetch = await fetchGetRes(`${urlStart}/q`, {
      query: `SELECT related_org_id FROM rev2.users WHERE user_name='${session.user.username}'`
    })
    const userOrgJson = await userFetch.data[0]
    
  if (userOrgJson) {
      userOrgID = userOrgJson.related_org_id
      console.log("User Org: ", userOrgID)
  } else {
      res.status(500).send({error: "Couldn't find logged in user in database"})
      return
  }

    if(required_org){
      if(userOrgID != required_org && session.user.user_level != 2){
        res.status(401).send({error: "User is not part of the required organization"})
        return
      }
    }

    if(required_level){
      if(session.user.user_level != required_level && session.user.user_level != 2){
        res.status(401).send({error: "This action requires a higher access level"})
        return
      }
    }

    


    const query_type = req.body.query_type; //gets the query type (SELECT, INSERT, DELETE, etc)

    const table_name = "rev2." + req.body.table_name; //Gets the passed table name and generates the full name
    const columns = req.body.columns ? req.body.columns : null; //gets columns if passed, defaults to *
    const column_names = req.body.column_names ? req.body.column_names : null; //gets column names if passed, defaults to null
    const ordered_names = []
    if(column_names){
      
      for(let i = 0; i < column_names.length; i++){
        ordered_names.push(`${String.fromCharCode(97+i)}${column_names[i]}`)
      }
    }
    const values = req.body.values ? req.body.values : null; // gets values if passed, defaults to null
    const whereString = req.body.where && req.body.where != "" ? ` WHERE ${req.body.where}` : "";
    const joinString =  req.body.join_string ? req.body.join_string : null;
    
    


    
    //Handles SELECT queries
      if (query_type === "SELECT") {
          const baseURL = `${urlStart}/q`; //creates the base url for get requests
          const return_columns = columns;

          if (column_names && columns) {
              //If the user supplied custom names for the columns, automatically specify in url
              for (var i = 0; i < column_names.length; i++) {
                  return_columns[i] = `${columns[i]} AS "${ordered_names[i]}"`;
              }
          }

          var temp = `${query_type} ${return_columns ? return_columns : "*"
              } FROM ${table_name}${whereString}`;
          temp += joinString ? joinString : "";
          const query_string = temp; //generates the query string

          const body = {
              query: query_string
          };

          await fetchGetRes(baseURL, body)
              .then((resBody) => {
                  //sends request to backend
                  console.log("resBodyInAccess", resBody)
                  if(column_names){
                    console.log("Changing headers")
                    resBody.headers = column_names
                  }else{
                    resBody.headers = Object.keys(resBody.data[0])
                  }
                 
                  res.status(200).send({
                      msg: "Got response from DB",
                      data: resBody
                  });
              })
              .catch((err) => {
                  console.log("== err:", err);
                  res.status(500).send({
                      err: err
                  });
              });
      }

      //handles INSERT queries (Can not have any parameters in URL)
      else if (query_type === "INSERT") {
          if (!columns || !values || columns.length == 0 || values.length == 0) {
              //columns and values are required for INSERT requests
              res
                  .status(405)
                  .send({ err: "Expecting columns and values for INSERT request" });
              return;
          } else if (columns.length != values.length) {
              res
                  .status(405)
                  .send({ err: "Expecting equal number of columns and values" });
              return;
          }
          const baseURL = `${urlStart}/i`; //base url for INSERT requests
          const body = {
              //generates request body
              table_name: table_name,
              columns: columns,
              values: values
          };
          if (DEBUG) console.log(`== body.values: ${body.values}`);

          await fetchPostRes(baseURL, body)
              .then((resBody) => {
                  //send query to backend
                  res.status(200).send({
                      msg: "Got response from DB",
                      data: resBody
                  });
              })
              .catch((err) => {
                  console.log("== err:", err);
                  res.status(500).send({
                      err: err
                  });
              });
      }

      //Handles DELETE queries
      else if (query_type === "DELETE") {
          if (!req.body.where || whereString == "") {
              //DELETE requires a WHERE clause
              res
                  .status(405)
                  .send({ err: "Expecting WHERE clause for DELETE query" });
              return;
          }

          const baseURL = `${urlStart}/d`; //the base url for delete
          const body = {
              //only needs the table_name and where
              table_name: table_name,
              where: whereString
          };
          if (DEBUG) console.log(`== body.where: ${body.where}`);

          await fetchDeleteRes(baseURL, body).then((resBody) => {
              //await response
              res
                  .status(200)
                  .send({
                      msg: "Got response from DB",
                      data: resBody
                  })
                  .catch((err) => {
                      console.log("== err:", err);
                      res.status(500).send({
                          err: err
                      });
                  });
          });
      } else if (query_type === "UPDATE") {
          //Coming soon
          if (!columns || !values || columns.length == 0 || values.length == 0) {
              //columns and values are required for UPDATE requests
              res
                  .status(405)
                  .send({ err: "Expecting columns and values for UPDATE request" });
              return;
          } else if (columns.length != values.length) {
              res
                  .status(405)
                  .send({ err: "Expecting equal number of columns and values" });
              return;
          } else if (!req.body.where || whereString == "") {
              //UPDATE requires a WHERE clause
              res
                  .status(405)
                  .send({ err: "Expecting WHERE clause for UPDATE query" });
              return;
          }
          const baseURL = `${urlStart}/up`; //the base url for delete
          const body = {
              //only needs the table_name and where
              table_name: table_name,
              columns: columns,
              values: values,
              where: whereString
          };
          if (DEBUG) console.log(`== body.where: ${body.where}`);

          await fetchUpdateRes(baseURL, body).then((resBody) => {
              res
                  .status(200)
                  .send({
                      msg: "Got response from DB",
                      data: resBody
                  })
                  .catch((err) => {
                      console.log("== err:", err);
                      res.status(500).send({
                          err: err
                      });
                  });
          });
    } 

  }
}

export default accessDatabase;
