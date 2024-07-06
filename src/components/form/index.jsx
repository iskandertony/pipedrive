import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  message,
  Select,
  DatePicker,
  Card,
  Spin,
} from "antd";
import axios from "axios";
import moment from "moment";
import "./style.scss";

const { Option } = Select;

const OrderForm = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [users, setUsers] = useState([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [dealLink, setDealLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const stagesData = await getStages();
      setStages(stagesData);
      const usersData = await getUsers();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const submitData = async (values) => {
    setLoading(true);
    try {
      const personResponse = await axios.post(
        "https://api.pipedrive.com/v1/persons?api_token=89a00ee329df732768497bd630d0a4ca97ef4205",
        {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone: values.phone,
        },
      );

      const personId = personResponse.data.data.id;
      const dealResponse = await axios.post(
        "https://api.pipedrive.com/v1/deals?api_token=89a00ee329df732768497bd630d0a4ca97ef4205",
        {
          title: values.title,
          person_id: personId,
          value: values.value,
          currency: values.currency,
          user_id: values.userId,
          stage_id: values.stageId,
          status: values.status,
          expected_close_date: values.expectedCloseDate.format("YYYY-MM-DD"),
          visible_to: values.visibleTo,
        },
      );

      setDealLink(
        `https://app.pipedrive.com/deal/${dealResponse.data.data.id}`,
      );
      message.success("Order successfully placed!");
      form.resetFields();
      setLoading(false);
      onClose();
      setSuccessModalVisible(true);
    } catch (error) {
      message.error("Error placing order. Please try again.");
      setLoading(false);
    }
  };

  const fillMockData = () => {
    form.setFieldsValue({
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      email: "john.doe@example.com",
      title: "Test Deal",
      value: "1000",
      currency: "USD",
      stageId: stages.length > 0 ? stages[0].id : null,
      userId: users.length > 0 ? users[0].id : null,
      status: "open",
      expectedCloseDate: moment(),
      visibleTo: 1,
    });
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };

  return (
    <>
      <Modal open={visible} onCancel={onClose} footer={null}>
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={submitData}
            requiredMark={false}
            className="content"
            layout="vertical"
          >
            <div className="flower">
              <Card title="Personal Information">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please input your phone!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input />
                </Form.Item>
              </Card>
              <Card title="Deal Information">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Please input title!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Value"
                  name="value"
                  rules={[{ required: true, message: "Please input value!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Currency"
                  name="currency"
                  rules={[
                    { required: true, message: "Please input currency!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Stage"
                  name="stageId"
                  rules={[
                    { required: true, message: "Please select a stage!" },
                  ]}
                >
                  <Select>
                    {stages.map((stage) => (
                      <Option key={stage.id} value={stage.id}>
                        {stage.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
            </div>
            <div className="flower">
              <Card title="User Information">
                <Form.Item
                  label="User"
                  name="userId"
                  rules={[{ required: true, message: "Please select a user!" }]}
                >
                  <Select>
                    {users.map((user) => (
                      <Option key={user.id} value={user.id}>
                        {user.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>
              <Card title="Additional Information">
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[
                    { required: true, message: "Please select a status!" },
                  ]}
                >
                  <Select>
                    <Option value="open">Open</Option>
                    <Option value="won">Won</Option>
                    <Option value="lost">Lost</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Expected Close Date" name="expectedCloseDate">
                  <DatePicker />
                </Form.Item>
                <Form.Item label="Visible To" name="visibleTo">
                  <Select>
                    <Option value={0}>Only me</Option>
                    <Option value={1}>Whole company</Option>
                  </Select>
                </Form.Item>
              </Card>
            </div>
            <div className="btns">
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="default" onClick={fillMockData}>
                  Mock Data
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Spin>
      </Modal>
      <Modal
        open={successModalVisible}
        onCancel={handleSuccessModalClose}
        footer={null}
      >
        <h2>Order successfully placed!</h2>
        <p>
          <a href={dealLink} target="_blank" rel="noopener noreferrer">
            View Details
          </a>
        </p>
        <Button type="primary" onClick={handleSuccessModalClose}>
          Close
        </Button>
      </Modal>
    </>
  );
};

const getStages = async () => {
  const response = await axios.get(
    "https://api.pipedrive.com/v1/stages?api_token=89a00ee329df732768497bd630d0a4ca97ef4205",
  );
  return response.data.data;
};

const getUsers = async () => {
  const response = await axios.get(
    "https://api.pipedrive.com/v1/users?api_token=89a00ee329df732768497bd630d0a4ca97ef4205",
  );
  return response.data.data;
};

export default OrderForm;
