// 人力资源相关模拟数据
import { users } from './users';
import dayjs from 'dayjs';

// 考勤记录接口
export interface AttendanceRecord {
  id: number;
  userId: number;
  userName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: 'normal' | 'late' | 'early' | 'absent' | 'exception';
  remark?: string;
}

// 请假申请接口
export interface LeaveRequest {
  id: number;
  userId: number;
  userName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approveTime?: string;
  approveRemark?: string;
  createTime: string;
}

// 假期余额接口
export interface LeaveBalance {
  userId: number;
  userName: string;
  annual: number;
  sick: number;
  personal: number;
  marriage: number;
  maternity: number;
  bereavement: number;
  annualUsed: number;
  sickUsed: number;
  personalUsed: number;
  marriageUsed: number;
  maternityUsed: number;
  bereavementUsed: number;
}

// 模拟数据
const attendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    userId: 1,
    userName: '管理员',
    date: '2023-06-01',
    checkInTime: '08:55:00',
    checkOutTime: '18:05:00',
    status: 'normal',
  },
  {
    id: 2,
    userId: 1,
    userName: '管理员',
    date: '2023-06-02',
    checkInTime: '09:15:00',
    checkOutTime: '18:00:00',
    status: 'late',
    remark: '交通拥堵',
  },
  {
    id: 3,
    userId: 2,
    userName: '普通用户',
    date: '2023-06-01',
    checkInTime: '08:50:00',
    checkOutTime: '17:30:00',
    status: 'early',
    remark: '有事提前离开',
  },
  {
    id: 4,
    userId: 2,
    userName: '普通用户',
    date: '2023-06-02',
    checkInTime: '',
    checkOutTime: '',
    status: 'absent',
    remark: '请假',
  },
  {
    id: 5,
    userId: 3,
    userName: '访客',
    date: '2023-06-01',
    checkInTime: '08:45:00',
    checkOutTime: '18:15:00',
    status: 'normal',
  },
];

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    userId: 1,
    userName: '管理员',
    type: 'annual',
    startDate: '2023-06-10',
    endDate: '2023-06-12',
    days: 3,
    reason: '家庭旅行',
    status: 'approved',
    approver: '系统管理员',
    approveTime: '2023-06-05 14:30:00',
    approveRemark: '批准',
    createTime: '2023-06-01 10:15:00',
  },
  {
    id: 2,
    userId: 2,
    userName: '普通用户',
    type: 'sick',
    startDate: '2023-06-05',
    endDate: '2023-06-06',
    days: 2,
    reason: '感冒发烧',
    status: 'approved',
    approver: '管理员',
    approveTime: '2023-06-04 09:20:00',
    createTime: '2023-06-03 18:45:00',
  },
  {
    id: 3,
    userId: 3,
    userName: '访客',
    type: 'personal',
    startDate: '2023-06-15',
    endDate: '2023-06-15',
    days: 1,
    reason: '个人事务',
    status: 'pending',
    createTime: '2023-06-08 11:30:00',
  },
  {
    id: 4,
    userId: 2,
    userName: '普通用户',
    type: 'annual',
    startDate: '2023-07-01',
    endDate: '2023-07-05',
    days: 5,
    reason: '暑期休假',
    status: 'pending',
    createTime: '2023-06-10 16:20:00',
  },
  {
    id: 5,
    userId: 1,
    userName: '管理员',
    type: 'sick',
    startDate: '2023-05-20',
    endDate: '2023-05-21',
    days: 2,
    reason: '牙疼',
    status: 'rejected',
    approver: '系统管理员',
    approveTime: '2023-05-19 10:10:00',
    approveRemark: '近期工作繁忙，建议调整时间',
    createTime: '2023-05-18 14:25:00',
  },
];

const leaveBalances: LeaveBalance[] = [
  {
    userId: 1,
    userName: '管理员',
    annual: 15,
    sick: 10,
    personal: 5,
    marriage: 10,
    maternity: 90,
    bereavement: 3,
    annualUsed: 3,
    sickUsed: 2,
    personalUsed: 0,
    marriageUsed: 0,
    maternityUsed: 0,
    bereavementUsed: 0,
  },
  {
    userId: 2,
    userName: '普通用户',
    annual: 10,
    sick: 10,
    personal: 5,
    marriage: 10,
    maternity: 90,
    bereavement: 3,
    annualUsed: 5,
    sickUsed: 2,
    personalUsed: 1,
    marriageUsed: 0,
    maternityUsed: 0,
    bereavementUsed: 0,
  },
  {
    userId: 3,
    userName: '访客',
    annual: 5,
    sick: 5,
    personal: 3,
    marriage: 0,
    maternity: 0,
    bereavement: 3,
    annualUsed: 0,
    sickUsed: 0,
    personalUsed: 1,
    marriageUsed: 0,
    maternityUsed: 0,
    bereavementUsed: 0,
  },
];

// 模拟API响应接口
export interface HRResponse {
  success: boolean;
  message: string;
  data?: any;
}

// 模拟获取考勤记录
export const mockGetAttendanceRecords = (userId?: number): Promise<HRResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let records = [...attendanceRecords];
      
      if (userId) {
        records = records.filter(record => record.userId === userId);
      }
      
      resolve({
        success: true,
        message: '获取考勤记录成功',
        data: records
      });
    }, 500);
  });
};

// 模拟添加或更新考勤记录
export const mockSaveAttendanceRecord = (record: Partial<AttendanceRecord>): Promise<HRResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (record.id) {
        // 更新记录
        const index = attendanceRecords.findIndex(r => r.id === record.id);
        
        if (index !== -1) {
          attendanceRecords[index] = { ...attendanceRecords[index], ...record };
          
          resolve({
            success: true,
            message: '考勤记录更新成功',
            data: attendanceRecords[index]
          });
        } else {
          resolve({
            success: false,
            message: '考勤记录不存在'
          });
        }
      } else {
        // 添加新记录
        const newId = Math.max(...attendanceRecords.map(r => r.id)) + 1;
        const user = users.find(u => u.id === record.userId);
        
        if (!user) {
          resolve({
            success: false,
            message: '用户不存在'
          });
          return;
        }
        
        const newRecord: AttendanceRecord = {
          id: newId,
          userId: record.userId!,
          userName: user.name,
          date: record.date || dayjs().format('YYYY-MM-DD'),
          checkInTime: record.checkInTime || '',
          checkOutTime: record.checkOutTime || '',
          status: record.status || 'normal',
          remark: record.remark
        };
        
        attendanceRecords.push(newRecord);
        
        resolve({
          success: true,
          message: '考勤记录添加成功',
          data: newRecord
        });
      }
    }, 500);
  });
};

// 模拟获取请假申请
export const mockGetLeaveRequests = (userId?: number): Promise<HRResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let requests = [...leaveRequests];
      
      if (userId) {
        requests = requests.filter(request => request.userId === userId);
      }
      
      resolve({
        success: true,
        message: '获取请假申请成功',
        data: requests
      });
    }, 500);
  });
};

// 模拟添加或更新请假申请
export const mockSaveLeaveRequest = (request: Partial<LeaveRequest>): Promise<HRResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (request.id) {
        // 更新申请
        const index = leaveRequests.findIndex(r => r.id === request.id);
        
        if (index !== -1) {
          leaveRequests[index] = { ...leaveRequests[index], ...request };
          
          resolve({
            success: true,
            message: '请假申请更新成功',
            data: leaveRequests[index]
          });
        } else {
          resolve({
            success: false,
            message: '请假申请不存在'
          });
        }
      } else {
        // 添加新申请
        const newId = Math.max(...leaveRequests.map(r => r.id)) + 1;
        const user = users.find(u => u.id === request.userId);
        
        if (!user) {
          resolve({
            success: false,
            message: '用户不存在'
          });
          return;
        }
        
        const newRequest: LeaveRequest = {
          id: newId,
          userId: request.userId!,
          userName: user.name,
          type: request.type || 'annual',
          startDate: request.startDate || '',
          endDate: request.endDate || '',
          days: request.days || 0,
          reason: request.reason || '',
          status: 'pending',
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        };
        
        leaveRequests.push(newRequest);
        
        resolve({
          success: true,
          message: '请假申请提交成功',
          data: newRequest
        });
      }
    }, 500);
  });
};

// 模拟审批请假申请
export const mockApproveLeaveRequest = (id: number, status: 'approved' | 'rejected', approver: string, approveRemark?: string): Promise<HRResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = leaveRequests.findIndex(r => r.id === id);
      
      if (index !== -1) {
        leaveRequests[index] = {
          ...leaveRequests[index],
          status,
          approver,
          approveTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          approveRemark
        };
        
        // 如果批准请假，更新假期余额
        if (status === 'approved') {
          const request = leaveRequests[index];
          const balanceIndex = leaveBalances.findIndex(b => b.userId === request.userId);
          
          if (balanceIndex !== -1) {
            const balance = leaveBalances[balanceIndex];
            
            switch (request.type) {
              case 'annual':
                balance.annualUsed += request.days;
                break;
              case 'sick':
                balance.sickUsed += request.days;
                break;
              case 'personal':
                balance.personalUsed += request.days;
                break;
              case 'marriage':
                balance.marriageUsed += request.days;
                break;
              case 'maternity':
                balance.maternityUsed += request.days;
                break;
              case 'bereavement':
                balance.bereavementUsed += request.days;
                break;
            }
          }
        }
        
        resolve({
          success: true,
          message: `请假申请已${status === 'approved' ? '批准' : '拒绝'}`,
          data: leaveRequests[index]
        });
      } else {
        resolve({
          success: false,
          message: '请假申请不存在'
        });
      }
    }, 500);
  });
};

// 模拟获取假期余额
export const mockGetLeaveBalance = (userId: number): Promise<HRResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const balance = leaveBalances.find(b => b.userId === userId);
      
      if (balance) {
        resolve({
          success: true,
          message: '获取假期余额成功',
          data: balance
        });
      } else {
        resolve({
          success: false,
          message: '用户假期余额不存在'
        });
      }
    }, 500);
  });
};