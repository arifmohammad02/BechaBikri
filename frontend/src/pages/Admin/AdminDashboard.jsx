import Chart from "react-apexcharts";
import { useGetUsersQuery } from "@redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useGetTotalOrdersByDateQuery,
} from "@redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: ordersByDate } = useGetTotalOrdersByDateQuery();
  const { data: salesByDate } = useGetTotalSalesByDateQuery();
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const todayOrders =
    ordersByDate?.find((item) => item._id === today)?.totalOrders || 0;
  const todaySales =
    salesByDate?.find((item) => item._id === today)?.totalSales || 0;

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
        font_size: "24px",
        font_weight: "medium",
        font_family: "'Poppins', sans-serif",
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
    <div className="bg-[#FFFFFF] container mx-auto">
      <AdminMenu />
      <section className={`py-10 mt-20 `}>
        {/* Summary Cards */}
        <div className="flex flex-wrap justify-center gap-6 px-3 md:px-0">
          {/* Sales Card */}
          <div className="relative border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-64">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bottom-2 h-20 w-1 bg-blue-500 rounded-full"></div>
            <div className="flex flex-col items-start justify-center mt-2">
              <p className="font-medium text-[14px] font-roboto text-[#878A99] uppercase">
                Sales Today
              </p>
              <span className="font-semibold text-[22px] font-roboto text-[#0C192C]">
                {salesByDate ? todaySales.toFixed(2) : "Loading..."}
              </span>
            </div>
          </div>

          <div className="relative border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-64">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bottom-2 h-20 w-1 bg-purple-400 rounded-full"></div>
            <div className="flex flex-col items-start justify-center mt-2">
              <p className="font-medium text-[14px] font-roboto text-[#878A99] uppercase">
                Total Earnings
              </p>
              <span className="font-semibold text-[22px] font-roboto text-[#0C192C]">
                {isLoading ? "Loading..." : sales.totalSales.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Customers Card */}
          <div className="relative border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-64">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bottom-2 h-20 w-1 bg-yellow-400 rounded-full"></div>
            <div className="flex flex-col items-start justify-center mt-2">
              <p className="font-medium text-[14px] font-roboto text-[#878A99] uppercase">
                Customers
              </p>
              <span className="font-semibold text-[22px] font-roboto text-[#0C192C]">
                {isLoading ? "Loading..." : customers?.length}
              </span>
            </div>
          </div>

          <div className="relative border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-64">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bottom-2 h-20 w-1 bg-teal-500 rounded-full"></div>
            <div className="flex flex-col items-start justify-center mt-2">
              <p className="font-medium text-[14px] font-roboto text-[#878A99] uppercase">
                Orders (Today)
              </p>
              <span className="font-semibold text-[22px] font-roboto text-[#0C192C]">
                {ordersByDate ? todayOrders : "Loading..."}
              </span>
            </div>
          </div>

          {/* Orders Card */}
          <div className="relative border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-64">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 bottom-2 h-20 w-1 bg-green-500 rounded-full"></div>
            <div className="flex flex-col items-start justify-center mt-2">
              <p className="font-medium text-[14px] font-roboto text-[#878A99] uppercase">
                All Orders
              </p>
              <span className="font-semibold text-[22px] font-roboto text-[#0C192C]">
                {isLoading ? "Loading..." : orders?.totalOrders}
              </span>
            </div>
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
              className="border bg-white p-5"
            />
          </div>
        </div>

        {/* Order List Section */}
        <div className="mt-8">
          <div className="overflow-auto">
            <h2 className="text-[18px] font-figtree font-bold text-black ml-5">
              Recent Orders
            </h2>
            <OrderList
              showAdminMenu={false}
              className="p-0"
              isDashboard={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
