import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Input, Space, Modal, Form, Select, message, Tabs, Steps, Divider, Tag, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, NodeIndexOutlined, SaveOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import './Workflow.css';

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface WorkflowTemplate {
  id: number;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStep {
  id: number;
  name: string;
  type: 'approval' | 'notification' | 'condition';
  approvers?: string[];
  notifyTo?: string[];
  condition?: string;
  order: number;
}

interface WorkflowInstance {
  id: number;
  templateId: number;
  templateName: string;
  businessType: string;
  businessId: number;
  businessName: string;
  initiator: string;
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
  history: WorkflowHistory[];
  createdAt: string;
  updatedAt: string;
}

interface WorkflowHistory {
  stepId: number;
  stepName: string;
  operator: string;
  action: 'approve' | 'reject' | 'comment';
  comment?: string;
  timestamp: string;
}

const Workflow: React.FC = () => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isStepModalVisible, setIsStepModalVisible] = useState(false);
  const [isInstanceModalVisible, setIsInstanceModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<WorkflowTemplate | null>(null);
  const [currentInstance, setCurrentInstance] = useState<WorkflowInstance | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [templateForm] = Form.useForm();
  const [stepForm] = Form.useForm();
  const [instanceForm] = Form.useForm();

  // 模拟获取工作流模板数据
  useEffect(() => {
    fetchWorkflowTemplates();
    fetchWorkflowInstances();
  }, []);

  const fetchWorkflowTemplates = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: WorkflowTemplate[] = [
        {
          id: 1,
          name: '请假审批流程',
          description: '员工请假的标准审批流程',
          type: 'leave',
          status: 'active',
          steps: [
            {
              id: 1,
              name: '部门经理审批',
              type: 'approval',
              approvers: ['部门经理'],
              order: 1
            },
            {
              id: 2,
              name: '人力资源审批',
              type: 'approval',
              approvers: ['HR专员'],
              order: 2
            },
            {
              id: 3,
              name: '通知申请人',
              type: 'notification',
              notifyTo: ['申请人'],
              order: 3
            }
          ],
          createdBy: '管理员',
          createdAt: '2023-05-10 10:00:00',
          updatedAt: '2023-05-10 10:00:00'
        },
        {
          id: 2,
          name: '报销审批流程',
          description: '员工报销的标准审批流程',
          type: 'expense',
          status: 'active',
          steps: [
            {
              id: 4,
              name: '部门经理审批',
              type: 'approval',
              approvers: ['部门经理'],
              order: 1
            },
            {
              id: 5,
              name: '财务审批',
              type: 'approval',
              approvers: ['财务专员'],
              order: 2
            },
            {
              id: 6,
              name: '金额判断',
              type: 'condition',
              condition: '金额 > 5000',
              order: 3
            },
            {
              id: 7,
              name: '总经理审批',
              type: 'approval',
              approvers: ['总经理'],
              order: 4
            }
          ],
          createdBy: '管理员',
          createdAt: '2023-05-15 14:30:00',
          updatedAt: '2023-05-15 14:30:00'
        }
      ];

      setTemplates(mockData);
      setLoading(false);
    }, 500);
  };

  // 模拟获取工作流实例数据
  const fetchWorkflowInstances = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      const mockData: WorkflowInstance[] = [
        {
          id: 1,
          templateId: 1,
          templateName: '请假审批流程',
          businessType: 'leave',
          businessId: 3,
          businessName: '张三的请假申请',
          initiator: '张三',
          currentStep: 1,
          status: 'pending',
          history: [
            {
              stepId: 1,
              stepName: '部门经理审批',
              operator: '李四',
              action: 'approve',
              comment: '同意',
              timestamp: '2023-06-10 09:30:00'
            }
          ],
          createdAt: '2023-06-10 08:00:00',
          updatedAt: '2023-06-10 09:30:00'
        },
        {
          id: 2,
          templateId: 2,
          templateName: '报销审批流程',
          businessType: 'expense',
          businessId: 5,
          businessName: '王五的报销申请',
          initiator: '王五',
          currentStep: 2,
          status: 'pending',
          history: [
            {
              stepId: 4,
              stepName: '部门经理审批',
              operator: '赵六',
              action: 'approve',
              comment: '同意报销',
              timestamp: '2023-06-12 11:20:00'
            }
          ],
          createdAt: '2023-06-12 10:00:00',
          updatedAt: '2023-06-12 11:20:00'
        },
        {
          id: 3,
          templateId: 1,
          templateName: '请假审批流程',
          businessType: 'leave',
          businessId: 7,
          businessName: '李四的请假申请',
          initiator: '李四',
          currentStep: 3,
          status: 'approved',
          history: [
            {
              stepId: 1,
              stepName: '部门经理审批',
              operator: '赵六',
              action: 'approve',
              comment: '同意',
              timestamp: '2023-06-05 14:10:00'
            },
            {
              stepId: 2,
              stepName: '人力资源审批',
              operator: '人力专员',
              action: 'approve',
              comment: '已确认假期余额',
              timestamp: '2023-06-05 16:30:00'
            }
          ],
          createdAt: '2023-06-05 13:00:00',
          updatedAt: '2023-06-05 16:30:00'
        }
      ];

      setInstances(mockData);
      setLoading(false);
    }, 500);
  };

  // 打开新建工作流模板模态框
  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    templateForm.resetFields();
    setIsTemplateModalVisible(true);
  };

  // 打开编辑工作流模板模态框
  const handleEditTemplate = (record: WorkflowTemplate) => {
    setCurrentTemplate(record);
    templateForm.setFieldsValue({
      name: record.name,
      description: record.description,
      type: record.type,
      status: record.status
    });
    setIsTemplateModalVisible(true);
  };

  // 打开添加/编辑步骤模态框
  const handleManageSteps = (record: WorkflowTemplate) => {
    setCurrentTemplate(record);
    setCurrentStep(null);
    stepForm.resetFields();
    setIsStepModalVisible(true);
  };

  // 打开添加/编辑步骤模态框
  const handleAddStep = () => {
    setCurrentStep(null);
    stepForm.resetFields();
    stepForm.setFieldsValue({
      order: currentTemplate?.steps.length ? currentTemplate.steps.length + 1 : 1
    });
  };

  // 打开编辑步骤模态框
  const handleEditStep = (step: WorkflowStep) => {
    setCurrentStep(step);
    stepForm.setFieldsValue({
      name: step.name,
      type: step.type,
      approvers: step.approvers,
      notifyTo: step.notifyTo,
      condition: step.condition,
      order: step.order
    });
  };

  // 删除步骤
  const handleDeleteStep = (stepId: number) => {
    if (!currentTemplate) return;
    
    const updatedSteps = currentTemplate.steps.filter(step => step.id !== stepId);
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index + 1
    }));
    
    const updatedTemplate = {
      ...currentTemplate,
      steps: reorderedSteps
    };
    
    setCurrentTemplate(updatedTemplate);
    
    // 在实际应用中，这里应该调用API保存更改
    message.success('步骤已删除');
  };

  // 提交工作流模板表单
  const handleSubmitTemplate = () => {
    templateForm.validateFields().then(values => {
      // 模拟API请求
      setTimeout(() => {
        if (currentTemplate) {
          // 更新工作流模板
          const updatedTemplates = templates.map(template => {
            if (template.id === currentTemplate.id) {
              return {
                ...template,
                ...values,
                updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
              };
            }
            return template;
          });
          setTemplates(updatedTemplates);
          message.success('工作流模板已更新');
        } else {
          // 创建新工作流模板
          const newTemplate: WorkflowTemplate = {
            id: templates.length + 1,
            ...values,
            steps: [],
            createdBy: '管理员', // 假设当前用户为管理员
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
          setTemplates([...templates, newTemplate]);
          message.success('工作流模板已创建');
        }
        setIsTemplateModalVisible(false);
      }, 500);
    });
  };

  // 提交步骤表单
  const handleSubmitStep = () => {
    if (!currentTemplate) return;
    
    stepForm.validateFields().then(values => {
      // 模拟API请求
      setTimeout(() => {
        let updatedSteps;
        
        if (currentStep) {
          // 更新步骤
          updatedSteps = currentTemplate.steps.map(step => {
            if (step.id === currentStep.id) {
              return {
                ...step,
                ...values
              };
            }
            return step;
          });
        } else {
          // 创建新步骤
          const newStep: WorkflowStep = {
            id: Math.max(0, ...currentTemplate.steps.map(s => s.id)) + 1,
            ...values
          };
          updatedSteps = [...currentTemplate.steps, newStep];
        }
        
        // 按顺序排序
        updatedSteps.sort((a, b) => a.order - b.order);
        
        const updatedTemplate = {
          ...currentTemplate,
          steps: updatedSteps,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        
        // 更新模板列表
        const updatedTemplates = templates.map(template => {
          if (template.id === currentTemplate.id) {
            return updatedTemplate;
          }
          return template;
        });
        
        setTemplates(updatedTemplates);
        setCurrentTemplate(updatedTemplate);
        setCurrentStep(null);
        stepForm.resetFields();
        message.success(currentStep ? '步骤已更新' : '步骤已添加');
      }, 500);
    });
  };

  // 查看工作流实例详情
  const handleViewInstance = (record: WorkflowInstance) => {
    setCurrentInstance(record);
    setIsInstanceModalVisible(true);
  };

  // 获取工作流类型显示文本
  const getWorkflowTypeText = (type: string) => {
    switch (type) {
      case 'leave': return '请假';
      case 'expense': return '报销';
      case 'purchase': return '采购';
      case 'contract': return '合同';
      default: return type;
    }
  };

  // 获取工作流状态标签
  const getWorkflowStatusTag = (status: string) => {
    switch (status) {
      case 'active':
        return <Tag color="green">启用</Tag>;
      case 'inactive':
        return <Tag color="gray">禁用</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 获取工作流实例状态标签
  const getInstanceStatusTag = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="blue">进行中</Tag>;
      case 'approved':
        return <Tag color="green">已通过</Tag>;
      case 'rejected':
        return <Tag color="red">已拒绝</Tag>;
      case 'canceled':
        return <Tag color="gray">已取消</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 获取步骤类型显示文本
  const getStepTypeText = (type: string) => {
    switch (type) {
      case 'approval': return '审批';
      case 'notification': return '通知';
      case 'condition': return '条件';
      default: return type;
    }
  };

  // 获取步骤类型图标
  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <SaveOutlined />;
      case 'notification':
        return <NodeIndexOutlined />;
      case 'condition':
        return <NodeIndexOutlined />;
      default:
        return null;
    }
  };

  const templateColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getWorkflowTypeText(type),
      filters: [
        { text: '请假', value: 'leave' },
        { text: '报销', value: 'expense' },
        { text: '采购', value: 'purchase' },
        { text: '合同', value: 'contract' },
      ],
      onFilter: (value: any, record: WorkflowTemplate) => record.type === value,
    },
    {
      title: '步骤数',
      key: 'stepsCount',
      render: (text: string, record: WorkflowTemplate) => record.steps.length,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getWorkflowStatusTag(status),
      filters: [
        { text: '启用', value: 'active' },
        { text: '禁用', value: 'inactive' },
      ],
      onFilter: (value: any, record: WorkflowTemplate) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: WorkflowTemplate, b: WorkflowTemplate) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WorkflowTemplate) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditTemplate(record)}>编辑</Button>
          <Button type="link" onClick={() => handleManageSteps(record)}>管理步骤</Button>
          <Popconfirm
            title="确定要删除此工作流模板吗？"
            onConfirm={() => handleDeleteTemplate(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
          <Button 
            type="link" 
            onClick={() => handleToggleTemplateStatus(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  const instanceColumns = [
    {
      title: '业务名称',
      dataIndex: 'businessName',
      key: 'businessName',
    },
    {
      title: '工作流模板',
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (type: string) => getWorkflowTypeText(type),
      filters: [
        { text: '请假', value: 'leave' },
        { text: '报销', value: 'expense' },
        { text: '采购', value: 'purchase' },
        { text: '合同', value: 'contract' },
      ],
      onFilter: (value: any, record: WorkflowInstance) => record.businessType === value,
    },
    {
      title: '发起人',
      dataIndex: 'initiator',
      key: 'initiator',
    },
    {
      title: '当前步骤',
      key: 'currentStep',
      render: (text: string, record: WorkflowInstance) => {
        const template = templates.find(t => t.id === record.templateId);
        if (!template) return '-';
        const step = template.steps.find(s => s.order === record.currentStep);
        return step ? step.name : '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getInstanceStatusTag(status),
      filters: [
        { text: '进行中', value: 'pending' },
        { text: '已通过', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
        { text: '已取消', value: 'canceled' },
      ],
      onFilter: (value: any, record: WorkflowInstance) => record.status === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: WorkflowInstance, b: WorkflowInstance) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: (a: WorkflowInstance, b: WorkflowInstance) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: WorkflowInstance) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleViewInstance(record)}>查看详情</Button>
          {record.status === 'pending' && (
            <Popconfirm
              title="确定要取消此工作流实例吗？"
              onConfirm={() => handleCancelInstance(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger>取消</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 删除工作流模板
  const handleDeleteTemplate = (id: number) => {
    // 模拟API请求
    setTimeout(() => {
      setTemplates(templates.filter(template => template.id !== id));
      message.success('工作流模板已删除');
    }, 500);
  };

  // 切换工作流模板状态
  const handleToggleTemplateStatus = (record: WorkflowTemplate) => {
    // 模拟API请求
    setTimeout(() => {
      const newStatus = record.status === 'active' ? 'inactive' : 'active';
      const updatedTemplates = templates.map(template => {
        if (template.id === record.id) {
          return {
            ...template,
            status: newStatus,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return template;
      });
      setTemplates(updatedTemplates);
      message.success(`工作流模板已${newStatus === 'active' ? '启用' : '禁用'}`);
    }, 500);
  };

  // 取消工作流实例
  const handleCancelInstance = (id: number) => {
    // 模拟API请求
    setTimeout(() => {
      const updatedInstances = instances.map(instance => {
        if (instance.id === id) {
          return {
            ...instance,
            status: 'canceled',
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return instance;
      });
      setInstances(updatedInstances);
      message.success('工作流实例已取消');
    }, 500);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '工作流模板',
      children: (
        <>
          <div className="workflow-header">
            <Button type="primary" onClick={handleAddTemplate}>
              <PlusOutlined /> 创建工作流模板
            </Button>
          </div>
          <Table 
            columns={templateColumns} 
            dataSource={templates} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: '工作流实例',
      children: (
        <>
          <Table 
            columns={instanceColumns} 
            dataSource={instances} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="workflow-container">
      <h2>工作流管理</h2>
      
      <Tabs defaultActiveKey="1" items={items} />

      {/* 工作流模板表单 */}
      <Modal
        title={currentTemplate ? "编辑工作流模板" : "创建工作流模板"}
        open={isTemplateModalVisible}
        onOk={handleSubmitTemplate}
        onCancel={() => setIsTemplateModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form form={templateForm} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="模板描述">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="type" label="业务类型" rules={[{ required: true, message: '请选择业务类型' }]}>
            <Select>
              <Option value="leave">请假</Option>
              <Option value="expense">报销</Option>
              <Option value="purchase">采购</Option>
              <Option value="contract">合同</Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 工作流步骤管理模态框 */}
      <Modal
        title={`管理工作流步骤 - ${currentTemplate?.name}`}
        open={isStepModalVisible}
        onCancel={() => setIsStepModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentTemplate && (
          <div className="steps-container">
            <div className="steps-list">
              <Steps 
                direction="vertical" 
                current={-1}
                items={currentTemplate.steps.map(step => ({
                  title: step.name,
                  description: (
                    <div>
                      <div>类型: {getStepTypeText(step.type)}</div>
                      {step.type === 'approval' && step.approvers && (
                        <div>审批人: {step.approvers.join(', ')}</div>
                      )}
                      {step.type === 'notification' && step.notifyTo && (
                        <div>通知人: {step.notifyTo.join(', ')}</div>
                      )}
                      {step.type === 'condition' && step.condition && (
                        <div>条件: {step.condition}</div>
                      )}
                      <Space className="step-actions">
                        <Button size="small" onClick={() => handleEditStep(step)}>编辑</Button>
                        <Popconfirm
                          title="确定要删除此步骤吗？"
                          onConfirm={() => handleDeleteStep(step.id)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button size="small" danger>删除</Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  ),
                  icon: getStepTypeIcon(step.type)
                }))}
              />
            </div>
            
            <Divider />
            
            <div className="step-form-container">
              <h3>{currentStep ? '编辑步骤' : '添加步骤'}</h3>
              <Form form={stepForm} layout="vertical">
                <Form.Item name="name" label="步骤名称" rules={[{ required: true, message: '请输入步骤名称' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="type" label="步骤类型" rules={[{ required: true, message: '请选择步骤类型' }]}>
                  <Select onChange={(value) => {
                    // 根据类型重置相关字段
                    if (value === 'approval') {
                      stepForm.setFieldsValue({ notifyTo: undefined, condition: undefined });
                    } else if (value === 'notification') {
                      stepForm.setFieldsValue({ approvers: undefined, condition: undefined });
                    } else if (value === 'condition') {
                      stepForm.setFieldsValue({ approvers: undefined, notifyTo: undefined });
                    }
                  }}>
                    <Option value="approval">审批</Option>
                    <Option value="notification">通知</Option>
                    <Option value="condition">条件</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item 
                  name="approvers" 
                  label="审批人" 
                  rules={[{ required: stepForm.getFieldValue('type') === 'approval', message: '请选择审批人' }]}
                  hidden={stepForm.getFieldValue('type') !== 'approval'}
                >
                  <Select mode="multiple" placeholder="选择审批人">
                    <Option value="部门经理">部门经理</Option>
                    <Option value="HR专员">HR专员</Option>
                    <Option value="财务专员">财务专员</Option>
                    <Option value="总经理">总经理</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item 
                  name="notifyTo" 
                  label="通知人" 
                  rules={[{ required: stepForm.getFieldValue('type') === 'notification', message: '请选择通知人' }]}
                  hidden={stepForm.getFieldValue('type') !== 'notification'}
                >
                  <Select mode="multiple" placeholder="选择通知人">
                    <Option value="申请人">申请人</Option>
                    <Option value="部门经理">部门经理</Option>
                    <Option value="HR专员">HR专员</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item 
                  name="condition" 
                  label="条件表达式" 
                  rules={[{ required: stepForm.getFieldValue('type') === 'condition', message: '请输入条件表达式' }]}
                  hidden={stepForm.getFieldValue('type') !== 'condition'}
                >
                  <Input placeholder="例如: 金额 > 5000" />
                </Form.Item>
                
                <Form.Item name="order" label="步骤顺序" rules={[{ required: true, message: '请输入步骤顺序' }]}>
                  <Input type="number" min={1} />
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button type="primary" onClick={handleSubmitStep}>
                      {currentStep ? '更新步骤' : '添加步骤'}
                    </Button>
                    {currentStep && (
                      <Button onClick={() => {
                        setCurrentStep(null);
                        stepForm.resetFields();
                        stepForm.setFieldsValue({
                          order: currentTemplate.steps.length + 1
                        });
                      }}>
                        取消编辑
                      </Button>
                    )}
                    {!currentStep && (
                      <Button onClick={handleAddStep}>
                        重置
                      </Button>
                    )}
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Modal>

      {/* 工作流实例详情模态框 */}
      <Modal
        title="工作流实例详情"
        open={isInstanceModalVisible}
        onCancel={() => setIsInstanceModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsInstanceModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentInstance && (
          <div className="workflow-instance-details">
            <Card>
              <h3>基本信息</h3>
              <p><strong>业务名称：</strong> {currentInstance.businessName}</p>
              <p><strong>工作流模板：</strong> {currentInstance.templateName}</p>
              <p><strong>业务类型：</strong> {getWorkflowTypeText(currentInstance.businessType)}</p>
              <p><strong>发起人：</strong> {currentInstance.initiator}</p>
              <p><strong>状态：</strong> {getInstanceStatusTag(currentInstance.status)}</p>
              <p><strong>创建时间：</strong> {currentInstance.createdAt}</p>
              <p><strong>更新时间：</strong> {currentInstance.updatedAt}</p>
            </Card>
            
            <div className="workflow-history">
              <h3>审批历史</h3>
              {currentInstance.history.map((record, index) => (
                <div key={index} className="workflow-history-item">
                  <p>
                    <span className="action">
                      {record.action === 'approve' ? '同意' : record.action === 'reject' ? '拒绝' : '评论'}
                    </span>
                    <strong>{record.stepName}</strong> 由 <strong>{record.operator}</strong>
                    <span className="timestamp"> ({record.timestamp})</span>
                  </p>
                  {record.comment && <p className="comment">"{record.comment}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Workflow;