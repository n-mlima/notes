import './App.css';
import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from "react-icons/bs";
import axios from 'axios';

//Endereço base da API
const API="https://api-notes-eta.vercel.app";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [listDo, setListDo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/listdo`);
        setListDo(response.data);
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = async (list) => {
    list.done = !list.done;
    try {
      await axios.put(`${API}/listdo/${list.id}`, list);
      setListDo((prevState) =>
        prevState.map((item) => (item.id === list.id ? { ...item, ...list } : item))
      );
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newList = {
      id: Math.floor(Math.random() * (10000 - 1) + 1),
      title,
      time,
      done: false,
    };

    try {
      await axios.post(`${API}/listdo`, newList);
      setListDo((prevState) => [...prevState, newList]);
      setTitle("");
      setTime("");
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/listdo/${id}`);
      setListDo((prevState) => prevState.filter((list) => list.id !== id));
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  if (loading) {
    return <h1>Carregando...</h1>;
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
