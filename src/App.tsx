import { useEffect, useState } from "react"; //react hooks for managing states and sideeffects
import type { Schema } from "../amplify/data/resource"; //to generate schema type
import { generateClient } from "aws-amplify/data"; // client generator to interact with BE data models
import { useAuthenticator } from "@aws-amplify/ui-react";
const client = generateClient<Schema>(); //create amplify client instance with my schema

function App() {
  const { user, signOut } = useAuthenticator();

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]); //using react hooks to hold an array of todos
  //doesnt actually connect to DB here
  //the Schema[...] part only ensures todos hold Todo objects, not connected to some schema 

  useEffect(() => { //react effect hooks: runs when thecomponent mounts
    client.models.Todo.observeQuery().subscribe({ //subscribe to live query for todo model updates in the BE DB(listen for create/update/delete changes)
      next: (data) => setTodos([...data.items]), //data.items = array of all current todo items, ... = spread operator to make shallow copy of arr (good for allowing react to detect state change)
      //everytime we get a new response from the subscription, response is in data and call setTodo to set the local react state todos with the new data from BE DB
    });
  }, []);

  function createTodo() { 
    //opens brower prompt to ask user for todo content
    //then sends create request to amplify backend
    client.models.Todo.create({ content: window.prompt("Todo content"), isDone: false }); //window.prompt() opens popup
    //client.models holds all models defined in my schema
  }

  function deleteTodo(id: string){
    client.models.Todo.delete({id});
  }

  function updateIsDone(idd: string, isChecked: boolean){
    client.models.Todo.update({
      id: idd,
      isDone: isChecked
    })

    console.log("UpdateIsDone, isDone: ",  );


  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", backgroundColor:"white"}}>
            <li 
              onClick={() => deleteTodo(todo.id)}
              key={todo.id}>{todo.content}
            </li>
            <input type="checkbox" style={{marginRight:"10px"}} onChange={(e) => updateIsDone(todo.id, e.target.checked)} defaultChecked={!!todo.isDone}></input>
          </div>
        ))}
      </ul>
      
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
