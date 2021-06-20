import React, { Component } from "react";
import axios from "axios";

const url = "http://localhost:1050/updatebooking/";

class UpdateBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                bookingId: "",
                noOfTickets: ""
            },
            formErrorMessage: {
                bookingId: "",
                noOfTickets: ""
            },
            formValid: {
                bookingId: true,
                noOfTickets: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            id: this.props.match.params.bookingid
        };
    }


    updateBooking = () => {
        /* 
          Make a axios PUT request to http://localhost:1050/updatebooking/ to update the number of tickets 
          for the selected bookingId and handle the success and error cases appropriately 
        */
       console.log(this.state.form);
        axios.put(url+this.state.id,this.state.form).then(response => {
            console.log("hello");
            this.setState({ errorMessage: "", successMessage: response.data.message });
        }).catch(err => {
            if (err.response && err.response.data.status === 404) {
                this.setState({ errorMessage: err.response.data.message, successMessage: "" });
            } else {
                this.setState({ errorMessage: "Please start your express server", successMessage: "" });

            }
        })
    }

    handleSubmit = (event) => {
        /* prevent page reload and invoke updateBooking() method */
        event.preventDefault();
        this.updateBooking();
    }

    handleChange = (event) => {
        /* 
          invoke whenever any change happens any of the input fields
          and update form state with the value. Also, Inoke validateField() method to validate the entered value
        */
        var f = this.state.form
        var name = String(event.target.name);
        //console.log(name);
        var val = event.target.value;
        if (name === "noOfTickets") {
            f.noOfTickets = val;
            f.bookingId = this.state.id;
        }
        this.setState({ form: f });
        this.validateField(name, val);

    }

    validateField = (fieldName, value) => {
        /* Perform Validations and assign error messages, Also, set the value of buttonActive after validation of the field */
        var formerrors = this.state.formErrorMessage;
        var valid = this.state.formValid;
        if (fieldName === "noOfTickets") {
            //console.log("yaha aaya hai");
            if (String(value) === "") {
                formerrors.noOfTickets = "Field Required";
                valid.noOfTickets = false;
            } else if (Number(value) < 1 || Number(value) > 10) {
                formerrors.noOfTickets = "No of tickets should be greater than 0 and less than 10";
                valid.noOfTickets = false;
            } else {
                formerrors.noOfTickets = "";
                valid.noOfTickets = true;
            }
        }
        valid.buttonActive = valid.noOfTickets && valid.bookingId;
        this.setState({ formValid: valid, formErrorMessage: formerrors });
    }

    render() {
        return (
            <React.Fragment>
                <div className="UpdateBooking">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <br />
                            <div className="card">
                                <div className="card-header bg-custom">
                                    <h4>Update Flight Booking for id: {this.state.id}</h4>
                                </div>
                                <div className="card-body">
                                    <div className="form">
                                        <form>
                                            <div className="form-group">
                                                <label>bookingid</label>
                                                <input type="text" name="id" className="form-control" value={this.state.id} disabled />
                                                <span name="bookingIdError" className="text-danger">{this.state.formErrorMessage.bookingId}</span>
                                            </div>
                                            <div className="form-group">
                                                <label>Number of Tickets</label>
                                                <input type="number" name="noOfTickets" className="form-control" min="1" max="11" placeholder="min-1 max-10" onChange={(event) => this.handleChange(event)} />
                                                <span name="noOfTicketsError" className="text-danger">{this.state.formErrorMessage.noOfTickets}</span>
                                            </div>
                                            <button type="button" disabled={!this.state.formValid.buttonActive} className="btn btn-primary" onClick={(event => this.handleSubmit(event))}>Update Booking</button>
                                        </form>
                                    </div>
                                    {/* code appropriately to render the form as shown in QP */}
                                    {/* display the success and error messages appropriately */}
                                    <span name="ErrorMessage" className="text-danger">{this.state.errorMessage}</span>
                                    <span name="SuccessMessage" className="text-success">{this.state.successMessage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UpdateBooking;