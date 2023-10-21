
import React, {useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useCategories from '../../custom/useCategories';
import Swal from 'sweetalert2';


export default function Edit() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [done, setDone] = useState(0);
    const navigate = useNavigate();
    const categories = useCategories();
    const {taskId} = useParams();



    useEffect(() => {
        fetchTask();
    },[])


    const fetchTask = async () => {

        try {
            const { data } = await axios.get(`/api/tasks/${taskId}`);
            setTitle(data.title);
            setBody(data.body);
            setCategoryId(data.category_id);
            setDone(data.done === 1 ? 1 : 0);

        } catch (error) {
            console.log(error);
        }
    }


    const updateTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        const task = {
            title,
            body,
            category_id: categoryId,
            done: done ? 1 : 0
        };
        try {
            await axios.put(`/api/tasks/${taskId}`, {...task });

            Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: 'Your task has been updated',
               showConfirmButton: false,
               timer: 1500
        });

            setLoading(false);
            navigate('/');
        } catch (error) {
            console.log(error);
            setErrors(error?.response?.data?.errors || {});
            setLoading(false);
        }
    }


    const clearError = (field) => {
        setErrors(prevErrors => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[field];
            return updatedErrors;
        });
    }
    

    const renderErrors = (field) => {
        if (errors[field]) {
            return errors?.[field]?.map((error, index) => (
                <div key={index} className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    {error}
                </div>
            ))
        }
    }
    


    return (
        <div className='row my-5'>
            <div className="col-md-6 mx-auto">
                <div className="card">
                    <div className="card-header bg-white">
                        <h5 className="card-title text-center mt-2">Edit task</h5>
                    </div>
                    <div className="card-body">
                        <form className="mt-5" onSubmit={(e) => updateTask(e)}>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input 
                                    value={title}
                                    placeholder='title' 
                                    type="text" name='title' 
                                    className="form-control" 
                                    id="title" 
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        clearError('title');

                                    }}
                                    />
                                    {renderErrors('title')}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="body" className="form-label">Body</label>
                                <textarea 
                                    className='form-control' 
                                    value={body}
                                    onChange={(e) => {
                                            setBody(e.target.value);
                                            clearError('body');
                                        }}
                                    name="body" 
                                    id="body" 
                                    cols="10" 
                                    rows="5" 
                                    placeholder='body'></textarea>
                                   {renderErrors('body')}

                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="category_id">select category</label>
                                <select 
                                    name="category_id" 
                                    id="category_id" 
                                    className='form-control'
                                    value={categoryId}
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        clearError('category_id');
                                    }}
                                >
                                    <option disabled value="">Select Category</option>
                                    {categories?.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {renderErrors('category_id')}

                            </div>


                            <div className="form-check">
                                <input 
                                      name='taskStatus'
                                      type="radio" 
                                      className='form-check-input' 
                                      onChange={() => {
                                          setDone(true);
                                          clearError('done');
                                      }}
                                      checked={done}
                                      value={true}
                                  />
                                  <label htmlFor="done" className="form-check-label">Done</label>
                            </div>

                            <div className="form-check">
                                <input 
                                    name='taskStatus'
                                    type="radio" 
                                    className='form-check-input' 
                                    onChange={() => {
                                        setDone(false);
                                        clearError('done');
                                    }}
                                    checked={!done}
                                    value={false}
                                />
                                <label htmlFor="notDone" className="form-check-label">Not Done</label>
                            </div>


                            {
                                loading ? (
                                    <button className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                ) : (
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                )
                            }

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}