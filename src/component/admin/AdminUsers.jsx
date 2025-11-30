import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../pages/features/userSlice";

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
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => {
                                const phone = user.phoneNumber || user.phone || "N/A";
                                const createdDate = (() => {
                                    if (user.createdAt?.toDate) {
                                        return user.createdAt.toDate();
                                    }
                                    if (user.createdAt?.seconds) {
                                        return new Date(user.createdAt.seconds * 1000);
                                    }
                                    return null;
                                })();

                                return (
                                    <tr key={user.id || user.uid || index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <Link className="link link-primary" to={`/admin/users/${user.id || user.uid}`}
                                            >
                                                {user.email || "Unknown"}
                                            </Link>
                                        </td>
                                        <td>{phone}</td>
                                        <td>{createdDate ? createdDate.toLocaleString() : "Unknown"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
export default AdminUsers;