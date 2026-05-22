import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

export default function Dashboard() {
  
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'ROLE_ADMIN';

  return (
    <>
      <h1><a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>Async Frontend <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </h1>
      <h2>Display and manipulate database entries</h2>
      
      <div class="grid">
        <DisplayDB />
        <div class="grid1">
          <Logout/>
          {isAdmin && <AddEntry/>}
          <SelectEntryById />
          {isAdmin && <DeleteEntryById />}
        </div>
      </div>
    </>
  )
}

function Logout() {

  async function handleLogout() {
  
    try {

      const res = await fetch(`/api/v1/logout`, {
        method: "POST",
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('userRole');
        console.log("Logged out successfully");
        window.location.href = "/login";
      }
      else {
        const text = await res.text();
        console.error("Logout failed:", res.status, text);
      }
    }
    catch (error) {
      console.error("Server error during logout:", error);
    }
  }

  return (
    <div class="feature">
      <h3 class="lead">Logout</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}


function DisplayDB() {
  const [show,setShow] = useState(0);
  const [db,setDb] =useState([]);

  async function getDB(e) {
    setShow(1-show);

    try {

      const res = await fetch(`/api/v1/software-engineers`, {
        method: "GET",
        credentials: 'include',
      });

      if (res.status == 401) {
        console.warn("Unauthorized access to database");
        setDb([]);
        window.location.href = "/login";
        return null;
      }

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status} ${await res.text()}`);
      }

      let data = await res.json();
      console.log("Retrieved db", data);
      setDb(data);
    
    }
    catch (error) {
      console.error("Error fetching database:", error);
      setDb([]);
    }
  }

  return (
    <div class="feature">
      <h3 class="lead">Database</h3>
      <form>
        <label>show: <input 
          type="checkbox"  value={show} onChange={getDB}/>
        </label>
      </form>

    {show && <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Skills</th>
        </tr>
      </thead>
      <tbody>
        {db.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.techStack}</td>
            </tr>
          ))}
      </tbody>
    </table>}
    </div>
  )
}

function SelectEntryById() {
const [id, setId] = useState('');
const [entry,setEntry] = useState(null);

  async function handleSubmit(e){
    e.preventDefault(); // stop page reload
    //setId(e.target.value);

    //const params = new URLSearchParams({id,});
    const res = await fetch(`/api/v1/software-engineers/${id}`, {
      method: "GET",
      credentials: 'include'
    });

    const data = await res.json();
    setEntry(data);
    console.log("Retrieved entry with id", id, data);

    //setId(0);
  }

  return (
    <div class="feature">
      <h3 class="lead">Display an entry from the database</h3>
      <form onSubmit={handleSubmit}>
      <label> ID: <input 
          type="text" min="0" step="1" 
          value={id} 
          onChange={(e) => setId(e.target.value)}
        />   
      </label>
      </form>
      {entry && <p>{entry.name}: {entry.techStack}</p>}
    </div>
  )


}

function AddEntry() {
  const [name, setName] = useState("");
  const [skills,setSkills] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // stop page reload
    console.log("Submitted:", name, skills);

    const res = await fetch(`/api/v1/software-engineers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, techStack: skills }),
        credentials: 'include'
      })


    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", res.status, text);
      return;
    }
    
    setName("");
    setSkills("");
  }

  return (
      <div class="feature">
          <h3 class="lead">Add an entry to the database</h3>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name"> Name: </label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/> 
            <label htmlFor="skills"> Skills: </label>
            <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)}/>
            <button type="submit">Submit</button>
          </form>
    </div>
   
  )

}

function DeleteEntryById() {
const [id, setId] = useState('');
//const [entry,setEntry] = useState(null);

  async function handleSubmit(e){
    e.preventDefault(); // stop page reload

    const res = await fetch(`/api/v1/software-engineers/delete/${id}`, {
      method: "DELETE",
      credentials: 'include'
    });

    const text = await res.text();
    console.log("Deleted entry with id", id);

    setId('');
  }

  return (
    <div class="feature">
      <h3 class="lead">Delete an entry from the database</h3>
      <form onSubmit={handleSubmit}>
      <label> ID: <input 
          type="text" min="0" step="1" 
          value={id} 
          onChange={(e) => setId(e.target.value)}
        />   
      </label>
      </form>
      
    </div>
  )


}

// func DeleteEntry(delete_id) {
//   return (
//     <div>
//       <h2>Deleted entry with id {delete_id}</h2>
//     </div>
//   )
// }


function SelectID() {
  
  return ( 
    <div>
      <h2>Select an entry by ID</h2>
      <form>
        <label htmlFor="id1">1</label>
        <input type="radio" name="id"  value="1" id="id1"/>
        <label htmlFor="id2">2</label>
        <input type="radio" name="id"  value="2" id="id2"/>
        <label htmlFor="id3">3</label>
        <input type="radio" name="id"  value="3" id="id3"/>
      </form>
    </div>
    );
}