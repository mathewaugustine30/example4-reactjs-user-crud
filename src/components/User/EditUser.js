import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Common/Loader";

const EditUser = () => {
  const createUserApi = "http://localhost:8000/user";
  const [isLoading, setIsLoading] = useState(false);
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [phone, setPhone] = useState("");
  let [dirty, setDirty] = useState({
    name: false,
    email: false,
    phone: false,
  });

  let [errors, setErrors] = useState({
    name: [],
    email: [],
    phone: [],
  });
  const [user, setUser] = useState([]);
  const { id } = useParams();
  const getUserApi = "http://localhost:8000/user";
  const navigate = useNavigate();

  //a function to validate email and name
  let validate = () => {
    //variable to store errorsData
    let errorsData = {};

    //email
    errorsData.email = [];

    //email can't blank
    if (!email) {
      errorsData.email.push("Email can't be blank");
    }

    //email regex
    let validEmailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (email) {
      if (!validEmailRegex.test(email)) {
        errorsData.email.push("Proper email address is expected");
      }
    }

    //name
    errorsData.name = [];

    //name can't blank
    if (!name) {
      errorsData.name.push("Name can't be blank");
    }
    errorsData.phone = [];
    if (!phone) {
      errorsData.phone.push("Phone can't be blank");
    }

    var validPhoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    if (phone) {
      if (!validPhoneRegex.test(phone)) {
        errorsData.phone.push("Proper phone number is expected");
      }
    }

    setErrors(errorsData);
  };

  useEffect(validate, [email, phone, name]);

  const handelSubmit = async (event) => {
    event.preventDefault();

    let dirtyData = dirty;
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    //call validate
    validate();
    if (isValid()) {
      try {
        setIsLoading(true);
        let userDto = { ...user, name, email, phone };
        const response = await fetch(createUserApi.concat("/") + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDto),
        });

        if (response.ok) {
          console.log("Form submitted successfully!");
          setUser({ name: "", email: "", phone: "" });
          navigate("/show-user");
        } else {
          console.error("Form submission failed!");
        }
      } catch (error) {
        //setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getUser = () => {
    axios
      .get(getUserApi.concat("/") + id)
      .then((item) => {
        setUser(item.data);
        setName(item.data.name);
        setEmail(item.data.email);
        setPhone(item.data.phone);
        console.log(item.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let isValid = () => {
    let valid = true;

    //reading all controls from errors
    for (let control in errors) {
      if (errors[control].length > 0) valid = false;
    }

    return valid;
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="user-form">
      <div className="heading">
        {isLoading && <Loader />}
        {/* {error && <p>Error: {error}</p>} */}
        <p>Edit Form</p>
      </div>
      <form onSubmit={handelSubmit}>
        <div className="mb-3">
          <label for="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            onBlur={() => {
              setDirty({ ...dirty, name: true });
              validate();
            }}
          />
          <div className="text-danger">
            {dirty["name"] && errors["name"][0] ? errors["name"] : ""}
          </div>
        </div>
        <div className="mb-3 mt-3">
          <label for="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            onBlur={() => {
              setDirty({ ...dirty, email: true });
              validate();
            }}
          />
          <div className="text-danger">
            {dirty["email"] && errors["email"][0] ? errors["email"] : ""}
          </div>
        </div>
        <div className="mb-3">
          <label for="pwd" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
            onBlur={() => {
              setDirty({ ...dirty, phone: true });
              validate();
            }}
          />
          <div className="text-danger">
            {dirty["phone"] && errors["phone"][0] ? errors["phone"] : ""}
          </div>
        </div>
        <button type="submit" className="btn btn-primary submit-btn">
          Updates
        </button>
      </form>
    </div>
  );
};

export default EditUser;
