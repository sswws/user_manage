/**
 * 数据导入导出工具
 * 提供Excel/CSV格式的数据导入导出功能
 */

import { message } from 'antd';
import { User } from '../mock/users';

// 导出文件类型
export enum ExportFileType {
  CSV = 'csv',
  EXCEL = 'excel',
}

// 导入结果接口
export interface ImportResult<T> {
  success: boolean;
  message: string;
  data?: T[];
  errors?: string[];
}

/**
 * 将数据导出为CSV格式
 * @param data 要导出的数据
 * @param filename 文件名
 */
export const exportToCsv = <T>(data: T[], filename: string): void => {
  try {
    if (!data || !data.length) {
      message.warning('没有可导出的数据');
      return;
    }

    // 获取表头（对象的所有键）
    const headers = Object.keys(data[0] as object);
    
    // 创建CSV内容
    let csvContent = headers.join(',') + '\n';
    
    // 添加数据行
    data.forEach(item => {
      const row = headers.map(header => {
        // 处理值中的逗号和引号
        const value = (item as any)[header];
        const cellValue = value === null || value === undefined ? '' : String(value);
        return `"${cellValue.replace(/"/g, '""')}"`;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    
    // 触发下载
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success('数据导出成功');
  } catch (error) {
    console.error('导出CSV失败:', error);
    message.error('导出失败，请重试');
  }
};

/**
 * 将数据导出为Excel格式
 * 注意：这个简单实现实际上是创建一个CSV文件，但使用.xlsx扩展名
 * 在实际项目中，应该使用专门的Excel库，如xlsx或exceljs
 * @param data 要导出的数据
 * @param filename 文件名
 */
export const exportToExcel = <T>(data: T[], filename: string): void => {
  try {
    if (!data || !data.length) {
      message.warning('没有可导出的数据');
      return;
    }

    // 在实际项目中，这里应该使用专门的Excel库
    // 这里我们使用CSV格式作为示例
    exportToCsv(data, filename);
    
    message.info('提示：在实际项目中，应使用专门的Excel库生成真正的Excel文件');
  } catch (error) {
    console.error('导出Excel失败:', error);
    message.error('导出失败，请重试');
  }
};

/**
 * 通用导出函数
 * @param data 要导出的数据
 * @param filename 文件名
 * @param type 导出类型
 */
export const exportData = <T>(data: T[], filename: string, type: ExportFileType): void => {
  if (type === ExportFileType.CSV) {
    exportToCsv(data, filename);
  } else if (type === ExportFileType.EXCEL) {
    exportToExcel(data, filename);
  } else {
    message.error('不支持的导出类型');
  }
};

/**
 * 从CSV文件导入数据
 * @param file 上传的CSV文件
 * @returns 导入结果
 */
export const importFromCsv = <T>(file: File): Promise<ImportResult<T>> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content) {
            resolve({
              success: false,
              message: '文件内容为空',
              errors: ['文件内容为空']
            });
            return;
          }
          
          // 解析CSV内容
          const lines = content.split('\n');
          if (lines.length < 2) {
            resolve({
              success: false,
              message: '文件格式不正确或没有数据',
              errors: ['文件格式不正确或没有数据']
            });
            return;
          }
          
          // 解析表头
          const headers = lines[0].split(',').map(header => 
            header.trim().replace(/^"|"$/g, '')
          );
          
          // 解析数据行
          const data: T[] = [];
          const errors: string[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // 处理CSV中的引号和逗号
            const values: string[] = [];
            let inQuotes = false;
            let currentValue = '';
            
            for (let j = 0; j < line.length; j++) {
              const char = line[j];
              
              if (char === '"') {
                if (j < line.length - 1 && line[j + 1] === '"') {
                  // 处理双引号转义
                  currentValue += '"';
                  j++;
                } else {
                  // 切换引号状态
                  inQuotes = !inQuotes;
                }
              } else if (char === ',' && !inQuotes) {
                // 逗号分隔，但不在引号内
                values.push(currentValue);
                currentValue = '';
              } else {
                currentValue += char;
              }
            }
            
            // 添加最后一个值
            values.push(currentValue);
            
            // 创建对象
            if (values.length === headers.length) {
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index];
              });
              data.push(obj as T);
            } else {
              errors.push(`第${i}行数据格式不正确: ${line}`);
            }
          }
          
          if (data.length === 0) {
            resolve({
              success: false,
              message: '没有有效数据可导入',
              errors: errors.length ? errors : ['没有有效数据可导入']
            });
          } else {
            resolve({
              success: true,
              message: `成功导入${data.length}条数据${errors.length ? '，但有部分数据格式不正确' : ''}`,
              data,
              errors: errors.length ? errors : undefined
            });
          }
        } catch (error) {
          console.error('解析CSV文件失败:', error);
          resolve({
            success: false,
            message: '解析文件失败',
            errors: [(error as Error).message]
          });
        }
      };
      
      reader.onerror = () => {
        resolve({
          success: false,
          message: '读取文件失败',
          errors: ['读取文件失败']
        });
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('导入CSV失败:', error);
      resolve({
        success: false,
        message: '导入失败',
        errors: [(error as Error).message]
      });
    }
  });
};

/**
 * 从Excel文件导入数据
 * 注意：这个简单实现实际上是解析CSV文件
 * 在实际项目中，应该使用专门的Excel库，如xlsx或exceljs
 * @param file 上传的Excel文件
 * @returns 导入结果
 */
export const importFromExcel = <T>(file: File): Promise<ImportResult<T>> => {
  // 在实际项目中，这里应该使用专门的Excel库
  // 这里我们使用CSV解析作为示例
  return importFromCsv<T>(file);
};

/**
 * 通用导入函数
 * @param file 上传的文件
 * @param type 导入类型
 * @returns 导入结果
 */
export const importData = <T>(file: File, type: ExportFileType): Promise<ImportResult<T>> => {
  if (type === ExportFileType.CSV) {
    return importFromCsv<T>(file);
  } else if (type === ExportFileType.EXCEL) {
    return importFromExcel<T>(file);
  } else {
    return Promise.resolve({
      success: false,
      message: '不支持的导入类型',
      errors: ['不支持的导入类型']
    });
  }
};

/**
 * 获取用户数据的导出模板
 * @returns 用户数据模板
 */
export const getUserExportTemplate = (): Partial<User>[] => {
  return [
    {
      id: 0, // 新用户导入时会自动分配ID
      username: 'user1',
      password: 'password123',
      name: '用户1',
      role: 'user',
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
    }
  ];
};