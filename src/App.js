import './App.css';
import {useState,useEffect} from "react";
import {BsTrash,BsBookmarkCheck,BsBookmarkCheckFill} from "react-icons/bs";


//Endereço base da API
const API="https://api-notes-chi.vercel.app/";



function App() {
 
  const [title,setTitle]=useState("")
  const [time,setTime]=useState("")
  const [listDo,setListDo]=useState([])
  const [loading,setLoading]=useState(false)

  useEffect(()=>{

    const loadData= async()=>{

      setLoading(true)
       const res= await fetch(API+"/listdo")
       .then((res)=>res.json())
       .then((data)=>data)
       .catch((err)=>console.log(err))
      
      setLoading(false);
      setListDo(res)
    }

    loadData()

  },[])

  const handleEdit = async (list)=>{
    list.done=!list.done

    const data=await fetch(API +"/listdo/"+list.id,{
      method:"PUT",
      body: JSON.stringify(list),
      headers:{
        "Content-Type":"application/json",
      },
    });

    setListDo((preventState)=>(preventState.map((item)=>(item.id===data.id?{...item,data}:item))))


  }

  const handleSubmit= async (e)=>{
    e.preventDefault()

    const list={
      //gera um número inteiro aleatório entre 1 e 10000
      id: Math.floor(Math.random() * (10000 - 1) + 1),
      title,
      time,
      done:false
    };

    await fetch(API +"/listdo",{
      method:"POST",
      body: JSON.stringify(list),
      headers:{
        "Content-Type":"application/json",
      },
    });


    setListDo((prevState)=>[...prevState, list])
  
   
  
    console.log(list)
    setTitle("")
    setTime("")

  }

  const handleDelete= async (id)=>{

    await fetch(API +"/listdo/"+id,{
      method:"DELETE",
      
    });

    setListDo((prevState)=>prevState.filter((list)=>list.id!==id))

  }

  if(loading){
    return (
      <h1>Carregando...</h1>
    )
  }

  

  return (
    <div className="App">
      <div className='list-header'>
        <img src="..\icon-todo.png" width={"60px"} alt=''></img>
        <h1>Lista de Tarefas</h1>
      </div>
      <div className='list-form'>
        <h3>Crie uma tarefa:</h3>
        <form onSubmit={handleSubmit}>
          <div className='form-submit'>
            <label htmlFor='tarefa'>O que você vai fazer?</label>
            <input 
            type='text' 
            id='tarefa' 
            placeholder='Insira o nome da tarefa' 
            onChange={(e)=>setTitle(e.target.value)}
            value={title || ""}
            required/>
            <label htmlFor='tempo'>Duração:</label>
            <input 
            type='text' 
            id='tempo' 
            placeholder='Insira a duração da tarefa (em horas)'
            onChange={(e)=>setTime(e.target.value)}
            value={time || ""}
            required/>

          </div>


          <input type='submit' value={"Criar"}></input>

        </form>

      </div>
      <div className='list-view'>
        <h3>Tarefas:</h3>
        {listDo.length===0 && <p>Ainda não há tarefas</p>}
        {listDo.map((item)=>(
          <div className='list' key={item.id}>
            <p className={!item.done?"":"todo-done"}>{item.title}</p>
            <p className='p-time'>Duração: {item.time}</p>
            <span className="icon" onClick={()=>handleEdit(item)}>{!item.done?<BsBookmarkCheck/>:<BsBookmarkCheckFill/>}</span>
            <span className='icon'>{<BsTrash onClick={()=>handleDelete(item.id)}/>}</span>
            
            
            
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
