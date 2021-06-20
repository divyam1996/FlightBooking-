import React, { Component } from "react";
import axios from "axios";
import Redirect from "../../node_modules/react-router-dom/Redirect";

const url = "http://localhost:1050/getAllBookings/";
const url1 = "http://localhost:1050/deleteBooking/";

class GetBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingData: [],
      bookingId: "",
      updateStatus: false,
      errorMessage: "",
      successMessage: ""
    };
  }

  componentWillMount = () => {
    this.fetchBooking();
    //console.log(this.state.bookingData);
  }

  updateBooking = (bid) => {
    /* update the updateStatus and bookingId state with appropriate values */
    this.setState({bookingId:bid,updateStatus:true});
  }

  fetchBooking = () => {
    /* 
      Send an AXIOS GET request to the url http://localhost:1050/getAllBookings/ to fetch all the bookings 
      and handle the success and error cases appropriately 
    */
    axios.get(url).then(response => {
      //console.log("hello",response.data);
      this.setState({ bookingData: response.data, successMessage: response.data.message, errorMessage: "" });
      // console.log(this.state.bookingData);
    }).catch(err => {
      if (err.response && err.response.data.status === 404) {
        this.setState({ errorMessage: err.response.data.message, successMessage: "" });
      } else {
        this.setState({ errorMessage: "Please start your express server", successMessage: "" });
      }
    })
  }

  deleteBooking = (id) => {
    /*
      Send an AXIOS DELETE request to the url http://localhost:1050/deleteBooking/ to delete the selected booking
      and handle the success and error cases appropriately 
    */
   console.log(id,"delete ho gayaa");
   axios.delete(url1+id).then(response=>{
     console.log("delete ho gayaa");
    this.setState({successMessage:response.data.message,errorMessage:""});
    this.fetchBooking();
   }).catch(err=>{
    if (err.response && err.response.data.status === 404) {
      this.setState({ errorMessage: err.response.data.message, successMessage: "" });
    } else {
      this.setState({ errorMessage: "Please start your express server", successMessage: "" });
    }
  })
  
  }

  render() {
    //const { bookingData } = this.state;
    if(this.state.updateStatus){
      return <Redirect to={"/updateBooking/"+this.state.bookingId}/> 
    }
    return (
      <div className="GetBooking">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <br />
            <div className="card">
              <div className="card-header bg-custom">
                <h3 align="center">Booking Details</h3>
              </div>
              <div className="card-body bg-dark">
                {/* code here to get the view as shown in QP for GetBooking component */}
                {this.state.bookingData.length!==0?(<div className="table-responsive">
                  <table className="table-bordered table table-striped text-warning">
                    <thead>
                      <tr>
                      <th>Customer Id</th>
                      <th>Booking Id</th>
                      <th>Total Tickets</th>
                      <th>Total Cost</th>
                      <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.bookingData.map(booking => {
                        return (
                          <tr key={booking.bookingId} >
                            <td className="font-weight-bold">{booking.customerId}</td>
                            <td className="font-weight-bold">{booking.bookingId}</td>
                            <td className="font-weight-bold">{booking.noOfTickets}</td>
                            <td className="font-weight-bold">{booking.bookingCost}</td>
                            <td className="mx-auto">
                              <button type="button" className="btn-sm btn-success ml-2 mr-2" onClick={()=>this.updateBooking(booking.bookingId)}>Update</button>
                              <button type="button" className="btn-sm btn-danger " onClick={()=>this.deleteBooking(booking.bookingId)}>Cancel</button>
                            </td>
                          </tr>
                        )
                      })}
                    
                    </tbody>
                  </table><div><span className="text-light">messages: </span><button type="button" className="btn-sm rounded btn-info" name="hidesuccessmsg" onClick={()=>this.setState({successMessage:""})}>Ok!</button>
                  <span name="SuccessMessage" className="text-success">{this.state.successMessage}</span>
                    <span name="ErrorMessage" className="text-danger">{this.state.errorMessage}</span></div>
                </div>):(<div className="text-center"><span className="text-danger text-center">Could not fetch booking data</span></div>)}
                {/* Display booking data in tabular form */}
                {/* Display error message if the server is not running */}
                {/* code appropriately to redirect on click of update button */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GetBooking;
