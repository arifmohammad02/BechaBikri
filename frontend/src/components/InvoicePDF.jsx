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

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 20,
    marginBottom: 40,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    letterSpacing: -0.5,
  },
  invoiceTag: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  column: {
    flexDirection: "column",
  },
  sectionLabel: {
    fontSize: 8,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 6,
    fontWeight: "bold",
  },
  detailText: {
    fontSize: 10,
    color: "#1F2937",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  // Status Badge Style
  statusText: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
  },
  colProduct: { width: "60%", fontSize: 10, color: "#111827" },
  colQty: { width: "15%", fontSize: 10, textAlign: "center", color: "#4B5563" },
  colTotal: { width: "25%", fontSize: 10, textAlign: "right", color: "#111827" },
  headerLabel: { fontSize: 8, color: "#9CA3AF", textTransform: "uppercase" },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  summaryBox: {
    width: "35%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#111827",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    left: 50,
    right: 50,
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: "#9CA3AF",
    lineHeight: 1.5,
  },
});

const InvoicePDF = ({ order }) => {
  if (!order) return null;

  const orderItems = order.orderItems || [];
  const shipping = order.shippingAddress || {};

  const itemsPrice = orderItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const discountAmount = orderItems.reduce((acc, item) => 
    acc + ((item.discountPercentage / 100) * item.qty * item.price), 0
  );
  const shippingCharge = shipping.shippingCharge || 0;
  const grandTotal = itemsPrice - discountAmount + shippingCharge;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.brandName}>ARIX GEAR</Text>
            <Text style={{ fontSize: 8, color: "#6B7280", marginTop: 2 }}>PREMIUM TECH SOLUTIONS</Text>
          </View>
          <Text style={styles.invoiceTag}>Invoice #{order.orderId}</Text>
        </View>

        {/* Details Grid */}
        <View style={styles.detailsContainer}>
          <View style={styles.column}>
            <Text style={styles.sectionLabel}>Billed To</Text>
            <Text style={[styles.detailText, { fontWeight: "bold" }]}>{shipping.name}</Text>
            <Text style={styles.detailText}>{shipping.address}</Text>
            <Text style={styles.detailText}>{shipping.city}, {shipping.postalCode}</Text>
            <Text style={styles.detailText}>{shipping.phoneNumber}</Text>
          </View>
          
          <View style={[styles.column, { textAlign: "right" }]}>
            <Text style={styles.sectionLabel}>Order Date</Text>
            <Text style={styles.detailText}>{new Date(order.createdAt).toLocaleDateString()}</Text>


            <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Payment Method</Text>
            <Text style={[styles.statusText, { color: order.isPaid ? "#10B981" : "#EF4444" }]}>
            {order.paymentMethod}
            </Text>


            {/* Dynamic Status Section */}
            <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Payment Status</Text>
            <Text style={[styles.statusText, { color: order.isPaid ? "#10B981" : "#EF4444" }]}>
            {order.paymentStatus}
            </Text>

            <Text style={[styles.sectionLabel, { marginTop: 10 }]}>Delivery Status</Text>
            <Text style={[styles.statusText, { color: order.isDelivered ? "#10B981" : "#3B82F6" }]}>
              {order.isDelivered}
            </Text>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colProduct, styles.headerLabel]}>Product Description</Text>
            <Text style={[styles.colQty, styles.headerLabel]}>Qty</Text>
            <Text style={[styles.colTotal, styles.headerLabel]}>Total Amount</Text>
          </View>

          {orderItems.map((item, index) => {
            const finalPrice = item.qty * (item.price - (item.discountPercentage / 100) * item.price);
            return (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.colProduct}>{item.name}</Text>
                <Text style={styles.colQty}>{item.qty}</Text>
                <Text style={styles.colTotal}>BDT {finalPrice.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals Section */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={{ fontSize: 9, color: "#9CA3AF" }}>Subtotal</Text>
              <Text style={{ fontSize: 9 }}>{itemsPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={{ fontSize: 9, color: "#9CA3AF" }}>Shipping</Text>
              <Text style={{ fontSize: 9 }}>{shippingCharge.toFixed(2)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={{ fontSize: 9, color: "#9CA3AF" }}>Discount</Text>
                <Text style={{ fontSize: 9, color: "#EF4444" }}>-{discountAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.totalRow}>
              <Text style={{ fontSize: 11, fontWeight: "bold" }}>Grand Total</Text>
              <Text style={{ fontSize: 11, fontWeight: "bold" }}>BDT {grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: "#111827", fontWeight: "bold", marginBottom: 5 }]}>
            Thank you for your business.
          </Text>
          <Text style={styles.footerText}>
            This is a digital invoice for your purchase at AriX GeaR. 
            For any queries, please reach out to our support team.
          </Text>
          <Text style={[styles.footerText, { marginTop: 10 }]}>www.arixgear.com</Text>
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePDF;