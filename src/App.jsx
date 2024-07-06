import React, { useState } from "react";
import { Layout, Button } from "antd";
import OrderForm from "./components/form";

const { Content } = Layout;

function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <Layout className="layout">
      <Content style={{ padding: "50px" }}>
        <h1>Pipedrive Integration</h1>
        <Button type="primary" onClick={showModal}>
          Place Order
        </Button>
        <OrderForm visible={modalVisible} onClose={hideModal} />
      </Content>
    </Layout>
  );
}

export default App;
