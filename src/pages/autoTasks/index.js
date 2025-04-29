import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Space,
  Select,
  Card,
  notification,
  Badge,
  Spin,
} from 'antd';
import {
  UsergroupAddOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import teamGroupService from '../../services/teamGroup';
import formService from '../../services/form';
import taskService from '../../services/taskAuto';
import DefaultLayout from '../../components/layout/DefaultLayout';
import Header from '../../components/header';
import { useSelector } from 'react-redux';
import UserComponent from "./../../components/user/index";

const { Option } = Select;

const AutoTasks = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form] = Form.useForm();

  const [formNames, setformNames] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskLists, setTaskLists] = useState([]);

  const [teamGroups, setTeamGroups] = useState([]);
  const [groupTeamMembers, setGroupTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formId, setFormId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const [taskData, setTaskData] = useState([
    { forms: undefined, key: undefined, teams: undefined, member: undefined },
  ]);

  const { currentUser } = useSelector((state) => state.user);

  const permissions = currentUser?.['roles.permission'] || [];
  const haveAddPermission = permissions.some(permission => permission.name === 'AssignTask-create');
  const haveEditPermission = permissions.some(permission => permission.name === 'AssignTask-edit');

  const columns = [
    {
      title: 'Form',
      dataIndex: ['form', 'name'],
      key: ['form', 'name'],
      // sorter: (a, b) => a.sequence_no.localeCompare(b.sequence_no),
    },

    {
      title: 'Users',
      dataIndex: ['user', 'name'],
      key: ['user', 'name'],
      // sorter: (a, b) => a.sequence_no.localeCompare(b.sequence_no),
    },
    // {
    //   title: 'Task Status',
    //   dataIndex: ['task_status', 'name'],
    //   key: ['task_status', 'name'],
    //   sorter: (a, b) => a.task_status?.name.localeCompare(b.task_status?.name),
    // },
    // {
    //   title: 'Assigned Team',
    //   dataIndex: 'assigned_task_team',
    //   key: 'assigned_task_team',
    //   render: (assignedTaskTeams) => {
    //     const teamNames = assignedTaskTeams.map((team) => team.team.name).join(', ');
    //     return <span>{teamNames}</span>;
    //   },
    //   sorter: (a, b) => {
    //     const teamNamesA = a.assigned_task_team.map((team) => team.team.name).join(', ');
    //     const teamNamesB = b.assigned_task_team.map((team) => team.team.name).join(', ');
    //     return teamNamesA.localeCompare(teamNamesB);
    //   },
    // },
    // {
    //   title: 'Members',
    //   dataIndex: 'assigned_task_team',
    //   key: 'members',
    //   render: (assignedTaskTeams) => {
    //     const members = assignedTaskTeams.flatMap((team) => team.members.map((member) => member.name)).join(', ');
    //     return <span>{members}</span>;
    //   },
    //   sorter: (a, b) => {
    //     const membersA = a.assigned_task_team.flatMap((team) => team.members.map((member) => member.name)).join(', ');
    //     const membersB = b.assigned_task_team.flatMap((team) => team.members.map((member) => member.name)).join(', ');
    //     return membersA.localeCompare(membersB);
    //   },
    // },
    // {
    //   title: 'Email',
    //   dataIndex: 'assigned_task_team',
    //   key: 'emails',
    //   render: (assignedTaskTeams) => {
    //     const emails = assignedTaskTeams.flatMap((team) => team.members.map((member) => member.email)).join(', ');
    //     return <span>{emails}</span>;
    //   },
    //   sorter: (a, b) => {
    //     const emailsA = a.assigned_task_team.flatMap((team) => team.members.map((member) => member.email)).join(', ');
    //     const emailsB = b.assigned_task_team.flatMap((team) => team.members.map((member) => member.email)).join(', ');
    //     return emailsA.localeCompare(emailsB);
    //   },
    // },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <>

          <Link to={record.url} style={{ marginRight: '5px' }}>
            <EyeOutlined />
          </Link>

          {haveEditPermission && (
            <Space>
              <Link onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }} className='mr-3'>
                <EditOutlined />
              </Link>
            </Space>
          )}

        </>
      ),
    },
  ];


  const getTasks = async (page = 1, itemsPerPage = 10) => {
    setLoading(true);
    try {
      const response = await taskService.getTasks(page, itemsPerPage);
      console.log('responsedata')
      console.log(response.data)
      console.log('responsedata')
      setTotalDataCount(response.total);
      setCurrentPage(response.current_page);
      setTaskLists(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };


  const getForms = async () => {
    try {
      const forms = await formService.getForms();
      setformNames(forms.data);
    } catch (error) {
      console.error('Error getting forms:', error);
      return [];
    }
  };

  const getServiceDeskAllTask = async (id) => {

    try {
      const response = await formService.getServiceDeskAllTask(id);
      setFormId(id);
      setTasks(response.data);
    } catch (error) {
    }
  };

  const getFormGroup = async (id) => {
    //console.log(id)
    try {
      const response = await teamGroupService.getFormGroup(id);
      //console.log(response);
      setTeamGroups(response);
    } catch (error) {
    }
  };

  const getGroupTeamMembers = async (id) => {
    setLoading(true);
    let recordId = typeof id === 'object' ? id.value : id;
    try {
      const response = await teamGroupService.getGroupTeamMembers(recordId);
      setLoading(false);
      console.log(response)
      setGroupTeamMembers(response);
    } catch (error) {
    }
  };

  useEffect(() => {
    getForms();
    getTasks();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEdit(null);
    form.resetFields();
  };

  const handleEdit = async (record) => {
    setLoading(true);
    setEdit(record);
    setIsModalVisible(true);

    console.log('record')
    console.log(record)
    console.log('record')

    const selectedTaskData = record.teams.map((team) => ({
      team_id: team.team.id,
          // member_ids: team.member.id,
      member_ids: team.members.map((member) => member.id),
    }));

    setTaskData(selectedTaskData);

    try {
      await Promise.all([getFormGroup(record.form?.id)]);

      setLoading(false);
      record.teams.forEach((team) => {
        getGroupTeamMembers(team.team.id);
      });

      const initialValues = {
        form_id: record.form.id,
        user_id: record.user.id,
        key: record.task_name,
        teams: record.teams.map((team) => ({
          id: team.team.id,
          team_id: team.team.id,
          // member_ids: team.member.id,
          member_ids: team.members.map((member) => (member.id)),
        })),
      };

      form.setFieldsValue(initialValues);


    } catch (error) {
      console.error('Error fetching forms and tasks:', error);
    }
  };


  const onFinish = async (values) => {

    const formattedValues = {
      ...values,
      teams: values.teams.map(team => ({
        ...team,
        member_ids: Array.isArray(team.member_ids) ? team.member_ids : [team.member_ids]
      }))
    };
    
    console.log(values)
    setLoading(true);
    try {
      if (edit) {
        //console.log('edit')
        const response = await taskService.updateTask(edit.id, formattedValues);
        console.log(response)
        if (response.success) {
          notification.success({
            message: 'Task Updated',
            description: "Task Updated Successfully",
          });

          setEdit(null);
          form.resetFields();
        }
      } else {
        //console.log('post')
        const response = await taskService.postTask(formattedValues);
        //console.log(response)
        if (response.success) {
          notification.success({
            message: 'Task Added',
            description: "Task Added Successfully",
          });
        }
      }
      setIsModalVisible(false);
      getTasks(currentPage);
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };


  const removeManagerGroup = (index) => {
    setTaskData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const renderTaskDetails = () => {
    return taskData.map((data, index) => (
      <div key={`task-${index}`}>
        <Card
          size="small"
          title={
            <span>
              <Badge color="#2d77fa" count={index + 1} /> Task Details
            </span>
          }
          className="mb-10"
        >
          <Row gutter={[12, 12]}>

            <Col span={24}>
              <Form.Item
                name={['teams', index, 'team_id']}
                label={`Team Groups`}
                rules={[{ required: true, message: 'Please select Team Group' }]}
              >
                <Select
                  showSearch={true}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                  size="large"
                  onChange={(data) => {
                    getGroupTeamMembers(data);
                    form.setFieldsValue({ ['teams']: { [index]: { ['member_ids']: undefined } } });
                  }}

                >
                  {teamGroups &&
                    teamGroups.map((group, index) => (
                      <Option key={group.id} value={group.id} >
                        {group.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={['teams', index, 'member_ids']}
                label={`Team Members`}
                rules={[{ required: true, message: 'Please select Team Members' }]}
              >
                <Select
                  mode="multiple"
                  showSearch={true}
                  optionFilterProp="children"
                  style={{ width: '100%' }}
                  size="large"
                >
                  {groupTeamMembers &&
                    groupTeamMembers.members?.map((member, index) => (
                      <Option key={member.id} value={member.id}>
                        {member.name} - {member.email}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {index > 0 && (
          <div className="textRight mb-10">
            <Button type="dashed" onClick={() => removeManagerGroup(index)}>
              Remove
            </Button>
          </div>
        )}
      </div>
    ));
  };

  const handleAddManager = () => {
    setTaskData((prevData) => [
      ...prevData,
      { forms: undefined, key: undefined, teams: undefined, member: undefined },
    ]);
  };

  const handleAddManagerForNewRecord = () => {
    setTaskData((prevData) => [
      { forms: undefined, key: undefined, teams: undefined, member: undefined },
    ]);
  };

  return (
    <DefaultLayout>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Header
            icon={<UsergroupAddOutlined />}
            title="Auto Assign Task"
            right={
              haveAddPermission ? (
                <Button
                  className="btn-blue"
                  type="primary"
                  onClick={() => {
                    showModal();
                    handleAddManagerForNewRecord();
                  }}
                >
                  Create Auto Assign 
                </Button>
              ) : null
            }
          />

        </Col>
      </Row>

      <Card>
        <Table
          scroll={{ x: 1200 }}
          sticky={true}
          style={{ minHeight: '100vh' }}
          loading={loading}
          columns={columns}
          dataSource={taskLists.map((item) => ({ ...item, key: item.id }))}
          pagination={{
            total: totalDataCount,
            current: currentPage,
            pageSize: itemsPerPage,
            onChange: (page, pageSize) => getTasks(page, pageSize),
          }}
        />

      </Card>

      <Modal
        style={{ top: 14 }}
        title={edit ? 'Edit Manager' : 'Add Task'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="mt-20"
        >

          {/*{!edit && (*/}
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <Form.Item
                  name={'form_id'}
                  label={`Form`}
                  rules={[{ required: true, message: 'Please select Form' }]}
                >
                  <Select
                    showSearch={true}
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    size="large"
                    onChange={(value) => {
                      form.resetFields(['key', 'teams']);
                      getServiceDeskAllTask(value)
                      getFormGroup(value)
                    }}
                  >
                    {formNames &&
                      formNames.map((formName) => (
                        <Option key={formName.id} value={formName.id}>
                          {formName.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name={'user_id'}
                  label={`Select User`}
                  rules={[{ required: true, message: 'Please select User' }]}
                >
                <UserComponent />
                {/*<UserComponent mode="multiple" />*/}

                </Form.Item>
              </Col>
            </Row>

          {/* })} */}

          <Spin spinning={loading}>
            {renderTaskDetails()}
          </Spin>

          <div
            style={{ display: 'flex', justifyContent: 'space-between' }}
            className="mb-20"
          >
            <Button type="dashed" onClick={handleAddManager}>
              Add More
            </Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {edit ? 'Save Changes' : 'Add Auto Assign'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default AutoTasks;
