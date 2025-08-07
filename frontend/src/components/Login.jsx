import { Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useMessageApi } from "../context/MessageContext.jsx";

const Login = () => {
  const { Text, Link } = Typography;
  const { login } = useAuth();
  const navigate = useNavigate();
  const message = useMessageApi();

  const onFinish = async (values) => {
    try {
      const res = await login(values.email, values.password);
      message.success(res.message);
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (error) {
      console.log(">>>error", error);
      message.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Email is required",
            },
          ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ marginTop: 8 }}
          >
            Login
          </Button>
        </Form.Item>
        <Text>Don't have an account? </Text>
        <Link
          onClick={() => navigate("/signup")}
          style={{ textDecoration: "underline" }}
        >
          Sign up
        </Link>
      </Form>
    </div>
  );
};

export default Login;
