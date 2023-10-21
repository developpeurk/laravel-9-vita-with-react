import axios from 'axios';
import React, { useEffect, useState } from 'react';
import useCategories from '../../custom/useCategories';
import { useDebounce } from 'use-debounce';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


export default function Tasks() {

    const [tasks, setTasks] = useState([]);
    const categories = useCategories();
    const [page, setPage] = useState(1);
    const [catId, setCatId] = useState(null);
    const [orderBy, setOrderBy] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(searchTerm, 300);

    useEffect(() => {
        fetchTasks();
    }, [page, catId, orderBy, debouncedSearchTerm]);



    const fetchTasks = async () => {

        try {
            if(catId){

                const response = await axios.get(`/api/category/${catId}/tasks?page=${page}`);
                setTasks(response.data);

            }else if(orderBy){
                const response = await axios.get(`/api/order/${orderBy.column}/${orderBy.direction}/tasks?page=${page}`);
                setTasks(response.data);

            }else if(debouncedSearchTerm){
                const response = await axios.get(`/api/search/${debouncedSearchTerm}/tasks?page=${page}`);
                setTasks(response.data);

            }else{

                const response = await axios.get(`/api/tasks?page=${page}`);
                setTasks(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }



    const fetchPrevNextTasks = async (link) => {
        const url = new URL(link);
        const page = url.searchParams.get('page');
        setPage(page);
        try {
            const response = await axios.get(`/api/tasks?page=${page}`);
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    const checkIfTaskIsDone = (done) => {
        return done ? (
            <span className="badge bg-success text-light">
                Done
            </span>
        
        ) :
        (
            <span className="badge bg-danger">
                Processing...
            </span>
        )
    }



    const deleteTask = (taskId) => { 
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async(result) => {
            if (result.isConfirmed) {
            try {
                const response = await axios.delete(`/api/tasks/${taskId}`);
                Swal.fire(
                    'Deleted!',
                    response.data.message,
                    'success'
                  )
                fetchTasks();
            } catch (error) {
                console.log(error);
            }
            }
          })
    }


    const renderPagination = () => (
        <ul className="pagination">
            {
                tasks.links?.map((link, index) => (
                    <li key={index} className={`page-item ${link.active ? 'active' : ''}`}>
                        <a 
                        style={{cursor: 'pointer'}}
                        className="page-link" 
                        href="#"
                        onClick={(event) => {
                            event.preventDefault();
                            fetchPrevNextTasks(link.url);
                        }}
                        >
                            {link.label.replace('&laquo;', '<').replace('&raquo;', '>')}
                        </a>
                    </li>
                ))
            }
        </ul>
    )
    


 
    return (
        <div className='row my-5'>
            <div className="row my-3">
                <div className="col-md-4">
                    <div className="form-group">
                        <input 
                        value={searchTerm}
                        className='form-control rounded-pill border-0 shadow-sm px-4'
                        onChange={
                            (event) => {
                                setSearchTerm(event.target.value);
                                setCatId(null);
                                setOrderBy(null);
                                setPage(1);
                            }
                        }
                        placeholder='Search...'
                        
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-9 card">
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Done</th>
                                <th>Category</th>
                                <th>Created</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tasks.data?.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.body}</td>
                                        <td>
                                            {
                                                checkIfTaskIsDone(task.done)
                                            }
                                        </td>
                                        <td>{task.category.name}</td>
                                        <td>{task.created_at}</td>
                                        <td className='d-flex'>
                                            <Link to={`edit/${task.id}`} className="btn btn-sm btn-warning">
                                                <i className="fas fa-pencil"></i>
                                            </Link>
                                            <button
                                             className="btn btn-sm btn-danger mx-1"
                                             onClick={() => deleteTask(task.id)}
                                             ><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="my-4 d-flex justify-content-between">
                        <div>
                            Showing {tasks.from || 0 } to {tasks.to  || 0} of {tasks.total} results.
                        </div>
                        <div>
                            
                                {renderPagination()}
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Filter by Category</h5>
                    </div>
                    <div className="card-body">
                        <div className="form-check">
                            <input 
                            name='category'
                            type="radio" 
                            className='form-check-input' 
                            checked={!catId ? true : false}
                            onChange={() => {
                                setCatId(null); 
                                setOrderBy(null);
                                setPage(1);              
                            }}
                            />

                            <label htmlFor="category" className="form-check-label">All</label>
                        </div>
                        {
                            categories?.map(category => (
                                <div key={category.id} className="form-check">
                                    <input 
                                    name='category'
                                    type="radio" 
                                    className='form-check-input' 
                                    onChange={() => {
                                        setOrderBy(null);
                                        setCatId(category.id);    // 1. Set the category ID.
                                        setPage(1);               // 2. Set the page number to 1.
                                    }}
                                    value={category.id}
                                    id= {category.id}
                                    checked={catId === category.id ? true : false}
                                    />

                                    <label htmlFor={category.id} className="form-check-label">{category.name}</label>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="card mt-2">
                    <div className="card-header text-center bg-white">
                        <h5 className="mt-2">Order by</h5>
                    </div>
                    <div className="card-body">
                        <div>
                            <h6>ID</h6>
                            
                            <div className="form-check">
                                <input 
                                name='id'
                                type="radio" 
                                value='asc'
                                className='form-check-input' 
                                onChange={(event) => {
                                    setCatId(null); 
                                    setPage(1);   
                                    setOrderBy({
                                        column: 'id',
                                        direction: event.target.value
                                    })          
                                }}
                                checked={orderBy && orderBy.column === 'id' && orderBy.direction === 'asc' ? true : false}
                                />
                                <label htmlFor="id" className="form-check-label"><i className="fas fa-arrow-up"></i></label>
                            </div>
                            <div className="form-check">
                                <input 
                                name='id'
                                type="radio" 
                                value='desc'
                                className='form-check-input' 
                                onChange={(event) => {
                                    setCatId(null); 
                                    setPage(1);    
                                    setOrderBy({
                                        column: 'id',
                                        direction: event.target.value
                                    })          
                                }}
                                checked={orderBy && orderBy.column === 'id' && orderBy.direction === 'desc' ? true : false}
                                />
                                <label htmlFor="id" className="form-check-label"><i className="fas fa-arrow-down"></i></label>
                                </div>
                        </div>
                            <hr/>
                        <div>
                            <h6>Title</h6>
                            
                            <div className="form-check">
                                <input 
                                name='title'
                                type="radio" 
                                value='asc'
                                className='form-check-input' 
                                onChange={(event) => {
                                    setCatId(null); 
                                    setPage(1);   
                                    setOrderBy({
                                        column: 'title',
                                        direction: event.target.value
                                    })          
                                }}
                                checked={orderBy && orderBy.column === 'title' && orderBy.direction === 'asc' ? true : false}
                                />
                                <label htmlFor="title" className="form-check-label">A-Z</label>
                            </div>
                            <div className="form-check">
                                <input 
                                name='title'
                                type="radio" 
                                value='desc'
                                className='form-check-input' 
                                onChange={(event) => {
                                    setCatId(null); 
                                    setPage(1);    
                                    setOrderBy({
                                        column: 'title',
                                        direction: event.target.value
                                    })          
                                }}
                                checked={orderBy && orderBy.column === 'title' && orderBy.direction === 'desc' ? true : false}
                                />
                                <label htmlFor="title" className="form-check-label">Z-A</label>
                                </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}