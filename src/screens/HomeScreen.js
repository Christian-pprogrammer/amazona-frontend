import axios from "axios";
import { useState, useEffect, useReducer } from "react";
// import data from '../data';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
  }
};

function HomeScreen() {
  const [{ products, loading, error }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const results = await axios.get("/api/products");
        console.log(results.data)
        dispatch({ type: "FETCH_SUCCESS", payload: results.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger" message={error} />
        ) : (
          <Row>
            {products.length > 0 &&
              products.map((product) => (
                <Col sm={6} lg={3} key={product.slug}>
                  <Product product={product} />
                </Col>
              ))}
          </Row>
        )}
      </div>
    </>
  );
}

export default HomeScreen;
