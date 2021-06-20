import React, { Component } from "react";
import axios from "axios";

const url = "http://localhost:1050/bookFlight/";
const url1 = "http://localhost:1050/getFlightIds/";

class CreateBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        customerId: "",
        flightId: "",
        noOfTickets: ""
      },
      formErrorMessage: {
        customerId: "",
        flightId: "",
        noOfTickets: ""
      },
      formValid: {
        customerId: false,
        flightId: false,
        noOfTickets: false,
        buttonActive: false
      },
      flightIds: [],
      errorMessage: "",
      successMessage: ""
    };
  }

  submitBooking = () => {
    /* 
      Make a POST request to http://localhost:1050/bookFlight/ with form data 
      and handle success and error cases 
    */
    console.log(this.state.form);
    axios.post(url, this.state.form).then(response => {
      if (response.data) {
        this.setState({ successMessage: response.data.message });
        this.setState({ errorMessage: "" });
      }
    }).catch(err => {
      this.setState({ errorMessage: err.response.data.message })
      this.setState({successMessage:""});
    })
  }

  componentWillMount = () => {
    this.fetchFlightIds();
  }

  fetchFlightIds = () => {
    /* 
      Make a axios GET request to http://localhost:1050/getFlightIds/ to fetch the flightId's array 
      from the server and handle the success and error cases appropriately 
    */
    axios.get(url1).then((response) => {
      if (response.data) {
        //console.log("data aa gaya");
        this.setState({ flightIds: response.data });
        this.setState({ errorMessage: "" });
      }
    }).catch((err) => {
      if (err.response && err.response.data.status === 404) {
        this.setState({ errorMessage: err.response.data.message });
        this.setState({successMessage:""});
      } else {
        this.setState({ errorMessage: "Please start your Express server" });
        this.setState({successMessage:""});
      }
    })
    //return this.state.flightIds.map((flightid) => { return <option key={flightid} value={flightid}>{flightid}</option> })
  }

  handleSubmit = event => {
    /* prevent page reload and invoke submitBooking() method */
    event.preventDefault();
    this.submitBooking();
  }

  handleChange = event => {
    /* 
      invoke whenever any change happens any of the input fields
      and update form state with the value. Also, Inoke validateField() method to validate the entered value
    */
    var data = event.target.value;
    var name = String(event.target.name);
    var formdets = this.state.form;
    if (name === "customerId") {
      formdets.customerId = String(data);
    } else if (name === "flightId") {
      formdets.flightId = String(data);
    } else if (name === "noOfTickets") {
      formdets.noOfTickets = Number(data);
    }
    this.setState({ form: formdets });
    this.validateField(name, data);
  }

  validateField = (fieldName, value) => {
    /* Perform Validations and assign error messages, Also, set the value of buttonActive after validation of the field */
    var formerrors = this.state.formErrorMessage;
    var validchecks = this.state.formValid;
    if (fieldName === "customerId") {
      //console.log("custid ke andar");
      if (String(value) === "") {
        formerrors.customerId = "field required";
        validchecks.customerId = false;
      } else if (String(value).match(/^[A-Z]\d{4}$/) == null) {
        //console.log("iske bhi andar");
        formerrors.customerId = "Customer Id must start with an alphabet followed by 4 digits";
        //console.log(formerrors.customerId);
        validchecks.customerId = false;
      } else {
        formerrors.customerId = "";
        validchecks.customerId = true;
      }
    } else if (fieldName === "noOfTickets") {
      if (String(value) === "") {
        formerrors.noOfTickets = "Field required";
        validchecks.noOfTickets = false;
      } else if (Number(value) < 1 || Number(value) > 10) {
        formerrors.noOfTickets = "No of tickets should be greater than 0 and less than 10";
        validchecks.noOfTickets = false;
      } else {
        formerrors.noOfTickets = "";
        validchecks.noOfTickets = true;
      }
    } else if (fieldName === "flightId") {
      if (String(value) === "") {
        formerrors.flightId = "Select a Flight";
        validchecks.flightId = false;
      } else {
        formerrors.flightId = "";
        validchecks.flightId = true;
      }
    }
    validchecks.buttonActive = validchecks.customerId && validchecks.flightId && validchecks.noOfTickets;
    //console.log(validchecks.buttonActive);
    this.setState({ formErrorMessage: formerrors, formValid: validchecks });
  }

  render() {
    return (
      <div className="CreateBooking ">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <br />
            <div className="card">
              <div className="card-header bg-custom">
                <h3>Flight Booking Form</h3>
              </div>
              <div className="card-body">
                <div className="form">
                  <form>
                    <div className="form-group">
                      <label >Customer Id</label>
                      <input type="text" name="customerId" onChange={(event) => this.handleChange(event)} placeholder="e.g - P1001" className="form-control" autoFocus required />
                      <span name="customerIdError" className="text-danger">{this.state.formErrorMessage.customerId}</span>
                    </div>
                    <div className="form-group">
                      <label >Flight ID</label>
                      <select name="flightId" onClick={(event) => this.handleChange(event)} className="form-control" required>
                        <option value="select a field">--Select a Flight--</option>
                        {this.state.flightIds.map((flight) => { return <option key={flight} value={flight}>{flight}</option> })}
                      </select></div>
                    <span name="flightIdError" className="text-danger">{this.state.formErrorMessage.flightId}</span>
                    <div className="form-group">
                      <label >Number of tickets</label>
                      <input type="number" min="1" max="11" placeholder="min-1 max-10" onChange={(event) => this.handleChange(event)} className="form-control" name="noOfTickets" required />
                      <span name="noOfTicketsError" className="text-danger">{this.state.formErrorMessage.noOfTickets}</span>
                    </div>
                    <button name="button" type="submit" disabled={!this.state.formValid.buttonActive} className="btn btn-primary" onClick={(event) => { this.handleSubmit(event) }}>Book Flight</button>
                    <span name="successMessage" className="text-success">{this.state.successMessage}</span>
                    <span name="errorMessage" className="text-danger">{this.state.errorMessage}</span>
                  </form>

                </div>
                {/* create form as per the view given in screenshots */}
                {/* Display success or error messages as given in QP */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateBooking;
