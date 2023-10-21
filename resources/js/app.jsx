import './bootstrap';

import React from 'react';

import ReactDOM from 'react-dom/client';        

import Tasks from './components/tasks/Tasks';
import Edit from './components/tasks/Edit';
import Create from './components/tasks/Create';
import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('app')).render(     
    <div className="row">
        <div className="col-md-12">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" exact element={<Tasks />} />
                    <Route path="/create" exact element={<Create />} />
                    <Route path="/edit/:taskId" exact element={<Edit />} />
                </Routes>
            </BrowserRouter>
        </div>
    </div>    
);
    