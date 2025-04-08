import React, { useState } from 'react';
import { Card, Button, Space, Upload, message, Radio, Tooltip, Alert, Modal, Table, Typography } from 'antd';
import { UploadOutlined, DownloadOutlined, FileExcelOutlined, FileTextOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { exportData, importData, ExportFileType, getUserExportTemplate } from '../../utils/exportImport';

const { Dragger } = Upload;
const { Text, Paragraph } = Typography;

interface ImportExportPanelProps {
  dataSource: any[];
  onImportSuccess: (data: any[]) => void;
  entityName?: string;
}

const ImportExportPanel: React.FC<ImportExportPanelProps> = ({
  dataSource,
  onImportSuccess,
  entityName = '用户'
}) => {
  const [exportType, setExportType] = useState<ExportFileType>(ExportFileType.EXCEL);
  const [importType, setImportType] = useState<ExportFileType>(ExportFileType.EXCEL);
  const [importing, setImporting] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // 处理导出
  const handleExport = () => {
    if (!dataSource || dataSource.length === 0) {
      message.warning(`没有${entityName}数据可导出`);
      return;
    }
    
    const filename = `${entityName}数据_${new Date().toISOString().split('T')[0]}`;
    exportData(dataSource, filename, exportType);
  };
  
  // 处理导出模板
  const handleExportTemplate = () => {
    const templateData = getUserExportTemplate();
    const filename = `${entityName}导入模板`;
    exportData(templateData, filename, exportType);
  };
  
  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    accept: importType === ExportFileType.CSV ? '.csv' : '.xlsx,.xls',
    beforeUpload: (file) => {
      // 文件类型检查
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                     file.type === 'application/vnd.ms-excel' ||
                     file.name.endsWith('.xlsx') ||
                     file.name.endsWith('.xls');
      
      if (importType === ExportFileType.CSV && !isCSV) {
        message.error('请上传CSV格式的文件');
        return Upload.LIST_IGNORE;
      }
      
      if (importType === ExportFileType.EXCEL && !isExcel) {
        message.error('请上传Excel格式的文件');
        return Upload.LIST_IGNORE;
      }
      
      // 文件大小检查（限制为10MB）
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过10MB');
        return Upload.LIST_IGNORE;
      }
      
      // 开始导入处理
      handleImport(file);
      return false; // 阻止自动上传
    },
  };
  
  // 处理导入
  const handleImport = async (file: File) => {
    setImporting(true);
    setImportErrors([]);
    
    try {
      const result = await importData<any>(file, importType);
      
      if (result.success) {
        // 显示预览
        setImportPreviewData(result.data || []);
        setPreviewVisible(true);
        
        if (result.errors && result.errors.length > 0) {
          setImportErrors(result.errors);
        }
      } else {
        message.error(result.message);
        if (result.errors && result.errors.length > 0) {
          setImportErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('导入失败:', error);
      message.error('导入处理失败，请检查文件格式');
    } finally {
      setImporting(false);
    }
  };
  
  // 确认导入
  const confirmImport = () => {
    if (importPreviewData.length > 0) {
      onImportSuccess(importPreviewData);
      message.success(`成功导入${importPreviewData.length}条${entityName}数据`);
      setPreviewVisible(false);
      setImportPreviewData([]);
    }
  };
  
  // 取消导入
  const cancelImport = () => {
    setPreviewVisible(false);
    setImportPreviewData([]);
    setImportErrors([]);
  };
  
  // 生成预览表格的列
  const generatePreviewColumns = () => {
    if (!importPreviewData.length) return [];
    
    return Object.keys(importPreviewData[0]).map(key => ({
      title: key,
      dataIndex: key,
      key: key,
      ellipsis: true,
    }));
  };
  
  return (
    <Card title={`${entityName}数据导入导出`} className="import-export-panel">
      <div className="export-section">
        <Paragraph>
          <Text strong>导出{entityName}数据</Text>
        </Paragraph>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group 
            value={exportType} 
            onChange={(e) => setExportType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={ExportFileType.EXCEL}>
              <FileExcelOutlined /> Excel格式
            </Radio.Button>
            <Radio.Button value={ExportFileType.CSV}>
              <FileTextOutlined /> CSV格式
            </Radio.Button>
          </Radio.Group>
          
          <Space>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              disabled={!dataSource || dataSource.length === 0}
            >
              导出{entityName}数据
            </Button>
            
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportTemplate}
            >
              下载导入模板
            </Button>
            
            <Tooltip title={`导出当前${entityName}列表中的所有数据`}>
              <QuestionCircleOutlined />
            </Tooltip>
          </Space>
        </Space>
      </div>
      
      <div className="import-section" style={{ marginTop: 24 }}>
        <Paragraph>
          <Text strong>导入{entityName}数据</Text>
        </Paragraph>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio.Group 
            value={importType} 
            onChange={(e) => setImportType(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={ExportFileType.EXCEL}>
              <FileExcelOutlined /> Excel格式
            </Radio.Button>
            <Radio.Button value={ExportFileType.CSV}>
              <FileTextOutlined /> CSV格式
            </Radio.Button>
          </Radio.Group>
          
          <Alert
            message="导入说明"
            description={
              <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                <li>请先下载导入模板，按照模板格式填写数据</li>
                <li>导入文件大小不能超过10MB</li>
                <li>导入前请确保数据格式正确，特别是必填字段</li>
                <li>导入时会自动检查数据有效性，无效数据将被标记</li>
                <li>如果导入的用户ID已存在，将更新该用户信息</li>
              </ul>
            }
            type="info"
            showIcon
          />
          
          <Dragger {...uploadProps} style={{ padding: '20px 0' }} disabled={importing}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持{importType === ExportFileType.CSV ? 'CSV' : 'Excel'}格式的{entityName}数据文件
            </p>
          </Dragger>
        </Space>
      </div>
      
      {/* 导入预览对话框 */}
      <Modal
        title={`${entityName}数据导入预览`}
        open={previewVisible}
        onOk={confirmImport}
        onCancel={cancelImport}
        width={800}
        okText="确认导入"
        cancelText="取消"
      >
        {importErrors.length > 0 && (
          <Alert
            message="导入警告"
            description={
              <div>
                <p>以下行数据存在问题，导入后可能需要手动修正：</p>
                <ul>
                  {importErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Table
          dataSource={importPreviewData.map((item, index) => ({ ...item, key: index }))}
          columns={generatePreviewColumns()}
          scroll={{ x: 'max-content', y: 300 }}
          size="small"
          pagination={false}
        />
        
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            共 {importPreviewData.length} 条数据待导入
          </Text>
        </div>
      </Modal>
    </Card>
  );
};

export default ImportExportPanel;