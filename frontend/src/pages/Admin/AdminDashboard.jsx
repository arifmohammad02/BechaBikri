import Chart from "react-apexcharts";
import { useGetUsersQuery } from "@redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "@redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="bg-gray-100 py-10 mt-10 container mx-auto">
        {/* Summary Cards */}
        <div className="flex flex-wrap justify-center gap-6 px-3 md:px-0">
          {/* Sales Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition duration-300 w-full sm:w-[18rem] lg:w-[20rem]">
            <p className="text-gray-500 text-lg font-medium">Sales</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              BDT {isLoading ? "Loading..." : sales.totalSales.toFixed(2)}
            </h1>
          </div>

          {/* Customers Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition duration-300 w-full sm:w-[18rem] lg:w-[20rem]">
            <p className="text-gray-500 text-lg font-medium">Customers</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              {isLoading ? "Loading..." : customers?.length}
            </h1>
          </div>

          {/* Orders Card */}
          <div className="rounded-lg bg-white p-6 shadow-lg hover:shadow-xl transition duration-300 w-full sm:w-[18rem] lg:w-[20rem]">
            <p className="text-gray-500 text-lg font-medium">All Orders</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">
              {isLoading ? "Loading..." : orders?.totalOrders}
            </h1>
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex justify-center mt-16 px-4">
          <div className="w-full sm:w-[90%] lg:w-[70%]">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="100%"
              className="rounded-lg shadow-lg bg-white p-5"
            />
          </div>
        </div>

        {/* Order List Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-700 px-3 md:px-0">Recent Orders</h2>
          <div className="overflow-auto">
            <OrderList />
          </div>
        </div>
      </section>
    </>

  );
};

export default AdminDashboard;
