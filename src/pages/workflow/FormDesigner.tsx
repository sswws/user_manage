import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Input, Select, Form, Switch, InputNumber, DatePicker, TimePicker, Checkbox, Radio, Divider, message, Modal, Tabs, Table, Tooltip, Row, Col, Collapse } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, CopyOutlined, ArrowUpOutlined, ArrowDownOutlined, EyeOutlined, SaveOutlined, FormOutlined, SettingOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './FormDesigner.css';

const { Option } = Select;
const { Panel } = Collapse;

interface FormField {
  id: string;
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[];
  rules?: any[];
  props?: Record<string, any>;
}

interface FormTemplate {
  id: number;
  name: string;
  description: string;
  fields: FormField[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const FIELD_TYPES = [
  { label: '单行文本', value: 'input', icon: <EditOutlined /> },
  { label: '多行文本', value: 'textarea', icon: <FormOutlined /> },
  { label: '数字输入', value: 'number', icon: <InputNumber style={{ width: 50 }} /> },
  { label: '下拉选择', value: 'select', icon: <SettingOutlined /> },
  { label: '单选框组', value: 'radio', icon: <Radio /> },
  { label: '复选框组', value: 'checkbox', icon: <Checkbox /> },
  { label: '日期选择', value: 'date', icon: <DatePicker style={{ width: 50 }} /> },
  { label: '时间选择', value: 'time', icon: <TimePicker style={{ width: 50 }} /> },
  { label: '开关', value: 'switch', icon: <Switch size="small" /> },
];

const DraggableFieldItem: React.FC<{ field: any; index: number; moveField: (dragIndex: number, hoverIndex: number) => void }> = ({ field, index, moveField }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'field',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="draggable-field-item"
    >
      {field.label} ({field.type})
    </div>
  );
};

const FormDesigner: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<FormTemplate | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [currentField, setCurrentField] = useState<FormField | null>(null);
  const [fieldForm] = Form.useForm();
  const [templateForm] = Form.useForm();
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // 模拟获取表单模板数据
  useEffect(() => {
    fetchFormTemplates();
  }, []);

  const fetchFormTemplates = () => {
    // 模拟API请求
    setTimeout(() => {
      const mockData: FormTemplate[] = [
        {
          id: 1,
          name: '请假申请表',
          description: '员工请假使用的标准表单',
          fields: [
            {
              id: '1',
              type: 'input',
              label: '请假人',
              name: 'applicant',
              required: true,
              placeholder: '请输入请假人姓名',
            },
            {
              id: '2',
              type: 'select',
              label: '请假类型',
              name: 'leaveType',
              required: true,
              options: [
                { label: '年假', value: 'annual' },
                { label: '病假', value: 'sick' },
                { label: '事假', value: 'personal' },
                { label: '婚假', value: 'marriage' },
              ],
            },
            {
              id: '3',
              type: 'date',
              label: '开始日期',
              name: 'startDate',
              required: true,
            },
            {
              id: '4',
              type: 'date',
              label: '结束日期',
              name: 'endDate',
              required: true,
            },
            {
              id: '5',
              type: 'textarea',
              label: '请假原因',
              name: 'reason',
              required: true,
              placeholder: '请详细描述请假原因',
            },
          ],
          createdBy: '管理员',
          createdAt: '2023-05-10 10:00:00',
          updatedAt: '2023-05-10 10:00:00',
        },
        {
          id: 2,
          name: '报销申请表',
          description: '员工报销使用的标准表单',
          fields: [
            {
              id: '1',
              type: 'input',
              label: '报销人',
              name: 'applicant',
              required: true,
              placeholder: '请输入报销人姓名',
            },
            {
              id: '2',
              type: 'select',
              label: '报销类型',
              name: 'expenseType',
              required: true,
              options: [
                { label: '差旅费', value: 'travel' },
                { label: '办公用品', value: 'office' },
                { label: '业务招待', value: 'business' },
                { label: '其他', value: 'other' },
              ],
            },
            {
              id: '3',
              type: 'number',
              label: '报销金额',
              name: 'amount',
              required: true,
            },
            {
              id: '4',
              type: 'date',
              label: '报销日期',
              name: 'expenseDate',
              required: true,
            },
            {
              id: '5',
              type: 'textarea',
              label: '报销说明',
              name: 'description',
              required: true,
              placeholder: '请详细描述报销内容',
            },
          ],
          createdBy: '管理员',
          createdAt: '2023-05-15 14:30:00',
          updatedAt: '2023-05-15 14:30:00',
        },
      ];

      setTemplates(mockData);
    }, 500);
  };

  // 添加字段
  const handleAddField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `新${FIELD_TYPES.find(f => f.value === type)?.label}`,
      name: `field_${Date.now()}`,
      required: false,
    };

    if (type === 'select' || type === 'radio' || type === 'checkbox') {
      newField.options = [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' },
      ];
    }

    setFields([...fields, newField]);
  };

  // 编辑字段
  const handleEditField = (field: FormField) => {
    setCurrentField(field);
    fieldForm.setFieldsValue({
      label: field.label,
      name: field.name,
      required: field.required,
      placeholder: field.placeholder,
      defaultValue: field.defaultValue,
      options: field.options,
    });
    setIsModalVisible(true);
  };

  // 删除字段
  const handleDeleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  // 移动字段位置
  const moveField = (dragIndex: number, hoverIndex: number) => {
    const dragField = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, dragField);
    setFields(newFields);
  };

  // 提交字段表单
  const handleFieldSubmit = () => {
    fieldForm.validateFields().then(values => {
      if (!currentField) return;

      const updatedFields = fields.map(field => {
        if (field.id === currentField.id) {
          return {
            ...field,
            ...values,
          };
        }
        return field;
      });

      setFields(updatedFields);
      setIsModalVisible(false);
      setCurrentField(null);
      fieldForm.resetFields();
    });
  };

  // 创建新表单模板
  const handleCreateTemplate = () => {
    setCurrentTemplate(null);
    setFields([]);
    templateForm.resetFields();
    setIsTemplateModalVisible(true);
  };

  // 编辑表单模板
  const handleEditTemplate = (template: FormTemplate) => {
    setCurrentTemplate(template);
    setFields(template.fields);
    templateForm.setFieldsValue({
      name: template.name,
      description: template.description,
    });
    setIsTemplateModalVisible(true);
  };

  // 保存表单模板
  const handleSaveTemplate = () => {
    templateForm.validateFields().then(values => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

      if (currentTemplate) {
        // 更新现有模板
        const updatedTemplate = {
          ...currentTemplate,
          ...values,
          fields,
          updatedAt: now,
        };

        const updatedTemplates = templates.map(template => {
          if (template.id === currentTemplate.id) {
            return updatedTemplate;
          }
          return template;
        });

        setTemplates(updatedTemplates);
        message.success('表单模板已更新');
      } else {
        // 创建新模板
        const newTemplate: FormTemplate = {
          id: templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1,
          ...values,
          fields,
          createdBy: '当前用户', // 实际应用中应该是当前登录用户
          createdAt: now,
          updatedAt: now,
        };

        setTemplates([...templates, newTemplate]);
        message.success('表单模板已创建');
      }

      setIsTemplateModalVisible(false);
    });
  };

  // 预览表单
  const handlePreview = () => {
    setIsPreviewVisible(true);
  };

  // 渲染字段预览
  const renderFieldPreview = (field: FormField) => {
    const { type, label, name, required, placeholder, defaultValue, options } = field;

    const formItemProps = {
      label,
      name,
      rules: required ? [{ required: true, message: `请${placeholder || '填写此项'}` }] : undefined,
    };

    switch (type) {
      case 'input':
        return (
          <Form.Item {...formItemProps}>
            <Input placeholder={placeholder} />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item {...formItemProps}>
            <Input.TextArea placeholder={placeholder} rows={4} />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item {...formItemProps}>
            <InputNumber style={{ width: '100%' }} placeholder={placeholder} />
          </Form.Item>
        );
      case 'select':
        return (
          <Form.Item {...formItemProps}>
            <Select placeholder={placeholder || '请选择'}>
              {options?.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'radio':
        return (
          <Form.Item {...formItemProps}>
            <Radio.Group>
              {options?.map(option => (
                <Radio key={option.value} value={option.value}>{option.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        );
      case 'checkbox':
        return (
          <Form.Item {...formItemProps}>
            <Checkbox.Group>
              {options?.map(option => (
                <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>
        );
      case 'date':
        return (
          <Form.Item {...formItemProps}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        );
      case 'time':
        return (
          <Form.Item {...formItemProps}>
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
        );
      case 'switch':
        return (
          <Form.Item {...formItemProps} valuePropName="checked">
            <Switch />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  // 表单模板列表
  const templateColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '字段数量',
      key: 'fieldCount',
      render: (text: string, record: FormTemplate) => record.fields.length,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: FormTemplate) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditTemplate(record)}>编辑</Button>
          <Button type="link" icon={<EyeOutlined />} onClick={() => {
            setCurrentTemplate(record);
            setFields(record.fields);
            handlePreview();
          }}>预览</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除表单模板 "${record.name}" 吗？`,
              onOk: () => {
                setTemplates(templates.filter(t => t.id !== record.id));
                message.success('表单模板已删除');
              },
            });
          }}>删除</Button>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: '表单模板列表',
      children: (
        <Table 
          columns={templateColumns} 
          dataSource={templates} 
          rowKey="id" 
          pagination={false}
        />
      ),
    },
    {
      key: '2',
      label: '表单设计器',
      children: (
        <div className="form-designer-container">
          <Row gutter={16}>
            <Col span={6}>
              <Card title="表单组件" className="components-card">
                <div className="field-types">
                  {FIELD_TYPES.map(fieldType => (
                    <div 
                      key={fieldType.value} 
                      className="field-type-item"
                      onClick={() => handleAddField(fieldType.value)}
                    >
                      <span className="field-type-icon">{fieldType.icon}</span>
                      <span>{fieldType.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
            <Col span={18}>
              <Card 
                title={currentTemplate ? `编辑表单：${currentTemplate.name}` : '新建表单'} 
                className="form-preview-card"
                extra={
                  <Space>
                    <Button icon={<EyeOutlined />} onClick={handlePreview}>预览</Button>
                    <Button type="primary" icon={<SaveOutlined />} onClick={() => setIsTemplateModalVisible(true)}>保存</Button>
                  </Space>
                }
              >
                <DndProvider backend={HTML5Backend}>
                  <div className="form-fields-container">
                    {fields.length > 0 ? (
                      fields.map((field, index) => (
                        <div key={field.id} className="form-field-item">
                          <DraggableFieldItem 
                            field={field} 
                            index={index} 
                            moveField={moveField} 
                          />
                          <div className="field-actions">
                            <Button 
                              type="text" 
                              icon={<EditOutlined />} 
                              onClick={() => handleEditField(field)}
                            />
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />} 
                              onClick={() => handleDeleteField(field.id)}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-form">
                        <p>从左侧拖拽或点击组件添加到表单</p>
                      </div>
                    )}
                  </div>
                </DndProvider>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="form-designer-page">
      <div className="page-header">
        <h2>表单设计器</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTemplate}>新建表单</Button>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={items}
      />
      
      {/* 字段属性编辑模态框 */}
      <Modal
        title="编辑字段属性"
        open={isModalVisible}
        onOk={handleFieldSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={fieldForm}
          layout="vertical"
        >
          <Form.Item
            label="字段标签"
            name="label"
            rules={[{ required: true, message: '请输入字段标签' }]}
          >
            <Input placeholder="请输入字段标签" />
          </Form.Item>
          
          <Form.Item
            label="字段名称"
            name="name"
            rules={[{ required: true, message: '请输入字段名称' }]}
          >
            <Input placeholder="请输入字段名称（英文）" />
          </Form.Item>
          
          <Form.Item
            label="是否必填"
            name="required"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          {currentField?.type === 'input' || currentField?.type === 'textarea' || currentField?.type === 'number' ? (
            <Form.Item
              label="占位文本"
              name="placeholder"
            >
              <Input placeholder="请输入占位文本" />
            </Form.Item>
          ) : null}
          
          {currentField?.type === 'input' || currentField?.type === 'textarea' || currentField?.type === 'number' ? (
            <Form.Item
              label="默认值"
              name="defaultValue"
            >
              <Input placeholder="请输入默认值" />
            </Form.Item>
          ) : null}
          
          {(currentField?.type === 'select' || currentField?.type === 'radio' || currentField?.type === 'checkbox') && (
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  <div style={{ marginBottom: 8 }}>
                    <Button type="dashed" onClick={() => add({ label: '', value: '' })} icon={<PlusOutlined />}>
                      添加选项
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
                        rules={[{ required: true, message: '请输入选项标签' }]}
                      >
                        <Input placeholder="选项标签" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        style={{ marginBottom: 0, marginRight: 8, flex: 1 }}
                        rules={[{ required: true, message: '请输入选项值' }]}
                      >
                        <Input placeholder="选项值" />
                      </Form.Item>
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)} />
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          )}
        </Form>
      </Modal>
      
      {/* 表单模板编辑模态框 */}
      <Modal
        title={currentTemplate ? '编辑表单模板' : '新建表单模板'}
        open={isTemplateModalVisible}
        onOk={handleSaveTemplate}
        onCancel={() => setIsTemplateModalVisible(false)}
      >
        <Form
          form={templateForm}
          layout="vertical"
        >
          <Form.Item
            label="表单名称"
            name="name"
            rules={[{ required: true, message: '请输入表单名称' }]}
          >
            <Input placeholder="请输入表单名称" />
          </Form.Item>
          
          <Form.Item
            label="表单描述"
            name="description"
          >
            <Input.TextArea placeholder="请输入表单描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 表单预览模态框 */}
      <Modal
        title="表单预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>关闭</Button>,
        ]}
        width={700}
      >
        <Form layout="vertical">
          {fields.map(field => renderFieldPreview(field))}
        </Form>
      </Modal>
    </div>
  );
};

export default FormDesigner;