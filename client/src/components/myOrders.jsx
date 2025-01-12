import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./nav";

const ViewUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3005/viewOrders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancellingOrderId(orderId);
    try {
      const response = await axios.post(
        "http://localhost:3005/cancelOrder",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Order canceled successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "Canceled" } : order
          )
        );
      } else {
        alert("Failed to cancel order: " + response.data.message);
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("An error occurred while canceling the order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-6 mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-lg text-gray-500">No orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-lg p-4 relative"
              >
                <p className="text-gray-500 mb-4">
                  Order Date: {new Date(order.createdAt).toLocaleString()}
                </p>
                <h5 className="font-semibold mb-2 text-gray-700">Products:</h5>
                <ul className="space-y-4">
                  {order.products.map((product) => {
                    // Ensure product.productId exists before accessing its properties
                    const productId = product.productId || {};
                    const imageUrl =
                      productId.images && productId.images[0]
                        ? `http://localhost:3005/${productId.images[0].url.replace(/\\/g, "/")}`
                        : "https://via.placeholder.com/100";

                    // Log imageUrl for debugging
                    console.log("Image URL:", imageUrl);

                    return (
                      <li key={productId._id} className="flex items-center">
                        <img
                          src={imageUrl}
                          alt="Product"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/100")
                          }
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <p className="text-gray-700 font-semibold">
                            {productId.name || "Unknown Product"}
                          </p>
                          <p className="text-gray-500">
                            Price: ${productId.price || "N/A"}
                          </p>
                          <p className="text-gray-500">
                            Quantity: {product.quantity}
                          </p>
                          <p className="text-gray-500">
                            Subtotal: ${product.quantity * (productId.price || 0)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-4 text-gray-700 font-bold">
                  Total Order Price: $
                  {order.totalPrice ||
                    order.products.reduce(
                      (sum, product) =>
                        sum + product.quantity * (product.productId?.price || 0),
                      0
                    )}
                </p>
                <p
                  className={`mt-2 font-semibold ${
                    order.status === "Canceled"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  Status: {order.status || "Active"}
                </p>
                {order.status !== "Canceled" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancellingOrderId === order._id}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {cancellingOrderId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUserOrders;
