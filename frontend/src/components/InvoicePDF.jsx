/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0174E6",
    textAlign: "center",
    marginBottom: 20,
  },
  invoiceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0174E6",
    marginBottom: 10,
  },
  customerDetails: {
    flexDirection: "column",
    marginBottom: 20,
  },
  customerDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeader: {
    backgroundColor: "#0174E6",
    color: "#fff",
    fontWeight: "bold",
  },
  tableCol: {
    width: "33%",
    padding: 8,
    textAlign: "center",
  },
  totalSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  totalTable: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  totalLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#0174E6",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
});

const InvoicePDF = ({ order }) => {
  // Check if order exists
  if (!order) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No order data available</Text>
        </Page>
      </Document>
    );
  }

  // Safely access properties with defaults
  const orderItems = order.orderItems || [];
  const shippingAddress = order.shippingAddress || {};
  const user = order.user || {};
  
  // Calculate prices with safe defaults
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + (item.qty || 0) * (item.price || 0),
    0
  );
  
  const discount = orderItems.reduce(
    (acc, item) =>
      acc + ((item.discountPercentage || 0) / 100) * (item.qty || 0) * (item.price || 0),
    0
  );
  
  const shippingCharge = shippingAddress.shippingCharge || 0;
  const totalPrice = itemsPrice - discount + shippingCharge;
  const subTotal = itemsPrice - discount;

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Calculate item total safely
  const calculateItemTotal = (item) => {
    const qty = item.qty || 0;
    const price = item.price || 0;
    const discountPercentage = item.discountPercentage || 0;
    const discountAmount = (discountPercentage / 100) * price;
    const discountedPrice = price - discountAmount;
    return (qty * discountedPrice).toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>INVOICE</Text>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View>
            <Text>Invoice Number: {order.orderId || "N/A"}</Text>
            <Text>Date: {formatDate(order.createdAt)}</Text>
          </View>
          <View>
            <Text>Status: {order.isPaid ? "Paid" : "Unpaid"}</Text>
            <Text>Delivery: {order.isDelivered ? "Delivered" : "Pending"}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.customerDetails}>
            <View style={styles.customerDetailRow}>
              <Text>Name:</Text>
              <Text>{shippingAddress.name || "N/A"}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text>Email:</Text>
              <Text>{user.email || "N/A"}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text>Phone:</Text>
              <Text>{shippingAddress.phoneNumber || "N/A"}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text>Address:</Text>
              <Text>
                {shippingAddress.address || ""}, {shippingAddress.city || ""},{" "}
                {shippingAddress.postalCode || ""},{" "}
                {shippingAddress.country || ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text>Product</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Quantity</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Price</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            {orderItems.length > 0 ? (
              orderItems.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text>{item.name || "Unnamed Product"}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{item.qty || 0}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{calculateItemTotal(item)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={[styles.tableCol, { width: "100%" }]}>
                  <Text>No items in this order</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{subTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping Fee:</Text>
              <Text style={styles.totalValue}>{shippingCharge.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>-{discount.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, { backgroundColor: "#f0f8ff" }]}>
              <Text style={[styles.totalLabel, { color: "#0174E6" }]}>
                Total:
              </Text>
              <Text style={[styles.totalValue, { color: "#0174E6" }]}>
                {totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for shopping with us!</Text>
          <Text>For any queries, contact support@example.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;