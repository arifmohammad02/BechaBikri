import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Poppins font

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
  // Calculate prices
  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );
  const discount = order?.orderItems.reduce(
    (acc, item) =>
      acc + (item.discountPercentage / 100) * item.qty * item.price,
    0
  );
  const shippingCharge = order?.shippingAddress?.shippingCharge || 0;
  const totalPrice = itemsPrice - discount + shippingCharge;
  const subTotal = itemsPrice - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>INVOICE</Text>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View>
            <Text>Invoice Number: {order.orderId}</Text>
            <Text>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
          </View>
          <View>
            <Text>Status: {order.isPaid ? "Paid" : "Unpaid"}</Text>
            <Text>Delivery: {order.isDelivered}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.customerDetails}>
            <View style={styles.customerDetailRow}>
              <Text>Name:</Text>
              <Text>{order.shippingAddress.name}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text>Email:</Text>
              <Text>{order.user.email}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text>Phone:</Text>
              <Text>{order.shippingAddress.phoneNumber}</Text>
            </View>
            <View style={styles.customerDetailRow}>
              <Text>Address:</Text>
              <Text>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
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
            {order.orderItems.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text>{item.name}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{item.qty}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {(
                      item.qty *
                      (item.price -
                        (item.discountPercentage / 100) * item.price)
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
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
              <Text style={styles.totalValue}>-00.00</Text>
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
