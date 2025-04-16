import { createContext } from 'react';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' },
];

// 语言文本内容
const translations = {
  'zh-CN': {
    common: {
      search: '搜索',
      add: '添加',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      back: '返回',
      submit: '提交',
      reset: '重置',
      more: '更多',
      loading: '加载中...',
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息',
      yes: '是',
      no: '否',
      all: '全部',
      export: '导出',
      import: '导入',
    },
    menu: {
      dashboard: '仪表盘',
      employee: '员工管理',
      attendance: '考勤管理',
      leave: '请假管理',
      salary: '薪资管理',
      performance: '绩效管理',
      reports: '报表中心',
      workflow: '工作流管理',
      system: '系统监控',
      settings: '系统设置',
      profile: '个人中心',
    },
    dashboard: {
      title: '仪表盘',
      totalEmployees: '员工总数',
      attendanceRate: '考勤率',
      leaveCount: '请假人数',
      newEmployees: '新入职员工',
    },
    employee: {
      title: '员工管理',
      name: '姓名',
      gender: '性别',
      department: '部门',
      position: '职位',
      status: '状态',
      entryDate: '入职日期',
      basicInfo: '基本信息',
      contactInfo: '联系信息',
      educationInfo: '教育信息',
      workExperience: '工作经历',
    },
    reports: {
      title: '报表中心',
      employeeDistribution: '员工分布',
      attendanceStatistics: '考勤统计',
      leaveStatistics: '请假统计',
      salaryStatistics: '薪资统计',
      performanceStatistics: '绩效统计',
      exportExcel: '导出Excel',
      exportPDF: '导出PDF',
      department: '部门',
      dateRange: '日期范围',
    },
    workflow: {
      title: '工作流管理',
      templates: '流程模板',
      instances: '流程实例',
      createTemplate: '创建模板',
      editTemplate: '编辑模板',
      steps: '流程步骤',
      addStep: '添加步骤',
      editStep: '编辑步骤',
      approvers: '审批人',
      status: '状态',
    },
    system: {
      title: '系统监控',
      overview: '系统概览',
      performance: '性能监控',
      errorLogs: '错误日志',
      serviceStatus: '服务状态',
      cpuUsage: 'CPU使用率',
      memoryUsage: '内存使用率',
      diskUsage: '磁盘使用率',
      activeUsers: '活跃用户',
      responseTime: '响应时间',
      errorRate: '错误率',
      refresh: '刷新数据',
      autoRefresh: '自动刷新',
    },
  },
  'en-US': {
    common: {
      search: 'Search',
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      submit: 'Submit',
      reset: 'Reset',
      more: 'More',
      loading: 'Loading...',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information',
      yes: 'Yes',
      no: 'No',
      all: 'All',
      export: 'Export',
      import: 'Import',
    },
    menu: {
      dashboard: 'Dashboard',
      employee: 'Employee',
      attendance: 'Attendance',
      leave: 'Leave',
      salary: 'Salary',
      performance: 'Performance',
      reports: 'Reports',
      workflow: 'Workflow',
      system: 'System Monitor',
      settings: 'Settings',
      profile: 'Profile',
    },
    dashboard: {
      title: 'Dashboard',
      totalEmployees: 'Total Employees',
      attendanceRate: 'Attendance Rate',
      leaveCount: 'On Leave',
      newEmployees: 'New Employees',
    },
    employee: {
      title: 'Employee Management',
      name: 'Name',
      gender: 'Gender',
      department: 'Department',
      position: 'Position',
      status: 'Status',
      entryDate: 'Entry Date',
      basicInfo: 'Basic Info',
      contactInfo: 'Contact Info',
      educationInfo: 'Education',
      workExperience: 'Work Experience',
    },
    reports: {
      title: 'Reports',
      employeeDistribution: 'Employee Distribution',
      attendanceStatistics: 'Attendance Statistics',
      leaveStatistics: 'Leave Statistics',
      salaryStatistics: 'Salary Statistics',
      performanceStatistics: 'Performance Statistics',
      exportExcel: 'Export Excel',
      exportPDF: 'Export PDF',
      department: 'Department',
      dateRange: 'Date Range',
    },
    workflow: {
      title: 'Workflow Management',
      templates: 'Process Templates',
      instances: 'Process Instances',
      createTemplate: 'Create Template',
      editTemplate: 'Edit Template',
      steps: 'Process Steps',
      addStep: 'Add Step',
      editStep: 'Edit Step',
      approvers: 'Approvers',
      status: 'Status',
    },
    system: {
      title: 'System Monitor',
      overview: 'System Overview',
      performance: 'Performance Monitor',
      errorLogs: 'Error Logs',
      serviceStatus: 'Service Status',
      cpuUsage: 'CPU Usage',
      memoryUsage: 'Memory Usage',
      diskUsage: 'Disk Usage',
      activeUsers: 'Active Users',
      responseTime: 'Response Time',
      errorRate: 'Error Rate',
      refresh: 'Refresh Data',
      autoRefresh: 'Auto Refresh',
    },
  },
  // 其他语言可以按需添加
};

// 创建语言上下文
export const LanguageContext = createContext({
  language: 'zh-CN',
  setLanguage: (code: string) => {},
  t: (key: string) => '',
});

// 翻译函数
export const translate = (language: string, key: string): string => {
  const keys = key.split('.');
  let translation: any = translations[language as keyof typeof translations];
  
  for (const k of keys) {
    if (!translation) return key;
    translation = translation[k as keyof typeof translation];
  }
  
  return translation || key;
};

// 语言工具函数
export const languageUtils = {
  getDefaultLanguage: (): string => {
    // 从本地存储获取语言设置，如果没有则使用浏览器语言或默认中文
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage) return savedLanguage;
    
    const browserLang = navigator.language;
    const supportedCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);
    
    if (browserLang && supportedCodes.includes(browserLang)) {
      return browserLang;
    }
    
    // 默认使用中文
    return 'zh-CN';
  },
  
  saveLanguage: (code: string): void => {
    localStorage.setItem('userLanguage', code);
  },
};