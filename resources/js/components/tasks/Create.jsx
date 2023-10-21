import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCategories from '../../custom/useCategories';
import Swal from 'sweetalert2';


export default function Create() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const categories = useCategories();

    const createTask = async (e) => {
        e.preventDefault();
        setLoading(true);

        const task = {
            title,
            body,
            category_id: categoryId
        };
        try {
             await axios.post('/api/tasks', {...task });
            Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: 'Your task has been saved',
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


    // const renderErrors = (field) => {
    //     if (errors[field]) {
    //         return errors?.[field]?.map((error, index) => (
    //             <div key={index} className="text-white my-2 rounded p-2 bg-danger">
    //                 {error}
    //             </div>
    //         ))
    //     }
    // }


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
                        <h5 className="card-title text-center mt-2">Create new Task</h5>
                    </div>
                    <div className="card-body">
                        <form className="mt-5" onSubmit={(e) => createTask(e)}>
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
                                <label className="form-label" htmlFor="category_id">Select category</label>
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