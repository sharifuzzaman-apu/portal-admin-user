import React from "react";
import { useDispatch ,useSelector } from "react-redux";
import {fetchUsers} from '../../pages/features/userSlice'
import { useEffect } from "react";

const AdminUsers = () => {
    const dispatch = useDispatch();
    const {users,loading,error}=useSelector((state)=>state.user);

    useEffect(()=>{
        dispatch(fetchUsers());
    },[dispatch]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-center">All Users</h2>
            {loading && <p>Loading users...</p>}
            {error && <p>Error: {error}</p>}
            <ul className="list-disc pl-5 flex flex-wrap justify-center gap-4" >
                {users.map(user => (
                    <li className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-4 mb-4" key={user.id}>
                        <strong>{user.email}</strong>
                        <p>Phone: {user.phone}</p>
                        <p>Created At: {user.createdAt?.toDate().toString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default AdminUsers;