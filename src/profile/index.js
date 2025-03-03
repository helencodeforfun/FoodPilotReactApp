import React, { useEffect, useState } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import * as client from "../profile/client";
import { useNavigate, Link, useParams } from "react-router-dom";
import { setAccount } from '../login/accountReducer';
import { useSelector, useDispatch } from "react-redux";
import { Roles } from '../login/roles';
// import { setBookmarks } from '../bookmark/bookmarkReducer';
import * as bookmarkClient from "../bookmark/client";

export const BASE_API = process.env.REACT_APP_BASE_API_URL;
export const USERS_API = `${BASE_API}/api/users`;

function Profile() {
    var profilePic = require('../../src/images/profile.png');
    var account = useSelector((state) => state.accountReducer.account);
    const dispatch = useDispatch();
    const [bookmarks, setBookmarks] = useState([]);
    const [userFirstName, setUserFirstName] = useState(null);
    const [userLastName, setUserLastName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [userZipCode, setUserZipCode] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const { id } = useParams();
    const signout = async () => {
        const status = await client.signout();
        dispatch(setAccount({ username: "Anonymous", role: Roles.ANONYMOUS }));
      };

    const fetchBookmarks = async () => {
        const bookmarks = await bookmarkClient.findRestaurantsThatUserBookmarks(id);
        setBookmarks(bookmarks);
    };

    const fetchUserData = async () => {
        const u = await client.findUserById(id);
        setUserFirstName(u.firstName);
        setUserLastName(u.lastName);
        setUserEmail(u.email);
        setUserZipCode(u.zipCode);
        setUserRole(u.role);
    };

    useEffect(() => {
        fetchBookmarks();
        fetchUserData();
    }, [id]);
    return (
        <div>
        {account && (
            <header className="profile-header">
            <div className="profile-content">
                <div className="row">
                    <div className="profile-personal-image col-sm-1">
                        <section className="photo_size" id="html">
                            <img style={{ width: 150, height: 150 }} src={profilePic} />
                        </section>
                    </div>
                    <div className="profile-personal-info col-sm-10">
                        { account.role === "ADMIN" && (
                            <span>
                                <b>{<b>{userFirstName} {userLastName} {userRole}</b>}</b><br/>{<b>{userEmail}</b>}<br/>{<b>{userZipCode}</b>}
                            </span>                            
                        )}
                        { account.role !== "ADMIN" && (
                            <span>
                                <b>{<b>{userFirstName} {userLastName}</b>}</b><br/>{<b>{userEmail}</b>}<br/>{<b>{userZipCode}</b>}
                            </span>                
                        )}
                    </div>
                </div>
            </div>
            <div className="profile-bookmark-info mt-5">
                <div className="col">
                    <div className="row-1 mt-5">
                        <h3>Bookmarked Restaurants</h3>
                    </div>
                    <div className="list-group">
                        {bookmarks.map((bookmark, index) => (
                            <li key={index} className="list-group-item">
                                <Link className="bookmark-items" to={`/FoodPilot/details/${bookmark.restaurantId}`}>
                                {bookmark.restaurantName}
                                </Link>
                            </li>
                         ))}
                    </div>
                </div>
            </div>
            <Link
              key={"list"}
              to={'/FoodPilot/home'}
              onClick={signout}
              className="btn btn-danger button edit-button mt-5 me-2">
                Log Out
            </Link>
{/* `            ONLY SHOW WHEN USER IS CURRENT USER` */}
            {account._id == id &&
                <Link
                key={"edit"}
                to={`/FoodPilot/profile/edit/${account._id}`}
                className="btn btn-success button edit-button mt-5 me-2">
                Edit Profile
            </Link>          
            }

            {/* ONLY SHOW WHEN USER IS CURRENT AND IS ADMIN */}
            <a>{account.role}</a>
            {account.role == Roles.ADMIN && (
                <Link
                    key={"list"}
                    to={'/FoodPilot/admin/users'}
                    className="btn btn-warning button edit-button mt-5 me-2">
                    Profile List
                </Link>
            )}
          </header>
        )}
        </div>
    )
};

export default Profile;