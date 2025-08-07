import { useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, Select } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import moment from "moment";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { useMessageApi } from "../context/MessageContext";

const { Option } = Select;

const TaskList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const messageApi = useMessageApi();

  const { data: tasks, isLoading } = useQuery(["tasks", statusFilter], () =>
    fetchTasks(statusFilter)
  );

  const createMutation = useMutation(createTask, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("tasks");
      messageApi.success(data.message || "Task created successfully");
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error(error.response?.data?.error || "Failed to create task");
    },
  });

  const updateMutation = useMutation(updateTask, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("tasks");
      messageApi.success(data.message || "Task updated successfully");
      setIsModalVisible(false);
      setEditingTask(null);
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error(error.response?.data?.error || "Failed to update task");
    },
  });

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("tasks");
      messageApi.success(data.message || "Task deleted successfully");
      setIsDeleteModalVisible(false);
      setTaskToDelete(null);
    },
    onError: (error) => {
      messageApi.error(error.response?.data?.error || "Failed to delete task");
      setIsDeleteModalVisible(false);
      setTaskToDelete(null);
    },
  });

  const handleAddEdit = () => {
    setEditingTask(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: task.dueDate ? moment(task.dueDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const taskData = {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
      };
      if (editingTask) {
        updateMutation.mutate({ ...taskData, _id: editingTask._id });
      } else {
        createMutation.mutate(taskData);
      }
    } catch {
      console.log("Please fill required fields");
    }
  };

  const handleDelete = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(taskToDelete);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color;
        switch (status) {
          case "Pending":
            color = "#FA8C16";
            break;
          case "In Progress":
            color = "#1890FF";
            break;
          case "Completed":
            color = "#52C41A";
            break;
          default:
            color = "#000";
        }
        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "8px",
              fontWeight: "bold",
              color,
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Select
          style={{ width: 200 }}
          placeholder="Filter by status"
          allowClear
          onChange={(value) => setStatusFilter(value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
          <Option value={null}>All</Option>
        </Select>
        <Button type="primary" onClick={handleAddEdit}>
          Add Task
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={tasks?.tasks || []}
        loading={isLoading}
        rowKey="_id"
      />
      <Modal
        title={editingTask ? "Edit Task" : "Add Task"}
        open={isModalVisible}
        okText={editingTask ? "Update" : "Add"}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTask(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
};

export default TaskList;
