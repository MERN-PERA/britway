"use client";

import { useRef, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import { useExcelData } from "../hooks";
import { BookingTable } from "../components/booking-table";
import { type Booking } from "../typings";


export default function Booking() {
  const fileInput = useRef<HTMLInputElement>(null);
  const { data, excelToData } = useExcelData();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isSaveDisabled, setIsSaveDisabled] = useState(false); // State for disabling the save button

  useEffect(() => {
    // Fetch bookings from the backend when the component mounts
    axios
      .get("/api/booking")
      .then((response) => {
        console.log("Fetched bookings:", response.data); // Log the fetched data
        setBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  const handleFileChange = (file: File | undefined) => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    try {
      excelToData(file);
    } catch (error) {
      console.error("Error processing the file:", error);
    }
  };

  const createBookings = () => {
    const newBookings = (data as Booking[]).map((x) => ({
      email: x.Email,
      journeyDate: x["Journey date"],
      refId: x["Ref ID"],
      driver: x.Driver,
      status: x.Status,
      driverIncome: x["Driver income"],
      total: x.Total,
      payments: x.Payments,
      vehicle: x.Vehicle,
      vehicleType: x["Vehicle type"],
      totalNet: x["Total (net)"],
      discount: x.Discount,
      passengerName: x["Passenger name"],
      flightNumber: x["Flight number"],
      flightLandingTime: x["Flight landing time"],
      arrivingFrom: x["Arriving from"],
      flightDepartureNumber: x["Flight departure number"],
      serviceDuration: x["Service duration"],
      serviceType: x["Service type"],
      flightDepartureTime: x["Flight departure time"],
      flightDepartureTo: x["Flight departure to"],
      phoneNumber: x["Phone number"],
      pickup: x.Pickup,
      dropoff: x.Dropoff,
      via: x.Via,
      passengers: x.Passengers,
      suitcases: x.Suitcases,
      carryOn: x["Carry-on"],
      childSeats: x["Child seats"],
      boosterSeats: x["Booster seats"],
      infantSeats: x["Infant seats"],
      wheelchairs: x.Wheelchairs,
      waitingTime: x["Waiting time"],
      meetGreet: x["Meet & Greet"],
      source: x.Source,
      customer: x.Customer,
      departments: x.Departments,
      leadName: x["Lead name"],
      leadEmail: x["Lead email"],
      leadPhoneNumber: x["Lead phone number"],
      createdAt: x["Created at"],
      updatedAt: x["Updated at"],
      currency: x.Currency,
      trackingHistory: x["Tracking History"],
    }));

    console.log("New bookings to create:", newBookings);

    axios
      .post("/api/booking", newBookings)
      .then((response) => {
        console.log("Post response:", response);
        Swal.fire({
          icon: "success",
          title: "Successfully",
          text: "The booking's data has been imported.",
        });

        // Assuming response.data is a count of created bookings
        // Re-fetch the bookings to get the updated list
        axios
          .get("/api/booking")
          .then((response) => {
            console.log("Re-fetched bookings:", response.data);
            setBookings(response.data); // Update state with the re-fetched bookings
            setIsSaveDisabled(true);
          })
          .catch((error) => {
            console.error("Error fetching bookings:", error);
          });
      })
      .catch((error) => {
        console.error("Error creating bookings:", error);
      });
  };

  const deleteAllBookings = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete all bookings!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("/api/booking") // Adjust endpoint as per backend implementation
          .then((response) => {
            console.log("All bookings deleted:", response.data);
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "All bookings have been deleted.",
            });
            setBookings([]); // Reset state to empty array
          })
          .catch((error) => {
            console.error("Error deleting bookings:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete bookings.",
            });
          });
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 w-screen lg:w-80 bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-lg font-semibold md:text-2xl text-gray-900">Booking</h1>

        <div className="flex gap-5">
        <Button
          onClick={() => fileInput.current?.click()}
          className="bg-green-600 bg-opacity-40 text-green-600 font-bold hover:bg-green-700 hover:bg-opacity-50 flex items-center gap-2"
        >
          <img
            src="https://iconsax.io/icons/a/19.svg"
            alt="Import Icon"
            className="w-5 h-5"
          />
          Import
        </Button>



          <input
            ref={fileInput}
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <Button
            disabled={isSaveDisabled || data?.length === 0}
            onClick={createBookings}
            className="bg-blue-600 bg-opacity-40 text-blue-600 font-bold hover:bg-blue-700 hover:bg-opacity-50 flex items-center gap-2 disabled:bg-gray-400 disabled:text-gray-500"
          >
            <img
              src="https://iconsax.io/icons/a/6.svg"
              alt="Save Icon"
              className="w-5 h-5"
            />
            Save
          </Button>


          <Button
            onClick={deleteAllBookings}
            className="bg-red-600 bg-opacity-40 text-red-600 font-bold hover:bg-red-700 hover:bg-opacity-50 flex items-center gap-2"
          >
            <img
              src="https://iconsax.io/icons/a/64.svg"
              alt="Delete Icon"
              className="w-5 h-5"
            />
            Delete All
          </Button>



        </div>
      </div>
      <div className="flex flex-1 p-4 rounded-lg bg-white shadow-sm">
        <BookingTable data={bookings} />
      </div>
    </div>
  );
}
