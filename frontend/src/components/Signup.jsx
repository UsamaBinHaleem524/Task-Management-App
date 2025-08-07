import { Form, Input, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useMessageApi } from "../context/MessageContext.jsx";

const Signup = () => {
  const { Text, Link } = Typography;
  const { signup } = useAuth();
  const navigate = useNavigate();
  const message = useMessageApi();

  const onFinish = async (values) => {
    try {
      await signup(values.email, values.password);
      message.success("Signup successful.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      message.error(error?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Sign Up</h2>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email",
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
            {
              min: 6,
              message: "Password must be at least 6 characters",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
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
            Sign Up
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: "left", marginTop: -8 }}>
          <Text>Already have an account? </Text>
          <Link
            onClick={() => navigate("/login")}
            style={{ textDecoration: "underline" }}
          >
            Log in
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;
