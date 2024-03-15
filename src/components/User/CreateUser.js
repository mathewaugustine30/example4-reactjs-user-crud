import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Common/Loader";
import "./user.css";
const CreateUser = () => {
  const navigate = useNavigate();
  const createUserApi = "http://localhost:8000/user";
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });
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

  const handelInput = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name, value);
    setUser({ ...user, [name]: value });
  };

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
        let userDto = { name: name, email: email, phone: phone };
        const response = await fetch(createUserApi, {
          method: "POST",
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
  let isValid = () => {
    let valid = true;

    //reading all controls from errors
    for (let control in errors) {
      if (errors[control].length > 0) valid = false;
    }

    return valid;
  };
  return (
    <div className="user-form">
      <div className="heading">
        {isLoading && <Loader />}
        <p>User Form</p>
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
