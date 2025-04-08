/**
 * 操作确认工具
 * 提供用户操作的二次确认机制，特别是对于敏感操作
 */

import React from 'react';
import { Modal, Typography, Space, Alert, Input, Checkbox } from 'antd';
import { ExclamationCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

// 确认操作的风险级别
export enum RiskLevel {
  LOW = 'low',       // 低风险操作，如编辑非关键信息
  MEDIUM = 'medium', // 中等风险操作，如删除单个记录
  HIGH = 'high'      // 高风险操作，如批量删除、修改权限
}

// 确认操作的配置选项
export interface ConfirmActionOptions {
  title?: string;                // 确认对话框标题
  content?: React.ReactNode;     // 确认对话框内容
  riskLevel?: RiskLevel;         // 操作风险级别
  confirmText?: string;          // 确认按钮文本
  cancelText?: string;           // 取消按钮文本
  requireTyping?: boolean;       // 是否需要用户输入确认文本
  typingText?: string;           // 需要用户输入的确认文本
  requireCheckbox?: boolean;     // 是否需要用户勾选确认框
  checkboxText?: string;         // 确认框文本
  icon?: React.ReactNode;        // 自定义图标
  width?: number;                // 对话框宽度
  centered?: boolean;            // 是否居中显示
  maskClosable?: boolean;        // 点击蒙层是否关闭
  keyboard?: boolean;            // 是否支持键盘esc关闭
}

/**
 * 获取风险级别对应的图标
 * @param riskLevel 风险级别
 * @returns 对应的图标组件
 */
const getRiskIcon = (riskLevel: RiskLevel): React.ReactNode => {
  switch (riskLevel) {
    case RiskLevel.LOW:
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    case RiskLevel.MEDIUM:
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    case RiskLevel.HIGH:
      return <WarningOutlined style={{ color: '#ff4d4f' }} />;
    default:
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
  }
};

/**
 * 获取风险级别对应的提示信息
 * @param riskLevel 风险级别
 * @returns 提示信息
 */
const getRiskMessage = (riskLevel: RiskLevel): string => {
  switch (riskLevel) {
    case RiskLevel.LOW:
      return '此操作可以安全执行，影响较小。';
    case RiskLevel.MEDIUM:
      return '此操作将会修改数据，请确认您了解可能的影响。';
    case RiskLevel.HIGH:
      return '此操作可能会导致重要数据变更或删除，请谨慎操作！';
    default:
      return '请确认是否执行此操作？';
  }
};

/**
 * 确认操作
 * @param options 确认选项
 * @returns Promise，resolve为用户确认，reject为用户取消
 */
export const confirmAction = (options: ConfirmActionOptions = {}): Promise<void> => {
  const {
    title = '确认操作',
    content,
    riskLevel = RiskLevel.MEDIUM,
    confirmText = '确认',
    cancelText = '取消',
    requireTyping = false,
    typingText = '确认',
    requireCheckbox = false,
    checkboxText = '我已了解此操作的风险并确认执行',
    icon,
    width = 420,
    centered = true,
    maskClosable = false,
    keyboard = true,
  } = options;

  return new Promise((resolve, reject) => {
    let typingValue = '';
    let checkboxChecked = false;

    // 创建确认对话框
    const modal = Modal.confirm({
      title,
      icon: icon || getRiskIcon(riskLevel),
      width,
      centered,
      maskClosable,
      keyboard,
      okText: confirmText,
      cancelText,
      okButtonProps: {
        danger: riskLevel === RiskLevel.HIGH,
        disabled: (requireTyping && typingValue !== typingText) || (requireCheckbox && !checkboxChecked),
      },
      content: (
        <div className="confirm-action-container">
          {/* 自定义内容 */}
          {content && <div className="confirm-action-content">{content}</div>}
          
          {/* 风险提示 */}
          <Alert
            message={getRiskMessage(riskLevel)}
            type={riskLevel === RiskLevel.HIGH ? 'error' : riskLevel === RiskLevel.MEDIUM ? 'warning' : 'info'}
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          {/* 输入确认文本 */}
          {requireTyping && (
            <div className="confirm-typing" style={{ marginBottom: 16 }}>
              <Paragraph>
                <Text>请输入 <Text strong>"{typingText}"</Text> 以确认操作：</Text>
              </Paragraph>
              <Input
                placeholder={`请输入: ${typingText}`}
                onChange={(e) => {
                  typingValue = e.target.value;
                  modal.update({
                    okButtonProps: {
                      danger: riskLevel === RiskLevel.HIGH,
                      disabled: (typingValue !== typingText) || (requireCheckbox && !checkboxChecked),
                    },
                  });
                }}
              />
            </div>
          )}
          
          {/* 确认复选框 */}
          {requireCheckbox && (
            <div className="confirm-checkbox" style={{ marginTop: 16 }}>
              <Checkbox
                onChange={(e) => {
                  checkboxChecked = e.target.checked;
                  modal.update({
                    okButtonProps: {
                      danger: riskLevel === RiskLevel.HIGH,
                      disabled: (requireTyping && typingValue !== typingText) || !checkboxChecked,
                    },
                  });
                }}
              >
                {checkboxText}
              </Checkbox>
            </div>
          )}
        </div>
      ),
      onOk: () => {
        // 验证输入和复选框
        if (requireTyping && typingValue !== typingText) {
          return Promise.reject('请正确输入确认文本');
        }
        if (requireCheckbox && !checkboxChecked) {
          return Promise.reject('请勾选确认框');
        }
        resolve();
      },
      onCancel: () => {
        reject(new Error('用户取消操作'));
      },
    });
  });
};

/**
 * 删除确认
 * @param itemName 要删除的项目名称
 * @param isMultiple 是否是批量删除
 * @returns Promise
 */
export const confirmDelete = (itemName: string, isMultiple: boolean = false): Promise<void> => {
  return confirmAction({
    title: `确认删除${isMultiple ? '多个' : ''}${itemName}`,
    content: (
      <Paragraph>
        您确定要删除{isMultiple ? '选中的多个' : '这个'}{itemName}吗？
        {isMultiple && <Text type="danger">此操作将删除所有选中的项目。</Text>}
        <br />
        <Text type="warning">删除后数据将无法恢复！</Text>
      </Paragraph>
    ),
    riskLevel: isMultiple ? RiskLevel.HIGH : RiskLevel.MEDIUM,
    confirmText: '删除',
    requireCheckbox: isMultiple,
    checkboxText: `我确认要删除选中的所有${itemName}`,
  });
};

/**
 * 敏感操作确认
 * @param actionName 操作名称
 * @param description 操作描述
 * @returns Promise
 */
export const confirmSensitiveAction = (actionName: string, description: string): Promise<void> => {
  return confirmAction({
    title: `确认${actionName}`,
    content: <Paragraph>{description}</Paragraph>,
    riskLevel: RiskLevel.HIGH,
    requireTyping: true,
    typingText: '确认执行',
  });
};