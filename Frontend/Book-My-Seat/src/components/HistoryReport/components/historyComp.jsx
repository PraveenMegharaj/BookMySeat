import React, { useEffect, useState } from "react";
import "../styles/histroyComp.css";
import { useNavigate } from "react-router-dom";

const OrderData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  var saveddata = {
    username: "",
    password: "",
    remember: "",
  };

  var isLoggedIn = false;
  var [orders, setOrders] = useState([]);
  var [prices, setPriceData] = useState([]);

  useEffect(() => {
    var retrievedData = JSON.parse(localStorage.getItem("OrderData")) || [];
    setOrders(retrievedData || []);
    // console.log("OrderData: ", retrievedData);
    var retrievedPrice = JSON.parse(localStorage.getItem("PriceData")) || [];
    setPriceData(retrievedPrice);
  }, []);

  isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  console.log(isLoggedIn);

  const mergedArray = orders.map((value, index) => ({
    order: value,
    price: prices[index],
  }));
  console.log(mergedArray);

  let filteredOrders = mergedArray.filter(({ order }) =>
    order.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrders = sortOption
    ? [...filteredOrders].sort((a, b) => {
        if (sortOption === "id") {
          return a.order.localeCompare(b.order);
        } else if (sortOption === "total-increasing") {
          return a.price - b.price;
        } else if (sortOption === "total-decreasing") {
          return b.price - a.price;
        }
        return 0;
      })
    : filteredOrders;

  useEffect(() => {
    // Update selectAll state when selectedItems change
    if (
      selectedItems.length === filteredOrders.length &&
      selectedItems.length
    ) {
      setSelectAll(selectedItems.every((item) => item));
    }
  }, [selectedItems, setSelectAll]);

  const handleCheckboxChange = (index) => {
    //handle click on each and every checkbox instead of header one
    const updatedSelectedItems = [...selectedItems];
    updatedSelectedItems[index] = !updatedSelectedItems[index];
    setSelectedItems(updatedSelectedItems);
  };

  const handleSelectAllChange = () => {
    //handle click header checkbox
    const updatedSelectAll = !selectAll;
    setSelectAll(updatedSelectAll);
    setSelectedItems(Array(sortedOrders.length).fill(updatedSelectAll));
  };

  let logoutHandler = () => {
    navigate("/admin");
    localStorage.setItem("formData", JSON.stringify(saveddata));
    isLoggedIn = false;
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="order-details">
          <div className="orderHeader">
            <div className="input-tags">
              <input
                type="text"
                className="searchByText"
                name="searchbytext"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <label htmlFor="sort-by">Sort By</label>
              <select
                name="sortBy"
                id="sort-by"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Choose...</option>
                <option value="id">Order ID</option>
                <option value="total-increasing">Total-Increasing</option>
                <option value="total-decreasing">Total-Decreasing</option>
              </select>
            </div>

            <button className="logout-btn" onClick={logoutHandler}>
              {" "}
              <strong>Sign Out</strong>{" "}
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th className="row1">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    name="selection-all-inp"
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Order Status</th>
              </tr>
            </thead>

            <tbody>
              {sortedOrders.map(({ order, price }, index) => (
                <tr key={index}>
                  <td className="row1">
                    <input
                      type="checkbox"
                      name="selection-inp"
                      checked={selectedItems[index] || false}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td>{order}</td>
                  <td>August 05 2018 10:29 PM</td>
                  <td>
                    <span className="payment-status">
                      <i
                        className="fa-solid fa-money-bill"
                        style={{ color: "#18c002" }}
                      ></i>{" "}
                      Paid
                    </span>
                  </td>
                  <td>${price}</td>
                  <td>Mastercard</td>
                  <td>
                    <span className="order-status">Processing</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        navigate("/admin")
      )}
    </>
  );
};

export default OrderData;
