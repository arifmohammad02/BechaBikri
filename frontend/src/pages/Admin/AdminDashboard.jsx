/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Chart from "react-apexcharts";
import { useGetUsersQuery } from "@redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useGetTotalOrdersByDateQuery,
  useGetSalesSummaryByStatusQuery,
  useGetDeliverySummaryQuery,
} from "@redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers } = useGetUsersQuery();
  const { data: orders } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: ordersByDate } = useGetTotalOrdersByDateQuery();
  const { data: salesByDate } = useGetTotalSalesByDateQuery();
  const { data: statusSummary } = useGetSalesSummaryByStatusQuery();
  const { data: deliverySummary } = useGetDeliverySummaryQuery();

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
  const todayOrders = ordersByDate?.find((item) => item._id === today)?.totalOrders || 0;
  const todaySales = salesByDate?.find((item) => item._id === today)?.totalSales || 0;

  const getStatusData = (status) => {
    const data = statusSummary?.find((item) => item._id === status);
    return { amount: data?.totalSales || 0, count: data?.orderCount || 0 };
  };

  const getDeliveryCount = (status) => {
    return deliverySummary?.find((item) => item._id === status)?.count || 0;
  };

  const getDeliveryData = (status) => {
    const data = deliverySummary?.find((item) => item._id === status);
    return {
      count: data?.count || 0,
      amount: data?.totalAmount || 0, // ✅ ব্যাকএন্ড থেকে আসা টাকা
    };
  };

  // ✅ নতুন Area Chart কনফিগারেশন (Premium Look)
  const [state, setState] = useState({
    options: {
      chart: {
        type: "area", // এরিয়া চার্ট যা দেখতে অনেক স্মুথ
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          top: 10,
          left: 0,
          blur: 4,
          color: "#6366F1",
          opacity: 0.1,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      colors: ["#6366F1"], // Indigo Theme
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 }, // মসৃণ বাঁকানো রেখা
      grid: {
        borderColor: "#f1f1f1",
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: "#9ca3af", fontWeight: 500 } },
      },
      yaxis: {
        labels: {
          style: { colors: "#9ca3af", fontWeight: 500 },
          formatter: (value) => `৳${value}`,
        },
      },
      markers: {
        size: 5,
        colors: ["#6366F1"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: { size: 7 },
      },
      tooltip: { theme: "dark", x: { show: true } },
    },
    series: [{ name: "Revenue", data: [] }],
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
          xaxis: { categories: formattedSalesDate.map((item) => item.x) },
        },
        series: [{ name: "Revenue", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="bg-[#FAFBFE] min-h-screen container mx-auto transition-all duration-500">
      <AdminMenu />
      <section className="py-10 mt-20 px-4 md:px-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard title="Sales Today" value={todaySales} color="bg-blue-500" loading={!salesByDate} />
          <StatCard title="Total Earnings" value={sales?.totalSales} color="bg-indigo-600" loading={isLoading} />
          <StatCard title="Customers" value={customers?.length} color="bg-amber-400" loading={!customers} isCount />
          <StatCard title="Orders (Today)" value={todayOrders} color="bg-emerald-500" loading={!ordersByDate} isCount />
          <StatCard title="All Orders" value={orders?.totalOrders} color="bg-rose-500" loading={isLoading} isCount />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Breakdowns Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-600 rounded-full"></div> Payment Summary
              </h2>
              <div className="space-y-3">
                <StatusRow label="Paid" data={getStatusData("paid")} color="text-emerald-600" bg="bg-emerald-50/50" />
                <StatusRow label="Due (COD)" data={getStatusData("due")} color="text-blue-600" bg="bg-blue-50/50" />
                <StatusRow label="Pending" data={getStatusData("pending")} color="text-amber-600" bg="bg-amber-50/50" />
                <StatusRow label="Failed" data={getStatusData("failed")} color="text-rose-600" bg="bg-rose-50" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
             <h2 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div> Logistics Breakdown
              </h2>
              <div className="grid grid-cols-1 gap-3"> {/* ভালো রিডাবিলিটির জন্য grid-cols-1 করা হয়েছে */}
                <DeliveryMiniCard label="Order Placed" data={getDeliveryData("Order Placed")} color="text-gray-600" bg="bg-gray-50" />
                <DeliveryMiniCard label="Processing" data={getDeliveryData("Processing")} color="text-blue-600" bg="bg-blue-50" />
                <DeliveryMiniCard label="Shipped" data={getDeliveryData("Shipped")} color="text-purple-600" bg="bg-purple-50" />
                <DeliveryMiniCard label="Out for Delivery" data={getDeliveryData("Out for Delivery")} color="text-orange-600" bg="bg-orange-50" />
                <DeliveryMiniCard label="Delivered" data={getDeliveryData("Delivered")} color="text-emerald-600" bg="bg-emerald-50" />
                <DeliveryMiniCard label="Cancelled" data={getDeliveryData("Cancelled")} color="text-rose-600" bg="bg-rose-50" />
              </div>
            </div>
          </div>

          {/* Area Chart Section - Expanded */}
          <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Revenue Flow</h2>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full"></span> Sales Trend
                </span>
              </div>
            </div>
            <Chart options={state.options} series={state.series} type="area" height={350} />
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
           <Link to="/admin/orderlist" >
            <button className="px-4 py-2 bg-gray-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">View All</button>
           </Link>
          </div>
          <div className="overflow-x-auto">
            <OrderList showAdminMenu={false} className="p-0" isDashboard={true} />
          </div>
        </div>
      </section>
    </div>
  );
};

// --- Sub Components ---

const StatCard = ({ title, value, color, loading, isCount }) => (
  <div className="group border border-gray-50 rounded-3xl p-6 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={`w-10 h-10 ${color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
      <div className={`w-2 h-2 ${color} rounded-full`}></div>
    </div>
    <p className="font-semibold text-[11px] text-gray-400 uppercase tracking-widest">{title}</p>
    <p className="font-bold text-2xl text-gray-800 mt-1">
      {loading ? "..." : isCount ? value : `৳${Number(value).toLocaleString()}`}
    </p>
  </div>
);

const StatusRow = ({ label, data, color, bg }) => (
  <div className={`flex items-center justify-between p-3.5 rounded-2xl ${bg} transition-all hover:bg-opacity-100`}>
    <div>
      <p className={`font-bold text-[12px] ${color}`}>{label}</p>
      <p className="text-[10px] text-gray-400 font-medium">{data.count} Orders</p>
    </div>
    <p className="font-bold text-gray-800">৳{Number(data.amount).toLocaleString()}</p>
  </div>
);

const DeliveryMiniCard = ({ label, data, color, bg }) => (
  <div className={`${bg} p-3.5 rounded-2xl border border-transparent hover:border-white transition-all duration-300 flex justify-between items-center group`}>
    <div>
      <p className={`text-[10px] uppercase font-bold tracking-tight opacity-70 ${color}`}>{label}</p>
      <p className="text-lg font-black text-gray-800 leading-none mt-1">
        {data.count} <span className="text-[10px] font-medium text-gray-400">Orders</span>
      </p>
    </div>
    <div className="text-right">
      <p className="text-[10px] text-gray-400 font-medium">Value</p>
      <p className="font-bold text-gray-800 text-sm">
        ৳{Number(data.amount).toLocaleString()}
      </p>
    </div>
  </div>
);

export default AdminDashboard;